# 🔒 Hệ thống Bảo mật Đơn hàng

## Tổng quan

Hệ thống đã được nâng cấp từ việc lưu trữ file JSON sang MongoDB với các biện pháp bảo mật mạnh mẽ để ngăn chặn spam và bảo vệ dữ liệu.

## 🛡️ Các biện pháp bảo mật đã triển khai

### 1. Rate Limiting (Giới hạn tần suất)

- **Giới hạn**: Tối đa 5 đơn hàng trong 30 phút cho mỗi email
- **Triển khai**: `backend/src/middlewares/rateLimitMiddleware.ts`
- **Cách hoạt động**:
  - Kiểm tra trong memory cache
  - Kiểm tra thêm trong database để đảm bảo chính xác
  - Tự động reset sau 30 phút

### 2. Validation và Sanitization

- **Triển khai**: `backend/src/middlewares/orderValidationMiddleware.ts`
- **Tính năng**:
  - Validate dữ liệu đầu vào với Joi schema
  - Sanitize dữ liệu (trim, lowercase email, etc.)
  - Kiểm tra logic nghiệp vụ (tổng tiền, số lượng sản phẩm)
  - Phát hiện đơn hàng trùng lặp trong 5 phút

### 3. Auto-cleanup cho đơn hàng pending cũ

- **Triển khai**: `backend/src/services/orderCleanupService.ts`
- **Lịch trình**:
  - Xóa đơn hàng pending sau 24h (mỗi giờ)
  - Xóa đơn hàng rejected sau 7 ngày (mỗi ngày lúc 2:00 AM)
- **Tính năng**:
  - Singleton pattern để tránh duplicate jobs
  - Logging chi tiết các đơn hàng bị xóa
  - API endpoint để test cleanup

## 📁 Cấu trúc file mới

```
backend/src/
├── middlewares/
│   ├── rateLimitMiddleware.ts      # Rate limiting
│   └── orderValidationMiddleware.ts # Validation & sanitization
├── services/
│   └── orderCleanupService.ts      # Auto cleanup service
├── controllers/
│   └── orderController.ts          # Đã cập nhật để dùng MongoDB
└── routes/
    └── orderRoute.ts               # Đã thêm middleware mới
```

## 🔄 Thay đổi chính

### Trước đây (File JSON):

```typescript
// ❌ Không an toàn
const raw = await fs.readFile(pendingFile, "utf-8");
const pendingOrders = JSON.parse(raw || "[]");
pendingOrders.push(order);
await fs.writeFile(pendingFile, JSON.stringify(pendingOrders, null, 2));
```

### Bây giờ (MongoDB + Security):

```typescript
// ✅ An toàn và bảo mật
await insertOrder(order); // Lưu trực tiếp vào MongoDB
```

## 🚀 Cách sử dụng

### 1. Khởi động server

```bash
npm run dev
```

Server sẽ tự động:

- Khởi động cleanup service
- Bắt đầu cron jobs
- Log thông tin khởi động

### 2. Test Rate Limiting

```bash
# Gửi 6 đơn hàng liên tiếp với cùng email
curl -X POST http://localhost:3000/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{"buyer":{"email":"test@example.com"}}'

# Đơn hàng thứ 6 sẽ bị từ chối với status 429
```

### 3. Test Validation

```bash
# Gửi đơn hàng với dữ liệu không hợp lệ
curl -X POST http://localhost:3000/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{"buyer":{"email":"invalid-email"}}'

# Sẽ nhận được lỗi validation
```

### 4. Test Cleanup Service

```bash
# Chạy cleanup ngay lập tức (cần admin token)
curl -X POST http://localhost:3000/api/orders/test-cleanup \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## 📊 Monitoring

### Logs được tạo ra:

```
🚀 Khởi động Order Cleanup Service...
✅ Order Cleanup Service đã được khởi động
   - Cleanup pending orders: Mỗi giờ
   - Cleanup rejected orders: Mỗi ngày lúc 2:00 AM

⏰ Chạy cleanup pending orders...
🧹 Đã xóa 3 đơn hàng pending cũ (sau 24h)
   - Order: OD-1F10242D, Email: test1@gmail.com, Created: 2025-06-12T19:40:18.568Z
```

## 🔧 Cấu hình

### Rate Limiting

```typescript
// Trong rateLimitMiddleware.ts
const windowMs = 30 * 60 * 1000; // 30 phút
const maxRequests = 5; // Tối đa 5 đơn hàng
```

### Cleanup Schedule

```typescript
// Trong orderCleanupService.ts
cron.schedule('0 * * * *', ...); // Mỗi giờ
cron.schedule('0 2 * * *', ...); // Mỗi ngày lúc 2:00 AM
```

## 🛠️ Troubleshooting

### Lỗi thường gặp:

1. **Rate limit exceeded**

   - Giải pháp: Chờ 30 phút hoặc dùng email khác

2. **Validation error**

   - Kiểm tra format email, số điện thoại
   - Đảm bảo tổng tiền khớp với sản phẩm

3. **Duplicate order**
   - Kiểm tra đơn hàng tương tự trong 5 phút gần đây

### Debug mode:

```typescript
// Thêm vào server.ts để debug
console.log("Rate limit store:", rateLimitStore);
```

## 📈 Hiệu suất

### So sánh hiệu suất:

- **File JSON**: O(n) cho mỗi thao tác đọc/ghi
- **MongoDB**: O(log n) với index, hỗ trợ concurrent access

### Memory usage:

- Rate limit cache: ~1MB cho 1000 users
- Cleanup service: Minimal overhead

## 🔐 Bảo mật

### Các lớp bảo vệ:

1. **Rate Limiting**: Ngăn spam
2. **Validation**: Ngăn dữ liệu độc hại
3. **Sanitization**: Làm sạch dữ liệu
4. **Duplicate Detection**: Ngăn trùng lặp
5. **Auto Cleanup**: Dọn dẹp dữ liệu cũ

### Best Practices:

- Luôn validate dữ liệu đầu vào
- Sử dụng HTTPS trong production
- Monitor logs thường xuyên
- Backup database định kỳ

## 📝 Changelog

### v2.0.0 (Current)

- ✅ Chuyển từ file JSON sang MongoDB
- ✅ Thêm Rate Limiting
- ✅ Thêm Validation & Sanitization
- ✅ Thêm Auto Cleanup Service
- ✅ Cải thiện error handling
- ✅ Thêm comprehensive logging

### v1.0.0 (Previous)

- ❌ Lưu trữ file JSON
- ❌ Không có rate limiting
- ❌ Không có validation
- ❌ Không có auto cleanup
