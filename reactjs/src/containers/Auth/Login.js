import React, { useState } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";

import * as actions from "../../store/actions";

import "./Login.scss";
import { FormattedMessage } from "react-intl";
import { handleLoginApi } from "../../services/userService";

const Login = ({ userLoginSuccess, navigate, language }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleOnChangeUsername = (event) => {
    setUsername(event.target.value);
    console.log(event.target.value);
  };

  const handleOnChangePassword = (event) => {
    setPassword(event.target.value);
    console.log(event.target.value);
  };

  const handleLogin = async () => {
    setErrorMessage("");

    try {
      let data = await handleLoginApi(username, password);
      if (data && data.errorCode !== 0) {
        setErrorMessage(data.message);
      }
      if (data && data.errorCode === 0) {
        userLoginSuccess(data.user);
        console.log("login success");
        // Chuyển hướng sang trang home sau khi đăng nhập thành công
        navigate("/home");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.data) {
          setErrorMessage(error.response.data.message);
        }
      }
      console.log("thaiduong", error.response);
    }
  };

  const handleShowHidePassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <div className="login-content row">
          <div className="col-12 text-login">Login</div>
          <div className="col-12 form-group login-input">
            <label>Username:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your username"
              value={username}
              onChange={handleOnChangeUsername}
            />
          </div>
          <div className="col-12 form-group login-input">
            <label>Password:</label>
            <div className="custom-input-password">
              <input
                type={isShowPassword ? "text" : "password"}
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={handleOnChangePassword}
              />
              <span onClick={handleShowHidePassword}>
                <i
                  className={isShowPassword ? "far fa-eye" : "far fa-eye-slash"}
                ></i>
              </span>
            </div>
          </div>
          <div className="col-12" style={{ color: "red" }}>
            {errorMessage}
          </div>
          <div className="col-12">
            <button className="btn-login" onClick={handleLogin}>
              Login
            </button>
          </div>
          <div className="col-12">
            <span className="forgot-password">Forgot your password?</span>
          </div>
          <div className="col-12 text-center mt-3">
            <span className="text-other-login">Or Login with:</span>
          </div>
          <div className="col-12 social-login">
            <i className="fab fa-google-plus-g google"></i>
            <i className="fab fa-facebook-f facebook"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (path) => dispatch(push(path)),
    userLoginSuccess: (userInfo) =>
      dispatch(actions.userLoginSuccess(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
