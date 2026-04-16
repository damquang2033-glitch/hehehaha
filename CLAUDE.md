# CLAUDE.md - Context Engineering Rules cho Stayzy Project (Fullstack + Infra)

> **Lưu ý cho AI:** Đọc toàn bộ file này trước khi lập bất kỳ kế hoạch nào.
> Không được tự ý thay đổi tech stack, folder structure, hoặc coding convention.

---

## 1. Project Overview

- **Tên project:** Stayzy – Nền tảng đặt chỗ lưu trú (homestay, khách sạn, chỗ ở ngắn hạn).
- **Mục tiêu:** Xây dựng fullstack hoàn chỉnh + hạ tầng chuyên nghiệp: Frontend đẹp, Backend mạnh, Infra ổn định, dễ scale và deploy.
- **Các tính năng chính (theo thứ tự ưu tiên):**
  1. Auth (đăng ký, đăng nhập, JWT refresh token)
  2. Trang chủ + Tìm kiếm chỗ ở
  3. Chi tiết phòng / listing
  4. Booking flow
  5. User profile
  6. Admin dashboard _(Phase sau – chưa làm ngay) ....

---

## 2. Current Phase

**Phase 1 – Foundation (đang thực hiện)**

| Hạng mục | Trạng thái |
|---|---|
| Frontend cơ bản (Next.js, layout, routing) | ✅ Đã có |
| Backend NestJS | 🔧 Đang xây dựng |
| Auth (JWT + bcrypt) | 🔧 Đang xây dựng |
| Docker Compose local | ⬜ Chưa làm |
| CI/CD GitHub Actions | ⬜ Chưa làm |
| Deploy FE lên Vercel | ⬜ Chưa làm |
| Deploy BE lên AWS | ⬜ Chưa làm |

> AI phải bám sát bảng này. Không lên kế hoạch cho Phase 2 (Admin, Analytics…)
> khi Phase 1 chưa hoàn thành.

---

## 3. Tech Stack (BẮT BUỘC – không được tự ý thay thế)

### Frontend (`fe/`)
- **Language:** TypeScript (strict mode – không dùng `any`)
- **Framework:** Next.js (App Router)
- **Styling:** TailwindCSS + shadcn/ui
- **State management:** Zustand (nếu cần global state)
- **Data fetching:** TanStack Query (React Query)
- **Form:** React Hook Form + Zod validation
- **Folder chính:** `fe/src/`

### Backend (`be/`)
- **Language:** TypeScript (strict mode)
- **Framework:** NestJS
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** JWT (access token 15m + refresh token 7d) + bcrypt
- **API style:** RESTful, prefix `/api/v1/`
- **Validation:** class-validator + class-transformer (NestJS built-in pipe)
- **Folder chính:** `be/src/`

### Infrastructure
- **Containerization:** Docker + Docker Compose (local dev và staging)
- **CI/CD:** GitHub Actions
- **Frontend deploy:** Vercel
- **Backend deploy:** AWS (ECS Fargate hoặc EC2 + Docker)
- **Database hosted:** PostgreSQL – chọn một trong: Supabase / Neon / AWS RDS
- **Environment:** `.env` + `.env.example` (không bao giờ commit `.env` thật)
- **Monitoring:** Sentry (FE + BE) – tích hợp từ Phase 1

---

## 4. Folder Structure (giữ nguyên – không được tự ý thêm thư mục gốc)

```
stayzy/
├── fe/                          # Frontend (Next.js)
│   └── src/
│       ├── app/                 # App Router pages
│       ├── components/          # UI components (PascalCase.tsx)
│       │   ├── ui/              # shadcn/ui components
│       │   └── common/          # Shared components
│       ├── features/            # Feature-based modules (auth, listings, booking)
│       ├── hooks/               # Custom hooks
│       ├── lib/                 # Utilities, API client, helpers
│       ├── stores/              # Zustand stores
│       └── types/               # TypeScript types/interfaces
│
├── be/                          # Backend (NestJS)
│   └── src/
│       ├── modules/             # Feature modules
│       │   ├── auth/
│       │   ├── users/
│       │   ├── listings/
│       │   └── bookings/
│       ├── common/              # Guards, decorators, filters, interceptors
│       ├── config/              # App config, env validation
│       └── prisma/              # Prisma schema + migrations
│
├── infra/                       # Infrastructure
│   ├── docker/
│   │   ├── Dockerfile.fe
│   │   ├── Dockerfile.be
│   │   └── docker-compose.yml
│   └── aws/                     # AWS config (ECS task definition, etc.)
│
├── .github/
│   └── workflows/               # CI/CD pipelines
│       ├── fe-deploy.yml
│       └── be-deploy.yml
│
├── PRPs/                        # AI-generated plans (1 file per feature)
├── examples/                    # Code mẫu để AI tham khảo
└── CLAUDE.md                    # File này
```

---

## 5. Coding Style & Conventions

### Chung (FE + BE)
- TypeScript strict mode, không dùng `any` – dùng `unknown` nếu cần.
- Không để `console.log` ở production code – dùng logger (NestJS Logger / Sentry).
- Comment ngắn gọn, chỉ comment khi logic không tự giải thích được.
- Tên biến/hàm bằng tiếng Anh, rõ nghĩa.

### Frontend
- Component: `PascalCase.tsx`
- Hook: `useCamelCase.ts`
- Utility: `camelCase.ts`
- Tailwind: mobile-first, không inline style, không CSS module (trừ trường hợp đặc biệt).
- Mỗi feature có folder riêng trong `features/` với cấu trúc: `components/`, `hooks/`, `types/`, `api/`.

### Backend
- Module structure: `*.module.ts` / `*.controller.ts` / `*.service.ts` / `*.repository.ts`
- API response format thống nhất (BẮT BUỘC):
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": { }
  }
  ```
- Error response dùng NestJS `HttpException`, không throw raw `Error`.
- Validation: dùng `@IsString()`, `@IsEmail()`, v.v. qua DTO + `ValidationPipe`.
- Không để business logic trong Controller – chỉ để trong Service.

### Infra
- Dockerfile phải dùng **multi-stage build**.
- `docker-compose.yml` phải có comment giải thích từng service.
- Mọi secret đều qua biến môi trường, không hardcode.

---

## 6. API Convention

- Base URL: `/api/v1/`
- Naming: RESTful, dùng danh từ số nhiều (`/listings`, `/users`, `/bookings`)
- Auth header: `Authorization: Bearer <access_token>`
- Pagination: `?page=1&limit=10` → trả về `{ data, total, page, limit }`
- Ví dụ endpoints Phase 1:

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/v1/auth/register` | Đăng ký |
| POST | `/api/v1/auth/login` | Đăng nhập |
| POST | `/api/v1/auth/refresh` | Refresh token |
| GET | `/api/v1/listings` | Danh sách listings |
| GET | `/api/v1/listings/:id` | Chi tiết listing |
| GET | `/api/v1/users/me` | Profile người dùng |

---

## 7. Git & Branch Convention

- `main` – production-ready, chỉ merge qua PR
- `develop` – integration branch
- Feature branches: `feat/<tên-feature>` (vd: `feat/auth-module`)
- Fix branches: `fix/<tên-lỗi>` (vd: `fix/login-token-expiry`)
- Chore: `chore/<tên-task>` (vd: `chore/setup-docker`)
- Commit message: `feat: add login API` / `fix: correct token expiry` / `chore: add Dockerfile`

---

## 8. Quy tắc lập kế hoạch (PRP)

Mỗi khi AI lập kế hoạch cho một feature, file PRP trong `PRPs/` phải liệt kê rõ:

1. **Mục tiêu** – Feature làm gì, thuộc Phase nào.
2. **Files cần tạo/sửa:**
   - FE: danh sách file trong `fe/src/`
   - BE: danh sách file trong `be/src/`
   - Infra: có cần cập nhật Docker / GitHub Actions không?
3. **API mới** (nếu có): method, endpoint, request body, response format.
4. **Schema/Model thay đổi** (nếu có): Prisma migration cần chạy không?
5. **Checklist** – Danh sách bước thực hiện theo thứ tự.

> AI phải luôn xem xét cả 3 lớp FE + BE + Infra khi lập kế hoạch,
> kể cả khi user chỉ hỏi về một phần.

---

## 9. Examples

Thư mục `examples/` chứa code mẫu chuẩn để AI tham khảo trước khi sinh code.
AI phải đọc file liên quan trong `examples/` trước khi viết code mới.

| File | Mô tả |
|---|---|
| `examples/fe/AuthForm.tsx` | Mẫu form với React Hook Form + Zod |
| `examples/fe/useListings.ts` | Mẫu custom hook với TanStack Query |
| `examples/be/auth.module.ts` | Mẫu NestJS module chuẩn |
| `examples/be/listings.service.ts` | Mẫu service với Prisma |
| `examples/infra/Dockerfile.be` | Mẫu multi-stage Dockerfile cho BE |
| `examples/infra/docker-compose.yml` | Mẫu Compose cho local dev |

> Nếu `examples/` chưa có file nào, AI phải nhắc user tạo ít nhất
> 1 file mẫu FE và 1 file mẫu BE trước khi bắt đầu code hàng loạt.