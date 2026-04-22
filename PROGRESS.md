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
- [x] `fe/features/listings/` – hooks, types, api calls cho listings
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
- [x] Prisma model `Listing` (id, title, description, price, location, images, hostId)
- [x] `be/src/modules/listing/` – GET /api/v1/listings, GET /api/v1/listings/:id
- [x] Pagination: `?page=1&limit=10`

---

### Infra

**Docker**
- [x] `infra/docker/Dockerfile.be` – multi-stage build cho NestJS
- [x] `infra/docker/Dockerfile.fe` – multi-stage build cho Next.js
- [x] `infra/docker/docker-compose.yml` – postgres + pgadmin đang chạy tại localhost:5432 / localhost:5050
- [x] `.env.example` ở root (template cho cả FE + BE)

**CI/CD + Deploy** _(dời sang Phase 2 – làm sau khi có CRUD hoàn chỉnh)_
- [ ] `.github/workflows/fe-deploy.yml`
- [ ] `.github/workflows/be-deploy.yml`
- [ ] Deploy FE lên Vercel
- [ ] Deploy BE lên AWS (ECS Fargate hoặc EC2 + Docker)
- [ ] PostgreSQL hosted (Supabase / Neon / AWS RDS)
- [ ] Sentry tích hợp FE + BE

---

### CRUD Cơ bản (ưu tiên tiếp theo)

**BE – Listings CRUD (Host)**
- [x] Prisma model `Listing` bổ sung: `maxGuests`, `bedrooms`, `bathrooms`
- [x] `POST /api/v1/listings` – tạo listing (yêu cầu role HOST)
- [x] `PATCH /api/v1/listings/:id` – cập nhật listing (chỉ host sở hữu)
- [x] `DELETE /api/v1/listings/:id` – xóa listing (chỉ host sở hữu)
- [x] `RolesGuard` + `@Roles()` decorator + `CreateListingDto` đầy đủ validation

**BE – User Profile CRUD**
- [x] `PATCH /api/v1/users/me` – cập nhật name, avatar
- [x] `PATCH /api/v1/users/me/password` – đổi mật khẩu (verify old password)

**FE – Trang chi tiết listing**
- [x] `fe/app/(public)/listings/[id]/page.tsx` – hiển thị chi tiết 1 listing
- [x] `fe/components/features/listing-card.tsx` – card dùng cho danh sách (map với Listing type)
- [x] Kết nối trang `/rooms` hiện có với API thật (thay mock data)

**FE – Host: Tạo / sửa listing**
- [x] `fe/app/(protected)/host/listings/new/page.tsx` – form tạo listing
- [x] `fe/app/(protected)/host/listings/[id]/edit/page.tsx` – form sửa + xóa listing
- [x] `fe/features/listings/hooks/useListingMutations.ts` – useCreateListing, useUpdateListing, useDeleteListing
- [x] `fe/features/listings/components/ListingForm.tsx` – form dùng chung (RHF + Zod)
- [x] `fe/app/(protected)/host/layout.tsx` – guard chỉ cho HOST/ADMIN
- [x] Nút "Chỉnh sửa" trên trang detail (chỉ hiện với chủ sở hữu)
- [x] Multi-step listing flow (8 bước): StepAboutPlace → StepStructure → StepLocation → StepGuests → StepAmenities → StepPhotos → StepDescription → StepPrice
- [x] `fe/stores/useListingStore.ts` – Zustand store cho multi-step form
- [x] `fe/app/(protected)/host/listings/new/layout.tsx` – progress header với step indicator
- [x] `fe/features/listings/api/uploadApi.ts` – getPresignedUrls + uploadFileToS3
- [x] StepPhotos: drag-drop + file upload thật lên S3 (presigned URL flow)

---

## Phase 2 – Booking + Deploy

### Booking Flow

**BE**
- [x] Prisma model `Booking` (id, listingId, guestId, checkIn, checkOut, totalPrice, guestCount, status, createdAt)
- [x] `BookingStatus` enum: PENDING, CONFIRMED, CANCELLED, COMPLETED
- [x] `POST /api/v1/bookings` – tạo booking (check availability, tính totalPrice)
- [x] `GET /api/v1/bookings/me` – danh sách booking của guest (pagination)
- [x] `GET /api/v1/bookings/host` – danh sách booking trên listings của host
- [x] `PATCH /api/v1/bookings/:id/status` – host confirm/cancel; guest cancel

**FE**
- [x] `fe/types/booking.ts` – Booking, BookingStatus types
- [x] `fe/features/bookings/api/bookingsApi.ts` – create, getMyBookings, getHostBookings, updateStatus
- [x] `fe/features/bookings/hooks/useBookings.ts` – useMyBookings, useCreateBooking, useUpdateBookingStatus
- [x] `fe/features/bookings/components/BookingCard.tsx` – form đặt phòng thật (ngày + số khách + tính tiền)
- [x] Thay booking stub trên `/listings/[id]` bằng BookingCard
- [x] `fe/app/(protected)/bookings/page.tsx` – trang "Đặt phòng của tôi" + hủy
- [x] `fe/app/(protected)/host/bookings/page.tsx` – host xác nhận/từ chối booking

### Become Host
- [x] `PATCH /api/v1/users/me/become-host` – nâng role GUEST → HOST
- [x] FE navbar: role-based menu (GUEST thấy "Trở thành Host", HOST thấy quản lý)

### Host Dashboard
- [x] `fe/app/(protected)/host/page.tsx` – dashboard tổng quan (số listing, tổng booking, booking pending)

### Tìm kiếm nâng cao
- [x] BE: mở rộng `ListingQueryDto` thêm `minPrice`, `maxPrice`, `minGuests`, `hostId`
- [x] FE: rooms/page.tsx gửi filter lên API (thay vì lọc client-side)

### Reviews & Ratings
- [ ] Prisma model `Review` (id, bookingId, guestId, listingId, rating, comment)
- [ ] BE + FE sau khi booking flow hoàn thành

### Thanh toán, Notifications, Admin
- [ ] Stripe / VNPay integration
- [ ] Email notifications
- [ ] Admin dashboard

### CI/CD + Deploy (dời từ Phase 1)
- [ ] `.github/workflows/fe-deploy.yml`
- [ ] `.github/workflows/be-deploy.yml`
- [ ] Deploy FE lên Vercel
- [ ] Deploy BE lên AWS
- [ ] PostgreSQL hosted (Supabase / Neon / AWS RDS)
- [ ] Sentry FE + BE

---

## Quyết định kiến trúc đã chốt

| Vấn đề | Quyết định | Lý do |
|---|---|---|
| FE folder structure | Giữ `fe/app/`, `fe/components/` (không dùng `fe/src/`) | Code đã có, không muốn restructure |
| Database | PostgreSQL + Prisma | Đã ghi trong CLAUDE.md |
| Auth tokens | Access token 15m + Refresh token 7d | Đã ghi trong CLAUDE.md |
| API prefix | `/api/v1/` | Đã ghi trong CLAUDE.md |
| CI/CD + Deploy | Dời sang sau CRUD | Ưu tiên có tính năng hoàn chỉnh trước khi deploy |

---

## Cập nhật gần nhất

| Ngày | Người | Nội dung |
|---|---|---|
| 2026-04-16 | AI + User | Khảo sát project, tạo file PROGRESS.md, chốt giữ FE structure hiện tại |
| 2026-04-16 | AI | Bước 1 FE setup: install deps (RHF, zod, axios), QueryClientProvider, .env.example, fix Next.js CVE |
| 2026-04-16 | AI | Bước 2 BE: Docker Compose (postgres+pgadmin), NestJS, Prisma 5, Auth module (PassportStrategy), Users module – tested OK |
| 2026-04-16 | AI | Bước 3 FE↔BE: apiClient (axios+interceptor), authStore (Zustand), form login/register wire với RHF+Zod+API |
| 2026-04-16 | AI | Fix gitignore: root .gitignore bị UTF-16 (patterns không hoạt động) → rewrite UTF-8; bỏ track infra/docker/.env và be/dist/ |
| 2026-04-17 | AI | BE Listings: implement ListingService+Controller+QueryDto (GET /listings, GET /listings/:id, pagination) – thay thế scaffold NestJS |
| 2026-04-17 | AI | FE Listings: tạo fe/types/listing.ts, fe/features/listings/api + hooks (useListings, useListing) |
| 2026-04-17 | AI | Infra: Dockerfile.be (multi-stage NestJS) + Dockerfile.fe (multi-stage Next.js standalone) + thêm output:standalone vào next.config.ts |
| 2026-04-17 | User | Quyết định: dời CI/CD + Deploy sang Phase 2, ưu tiên CRUD listings + user profile trước |
| 2026-04-17 | AI | BE CRUD Listings: RolesGuard, @Roles decorator, CreateListingDto, POST/PATCH/DELETE /listings + migrate schema (maxGuests, bedrooms, bathrooms) |
| 2026-04-17 | AI | FE Listings end-to-end: ListingCard component, /rooms kết nối API thật (loading/error/empty state), /listings/[id] trang chi tiết (gallery + stats + host + booking stub) |
| 2026-04-17 | AI | FE Host CRUD: ListingForm (RHF+Zod), /host/listings/new, /host/listings/[id]/edit (sửa+xóa), host layout guard, nút chỉnh sửa cho owner |
| 2026-04-17 | AI | BE + FE User Profile: PATCH /users/me (name, avatar) + PATCH /users/me/password (verify old pw) + profile page update (edit form + đổi mật khẩu) |
| 2026-04-17 | AI | BE + FE Booking flow: Prisma model Booking, BookingStatus enum, POST/GET/PATCH endpoints + FE booking card, my bookings page, host bookings page |
| 2026-04-17 | AI | BE + FE Become-host: PATCH /users/me/become-host + navbar role-based menu (GUEST/HOST/ADMIN items) |
| 2026-04-20 | AI | Host Dashboard FE (fe/app/(protected)/host/page.tsx) – stats: listings, bookings, pending count + recent bookings |
| 2026-04-20 | AI | Advanced Search: BE ListingQueryDto mở rộng (minPrice, maxPrice, minGuests, hostId) + FE rooms/page.tsx gửi filter lên API |
| 2026-04-22 | AI | S3 Upload integration: BE upload module (presigned URLs), FE uploadApi.ts, StepPhotos viết lại với drag-drop + real S3 upload |
| 2026-04-22 | AI | Prisma schema mở rộng Listing: beds, amenities, rentalType, propertyType, structure + CreateListingDto + listingsApi type update |
