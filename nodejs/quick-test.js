// Tạo file này trong thư mục nodejs và chạy: node quick-test.js
const { sendAppointmentConfirmation } = require("./src/service/emailService");

const testData = {
  patientName: "Nguyễn Văn Test",
  patientEmail: "lethidongthachchau@gmail.com", // Gửi về chính email của bạn
  appointmentDate: "2024-12-25",
  appointmentTime: "09:00 - 10:00",
  doctorName: "BS. Nguyễn Thị Test",
  department: "Khoa Nội",
  clinicName: "Phòng Khám Đa Khoa Test",
  clinicAddress: "123 Đường Test, Hà Nội",
  clinicPhone: "024-1234-5678",
  appointmentId: "TEST" + Date.now(),
};

console.log("🚀 Bắt đầu test gửi email...");
console.log("📧 Gửi từ: lethidongthachchau@gmail.com");
console.log("📧 Gửi đến:", testData.patientEmail);

sendAppointmentConfirmation(testData)
  .then((result) => {
    console.log("✅ Kết quả:", result);
    if (result.success) {
      console.log("🎉 EMAIL ĐÃ GỬI THÀNH CÔNG!");
      console.log("📬 Kiểm tra hộp thư của bạn");
    } else {
      console.log("❌ LỖI:", result.message);
    }
  })
  .catch((error) => {
    console.error("💥 LỖI NGHIÊM TRỌNG:", error);
  });
