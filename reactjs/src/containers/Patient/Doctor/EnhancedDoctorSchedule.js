// Cập nhật file DoctorSchedule.js với mock data và booking functionality

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./DoctorSchedule.scss";
import moment from "moment";
import localization from "moment/locale/vi";
import { LANGUAGES } from "../../../utils";
import { getScheduleDoctorByDate } from "../../../services/userService";
import BookingModal from "./Modal/BookingModal";

class DoctorSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDays: [],
      allAvailableTime: [],
      isOpenModalBooking: false,
      dataScheduleTimeModal: {},
    };
  }

  async componentDidMount() {
    let { language } = this.props;
    this.setArrDays(language);
    // Load mock schedule data khi component mount
    if (this.props.doctorIdFromParent) {
      this.loadMockScheduleData();
    }
  }

  setArrDays = (language) => {
    let allDays = [];
    for (let i = 0; i < 7; i++) {
      let object = {};
      if (language === LANGUAGES.VI) {
        object.label = moment(new Date()).add(i, "days").format("dddd - DD/MM");
      } else {
        object.label = moment(new Date())
          .add(i, "days")
          .locale("en")
          .format("ddd-DD/MM/YYYY");
      }
      object.value = moment(new Date()).add(i, "days").startOf("day").valueOf();
      allDays.push(object);
    }

    this.setState({
      allDays: allDays,
    });

    // Load schedule cho ngày đầu tiên
    if (allDays.length > 0) {
      this.handleOnChangeSelect({ target: { value: allDays[0].value } });
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      this.setArrDays(this.props.language);
    }
    if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
      this.loadMockScheduleData();
    }
  }

  // Mock data cho lịch khám
  loadMockScheduleData = () => {
    const { doctorIdFromParent } = this.props;

    // Mock schedule data với các khung giờ khác nhau cho từng bác sĩ
    const mockScheduleData = {
      1: [
        // PGS.TS Vũ Văn Hòe - Hà Nội
        {
          timeType: "T1",
          timeTypeData: { valueVi: "8:00 - 9:00", valueEn: "8:00 - 9:00" },
        },
        {
          timeType: "T2",
          timeTypeData: { valueVi: "9:00 - 10:00", valueEn: "9:00 - 10:00" },
        },
        {
          timeType: "T3",
          timeTypeData: { valueVi: "10:00 - 11:00", valueEn: "10:00 - 11:00" },
        },
        {
          timeType: "T4",
          timeTypeData: { valueVi: "14:00 - 15:00", valueEn: "14:00 - 15:00" },
        },
      ],
      2: [
        // TS.BS Nguyễn Văn Thành - Hà Nội
        {
          timeType: "T2",
          timeTypeData: { valueVi: "9:00 - 10:00", valueEn: "9:00 - 10:00" },
        },
        {
          timeType: "T3",
          timeTypeData: { valueVi: "10:00 - 11:00", valueEn: "10:00 - 11:00" },
        },
        {
          timeType: "T5",
          timeTypeData: { valueVi: "15:00 - 16:00", valueEn: "15:00 - 16:00" },
        },
      ],
      3: [
        // PGS.TS Lê Minh Đức - TP.HCM
        {
          timeType: "T1",
          timeTypeData: { valueVi: "8:00 - 9:00", valueEn: "8:00 - 9:00" },
        },
        {
          timeType: "T3",
          timeTypeData: { valueVi: "10:00 - 11:00", valueEn: "10:00 - 11:00" },
        },
        {
          timeType: "T4",
          timeTypeData: { valueVi: "14:00 - 15:00", valueEn: "14:00 - 15:00" },
        },
        {
          timeType: "T6",
          timeTypeData: { valueVi: "16:00 - 17:00", valueEn: "16:00 - 17:00" },
        },
      ],
      4: [
        // BS.CKI Trần Thị Mai - TP.HCM
        {
          timeType: "T2",
          timeTypeData: { valueVi: "9:00 - 10:00", valueEn: "9:00 - 10:00" },
        },
        {
          timeType: "T4",
          timeTypeData: { valueVi: "14:00 - 15:00", valueEn: "14:00 - 15:00" },
        },
        {
          timeType: "T5",
          timeTypeData: { valueVi: "15:00 - 16:00", valueEn: "15:00 - 16:00" },
        },
      ],
      5: [
        // GS.TS Phạm Thanh Long - TP.HCM
        {
          timeType: "T1",
          timeTypeData: { valueVi: "8:00 - 9:00", valueEn: "8:00 - 9:00" },
        },
        {
          timeType: "T2",
          timeTypeData: { valueVi: "9:00 - 10:00", valueEn: "9:00 - 10:00" },
        },
        {
          timeType: "T7",
          timeTypeData: { valueVi: "17:00 - 18:00", valueEn: "17:00 - 18:00" },
        },
      ],
      6: [
        // PGS.TS Võ Minh Tuấn - Đà Nẵng
        {
          timeType: "T1",
          timeTypeData: { valueVi: "8:00 - 9:00", valueEn: "8:00 - 9:00" },
        },
        {
          timeType: "T3",
          timeTypeData: { valueVi: "10:00 - 11:00", valueEn: "10:00 - 11:00" },
        },
        {
          timeType: "T4",
          timeTypeData: { valueVi: "14:00 - 15:00", valueEn: "14:00 - 15:00" },
        },
      ],
      7: [
        // TS.BS Nguyễn Thị Lan - Đà Nẵng
        {
          timeType: "T2",
          timeTypeData: { valueVi: "9:00 - 10:00", valueEn: "9:00 - 10:00" },
        },
        {
          timeType: "T5",
          timeTypeData: { valueVi: "15:00 - 16:00", valueEn: "15:00 - 16:00" },
        },
        {
          timeType: "T6",
          timeTypeData: { valueVi: "16:00 - 17:00", valueEn: "16:00 - 17:00" },
        },
      ],
      8: [
        // BS.CKI Hoàng Văn Nam - Đà Nẵng
        {
          timeType: "T3",
          timeTypeData: { valueVi: "10:00 - 11:00", valueEn: "10:00 - 11:00" },
        },
        {
          timeType: "T4",
          timeTypeData: { valueVi: "14:00 - 15:00", valueEn: "14:00 - 15:00" },
        },
        {
          timeType: "T5",
          timeTypeData: { valueVi: "15:00 - 16:00", valueEn: "15:00 - 16:00" },
        },
      ],
      9: [
        // BS.CKI Lê Thị Hương - Đà Nẵng
        {
          timeType: "T1",
          timeTypeData: { valueVi: "8:00 - 9:00", valueEn: "8:00 - 9:00" },
        },
        {
          timeType: "T2",
          timeTypeData: { valueVi: "9:00 - 10:00", valueEn: "9:00 - 10:00" },
        },
        {
          timeType: "T6",
          timeTypeData: { valueVi: "16:00 - 17:00", valueEn: "16:00 - 17:00" },
        },
      ],
    };

    // Lấy schedule data cho bác sĩ hiện tại
    const doctorSchedule = mockScheduleData[doctorIdFromParent] || [];

    // Thêm thông tin bổ sung cho mỗi time slot
    const enhancedSchedule = doctorSchedule.map((item) => ({
      ...item,
      doctorId: doctorIdFromParent,
      date: moment(new Date()).startOf("day").valueOf(), // Ngày hiện tại
      currentNumber: Math.floor(Math.random() * 3), // Số người đã đăng ký (0-2)
      maxNumber: 5, // Tối đa 5 người/slot
    }));

    this.setState({
      allAvailableTime: enhancedSchedule,
    });
  };

  handleOnChangeSelect = async (event) => {
    const selectedDate = event.target.value;

    // Thay vì gọi API, sử dụng mock data
    this.loadMockScheduleData();

    // Có thể thêm logic để thay đổi schedule theo ngày nếu cần
    console.log("Selected date:", moment(+selectedDate).format("DD/MM/YYYY"));
  };

  handleClickScheduleTime = (time) => {
    // Kiểm tra xem có còn slot trống không
    if (time.currentNumber >= time.maxNumber) {
      alert("Khung giờ này đã hết chỗ. Vui lòng chọn khung giờ khác.");
      return;
    }

    this.setState({
      dataScheduleTimeModal: time,
      isOpenModalBooking: true,
    });
    console.log("Selected time slot:", time);
  };

  closeBookingModal = () => {
    this.setState({
      isOpenModalBooking: false,
    });
  };

  render() {
    let {
      allDays,
      allAvailableTime,
      isOpenModalBooking,
      dataScheduleTimeModal,
    } = this.state;
    let { language, showBookingModal = true } = this.props;

    return (
      <>
        <div className="doctor-schedule-container">
          <div className="all-schedule">
            <select onChange={(event) => this.handleOnChangeSelect(event)}>
              {allDays &&
                allDays.length > 0 &&
                allDays.map((item, index) => {
                  return (
                    <option value={item.value} key={index}>
                      {item.label}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="all-available-time">
            <div className="text-calendar">
              <i className="fas fa-calendar-alt">
                <span>Lịch khám </span>
              </i>
            </div>
            <div className="time-content">
              {allAvailableTime &&
                allAvailableTime.length > 0 &&
                allAvailableTime.map((item, index) => {
                  let timeDisplay =
                    language === LANGUAGES.VI
                      ? item.timeTypeData.valueVi
                      : item.timeTypeData.valueEn;

                  // Kiểm tra xem slot còn trống không
                  let isAvailable = item.currentNumber < item.maxNumber;
                  let remainingSlots = item.maxNumber - item.currentNumber;

                  return (
                    <button
                      key={index}
                      className={`time-slot ${!isAvailable ? "full" : ""}`}
                      onClick={() => this.handleClickScheduleTime(item)}
                      disabled={!isAvailable}
                      title={
                        isAvailable
                          ? `Còn ${remainingSlots} chỗ trống`
                          : "Khung giờ đã đầy"
                      }
                    >
                      <div className="time-text">{timeDisplay}</div>
                      <div className="slot-info">
                        {isAvailable ? (
                          <span className="available">
                            Còn {remainingSlots} chỗ
                          </span>
                        ) : (
                          <span className="full-text">Hết chỗ</span>
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>

            {allAvailableTime.length === 0 && (
              <div className="no-schedule">
                <p>Bác sĩ không có lịch khám trong ngày này.</p>
              </div>
            )}
          </div>
        </div>

        {showBookingModal && (
          <BookingModal
            isOpenModal={isOpenModalBooking}
            closeBookingModal={this.closeBookingModal}
            dataTime={dataScheduleTimeModal}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
