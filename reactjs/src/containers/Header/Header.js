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
    // 🔧 REMOVED: Bỏ check userInfo - Hiển thị menu admin mặc định
    let menu = adminMenu; // Mặc định hiển thị admin menu cho tất cả user

    console.log("Using adminMenu for all users");

    this.setState({
      menuApp: menu,
    });
  }

  componentDidUpdate(prevProps) {
    // 🔧 REMOVED: Bỏ logic phân quyền menu
    // Giữ menu admin cho tất cả users
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
            Welcome, Guest!{" "}
            {/* 🔧 CHANGED: Hiển thị Guest thay vì check userInfo */}
          </span>
          <span className="language-vi">VN</span>
          <span className="language-en">EN</span>
          {/* 🔧 REMOVED: Bỏ nút logout vì không cần đăng nhập */}
          {/* <div
            className="btn btn-logout"
            onClick={processLogout}
            title="Log out"
          >
            <i className="fas fa-sign-out-alt"></i>
          </div> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn, // Giữ lại để tương thích
    userInfo: state.user.userInfo, // Giữ lại để tương thích
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    processLogout: () => dispatch(actions.processLogout()), // Giữ lại để tương thích
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
