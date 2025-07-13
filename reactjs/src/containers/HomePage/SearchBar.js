import React, { Component } from "react";
import { connect } from "react-redux";
import "./SearchBar.scss";

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
      suggestions: [],
      showSuggestions: false,
      selectedIndex: -1,
    };
    this.searchRef = React.createRef();
  }

  // Dữ liệu mẫu cho chuyên khoa và cơ sở y tế
  searchData = {
    specialties: [
      {
        id: 1,
        name: "Cơ Xương Khớp",
        type: "specialty",
        path: "/detail-specialty/1",
      },
      {
        id: 2,
        name: "Thần Kinh",
        type: "specialty",
        path: "/detail-specialty/2",
      },
      {
        id: 3,
        name: "Tim Mạch",
        type: "specialty",
        path: "/detail-specialty/3",
      },
      {
        id: 4,
        name: "Tiêu Hóa",
        type: "specialty",
        path: "/detail-specialty/4",
      },
      {
        id: 5,
        name: "Sản Phụ Khoa",
        type: "specialty",
        path: "/detail-specialty/5",
      },
      {
        id: 6,
        name: "Da Liễu",
        type: "specialty",
        path: "/detail-specialty/6",
      },
      {
        id: 7,
        name: "Tai Mũi Họng",
        type: "specialty",
        path: "/detail-specialty/7",
      },
      { id: 8, name: "Mắt", type: "specialty", path: "/detail-specialty/8" },
      {
        id: 9,
        name: "Nha Khoa",
        type: "specialty",
        path: "/detail-specialty/9",
      },
      {
        id: 10,
        name: "Nội Khoa",
        type: "specialty",
        path: "/detail-specialty/10",
      },
    ],
    medicalFacilities: [
      {
        id: 1,
        name: "Bệnh viện Đa Khoa An Việt",
        type: "facility",
        path: "/detail-medical-facility/1",
      },
      {
        id: 2,
        name: "Phòng Khám Phổi Quốc Tế An Đức",
        type: "facility",
        path: "/detail-medical-facility/2",
      },
      {
        id: 3,
        name: "Phòng Khám Chuyên Khoa Nội An Phước",
        type: "facility",
        path: "/detail-medical-facility/3",
      },
      {
        id: 4,
        name: "Nha Khoa Asia",
        type: "facility",
        path: "/detail-medical-facility/4",
      },
      {
        id: 5,
        name: "Viện Thẩm Mỹ Anchee Clinic",
        type: "facility",
        path: "/detail-medical-facility/5",
      },
      {
        id: 6,
        name: "Nha Khoa Alisa",
        type: "facility",
        path: "/detail-medical-facility/6",
      },
      {
        id: 7,
        name: "Bệnh viện Bạch Mai",
        type: "facility",
        path: "/detail-medical-facility/7",
      },
      {
        id: 8,
        name: "Bệnh viện Việt Đức",
        type: "facility",
        path: "/detail-medical-facility/8",
      },
    ],
  };

  // Xử lý thay đổi input
  handleInputChange = (e) => {
    const value = e.target.value;
    this.setState({ searchValue: value });

    if (value.trim() === "") {
      this.setState({ suggestions: [], showSuggestions: false });
      return;
    }

    // Tìm kiếm suggestions
    const suggestions = this.getSuggestions(value);
    this.setState({
      suggestions,
      showSuggestions: suggestions.length > 0,
      selectedIndex: -1,
    });
  };

  // Lấy suggestions dựa trên input
  getSuggestions = (value) => {
    const normalizeString = (str) => {
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // Loại bỏ dấu tiếng Việt
    };

    const searchTerm = normalizeString(value);
    const allData = [
      ...this.searchData.specialties,
      ...this.searchData.medicalFacilities,
    ];

    return allData.filter((item) => {
      const itemName = normalizeString(item.name);
      return itemName.includes(searchTerm);
    });
  };

  // Xử lý click vào suggestion
  handleSuggestionClick = (suggestion) => {
    this.setState({
      searchValue: suggestion.name,
      showSuggestions: false,
      selectedIndex: -1,
    });

    // Navigate đến trang tương ứng
    if (this.props.history) {
      this.props.history.push(suggestion.path);
    } else {
      window.location.href = suggestion.path;
    }
  };

  // Xử lý phím Enter và điều hướng bằng phím mũi tên
  handleKeyDown = (e) => {
    const { suggestions, selectedIndex, showSuggestions } = this.state;

    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.setState({
          selectedIndex:
            selectedIndex < suggestions.length - 1 ? selectedIndex + 1 : 0,
        });
        break;

      case "ArrowUp":
        e.preventDefault();
        this.setState({
          selectedIndex:
            selectedIndex > 0 ? selectedIndex - 1 : suggestions.length - 1,
        });
        break;

      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          this.handleSuggestionClick(suggestions[selectedIndex]);
        } else if (suggestions.length > 0) {
          this.handleSuggestionClick(suggestions[0]);
        }
        break;

      case "Escape":
        this.setState({ showSuggestions: false, selectedIndex: -1 });
        break;

      default:
        break;
    }
  };

  // Xử lý khi click ra ngoài
  handleClickOutside = (e) => {
    if (this.searchRef.current && !this.searchRef.current.contains(e.target)) {
      this.setState({ showSuggestions: false, selectedIndex: -1 });
    }
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  // Render icon cho từng loại
  renderSuggestionIcon = (type) => {
    return type === "specialty" ? (
      <i className="fas fa-stethoscope"></i>
    ) : (
      <i className="fas fa-hospital"></i>
    );
  };

  // Render label cho từng loại
  renderSuggestionLabel = (type) => {
    return type === "specialty" ? "Chuyên khoa" : "Cơ sở y tế";
  };

  render() {
    const { searchValue, suggestions, showSuggestions, selectedIndex } =
      this.state;

    return (
      <div className="search-bar-container" ref={this.searchRef}>
        <div className="search-input-wrapper">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Tìm chuyên khoa khám bệnh, cơ sở y tế..."
            value={searchValue}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
            autoComplete="off"
          />
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((suggestion, index) => (
              <div
                key={`${suggestion.type}-${suggestion.id}`}
                className={`suggestion-item ${
                  index === selectedIndex ? "selected" : ""
                }`}
                onClick={() => this.handleSuggestionClick(suggestion)}
              >
                <div className="suggestion-icon">
                  {this.renderSuggestionIcon(suggestion.type)}
                </div>
                <div className="suggestion-content">
                  <div className="suggestion-name">{suggestion.name}</div>
                  <div className="suggestion-type">
                    {this.renderSuggestionLabel(suggestion.type)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
