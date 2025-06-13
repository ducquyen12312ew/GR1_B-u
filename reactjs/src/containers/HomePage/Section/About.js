import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl"; // If you are using internationalization

class About extends Component {
  render() {
    return (
      <div className="section-share section-about ">
        <div className="section-about-header">
          Truyền thông nói về bệnh viện của Thái Dương
        </div>
        <div className="section-about-content">
          <div className="content-left">
            <iframe
              width="914"
              height="514"
              src="https://www.youtube.com/embed/qjT7SAu8G0A"
              title="Tổng hợp Phòng khám Nam khoa gần đây theo quận tại Hà Nội"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
          <div className="content-right">
            <p>
              Khi đối mặt với những vấn đề tế nhị về sức khỏe sinh sản, việc tìm
              kiếm một địa chỉ khám nam khoa đáng tin cậy là điều mà cánh mày
              râu quan tâm. BookingCare hiểu điều đó và tổng hợp danh sách 20+
              phòng khám nam khoa uy tín tại Hà Nội, giúp bạn tiết kiệm thời
              gian và tìm được nơi khám chữa bệnh an tâm.{" "}
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
