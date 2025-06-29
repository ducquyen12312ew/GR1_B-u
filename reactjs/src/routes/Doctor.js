import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import ManageSchedule from "../containers/System/Doctor/ManageSchedule";
import Header from "../containers/Header/Header";

class Doctor extends Component {
  render() {
    return (
      <React.Fragment>
        {/* 🔧 REMOVED: Bỏ check isLoggedIn - Hiển thị header luôn */}
        <Header />

        <div className="system-container">
          <div className="system-list">
            <Switch>
              {/* 🔧 Routes public - không cần đăng nhập */}
              <Route
                path="/doctor/manage-schedule"
                component={ManageSchedule}
              />

              {/* 🔧 Default redirect */}
              <Route
                component={() => {
                  return <Redirect to="/doctor/manage-schedule" />;
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
    DoctorMenuPath: state.app.DoctorMenuPath,
    isLoggedIn: state.user.isLoggedIn, // Giữ lại để tương thích
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
