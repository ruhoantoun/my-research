import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
// Thêm import các service cho thông báo
import { getUserNotifications, markNotificationAsRead } from "../../services/notificationServices";

import MenuItems from "./MenuItems";
import { languages } from "../../utils/constant";
import normalLogo from "../../assets/images/logos/logo.png";
import stickyLogo from "../../assets/images/logos/logo.png";
import "./index.scss";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuOpen: false,
            isVisible: false,
            userMenuOpen: false,
            // Thêm state mới cho thông báo
            notificationMenuOpen: false,
            notifications: [],
            unreadCount: 0,
            isLoadingNotifications: false,
            expandedNotificationId: null, // Thêm state mới để theo dõi thông báo đang mở rộng
        };

        // Tạo ref cho dropdown để xử lý click outside
        this.dropdownRef = React.createRef();
        // Thêm ref cho dropdown thông báo
        this.notificationRef = React.createRef();
    }

    // ===== Lifecycle Methods =====
    componentDidMount() {
        window.addEventListener("scroll", this.toggleVisibility);
        document.addEventListener("mousedown", this.handleClickOutside);

        // Nếu đã đăng nhập, tải thông báo
        if (this.props.isLoggedIn && this.props.userInforr?.id) {
            this.loadNotifications();
        }
    }

    // Thêm để cập nhật thông báo khi đăng nhập
    componentDidUpdate(prevProps) {
        if ((!prevProps.isLoggedIn && this.props.isLoggedIn) || (prevProps.userInforr?.id !== this.props.userInforr?.id && this.props.userInforr?.id)) {
            this.loadNotifications();
        }
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.toggleVisibility);
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    // ===== Notification Methods =====
    // Tải danh sách thông báo
    loadNotifications = async () => {
        if (!this.props.userInforr?.id) return;
        console.log("Loading notifications for user ID:", this.props.userInforr.id);
        const userInforr = this.props.userInforr;
        console.log("User ID:", userInforr);
        this.setState({ isLoadingNotifications: true });
        try {
            const response = await getUserNotifications(userInforr);

            if (response && response.data.errCode === 0) {
                const notifications = response.data.data;
                console.log("Notifications:", notifications);
                console.log("Notification clicked:", notifications[0].is_read);

                // Đếm số thông báo chưa đọc
                const unreadCount = notifications.filter((n) => !n.is_read).length;
                console.log("Unread Count:", unreadCount);
                this.setState({
                    notifications,
                    unreadCount,
                    isLoadingNotifications: false,
                });
            }
        } catch (error) {
            console.error("Lỗi khi tải thông báo:", error);
            this.setState({ isLoadingNotifications: false });
        }
    };

    // Xử lý khi click vào thông báo
    handleNotificationClick = async (notification, event) => {
        // Nếu đang click vào nút xem thêm/thu gọn, không thực hiện các thao tác khác
        if (event.target.classList.contains("expand-toggle")) {
            return;
        }

        // Nếu chưa đọc, đánh dấu là đã đọc
        if (!notification.is_read) {
            try {
                const data = {
                    notificationId: notification.id,
                    userId: this.props.userInforr.id,
                };
                console.log("Marking notification as read:", data);
                const response = await markNotificationAsRead(data);
                console.log("Phản hồi từ sever:", response);
                if (response && response.data.errCode === 0) {
                    // Cập nhật state
                    this.setState((prevState) => ({
                        notifications: prevState.notifications.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n)),
                        unreadCount: Math.max(0, prevState.unreadCount - 1),
                    }));
                }
            } catch (error) {
                console.error("Lỗi khi đánh dấu thông báo đã đọc:", error);
            }
        }

        // Đóng dropdown thông báo
        this.setState({ notificationMenuOpen: false });

        // Điều hướng nếu có link
        if (notification.link) {
            window.location.href = notification.link;
        }
    };

    // Định dạng thời gian thông báo
    formatNotificationTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) {
            return "Vừa xong";
        } else if (diffInSeconds < 3600) {
            return `${Math.floor(diffInSeconds / 60)} phút trước`;
        } else if (diffInSeconds < 86400) {
            return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
        } else {
            return date.toLocaleDateString("vi-VN");
        }
    };

    // ===== Header Visibility Controls =====
    toggleVisibility = () => {
        // Hiển thị sticky header sau khi cuộn 100px
        if (window.pageYOffset > 100) {
            this.setState({ isVisible: true });
        } else {
            this.setState({ isVisible: false });
        }
    };

    // ===== Menu Controls =====
    toggleMenu = () => {
        this.setState((prevState) => ({
            menuOpen: !prevState.menuOpen,
        }));
    };

    // ===== User Menu Controls =====
    toggleUserMenu = () => {
        this.setState((prevState) => ({
            userMenuOpen: !prevState.userMenuOpen,
        }));
    };

    // Toggle thông báo menu
    toggleNotificationMenu = () => {
        this.setState((prevState) => ({
            notificationMenuOpen: !prevState.notificationMenuOpen,
        }));
    };

    handleClickOutside = (event) => {
        // Đóng menu dropdown khi click ra ngoài
        if (this.dropdownRef && this.dropdownRef.current && !this.dropdownRef.current.contains(event.target)) {
            this.setState({ userMenuOpen: false });
        }

        // Đóng notification dropdown khi click ra ngoài
        if (this.notificationRef && this.notificationRef.current && !this.notificationRef.current.contains(event.target)) {
            this.setState({ notificationMenuOpen: false });
        }
    };

    // Thêm hàm mới để toggle xem thêm/thu gọn thông báo
    toggleNotificationExpand = (notificationId, event) => {
        event.stopPropagation(); // Ngăn event bubbling lên đến notification item

        this.setState((prevState) => ({
            expandedNotificationId: prevState.expandedNotificationId === notificationId ? null : notificationId,
        }));
    };

    // ===== Render Method =====
    render() {
        const { menuOpen, isVisible, userMenuOpen, notificationMenuOpen, notifications, unreadCount, isLoadingNotifications, expandedNotificationId } = this.state;

        const { topbarEnable, headerClass, parentMenu, headerNormalLogo, headerStickyLogo, isLoggedIn, userInforr, language } = this.props;

        return (
            <header id="react-header" className={headerClass ? headerClass : "react-header react-header-three"}>
                <div className={isVisible ? "header-area react-sticky" : "header-area"}>
                    {/* Topbar Area - Không thay đổi */}
                    {topbarEnable && (
                        <div className="topbar-area style1">
                            <div className="container">
                                <div className="row">
                                    {/* Contact Information */}
                                    <div className="col-lg-7">
                                        <div className="topbar-contact">
                                            <ul>
                                                <li>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="feather feather-phone"
                                                    >
                                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                                    </svg>
                                                    <a href="tel:(+84)0123456789"> (+84) 0123 456 789</a>
                                                </li>
                                                <li>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="feather feather-mail"
                                                    >
                                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                        <polyline points="22,6 12,13 2,6"></polyline>
                                                    </svg>
                                                    <a href="mailto:info@ctes.org">info@ctes.org</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Social Links */}
                                    <div className="col-lg-5 text-right">
                                        <div className="toolbar-sl-share">
                                            <ul className="social-links">
                                                <li>
                                                    <a href="#" aria-label="Facebook">
                                                        <span aria-hidden="true" className="social_facebook"></span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#" aria-label="Twitter">
                                                        <span aria-hidden="true" className="social_twitter"></span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#" aria-label="LinkedIn">
                                                        <span aria-hidden="true" className="social_linkedin"></span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== Menu Area ===== */}
                    <div className="menu-part">
                        <div className="container">
                            <div className="react-main-menu">
                                <nav>
                                    {/* Logo & Mobile Menu Toggle */}
                                    <div className="menu-toggle">
                                        <div className="logo">
                                            {isVisible ? (
                                                <Link to="/" className="logo-text">
                                                    <img src={headerStickyLogo || stickyLogo} alt="CTES Logo" />
                                                </Link>
                                            ) : (
                                                <Link to="/" className="logo-text">
                                                    <img src={headerNormalLogo || normalLogo} alt="CTES Logo" />
                                                </Link>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            id="menu-btn"
                                            className={menuOpen ? "mobile-menu-btn open" : "mobile-menu-btn"}
                                            onClick={this.toggleMenu}
                                            aria-label="Toggle menu"
                                        >
                                            <span className="icon-bar"></span>
                                            <span className="icon-bar"></span>
                                            <span className="icon-bar"></span>
                                        </button>
                                    </div>

                                    {/* Main Menu Content */}
                                    <div className={menuOpen ? "react-inner-menus menu-open" : "react-inner-menus"}>
                                        {/* Navigation Items */}
                                        <ul id="backmenu" className="react-menus react-sub-shadow">
                                            <MenuItems parentMenu={parentMenu} />
                                        </ul>

                                        {/* User Actions Area - Chỉnh sửa */}
                                        <div className="header-actions">
                                            {!isLoggedIn ? (
                                                // Login Button - Không thay đổi
                                                <div className="login-button">
                                                    <Link to="/login">
                                                        <i className="fas fa-sign-in-alt"></i> Đăng nhập
                                                    </Link>
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Thêm Bell Notification */}
                                                    <div className="notification-dropdown" ref={this.notificationRef}>
                                                        <button className="notification-btn" onClick={this.toggleNotificationMenu} aria-label="Thông báo">
                                                            <i className="fas fa-bell"></i>
                                                            {unreadCount > 0 && <span className="notification-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>}
                                                        </button>

                                                        {/* Dropdown thông báo */}
                                                        {notificationMenuOpen && (
                                                            <div className="notification-dropdown-menu">
                                                                <div className="notification-header">
                                                                    <h5>Thông báo</h5>
                                                                </div>

                                                                <div className="notification-body">
                                                                    {isLoadingNotifications ? (
                                                                        <div className="loading-notifications">
                                                                            <p>Đang tải thông báo...</p>
                                                                        </div>
                                                                    ) : notifications.length > 0 ? (
                                                                        notifications.slice(0, notifications.length).map((notification) => (
                                                                            <div
                                                                                key={notification.id}
                                                                                className={`notification-item ${!notification.is_read ? "unread" : ""}`}
                                                                                onClick={(e) => this.handleNotificationClick(notification, e)}
                                                                            >
                                                                                <div className="notification-icon">
                                                                                    {notification.type === "event_created" && <i className="fas fa-calendar-plus"></i>}
                                                                                    {notification.type === "help_request" && <i className="fas fa-hands-helping"></i>}
                                                                                    {notification.type === "event_updated" && <i className="fas fa-calendar-check"></i>}
                                                                                    {notification.type === "event_summary" && <i className="fas fa-star"></i>}
                                                                                    {notification.type === "event_canceled" && <i className="fas fa-calendar-times"></i>}
                                                                                    {![
                                                                                        "event_created",
                                                                                        "help_request",
                                                                                        "event_updated",
                                                                                        "event_summary",
                                                                                        "event_canceled",
                                                                                    ].includes(notification.type) && <i className="fas fa-bell"></i>}
                                                                                </div>
                                                                                <div className="notification-content">
                                                                                    <h6>{notification.title}</h6>
                                                                                    <p className={expandedNotificationId === notification.id ? "expanded" : ""}>
                                                                                        {notification.message}
                                                                                    </p>
                                                                                    {/* Thêm nút "Xem thêm" hoặc "Thu gọn" */}
                                                                                    {notification.message && notification.message.length > 75 && (
                                                                                        <button
                                                                                            className="expand-toggle"
                                                                                            onClick={(e) => this.toggleNotificationExpand(notification.id, e)}
                                                                                        >
                                                                                            {expandedNotificationId === notification.id ? "Thu gọn" : "Xem thêm"}
                                                                                        </button>
                                                                                    )}
                                                                                    <small>{this.formatNotificationTime(notification.created_at)}</small>
                                                                                </div>
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <div className="no-notifications">
                                                                            <p>Không có thông báo nào</p>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* <div className="notification-footer">
                                                                    <Link to="/notifications" className="view-all" onClick={() => this.setState({ notificationMenuOpen: false })}>
                                                                        Xem tất cả thông báo
                                                                    </Link>
                                                                </div> */}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* User Dropdown - Không thay đổi */}
                                                    <div className="user-dropdown" ref={this.dropdownRef}>
                                                        <div className="dropdown">
                                                            <button
                                                                className="btn btn-secondary dropdown-toggle"
                                                                type="button"
                                                                onClick={this.toggleUserMenu}
                                                                aria-label="User menu"
                                                            >
                                                                {userInforr?.lastName || "User"}
                                                                {userInforr?.image ? (
                                                                    <img src={userInforr.image} alt="User Avatar" className="dropdown-avatar" />
                                                                ) : (
                                                                    <span className="dropdown-avatar-placeholder">
                                                                        {userInforr?.firstName?.charAt(0) || userInforr?.lastName?.charAt(0) || "U"}
                                                                    </span>
                                                                )}
                                                            </button>

                                                            {/* User Dropdown Menu */}
                                                            {userMenuOpen && (
                                                                <div className="dropdown-menu show">
                                                                    <Link to={`/user-profile/profile/${this.props.userInforr?.id}`} className="dropdown-item" onClick={() => this.setState({ userMenuOpen: false })}>
                                                                        <i className="fas fa-user"></i> Hồ sơ cá nhân
                                                                    </Link>

                                                                    {/* Admin Option - Only For Admins */}
                                                                    {userInforr?.roleId === "R1" && (
                                                                        <Link
                                                                            to="/system/user-display"
                                                                            className="dropdown-item"
                                                                            onClick={() => this.setState({ userMenuOpen: false })}
                                                                        >
                                                                            <i className="fas fa-cogs"></i> Quản trị hệ thống
                                                                        </Link>
                                                                    )}

                                                                    <div className="dropdown-divider"></div>

                                                                    {/* Logout Option */}
                                                                    <a
                                                                        className="dropdown-item"
                                                                        onClick={() => {
                                                                            this.props.processLogout();
                                                                            this.setState({ userMenuOpen: false });
                                                                            window.location.href = "/home";
                                                                        }}
                                                                    >
                                                                        <i className="fas fa-sign-out-alt"></i> Đăng xuất
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

// Redux Connection
const mapStateToProps = (state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInforr: state.user.userInforr,
    language: state.app.language,
});

const mapDispatchToProps = (dispatch) => ({
    processLogout: () => dispatch(actions.processLogout()),
    changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
