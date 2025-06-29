import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils";
import { withRouter } from "react-router";

class OutStandingDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctors: [],
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Lắng nghe thay đổi từ topDoctorsRedux
    if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
      console.log("topDoctorsRedux updated:", this.props.topDoctorsRedux);
      this.setState({
        arrDoctors: this.props.topDoctorsRedux,
      });
    }

    // Fallback: Nếu không có topDoctors, dùng listUsers
    if (prevProps.listUsers !== this.props.listUsers) {
      console.log("listUsers updated:", this.props.listUsers);

      if (
        (!this.props.topDoctorsRedux ||
          this.props.topDoctorsRedux.length === 0) &&
        this.props.listUsers &&
        this.props.listUsers.length > 0
      ) {
        // Lọc bác sĩ - thử nhiều cách lọc
        let doctors = this.props.listUsers.filter((user) => {
          console.log("User role:", user.roleId, "User:", user);
          return (
            user.roleId === "R2" ||
            user.roleId === "Doctor" ||
            user.roleId === "Bác sĩ" ||
            user.roleId === "R1" || // Test: thử cả Admin để xem có data không
            true
          ); // Test: lấy tất cả user để debug
        });

        console.log("Filtered doctors:", doctors);

        this.setState({
          arrDoctors: doctors.slice(0, 6),
        });
      }
    }
  }

  componentDidMount() {
    this.props.loadTopDoctors();
    this.props.fetchAllUsers();
    this.props.getPositionStart();
    this.props.getGenderStart();
    this.props.getRoleStart();
  }

  handleViewDetailDoctor = (doctor) => {
    console.log("Clicked doctor:", doctor);
    if (this.props.history) {
      this.props.history.push(`/detail-doctor/${doctor.id}`);
    }
  };

  render() {
    let { arrDoctors } = this.state;
    let { language } = this.props;

    console.log("Render - arrDoctors:", arrDoctors);
    console.log("Render - positionRedux:", this.props.positionRedux);

    let displayDoctors = [];

    if (arrDoctors && arrDoctors.length > 0) {
      displayDoctors = arrDoctors;
      console.log("Using arrDoctors:", displayDoctors);
    } else {
      // Fallback data
      displayDoctors = [
        {
          id: 1,
          firstName: "Thái Dương",
          lastName: "Giáo sư",
          positionId: "P4",
          specialty: "Cơ xương khớp",
          address: "Hà Nội",
          image: null,
        },
        {
          id: 2,
          firstName: "Minh Hạnh",
          lastName: "Thạc sĩ",
          positionId: "P1",
          specialty: "Tim mạch",
          address: "Hà Nội",
          image: null,
        },
        {
          id: 3,
          firstName: "Văn Nam",
          lastName: "Tiến sĩ",
          positionId: "P2",
          specialty: "Nhi khoa",
          address: "TP.HCM",
          image: null,
        },
        {
          id: 4,
          firstName: "Thu Lan",
          lastName: "Bác sĩ",
          positionId: "P0",
          specialty: "Da liễu",
          address: "Đà Nẵng",
          image: null,
        },
      ];
      console.log("Using fallback data:", displayDoctors);
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
                console.log("Rendering doctor item:", item, "index:", index);

                // 🔧 FIX: Xử lý ảnh từ database với nhiều format
                let imageUrl = "";

                if (item.image) {
                  try {
                    console.log(
                      "Processing image for:",
                      item.firstName,
                      "image type:",
                      typeof item.image
                    );

                    if (typeof item.image === "string") {
                      // Nếu đã là string base64
                      if (item.image.startsWith("data:image")) {
                        imageUrl = item.image;
                      } else {
                        imageUrl = `data:image/jpeg;base64,${item.image}`;
                      }
                    } else if (
                      item.image.type === "Buffer" &&
                      item.image.data
                    ) {
                      // Nếu là Buffer object từ database
                      const base64String = Buffer.from(
                        item.image.data
                      ).toString("base64");
                      imageUrl = `data:image/jpeg;base64,${base64String}`;
                    } else {
                      // Thử convert trực tiếp
                      const base64String = Buffer.from(item.image).toString(
                        "base64"
                      );
                      imageUrl = `data:image/jpeg;base64,${base64String}`;
                    }

                    console.log(
                      "Image URL generated:",
                      imageUrl.substring(0, 50) + "..."
                    );
                  } catch (error) {
                    console.log(
                      "Error processing image for:",
                      item.firstName,
                      error
                    );
                  }
                }

                // 🔧 FIX: Mapping position với debug
                let positionName = "Bác sĩ";

                if (item.positionId) {
                  console.log(
                    "Looking for position:",
                    item.positionId,
                    "in:",
                    this.props.positionRedux
                  );

                  if (
                    this.props.positionRedux &&
                    this.props.positionRedux.length > 0
                  ) {
                    let foundPosition = this.props.positionRedux.find(
                      (pos) => pos.keyMap === item.positionId
                    );

                    if (foundPosition) {
                      positionName =
                        language === LANGUAGES.VI
                          ? foundPosition.valueVi
                          : foundPosition.valueEn;
                      console.log(
                        "Found position:",
                        foundPosition,
                        "mapped to:",
                        positionName
                      );
                    } else {
                      console.log("Position not found, using fallback");
                      // Fallback: mapping manual
                      const positionMap = {
                        P0: "Bác sĩ",
                        P1: "Thạc sĩ",
                        P2: "Tiến sĩ",
                        P3: "Phó giáo sư",
                        P4: "Giáo sư",
                      };
                      positionName =
                        positionMap[item.positionId] || item.positionId;
                    }
                  } else {
                    // Fallback mapping khi không có positionRedux
                    const positionMap = {
                      P0: "Bác sĩ",
                      P1: "Thạc sĩ",
                      P2: "Tiến sĩ",
                      P3: "Phó giáo sư",
                      P4: "Giáo sư",
                    };
                    positionName =
                      positionMap[item.positionId] || item.positionId;
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
                          backgroundImage: imageUrl
                            ? `url(${imageUrl})`
                            : undefined,
                          backgroundColor: imageUrl ? "transparent" : "#f0f0f0",
                        }}
                      />
                    </div>
                    <div className="position text-center">
                      <div>
                        {/* 🔧 FIX: Hiển thị đúng format: Position + LastName + FirstName */}
                        {positionName} {item.lastName} {item.firstName}
                      </div>
                      <div>
                        {/* 🔧 FIX: Hiển thị địa chỉ hoặc chuyên khoa */}
                        {item.address ||
                          item.specialty ||
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
    listUsers: state.admin.users,
    genderRedux: state.admin.genders,
    positionRedux: state.admin.positions,
    roleRedux: state.admin.roles,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadTopDoctors: () => dispatch(actions.fetchTopDoctor()),
    fetchAllUsers: () => dispatch(actions.fetchAllUsersStart()),
    getPositionStart: () => dispatch(actions.fetchPositionStart()),
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
    getRoleStart: () => dispatch(actions.fetchRoleStart()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor)
);
