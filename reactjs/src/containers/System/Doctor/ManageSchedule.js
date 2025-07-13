import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageSchedule.scss";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import * as actions from "../../../store/actions";
import { LANGUAGES, dateFormat } from "../../../utils";
import { getDetailInforDoctor } from "../../../services/userService";
import DatePicker from "../../../components/Input/DatePicker";
import moment from "moment";
import { range } from "lodash";
import { toast } from "react-toastify";
import _ from "lodash";
import { saveBulkScheduleDoctor } from "../../../services/userService";

class ManageSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDoctors: [],
      selectedDoctor: {},
      currentDate: "",
      rangeTime: [],
    };
  }

  componentDidMount() {
    this.props.fetchAllUsers();
    this.props.fetchAllScheduleTime();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allUsers !== this.props.allUsers) {
      console.log("All users:", this.props.allUsers); // Debug: xem tất cả users

      // 🔧 FIX: Mở rộng filter để bắt tất cả các format roleId có thể
      let doctorsOnly = this.props.allUsers.filter((user) => {
        console.log(
          "User:",
          user.firstName,
          user.lastName,
          "roleId:",
          user.roleId
        ); // Debug từng user

        return (
          user.roleId === "R2" || // Role code
          user.roleId === "Bác sĩ" || // Vietnamese
          user.roleId === "Doctor" || // English
          user.roleId === "bác sĩ" || // lowercase
          user.roleId === "doctor" || // lowercase
          user.roleId === "BS" || // Abbreviation
          user.roleId === "Dr" || // Dr. abbreviation
          // 🔧 TEMP: Để debug, lấy tất cả users
          true // TẠM THỜI lấy tất cả để xem có bao nhiêu user
        );
      });

      console.log("Filtered doctors:", doctorsOnly); // Debug: xem kết quả filter

      let dataSelect = this.buildDataInputSelect(doctorsOnly);
      this.setState({
        listDoctors: dataSelect,
      });
    }

    if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
      let data = this.props.allScheduleTime;

      // Nếu không có data từ API, tạo data mặc định
      if (!data || data.length === 0) {
        data = this.createDefaultTimeSlots();
      }

      if (data && data.length > 0) {
        data = data.map((item) => ({ ...item, isSelected: false }));
      }

      this.setState({
        rangeTime: data,
      });
    }
  }

  // Tạo khung giờ mặc định nếu không có data từ database
  createDefaultTimeSlots = () => {
    return [
      {
        id: 1,
        keyMap: "T1",
        type: "TIME",
        valueEn: "8:00 - 9:00 AM",
        valueVi: "8:00 - 9:00",
      },
      {
        id: 2,
        keyMap: "T2",
        type: "TIME",
        valueEn: "9:00 - 10:00 AM",
        valueVi: "9:00 - 10:00",
      },
      {
        id: 3,
        keyMap: "T3",
        type: "TIME",
        valueEn: "10:00 - 11:00 AM",
        valueVi: "10:00 - 11:00",
      },
      {
        id: 4,
        keyMap: "T4",
        type: "TIME",
        valueEn: "11:00 - 12:00 AM",
        valueVi: "11:00 - 12:00",
      },
      {
        id: 5,
        keyMap: "T5",
        type: "TIME",
        valueEn: "1:00 - 2:00 PM",
        valueVi: "13:00 - 14:00",
      },
      {
        id: 6,
        keyMap: "T6",
        type: "TIME",
        valueEn: "2:00 - 3:00 PM",
        valueVi: "14:00 - 15:00",
      },
      {
        id: 7,
        keyMap: "T7",
        type: "TIME",
        valueEn: "3:00 - 4:00 PM",
        valueVi: "15:00 - 16:00",
      },
      {
        id: 8,
        keyMap: "T8",
        type: "TIME",
        valueEn: "4:00 - 5:00 PM",
        valueVi: "16:00 - 17:00",
      },
    ];
  };

  buildDataInputSelect = (inputData) => {
    let result = [];
    let { language } = this.props;

    if (inputData && inputData.length > 0) {
      inputData.forEach((item, index) => {
        let object = {};
        let labelVi = `${item.lastName} ${item.firstName}`;
        let labelEn = `${item.firstName} ${item.lastName}`;

        object.label = language === LANGUAGES.VI ? labelVi : labelEn;
        object.value = item.id;
        result.push(object);
      });
    }

    console.log("Built select options:", result); // Debug: xem options cuối cùng
    return result;
  };

  handleChangeSelect = async (selectedOption) => {
    this.setState({
      selectedDoctor: selectedOption,
    });

    if (selectedOption && selectedOption.value) {
      try {
        let res = await getDetailInforDoctor(selectedOption.value);
        console.log("Doctor info:", res); // Debug: thông tin bác sĩ
      } catch (error) {
        console.log("Error getting doctor info:", error);
      }
    }
  };

  handleOnChangeDatePicker = (date) => {
    this.setState({
      currentDate: date[0],
    });
  };

  handleClickBtnTime = (time) => {
    let { rangeTime } = this.state;
    if (rangeTime && rangeTime.length > 0) {
      rangeTime = rangeTime.map((item) => {
        if (item.id === time.id) item.isSelected = !item.isSelected;
        return item;
      });
      this.setState({
        rangeTime: rangeTime,
      });
    }
  };

  handleSaveSchedule = async () => {
    let { rangeTime, selectedDoctor, currentDate } = this.state;
    let result = [];

    if (!currentDate) {
      toast.error("Vui lòng chọn ngày khám!");
      return;
    }
    if (selectedDoctor && _.isEmpty(selectedDoctor)) {
      toast.error("Vui lòng chọn bác sĩ!");
      return;
    }

    let formatedDate = new Date(currentDate).getTime();

    if (rangeTime && rangeTime.length > 0) {
      let selectedTime = rangeTime.filter((item) => item.isSelected === true);
      if (selectedTime && selectedTime.length > 0) {
        selectedTime.forEach((schedule, index) => {
          let object = {};
          object.doctorId = selectedDoctor.value;
          object.date = formatedDate;
          object.timeType = schedule.keyMap;
          result.push(object);
        });
      } else {
        toast.error("Vui lòng chọn ít nhất một khung giờ!");
        return;
      }
    }

    try {
      let res = await saveBulkScheduleDoctor({
        arrSchedule: result,
        doctorId: selectedDoctor.value,
        formatedDate: formatedDate,
      });

      if (res && res.errorCode === 0) {
        toast.success("Lưu lịch khám thành công!");
        // Reset selected time
        this.setState({
          rangeTime: this.state.rangeTime.map((item) => ({
            ...item,
            isSelected: false,
          })),
        });
      } else {
        toast.error("Có lỗi xảy ra!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra!");
      console.log("Error saving schedule:", error);
    }
  };

  render() {
    let { rangeTime } = this.state;
    let { language } = this.props;

    return (
      <div className="manage-schedule-container">
        <div className="m-s-title">
          <FormattedMessage id="manage-schedule.title" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-6 form-group">
              <label>Chọn bác sĩ</label>
              <Select
                value={this.state.selectedDoctor}
                onChange={this.handleChangeSelect}
                options={this.state.listDoctors}
                placeholder="Chọn bác sĩ..."
              />
            </div>
            <div className="col-6 form-group">
              <label>Chọn ngày</label>
              <DatePicker
                onChange={this.handleOnChangeDatePicker}
                className="form-control"
                value={this.state.currentDate}
                minDate={new Date()}
              />
            </div>
            <div className="col-12 pick-hour-container">
              {rangeTime &&
                rangeTime.length > 0 &&
                rangeTime.map((item, index) => {
                  return (
                    <button
                      className={
                        item.isSelected === true
                          ? "btn btn-schedule active"
                          : "btn btn-schedule"
                      }
                      key={index}
                      onClick={() => this.handleClickBtnTime(item)}
                    >
                      {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                    </button>
                  );
                })}
            </div>
            <div className="col-12">
              <button
                className="btn btn-primary btn-save-schedule"
                onClick={() => this.handleSaveSchedule()}
              >
                Lưu thông tin
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    allUsers: state.admin.users,
    allScheduleTime: state.admin.allScheduleTime,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllUsers: () => dispatch(actions.fetchAllUsersStart()),
    fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
