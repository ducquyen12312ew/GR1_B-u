import React, { Component } from "react";
import { connect } from "react-redux";
import "./MedicalFacility.scss";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";

// Import ảnh từ assets (tạo thư mục medical-facility trong assets)
import benhVienAnVietImg from "../../../assets/benh-vien-an-viet.jpg";
import phongKhamPhoiAnDucImg from "../../../assets/phong-kham-phoi-an-duc.jpg";
import phongKhamNoiAnPhuocImg from "../../../assets/phong-kham-noi-an-phuoc.jpg";
import nhaKhoaAsiaImg from "../../../assets/nha-khoa-asia.jpg";
import thamMyAncheeImg from "../../../assets/tham-my-anchee.jpg";
import nhaKhoaAlisaImg from "../../../assets/nha-khoa-alisa.jpg";

class MedicalFacility extends Component {
  handleFacilityClick = (facility) => {
    // Navigate đến trang chi tiết cơ sở y tế với URL đúng
    if (this.props.history) {
      this.props.history.push(`/detail-medical-facility/${facility.id}`);
    } else {
      // Fallback nếu không có history
      console.log("Navigate to medical facility detail:", facility);
      window.location.href = `/detail-medical-facility/${facility.id}`;
    }
  };

  render() {
    // Dữ liệu các cơ sở y tế nổi bật
    const medicalFacilities = [
      {
        id: 1,
        name: "Bệnh viện Đa Khoa An Việt",
        description: "Bệnh viện có nhiều cống, bệnh nhân đến khám sẽ đến cống",
        image: benhVienAnVietImg,
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
              details: "",
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
              category:
                "Khám, điều trị, phẫu thuật về Tạo hình-Hàm mặt-Thẩm mỹ",
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
      },
      {
        id: 2,
        name: "Phòng Khám Phổi Quốc Tế An Đức",
        description: "Chuyên khoa phổi với trang thiết bị hiện đại",
        image: phongKhamPhoiAnDucImg,
      },
      {
        id: 3,
        name: "Phòng Khám Chuyên Khoa Nội An Phước",
        description: "Chuyên điều trị các bệnh lý nội khoa",
        image: phongKhamNoiAnPhuocImg,
      },
      {
        id: 4,
        name: "Nha Khoa Asia",
        description: "Dịch vụ nha khoa toàn diện với công nghệ tiên tiến",
        image: nhaKhoaAsiaImg,
      },
      {
        id: 5,
        name: "Viện Thẩm Mỹ Anchee Clinic",
        description:
          "Viện thẩm mỹ uy tín với các dịch vụ làm đẹp chuyên nghiệp",
        image: thamMyAncheeImg,
      },
      {
        id: 6,
        name: "Nha Khoa Alisa",
        description: "Nha khoa chất lượng cao với dịch vụ tận tâm",
        image: nhaKhoaAlisaImg,
      },
    ];

    return (
      <div className="section-share section-medical-facility">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">Cơ sở y tế nổi bật</span>
            <button className="btn-section">xem thêm</button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {medicalFacilities.map((facility, index) => (
                <div
                  key={facility.id}
                  className="section-customize medical-facility-item"
                  onClick={() => this.handleFacilityClick(facility)}
                >
                  <div
                    className="bg-image section-medical-facility"
                    style={{
                      backgroundImage: `url(${facility.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                  <div className="medical-facility-name">{facility.name}</div>
                </div>
              ))}
            </Slider>
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

export default connect(mapStateToProps, mapDispatchToProps)(MedicalFacility);
