import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: { origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000', credentials: true },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  // userId → Set of socketIds (one user can have multiple tabs)
  private readonly onlineUsers = new Map<string, Set<string>>();

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  // ── Connection lifecycle ───────────────────────────────────────────────────

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token =
        client.handshake.auth?.token ??
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify<{ sub: string }>(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      client.userId = payload.sub;

      // Track online users
      if (!this.onlineUsers.has(payload.sub)) {
        this.onlineUsers.set(payload.sub, new Set());
      }
      this.onlineUsers.get(payload.sub)!.add(client.id);

      // Join personal room so we can push events to this user
      await client.join(`user:${payload.sub}`);

      this.logger.log(`Client connected: ${client.id} (user: ${payload.sub})`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      const sockets = this.onlineUsers.get(client.userId);
      sockets?.delete(client.id);
      if (sockets?.size === 0) this.onlineUsers.delete(client.userId);
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // ── Events ─────────────────────────────────────────────────────────────────

  /**
   * Client emits: { recipientId, content, listingId? }
   * Server saves message and emits to both parties.
   */
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() dto: SendMessageDto,
  ) {
    if (!client.userId) throw new WsException('Unauthorized');

    const senderId = client.userId;
    const recipientId = dto.recipientId;

    // Determine guest/host order for the conversation
    // We rely on the upsert uniqueness, so order matters — keep guestId < hostId
    // by whichever comes first; for simplicity caller passes recipientId = hostId
    const conversation = await this.chatService.getOrCreateConversation(
      senderId,
      recipientId,
      dto.listingId,
    );

    const message = await this.chatService.saveMessage(
      conversation.id,
      senderId,
      dto.content,
    );

    const payload = { conversationId: conversation.id, message };

    // Emit to sender (confirmation) and recipient (real-time delivery)
    this.server.to(`user:${senderId}`).emit('new_message', payload);
    this.server.to(`user:${recipientId}`).emit('new_message', payload);

    return { event: 'message_sent', data: payload };
  }

  /**
   * Client emits: { conversationId }
   * Marks unread messages in that conversation as read.
   */
  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() { conversationId }: { conversationId: string },
  ) {
    if (!client.userId) throw new WsException('Unauthorized');
    await this.chatService.assertParticipant(conversationId, client.userId);
    await this.chatService.markRead(conversationId, client.userId);
    return { event: 'marked_read', data: { conversationId } };
  }
}
