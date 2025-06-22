import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailSpecialty.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import { LANGUAGES } from "../../../utils";
class SpecialtyDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProvince: "Bình Dương",
      selectedSort: "Tất cả",
      specialtyInfo: {},
      doctors: [],
      selectedDoctor: null,
      selectedDate: null,
      selectedTime: null,
      showBookingModal: false,
    };
  }

  componentDidMount() {
    // Lấy specialtyId từ URL params
    const specialtyId = this.props.match?.params?.id;

    if (specialtyId) {
      this.getSpecialtyData(specialtyId);
      this.getDoctorsBySpecialty(specialtyId);
    }
  }

  getSpecialtyData = (specialtyId) => {
    // TODO: Gọi API lấy thông tin chuyên khoa
    // this.props.getSpecialtyById(specialtyId);

    // Mock data tạm thời với nội dung chi tiết hơn
    const specialtyInfo = {
      name: "Cơ Xương Khớp",
      description: "Bác sĩ Cơ Xương Khớp giỏi",
      shortDescription: `Danh sách các bác sĩ uy tín đầu ngành Cơ Xương Khớp tại Việt Nam:
• Các chuyên gia có quá trình đào tạo bài bản, nhiều kinh nghiệm
• Các giáo sư, phó giáo sư đang trực tiếp nghiên cứu và giảng dạy tại Đại học Y khoa Hà Nội
• Các bác sĩ đang công tác tại các bệnh viện hàng đầu Khoa Cơ Xương Khớp - Bệnh viện Bạch Mai, Bệnh viện Hữu nghị Việt Đức, Bệnh viện E...`,
      fullDescription: `Danh sách các bác sĩ uy tín đầu ngành Cơ Xương Khớp tại Việt Nam:

• Các chuyên gia có quá trình đào tạo bài bản, nhiều kinh nghiệm trong lĩnh vực Cơ Xương Khớp
• Các giáo sư, phó giáo sư đang trực tiếp nghiên cứu và giảng dạy tại Đại học Y khoa Hà Nội
• Các bác sĩ đang công tác tại các bệnh viện hàng đầu Khoa Cơ Xương Khớp - Bệnh viện Bạch Mai, Bệnh viện Hữu nghị Việt Đức, Bệnh viện E

Các bệnh lý chuyên khoa Cơ Xương Khớp thường gặp:
• Viêm khớp dạng thấp, viêm cột sống dính khớp
• Thoái hóa khớp gối, khớp háng, khớp vai
• Loãng xương, gout, viêm khớp nhiễm trùng
• Đau thắt lưng, thoát vị đĩa đệm
• Chấn thương thể thao, gãy xương

Phương pháp điều trị hiện đại:
• Điều trị nội khoa bằng thuốc, tiêm khớp
• Vật lý trị liệu, phục hồi chức năng
• Phẫu thuật thay khớp, nội soi khớp
• Điều trị bằng tế bào gốc, PRP

BookingCare hỗ trợ đặt lịch khám với các bác sĩ uy tín, có thể đặt khám trực tiếp tại bệnh viện hoặc phòng khám.`,
    };
    this.setState({ specialtyInfo });
  };

  getDoctorsBySpecialty = (specialtyId) => {
    // TODO: Gọi API lấy danh sách bác sĩ theo chuyên khoa
    // this.props.getDoctorsBySpecialtyId(specialtyId);

    // Mock data tạm thời - trong thực tế sẽ lấy từ database
    const doctors = [
      {
        id: 1,
        name: "BS.CKI Cao Lạc Khang",
        experience:
          "Bác sĩ có hơn 20 năm kinh nghiệm trong khám và điều trị Cơ xương khớp",
        workplace: "Nguyên Trưởng khoa Ngoại Phòng khám Đa khoa 105",
        specialty:
          "Bác sĩ điều trị Cơ Xương khớp - Bệnh viện Quốc tế Columbia Asia Bình Dương",
        location: "Bình Dương",
        price: "290.000đ",
        image: "https://via.placeholder.com/80x80",
        // Lịch khám sẽ lấy từ database thật
        clinicInfo: {
          name: "Bệnh viện Quốc tế Columbia Asia Bình Dương",
          address: "Đường 22 tháng 12, Khu Phố Hòa Lân, Thuận An, Bình Dương",
        },
      },
    ];
    this.setState({ doctors });

    // Load lịch khám cho từng bác sĩ
    doctors.forEach((doctor) => {
      this.getScheduleForDoctor(doctor.id);
    });
  };

  getScheduleForDoctor = (doctorId) => {
    // TODO: Gọi API lấy lịch khám thật từ database
    // this.props.getDoctorSchedule(doctorId);

    // Tạm thời dùng mock data
    console.log(`Load schedule for doctor ${doctorId} from database`);
  };

  handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    const { districts } = this.state;

    this.setState({
      selectedProvince,
      selectedDistrict: districts[selectedProvince]
        ? districts[selectedProvince][0]
        : "Tất cả quận/huyện",
    });
  };

  handleDistrictChange = (e) => {
    this.setState({ selectedDistrict: e.target.value });
  };

  handleSortChange = (e) => {
    this.setState({ selectedSort: e.target.value });
  };

  handleShowMoreDescription = () => {
    this.setState((prevState) => ({
      showMoreDescription: !prevState.showMoreDescription,
    }));
  };

  handleTimeSlotClick = (doctor, date, time) => {
    this.setState({
      selectedDoctor: doctor,
      selectedDate: date,
      selectedTime: time,
      showBookingModal: true,
    });
  };

  formatDate = (timestamp) => {
    const date = new Date(parseInt(timestamp));
    const days = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    return `${days[date.getDay()]} - ${date.getDate()}/${date.getMonth() + 1}`;
  };

  renderDoctorSchedule = (doctor) => {
    const { doctorSchedules } = this.state;
    const { allScheduleTime, language } = this.props;

    // Kiểm tra an toàn
    if (!doctor || !doctor.id || !doctorSchedules) {
      return <div>Đang tải lịch khám...</div>;
    }

    const schedule = doctorSchedules[doctor.id];

    if (!schedule) {
      return <div>Đang tải lịch khám...</div>;
    }

    const scheduleKeys = Object.keys(schedule);
    if (scheduleKeys.length === 0) {
      return <div>Chưa có lịch khám</div>;
    }

    return scheduleKeys.map((dateStr, index) => {
      const daySchedule = schedule[dateStr];
      if (!daySchedule || daySchedule.length === 0) return null;

      return (
        <div key={index} className="day-schedule">
          <div className="date-label">{this.formatDate(dateStr)}</div>
          <div className="time-buttons">
            {daySchedule.map((timeSlot, timeIndex) => {
              // Kiểm tra an toàn cho timeSlot
              if (!timeSlot || !timeSlot.timeTypeData) {
                return null;
              }

              const timeDisplay =
                language === LANGUAGES.VI
                  ? timeSlot.timeTypeData.valueVi
                  : timeSlot.timeTypeData.valueEn;

              return (
                <button
                  key={timeIndex}
                  className="time-slot-btn"
                  onClick={() =>
                    this.handleTimeSlotClick(doctor, dateStr, timeSlot)
                  }
                >
                  {timeDisplay || "Thời gian"}
                </button>
              );
            })}
          </div>
        </div>
      );
    });
  };

  render() {
    const {
      specialtyInfo,
      doctors,
      selectedProvince,
      selectedDistrict,
      selectedSort,
      showMoreDescription,
      districts,
    } = this.state;

    return (
      <div className="specialty-detail-container">
        <HomeHeader isShowBanner={false} />

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <div className="container">
            <span>🏠 / Khám chuyên khoa / {specialtyInfo.name}</span>
          </div>
        </div>

        {/* Specialty Header */}
        <div className="specialty-header">
          <div className="container">
            <h1>
              {specialtyInfo.name} tại {selectedProvince}
            </h1>
            <p className="specialty-subtitle">{specialtyInfo.description}</p>
            <div className="specialty-description">
              <div className="description-content">
                {showMoreDescription ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        specialtyInfo.fullDescription?.replace(
                          /\n/g,
                          "<br />"
                        ) || "",
                    }}
                  />
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        specialtyInfo.shortDescription?.replace(
                          /\n/g,
                          "<br />"
                        ) || "",
                    }}
                  />
                )}
              </div>
              <button
                className="btn-show-more"
                onClick={this.handleShowMoreDescription}
              >
                {showMoreDescription ? "Thu gọn" : "Xem thêm"}
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="container">
            <div className="filters">
              <select
                value={selectedProvince}
                onChange={this.handleProvinceChange}
                className="filter-select"
              >
                <option value="Hà Nội">Hà Nội</option>
                <option value="TP.HCM">TP.HCM</option>
                <option value="Bình Dương">Bình Dương</option>
              </select>

              <select
                value={selectedDistrict}
                onChange={this.handleDistrictChange}
                className="filter-select"
              >
                {districts[selectedProvince] &&
                  districts[selectedProvince].map((district, index) => (
                    <option key={index} value={district}>
                      {district}
                    </option>
                  ))}
              </select>

              <select
                value={selectedSort}
                onChange={this.handleSortChange}
                className="filter-select"
              >
                <option value="Tất cả">Tất cả</option>
                <option value="Giá tăng dần">Giá tăng dần</option>
                <option value="Giá giảm dần">Giá giảm dần</option>
                <option value="Kinh nghiệm">Kinh nghiệm nhiều nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Doctors List */}
        <div className="doctors-section">
          <div className="container">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="doctor-card">
                <div className="doctor-info">
                  <div className="doctor-avatar">
                    <img
                      src={doctor.image}
                      alt={doctor.firstName + " " + doctor.lastName}
                    />
                  </div>
                  <div className="doctor-details">
                    <h3 className="doctor-name">
                      {doctor.positionData?.valueVi} {doctor.firstName}{" "}
                      {doctor.lastName}
                    </h3>
                    <p className="doctor-experience">
                      {doctor.Doctor_Infor?.description ||
                        "Bác sĩ có hơn 20 năm kinh nghiệm trong khám và điều trị Cơ xương khớp"}
                    </p>
                    <p className="doctor-workplace">
                      {doctor.Doctor_Infor?.nameClinic ||
                        "Nguyên Trưởng khoa Ngoại Phòng khám Đa khoa 105"}
                    </p>
                    <p className="doctor-specialty">
                      {doctor.Doctor_Infor?.specialtyData?.name ||
                        `Bác sĩ điều trị ${specialtyInfo.name} - ${doctor.clinicInfo?.name}`}
                    </p>
                    <p className="doctor-location">📍 {selectedProvince}</p>
                    <button className="btn-more-info">Xem thêm</button>
                  </div>
                </div>

                <div className="booking-section">
                  <div className="schedule-header">
                    <span className="schedule-label">📅 LỊCH KHÁM</span>
                  </div>

                  <div className="time-slots">
                    {this.renderDoctorSchedule(doctor)}
                  </div>

                  <div className="booking-footer">
                    <span className="select-time-note">
                      Chọn ⏰ và đặt (Phí đặt lịch 0đ)
                    </span>
                  </div>

                  <div className="clinic-info">
                    <h4>ĐỊA CHỈ KHÁM</h4>
                    <p className="clinic-name">
                      {doctor.Doctor_Infor?.nameClinic ||
                        doctor.clinicInfo?.name}
                    </p>
                    <p className="clinic-address">
                      {doctor.Doctor_Infor?.addressClinic ||
                        doctor.clinicInfo?.address}
                    </p>
                    <div className="price-info">
                      <span className="price-label">GIÁ KHÁM: </span>
                      <span className="price">
                        {doctor.Doctor_Infor?.priceData?.valueVi ||
                          doctor.price}
                      </span>
                      <span className="price-detail">Xem chi tiết</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="help-section">
          <div className="container">
            <p>
              Cần tìm hiểu thêm?{" "}
              <a href="#" className="help-link">
                Xem câu hỏi thường gặp.
              </a>
            </p>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SpecialtyDetail);
