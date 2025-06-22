import db from "../models/index";
import emailService from "./emailService";
require("dotenv").config();

let postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("=== PATIENT BOOKING SERVICE ===");
      console.log("📧 Email config check:");
      console.log("- EMAIL_APP:", process.env.EMAIL_APP);
      console.log(
        "- EMAIL_APP_PASSWORD:",
        process.env.EMAIL_APP_PASSWORD ? "✅ Set" : "❌ Not set"
      );

      if (
        !data.email ||
        !data.doctorId ||
        !data.timeType ||
        !data.date ||
        !data.fullName ||
        !data.selectedGender ||
        !data.address
      ) {
        console.log("❌ Missing required parameters");
        resolve({
          errorCode: 1,
          errorMessage: "Missing required parameters",
        });
        return;
      }

      // Xử lý date
      let bookingDate = data.date;
      if (typeof bookingDate === "number") {
        bookingDate = bookingDate.toString();
      }

      // Prepare booking data
      let bookingData = {
        statusId: "S1",
        doctorId: parseInt(data.doctorId),
        patientId: data.patientId || null,
        date: bookingDate,
        timeType: data.timeType,
        token: data.token || null,
      };

      console.log("💾 Creating booking in database...");

      // Tạo booking trong database
      let result = await db.Booking.create(bookingData);

      console.log("✅ Booking created successfully!");
      console.log("📄 Booking ID:", result.id);

      // Chuẩn bị dữ liệu email
      let emailData = {
        receiverEmail: data.email,
        patientName: data.fullName,
        phoneNumber: data.phoneNumber,
        address: data.address,
        doctorName: data.doctorName || "Bác sĩ",
        timeString: data.timeString || "Thời gian đã đặt",
        reason: data.reason || "",
        language: data.language || "vi",
      };

      console.log("📧 Sending confirmation email to:", data.email);

      // Gửi email
      try {
        let emailResult = await emailService.sendBookingConfirmation(emailData);
        if (emailResult.errorCode === 0) {
          console.log("✅ Email sent successfully!");
        } else {
          console.log("⚠️ Email failed:", emailResult.message);
        }
      } catch (emailError) {
        console.log("❌ Email error:", emailError.message);
      }

      // Trả về thành công
      resolve({
        errorCode: 0,
        errorMessage: "Đặt lịch thành công! Email xác nhận đã được gửi.",
      });
    } catch (e) {
      console.log("❌ ERROR in postBookAppointment:", e.message);
      resolve({
        errorCode: -1,
        errorMessage: "Error from server: " + e.message,
      });
    }
  });
};

module.exports = {
  postBookAppointment: postBookAppointment,
};
