import React from "react";
import { Link } from "react-router-dom";
import "./EventDetailsMain.scss"; // Tạo file SCSS mới cho component

const EventDetailsMain = (props) => {
    const {
        eventID,
        eventDate,
        eventStartTime,
        eventEndTime,
        eventLocation,
        eventCost,
        eventHost,
        eventTotalSlot,
        eventBookedSlot,
        eventDescription,
        eventContent,
        eventCategory,
        eventStatus,
    } = props;
console.log("EventDetailsMain props:", props);
    // Format cost to VND
    const formatCost = (cost) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(cost);
    };

    // Tính số slot còn trống
    const availableSlots = eventTotalSlot - (eventBookedSlot || 0);

    // Xác định trạng thái đăng ký
    let registrationStatus = "open";
    let registrationStatusText = "Mở đăng ký";
    let registrationStatusClass = "status-open";

    if (availableSlots <= 0) {
        registrationStatus = "full";
        registrationStatusText = "Hết chỗ";
        registrationStatusClass = "status-full";
    } else if (eventStatus === "S2") {
        registrationStatus = "closed";
        registrationStatusText = "Đã kết thúc";
        registrationStatusClass = "status-closed";
    } else if (eventStatus === "S3") {
        registrationStatus = "canceled";
        registrationStatusText = "Đã hủy";
        registrationStatusClass = "status-canceled";
    }

    return (
        <div className="back__course__page_grid react-courses__single-page react-events__single-page pb---40 pt---120">
            <div className="container pb---70">
                {/* Tiêu đề và trạng thái sự kiện */}
                <div className="event-detail-header mb-4">
                    <div className="event-status-badges">
                        <span
                            className={`status-badge ${registrationStatusClass}`}
                        >
                            {registrationStatusText}
                        </span>
                        <span className="event-type-badge">
                            {eventCategory || "Sự kiện"}
                        </span>
                    </div>
                </div>

                <div className="row">
                    {/* Cột bên trái: Nội dung sự kiện */}
                    <div className="col-lg-8">
                        <div className="events-details">
                            <div className="event-summary-top mb-4">
                                <div className="info-item">
                                    <div className="info-icon">
                                        <i className="far fa-calendar-alt"></i>
                                    </div>
                                    <div className="info-content">
                                        <span className="info-label">
                                            Thời gian
                                        </span>
                                        <span className="info-value">
                                            {new Date(
                                                eventDate
                                            ).toLocaleDateString("vi-VN")}{" "}
                                            ({eventStartTime} - {eventEndTime})
                                        </span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <div className="info-icon">
                                        <i className="fas fa-map-marker-alt"></i>
                                    </div>
                                    <div className="info-content">
                                        <span className="info-label">
                                            Địa điểm
                                        </span>
                                        <span className="info-value">
                                            {eventLocation}
                                        </span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <div className="info-icon">
                                        <i className="fas fa-users"></i>
                                    </div>
                                    <div className="info-content">
                                        <span className="info-label">
                                            Số lượng
                                        </span>
                                        <span className="info-value">
                                            <span className="registration-count">
                                                {eventBookedSlot || 0}
                                            </span>
                                            <span className="registration-separator">
                                                /
                                            </span>
                                            <span className="total-slots">
                                                {eventTotalSlot}
                                            </span>
                                            <span className="available-slots">
                                                (Còn {availableSlots} chỗ trống)
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="event-description">
                                <h4>Mô tả sự kiện</h4>
                                <div className="description-content">
                                    {eventDescription}
                                </div>
                            </div>

                            <div className="event-content">
                                <h4>Nội dung chi tiết</h4>
                                <div
                                    className="content-html"
                                    dangerouslySetInnerHTML={{
                                        __html: eventContent,
                                    }}
                                ></div>
                            </div>

                            <ul className="mata-tags">
                                <li className="tags">Thể loại:</li>
                                <li>
                                    <Link to="#">{eventCategory}</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Cột bên phải: Thông tin đăng ký */}
                    <div className="col-lg-4 md-mt-60">
                        <div className="react-sidebar ml----30">
                            <div className="widget get-back-course">
                                <ul className="price__course">
                                    <li>
                                        <i className="icon_ribbon_alt"></i>
                                        Chi phí: <b>{formatCost(eventCost)}</b>
                                    </li>
                                    <li>
                                        <i className="icon_profile"></i>
                                        Đơn vị tổ chức: <b>{eventHost}</b>
                                    </li>
                                    <li>
                                        <i className="icon_group"></i>
                                        Số lượng thành viên:{" "}
                                        <b>{eventTotalSlot}</b>
                                    </li>
                                    <li>
                                        <i className="icon_clipboard"></i>
                                        Đã đăng ký:{" "}
                                        <b>{eventBookedSlot || 0}</b>
                                    </li>
                                </ul>

                                {registrationStatus === "full" ? (
                                    <div className="registration-status full">
                                        <i className="fas fa-exclamation-circle"></i>{" "}
                                        Đã hết chỗ
                                    </div>
                                ) : registrationStatus === "closed" ? (
                                    <div className="registration-status closed">
                                        <i className="fas fa-ban"></i> Đã kết
                                        thúc đăng ký
                                    </div>
                                ) : registrationStatus === "canceled" ? (
                                    <div className="registration-status canceled">
                                        <i className="fas fa-times-circle"></i>{" "}
                                        Đã hủy
                                    </div>
                                ) : (
                                    <Link
                                        to={`/event-registration/${eventID}`}
                                        className="start-btn"
                                    >
                                        Đăng ký tham gia
                                    </Link>
                                )}

                                {/* Thêm nút xem danh sách đăng ký trong phần sidebar */}
                                {registrationStatus !== "canceled" && (
                                    <Link
                                        to={`/event-registration-details/${eventID}`}
                                        className="start-btn"
                                    >
                                        Xem danh sách đăng ký
                                    </Link>
                                )}
                            </div>
                            {/* 
                            <div className="widget react-date-sec">
                                <h4 className="sidebar-title">Thông tin liên hệ</h4>
                                <ul className="recent-date">
                                    <li>
                                        Ngày:{" "}
                                        <b>
                                            {new Date(
                                                eventDate
                                            ).toLocaleDateString("vi-VN")}
                                        </b>
                                    </li>
                                    <li>
                                        Thời gian:{" "}
                                        <b>
                                            {eventStartTime} - {eventEndTime}
                                        </b>
                                    </li>
                                    <li>
                                        Địa điểm: <b>{eventLocation}</b>
                                    </li>
                                    <li>
                                        Liên hệ: <b>{eventContactNo}</b>
                                    </li>
                                </ul>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsMain;
