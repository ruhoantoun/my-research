import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Breadcrumb from "../../components/Breadcrumb/EventBreadcrumbs";
import ScrollToTop from "../../components/ScrollTop";
import Logo from "../../assets/images/logos/logo2.png";
import ContactForm from "./ContactForm";
import { getEventById } from "../../services/eventServices";
import { toast } from "react-toastify";
import "./EventRegistration.scss";

class EventRegistration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventId: null,
            eventData: null,
            isLoading: true,
        };
    }

    async componentDidMount() {
        // Lấy eventId từ URL params
        const { match } = this.props;
        const eventId = match.params.id;

        if (eventId) {
            this.setState({ eventId });
            await this.fetchEventData(eventId);
        }
    }

    fetchEventData = async (eventId) => {
        try {
            // Gọi API lấy thông tin sự kiện theo ID
            const response = await getEventById(eventId);

            if (response && response.data.errCode === 0) {
                this.setState({
                    eventData: response.data.data,
                    isLoading: false,
                });
            } else {
                toast.error("Không thể tải thông tin sự kiện");
                this.setState({ isLoading: false });
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin sự kiện:", error);
            toast.error("Đã xảy ra lỗi khi tải thông tin sự kiện");
            this.setState({ isLoading: false });
        }
    };

    renderLoginRequired = () => {
        const { eventId } = this.state;

        return (
            <div className="container">
                <div className="login-required-container">
                    <div className="login-required-inner">
                        <div className="icon-container">
                            <i className="fas fa-user-lock"></i>
                        </div>
                        <h3>Bạn cần đăng nhập để đăng ký sự kiện</h3>
                        <p>
                            Vui lòng đăng nhập hoặc đăng ký tài khoản để tiếp
                            tục.
                        </p>

                        <div className="action-buttons">
                            <Link
                                to={`/login?redirect=/event-registration/${eventId}`}
                                className="login-button"
                            >
                                Đăng nhập ngay
                            </Link>
                            <Link to="/event" className="back-button">
                                Quay lại sự kiện
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    renderEventContent = () => {
        const { eventId, eventData, isLoading } = this.state;
        const { isLoggedIn } = this.props;

        if (isLoading) {
            return (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                    <p className="mt-3">Đang tải thông tin sự kiện...</p>
                </div>
            );
        }

        if (!eventData) {
            return (
                <div className="alert alert-warning text-center">
                    <p>
                        Không tìm thấy thông tin sự kiện. Vui lòng thử lại sau
                        hoặc liên hệ quản trị viên.
                    </p>
                    <button
                        className="btn btn-primary mt-3"
                        onClick={() => this.props.history.push("/event")}
                    >
                        Quay lại trang sự kiện
                    </button>
                </div>
            );
        }
        // Tính số slot còn trống
        const availableSlots =
            eventData.quantityMember - (eventData.registrationCount || 0);

        // Xác định trạng thái đăng ký
        let registrationStatus = "open";
        let registrationStatusText = "Mở đăng ký";
        let registrationStatusClass = "status-open";

        if (availableSlots <= 0) {
            registrationStatus = "full";
            registrationStatusText = "Hết chỗ";
            registrationStatusClass = "status-full";
        } else if (eventData.status?.keyName === "S2") {
            registrationStatus = "closed";
            registrationStatusText = "Đã kết thúc";
            registrationStatusClass = "status-closed";
        } else if (eventData.status?.keyName === "S3") {
            registrationStatus = "canceled";
            registrationStatusText = "Đã hủy";
            registrationStatusClass = "status-canceled";
        }
        return (
            <>
            <div className="event-detail-header mb-4">
                <div className="event-status-badges mt-3">
                    <span className={`status-badge ${registrationStatusClass}`}>
                        {registrationStatusText}
                    </span>
                    <span className="event-type-badge">
                        {eventData.eventType?.valueVi || "Sự kiện"}
                    </span>
                </div>
            </div>

            <div className="event-summary">
                <div className="row">
                    <div className="col-md-8">
                        <div className="event-info-section">
                            <h4>Thông tin sự kiện</h4>
                            
                            <div className="info-grid">
                                <div className="info-item">
                                    <div className="info-icon">
                                        <i className="far fa-calendar-alt"></i>
                                    </div>
                                    <div className="info-content">
                                        <span className="info-label">Ngày diễn ra</span>
                                        <span className="info-value">{new Date(eventData.date).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                </div>
                                
                                <div className="info-item">
                                    <div className="info-icon">
                                        <i className="far fa-clock"></i>
                                    </div>
                                    <div className="info-content">
                                        <span className="info-label">Thời gian</span>
                                        <span className="info-value">{eventData.startTime || '08:00'} - {eventData.endTime || '17:00'}</span>
                                    </div>
                                </div>
                                
                                <div className="info-item">
                                    <div className="info-icon">
                                        <i className="fas fa-map-marker-alt"></i>
                                    </div>
                                    <div className="info-content">
                                        <span className="info-label">Địa điểm</span>
                                        <span className="info-value">{eventData.address}</span>
                                    </div>
                                </div>
                                
                                <div className="info-item">
                                    <div className="info-icon">
                                        <i className="fas fa-users"></i>
                                    </div>
                                    <div className="info-content">
                                        <span className="info-label">Số lượng đăng ký</span>
                                        <span className="info-value">
                                            <span className="registration-count">{eventData.registrationCount || 0}</span>
                                            <span className="registration-separator">/</span>
                                            <span className="total-slots">{eventData.quantityMember}</span>
                                            <span className="available-slots">
                                                (Còn {availableSlots} chỗ trống)
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-4">
                        <div className="event-status-section">
                            <div className="cost-display">
                                <span className="cost-label">Chi phí tham gia:</span>
                                <span className="cost-value">
                                    {parseFloat(eventData.cost) > 0 
                                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(eventData.cost)
                                        : 'Miễn phí'}
                                </span>
                            </div>
                            
                            <div className="status-display">
                                <span className="status-label">Trạng thái:</span>
                                <span className="status-value">
                                    {eventData.status?.valueVi || "Đang diễn ra"}
                                </span>
                            </div>
                            
                            <div className="organizer-display">
                                <span className="organizer-label">Đơn vị tổ chức:</span>
                                <span className="organizer-value">{eventData.host || 'CTES'}</span>
                            </div>
                            
                            {eventData.contactPerson && (
                                <div className="contact-display">
                                    <span className="contact-label">Liên hệ:</span>
                                    <span className="contact-value">{eventData.contactPerson}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {registrationStatus === "full" ? (
                <div className="registration-full-notice">
                    <div className="notice-icon">
                        <i className="fas fa-exclamation-circle"></i>
                    </div>
                    <div className="notice-content">
                        <h4>Đã hết chỗ đăng ký!</h4>
                        <p>Sự kiện này đã đạt số lượng đăng ký tối đa. Vui lòng tham gia các sự kiện khác.</p>
                    </div>
                </div>
            ) : registrationStatus === "closed" || registrationStatus === "canceled" ? (
                <div className="registration-closed-notice">
                    <div className="notice-icon">
                        <i className="fas fa-ban"></i>
                    </div>
                    <div className="notice-content">
                        <h4>{registrationStatus === "closed" ? "Sự kiện đã kết thúc!" : "Sự kiện đã bị hủy!"}</h4>
                        <p>{registrationStatus === "closed" ? "Sự kiện này đã kết thúc đăng ký." : "Sự kiện này đã bị hủy vì lý do đặc biệt."}</p>
                    </div>
                </div>
            ) : !isLoggedIn ? (
                this.renderLoginRequired()
            ) : (
                <ContactForm 
                    eventId={eventId} 
                    eventData={eventData}
                />
            )}
        </>
        );
    };

    render() {
        const { eventData, isLoading } = this.state;
    
        // Hiển thị loading hoặc kiểm tra trước khi render
        if (isLoading || !eventData) {
            return (
                <>
                    <Header
                        parentMenu="event"
                        headerNormalLogo={Logo}
                        headerStickyLogo={Logo}
                    />
                    <div className="react-wrapper">
                        <div className="react-wrapper-inner">
                            <div className="container">
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Đang tải...</span>
                                    </div>
                                    <p className="mt-3">Đang tải thông tin sự kiện...</p>
                                </div>
                            </div>
                            <ScrollToTop />
                        </div>
                    </div>
                    <Footer />
                </>
            );
        }
    
        return (
            <>
                <Header
                    parentMenu="event"
                    headerNormalLogo={Logo}
                    headerStickyLogo={Logo}
                />
    
                <div className="react-wrapper">
                    <div className="react-wrapper-inner">
                        <Breadcrumb
                            eventID={eventData.id}
                            eventImg={eventData.eventMarkdown?.image}
                            eventBannerImg={eventData.eventMarkdown?.image}
                            eventDate={eventData.date}
                            eventStartTime={eventData.startTime || "08:00"}
                            eventEndTime={eventData.endTime || "17:00"}
                            eventCategory={eventData.eventType?.valueVi || "Sự kiện"}
                            eventTitle={eventData.name}
                            eventLocation={eventData.address}
                        />
    
                        <div className="container">
                            {this.renderEventContent()}
                        </div>
    
                        <ScrollToTop />
                    </div>
                </div>
    
                <Footer />
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        userInforr: state.user.userInforr,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(EventRegistration);
