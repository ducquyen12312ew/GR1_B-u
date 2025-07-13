import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../HomePage/HomeHeader";
import Home from "../../../routes/Home";
import "./DetailDoctor.scss";
import { getDetailInforDoctor } from "../../../services/userService";
import doctorImage from "../../../assets/doctor-1.webp";
import DoctorSchedule from "./DoctorSchedule";
class DetailDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailDoctor: {},
    };
  }

  async componentDidMount() {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      let res = await getDetailInforDoctor(id);
      console.log(res);
      if (res && res.errorCode === 0) {
        this.setState({
          detailDoctor: res.data,
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  render() {
    let { detailDoctor } = this.state;
    let { language } = this.props;
    let nameVi = "";
    if (detailDoctor && detailDoctor.positionData) {
      nameVi = `${detailDoctor.positionData.valueVi},${detailDoctor.lastName} ${detailDoctor.firstName}`;
    }
    return (
      <Fragment>
        <HomeHeader isShowBanner={false} />
        <div className="doctor-detail-container">
          <div className="intro-doctor">
            <div className="content-left">
              <img src={doctorImage} alt="Doctor" />
            </div>
            <div className="content-right">
              <div className="up">Phó giáo sư, Tiến sĩ Hoàng Thái Dương</div>
              <div className="down">
                Chuyên gia hơn 40 năm kinh nghiệm trong lĩnh vực bệnh lý Tiêu
                hóa
                <br />
                Nhiều năm kinh nghiệm trong việc điều trị các bệnh lý man tính
                như viêm dạ dày, hội chứng ruột kích thích, viêm da dày HP tái
                phát,...
                <br />
                Nguyên Giám đốc Bệnh viện Đại học Y Hà Nội
              </div>
            </div>
          </div>
          <div className="schedule-doctor">
            <div className="content-left">
              <DoctorSchedule
                doctorIdFromParent={
                  detailDoctor && detailDoctor.id ? detailDoctor.id : -1
                }
              />
            </div>
            <div className="content-right">
              <div className="doctor-extra-infor">
                <div className="title">ĐỊA CHỈ KHÁM</div>
                <div className="detail-address">
                  <strong>Bệnh viện Ung bướu Hưng Việt</strong>
                  <div>34 Đại Cồ Việt, Hai Bà Trưng, Hà Nội</div>
                </div>

                <div className="price-section">
                  <div className="price-label">
                    GIÁ KHÁM: <span className="price">500,000đ</span>
                    <span className="detail-link">Xem chi tiết</span>
                  </div>
                </div>

                <div className="insurance-section">
                  <div className="insurance-label">
                    LOẠI BẢO HIỂM ÁP DỤNG.
                    <span className="detail-link">Xem chi tiết</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="detail-infor-doctor">
            <ul>
              <li>
                Chuyên ngành Ngoại – Phẫu thuật Nội soi Tiêu hóa, Ổ bụng & các
                bệnh lý hậu môn, trực tràng
              </li>
              <li>Nguyên Chủ nhiệm Bộ môn Ngoại - Đại học Y Hà Nội</li>
              <li>Nguyên Giám đốc Bệnh viện Đại học Y Hà Nội</li>
              <li>Nguyên Phó Giám đốc Bệnh viện Việt Đức</li>
              <li>
                Nhiều năm kinh nghiệm trong việc điều trị các bệnh lý man tính
                như viêm dạ dày, hội chứng ruột kích thích, viêm da dày HP tái
                phát,...
              </li>
              <li>
                Trực tiếp thực hiện các kỹ thuật nội soi bao gồm nội soi dạ dày,
                đại tràng
              </li>
              <li>
                Được dành thời gian để giải thích rõ tình trạng bệnh và phác đồ
                điều trị, giúp người bệnh an tâm và hiểu rõ quá trình chăm sóc
                sức khỏe
              </li>
            </ul>

            <h3>Khám và điều trị</h3>
            <ul>
              <li>
                Giáo sư nhận khám, điều trị các bệnh lý khó về Tiêu hóa, hậu
                môn, trực tràng, gan mật.
              </li>
              <li>Trực tiếp tiến hành Nội soi tiêu hóa, dạ dày, đại tràng</li>
              <li>Khám, Nội soi, Xét nghiệm sàng lọc ung thư đại trực tràng</li>
              <li>Khám, Nội soi, Xét nghiệm sàng lọc ung thư dạ dày</li>
              <li>
                Khám, Nội soi, Xét nghiệm sàng lọc bệnh lý ung thư đường tiêu
                hóa
              </li>
              <li>
                Khám, Nội soi, tư vấn điều trị bệnh lý Hậu môn, Bệnh Trĩ Nội,
                Trĩ Ngoại.
              </li>
            </ul>

            <h3>Khám và điều trị các bệnh lý dạ dày</h3>
            <ul>
              <li>Gặp đi vật đường tiêu hóa</li>
              <li>Đau dạ dày</li>
              <li>Chảy máu dạ dày</li>
              <li>Đau thường vị</li>
              <li>Viêm dạ dày</li>
              <li>Loét dạ dày tá tràng</li>
              <li>Nhiễm Helicobacter pylori dạ dày (HP)</li>
              <li>Trào ngược dạ dày thực quản (Gerd)</li>
              <li>Tắc ruột</li>
              <li>Polyp dạ dày</li>
              <li>Chảy máu dạ dày</li>
              <li>Viêm dạ dày ruột Virus</li>
              <li>Viêm ruột thừa</li>
            </ul>
          </div>
          <div className="comment-doctor"></div>
        </div>
      </Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
