import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import UserManage from "../containers/System/UserManage";
import UserRedux from "../containers/System/Admin/UserRedux";
import Header from "../containers/Header/Header";
import ManageDoctor from "../containers/System/Admin/ManageDoctor";

class System extends Component {
  render() {
    const { systemMenuPath } = this.props;

    return (
      <React.Fragment>
        {/* 🔧 REMOVED: Bỏ check isLoggedIn - Hiển thị header luôn */}
        <Header />

        <div className="system-container">
          <div className="system-list">
            <Switch>
              {/* 🔧 Tất cả routes đều public - không cần đăng nhập */}
              <Route path="/system/user-manage" component={UserManage} />
              <Route path="/system/user-redux" component={UserRedux} />
              <Route path="/system/manage-doctor" component={ManageDoctor} />

              <Route
                component={() => {
                  return (
                    <Redirect to={systemMenuPath || "/system/user-manage"} />
                  );
                }}
              />
            </Switch>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn, // Giữ lại để tương thích
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
