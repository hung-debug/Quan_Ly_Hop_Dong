<h2 align="center">
    <a href="https://dainam.edu.vn/vi/khoa-cong-nghe-thong-tin">
    🎓 Faculty of Information Technology (DaiNam University)
    </a>
</h2>
<h2 align="center">
   NETWORK PROGRAMMING
</h2>
<div align="center">
    <p align="center">
        <img src="docs/aiotlab_logo.png" alt="AIoTLab Logo" width="170"/>
        <img src="docs/fitdnu_logo.png" alt="AIoTLab Logo" width="180"/>
        <img src="docs/dnu_logo.png" alt="DaiNam University Logo" width="200"/>
    </p>

[![AIoTLab](https://img.shields.io/badge/AIoTLab-green?style=for-the-badge)](https://www.facebook.com/DNUAIoTLab)
[![Faculty of Information Technology](https://img.shields.io/badge/Faculty%20of%20Information%20Technology-blue?style=for-the-badge)](https://dainam.edu.vn/vi/khoa-cong-nghe-thong-tin)
[![DaiNam University](https://img.shields.io/badge/DaiNam%20University-orange?style=for-the-badge)](https://dainam.edu.vn)


</div>
## 📖 1. Giới thiệu

Học phần trang bị cho người học những kiến thức nền tảng của lập trình mạng và các kỹ năng cần thiết để thiết kế và cài đặt các ứng dụng mạng và các chuẩn ở mức ứng dụng dựa trên mô hình Client/Server, có sử dụng các giao tiếp chương trình dựa trên Sockets. Kết thúc học phần, sinh viên có thể viết các chương trình ứng dụng mạng với giao thức tầng ứng dụng tự thiết kế.

## 📂 2. udp file transfer dashboard (java swing)

ứng dụng **gửi và nhận file qua giao thức udp** với giao diện đồ họa trực quan được xây dựng bằng **java swing**.  
dự án mô phỏng quá trình **truyền tải file giữa hai máy tính trong mạng lan** theo cơ chế **sender ↔ receiver**, đồng thời hiển thị trạng thái kết nối trực quan bằng chấm màu 🔴🟢.

---

## 3. ✨ tính năng nổi bật

### 🔹 sender (máy gửi)
- nhập **ip** và **port** của receiver.
- **kết nối** tới receiver với nút `connect`.  
  > nếu kết nối thành công, trạng thái đổi từ 🔴 sang 🟢.
- chọn file cần gửi (`choose file`).
- gửi file sang receiver (`send file`).
- hiển thị log chi tiết quá trình gửi.

### 🔹 receiver (máy nhận)
- nhập **port** để mở cổng lắng nghe.
- bắt đầu nhận dữ liệu với `start receiver`.
- xác nhận kết nối từ sender và chuyển trạng thái sang 🟢.
- nhận file:
  - tiếp nhận thông tin tên file (`filename:...`).
  - ghép nối dữ liệu từ các gói udp.
  - khi nhận `"eof"` → mở hộp thoại cho phép chọn nơi lưu file.
- hiển thị log quá trình nhận file.

### 🔹 trạng thái kết nối
- 🔴 **đỏ** → chưa kết nối hoặc đã ngắt kết nối.  
- 🟢 **xanh** → kết nối thành công / đang nhận dữ liệu.  

---

## 🖼️ 4. giao diện mô phỏng

### sender
+------------------------------------+
| receiver ip: [ ......... ] |
| receiver port: [ ......... ] |
| trạng thái: ● (đỏ/xanh) |
| |
| [ connect ] [ choose file ] [send] |
| |
| --- log --- |
| ... |
+------------------------------------+

### receiver
+------------------------------------+
| listen port: [ ......... ] |
| receiver ip: 192.168.x.x |
| trạng thái: ● (đỏ/xanh) |
| |
| [ start receiver ] [ stop ] |
| |
| --- log --- |
| ... |
+------------------------------------+


---

## ⚙️ cách sử dụng

### 1️⃣ biên dịch
```bash
javac senderfile/udpfilesenderdashboard.java
javac senderfile/udpfilereceiverdashboard.java
