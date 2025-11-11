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

[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/) 
[![Java Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot) 
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) 
[![HTTP](https://img.shields.io/badge/HTTP-FF6F00?style=for-the-badge&logo=mozilla&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTTP) 
[![NTP](https://img.shields.io/badge/NTP-228B22?style=for-the-badge&logo=internet-explorer&logoColor=white)](https://www.ntp.org/) 
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/) 
[![JDBC Connector](https://img.shields.io/badge/JDBC_Connector-CC0000?style=for-the-badge&logo=java&logoColor=white)](https://dev.mysql.com/downloads/connector/j/) 
[![Visual Studio Code](https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/) 

 


## 3. Một số hình ảnh của hệ thống
 
🖥️ Giao diện màn đăng ký

![Client GUI](docs/dangky.png)


🖥️ Giao diện màn đăng nhập

![Server GUI](docs/dangnhap.png)

## 4. Các bước cài đặt
🔧 Bước 1. Chuẩn bị môi trường

    Node.js (phiên bản >=16.x) và npm (hoặc yarn)

    Angular CLI (phiên bản >=15.x)

    Java JDK (phiên bản 11 trở lên)

    Maven (quản lý build backend)

    MySQL hoặc database tương thích đã được cài đặt và cấu hình sẵn
🗄️ Bước 2. Cài đặt và chạy Frontend (Angular)

    Cài đặt Angular CLI (nếu chưa có):    
    
    cd econtract-web   
    
    npm install

    ng serve --open

📦 Bước 3. Cài đặt và chạy Backend (Java Spring Boot)

    cd econtract-backend
    
    mvn clean install
    
    mvn spring-boot:run
    

## 5. Liên hệ

Contact me:


    Trịnh Việt Hưng CNTT 16-04

    Khoa: Công nghệ thông tin - Trường Đại học Đại Nam 

   


    




