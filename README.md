# Vision Of Chosen FE - Nền tảng Phân Tích Drift Terraform với AI

Nền tảng phát hiện, phân tích drift hạ tầng Terraform tích hợp AI, kết nối thời gian thực với AWS, giao diện hiện đại, báo cáo trực quan và hỗ trợ vận hành DevOps.

## 🚀 Tính năng nổi bật

### 🔍 Phát hiện Drift & Phân tích AI

- **Giám sát liên tục**: Theo dõi trạng thái hạ tầng Terraform, phát hiện drift (sai lệch giữa thực tế và code).
- **Phân tích AI**: Đánh giá rủi ro, giải thích nguyên nhân drift, gợi ý khắc phục tự động.
- **Hỗ trợ nhiều định dạng**: Nhận file `.tfplan`, `.tfstate`, `.json`, `.tf`.
- **Phân loại rủi ro**: Tự động phân loại drift (Thấp, Trung bình, Cao).

### 🤖 Trợ lý AI & Tương tác

- **Chat AI tự nhiên**: Đặt câu hỏi về hạ tầng, nhận giải thích, gợi ý tối ưu, bảo mật, chi phí.
- **Upload file & dán nội dung**: Phân tích nhanh file Terraform hoặc dán nội dung trực tiếp.
- **Lưu lịch sử chat**: Xem lại, tìm kiếm, xuất lịch sử hội thoại.

### 📊 Báo cáo & Phân tích

- **Báo cáo scan**: Xem chi tiết từng lần quét, lịch sử drift, thống kê rủi ro, cảnh báo.
- **Biểu đồ trực quan**: Phân phối tài nguyên, xu hướng drift, trạng thái tuân thủ, chi phí.
- **Theo dõi log AWS**: Xem log real-time từ Terraform & AWS (EC2, S3, RDS, IAM, CloudFormation...)

### 🔧 Quản lý & Cấu hình

- **Quản lý tài khoản**: Đăng ký, đăng nhập, bảo mật.
- **Kết nối AWS**: Cấu hình, kiểm tra kết nối, lưu thông tin IAM an toàn.
- **Cài đặt thông báo**: Nhận cảnh báo qua email khi phát hiện drift, sự kiện quan trọng.

## 🛠️ Công nghệ sử dụng

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI**: shadcn/ui, Tailwind CSS, Radix UI, Lucide React
- **Biểu đồ**: Recharts
- **Quản lý trạng thái**: React Hooks, Local Storage
- **Theme**: Hỗ trợ sáng/tối, CSS Variables

## 📦 Cài đặt & Khởi động

### Yêu cầu

- Node.js 18+
- npm hoặc pnpm
- Tài khoản AWS (nếu muốn phân tích hạ tầng thực tế)

### Hướng dẫn nhanh

```bash
# Clone dự án
https://github.com/anhtnpro12/VisionOfChosen_FE.git
cd VisionOfChosen_FE

# Cài đặt dependencies
npm install

# Chạy server phát triển
npm run dev
```

### Cài UI shadcn (khuyên dùng)

```bash
npx shadcn@latest init
npx shadcn@latest add button card input textarea tabs sidebar
```

## 🔧 Cấu hình môi trường

Tạo file `.env.local`:

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_DEFAULT_REGION=us-east-1
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Phân quyền AWS IAM tối thiểu

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:Describe*",
        "s3:GetBucket*",
        "s3:ListBucket*",
        "rds:Describe*",
        "iam:Get*",
        "iam:List*",
        "cloudformation:Describe*",
        "cloudformation:List*"
      ],
      "Resource": "*"
    }
  ]
}
```

## 🚦 Hướng dẫn sử dụng

### 1. Đăng nhập/Đăng ký

- Truy cập `/auth/login` hoặc `/auth/register` để tạo tài khoản.
- Sau khi đăng nhập, chuyển đến `/dashboard`.

### 2. Kết nối AWS

- Vào **Settings → AWS Connection**.
- Nhập thông tin IAM, kiểm tra kết nối, lưu cấu hình.

### 3. Phân tích hạ tầng

- **Upload file**: Kéo thả hoặc chọn file Terraform.
- **Dán nội dung**: Chuyển sang tab "Paste Text" để dán nội dung.
- **Chat với AI**: Đặt câu hỏi về drift, bảo mật, tối ưu chi phí...
- **Xem báo cáo**: Vào **Scan Reports** để xem lịch sử, chi tiết từng lần quét.
- **Theo dõi log**: Xem log AWS, Terraform real-time trên dashboard.

### 4. Thông báo

- Vào **Settings → Email Notifications** để thêm email nhận cảnh báo.
- Cấu hình loại thông báo, bật/tắt tùy ý.

## 📁 Cấu trúc dự án

```
VisionOfChosen_FE/
├── app/
│   ├── auth/ (login, register)
│   ├── dashboard/ (reports, scan/[id], settings)
│   ├── globals.css, layout.tsx
├── components/
│   ├── ui/ (button, card, table...)
│   ├── ai-chat-interface.tsx, app-sidebar.tsx, drift-card.tsx, scan-history-table.tsx, upload-dialog.tsx...
├── hooks/
├── lib/
├── public/
```

## 🎨 UI & Design System

- **Sidebar**: Menu chính, điều hướng nhanh.
- **AI Chat**: Giao diện chat, upload file, hỏi đáp AI.
- **Drift Card**: Thẻ phân tích drift, giải thích AI, gợi ý khắc phục.
- **Scan History Table**: Bảng lịch sử quét, lọc, xem chi tiết.
- **Notification Center**: Trung tâm thông báo, cảnh báo realtime.
- **Theme**: Xanh lá chủ đạo, hỗ trợ dark/light mode, font Inter.
- **Biểu đồ**: Recharts, trực quan hóa tài nguyên, drift, compliance, chi phí.

## 🔌 Tích hợp & API

- **AWS**: EC2, S3, RDS, IAM, CloudFormation...
- **Terraform**: Phân tích file `.tfstate`, `.tfplan`, `.tf`, module.
- **Email**: Gửi cảnh báo, báo cáo định kỳ.

## 🔒 Bảo mật

- **Mã hóa thông tin AWS**: Lưu trữ an toàn, không ghi log secret.
- **Truyền tải HTTPS**
- **Kiểm soát truy cập**: Phân quyền, audit log.
- **Khuyến nghị**: Sử dụng IAM role, phân quyền tối thiểu, không commit secret.

## 🚀 Triển khai

- **Vercel**: `npm i -g vercel && vercel`
- **Docker**: Có sẵn Dockerfile, build & run dễ dàng.
- **Manual**: `npm run build && npm start`

## 🥯 Kiểm thử

- `npm test` (unit), `npm run test:coverage`, `npm run test:e2e`

## 🤝 Đóng góp

- Fork, tạo branch, commit, mở Pull Request.
- Viết test, tuân thủ style TypeScript, shadcn/ui.

## 📝 Giấy phép

MIT License.

## 📊 Liên hệ & Hỗ trợ

- **GitHub Issues**: Báo lỗi, đề xuất tính năng.
- **Email**: enterprise@terraform-analyzer.com
- **Website**: https://terraform-analyzer.com

---

_Dự án dành cho DevOps, Cloud Engineer, Security Engineer muốn kiểm soát drift, tối ưu vận hành hạ tầng IaC hiện đại._
