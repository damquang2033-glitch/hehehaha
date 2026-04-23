import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find or create a conversation between guest and host.
   * The @@unique([guestId, hostId]) constraint ensures one conversation per pair.
   */
  async getOrCreateConversation(
    guestId: string,
    hostId: string,
    listingId?: string,
  ) {
    return this.prisma.conversation.upsert({
      where: { guestId_hostId: { guestId, hostId } },
      create: { guestId, hostId, listingId },
      update: {},
      include: {
        guest: { select: { id: true, name: true, avatar: true } },
        host: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  async saveMessage(
    conversationId: string,
    senderId: string,
    content: string,
  ) {
    return this.prisma.message.create({
      data: { conversationId, senderId, content },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  async getMessages(conversationId: string, page = 1, limit = 30) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.message.findMany({
        where: { conversationId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          sender: { select: { id: true, name: true, avatar: true } },
        },
      }),
      this.prisma.message.count({ where: { conversationId } }),
    ]);
    return { data: data.reverse(), total, page, limit };
  }

  async markRead(conversationId: string, userId: string) {
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        readAt: null,
        sender: { id: { not: userId } }, // mark other party's messages as read
      },
      data: { readAt: new Date() },
    });
  }

  async getUserConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        OR: [{ guestId: userId }, { hostId: userId }],
      },
      include: {
        guest: { select: { id: true, name: true, avatar: true } },
        host: { select: { id: true, name: true, avatar: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // last message preview
          include: { sender: { select: { id: true, name: true } } },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async assertParticipant(conversationId: string, userId: string) {
    const conv = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { guestId: true, hostId: true },
    });
    if (!conv) throw new NotFoundException('Conversation not found');
    if (conv.guestId !== userId && conv.hostId !== userId) {
      throw new NotFoundException('Conversation not found');
    }
    return conv;
  }
}
