import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import * as actions from "../../../store/actions";
import { LANGUAGE } from "../../../utils";
import { withRouter } from "react-router";
class OutStandingDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctors: [],
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
      this.setState({
        arrDoctors: this.props.topDoctorsRedux,
      });
    }

    // ✅ Thêm: Lắng nghe thay đổi từ listUsers
    if (prevProps.listUsers !== this.props.listUsers) {
      // Nếu không có topDoctors, dùng listUsers
      if (
        !this.props.topDoctorsRedux ||
        this.props.topDoctorsRedux.length === 0
      ) {
        this.setState({
          arrDoctors: this.props.listUsers,
        });
      }
    }
  }

  componentDidMount() {
    this.props.loadTopDoctors();
    this.props.fetchAllUsers(); // ✅ Thêm: Lấy danh sách users
    this.props.getPositionStart(); // ✅ QUAN TRỌNG: Load positions
    this.props.getGenderStart(); // ✅ Load genders để đầy đủ data
    this.props.getRoleStart(); // ✅ Load roles để đầy đủ data
  }
  handleViewDetailDoctor = (doctor) => {
    if (this.props.history) {
      this.props.history.push(`/detail-doctor/${doctor.id}`);
    }
  };

  render() {
    let arrDoctors = this.state.arrDoctors;
    let { language } = this.props;

    // ✅ Giữ nguyên logic layout, CHỈ thay data source
    let displayDoctors = [];

    // Lấy data từ UserRedux thay vì API
    if (this.props.listUsers && this.props.listUsers.length > 0) {
      let users = this.props.listUsers;
      displayDoctors = users.slice(0, 10); // Lấy 4 users đầu tiên
      displayDoctors = displayDoctors.concat(displayDoctors); // Duplicate như cũ
    } else {
      // Fallback: fake data giống y hệt code cũ
      displayDoctors = [
        {
          id: 1,
          firstName: "Thái Dương",
          lastName: "Giáo sư, Tiến Sĩ",
          specialty: "Cơ xương khớp",
          positionId: "P2",
        },
        {
          id: 2,
          firstName: "Thái Dương",
          lastName: "Giáo sư, Tiến Sĩ",
          specialty: "Cơ xương khớp",
          positionId: "P0",
        },
        {
          id: 3,
          firstName: "Thái Dương",
          lastName: "Giáo sư, Tiến Sĩ",
          specialty: "Cơ xương khớp",
          positionId: "P1",
        },
        {
          id: 4,
          firstName: "Thái Dương",
          lastName: "Giáo sư, Tiến Sĩ",
          specialty: "Cơ xương khớp",
          positionId: "P0",
        },
        {
          id: 5,
          firstName: "Thái Dương",
          lastName: "Giáo sư, Tiến Sĩ",
          specialty: "Cơ xương khớp",
          positionId: "P3",
        },
        {
          id: 6,
          firstName: "Thái Dương",
          lastName: "Giáo sư, Tiến Sĩ",
          specialty: "Cơ xương khớp",
          positionId: "P1",
        },
      ];
    }

    return (
      <div className="section-share section-outstanding-doctor">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">Bác sĩ nổi bật tuần qua</span>
            <button className="btn-section">xem thêm</button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {displayDoctors.map((item, index) => {
                if (index == 0) {
                  console.log("Doctor data:", item); // Debug để xem data
                }

                // ✅ Xử lý hiển thị ảnh từ database
                let imageBase64 = "";
                if (item.image) {
                  imageBase64 = new Buffer(item.image, "base64").toString(
                    "binary"
                  );
                }

                // ✅ Mapping position đầy đủ (P0→P4)
                let positionName = "Bác sĩ"; // Default

                if (
                  item.positionId &&
                  this.props.positionRedux &&
                  this.props.positionRedux.length > 0
                ) {
                  // Thử tìm theo keyMap trước (P0, P1, P2, P3, P4)
                  let foundPosition = this.props.positionRedux.find(
                    (pos) => pos.keyMap === item.positionId
                  );

                  // Nếu không tìm thấy, thử tìm theo valueVi (Bác sĩ, Thạc sĩ, Tiến sĩ, Phó giáo sư, Giáo sư)
                  if (!foundPosition) {
                    foundPosition = this.props.positionRedux.find(
                      (pos) => pos.valueVi === item.positionId
                    );
                  }

                  if (foundPosition) {
                    positionName = foundPosition.valueVi;
                  } else {
                    // Fallback: dùng trực tiếp positionId
                    positionName = item.positionId;
                  }
                }

                return (
                  <div
                    className="section-customize"
                    key={index}
                    onClick={() => this.handleViewDetailDoctor(item)}
                  >
                    <div className="outer-bg">
                      <div
                        className="bg-image section-outstanding-doctor"
                        style={{
                          backgroundImage: imageBase64
                            ? `url(${imageBase64})`
                            : undefined,
                          backgroundColor: imageBase64
                            ? "transparent"
                            : undefined,
                        }}
                      />
                    </div>
                    <div className="position text-center">
                      <div>
                        {/* ✅ Hiển thị position (Thạc sĩ, Tiến sĩ...) + tên từ UserRedux */}
                        {positionName}, {item.lastName} {item.firstName}
                      </div>
                      <div>
                        {/* ✅ Hiển thị chuyên khoa hoặc address */}
                        {item.specialty ||
                          item.address ||
                          "Chuyên khoa tổng quát"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    isLoggedIn: state.user.isLoggedIn,
    topDoctorsRedux: state.admin.topDoctors,
    listUsers: state.admin.users, // ✅ Thêm: Lấy users từ Redux
    genderRedux: state.admin.genders,
    positionRedux: state.admin.positions,
    roleRedux: state.admin.roles,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadTopDoctors: () => dispatch(actions.fetchTopDoctor()),
    fetchAllUsers: () => dispatch(actions.fetchAllUsersStart()), // ✅ Thêm: Action lấy users
    getPositionStart: () => dispatch(actions.fetchPositionStart()), // ✅ QUAN TRỌNG: Load positions
    getGenderStart: () => dispatch(actions.fetchGenderStart()), // ✅ Load genders
    getRoleStart: () => dispatch(actions.fetchRoleStart()), // ✅ Load roles
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor)
);
