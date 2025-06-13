import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../../store/actions";
import Navigator from "../../components/Navigator";
import { adminMenu, doctorMenu } from "./menuApp";
import "./Header.scss";
import _ from "lodash";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuApp: [],
    };
  }

  componentDidMount() {
    let { userInfo } = this.props;
    let menu = [];

    console.log("userInfo:", userInfo); // Debug log

    if (userInfo && !_.isEmpty(userInfo)) {
      let role = userInfo.roleId;
      console.log("roleId:", role); // Debug log

      // So sánh với string thực tế thay vì constant
      if (role === "Admin" || role === "Quản trị viên") {
        menu = adminMenu;
        console.log("Using adminMenu");
      } else if (role === "Bác sĩ" || role === "Doctor") {
        menu = doctorMenu;
        console.log("Using doctorMenu");
      }
    }

    console.log("Final menu:", menu); // Debug log

    this.setState({
      menuApp: menu,
    });
  }

  componentDidUpdate(prevProps) {
    // Cập nhật menu khi userInfo thay đổi
    if (prevProps.userInfo !== this.props.userInfo) {
      let { userInfo } = this.props;
      let menu = [];

      if (userInfo && !_.isEmpty(userInfo)) {
        let role = userInfo.roleId;

        if (role === "Admin" || role === "Quản trị viên") {
          menu = adminMenu;
        } else if (role === "Bác sĩ" || role === "Doctor") {
          menu = doctorMenu;
        }
      }

      this.setState({
        menuApp: menu,
      });
    }
  }

  render() {
    const { processLogout, userInfo } = this.props;

    return (
      <div className="header-container">
        {/* thanh navigator */}
        <div className="header-tabs-container">
          <Navigator menus={this.state.menuApp} />
        </div>
        <div className="languages">
          <span className="welcome">
            Welcome,{" "}
            {userInfo && userInfo.firstName ? userInfo.firstName : "Admin"}!
          </span>
          <span className="language-vi">VN</span>
          <span className="language-en">EN</span>
          {/* nút logout */}
          <div
            className="btn btn-logout"
            onClick={processLogout}
            title="Log out"
          >
            <i className="fas fa-sign-out-alt"></i>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    processLogout: () => dispatch(actions.processLogout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
