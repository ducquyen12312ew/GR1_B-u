import nodemailer from "nodemailer";
require("dotenv").config();

// Tạo transporter để gửi email
let createTransporter = () => {
  const transporter = nodemailer.createTransporter({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // Gmail address
      pass: process.env.EMAIL_APP_PASSWORD, // App password (not regular password)
    },
  });

  return transporter;
};

// Gửi email xác nhận đặt lịch
let sendBookingConfirmation = async (dataSend) => {
  return new Promise(async (resolve, reject) => {
    try {
      let transporter = createTransporter();

      // Tạo nội dung email
      let emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #007bff; margin: 0;">🏥 Xác nhận đặt lịch khám bệnh</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Thông tin đặt lịch</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">👤 Họ tên:</td>
                <td style="padding: 8px 0; color: #333;">${
                  dataSend.patientName
                }</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">📞 Số điện thoại:</td>
                <td style="padding: 8px 0; color: #333;">${
                  dataSend.phoneNumber
                }</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">🏠 Địa chỉ:</td>
                <td style="padding: 8px 0; color: #333;">${
                  dataSend.address
                }</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">👨‍⚕️ Bác sĩ:</td>
                <td style="padding: 8px 0; color: #333;">${
                  dataSend.doctorName
                }</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">⏰ Thời gian khám:</td>
                <td style="padding: 8px 0; color: #333;">${
                  dataSend.timeString
                }</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">💰 Giá khám:</td>
                <td style="padding: 8px 0; color: #333;">500.000 VND</td>
              </tr>
              ${
                dataSend.reason
                  ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">📝 Lý do khám:</td>
                <td style="padding: 8px 0; color: #333;">${dataSend.reason}</td>
              </tr>
              `
                  : ""
              }
            </table>
          </div>
          
          <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #155724; margin-top: 0;">✅ Đặt lịch thành công!</h3>
            <p style="color: #155724; margin: 0;">Lịch khám của bạn đã được xác nhận. Vui lòng có mặt đúng giờ để được khám.</p>
          </div>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #856404; margin-top: 0;">📋 Lưu ý quan trọng:</h3>
            <ul style="color: #856404; margin: 0; padding-left: 20px;">
              <li>Vui lòng có mặt trước giờ hẹn 15 phút</li>
              <li>Mang theo CMND/CCCD và các giấy tờ liên quan</li>
              <li>Nếu có thay đổi, vui lòng liên hệ trước 24h</li>
              <li>Số điện thoại hỗ trợ: <strong>1900-xxxx</strong></li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; margin: 0;">Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!</p>
            <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">
              Email này được gửi tự động, vui lòng không phản hồi.
            </p>
          </div>
        </div>
      `;

      // Cấu hình email
      let mailOptions = {
        from: `"🏥 Hệ thống đặt lịch khám bệnh" <${process.env.EMAIL_APP}>`,
        to: dataSend.receiverEmail,
        subject: "✅ Xác nhận đặt lịch khám bệnh thành công",
        html: emailContent,
      };

      // Gửi email
      let info = await transporter.sendMail(mailOptions);

      console.log("📧 Email sent successfully:");
      console.log("- To:", dataSend.receiverEmail);
      console.log("- MessageId:", info.messageId);

      resolve({
        errorCode: 0,
        message: "Email sent successfully!",
      });
    } catch (error) {
      console.log("❌ Error sending email:", error);

      resolve({
        errorCode: 1,
        message: "Failed to send email: " + error.message,
      });
    }
  });
};

// Gửi email đơn giản (có thể dùng cho các mục đích khác)
let sendSimpleEmail = async (dataSend) => {
  return new Promise(async (resolve, reject) => {
    try {
      let transporter = createTransporter();

      let mailOptions = {
        from: `"${dataSend.senderName}" <${process.env.EMAIL_APP}>`,
        to: dataSend.receiverEmail,
        subject: dataSend.subject,
        html: dataSend.bodyHTML,
      };

      let info = await transporter.sendMail(mailOptions);

      resolve({
        errorCode: 0,
        message: "Email sent successfully!",
      });
    } catch (error) {
      console.log("❌ Error sending simple email:", error);

      resolve({
        errorCode: 1,
        message: "Failed to send email",
      });
    }
  });
};

module.exports = {
  sendBookingConfirmation: sendBookingConfirmation,
  sendSimpleEmail: sendSimpleEmail,
};
