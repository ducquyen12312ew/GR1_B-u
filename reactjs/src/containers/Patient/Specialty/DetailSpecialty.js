import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import HomeHeader from "../../HomePage/HomeHeader";
import EnhancedDoctorSchedule from "../Doctor/EnhancedDoctorSchedule";
import { getAllCodeService } from "../../../services/userService";
import _ from "lodash";
import { LANGUAGES } from "../../../utils";
import "./DetailSpecialty.scss";

// Import ảnh bác sĩ từ assets
import doctor1 from "../../../assets/doctor-1.webp";
import doctorDefault from "../../../assets/images/user.svg";

class DetailSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctorId: [],
      dataDetailSpecialty: {},
      listProvince: [],
      selectedProvince: "",
      selectedDistrict: "",
      districts: {},
      doctorsData: [],
      allDoctorsData: [],
      expandedDoctors: {},
      isSpecialtyExpanded: false,
    };
  }

  async componentDidMount() {
    this.initializeDistrictsData();
    this.loadProvinces();
    this.loadSpecialtyData();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      this.loadProvinces();
    }
  }

  initializeDistrictsData = () => {
    const districtsData = {
      "Hồ Chí Minh": [
        "Quận 1",
        "Quận 2",
        "Quận 3",
        "Quận 4",
        "Quận 5",
        "Quận 6",
        "Quận 7",
        "Quận 8",
        "Quận 9",
        "Quận 10",
        "Quận 11",
        "Quận 12",
        "Quận Bình Thạnh",
        "Quận Gò Vấp",
        "Quận Phú Nhuận",
        "Quận Tân Bình",
        "Quận Tân Phú",
        "Quận Thủ Đức",
        "Huyện Bình Chánh",
        "Huyện Cần Giờ",
        "Huyện Củ Chi",
        "Huyện Hóc Môn",
        "Huyện Nhà Bè",
      ],
      "Hà Nội": [
        "Ba Đình",
        "Hoàn Kiếm",
        "Tây Hồ",
        "Long Biên",
        "Cầu Giấy",
        "Đống Đa",
        "Hai Bà Trưng",
        "Hoàng Mai",
        "Thanh Xuân",
        "Sóc Sơn",
        "Đông Anh",
        "Gia Lâm",
        "Nam Từ Liêm",
        "Bắc Từ Liêm",
      ],
      "Đà Nẵng": [
        "Hải Châu",
        "Thanh Khê",
        "Sơn Trà",
        "Ngũ Hành Sơn",
        "Liên Chiểu",
        "Cẩm Lệ",
        "Hòa Vang",
        "Hoàng Sa",
      ],
      "Cần Thơ": [
        "Ninh Kiều",
        "Ô Môn",
        "Bình Thuỷ",
        "Cái Răng",
        "Thốt Nốt",
        "Vĩnh Thạnh",
        "Cờ Đỏ",
        "Phong Điền",
        "Thới Lai",
      ],
      "Bình Dương": [
        "Thủ Dầu Một",
        "Thuận An",
        "Dĩ An",
        "Tân Uyên",
        "Bắc Tân Uyên",
        "Bàu Bàng",
        "Dầu Tiếng",
        "Phú Giáo",
      ],
      "Đồng Nai": [
        "Biên Hòa",
        "Long Khánh",
        "Nhơn Trạch",
        "Vĩnh Cửu",
        "Tân Phú",
        "Thống Nhất",
        "Xuân Lộc",
        "Cẩm Mỹ",
        "Long Thành",
        "Định Quán",
        "Trảng Bom",
      ],
    };

    this.setState({ districts: districtsData });
  };

  loadProvinces = async () => {
    try {
      let res = await getAllCodeService("PROVINCE");
      if (res && res.errCode === 0) {
        this.setState({
          listProvince: res.data ? res.data : [],
        });
      }
    } catch (error) {
      console.log("Error loading provinces:", error);
      this.setState({
        listProvince: [
          { keyMap: "01", valueVi: "Hà Nội", valueEn: "Hanoi" },
          { keyMap: "79", valueVi: "Hồ Chí Minh", valueEn: "Ho Chi Minh" },
          { keyMap: "48", valueVi: "Đà Nẵng", valueEn: "Da Nang" },
          { keyMap: "92", valueVi: "Cần Thơ", valueEn: "Can Tho" },
          { keyMap: "74", valueVi: "Bình Dương", valueEn: "Binh Duong" },
          { keyMap: "75", valueVi: "Đồng Nai", valueEn: "Dong Nai" },
        ],
      });
    }
  };

  loadSpecialtyData = () => {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let specialtyId = this.props.match.params.id;

      const mockSpecialtyData = {
        id: specialtyId,
        name: "Cơ Xương Khớp",
        descriptionHTML: "Mock description",
      };

      const allDoctorsData = [
        // HÀ NỘI - 2 bác sĩ
        {
          id: 1,
          firstName: "Vũ Văn",
          lastName: "PGS. TS. BSCKII",
          fullName: "PGS. TS. BSCKII. Vũ Văn Hòe",
          position: "Phó giáo sư, Tiến sĩ",
          image: doctor1,
          specialty: "Cơ xương khớp",
          experience: "35 năm kinh nghiệm",
          description:
            "Bác sĩ có 35 năm kinh nghiệm với việc Cột sống, thần kinh, cơ xương khớp",
          province: "Hà Nội",
          district: "Ba Đình",
          details: {
            fullBio:
              "Phó chủ tịch Hội Phẫu thuật Cột sống Việt Nam. Bác sĩ nhận khám từ 7 tuổi trở lên",
            workplace: "Bệnh viện Bạch Mai - Ba Đình, Hà Nội",
            price: "500.000đ",
            achievements: [
              "35+ năm kinh nghiệm trong lĩnh vực Cơ Xương Khớp",
              "Phó chủ tịch Hội Phẫu thuật Cột sống Việt Nam",
              "Chuyên gia hàng đầu về phẫu thuật cột sống",
              "Đã thực hiện hơn 3000 ca phẫu thuật thành công",
            ],
          },
        },
        {
          id: 2,
          firstName: "Nguyễn Văn",
          lastName: "TS. BS",
          fullName: "TS. BS. Nguyễn Văn Thành",
          position: "Tiến sĩ, Bác sĩ",
          image:
            "https://cdn.bookingcare.vn/fo/w150/2023/11/08/094704-bs-thanh.jpg",
          specialty: "Cơ xương khớp",
          experience: "25 năm kinh nghiệm",
          description:
            "Nguyên Phó trưởng khoa Cơ Xương Khớp - Bệnh viện Bạch Mai",
          province: "Hà Nội",
          district: "Đống Đa",
          details: {
            fullBio:
              "Chuyên gia điều trị các bệnh lý về khớp, viêm khớp dạng thấp, thoái hóa khớp",
            workplace: "Bệnh viện Bạch Mai - Đống Đa, Hà Nội",
            price: "450.000đ",
            achievements: [
              "25+ năm kinh nghiệm tại Bệnh viện Bạch Mai",
              "Nguyên Phó trưởng khoa Cơ Xương Khớp",
              "Chuyên gia về viêm khớp dạng thấp",
              "Tham gia nhiều nghiên cứu khoa học quốc tế",
            ],
          },
        },

        // HỒ CHÍ MINH - 3 bác sĩ
        {
          id: 3,
          firstName: "Lê Minh",
          lastName: "PGS. TS",
          fullName: "PGS. TS. Lê Minh Đức",
          position: "Phó giáo sư, Tiến sĩ",
          image:
            "https://cdn.bookingcare.vn/fo/w150/2023/06/07/135531-bs-duc.jpg",
          specialty: "Cơ xương khớp",
          experience: "30 năm kinh nghiệm",
          description: "Chuyên gia hàng đầu về phẫu thuật thay khớp",
          province: "Hồ Chí Minh",
          district: "Quận 1",
          details: {
            fullBio:
              "Giám đốc Trung tâm Chấn thương Chỉnh hình - Bệnh viện Chợ Rẫy",
            workplace: "Bệnh viện Chợ Rẫy - Quận 1, TP.HCM",
            price: "600.000đ",
            achievements: [
              "30+ năm kinh nghiệm phẫu thuật chỉnh hình",
              "Giám đốc Trung tâm Chấn thương Chỉnh hình",
              "Chuyên gia về phẫu thuật thay khớp gối, khớp háng",
              "Đào tạo tại Đức và Mỹ",
            ],
          },
        },
        {
          id: 4,
          firstName: "Trần Thị",
          lastName: "BS. CKI",
          fullName: "BS. CKI. Trần Thị Mai",
          position: "Bác sĩ Chuyên khoa I",
          image:
            "https://cdn.bookingcare.vn/fo/w150/2023/09/12/141503-bs-mai.jpg",
          specialty: "Cơ xương khớp",
          experience: "20 năm kinh nghiệm",
          description: "Chuyên khoa Cơ Xương Khớp - Bệnh viện Ung Bướu",
          province: "Hồ Chí Minh",
          district: "Quận 3",
          details: {
            fullBio:
              "Chuyên gia điều trị nội khoa các bệnh lý cơ xương khớp không phẫu thuật",
            workplace: "Bệnh viện Ung Bướu - Quận 3, TP.HCM",
            price: "400.000đ",
            achievements: [
              "20+ năm kinh nghiệm tại Bệnh viện Ung Bướu",
              "Chuyên gia điều trị nội khoa cơ xương khớp",
              "Giỏi về chẩn đoán và điều trị loãng xương",
              "Tham gia nhiều chương trình đào tạo bác sĩ trẻ",
            ],
          },
        },
        {
          id: 5,
          firstName: "Phạm Thanh",
          lastName: "GS. TS",
          fullName: "GS. TS. Phạm Thanh Long",
          position: "Giáo sư, Tiến sĩ",
          image:
            "https://cdn.bookingcare.vn/fo/w150/2024/01/15/104521-gs-long.jpg",
          specialty: "Cơ xương khớp",
          experience: "40 năm kinh nghiệm",
          description: "Thầy thuốc Nhân dân - Nguyên Giám đốc BV Chợ Rẫy",
          province: "Hồ Chí Minh",
          district: "Quận 5",
          details: {
            fullBio:
              "Nguyên Giám đốc Bệnh viện Chợ Rẫy, chuyên gia hàng đầu về phẫu thuật cột sống và chấn thương chỉnh hình",
            workplace: "Bệnh viện Chợ Rẫy - Quận 5, TP.HCM",
            price: "800.000đ",
            achievements: [
              "40+ năm kinh nghiệm trong lĩnh vực Chấn thương Chỉnh hình",
              "Thầy thuốc Nhân dân",
              "Nguyên Giám đốc Bệnh viện Chợ Rẫy",
              "Tiên phong trong nhiều kỹ thuật phẫu thuật hiện đại",
            ],
          },
        },

        // ĐÀ NẴNG - 4 bác sĩ
        {
          id: 6,
          firstName: "Võ Minh",
          lastName: "PGS. TS",
          fullName: "PGS. TS. Võ Minh Tuấn",
          position: "Phó giáo sư, Tiến sĩ",
          image:
            "https://cdn.bookingcare.vn/fo/w150/2024/02/20/110532-bs-tuan.jpg",
          specialty: "Cơ xương khớp",
          experience: "28 năm kinh nghiệm",
          description: "Trưởng khoa Cơ Xương Khớp - Bệnh viện Đà Nẵng",
          province: "Đà Nẵng",
          district: "Hải Châu",
          details: {
            fullBio:
              "Trưởng khoa Cơ Xương Khớp Bệnh viện Đà Nẵng, chuyên gia về phẫu thuật nội soi khớp",
            workplace: "Bệnh viện Đà Nẵng - Hải Châu, Đà Nẵng",
            price: "450.000đ",
            achievements: [
              "28+ năm kinh nghiệm trong lĩnh vực Cơ Xương Khớp",
              "Trưởng khoa Cơ Xương Khớp Bệnh viện Đà Nẵng",
              "Chuyên gia về phẫu thuật nội soi khớp",
              "Đào tạo tại Nhật Bản về kỹ thuật phẫu thuật tiên tiến",
            ],
          },
        },
        {
          id: 7,
          firstName: "Nguyễn Thị",
          lastName: "TS. BS",
          fullName: "TS. BS. Nguyễn Thị Lan",
          position: "Tiến sĩ, Bác sĩ",
          image:
            "https://cdn.bookingcare.vn/fo/w150/2023/12/08/142033-bs-lan.jpg",
          specialty: "Cơ xương khớp",
          experience: "22 năm kinh nghiệm",
          description: "Phó khoa Cơ Xương Khớp - Bệnh viện C Đà Nẵng",
          province: "Đà Nẵng",
          district: "Thanh Khê",
          details: {
            fullBio:
              "Chuyên gia điều trị các bệnh lý thấp khớp và tự miễn dịch",
            workplace: "Bệnh viện C Đà Nẵng - Thanh Khê, Đà Nẵng",
            price: "380.000đ",
            achievements: [
              "22+ năm kinh nghiệm điều trị thấp khớp",
              "Phó khoa Cơ Xương Khớp Bệnh viện C",
              "Chuyên gia về bệnh lý tự miễn dịch",
              "Tham gia nhiều nghiên cứu quốc tế về thấp khớp",
            ],
          },
        },
        {
          id: 8,
          firstName: "Hoàng Văn",
          lastName: "BS. CKI",
          fullName: "BS. CKI. Hoàng Văn Nam",
          position: "Bác sĩ Chuyên khoa I",
          image:
            "https://cdn.bookingcare.vn/fo/w150/2024/03/15/093821-bs-nam.jpg",
          specialty: "Cơ xương khớp",
          experience: "18 năm kinh nghiệm",
          description: "Chuyên gia phẫu thuật cột sống - Bệnh viện Đà Nẵng",
          province: "Đà Nẵng",
          district: "Sơn Trà",
          details: {
            fullBio:
              "Chuyên sâu về phẫu thuật cột sống và điều trị chấn thương thể thao",
            workplace: "Bệnh viện Đà Nẵng - Sơn Trà, Đà Nẵng",
            price: "420.000đ",
            achievements: [
              "18+ năm kinh nghiệm phẫu thuật cột sống",
              "Chuyên gia điều trị chấn thương thể thao",
              "Bác sĩ đội tuyển bóng đá Đà Nẵng",
              "Đào tạo tại Hàn Quốc về kỹ thuật phẫu thuật tối thiểu",
            ],
          },
        },
        {
          id: 9,
          firstName: "Lê Thị",
          lastName: "BS. CKI",
          fullName: "BS. CKI. Lê Thị Hương",
          position: "Bác sĩ Chuyên khoa I",
          image:
            "https://cdn.bookingcare.vn/fo/w150/2023/10/22/151244-bs-huong.jpg",
          specialty: "Cơ xương khớp",
          experience: "15 năm kinh nghiệm",
          description: "Chuyên gia vật lý trị liệu và phục hồi chức năng",
          province: "Đà Nẵng",
          district: "Ngũ Hành Sơn",
          details: {
            fullBio:
              "Chuyên gia hàng đầu về vật lý trị liệu và phục hồi chức năng sau chấn thương",
            workplace: "Trung tâm Y tế Ngũ Hành Sơn - Đà Nẵng",
            price: "350.000đ",
            achievements: [
              "15+ năm kinh nghiệm vật lý trị liệu",
              "Chuyên gia phục hồi chức năng sau chấn thương",
              "Huấn luyện viên phục hồi thể thao chuyên nghiệp",
              "Tốt nghiệp thạc sĩ vật lý trị liệu tại Úc",
            ],
          },
        },
      ];

      this.setState({
        dataDetailSpecialty: mockSpecialtyData,
        allDoctorsData: allDoctorsData,
        doctorsData: allDoctorsData,
        arrDoctorId: allDoctorsData.map((doctor) => doctor.id),
      });
    }
  };

  handleOnChangeSelect = async (event) => {
    const selectedProvince = event.target.value;

    this.setState({
      selectedProvince: selectedProvince,
      selectedDistrict: "",
    });

    this.filterDoctorsByProvince(selectedProvince);
  };

  filterDoctorsByProvince = (provinceName) => {
    const { allDoctorsData } = this.state;

    if (!provinceName) {
      this.setState({
        doctorsData: allDoctorsData,
        arrDoctorId: allDoctorsData.map((doctor) => doctor.id),
      });
      return;
    }

    let provinceMap = {
      "01": "Hà Nội",
      79: "Hồ Chí Minh",
      48: "Đà Nẵng",
      92: "Cần Thơ",
      74: "Bình Dương",
      75: "Đồng Nai",
    };

    let targetProvince = provinceMap[provinceName] || provinceName;

    const filteredDoctors = allDoctorsData.filter(
      (doctor) => doctor.province === targetProvince
    );

    this.setState({
      doctorsData: filteredDoctors,
      arrDoctorId: filteredDoctors.map((doctor) => doctor.id),
    });

    console.log(
      `Filtered ${filteredDoctors.length} doctors for province: ${targetProvince}`
    );
  };

  handleDistrictChange = (event) => {
    const selectedDistrict = event.target.value;

    this.setState({
      selectedDistrict: selectedDistrict,
    });

    this.filterDoctorsByDistrict(selectedDistrict);
  };

  filterDoctorsByDistrict = (districtName) => {
    const { selectedProvince, allDoctorsData } = this.state;

    if (!selectedProvince) return;

    let provinceMap = {
      "01": "Hà Nội",
      79: "Hồ Chí Minh",
      48: "Đà Nẵng",
      92: "Cần Thơ",
      74: "Bình Dương",
      75: "Đồng Nai",
    };

    let targetProvince = provinceMap[selectedProvince] || selectedProvince;

    let filteredByProvince = allDoctorsData.filter(
      (doctor) => doctor.province === targetProvince
    );

    if (districtName) {
      filteredByProvince = filteredByProvince.filter(
        (doctor) => doctor.district === districtName
      );
    }

    this.setState({
      doctorsData: filteredByProvince,
      arrDoctorId: filteredByProvince.map((doctor) => doctor.id),
    });
  };

  handleToggleSpecialty = () => {
    this.setState((prevState) => ({
      isSpecialtyExpanded: !prevState.isSpecialtyExpanded,
    }));
  };

  handleToggleExpand = (doctorId) => {
    this.setState((prevState) => ({
      expandedDoctors: {
        ...prevState.expandedDoctors,
        [doctorId]: !prevState.expandedDoctors[doctorId],
      },
    }));
  };

  getFilteredDoctors = () => {
    return this.state.doctorsData;
  };

  renderDoctorDetails = (doctor) => {
    const isExpanded = this.state.expandedDoctors[doctor.id];

    return (
      <div className="doctor-item" key={doctor.id}>
        <div className="doctor-basic-info">
          <div className="doctor-avatar">
            <img
              src={doctor.image}
              alt={doctor.fullName}
              onError={(e) => {
                e.target.src = doctorDefault;
              }}
            />
          </div>
          <div className="doctor-info">
            <h4 className="doctor-name">{doctor.fullName}</h4>
            <p className="doctor-description">{doctor.description}</p>
            <p className="doctor-experience">{doctor.experience}</p>
            <p className="doctor-location">📍 {doctor.details.workplace}</p>
            <div className="doctor-actions">
              <button
                className="btn-expand"
                onClick={() => this.handleToggleExpand(doctor.id)}
              >
                {isExpanded ? "Thu gọn" : "Xem thêm"}
              </button>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="doctor-expanded-info">
            <div className="doctor-bio">
              <h5>Thông tin chi tiết:</h5>
              <p>{doctor.details.fullBio}</p>

              <h5>Thành tựu nổi bật:</h5>
              <ul>
                {doctor.details.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>

              <div className="doctor-schedule-info">
                <div className="schedule-section">
                  <h5>📅 Lịch khám:</h5>
                  <EnhancedDoctorSchedule
                    doctorIdFromParent={doctor.id}
                    showBookingModal={true}
                  />
                </div>

                <div className="price-section">
                  <h5>💰 Giá khám:</h5>
                  <p className="price">{doctor.details.price}</p>
                  <p className="note">Phí đặt lịch 0đ</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  render() {
    let {
      dataDetailSpecialty,
      listProvince,
      selectedProvince,
      selectedDistrict,
      districts,
      isSpecialtyExpanded,
    } = this.state;
    let { language } = this.props;

    const filteredDoctors = this.getFilteredDoctors();

    return (
      <div className="detail-specialty-container">
        <HomeHeader />
        <div className="detail-specialty-body">
          <div className="description-specialty">
            <div className="specialty-content">
              <h2>Chuyên khoa Cơ Xương Khớp</h2>
              <p>
                <strong>
                  Danh sách các bác sĩ uy tín đầu ngành Cơ Xương Khớp tại Việt
                  Nam:
                </strong>
              </p>
              <ul>
                <li>
                  Các chuyên gia có quá trình đào tạo bài bản, nhiều kinh nghiệm
                </li>
                <li>
                  Các giáo sư, phó giáo sư đang trực tiếp nghiên cứu và giảng
                  dạy tại Đại học Y khoa Hà Nội
                </li>
                <li>
                  Các bác sĩ đã, đang công tác tại các bệnh viện hàng đầu Khoa
                  Cơ Xương Khớp - Bệnh viện Bạch Mai, Bệnh viện Hữu nghị Việt
                  Đức,Bệnh viện E...
                </li>
              </ul>

              <div className="specialty-short-content">
                <h3>Bệnh Cơ Xương Khớp</h3>
                <ul>
                  <li>
                    <strong>Gout:</strong> Thoái hóa khớp gối, cột sống thắt
                    lưng, cột sống cổ
                  </li>
                  <li>
                    <strong>Viêm khớp dạng thấp:</strong> Viêm da khớp, Viêm gân
                  </li>
                  <li>
                    <strong>Trật dịch khớp gối:</strong> Trật dịch khớp hang,
                    Trật dịch khớp vai
                  </li>
                </ul>
              </div>

              {isSpecialtyExpanded && (
                <div className="specialty-full-content">
                  <ul>
                    <li>
                      Là thành viên hoặc lãnh đạo các tổ chức chuyên môn như
                      Hiệp hội Cơ Xương Khớp, Hội Thấp khớp học...
                    </li>
                    <li>
                      Được nhà nước công nhận các danh hiệu Thầy thuốc Nhân dân,
                      Thầy thuốc Ưu tú, Bác sĩ Cao cấp...
                    </li>
                  </ul>

                  <h3>Các bệnh lý khác</h3>
                  <ul>
                    <li>
                      <strong>Loãng xương:</strong> đau nhức xương
                    </li>
                    <li>
                      <strong>Viêm xương, gai xương</strong>
                    </li>
                    <li>
                      <strong>Viêm cơ, teo cơ, chứng đau mỏi cơ</strong>
                    </li>
                    <li>
                      <strong>Yếu cơ, Loạn dưỡng cơ</strong>
                    </li>
                    <li>
                      <strong>Các chấn thương về cơ, xương, khớp</strong>
                    </li>
                  </ul>

                  <h3>Phương pháp điều trị</h3>
                  <ul>
                    <li>
                      Điều trị nội khoa: Thuốc chống viêm, thuốc giảm đau, thuốc
                      chống loãng xương
                    </li>
                    <li>
                      Vật lý trị liệu: Tập luyện phục hồi chức năng, massage,
                      châm cứu
                    </li>
                    <li>
                      Phẫu thuật: Thay khớp nhân tạo, phẫu thuật cột sống, nội
                      soi khớp
                    </li>
                    <li>Tiêm khớp: Steroid, acid hyaluronic, PRP</li>
                  </ul>

                  <h3>Lời khuyên phòng ngừa</h3>
                  <ul>
                    <li>Duy trì cân nặng hợp lý để giảm áp lực lên khớp</li>
                    <li>Tập thể dục đều đặn với cường độ phù hợp</li>
                    <li>Bổ sung canxi và vitamin D đầy đủ</li>
                    <li>Tránh các hoạt động gây chấn thương khớp</li>
                    <li>Khám sức khỏe định kỳ để phát hiện sớm các bệnh lý</li>
                  </ul>
                </div>
              )}

              <div className="toggle-content">
                <button
                  className="btn-toggle-specialty"
                  onClick={this.handleToggleSpecialty}
                >
                  <span className="toggle-text">
                    {isSpecialtyExpanded ? "Ẩn bớt" : "Xem thêm"}
                  </span>
                  <i
                    className={`toggle-icon ${
                      isSpecialtyExpanded ? "expanded" : ""
                    }`}
                  >
                    ▼
                  </i>
                </button>
              </div>
            </div>
          </div>

          <div className="search-sp-doctor">
            <select
              onChange={(event) => this.handleOnChangeSelect(event)}
              value={selectedProvince}
              className="filter-select"
            >
              <option value="">
                <FormattedMessage id="homepage.choose-province" />
              </option>
              {listProvince &&
                listProvince.length > 0 &&
                listProvince.map((item, index) => {
                  return (
                    <option key={index} value={item.keyMap}>
                      {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                    </option>
                  );
                })}
              <option value="Hồ Chí Minh">Hồ Chí Minh</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Cần Thơ">Cần Thơ</option>
              <option value="Bình Dương">Bình Dương</option>
              <option value="Đồng Nai">Đồng Nai</option>
            </select>

            <select
              value={selectedDistrict}
              onChange={this.handleDistrictChange}
              className="filter-select"
              disabled={!selectedProvince}
            >
              <option value="">
                {selectedProvince ? "Chọn quận/huyện" : "Chọn tỉnh thành trước"}
              </option>
              {selectedProvince &&
                districts &&
                districts[selectedProvince] &&
                districts[selectedProvince].map((district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                ))}
              {/* Fallback cho các tỉnh được map */}
              {selectedProvince && !districts[selectedProvince] && (
                <>
                  {selectedProvince === "01" &&
                    districts["Hà Nội"] &&
                    districts["Hà Nội"].map((district, index) => (
                      <option key={index} value={district}>
                        {district}
                      </option>
                    ))}
                  {selectedProvince === "79" &&
                    districts["Hồ Chí Minh"] &&
                    districts["Hồ Chí Minh"].map((district, index) => (
                      <option key={index} value={district}>
                        {district}
                      </option>
                    ))}
                  {selectedProvince === "48" &&
                    districts["Đà Nẵng"] &&
                    districts["Đà Nẵng"].map((district, index) => (
                      <option key={index} value={district}>
                        {district}
                      </option>
                    ))}
                </>
              )}
            </select>
          </div>

          {filteredDoctors && filteredDoctors.length > 0 && (
            <div className="doctors-list">
              <div className="doctors-count">
                <p>
                  Tìm thấy <strong>{filteredDoctors.length}</strong> bác sĩ
                  chuyên khoa Cơ Xương Khớp
                  {selectedProvince && (
                    <span>
                      {" "}
                      tại{" "}
                      <strong>
                        {selectedProvince === "01"
                          ? "Hà Nội"
                          : selectedProvince === "79"
                          ? "Hồ Chí Minh"
                          : selectedProvince === "48"
                          ? "Đà Nẵng"
                          : selectedProvince}
                      </strong>
                    </span>
                  )}
                  {selectedDistrict && (
                    <span>
                      , <strong>{selectedDistrict}</strong>
                    </span>
                  )}
                </p>
              </div>
              {filteredDoctors.map((doctor) =>
                this.renderDoctorDetails(doctor)
              )}
            </div>
          )}

          {(!filteredDoctors || filteredDoctors.length === 0) && (
            <div className="no-doctor-found">
              <p>
                Không tìm thấy bác sĩ cho chuyên khoa này trong khu vực đã chọn.
              </p>
            </div>
          )}
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
