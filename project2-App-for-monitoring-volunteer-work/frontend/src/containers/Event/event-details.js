import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Breadcrumb from "../../components/Breadcrumb/EventBreadcrumbs";
import EventDetailsMain from "./EventDetailsMain";
import ScrollToTop from "../../components/ScrollTop";
import { getRecentEvents, getAllEvents } from "../../services/eventServices";
import { toast } from "react-toastify";
import Logo from "../../assets/images/logos/logo2.png";
import "./EventDetails.scss"; // Tạo file CSS mới cho component này

class EventDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event: null,
            isLoading: true,
            eventNotFound: false,
        };
    }

    async componentDidMount() {
        // Lấy ID từ URL params
        const { match } = this.props;
        const eventId = match.params.id;
        
        if (eventId) {
            await this.fetchEventDetail(eventId);
        }
    }

    fetchEventDetail = async (eventId) => {
        try {
            // Gọi API lấy thông tin sự kiện
            const response = await getAllEvents();
            
            if (response && response.data.errCode === 0) {
                const eventData = response.data.data.find(
                    (e) => e.id === Number(eventId)
                );
                
                if (eventData) {
                    this.setState({
                        event: eventData,
                        isLoading: false,
                    });
                } else {
                    // Đánh dấu sự kiện không tìm thấy thay vì chuyển hướng ngay
                    this.setState({
                        eventNotFound: true,
                        isLoading: false,
                    });
                    toast.error("Không tìm thấy sự kiện");
                    
                    // Trì hoãn chuyển hướng để toast hiển thị
                    setTimeout(() => {
                        this.props.history.push("/event");
                    }, 2000);
                }
            } else {
                toast.error("Không thể tải thông tin sự kiện");
                this.setState({ isLoading: false });
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Đã xảy ra lỗi khi tải thông tin sự kiện");
            this.setState({ isLoading: false });
        }
    };

    renderLoading = () => {
        return (
            <div className="loading-container">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
                <p className="loading-text">Đang tải thông tin sự kiện...</p>
            </div>
        );
    };

    renderEventNotFound = () => {
        return (
            <div className="event-not-found">
                <div className="container">
                    <div className="error-container">
                        <div className="error-icon">
                            <i className="fas fa-exclamation-triangle"></i>
                        </div>
                        <h3>Không tìm thấy sự kiện</h3>
                        <p>Sự kiện bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                        <p>Đang chuyển hướng về trang sự kiện...</p>
                    </div>
                </div>
            </div>
        );
    };

    renderEventContent = () => {
        const { event } = this.state;
        console.log("Event Data:", event);
        // console.log("Event Details:", event);
        return (
            <div className="course-single">
                <Header
                    parentMenu="event"
                    headerNormalLogo={Logo}
                    headerStickyLogo={Logo}
                />
                <div className="react-wrapper">
                    <div className="react-wrapper-inner">
                        <Breadcrumb
                            eventID={event.id}
                            eventImg={event.eventMarkdown?.image}
                            eventBannerImg={event.eventMarkdown?.image}
                            eventDate={event.date}
                            eventStartTime={event.startTime || "08:00"}
                            eventEndTime={event.endTime || "17:00"}
                            eventCategory={event.eventType?.valueVi || "Sự kiện"}
                            eventTitle={event.name}
                            eventLocation={event.address}
                        />

                        <EventDetailsMain
                            eventID={event.id}
                            eventImg={event.eventMarkdown?.image}
                            eventBannerImg={event.eventMarkdown?.image}
                            eventDate={event.date}
                            eventStartTime={event.startTime || "08:00"}
                            eventEndTime={event.endTime || "17:00"}
                            eventCategory={event.eventType?.valueVi}
                            eventTitle={event.name}
                            eventLocation={event.address}
                            eventCost={event.cost || "0"}
                            eventStatus={event.statusCode}
                            eventHost={"CTES"}
                            eventTotalSlot={event.quantityMember || 0}
                            eventBookedSlot={event.registrationCount || 0}
                            eventContactNo={event.contactPerson || "0123456789"}
                            eventDescription={event.eventMarkdown?.description}
                            eventContent={event.eventMarkdown?.contentHTML}
                        />

                        <ScrollToTop />
                    </div>
                </div>
                <Footer />
            </div>
        );
    };

    render() {
        const { isLoading, event, eventNotFound } = this.state;

        // Hiển thị loading
        if (isLoading) {
            return this.renderLoading();
        }
        
        // Hiển thị thông báo không tìm thấy sự kiện
        if (eventNotFound || !event) {
            return this.renderEventNotFound();
        }
        
        // Hiển thị chi tiết sự kiện
        return this.renderEventContent();
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

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);