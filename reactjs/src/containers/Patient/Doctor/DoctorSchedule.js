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
    await this.setArrDays(language);

    // 🔧 FIX: Tự động load lịch cho ngày đầu tiên (hôm nay)
    await this.loadScheduleForFirstDay();
  }

  // 🔧 FIX: Thêm method để load lịch ngày đầu tiên
  loadScheduleForFirstDay = async () => {
    if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
      let doctorId = this.props.doctorIdFromParent;
      let today = moment(new Date()).startOf("day").valueOf(); // Ngày hôm nay

      console.log(
        "Loading schedule for today:",
        new Date(today),
        "Doctor ID:",
        doctorId
      );

      let res = await getScheduleDoctorByDate(doctorId, today);
      if (res && res.errorCode === 0) {
        console.log("Schedule data loaded:", res.data);
        this.setState({
          allAvailableTime: res.data ? res.data : [],
        });
      } else {
        console.log("No schedule found for today");
        this.setState({
          allAvailableTime: [],
        });
      }
    }
  };

  setArrDays = async (language) => {
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
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 🔧 FIX: Khi language thay đổi
    if (this.props.language !== prevProps.language) {
      this.setArrDays(this.props.language);
    }

    // 🔧 FIX: Khi doctorId thay đổi, load lại lịch cho ngày đầu tiên
    if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
      if (
        this.props.doctorIdFromParent &&
        this.props.doctorIdFromParent !== -1
      ) {
        this.loadScheduleForFirstDay();
      }
    }
  }

  handleOnChangeSelect = async (event) => {
    if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
      let doctorId = this.props.doctorIdFromParent;
      let date = event.target.value;

      console.log(
        "🔍 Selected date:",
        new Date(parseInt(date)),
        "Doctor ID:",
        doctorId
      );
      console.log("🔍 Date timestamp:", date);

      try {
        let res = await getScheduleDoctorByDate(doctorId, date);
        console.log("🔍 API Response:", res);

        if (res && res.errorCode === 0) {
          if (res.data && res.data.length > 0) {
            console.log("✅ Schedule found:", res.data);
            this.setState({
              allAvailableTime: res.data,
            });
          } else {
            console.log("❌ No schedule found for this date");
            this.setState({
              allAvailableTime: [],
            });
          }
        } else {
          console.log("❌ API Error:", res);
          this.setState({
            allAvailableTime: [],
          });
        }
      } catch (error) {
        console.log("❌ Request Error:", error);
        this.setState({
          allAvailableTime: [],
        });
      }
    }
  };

  handleClickScheduleTime = (time) => {
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
    let { language } = this.props;

    console.log(
      "Rendering DoctorSchedule - Available times:",
      allAvailableTime
    );

    return (
      <>
        <div className="doctor-schedule-container">
          <div className="all-schedule">
            <select
              onChange={(event) => this.handleOnChangeSelect(event)}
              defaultValue={allDays.length > 0 ? allDays[0].value : ""}
            >
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
              {allAvailableTime && allAvailableTime.length > 0 ? (
                allAvailableTime.map((item, index) => {
                  let timeDisplay =
                    language === LANGUAGES.VI
                      ? item.timeTypeData.valueVi
                      : item.timeTypeData.valueEn;

                  return (
                    <button
                      key={index}
                      onClick={() => this.handleClickScheduleTime(item)}
                    >
                      {timeDisplay}
                    </button>
                  );
                })
              ) : (
                <div className="no-schedule">
                  <i className="fas fa-calendar-times"></i>
                  <span>Bác sĩ không có lịch khám trong ngày này</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <BookingModal
          isOpenModal={isOpenModalBooking}
          closeBookingModal={this.closeBookingModal}
          dataTime={dataScheduleTimeModal}
        />
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
