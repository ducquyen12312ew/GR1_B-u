import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./DetailMedicalFacility.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";

class DetailMedicalFacility extends Component {
  constructor(props) {
    super(props);
    this.state = {
      facilityData: null,
      activeTab: "info", // info, specialties, pricing
    };
  }

  componentDidMount() {
    // Lấy ID từ URL params
    const facilityId = this.props.match.params.id;
    this.loadFacilityData(facilityId);
  }

  // Load dữ liệu cơ sở y tế dựa trên ID
  loadFacilityData = (facilityId) => {
    // Dữ liệu mẫu - trong thực tế sẽ call API
    const facilityData = {
      id: 1,
      name: "Bệnh viện Hữu nghị Việt Đức",
      description: "Bệnh viện có nhiều cống, bệnh nhân đến khám sẽ đến cống",
      // Sử dụng ảnh placeholder tạm thời
      image:
        "https://via.placeholder.com/400x250/2196F3/ffffff?text=Benh+Vien+Viet+Duc",
      detailInfo: {
        address: "Số 16 Phủ Doãn, Hàng Bông, Hoàn Kiếm, Hà Nội",
        workingHours: {
          days: "Thứ 2 đến Thứ 7",
          morning: "7h00 - 12h00",
          afternoon: "13h30 - 16h30",
        },
        about:
          "Bệnh viện Việt Đức là một trong 5 bệnh viện tuyến Trung ương, hạng đặc biệt của Việt Nam. Bệnh viện có lịch sử trên 100 năm, bề dày truyền thống danh tiếng, là cái nôi của ngành ngoại khoa Việt Nam gắn liền với những thành tựu Y học quan trọng của đất nước.",
        features: [
          "Được lựa chọn các giáo sư, tiến sĩ, bác sĩ chuyên khoa giàu kinh nghiệm",
          "Hỗ trợ đặt khám trực tuyến trước khi đi khám (miễn phí đặt lịch)",
          "Giảm thời gian chờ đợi khi làm thủ tục khám và ưu tiên khám trước",
          "Nhận được hướng dẫn chi tiết sau khi đặt lịch",
        ],
        servicePackages: [
          {
            name: "Gói 1",
            services: [
              {
                name: "Khám Giáo sư, Phó Giáo sư, Tiến sĩ, Bác sĩ Chuyên Khoa II",
                price: "500.000 đồng/lần khám",
              },
              {
                name: "Khám với bác sĩ Trưởng khoa hoặc Phó khoa",
                price: "500.000 đồng/lần khám",
              },
            ],
          },
          {
            name: "Gói 2",
            services: [
              {
                name: "Khám Thạc sĩ, Bác sĩ Chuyên khoa I",
                price: "300.000 đồng/lần khám",
              },
            ],
          },
        ],
        specialties: [
          {
            category:
              "Khám, điều trị, phẫu thuật về Thần kinh (Thần kinh I, Thần kinh II)",
            details:
              "Chấn thương; Bệnh lý sọ não; Tụy sống; Dây thần kinh ngoại vi; Ung dung nội sọ trong phẫu thuật thần kinh; Phẫu thuật thần kinh chức năng; Phẫu thuật u não sọ...",
          },
          {
            category: "Khám, điều trị, phẫu thuật về Cơ xương khớp",
            details: "Điều trị các bệnh lý về cơ, xương, khớp",
          },
          {
            category:
              "Khám, điều trị, phẫu thuật về Chi trên và Y học thể thao",
            details:
              "Khám các bệnh lý do chấn thương thể thao; Bệnh lý gút dây chằng gối do chơi thể thao; Chấn thương chỉnh hình xương khớp; Phẫu thuật bàn tay...",
          },
          {
            category: "Khám, điều trị, phẫu thuật về Chi dưới",
            details:
              "Điều trị thoái hóa khớp gối, khớp háng; Bệnh lý gút dây chằng gối; Phẫu thuật khớp gối, khớp háng, khớp có chân; Bệnh lý về chân...",
          },
          {
            category:
              "Khám, điều trị, phẫu thuật về Xương và điều trị ngoại trú",
            details:
              "Nắn chỉnh vẻ xương, tai nạn bị gãy tay gẫy chân, thao bột, kiểm tra lại sau khi nắn chỉnh vẻ xương...",
          },
          {
            category: "Khám, điều trị, phẫu thuật về Tạo hình-Hàm mặt-Thẩm mỹ",
            details:
              "Bệnh lý và chấn thương vùng hàm mặt; Phục hồi tái tạo các cơ quan sau điều trị ung thư; Sửa chữa các tật sơ mặt; Nội vanh tai đức rồi, mũi dục rồi; Phẫu thuật thẩm mỹ mí mắt, mũi, tạo hình ngực, bụng...",
          },
          {
            category: "Khám, điều trị, phẫu thuật về Tiêu hóa",
            details:
              "Cắt bỏ và tạo hình thực quản; Cắt khối tá tụy; Cắt toàn bộ da dày, cắt đại tràng các loại...",
          },
        ],
        otherSpecialties: [
          "Bệnh lý thần kinh",
          "Nội - Hồi sức thần kinh",
          "Bệnh tim mạch và lồng ngực",
          "Phẫu thuật tim mạch - lồng ngực",
          "Ngoại nhi và trẻ sơ sinh",
          "Bệnh lý tiêu hóa",
          "Phẫu thuật tiêu hóa",
          "Bệnh cột sống/thoát vị đĩa đệm",
          "Chi trên và y học thể thao",
          "Bệnh lý chi dưới",
          "Khám xương và điều trị ngoại trú",
          "Phẫu thuật chấn thương chung",
          "Phẫu thuật tạo hình - hàm mặt - thẩm mỹ",
          "Phục hồi chức năng",
          "Nhiễm khuẩn",
          "Phẫu thuật nhiễm khuẩn",
          "Bệnh đường tiết niệu",
          "Bệnh nam học/nam khoa",
          "Bệnh lý gan mật",
          "Ung buồu",
          "Thận lọc máu",
        ],
        importantNotes: [
          "Bệnh viện có nhiều khu khám bệnh, hiện tại BookingCare đang hỗ trợ đăng ký khám tại tòa nhà C4 - Khoa khám bệnh theo yêu cầu. Người bệnh đến khám dùng tòa nhà C4 để được hỗ trợ.",
          "Bệnh viện chuyên về Ngoại khoa nên lịch của các bác sĩ thường linh động và ưu tiên khám cho các ca cấp cứu.",
          "Mỗi bệnh nhân trong ngày chỉ được đặt trước 1 chuyên khoa, nếu đăng ký 2 chuyên khoa trở lên sẽ trao đổi bác sĩ thăm khám bạn đầu chuyên khẩm thêm khoa khác.",
        ],
        bookingInfo:
          "Từ nay, người bệnh có thể đặt lịch tại Khu khám bệnh theo yêu cầu, Bệnh viện Hữu nghị Việt Đức thông qua hệ thống đặt khám BookingCare.",
      },
    };

    this.setState({ facilityData });
  };

  // Xử lý thay đổi tab
  handleTabChange = (tabName) => {
    this.setState({ activeTab: tabName });
  };

  // Xử lý click vào chuyên khoa
  handleSpecialtyClick = (specialty) => {
    // Tạo slug từ tên chuyên khoa
    const slug = specialty.category
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");

    if (this.props.history) {
      // Navigate đến trang chuyên khoa với dữ liệu
      this.props.history.push(`/detail-specialty-department/${slug}`, {
        specialtyData: specialty,
        facilityName: this.state.facilityData.name,
      });
    }
  };

  render() {
    const { facilityData, activeTab } = this.state;

    if (!facilityData) {
      return (
        <div className="detail-facility-loading">
          <div className="loading-spinner">Đang tải thông tin...</div>
        </div>
      );
    }

    const { detailInfo } = facilityData;

    return (
      <div className="detail-medical-facility">
        <HomeHeader isShowBanner={false} />

        <div className="facility-hero-section">
          <div className="hero-content">
            <div className="hero-image">
              <img src={facilityData.image} alt={facilityData.name} />
            </div>
            <div className="hero-info">
              <div className="facility-logo">
                <i className="fas fa-hospital"></i>
              </div>
              <h1 className="facility-name">{facilityData.name}</h1>
              <p className="facility-address">
                <i className="fas fa-map-marker-alt"></i>
                {detailInfo.address}
              </p>
              <div className="working-hours">
                <h4>Thời gian làm việc:</h4>
                <p>
                  <strong>{detailInfo.workingHours.days}</strong>
                </p>
                <p>Sáng: {detailInfo.workingHours.morning}</p>
                <p>Chiều: {detailInfo.workingHours.afternoon}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="booking-section">
          <div className="booking-alert">
            <i className="fas fa-info-circle"></i>
            <span>Thông tin chi tiết về {facilityData.name}</span>
          </div>
        </div>

        <div className="facility-content">
          <div className="tabs-navigation">
            <button
              className={`tab-btn ${activeTab === "info" ? "active" : ""}`}
              onClick={() => this.handleTabChange("info")}
            >
              GIỚI THIỆU
            </button>
            <button
              className={`tab-btn ${
                activeTab === "specialties" ? "active" : ""
              }`}
              onClick={() => this.handleTabChange("specialties")}
            >
              THẾ MẠNH CHUYÊN MÔN
            </button>
            <button
              className={`tab-btn ${activeTab === "equipment" ? "active" : ""}`}
              onClick={() => this.handleTabChange("equipment")}
            >
              TRANG THIẾT BỊ
            </button>
            <button
              className={`tab-btn ${activeTab === "procedure" ? "active" : ""}`}
              onClick={() => this.handleTabChange("procedure")}
            >
              QUY TRÌNH KHÁM
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "info" && (
              <div className="info-content">
                <div className="booking-info-box">
                  <h3>Lưu ý quan trọng</h3>
                  <div className="booking-benefits">
                    <h4>
                      BookingCare là Nền tảng Y tế chăm sóc sức khỏe toàn diện
                      hàng đầu Việt Nam kết nối người dùng với trên 200 bệnh
                      viện - phòng khám uy tín, hơn 1.500 bác sĩ chuyên khoa
                      giỏi và hàng nghìn dịch vụ, sản phẩm y tế chất lượng cao.
                    </h4>
                    <p>{detailInfo.bookingInfo}</p>
                    <ul>
                      {detailInfo.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="about-section">
                  <h3>Địa chỉ:</h3>
                  <p>
                    <strong>
                      Bệnh viện có nhiều cống, bệnh nhân đến khám sẽ đến cống:
                    </strong>
                  </p>
                  <p>{detailInfo.address}</p>

                  <h3>Thời gian làm việc: {detailInfo.workingHours.days}</h3>
                  <p>Sáng: {detailInfo.workingHours.morning}</p>
                  <p>Chiều: {detailInfo.workingHours.afternoon}</p>

                  <p>{detailInfo.about}</p>

                  <p>
                    Việt Đức là địa chỉ uy tín hàng đầu về ngoại khoa, tiên hành
                    khám bệnh, chữa bệnh và thực hiện các kỹ thuật chụp chiều,
                    xét nghiệm, thăm dò chức năng cơ bản và chuyên sâu hàng ngày
                    cho người dân.
                  </p>

                  <p>
                    Bệnh viện có đội ngũ y bác sĩ hung hậu, nhiều người kiêm là
                    cán bộ giảng dạy tại Đại học Y khoa Hà Nội hoặc khoa Y Dược
                    - Đại học Quốc gia Hà Nội. Trong số họ nhiều người là chuyên
                    gia đầu ngành về bác sĩ giàu kinh nghiệm ở các chuyên khoa
                    khác nhau.
                  </p>

                  <h3>Lưu ý quan trọng</h3>
                  <ul>
                    {detailInfo.importantNotes.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>

                  <h3>Chi phí khám</h3>
                  <p>Người bệnh có thể lựa chọn một trong các gói khám sau:</p>
                  {detailInfo.servicePackages.map((pkg, pkgIndex) => (
                    <div key={pkgIndex} className="service-package">
                      <h4>{pkg.name}:</h4>
                      <ul>
                        {pkg.services.map((service, serviceIndex) => (
                          <li key={serviceIndex}>
                            {service.name} - Chi phí: {service.price}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "specialties" && (
              <div className="specialties-content">
                <h3>THẾ MẠNH CHUYÊN MÔN</h3>
                <p>
                  Bệnh viện Việt Đức là bệnh viện chuyên khoa Ngoại (phẫu
                  thuật), có thể mạnh về khám, điều trị và Phẫu thuật nhiều
                  chuyên khoa. Một số thế mạnh của Bệnh viện Việt Đức là:
                </p>

                {detailInfo.specialties.map((specialty, index) => (
                  <div
                    key={index}
                    className="specialty-item clickable"
                    onClick={() => this.handleSpecialtyClick(specialty)}
                  >
                    <h4>{specialty.category}</h4>
                    <p>{specialty.details}</p>
                    <div className="specialty-arrow">
                      <i className="fas fa-arrow-right"></i>
                    </div>
                  </div>
                ))}

                <h3>
                  Ngoài ra, bệnh viện khám, điều trị, phẫu thuật các chuyên khoa
                  khác như:
                </h3>
                <div className="other-specialties">
                  {detailInfo.otherSpecialties.map((specialty, index) => (
                    <span key={index} className="specialty-tag">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "equipment" && (
              <div className="equipment-content">
                <h3>TRANG THIẾT BỊ</h3>
                <p>
                  Bệnh viện được trang bị các thiết bị y tế hiện đại, phục vụ
                  cho việc chẩn đoán và điều trị:
                </p>
                <ul>
                  <li>Hệ thống máy chụp CT Scanner 64 lát cắt</li>
                  <li>Máy cộng hưởng từ MRI 1.5 Tesla</li>
                  <li>Hệ thống máy siêu âm 4D hiện đại</li>
                  <li>Máy nội soi đường tiêu hóa Olympus</li>
                  <li>Hệ thống phòng mổ hiện đại với áp suất dương</li>
                  <li>Thiết bị xét nghiệm tự động</li>
                </ul>
              </div>
            )}

            {activeTab === "procedure" && (
              <div className="procedure-content">
                <h3>QUY TRÌNH KHÁM</h3>
                <div className="procedure-steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h4>Đặt lịch khám</h4>
                      <p>
                        Đặt lịch trực tuyến qua hệ thống BookingCare hoặc gọi
                        hotline
                      </p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h4>Làm thủ tục</h4>
                      <p>Đến tòa nhà C4 làm thủ tục khám bệnh theo yêu cầu</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h4>Khám bệnh</h4>
                      <p>Được khám bởi bác sĩ chuyên khoa theo lịch hẹn</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h4>Tư vấn điều trị</h4>
                      <p>Nhận kết quả và hướng dẫn điều trị từ bác sĩ</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">5</div>
                    <div className="step-content">
                      <h4>Thanh toán</h4>
                      <p>Thanh toán chi phí khám và nhận hóa đơn</p>
                    </div>
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
  connect(mapStateToProps, mapDispatchToProps)(DetailMedicalFacility)
);
