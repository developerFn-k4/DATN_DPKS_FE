# Hướng dẫn chạy dự án với Docker

## Yêu cầu
- Docker Desktop đã được cài đặt trên Windows
- Docker Desktop đang chạy

## Cách sử dụng

### 1. Build và chạy container lần đầu:
```bash
docker-compose up --build
```

### 2. Chạy container (các lần sau):
```bash
docker-compose up
```

### 3. Chạy container ở chế độ background:
```bash
docker-compose up -d
```

### 4. Dừng container:
```bash
docker-compose down
```

### 5. Xem logs:
```bash
docker-compose logs -f frontend
```

### 6. Truy cập ứng dụng:
Mở trình duyệt và truy cập: http://localhost:5173

## Lệnh hữu ích khác

### Chạy lệnh npm trong container:
```bash
docker-compose exec frontend npm install <package-name>
```

### Truy cập vào container:
```bash
docker-compose exec frontend sh
```

### Rebuild lại container:
```bash
docker-compose up --build --force-recreate
```

### Xóa tất cả containers và volumes:
```bash
docker-compose down -v
```

## Lưu ý
- Code của bạn được mount vào container, nên mọi thay đổi sẽ tự động reload
- Port 5173 được map từ container ra host (Windows)
- Node modules được lưu trong container để tránh conflict với Windows
