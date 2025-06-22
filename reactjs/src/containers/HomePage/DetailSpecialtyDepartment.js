import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import HomeHeader from "./HomeHeader";
import "./DetailSpecialtyDepartment.scss";
import {
  getDetailInforDoctor,
  getAllCodeService,
  postPatientBookAppointment,
} from "../../services/userService";
import { Modal } from "reactstrap";
import Select from "react-select";
import DatePicker from "../../components/Input/DatePicker";
import { toast } from "react-toastify";
import _ from "lodash";
import * as actions from "../../store/actions";

// Import default doctor image - bạn có thể thay thế bằng đường dẫn ảnh thực tế
const doctorImage =
  "https://via.placeholder.com/150x150/45c3d2/ffffff?text=Doctor";

class DetailSpecialtyDepartment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Specialty/Department info
      specialtyData: {
        name: "Khoa Thần Kinh",
        description: "Chuyên điều trị các bệnh lý về thần kinh",
        image: "",
      },
      listDoctors: [],

      // Booking Modal state
      isOpenBookingModal: false,
      selectedDoctor: null,

      // Form data
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      birthday: "",
      selectedGender: "",
      selectedDate: new Date(),
      selectedTimeSlot: "",

      // Options
      genders: [],
      timeSlots: [
        { value: "08:00-09:00", label: "08:00 - 09:00" },
        { value: "09:00-10:00", label: "09:00 - 10:00" },
        { value: "10:00-11:00", label: "10:00 - 11:00" },
        { value: "14:00-15:00", label: "14:00 - 15:00" },
        { value: "15:00-16:00", label: "15:00 - 16:00" },
        { value: "16:00-17:00", label: "16:00 - 17:00" },
      ],
    };
  }

  async componentDidMount() {
    // Load mock doctors data for neurology department
    this.loadNeurologyDoctors();

    // Load genders
    this.props.getGenders();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.genders !== this.props.genders) {
      let dataGender = this.buildDataGender(this.props.genders);
      this.setState({
        genders: dataGender,
      });
    }
  }

  loadNeurologyDoctors = () => {
    // Mock data for neurology doctors
    const neurologyDoctors = [
      {
        id: 1,
        firstName: "Minh Đức",
        lastName: "TS.BS",
        position: "Trưởng khoa Thần Kinh",
        experience: "25 năm kinh nghiệm",
        specialty: "Đột quỵ não, Parkinson",
        education: "Đại học Y Hà Nội",
        image: doctorImage,
      },
      {
        id: 2,
        firstName: "Thu Hằng",
        lastName: "BS.CKI",
        position: "Phó trưởng khoa",
        experience: "18 năm kinh nghiệm",
        specialty: "Động kinh, Rối loạn vận động",
        education: "Đại học Y Dược TP.HCM",
        image: doctorImage,
      },
      {
        id: 3,
        firstName: "Văn Tuấn",
        lastName: "BS.CKII",
        position: "Bác sĩ điều trị",
        experience: "12 năm kinh nghiệm",
        specialty: "Đau đầu, Rối loạn giấc ngủ",
        education: "Đại học Y Dược Huế",
        image: doctorImage,
      },
      {
        id: 4,
        firstName: "Thị Lan",
        lastName: "BS.CKI",
        position: "Bác sĩ điều trị",
        experience: "15 năm kinh nghiệm",
        specialty: "Bệnh Alzheimer, Sa sút trí tuệ",
        education: "Đại học Y Hà Nội",
        image: doctorImage,
      },
    ];

    this.setState({
      listDoctors: neurologyDoctors,
    });
  };

  buildDataGender = (data) => {
    let result = [];
    if (data && data.length > 0) {
      data.forEach((item) => {
        let object = {};
        object.label = item.valueVi;
        object.value = item.keyMap;
        result.push(object);
      });
    }
    return result;
  };

  handleBookingClick = (doctor) => {
    this.setState({
      selectedDoctor: doctor,
      isOpenBookingModal: true,
    });
  };

  closeBookingModal = () => {
    this.setState({
      isOpenBookingModal: false,
      selectedDoctor: null,
    });
    this.resetForm();
  };

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
      selectedDate: date[0],
    });
  };

  handleChangeSelect = (selectedOption, name) => {
    let stateName = name.name;
    let stateCopy = { ...this.state };
    stateCopy[stateName] = selectedOption;
    this.setState({
      ...stateCopy,
    });
  };

  handleConfirmBooking = async () => {
    // Validation
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
    if (!this.state.selectedTimeSlot) {
      toast.error("Vui lòng chọn thời gian khám!");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.state.email)) {
      toast.error("Email không hợp lệ!");
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(this.state.phoneNumber.replace(/\s/g, ""))) {
      toast.error("Số điện thoại không hợp lệ!");
      return;
    }

    try {
      let formattedDate = new Date(this.state.selectedDate).getTime();

      let bookingData = {
        fullName: this.state.fullName.trim(),
        phoneNumber: this.state.phoneNumber.trim(),
        email: this.state.email.trim(),
        address: this.state.address.trim(),
        reason: this.state.reason.trim(),
        date: formattedDate,
        birthday: this.state.birthday
          ? new Date(this.state.birthday).getTime()
          : "",
        selectedGender: this.state.selectedGender.value,
        doctorId: this.state.selectedDoctor.id,
        timeType: this.state.selectedTimeSlot.value,
        language: this.props.language,
        timeString: this.state.selectedTimeSlot.label,
        doctorName: `${this.state.selectedDoctor.lastName} ${this.state.selectedDoctor.firstName}`,
        department: "Khoa Thần Kinh",
      };

      console.log("Booking data:", bookingData);

      // Simulate API call - replace with actual API
      // let res = await postPatientBookAppointment(bookingData);

      // For demo purposes, simulate success
      toast.success(
        "🎉 Đặt lịch khám thành công! Chúng tôi sẽ gửi email xác nhận cho bạn."
      );

      // Send email notification (simulate)
      this.sendEmailNotification(bookingData);

      this.closeBookingModal();
    } catch (error) {
      console.log("Error booking:", error);
      toast.error("Có lỗi xảy ra khi đặt lịch! Vui lòng thử lại.");
    }
  };

  sendEmailNotification = (bookingData) => {
    // Simulate email sending
    console.log("Sending email notification to:", bookingData.email);
    console.log("Email content:", {
      patientName: bookingData.fullName,
      doctorName: bookingData.doctorName,
      department: bookingData.department,
      appointmentTime: bookingData.timeString,
      appointmentDate: new Date(bookingData.date).toLocaleDateString("vi-VN"),
    });
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
      selectedTimeSlot: "",
    });
  };

  render() {
    let { specialtyData, listDoctors, isOpenBookingModal, selectedDoctor } =
      this.state;

    return (
      <Fragment>
        <HomeHeader isShowBanner={false} />
        <div className="specialty-detail-container">
          {/* Specialty Header */}
          <div className="specialty-header">
            <div className="specialty-info">
              <h1>{specialtyData.name}</h1>
              <p>{specialtyData.description}</p>
            </div>
          </div>

          {/* Specialty Description */}
          <div className="specialty-description">
            <h2>Thế mạnh chuyên môn</h2>
            <div className="description-content">
              <h3>Khám và điều trị về thần kinh</h3>
              <p>
                Khoa Thần Kinh chuyên điều trị các bệnh lý về hệ thần kinh trung
                ương và ngoại biên, bao gồm các rối loạn về não, tủy sống, dây
                thần kinh ngoại biên và cơ.
              </p>

              <h4>Các bệnh lý chính:</h4>
              <ul>
                <li>Đột quỵ não (nhồi máu não, xuất huyết não)</li>
                <li>Bệnh Parkinson và các rối loạn vận động</li>
                <li>Động kinh các loại</li>
                <li>Đau đầu, đau nửa đầu (migraine)</li>
                <li>Rối loạn giấc ngủ</li>
                <li>Bệnh Alzheimer và sa sút trí tuệ</li>
                <li>Viêm màng não, viêm não</li>
                <li>Bệnh lý dây thần kinh ngoại biên</li>
                <li>Bệnh cơ và rối loạn nối thần kinh cơ</li>
              </ul>

              <h4>Thiết bị và công nghệ hiện đại:</h4>
              <ul>
                <li>Máy chụp cộng hưởng từ (MRI) 3.0 Tesla</li>
                <li>Máy CT Scanner 128 lát cắt</li>
                <li>Máy điện não đồ (EEG) và điện cơ đồ (EMG)</li>
                <li>Hệ thống theo dõi bệnh nhân ICU thần kinh</li>
                <li>Thiết bị siêu âm Doppler mạch máu não</li>
              </ul>
            </div>
          </div>

          {/* Doctors Team */}
          <div className="doctors-team">
            <h2>Đội ngũ bác sĩ</h2>
            <div className="doctors-grid">
              {listDoctors &&
                listDoctors.length > 0 &&
                listDoctors.map((doctor, index) => (
                  <div key={index} className="doctor-card">
                    <div className="doctor-image">
                      <img
                        src={doctor.image}
                        alt={`${doctor.firstName} ${doctor.lastName}`}
                      />
                    </div>
                    <div className="doctor-info">
                      <h3>
                        {doctor.lastName} {doctor.firstName}
                      </h3>
                      <p className="position">{doctor.position}</p>
                      <p className="experience">{doctor.experience}</p>
                      <p className="specialty">
                        <strong>Chuyên môn:</strong> {doctor.specialty}
                      </p>
                      <p className="education">
                        <strong>Đào tạo:</strong> {doctor.education}
                      </p>

                      <button
                        className="btn-book-appointment"
                        onClick={() => this.handleBookingClick(doctor)}
                      >
                        <i className="fas fa-calendar-plus"></i>
                        Đặt lịch khám
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Booking Modal */}
          <Modal
            isOpen={isOpenBookingModal}
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
                <span className="right" onClick={this.closeBookingModal}>
                  <i className="fas fa-times"></i>
                </span>
              </div>

              <div className="booking-modal-body">
                {/* Doctor Info */}
                {selectedDoctor && (
                  <div className="doctor-booking-info">
                    <div className="doctor-details">
                      <h5>
                        <i className="fas fa-user-md"></i>
                        &nbsp; Thông tin bác sĩ
                      </h5>
                      <p>
                        <strong>Bác sĩ:</strong> {selectedDoctor.lastName}{" "}
                        {selectedDoctor.firstName}
                      </p>
                      <p>
                        <strong>Chuyên khoa:</strong> Thần kinh
                      </p>
                      <p>
                        <strong>Chuyên môn:</strong> {selectedDoctor.specialty}
                      </p>
                    </div>
                    <div className="clinic-info">
                      <h5>
                        <i className="fas fa-hospital"></i>
                        &nbsp; Thông tin phòng khám
                      </h5>
                      <p>
                        <strong>Giá khám:</strong> 500.000 VND
                      </p>
                      <p>
                        <strong>Địa chỉ:</strong> Bệnh viện Đa khoa Quốc tế
                      </p>
                      <p>
                        <strong>Số điện thoại:</strong> 024.3123.4567
                      </p>
                    </div>
                  </div>
                )}

                {/* Booking Form */}
                <div className="booking-form">
                  <h5>
                    <i className="fas fa-edit"></i>
                    &nbsp; Thông tin đặt lịch
                  </h5>

                  <div className="row">
                    <div className="col-6 form-group">
                      <label>
                        <i className="fas fa-user"></i>
                        &nbsp; Họ và tên *
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        value={this.state.fullName}
                        onChange={(event) =>
                          this.handleOnChangeInput(event, "fullName")
                        }
                        placeholder="Nhập họ và tên"
                      />
                    </div>

                    <div className="col-6 form-group">
                      <label>
                        <i className="fas fa-phone"></i>
                        &nbsp; Số điện thoại *
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        value={this.state.phoneNumber}
                        onChange={(event) =>
                          this.handleOnChangeInput(event, "phoneNumber")
                        }
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-6 form-group">
                      <label>
                        <i className="fas fa-envelope"></i>
                        &nbsp; Email *
                      </label>
                      <input
                        className="form-control"
                        type="email"
                        value={this.state.email}
                        onChange={(event) =>
                          this.handleOnChangeInput(event, "email")
                        }
                        placeholder="Nhập địa chỉ email"
                      />
                    </div>

                    <div className="col-6 form-group">
                      <label>
                        <i className="fas fa-map-marker-alt"></i>
                        &nbsp; Địa chỉ *
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        value={this.state.address}
                        onChange={(event) =>
                          this.handleOnChangeInput(event, "address")
                        }
                        placeholder="Nhập địa chỉ"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-4 form-group">
                      <label>
                        <i className="fas fa-birthday-cake"></i>
                        &nbsp; Ngày sinh
                      </label>
                      <input
                        className="form-control"
                        type="date"
                        value={this.state.birthday}
                        onChange={(event) =>
                          this.handleOnChangeInput(event, "birthday")
                        }
                      />
                    </div>

                    <div className="col-4 form-group">
                      <label>
                        <i className="fas fa-venus-mars"></i>
                        &nbsp; Giới tính *
                      </label>
                      <Select
                        value={this.state.selectedGender}
                        onChange={this.handleChangeSelect}
                        options={this.state.genders}
                        placeholder="Chọn giới tính"
                        name="selectedGender"
                        classNamePrefix="react-select"
                      />
                    </div>

                    <div className="col-4 form-group">
                      <label>
                        <i className="fas fa-calendar-alt"></i>
                        &nbsp; Ngày khám *
                      </label>
                      <DatePicker
                        onChange={this.handleOnChangeDatePicker}
                        className="form-control"
                        value={this.state.selectedDate}
                        minDate={new Date()}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-6 form-group">
                      <label>
                        <i className="fas fa-clock"></i>
                        &nbsp; Thời gian khám *
                      </label>
                      <Select
                        value={this.state.selectedTimeSlot}
                        onChange={this.handleChangeSelect}
                        options={this.state.timeSlots}
                        placeholder="Chọn thời gian"
                        name="selectedTimeSlot"
                        classNamePrefix="react-select"
                      />
                    </div>

                    <div className="col-6 form-group">
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
                        placeholder="Mô tả triệu chứng, lý do khám..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="booking-modal-footer">
                <button
                  className="btn-booking-cancel"
                  onClick={this.closeBookingModal}
                >
                  <i className="fas fa-times"></i>
                  &nbsp; Hủy bỏ
                </button>
                <button
                  className="btn-booking-confirm"
                  onClick={this.handleConfirmBooking}
                >
                  <i className="fas fa-check"></i>
                  &nbsp; Xác nhận đặt lịch
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </Fragment>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailSpecialtyDepartment);
