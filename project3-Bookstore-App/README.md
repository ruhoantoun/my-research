# HUST Book Store

## Giới thiệu

- **HUST Book Store** là ứng dụng desktop quản lý nhà sách, phát triển bằng JavaFX cho giao diện người dùng và MySQL cho lưu trữ dữ liệu.
- Ứng dụng hỗ trợ các tính năng: đăng nhập người dùng, quản lý kho sách, xử lý đơn hàng, thống kê doanh số.
- Áp dụng nguyên lý lập trình hướng đối tượng (OOP) và thiết kế hệ thống theo mô hình MVC (Model – View – Controller).

## Tính năng nổi bật

- **Đăng nhập**: Quản lý phân quyền người dùng (quản trị viên, khách hàng).
- **Quản lý kho**: Thêm, sửa, xóa, tìm kiếm sách, văn phòng phẩm, đồ chơi.
- **Xử lý đơn hàng**: Tạo đơn, quản lý giỏ hàng, xuất hóa đơn.
- **Thống kê**: Xem báo cáo doanh số, lịch sử bán hàng.
- **Giao diện trực quan**: Sử dụng JavaFX với các màn hình FXML tách biệt, dễ mở rộng.

## Kiến trúc dự án

- `src/model/`: Định nghĩa các thực thể dữ liệu như Book, Customer, Order, Employee, Product, v.v.
- `src/controller/`: Xử lý logic nghiệp vụ, điều phối giữa view và model (ví dụ: Admin_Menu_Controller, BookController, Login_12_Controller).
- `src/view/fxml/`: Các file FXML định nghĩa giao diện từng màn hình (Admin_Menu, Cus_Menu, Login, Book_Information, v.v.).
- `src/dao/`: Tầng truy xuất dữ liệu (Data Access Object), kết nối và thao tác với MySQL (BookDAO, CustomerDAO, DBConnection, ...).
- `src/application/Main.java`: Điểm khởi động ứng dụng.

## Hướng dẫn cài đặt & chạy ứng dụng

### 1. Yêu cầu hệ thống

- Java JDK 8 trở lên
- MySQL Server
- Maven hoặc IDE hỗ trợ JavaFX (IntelliJ IDEA, Eclipse, ...)

### 2. Cài đặt Database

- Tạo database mới tên `hustbookstore` trên MySQL.
- Import cấu trúc bảng và dữ liệu mẫu từ file [`src/dao/DatabaseForEveryone.txt`](src/dao/DatabaseForEveryone.txt):

```sql
-- Mở MySQL CLI hoặc công cụ quản lý, chạy:
source /path/to/DatabaseForEveryone.txt
```

- Đảm bảo tài khoản MySQL khớp với thông tin trong `src/dao/DBConnection.java`:
  - Mặc định: user = `root`, password = `vanthinh123`
  - Có thể sửa lại cho phù hợp với máy của bạn.

### 3. Chạy ứng dụng

- Mở project trong IDE, build project (nếu cần).
- Chạy file `src/application/Main.java`.
- Giao diện đăng nhập sẽ xuất hiện, sử dụng tài khoản mẫu trong database để đăng nhập.

### 4. Tài khoản mẫu

- **Quản trị viên:**
  - Username: `dongvanthinh`
  - Password: `123456`
- **Khách hàng:**
  - Username: `dongvanthinh`
  - Password: `123456`

### 5. Demo sản phẩm
- Link demo: https://drive.google.com/file/d/1OeJS1lEGdgFUmciYEQ39cGsVPYgN95Ca/view?usp=drive_link

## Đóng góp & phát triển

- Dự án tuân thủ mô hình MVC, dễ dàng mở rộng thêm tính năng hoặc giao diện mới.
- Để đóng góp, hãy fork repository, tạo branch mới và gửi pull request.
- Mọi ý kiến đóng góp hoặc báo lỗi xin gửi về email: vanthinhgvo@gmail.com.

## Thông tin liên hệ

- Tác giả: Thịnh Đông
- Facebook: https://www.facebook.com/van.thinh.263183/
