import React, { Component } from "react";
import { connect } from "react-redux";
import "./Specialty.scss";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";

// Import ảnh từ assets có sẵn
import coXuongKhopImg from "../../../assets/co-xuong-khop.jpg";
import thanKinhImg from "../../../assets/than-kinh.jpg";
import timMachImg from "../../../assets/tim-mach.jpg";
import tieuHoaImg from "../../../assets/tieu-hoa.jpg";
import sanPhuKhoaImg from "../../../assets/san-phu-khoa.jpg";
import daLieuImg from "../../../assets/da-lieu.png";
import taiMuiHongImg from "../../../assets/tai-mui-hong.png";
import matImg from "../../../assets/mat.png";

class Specialty extends Component {
  handleSpecialtyClick = (specialty) => {
    // Navigate đến trang chi tiết chuyên khoa với URL đúng
    if (this.props.history) {
      this.props.history.push(`/detail-specialty/${specialty.id}`, {
        specialtyData: specialty,
      });
    } else {
      // Fallback nếu không có history
      console.log("Navigate to specialty detail:", specialty);
      window.location.href = `/detail-specialty/${specialty.id}`;
    }
  };

  render() {
    // Dữ liệu chuyên khoa phổ biến từ BookingCare
    const specialties = [
      {
        id: 1,
        name: "Cơ Xương Khớp",
        description: "Khám và điều trị các bệnh lý về cơ, xương, khớp",
        image: coXuongKhopImg,
      },
      {
        id: 2,
        name: "Thần Kinh",
        description:
          "Chuyên khoa thần kinh, điều trị đau đầu, đau dây thần kinh",
        image: thanKinhImg,
      },
      {
        id: 3,
        name: "Tim Mạch",
        description: "Khám và điều trị các bệnh lý tim mạch, huyết áp",
        image: timMachImg,
      },
      {
        id: 4,
        name: "Tiêu Hóa",
        description: "Điều trị các bệnh lý đường tiêu hóa, gan mật",
        image: tieuHoaImg,
      },
      {
        id: 5,
        name: "Sản Phụ Khoa",
        description: "Chăm sóc sức khỏe phụ nữ, thai sản",
        image: sanPhuKhoaImg,
      },
      {
        id: 6,
        name: "Da Liễu",
        description: "Điều trị các bệnh lý về da, tóc, móng",
        image: daLieuImg,
      },
      {
        id: 7,
        name: "Tai Mũi Họng",
        description: "Khám và điều trị các bệnh lý tai, mũi, họng",
        image: taiMuiHongImg,
      },
      {
        id: 8,
        name: "Mắt",
        description: "Chăm sóc và điều trị các bệnh lý về mắt",
        image: matImg,
      },
    ];

    return (
      <div className="section-share section-specialty">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">Chuyên khoa phổ biến</span>
            <button className="btn-section">xem thêm</button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {specialties.map((specialty, index) => (
                <div
                  key={specialty.id}
                  className="section-customize specialty-item"
                  onClick={() => this.handleSpecialtyClick(specialty)}
                >
                  <div
                    className="bg-image section-specialty"
                    style={{
                      backgroundImage: `url(${specialty.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                  <div className="specialty-name">{specialty.name}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Specialty);
