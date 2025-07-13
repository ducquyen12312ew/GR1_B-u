import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl"; // If you are using internationalization

class HomeFooter extends Component {
  render() {
    return (
      <div className="home-footer ">
        <p>
          &copy; 2025 ThaiDuong. More information, please visit my youtube
          channel.
          <a target="_blank" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
            {" "}
            &#8594; Click here &#8592;
          </a>
        </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
