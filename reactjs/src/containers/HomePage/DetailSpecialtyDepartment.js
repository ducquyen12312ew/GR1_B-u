import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./DetailSpecialtyDepartment.scss";
import HomeHeader from "./HomeHeader";
import HomeFooter from "./HomeFooter";

class DetailSpecialtyDepartment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departmentData: null,
      activeTab: "overview", // overview, doctors, procedures, contact
      doctors: [],
    };
  }

  componentDidMount() {
    this.loadDepartmentData();
  }

  loadDepartmentData = () => {
    // Dữ liệu mẫu cho khoa Thần kinh của Bệnh viện Việt Đức
    const departmentData = {
      name: "Khoa Thần kinh",
      fullName:
        "Khám, điều trị, phẫu thuật về Thần kinh (Thần kinh I, Thần kinh II)",
      facility: "Bệnh viện Hữu nghị Việt Đức",
      image:
        "https://via.placeholder.com/800x300/2196F3/ffffff?text=Khoa+Than+Kinh",

      overview: {
        description:
          "Khoa Thần kinh Bệnh viện Hữu nghị Việt Đức là một trong những khoa có bề dày truyền thống và uy tín hàng đầu tại Việt Nam trong lĩnh vực chẩn đoán, điều trị và phẫu thuật các bệnh lý thần kinh.",
        mission:
          "Khoa cam kết cung cấp dịch vụ y tế chất lượng cao, ứng dụng những kỹ thuật tiên tiến nhất trong điều trị các bệnh lý thần kinh phức tạp.",
        specialties: [
          "Chấn thương sọ não",
          "Bệnh lý sọ não",
          "Tụy sống",
          "Dây thần kinh ngoại vi",
          "Ung dung nội sọ trong phẫu thuật thần kinh",
          "Phẫu thuật thần kinh chức năng",
          "Phẫu thuật u não sọ",
          "Phẫu thuật mạch máu não",
          "Điều trị đột quỵ não",
          "Chấn thương cột sống",
        ],
        achievements: [
          "Thực hiện thành công hơn 5000 ca phẫu thuật thần kinh mỗi năm",
          "Áp dụng kỹ thuật phẫu thuật não tỉnh táo (Awake craniotomy)",
          "Tiên phong trong ứng dụng robot phẫu thuật thần kinh tại Việt Nam",
          "Hợp tác với các trung tâm thần kinh hàng đầu thế giới",
          "Đào tạo hàng trăm bác sĩ chuyên khoa thần kinh",
        ],
      },

      services: [
        {
          category: "Chẩn đoán hình ảnh",
          items: [
            "CT Scanner 128 lát cắt chuyên dụng thần kinh",
            "MRI 3.0 Tesla với các chuỗi xung chuyên biệt",
            "DSA (Chụp mạch số hóa xóa nền)",
            "PET-CT cho chẩn đoán u não",
            "Điện não đồ (EEG) 32 kênh",
            "Đo tốc độ dẫn truyền thần kinh",
          ],
        },
        {
          category: "Phẫu thuật thần kinh",
          items: [
            "Phẫu thuật u não bằng kỹ thuật não tỉnh táo",
            "Phẫu thuật mạch máu não (động mạch chủ não, dị dạng động tĩnh mạch)",
            "Phẫu thuật cột sống (thoát vị đĩa đệm, hẹp ống sống)",
            "Phẫu thuật chấn thương sọ não cấp cứu",
            "Phẫu thuật epilepsy (động kinh)",
            "Phẫu thuật Parkinson (DBS - Deep Brain Stimulation)",
            "Phẫu thuật u tuyến yên",
            "Phẫu thuật thần kinh nhi",
          ],
        },
        {
          category: "Điều trị nội khoa",
          items: [
            "Điều trị đột quỵ não cấp tính",
            "Điều trị bệnh Parkinson và rối loạn vận động",
            "Điều trị động kinh và các rối loạn ý thức",
            "Điều trị đau đầu và đau dây thần kinh",
            "Điều trị viêm não, viêm màng não",
            "Điều trị bệnh lý thần kinh cơ",
            "Điều trị đa xơ cứng",
            "Phục hồi chức năng thần kinh",
          ],
        },
      ],

      procedures: [
        {
          title: "Quy trình khám bệnh",
          steps: [
            {
              step: 1,
              title: "Tiếp nhận và phân tuyến",
              description:
                "Bệnh nhân được tiếp nhận tại quầy lễ tân khoa Thần kinh, phân loại theo mức độ cấp cứu",
            },
            {
              step: 2,
              title: "Khám sàng lọc",
              description:
                "Bác sĩ thực hiện khám lâm sàng ban đầu, đánh giá tình trạng thần kinh cơ bản",
            },
            {
              step: 3,
              title: "Chẩn đoán chuyên sâu",
              description:
                "Thực hiện các xét nghiệm, chẩn đoán hình ảnh cần thiết theo chỉ định",
            },
            {
              step: 4,
              title: "Hội chẩn và điều trị",
              description:
                "Các chuyên gia hội chẩn, đưa ra phương án điều trị tối ưu cho từng bệnh nhân",
            },
            {
              step: 5,
              title: "Theo dõi và tái khám",
              description:
                "Lập lịch tái khám, theo dõi quá trình điều trị và phục hồi",
            },
          ],
        },
      ],

      doctors: [
        {
          id: 1,
          name: "PGS. TS. BS. Nguyễn Văn Thành",
          position: "Trưởng khoa Thần kinh",
          specialization: "Phẫu thuật não, điều trị đột quỵ",
          experience: "25 năm",
          image:
            "https://cdn.bookingcare.vn/fo/w150/2023/11/08/094704-bs-thanh.jpg",
          achievements: [
            "Phó giáo sư, Tiến sĩ Y học",
            "Trưởng khoa Thần kinh Bệnh viện Việt Đức",
            "Chuyên gia đầu ngành về phẫu thuật não",
            "Đã thực hiện hơn 3000 ca phẫu thuật thành công",
          ],
        },
        {
          id: 2,
          name: "TS. BS. Lê Minh Đức",
          position: "Phó trưởng khoa",
          specialization: "Phẫu thuật cột sống, chấn thương thần kinh",
          experience: "20 năm",
          image:
            "https://cdn.bookingcare.vn/fo/w150/2023/06/07/135531-bs-duc.jpg",
          achievements: [
            "Tiến sĩ Y học, Bác sĩ chuyên khoa II",
            "Phó trưởng khoa Thần kinh",
            "Chuyên gia phẫu thuật cột sống",
            "Giảng viên Đại học Y Hà Nội",
          ],
        },
        {
          id: 3,
          name: "BS. CKI. Trần Thị Mai",
          position: "Bác sĩ điều trị",
          specialization: "Điều trị đột quỵ, bệnh Parkinson",
          experience: "15 năm",
          image:
            "https://cdn.bookingcare.vn/fo/w150/2023/09/12/141503-bs-mai.jpg",
          achievements: [
            "Bác sĩ chuyên khoa I Thần kinh",
            "Chuyên gia điều trị đột quỵ não",
            "Thành viên Hội Thần kinh học Việt Nam",
            "Tham gia nhiều nghiên cứu khoa học",
          ],
        },
      ],

      facilities: [
        "Phòng mổ thần kinh hiện đại với hệ thống định vị 3D",
        "Phòng ICU thần kinh chuyên biệt",
        "Phòng điều trị đột quỵ cấp cứu",
        "Trung tâm phục hồi chức năng thần kinh",
        "Phòng EEG 32 kênh",
        "Phòng EMG - đo tốc độ dẫn truyền thần kinh",
      ],

      contact: {
        phone: "024-3825-3531",
        emergency: "024-3869-3731",
        email: "thankinhvietduc@bvvietduc.vn",
        address:
          "Tầng 8-9, Tòa nhà C4, Bệnh viện Hữu nghị Việt Đức, Số 16 Phủ Doãn, Hàng Bông, Hoàn Kiếm, Hà Nội",
        workingHours: {
          weekday: "Thứ 2 - Thứ 6: 7:00 - 16:30",
          saturday: "Thứ 7: 7:00 - 11:30",
          emergency: "Cấp cứu 24/7",
        },
      },
    };

    this.setState({
      departmentData,
      doctors: departmentData.doctors,
    });
  };

  handleTabChange = (tabName) => {
    this.setState({ activeTab: tabName });
  };

  // Xử lý đặt lịch khám với bác sĩ
  handleBookDoctorAppointment = (doctor) => {
    if (this.props.history) {
      this.props.history.push(`/booking-appointment`, {
        doctorData: doctor,
        departmentData: this.state.departmentData,
        bookingType: "doctor",
      });
    } else {
      // Fallback - có thể mở modal hoặc alert
      alert(`Đặt lịch khám với ${doctor.name}`);
    }
  };

  // Xử lý xem chi tiết bác sĩ
  handleViewDoctorDetail = (doctor) => {
    if (this.props.history) {
      this.props.history.push(`/detail-doctor/${doctor.id}`, {
        doctorData: doctor,
        fromDepartment: this.state.departmentData.name,
      });
    } else {
      // Fallback
      console.log("View doctor detail:", doctor);
    }
  };

  render() {
    const { departmentData, activeTab, doctors } = this.state;

    if (!departmentData) {
      return (
        <div className="loading-container">
          <div className="loading-spinner">Đang tải thông tin...</div>
        </div>
      );
    }

    return (
      <div className="detail-specialty-department">
        <HomeHeader isShowBanner={false} />

        {/* Hero Section */}
        <div className="department-hero">
          <div className="hero-overlay">
            <div className="hero-content">
              <div className="breadcrumb">
                <span>{departmentData.facility}</span> /{" "}
                <span>{departmentData.name}</span>
              </div>
              <h1>{departmentData.name}</h1>
              <h2>{departmentData.fullName}</h2>
              <p>{departmentData.overview.description}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="department-nav">
          <div className="nav-container">
            <button
              className={`nav-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => this.handleTabChange("overview")}
            >
              <i className="fas fa-info-circle"></i> Tổng quan
            </button>
            <button
              className={`nav-btn ${activeTab === "doctors" ? "active" : ""}`}
              onClick={() => this.handleTabChange("doctors")}
            >
              <i className="fas fa-user-md"></i> Đội ngũ bác sĩ
            </button>
            <button
              className={`nav-btn ${
                activeTab === "procedures" ? "active" : ""
              }`}
              onClick={() => this.handleTabChange("procedures")}
            >
              <i className="fas fa-clipboard-list"></i> Quy trình khám
            </button>
            <button
              className={`nav-btn ${activeTab === "contact" ? "active" : ""}`}
              onClick={() => this.handleTabChange("contact")}
            >
              <i className="fas fa-phone"></i> Liên hệ
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="department-content">
          <div className="content-container">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="overview-content">
                <div className="overview-grid">
                  <div className="main-content">
                    <h3>Về khoa {departmentData.name}</h3>
                    <p>{departmentData.overview.mission}</p>

                    <h4>Các chuyên khoa điều trị:</h4>
                    <div className="specialties-grid">
                      {departmentData.overview.specialties.map(
                        (specialty, index) => (
                          <div key={index} className="specialty-card">
                            <i className="fas fa-check-circle"></i>
                            <span>{specialty}</span>
                          </div>
                        )
                      )}
                    </div>

                    <h4>Dịch vụ y tế:</h4>
                    {departmentData.services.map((service, index) => (
                      <div key={index} className="service-section">
                        <h5>{service.category}</h5>
                        <ul>
                          {service.items.map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="sidebar-content">
                    <div className="achievements-card">
                      <h4>Thành tựu nổi bật</h4>
                      <ul>
                        {departmentData.overview.achievements.map(
                          (achievement, index) => (
                            <li key={index}>{achievement}</li>
                          )
                        )}
                      </ul>
                    </div>

                    <div className="facilities-card">
                      <h4>Trang thiết bị</h4>
                      <ul>
                        {departmentData.facilities.map((facility, index) => (
                          <li key={index}>{facility}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Doctors Tab */}
            {activeTab === "doctors" && (
              <div className="doctors-content">
                <h3>Đội ngũ bác sĩ khoa {departmentData.name}</h3>
                <div className="doctors-grid">
                  {doctors.map((doctor, index) => (
                    <div key={index} className="doctor-card">
                      <div className="doctor-header">
                        <div className="doctor-image">
                          <img src={doctor.image} alt={doctor.name} />
                        </div>
                        <div className="doctor-basic-info">
                          <h4>{doctor.name}</h4>
                          <p className="position">{doctor.position}</p>
                          <p className="specialization">
                            {doctor.specialization}
                          </p>
                          <p className="experience">
                            <i className="fas fa-clock"></i>
                            Kinh nghiệm: {doctor.experience}
                          </p>
                        </div>
                      </div>

                      <div className="doctor-details">
                        <div className="achievements-section">
                          <h5>Thành tựu nổi bật:</h5>
                          <ul className="achievements">
                            {doctor.achievements.map(
                              (achievement, achIndex) => (
                                <li key={achIndex}>{achievement}</li>
                              )
                            )}
                          </ul>
                        </div>

                        <div className="doctor-schedule-section">
                          <div className="schedule-info">
                            <h5>📅 Lịch khám trong tuần:</h5>
                            <div className="schedule-grid">
                              <div className="schedule-day">
                                <span className="day">Thứ 2</span>
                                <span className="time">8:00 - 11:30</span>
                              </div>
                              <div className="schedule-day">
                                <span className="day">Thứ 4</span>
                                <span className="time">14:00 - 17:00</span>
                              </div>
                              <div className="schedule-day">
                                <span className="day">Thứ 6</span>
                                <span className="time">8:00 - 11:30</span>
                              </div>
                              <div className="schedule-day available">
                                <span className="day">Thứ 7</span>
                                <span className="time">8:00 - 11:00</span>
                                <span className="status">Còn chỗ</span>
                              </div>
                            </div>
                          </div>

                          <div className="booking-section">
                            <div className="price-info">
                              <h5>💰 Thông tin khám:</h5>
                              <div className="price-details">
                                <span className="price">500.000đ</span>
                                <span className="price-label">/ lần khám</span>
                              </div>
                              <p className="booking-note">
                                <i className="fas fa-check-circle"></i>
                                Miễn phí đặt lịch
                              </p>
                            </div>

                            <div className="booking-actions">
                              <button
                                className="btn-book-appointment"
                                onClick={() =>
                                  this.handleBookDoctorAppointment(doctor)
                                }
                              >
                                <i className="fas fa-calendar-plus"></i>
                                Đặt lịch khám
                              </button>
                              <button
                                className="btn-doctor-info"
                                onClick={() =>
                                  this.handleViewDoctorDetail(doctor)
                                }
                              >
                                <i className="fas fa-info-circle"></i>
                                Xem chi tiết
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="doctor-workplace">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>
                          Khoa {departmentData.name} - {departmentData.facility}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Procedures Tab */}
            {activeTab === "procedures" && (
              <div className="procedures-content">
                <h3>Quy trình khám bệnh tại khoa {departmentData.name}</h3>
                {departmentData.procedures.map((procedure, index) => (
                  <div key={index} className="procedure-section">
                    <h4>{procedure.title}</h4>
                    <div className="procedure-steps">
                      {procedure.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="procedure-step">
                          <div className="step-number">{step.step}</div>
                          <div className="step-content">
                            <h5>{step.title}</h5>
                            <p>{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === "contact" && (
              <div className="contact-content">
                <h3>Thông tin liên hệ</h3>
                <div className="contact-grid">
                  <div className="contact-info">
                    <div className="contact-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <div>
                        <h4>Địa chỉ</h4>
                        <p>{departmentData.contact.address}</p>
                      </div>
                    </div>

                    <div className="contact-item">
                      <i className="fas fa-phone"></i>
                      <div>
                        <h4>Điện thoại</h4>
                        <p>Khám bệnh: {departmentData.contact.phone}</p>
                        <p>Cấp cứu: {departmentData.contact.emergency}</p>
                      </div>
                    </div>

                    <div className="contact-item">
                      <i className="fas fa-envelope"></i>
                      <div>
                        <h4>Email</h4>
                        <p>{departmentData.contact.email}</p>
                      </div>
                    </div>

                    <div className="contact-item">
                      <i className="fas fa-clock"></i>
                      <div>
                        <h4>Giờ làm việc</h4>
                        <p>{departmentData.contact.workingHours.weekday}</p>
                        <p>{departmentData.contact.workingHours.saturday}</p>
                        <p>
                          <strong>
                            {departmentData.contact.workingHours.emergency}
                          </strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="contact-map">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0963715413173!2d105.84949831533467!3d21.028775393080275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abea4d87b213%3A0x6f27334f833e0c6d!2zQsOqbmggdmnhu4duIEjhu691IG5naOG7i1R2aeG7h3QgxJDhu6tc!5e0!3m2!1svi!2s!4v1635750000000!5m2!1svi!2s"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Bản đồ Bệnh viện Việt Đức"
                    ></iframe>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <HomeFooter />
      </div>
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DetailSpecialtyDepartment)
);
