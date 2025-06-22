import db from "../models/index";
import { sendAppointmentConfirmation } from "./emailService";
require("dotenv").config();

let postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.timeType ||
        !data.date ||
        !data.fullName ||
        !data.selectedGender ||
        !data.address
      ) {
        resolve({
          errorCode: 1,
          errorMessage: "Missing required parameter!",
        });
      } else {
        // Tạo bệnh nhân mới hoặc tìm bệnh nhân đã có
        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3", // Role bệnh nhân
            gender: data.selectedGender,
            address: data.address,
            firstName: data.fullName,
          },
        });

        // Tạo booking mới
        if (user && user[0]) {
          await db.Booking.findOrCreate({
            where: {
              patientId: user[0].id,
              doctorId: data.doctorId,
              date: data.date,
              timeType: data.timeType,
            },
            defaults: {
              statusId: "S1", // Status: New
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType,
            },
          });

          // Lấy thông tin bác sĩ để gửi email
          let doctorInfo = await db.User.findOne({
            where: { id: data.doctorId },
            attributes: ["firstName", "lastName"],
            raw: true,
          });

          // Lấy thông tin time type
          let timeTypeData = await db.Allcode.findOne({
            where: { keyMap: data.timeType, type: "TIME" },
            attributes: ["valueEn", "valueVi"],
            raw: true,
          });

          // Chuẩn bị dữ liệu email
          const emailData = {
            patientName: data.fullName,
            patientEmail: data.email,
            appointmentDate: data.date,
            appointmentTime: timeTypeData
              ? timeTypeData.valueVi
              : data.timeType,
            doctorName: doctorInfo
              ? `${doctorInfo.firstName} ${doctorInfo.lastName}`
              : "Bác sĩ",
            department: "Khoa Khám Bệnh",
            clinicName: "Phòng Khám Đa Khoa",
            clinicAddress: "123 Đường ABC, Quận 1, TP.HCM",
            clinicPhone: "028-1234-5678",
            appointmentId: `APT${Date.now()}`,
          };

          // Gửi email xác nhận
          try {
            const emailResult = await sendAppointmentConfirmation(emailData);

            resolve({
              errorCode: 0,
              errorMessage: "Save booking succeed!",
              emailSent: emailResult.success,
              emailMessage:
                emailResult.message || "Email confirmation processed",
            });
          } catch (emailError) {
            console.error("Email error:", emailError);
            resolve({
              errorCode: 0,
              errorMessage: "Save booking succeed! But email sending failed.",
              emailSent: false,
              emailMessage: "Could not send email confirmation",
            });
          }
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  postBookAppointment: postBookAppointment,
};
