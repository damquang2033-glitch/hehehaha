# PROGRESS.md – Stayzy Project Tracker

> **Dành cho cả người và AI:** File này là nguồn sự thật duy nhất về tiến độ project.
> AI PHẢI đọc file này trước khi bắt đầu bất kỳ task nào để tránh làm lại việc đã xong
> hoặc bỏ qua việc chưa làm.
>
> Cập nhật file này mỗi khi hoàn thành hoặc bắt đầu một hạng mục.

---

## Quy ước trạng thái

| Ký hiệu | Ý nghĩa |
|---|---|
| `[x]` | Hoàn thành |
| `[ ]` | Chưa làm |
| `[~]` | Đang làm / làm một phần |
| `[!]` | Bị block / cần quyết định |

---

## Phase 1 – Foundation

### FE (Frontend – Next.js)

**Cấu trúc & Setup**
- [x] Khởi tạo Next.js App Router + TypeScript
- [x] Cài TailwindCSS + shadcn/ui
- [x] Layout chính (`fe/app/layout.tsx`)
- [x] Theme provider (dark/light mode)
- [x] Navbar + Footer

**Trang (Pages)**
- [x] Trang chủ (`fe/app/(public)/page.tsx`)
- [x] Trang danh sách phòng (`fe/app/(public)/rooms/page.tsx`)
- [x] Trang login (`fe/app/auth/login/page.tsx`)
- [x] Trang register (`fe/app/auth/register/page.tsx`)

**Components**
- [x] UI cơ bản (button, input, card, badge, avatar, select, skeleton, slider, calendar, checkbox, popover, separator, alert, label)
- [x] SearchBar
- [x] DestinationCard
- [x] RoomTypeCard
- [x] RoomFilters
- [x] AmenityIcon
- [x] TestimonialCard
- [x] NewsletterForm

**Features / Logic (chưa làm)**
- [x] `fe/features/auth/api/authApi.ts` – login, register, logout, getMe
- [x] `fe/types/auth.ts` – User, AuthResponse, ApiResponse types
- [x] `fe/lib/apiClient.ts` – axios với auto refresh token interceptor
- [x] `fe/stores/authStore.ts` – Zustand store (user, isAuthenticated, setAuth, clearAuth)
- [x] Kết nối form login/register với BE API (RHF + Zod + toast + redirect)
- [ ] `fe/features/listings/` – hooks, types, api calls cho listings
- [x] TanStack Query setup + QueryClientProvider (`fe/components/providers.tsx`)
- [x] Protected routes (`fe/app/(protected)/layout.tsx` – redirect nếu chưa đăng nhập)
- [x] User profile page (`/profile` – TanStack Query + Avatar + Badge + Logout)
- [x] `fe/features/auth/hooks/useAuth.ts` – logout hook

---

### BE (Backend – NestJS)

> Thư mục `be/` hiện chưa tồn tại. Toàn bộ phần này cần tạo mới.

**Setup & Config**
- [x] Khởi tạo NestJS project (`be/`)
- [x] Cài dependencies: `@nestjs/jwt`, `bcrypt`, `class-validator`, `class-transformer`, `@nestjs/config`, `prisma@5`
- [x] `be/src/config/env.validation.ts` – env validation với class-validator
- [x] `be/src/main.ts` – bootstrap, global pipes, CORS, prefix `/api/v1`
- [x] Global `ResponseTransformInterceptor` – format `{ statusCode, message, data }`
- [x] Global `HttpExceptionFilter` – bắt lỗi nhất quán

**Prisma & Database**
- [x] `be/prisma/schema.prisma` – models: User (id, email, passwordHash, name, avatar, role, refreshToken)
- [x] Kết nối PostgreSQL local Docker (`localhost:5432/stayzy`)
- [x] Chạy migration lần đầu (`20260416_init`)
- [x] `PrismaService` injectable (Prisma 5 + `@prisma/client`)

**Module: Auth**
- [x] `be/src/modules/auth/auth.module.ts`
- [x] `be/src/modules/auth/auth.controller.ts` – POST register, login, refresh, logout
- [x] `be/src/modules/auth/auth.service.ts` – bcrypt hash, JWT sign/verify, refresh token rotation
- [x] `be/src/modules/auth/dto/` – RegisterDto, LoginDto
- [x] `JwtAuthGuard` – validate access token
- [x] `JwtRefreshGuard` – validate refresh token

**Module: Users**
- [x] `be/src/modules/users/users.module.ts`
- [x] `be/src/modules/users/users.controller.ts` – GET /api/v1/users/me
- [x] `be/src/modules/users/users.service.ts`
- [x] `@CurrentUser()` decorator
- [x] `JwtAuthGuard`

**Module: Listings (Phase 1 cơ bản)**
- [ ] Prisma model `Listing` (id, title, description, price, location, images, hostId)
- [ ] `be/src/modules/listings/` – GET /api/v1/listings, GET /api/v1/listings/:id
- [ ] Pagination: `?page=1&limit=10`

---

### Infra

**Docker**
- [ ] `infra/docker/Dockerfile.be` – multi-stage build cho NestJS
- [ ] `infra/docker/Dockerfile.fe` – multi-stage build cho Next.js
- [x] `infra/docker/docker-compose.yml` – postgres + pgadmin đang chạy tại localhost:5432 / localhost:5050
- [x] `.env.example` ở root (template cho cả FE + BE)

**CI/CD**
- [ ] `.github/workflows/fe-deploy.yml` – build + deploy lên Vercel
- [ ] `.github/workflows/be-deploy.yml` – build Docker image + push ECR + deploy ECS

**Deploy**
- [ ] Deploy FE lên Vercel
- [ ] Deploy BE lên AWS (ECS Fargate hoặc EC2 + Docker)
- [ ] PostgreSQL hosted (Supabase / Neon / AWS RDS)
- [ ] Sentry tích hợp FE
- [ ] Sentry tích hợp BE

---

### Examples & PRPs

- [ ] `examples/fe/AuthForm.tsx` – React Hook Form + Zod
- [ ] `examples/fe/useListings.ts` – TanStack Query hook
- [ ] `examples/be/auth.module.ts` – NestJS module chuẩn
- [ ] `examples/be/listings.service.ts` – Service với Prisma
- [ ] `examples/infra/Dockerfile.be`
- [ ] `examples/infra/docker-compose.yml`

---

## Phase 2 – Core Features (CHƯA BẮT ĐẦU – chờ Phase 1 xong)

> Không lên kế hoạch chi tiết cho Phase 2 khi Phase 1 chưa hoàn thành.

- [ ] Booking flow (tạo booking, check availability, lịch đặt phòng)
- [ ] Host dashboard (đăng listing, quản lý booking)
- [ ] Thanh toán (Stripe hoặc VNPay)
- [ ] Tìm kiếm nâng cao (filter theo giá, tiện nghi, địa điểm)
- [ ] Reviews & ratings
- [ ] Notifications (email / in-app)
- [ ] Admin dashboard

---

## Quyết định kiến trúc đã chốt

| Vấn đề | Quyết định | Lý do |
|---|---|---|
| FE folder structure | Giữ `fe/app/`, `fe/components/` (không dùng `fe/src/`) | Code đã có, không muốn restructure |
| Database | PostgreSQL + Prisma | Đã ghi trong CLAUDE.md |
| Auth tokens | Access token 15m + Refresh token 7d | Đã ghi trong CLAUDE.md |
| API prefix | `/api/v1/` | Đã ghi trong CLAUDE.md |

---

## Cập nhật gần nhất

| Ngày | Người | Nội dung |
|---|---|---|
| 2026-04-16 | AI + User | Khảo sát project, tạo file PROGRESS.md, chốt giữ FE structure hiện tại |
| 2026-04-16 | AI | Bước 1 FE setup: install deps (RHF, zod, axios), QueryClientProvider, .env.example, fix Next.js CVE |
| 2026-04-16 | AI | Bước 2 BE: Docker Compose (postgres+pgadmin), NestJS, Prisma 5, Auth module (PassportStrategy), Users module – tested OK |
| 2026-04-16 | AI | Bước 3 FE↔BE: apiClient (axios+interceptor), authStore (Zustand), form login/register wire với RHF+Zod+API |
