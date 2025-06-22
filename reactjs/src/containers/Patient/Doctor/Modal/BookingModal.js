import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./BookingModal.scss";
import { Modal } from "reactstrap";
import _ from "lodash";
import DatePicker from "../../../../components/Input/DatePicker";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import Select from "react-select";
import { postPatientBookAppointment } from "../../../../services/userService";
import { toast } from "react-toastify";
import moment from "moment";

class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      birthday: "",
      selectedGender: "",
      doctorId: "",
      genders: [],
      timeType: "",
    };
  }

  async componentDidMount() {
    this.props.getGenders();

    // Set doctorId and timeType từ props khi component mount
    if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
      this.setState({
        doctorId: this.props.dataTime.doctorId || "",
        timeType: this.props.dataTime.timeType || "",
      });
    }
  }

  buildDataGender = (data) => {
    let result = [];
    let language = this.props.language;
    if (data && data.length > 0) {
      data.map((item) => {
        let object = {};
        object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
        object.value = item.keyMap;
        result.push(object);
      });
    }
    return result;
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }
    if (this.props.genders !== prevProps.genders) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }

    // Sửa logic set doctorId và timeType
    if (this.props.dataTime !== prevProps.dataTime) {
      if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
        console.log(
          "Setting doctorId and timeType from dataTime:",
          this.props.dataTime
        );
        this.setState({
          doctorId: this.props.dataTime.doctorId || "",
          timeType: this.props.dataTime.timeType || "",
        });
      }
    }
  }

  handleOnChangeInput = (event, id) => {
    let valueInput = event.target.value;
    let stateCopy = { ...this.state };
    stateCopy[id] = valueInput;
    this.setState({
      ...stateCopy,
    });
  };

  handleOnChangeDatePicker = (date) => {
    this.setState({
      birthday: date[0],
    });
  };

  handleChangeSelect = (selectedOption) => {
    this.setState({ selectedGender: selectedOption });
  };

  buildTimeBooking = (dataTime) => {
    let { language } = this.props;
    if (dataTime && !_.isEmpty(dataTime)) {
      let time = "";
      let date = "";

      try {
        time =
          language === LANGUAGES.VI
            ? dataTime.timeTypeData.valueVi
            : dataTime.timeTypeData.valueEn;

        date =
          language === LANGUAGES.VI
            ? moment.unix(+dataTime.date / 1000).format("dddd - DD/MM/YYYY")
            : moment
                .unix(+dataTime.date / 1000)
                .locale("en")
                .format("ddd - MM/DD/YYYY");
      } catch (error) {
        return "Thời gian không xác định";
      }

      return `${time} - ${date}`;
    }
    return "";
  };

  buildDoctorName = (dataTime) => {
    let { language } = this.props;
    if (dataTime && !_.isEmpty(dataTime)) {
      try {
        let name =
          language === LANGUAGES.VI
            ? `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
            : `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`;
        return name;
      } catch (error) {
        return "Bác sĩ";
      }
    }
    return "";
  };

  handleConfirmBooking = async () => {
    // Validate input data
    if (!this.state.fullName.trim()) {
      toast.error("Vui lòng nhập họ tên!");
      return;
    }
    if (!this.state.phoneNumber.trim()) {
      toast.error("Vui lòng nhập số điện thoại!");
      return;
    }
    if (!this.state.email.trim()) {
      toast.error("Vui lòng nhập email!");
      return;
    }
    if (!this.state.address.trim()) {
      toast.error("Vui lòng nhập địa chỉ!");
      return;
    }
    if (!this.state.selectedGender) {
      toast.error("Vui lòng chọn giới tính!");
      return;
    }

    // Validate doctorId và timeType
    let doctorId = this.state.doctorId || this.props.dataTime?.doctorId;
    let timeType = this.state.timeType || this.props.dataTime?.timeType;

    if (!doctorId) {
      toast.error("Không tìm thấy thông tin bác sĩ!");
      return;
    }

    if (!timeType) {
      toast.error("Không tìm thấy thông tin thời gian khám!");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.state.email)) {
      toast.error("Email không hợp lệ!");
      return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(this.state.phoneNumber.replace(/\s/g, ""))) {
      toast.error("Số điện thoại không hợp lệ!");
      return;
    }

    try {
      // Build date for booking
      let date = new Date(+this.props.dataTime.date).getTime();

      // Validate date
      if (!date || isNaN(date)) {
        toast.error("Thời gian đặt lịch không hợp lệ!");
        return;
      }

      let timeString = this.buildTimeBooking(this.props.dataTime);
      let doctorName = this.buildDoctorName(this.props.dataTime);

      let bookingData = {
        fullName: this.state.fullName.trim(),
        phoneNumber: this.state.phoneNumber.trim(),
        email: this.state.email.trim(),
        address: this.state.address.trim(),
        reason: this.state.reason.trim(),
        date: this.props.dataTime.date,
        birthday: this.state.birthday
          ? new Date(this.state.birthday).getTime()
          : "",
        selectedGender: this.state.selectedGender.value,
        doctorId: doctorId, // Sử dụng biến đã validate
        timeType: timeType, // Sử dụng biến đã validate
        language: this.props.language,
        timeString: timeString,
        doctorName: doctorName,
      };

      console.log("Final booking data:", bookingData);

      let res = await postPatientBookAppointment(bookingData);

      console.log("API Response:", res);

      // Kiểm tra response khác nhau
      if (res && res.errorCode === 0) {
        // Trường hợp response trực tiếp
        toast.success("🎉 Đặt lịch khám thành công!");
        this.props.closeBookingModal();
        this.resetForm();
      } else if (res && res.data && res.data.errorCode === 0) {
        // Trường hợp response nằm trong .data
        toast.success("🎉 Đặt lịch khám thành công!");
        this.props.closeBookingModal();
        this.resetForm();
      } else {
        // Có lỗi
        let errorMessage = "Có lỗi xảy ra khi đặt lịch!";
        if (res && res.errorMessage) {
          errorMessage = res.errorMessage;
        } else if (res && res.data && res.data.errorMessage) {
          errorMessage = res.data.errorMessage;
        }
        toast.error(errorMessage);
      }
    } catch (error) {
      console.log("Error booking:", error);
      toast.error(
        "Có lỗi xảy ra khi đặt lịch! Vui lòng kiểm tra kết nối mạng."
      );
    }
  };

  resetForm = () => {
    this.setState({
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      birthday: "",
      selectedGender: "",
    });
  };

  render() {
    let { isOpenModal, closeBookingModal, dataTime } = this.props;
    let doctorId = dataTime && !_.isEmpty(dataTime) ? dataTime.doctorId : "";

    return (
      <Modal
        isOpen={isOpenModal}
        className={"booking-modal-container"}
        size="xl"
        centered
        backdrop={true}
      >
        <div className="booking-modal-content">
          <div className="booking-modal-header">
            <span className="left">
              <i className="fas fa-calendar-check"></i>
              &nbsp; Thông tin đặt lịch khám bệnh
            </span>
            <span className="right" onClick={closeBookingModal}>
              <i className="fas fa-times"></i>
            </span>
          </div>

          <div className="booking-modal-body">
            <div className="doctor-infor">
              <div className="doctor-price">
                <h5>
                  <i className="fas fa-info-circle"></i>
                  &nbsp; Thông tin khám bệnh
                </h5>
                <p>
                  <strong>
                    <i className="fas fa-money-bill-wave"></i>
                    &nbsp; Giá khám:
                  </strong>
                  500.000 VND
                </p>
                {dataTime && dataTime.timeTypeData && (
                  <p>
                    <strong>
                      <i className="fas fa-clock"></i>
                      &nbsp; Thời gian:
                    </strong>
                    {this.buildTimeBooking(dataTime)}
                  </p>
                )}
                {dataTime && dataTime.doctorData && (
                  <p>
                    <strong>
                      <i className="fas fa-user-md"></i>
                      &nbsp; Bác sĩ:
                    </strong>
                    {this.buildDoctorName(dataTime)}
                  </p>
                )}
                {/* Debug info - có thể xóa sau */}
                <p style={{ fontSize: "12px", color: "#6c757d" }}>
                  Debug: DoctorId: {this.state.doctorId || "empty"} | TimeType:{" "}
                  {this.state.timeType || "empty"}
                </p>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 form-group">
                <label className="required">
                  <i className="fas fa-user"></i>
                  &nbsp; Họ và tên
                </label>
                <input
                  className="form-control"
                  value={this.state.fullName}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "fullName")
                  }
                  placeholder="Nhập họ và tên đầy đủ"
                />
              </div>

              <div className="col-md-6 form-group">
                <label className="required">
                  <i className="fas fa-phone"></i>
                  &nbsp; Số điện thoại
                </label>
                <input
                  className="form-control"
                  value={this.state.phoneNumber}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "phoneNumber")
                  }
                  placeholder="VD: 0901234567"
                />
              </div>

              <div className="col-md-6 form-group">
                <label className="required">
                  <i className="fas fa-envelope"></i>
                  &nbsp; Địa chỉ Email
                </label>
                <input
                  className="form-control"
                  type="email"
                  value={this.state.email}
                  onChange={(event) => this.handleOnChangeInput(event, "email")}
                  placeholder="VD: example@gmail.com"
                />
              </div>

              <div className="col-md-6 form-group">
                <label className="required">
                  <i className="fas fa-map-marker-alt"></i>
                  &nbsp; Địa chỉ liên hệ
                </label>
                <input
                  className="form-control"
                  value={this.state.address}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "address")
                  }
                  placeholder="Nhập địa chỉ chi tiết"
                />
              </div>

              <div className="col-md-6 form-group">
                <label>
                  <i className="fas fa-birthday-cake"></i>
                  &nbsp; Ngày sinh
                </label>
                <DatePicker
                  onChange={this.handleOnChangeDatePicker}
                  className="form-control"
                  value={this.state.birthday}
                  placeholder="Chọn ngày sinh"
                />
              </div>

              <div className="col-md-6 form-group">
                <label className="required">
                  <i className="fas fa-venus-mars"></i>
                  &nbsp; Giới tính
                </label>
                <Select
                  value={this.state.selectedGender}
                  onChange={this.handleChangeSelect}
                  options={this.state.genders}
                  placeholder="Chọn giới tính"
                  classNamePrefix="react-select"
                />
              </div>

              <div className="col-12 form-group">
                <label>
                  <i className="fas fa-notes-medical"></i>
                  &nbsp; Lý do khám
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={this.state.reason}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "reason")
                  }
                  placeholder="Mô tả triệu chứng, lý do khám hoặc ghi chú đặc biệt..."
                />
              </div>
            </div>
          </div>

          <div className="booking-modal-footer">
            <button className="btn-booking-cancel" onClick={closeBookingModal}>
              <i className="fas fa-times"></i>
              &nbsp; Hủy bỏ
            </button>
            <button
              className="btn-booking-confirm"
              onClick={() => this.handleConfirmBooking()}
            >
              <i className="fas fa-check"></i>
              &nbsp; Xác nhận đặt lịch
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genders: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenders: () => dispatch(actions.fetchGenderStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
