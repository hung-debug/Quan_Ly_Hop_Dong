<h2 align="center">
    <a href="https://dainam.edu.vn/vi/khoa-cong-nghe-thong-tin">
    🎓 Faculty of Information Technology (DaiNam University)
    </a>
</h2>
<h2 align="center">
  HỆ THỒNG QUẢN LÝ HỢP ĐỒNG ĐIỆN TỬ
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

## 📖 1. Giới thiệu hệ thống 

Hệ thống **E-contract Mobifone** là nền tảng quản lý hợp đồng điện tử, giúp:

- Tạo, lưu trữ và quản lý hợp đồng trực tuyến.  
- Kiểm tra chữ ký số và phê duyệt hợp đồng.  
- Theo dõi trạng thái hợp đồng theo thời gian thực.  
- Đảm bảo bảo mật dữ liệu và tuân thủ các quy định pháp lý về hợp đồng điện tử.

Hệ thống được xây dựng bằng **Angular (front-end)** và **Java/Node.js (back-end)**, hỗ trợ cơ chế client/server để gửi và nhận dữ liệu một cách nhanh chóng và bảo mật.

🖥️ Quản lý người dùng:

    Tạo, sửa, xóa người dùng.

    Phân quyền theo vai trò: admin, nhân viên, khách hàng.

💻 Quản lý hợp đồng:

    Tạo hợp đồng mới, chỉnh sửa hợp đồng.  

    Upload và lưu trữ file hợp đồng (PDF, Word).  

    Gửi hợp đồng để ký điện tử.

🎯 Ký điện tử

    Xác thực chữ ký số. 
    Ký hợp đồng trực tuyến và lưu lại thông tin xác thực. 

💻 Theo dõi trạng thái

    Trạng thái hợp đồng: Chưa ký, Đang ký, Đã ký.
    Log chi tiết lịch sử thay đổi hợp đồng.

    

## 2. Công nghệ sử dụng

[![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/technologies/javase-downloads.html) 
[![Swing](https://img.shields.io/badge/Java%20Swing-007396?style=for-the-badge&logo=java&logoColor=white)](https://docs.oracle.com/javase/tutorial/uiswing/) 
[![UDP](https://img.shields.io/badge/UDP%20Socket-00599C?style=for-the-badge&logo=socket.io&logoColor=white)](https://docs.oracle.com/javase/tutorial/networking/datagrams/) 
[![HTTP](https://img.shields.io/badge/HTTP-FF6F00?style=for-the-badge&logo=mozilla&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTTP) 
[![NTP](https://img.shields.io/badge/NTP-228B22?style=for-the-badge&logo=internet-explorer&logoColor=white)](https://www.ntp.org/) 
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/) 
[![JDBC](https://img.shields.io/badge/JDBC%20Connector-CC0000?style=for-the-badge&logo=java&logoColor=white)](https://dev.mysql.com/downloads/connector/j/) 
[![Eclipse](https://img.shields.io/badge/Eclipse-2C2255?style=for-the-badge&logo=eclipseide&logoColor=white)](https://www.eclipse.org/) 
[![NetBeans](https://img.shields.io/badge/NetBeans-1B6AC6?style=for-the-badge&logo=apachenetbeanside&logoColor=white)](https://netbeans.apache.org/) 
 


## 3. Một số hình ảnh của hệ thống
 
🖥️ Giao diện Client

![Client GUI](docs/sender.png)


🖥️ Giao diện Server

![Server GUI](docs/receiver.png)

## 4. Các bước cài đặt
🔧 Bước 1. Chuẩn bị môi trường

    Cài đặt **JDK 8+** (Java Development Kit) 

    👉 [Tải JDK tại đây](https://www.oracle.com/java/technologies/javase-downloads.html)

    IDE hỗ trợ Java: **Eclipse** hoặc **NetBeans**
🗄️ Bước 2. Clone dự án về máy

    Mở **Terminal (Linux/macOS)** hoặc **Command Prompt/PowerShell (Windows)** và chạy lệnh sau:
    
    git clone https://github.com/hung-debug/Lap_Trinh_Mang_1604_004Truyen-file-UDP.git
    cd Lap_Trinh_Mang_1604_004Truyen-file-UDP

📦 Bước 3. Mở dự án trong IDE

    Mở Eclipse hoặc NetBeans

    Chọn Import Project → trỏ đến thư mục vừa clone về
    
⚙️ Bước 4. Chạy chương trình

    Chạy Receiver.java để khởi động máy nhận

    Chạy Sender.java để khởi động máy gửi

▶️ Bước 5. Kiểm tra hoạt động

    Nhập IP và Port của Receiver vào Sender

    Ấn Kết nối → chấm trạng thái chuyển 🟢 nếu thành công

    Chọn file cần gửi → ấn Gửi tệp
    
    Ở Receiver, chọn Lưu file hoặc Từ chối


## 5. Liên hệ

Contact me:


    Trịnh Việt Hưng CNTT 16-04

    Khoa: Công nghệ thông tin - Trường Đại học Đại Nam 

   


    




