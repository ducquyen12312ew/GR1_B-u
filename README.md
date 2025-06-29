project của em sẽ chia làm 2 phần là nodejs cho backend và reactjs cho frontend. Khi chạy project thì nên open folder ở 2 window vscode. Đầu tiên git clone https://github.com/ducquyen12312ew/GR1_B-u và làm theo các bước để chạy project
Bước 1: cài đặt nodejs ở https://nodejs.org/en/download v14.21.3
Bước 2: cài đặt xampp và làm theo các bước để import database
- Click "New" bên trái
- Tạo database mới với tên: thaiduong
- Chọn Collation: utf8_general_ci
- Click "Create"
- Chọn database thaiduong vừa tạo
- Click tab "Import"
- Click "Choose File" và chọn file database/thaiduong.sql
- Click "Import" ở cuối trang
- Chờ quá trình import hoàn tất

Bước 3: sau khi mở 2 window vscode và open 2 folder thì ở folder nodejs hãy tạo file .env bằng rank với file .env.example và copy file .env.example qua file .env và thêm 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
vào sau OPENAI_API_KEY=


Bước 4: cả 2 window đều dùng lệnh npm install sau đấy dùng lệnh npm start để chạy project

 
 Sau khi chạy được project thì vào http://localhost:8080/crud để tạo tài khoản sau khi tạo xong sẽ qua trang http://localhost:3000/login sau khi đăng nhập xong sẽ vào trang quản lý của quản trị viên và trang chủ chính là ở http://localhost:3000/home


 http://localhost:3000/system/user-redux đây là trang để tạo thông tin bác sỹ
 
 
 http://localhost:3000/doctor/manage-schedule đây là trang để tạo giờ mà bác sỹ có thể nhận lịch và sẽ hiện ở phần bác sỹ nổi bật ở trang home
