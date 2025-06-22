import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./HomeHeader.scss";
import SearchBar from "./SearchBar";
import logo from "../../assets/Logo Bệnh Viện Bạch Mai.svg";

class HomeHeader extends Component {
  // Xử lý click vào các menu chính
  handleMenuClick = (menuType) => {
    switch (menuType) {
      case "specialty":
        if (this.props.history) {
          this.props.history.push("/specialty");
        }
        break;
      case "facility":
        if (this.props.history) {
          this.props.history.push("/medical-facility");
        }
        break;
      case "doctor":
        if (this.props.history) {
          this.props.history.push("/doctor");
        }
        break;
      case "package":
        if (this.props.history) {
          this.props.history.push("/health-package");
        }
        break;
      default:
        break;
    }
  };

  // Xử lý click vào logo về trang chủ
  handleLogoClick = () => {
    if (this.props.history) {
      this.props.history.push("/home");
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="home-header-container">
          <div className="home-header-content">
            <div className="left-content">
              <i className="fas fa-bars"></i>
              <img
                className="header-logo"
                src={logo}
                alt="Hospital Logo"
                onClick={this.handleLogoClick}
              />
            </div>
            <div className="center-content">
              <div
                className="child-content"
                onClick={() => this.handleMenuClick("specialty")}
              >
                <div>
                  <b>Chuyên khoa</b>
                </div>
                <div className="subs-title">Tìm bác sĩ theo chuyên khoa</div>
              </div>
              <div
                className="child-content"
                onClick={() => this.handleMenuClick("facility")}
              >
                <div>
                  <b>Cơ sở y tế</b>
                </div>
                <div className="subs-title">Chọn bệnh viện phòng khám</div>
              </div>
              <div
                className="child-content"
                onClick={() => this.handleMenuClick("doctor")}
              >
                <div>
                  <b>Bác sĩ</b>
                </div>
                <div className="subs-title">Chọn bác sĩ giỏi</div>
              </div>
              <div
                className="child-content"
                onClick={() => this.handleMenuClick("package")}
              >
                <div>
                  <b>Gói khám</b>
                </div>
                <div className="subs-title">Khám sức khoẻ tổng quát</div>
              </div>
            </div>
            <div className="right-content">
              <div className="support">
                <i className="fas fa-question-circle"></i>Hỗ trợ
              </div>
              <div className="language-vi">VN</div>
              <div className="language-en">EN</div>
            </div>
          </div>
        </div>
        {this.props.isShowBanner === true && (
          <div className="home-header-banner">
            <div className="content-up">
              <div className="title1">NỀN TẢNG Y TẾ</div>
              <div className="title2">CHĂM SÓC SỨC KHOẺ TOÀN DIỆN</div>
              <div className="search-wrapper">
                <SearchBar history={this.props.history} />
              </div>
            </div>
            <div className="content-down">
              <div className="options">
                <div className="option-child">
                  <div className="icon-child">
                    <i className="far fa-hospital"></i>
                  </div>
                  <div className="text-child">Khám chuyên khoa</div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-mobile-alt"></i>
                  </div>
                  <div className="text-child">Khám từ xa</div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-procedures"></i>
                  </div>
                  <div className="text-child">Khám tổng quát</div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-vials"></i>
                  </div>
                  <div className="text-child">Xét nghiệm y học</div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-user-md"></i>
                  </div>
                  <div className="text-child">Sức khoẻ tinh thần</div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-briefcase-medical"></i>
                  </div>
                  <div className="text-child">Khám nha khoa</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomeHeader)
);
