const nodemailer = require("nodemailer");

// Cấu hình transporter cho Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_APP || "thaiduong040404@gmail.com", // Email của phòng khám
    pass: process.env.EMAIL_APP_PASSWORD || "yjripabjjwvfchsf", // App Password của Gmail (không có dấu cách)
  },
});

// Hàm gửi email xác nhận đặt lịch
async function sendAppointmentConfirmation(appointmentData) {
  try {
    const {
      patientName,
      patientEmail,
      appointmentDate,
      appointmentTime,
      doctorName,
      department,
      clinicName,
      clinicAddress,
      clinicPhone,
      appointmentId,
    } = appointmentData;

    // Định dạng ngày giờ
    const formattedDate = new Date(appointmentDate).toLocaleDateString("vi-VN");

    const mailOptions = {
      from: {
        name: clinicName || "Phòng Khám",
        address: process.env.EMAIL_APP || "thaiduong040404@gmail.com",
      },
      to: patientEmail,
      subject: `Xác nhận đặt lịch khám bệnh - ${appointmentId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c5aa0; margin-bottom: 10px;">${
              clinicName || "PHÒNG KHÁM"
            }</h1>
            <p style="color: #666; margin: 0;">Xác nhận đặt lịch khám bệnh</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #2c5aa0; margin-top: 0;">Xin chào ${patientName},</h2>
            <p style="font-size: 16px; line-height: 1.6;">
              Cảm ơn bạn đã đặt lịch khám bệnh tại phòng khám của chúng tôi. 
              Dưới đây là thông tin chi tiết về lịch hẹn của bạn:
            </p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #333; width: 40%;">
                Mã số lịch hẹn:
              </td>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #2c5aa0; font-weight: bold;">
                ${appointmentId}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">
                Ngày khám:
              </td>
              <td style="padding: 12px; border-bottom: 1px solid #eee;">
                ${formattedDate}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">
                Giờ khám:
              </td>
              <td style="padding: 12px; border-bottom: 1px solid #eee;">
                ${appointmentTime}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">
                Bác sĩ:
              </td>
              <td style="padding: 12px; border-bottom: 1px solid #eee;">
                ${doctorName}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">
                Khoa:
              </td>
              <td style="padding: 12px; border-bottom: 1px solid #eee;">
                ${department}
              </td>
            </tr>
          </table>

          <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #2c5aa0; margin-top: 0;">Địa chỉ phòng khám:</h3>
            <p style="margin: 5px 0; line-height: 1.6;">
              <strong>📍 ${clinicAddress || "Địa chỉ phòng khám"}</strong><br>
              <strong>📞 ${clinicPhone || "Số điện thoại liên hệ"}</strong>
            </p>
          </div>

          <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
            <h4 style="color: #856404; margin-top: 0;">Lưu ý quan trọng:</h4>
            <ul style="color: #856404; margin: 0; padding-left: 20px;">
              <li>Vui lòng có mặt tại phòng khám trước 15 phút so với giờ hẹn</li>
              <li>Mang theo giấy tờ tùy thân và thẻ bảo hiểm y tế (nếu có)</li>
              <li>Nếu cần hủy/thay đổi lịch hẹn, vui lòng liên hệ trước 24h</li>
            </ul>
          </div>

          <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
            <p style="margin: 0; color: #666;">
              Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua:
            </p>
            <p style="margin: 10px 0 0 0; font-weight: bold; color: #2c5aa0;">
              📞 ${clinicPhone} | 📧 thaiduong040404@gmail.com
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 14px; color: #888; margin: 0;">
              Cảm ơn bạn đã tin tưởng và lựa chọn dịch vụ của chúng tôi!
            </p>
          </div>
        </div>
      `,
    };

    // Gửi email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email đã được gửi thành công:", info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      message: "Email xác nhận đã được gửi thành công",
    };
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
    return {
      success: false,
      error: error.message,
      message: "Có lỗi xảy ra khi gửi email",
    };
  }
}

// Hàm gửi email nhắc nhở trước khi khám
async function sendAppointmentReminder(appointmentData) {
  try {
    const {
      patientName,
      patientEmail,
      appointmentDate,
      appointmentTime,
      doctorName,
      clinicName,
      appointmentId,
    } = appointmentData;

    const formattedDate = new Date(appointmentDate).toLocaleDateString("vi-VN");

    const mailOptions = {
      from: {
        name: clinicName || "Phòng Khám",
        address: process.env.EMAIL_APP || "thaiduong040404@gmail.com",
      },
      to: patientEmail,
      subject: `Nhắc nhở lịch khám - ${appointmentId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c5aa0;">${clinicName || "PHÒNG KHÁM"}</h1>
            <p style="color: #666;">Nhắc nhở lịch khám bệnh</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #2c5aa0; margin-top: 0;">Xin chào ${patientName},</h2>
            <p style="font-size: 16px; line-height: 1.6;">
              Đây là email nhắc nhở về lịch khám bệnh của bạn vào ngày mai:
            </p>
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p style="margin: 5px 0;"><strong>📅 Ngày:</strong> ${formattedDate}</p>
              <p style="margin: 5px 0;"><strong>🕐 Giờ:</strong> ${appointmentTime}</p>
              <p style="margin: 5px 0;"><strong>👨‍⚕️ Bác sĩ:</strong> ${doctorName}</p>
              <p style="margin: 5px 0;"><strong>🆔 Mã lịch hẹn:</strong> ${appointmentId}</p>
            </div>
            <p style="color: #d63384; font-weight: bold;">
              ⏰ Vui lòng có mặt trước 15 phút so với giờ hẹn!
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email nhắc nhở đã được gửi:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Lỗi khi gửi email nhắc nhở:", error);
    return { success: false, error: error.message };
  }
}

// Export các hàm để sử dụng
module.exports = {
  sendAppointmentConfirmation,
  sendAppointmentReminder,
  transporter,
};

// Ví dụ sử dụng:
/*
const appointmentData = {
  patientName: 'Nguyễn Văn A',
  patientEmail: 'patient@gmail.com',
  appointmentDate: '2024-12-25',
  appointmentTime: '09:00',
  doctorName: 'BS. Trần Thị B',
  department: 'Khoa Nội',
  clinicName: 'Phòng Khám Đa Khoa ABC',
  clinicAddress: '123 Đường ABC, Quận 1, TP.HCM',
  clinicPhone: '028-1234-5678',
  appointmentId: 'APT001'
};

// Gửi email xác nhận
sendAppointmentConfirmation(appointmentData)
  .then(result => console.log(result))
  .catch(error => console.error(error));
*/
