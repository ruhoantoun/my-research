import React, { Component } from "react";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import VisibilitySensor from "react-visibility-sensor";
import "./UserProfileMain.scss"; // Import file SCSS mới
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faExclamationTriangle, faFacebook, faTwitter, faLinkedin } from "@fortawesome/free-solid-svg-icons";

class UserProfileMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewedCounter: false,
        };
    }

    /**
     * Hiển thị trạng thái đang tải
     * @returns {JSX.Element} Component hiển thị loading
     */
    renderLoading = () => {
        return (
            <div className="loading-container">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
                <p className="mt-3">Đang tải thông tin chi tiết...</p>
            </div>
        );
    };

    /**
     * Hiển thị thông báo lỗi
     * @returns {JSX.Element} Component thông báo lỗi
     */
    renderError = () => {
        return (
            <div className="error-container">
                <div className="alert alert-danger" role="alert">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                    {this.props.error || "Không tìm thấy thông tin người dùng"}
                </div>
            </div>
        );
    };

    /**
     * Hiển thị thống kê người dùng với hiệu ứng đếm
     * @param {Array} stats - Mảng các thông số thống kê
     * @returns {JSX.Element} Component thống kê người dùng
     */
    renderUserStats = (stats) => {
        const { viewedCounter } = this.state;

        return (
            <div className="stats-area mt-4">
                <ul className="row">
                    {stats.map((stat, index) => (
                        <li key={index} className="col-12 mb-3">
                            <div className="count__content">
                                <div className="text">
                                    <VisibilitySensor
                                        partialVisibility
                                        offset={{ bottom: 200 }}
                                        onChange={(isVisible) => {
                                            if (isVisible && !this.state.viewedCounter) {
                                                this.setState({ viewedCounter: true });
                                            }
                                        }}
                                    >
                                        {({ isVisible }) => (
                                            <div>
                                                <CountUp start={0} end={isVisible || viewedCounter ? stat.countNum : 0} duration={2.5} suffix={stat.countSubtext} redraw={false}>
                                                    {({ countUpRef }) => <span className="counter" ref={countUpRef}></span>}
                                                </CountUp>
                                                <p>{stat.countTitle}</p>
                                            </div>
                                        )}
                                    </VisibilitySensor>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    render() {
        const { loading, error, userInfo } = this.props;

        // Hiển thị trạng thái loading
        if (loading) {
            return (
                <div className="profile-container">
                    <div className="container">{this.renderLoading()}</div>
                </div>
            );
        }

        // Hiển thị lỗi nếu có
        if (error || !userInfo) {
            return (
                <div className="profile-container">
                    <div className="container">{this.renderError()}</div>
                </div>
            );
        }

        // Dữ liệu thống kê người dùng
        const userStats = [
            {
                countNum: 85,
                countTitle: "Điểm tích lũy",
                countSubtext: "%",
            },
            {
                countNum: 24,
                countTitle: "Hoạt động đã tham gia",
                countSubtext: "",
            },
            {
                countNum: 3,
                countTitle: "Năm kinh nghiệm",
                countSubtext: "+",
            },
        ];

        // Lấy thông tin từ userInfo
        const { firstName, lastName, image, positionData, roleData, email, phoneNumber, userMarkdown, genderData } = userInfo;

        // Xử lý dữ liệu hiển thị
        const fullName = `${firstName || ""} ${lastName || ""}`.trim();
        const description = userMarkdown?.description || "Chưa có thông tin mô tả";
        const userDetails = userMarkdown?.contentHTML || "<p>Chưa có thông tin chi tiết</p>";
        const position = positionData?.valueVi || roleData?.valueVi || "Thành viên";

        return (
            <div className="profile-container">
                <div className="container">
                    <div className="row">
                        {/* Cột trái - Hình ảnh và thống kê người dùng */}
                        <div className="col-lg-4">
                            <div className="profile-card">
                                {/* Hình ảnh người dùng */}
                                <div className="user-image-container">
                                    {image ? (
                                        <img
                                            src={image}
                                            alt={fullName}
                                            className="img-fluid"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = require("../../assets/images/instructors/1.jpg");
                                            }}
                                        />
                                    ) : (
                                        <img src={require("../../assets/images/instructors/1.jpg")} alt="Ảnh mặc định" className="img-fluid" />
                                    )}
                                </div>

                                {/* Nút theo dõi sử dụng Bootstrap thay vì SVG */}
                                <div className="text-center mb-4">
                                    <Link to="#" className="follow-button">
                                        <span>Theo dõi</span>
                                        <i className="bi bi-plus-lg plus-icon"></i>
                                    </Link>
                                </div>

                                {/* Phần thống kê người dùng */}
                                {this.renderUserStats(userStats)}
                            </div>
                        </div>

                        {/* Cột phải - Thông tin chi tiết người dùng */}
                        <div className="col-lg-8">
                            <div className="user-details">
                                <ul className="user-section">
                                    <li className="user">
                                        <span className="name">Họ Và Tên:</span>
                                        <em>{fullName}</em>
                                    </li>
                                    <li>
                                        <span className="name">Chức Vụ:</span>
                                        <em>{position}</em>
                                    </li>
                                    {genderData && (
                                        <li>
                                            <span className="name">Giới tính:</span>
                                            <em>{genderData.valueVi || "Chưa cập nhật"}</em>
                                        </li>
                                    )}
                                    <li>
                                        <span className="name">Điện thoại:</span>
                                        <em>{phoneNumber || "Chưa cập nhật"}</em>
                                    </li>
                                    <li>
                                        <span className="name">Email:</span>
                                        <em>{email || "Chưa cập nhật"}</em>
                                    </li>
                                    <li className="social">
                                        <span className="name">Liên hệ:</span>
                                        <em>
                                            {/* Sử dụng biểu tượng từ Bootstrap */}
                                            <Link to="#">
                                                <i className="bi bi-facebook"></i>
                                            </Link>
                                            <Link to="#">
                                                <i className="bi bi-twitter"></i>
                                            </Link>
                                            <Link to="#">
                                                <i className="bi bi-linkedin"></i>
                                            </Link>
                                        </em>
                                    </li>
                                </ul>

                                {/* Phần giới thiệu */}
                                <h3>Giới thiệu</h3>
                                <p>{description}</p>

                                {/* Phần thông tin chi tiết */}
                                <h3>Thông tin chi tiết</h3>
                                <div dangerouslySetInnerHTML={{ __html: userDetails }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserProfileMain;
