import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./BookingModal.scss";
import { Modal } from "reactstrap";
import { toast } from "react-toastify";
import { saveBookingService } from "../../../../services/userService";

class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      selectedGender: "",
      genderDatForSelect: [
        { label: "Nam", value: "M" },
        { label: "Nữ", value: "F" },
        { label: "Khác", value: "O" },
      ],
    };
  }

  async componentDidMount() {}

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  handleOnChangeInput = (event, id) => {
    let valueInput = event.target.value;
    let stateCopy = { ...this.state };
    stateCopy[id] = valueInput;
    this.setState({
      ...stateCopy,
    });
  };

  handleConfirmBooking = async () => {
    // Validate dữ liệu đầu vào
    const { fullName, phoneNumber, email, address, reason, selectedGender } =
      this.state;

    console.log("=== DEBUG BOOKING DATA ===");
    console.log("Form data:", {
      fullName,
      phoneNumber,
      email,
      address,
      reason,
      selectedGender,
    });
    console.log("dataTime props:", this.props.dataTime);

    if (
      !fullName ||
      !phoneNumber ||
      !email ||
      !address ||
      !reason ||
      !selectedGender
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email không hợp lệ!");
      return;
    }

    // Validate phone number (Vietnamese format)
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast.error("Số điện thoại không hợp lệ!");
      return;
    }

    try {
      // Kiểm tra và format date từ timestamp sang MySQL format
      console.log("Raw date from props:", this.props.dataTime?.date);

      let formattedDate;
      const rawDate = this.props.dataTime?.date;

      if (!rawDate) {
        toast.error("Thông tin ngày khám không hợp lệ!");
        return;
      }

      // Convert string timestamp thành number
      let timestamp;
      if (typeof rawDate === "string") {
        timestamp = parseInt(rawDate, 10); // Convert string to number
      } else if (typeof rawDate === "number") {
        timestamp = rawDate;
      } else {
        toast.error("Định dạng ngày không được hỗ trợ!");
        return;
      }

      console.log("Parsed timestamp:", timestamp);

      // Tạo Date object từ timestamp
      const dateObject = new Date(timestamp);
      console.log("Date object:", dateObject);

      // Kiểm tra Date có hợp lệ không
      if (isNaN(dateObject.getTime())) {
        toast.error("Timestamp không hợp lệ!");
        return;
      }

      // Format thành MySQL datetime format
      formattedDate = dateObject.toISOString().slice(0, 19).replace("T", " ");
      console.log("Formatted date:", formattedDate);

      const requestData = {
        fullName: fullName,
        phoneNumber: phoneNumber,
        email: email,
        address: address,
        reason: reason,
        selectedGender: selectedGender,
        doctorId: this.props.dataTime?.doctorId,
        timeType: this.props.dataTime?.timeType,
        date: formattedDate,
      };

      console.log("=== REQUEST DATA TO SERVER ===");
      console.log("Full request:", requestData);

      // Gọi API để lưu booking
      let response = await saveBookingService(requestData);

      console.log("=== RESPONSE FROM SERVER ===");
      console.log("Response:", response);

      if (response && response.errorCode === 0) {
        toast.success(
          "Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất."
        );

        // Reset form và đóng modal
        this.setState({
          fullName: "",
          phoneNumber: "",
          email: "",
          address: "",
          reason: "",
          selectedGender: "",
        });

        this.props.closeBookingModal();
      } else {
        console.log("Server returned error:", response?.errorMessage);
        toast.error(
          `Đặt lịch không thành công: ${
            response?.errorMessage || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.log("=== CATCH ERROR ===");
      console.log("Full error object:", error);
      console.log("Error message:", error.message);
      console.log("Error response:", error.response);

      // Hiển thị thông tin lỗi chi tiết hơn
      if (error.response) {
        console.log("Response status:", error.response.status);
        console.log("Response data:", error.response.data);
        toast.error(
          `Lỗi server: ${
            error.response.data?.errorMessage || error.response.status
          }`
        );
      } else if (error.request) {
        console.log("No response received:", error.request);
        toast.error("Không thể kết nối đến server!");
      } else {
        toast.error(`Có lỗi xảy ra: ${error.message}`);
      }
    }
  };

  render() {
    let { isOpenModal, closeBookingModal, dataTime } = this.props;
    let { genderDatForSelect } = this.state;

    return (
      <Modal
        isOpen={isOpenModal}
        className={"booking-modal-container"}
        size="lg"
        centered
        backdrop={true}
      >
        <div className="booking-modal-content">
          <div className="booking-modal-header">
            <span className="left">Thông tin đặt lịch khám bệnh</span>
            <span className="right" onClick={closeBookingModal}>
              <i className="fas fa-times"></i>
            </span>
          </div>
          <div className="booking-modal-body">
            <div className="doctor-infor"></div>
            <div className="price">Giá khám 500.000VND</div>
            <div className="row">
              <div className="col-6 form-group">
                <label>Họ tên *</label>
                <input
                  className="form-control"
                  value={this.state.fullName}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "fullName")
                  }
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div className="col-6 form-group">
                <label>Số điện thoại *</label>
                <input
                  className="form-control"
                  value={this.state.phoneNumber}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "phoneNumber")
                  }
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div className="col-6 form-group">
                <label>Địa chỉ Email *</label>
                <input
                  className="form-control"
                  type="email"
                  value={this.state.email}
                  onChange={(event) => this.handleOnChangeInput(event, "email")}
                  placeholder="Nhập địa chỉ email"
                />
              </div>
              <div className="col-6 form-group">
                <label>Địa chỉ liên hệ *</label>
                <input
                  className="form-control"
                  value={this.state.address}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "address")
                  }
                  placeholder="Nhập địa chỉ liên hệ"
                />
              </div>
              <div className="col-12 form-group">
                <label>Lý do khám *</label>
                <input
                  className="form-control"
                  value={this.state.reason}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "reason")
                  }
                  placeholder="Nhập lý do khám bệnh"
                />
              </div>
              <div className="col-6 form-group">
                <label>Đặt cho ai</label>
                <input
                  className="form-control"
                  placeholder="Bản thân, con, bạn bè..."
                />
              </div>
              <div className="col-6 form-group">
                <label>Giới tính *</label>
                <select
                  className="form-control"
                  value={this.state.selectedGender}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "selectedGender")
                  }
                >
                  <option value="">Chọn giới tính</option>
                  {genderDatForSelect &&
                    genderDatForSelect.length > 0 &&
                    genderDatForSelect.map((item, index) => {
                      return (
                        <option key={index} value={item.value}>
                          {item.label}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>
          </div>
          <div className="booking-modal-footer">
            <button
              className="btn-booking-confirm"
              onClick={this.handleConfirmBooking}
            >
              Xác nhận
            </button>
            <button className="btn-booking-cancel" onClick={closeBookingModal}>
              Hủy
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
