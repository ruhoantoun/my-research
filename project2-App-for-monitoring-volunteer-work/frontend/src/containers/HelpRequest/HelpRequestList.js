import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Breadcrumb from "../../components/Breadcrumb/EventBreadcrumbs";
import ScrollToTop from "../../components/ScrollTop";
import { toast } from "react-toastify";
import axios from "axios";
import "./HelpRequest.scss";
import { getAllHelpRequests } from "../../services/userServices";

class HelpRequestList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            helpRequests: [],
            isLoading: true,
            filters: {
                status: "all",
                urgencyLevel: "all",
                helpType: "all",
                searchText: "",
            },
            selectedRequest: null,
            showDetailModal: false,
        };
    }

    componentDidMount() {
        this.fetchHelpRequests();
    }

    fetchHelpRequests = async () => {
        try {
            this.setState({ isLoading: true });
            // Gọi API để lấy danh sách yêu cầu hỗ trợ
            const response = await getAllHelpRequests();
            
            if (response && response.data.errCode === 0) {
                this.setState({
                    helpRequests: response.data.data || [],
                });
                console.log("Dữ liệu yêu cầu hỗ trợ:", response.data.data);
            } else {
                toast.error("Không thể tải danh sách yêu cầu");
            }
        } catch (error) {
            console.error("Error fetching help requests:", error);
            toast.error("Đã xảy ra lỗi khi tải danh sách yêu cầu");
        } finally {
            this.setState({ isLoading: false });
        }
    };

    handleViewDetail = (request) => {
        this.setState({
            selectedRequest: request,
            showDetailModal: true
        });
    };

    handleCloseModal = () => {
        this.setState({
            showDetailModal: false,
            selectedRequest: null
        });
    };

    // Hiển thị badge trạng thái
    renderStatusBadge = (status) => {
        let badgeClass = "";
        let statusText = "";

        switch (status) {
            case "pending":
                badgeClass = "badge-warning";
                statusText = "Chờ xử lý";
                break;
            case "processing":
                badgeClass = "badge-info";
                statusText = "Đang xử lý";
                break;
            case "resolved":
                badgeClass = "badge-success";
                statusText = "Đã giải quyết";
                break;
            case "rejected":
                badgeClass = "badge-danger";
                statusText = "Từ chối";
                break;
            default:
                badgeClass = "badge-secondary";
                statusText = "Không xác định";
        }

        return <span className={`status-badge ${badgeClass}`}>{statusText}</span>;
    };

    // Hiển thị mức độ khẩn cấp
    renderUrgencyBadge = (urgencyLevel) => {
        let badgeClass = "";
        let urgencyText = "";

        switch (urgencyLevel) {
            case "low":
                badgeClass = "badge-info";
                urgencyText = "Thấp";
                break;
            case "medium":
                badgeClass = "badge-primary";
                urgencyText = "Trung bình";
                break;
            case "high":
                badgeClass = "badge-warning";
                urgencyText = "Cao";
                break;
            case "urgent":
                badgeClass = "badge-danger";
                urgencyText = "Rất cao";
                break;
            default:
                badgeClass = "badge-secondary";
                urgencyText = "Không xác định";
        }

        return <span className={`urgency-badge ${badgeClass}`}>{urgencyText}</span>;
    };

    // Chuyển đổi help_type thành văn bản tiếng Việt
    renderHelpType = (helpType) => {
        switch (helpType) {
            case "academic":
                return "Học tập / Bài tập";
            case "financial":
                return "Tài chính / Học phí";
            case "mental":
                return "Tâm lý / Tư vấn";
            case "technical":
                return "Kỹ thuật / CNTT";
            case "facility":
                return "Cơ sở vật chất";
            case "documents":
                return "Thủ tục hành chính";
            case "other":
                return "Khác";
            default:
                return helpType;
        }
    };

    // Modal chi tiết yêu cầu
    renderDetailModal() {
        const { selectedRequest, showDetailModal } = this.state;
        if (!selectedRequest) return null;

        return (
            <div className={`help-request-modal ${showDetailModal ? 'show' : ''}`}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h3>Chi tiết yêu cầu</h3>
                        <button className="close-button" onClick={this.handleCloseModal}>&times;</button>
                    </div>
                    <div className="modal-body">
                        <div className="request-info">
                            <h4>Thông tin người yêu cầu</h4>
                            <p><strong>Họ tên:</strong> {selectedRequest.full_name}</p>
                            <p><strong>Email:</strong> {selectedRequest.email}</p>
                            <p><strong>Số điện thoại:</strong> {selectedRequest.phone}</p>
                            <p><strong>Tổ chức:</strong> {selectedRequest.organization || 'Không có'}</p>
                        </div>
                        
                        <div className="request-details">
                            <h4>Thông tin yêu cầu</h4>
                            <p><strong>Loại hỗ trợ:</strong> {this.renderHelpType(selectedRequest.help_type)}</p>
                            <p><strong>Mức độ khẩn cấp:</strong> {this.renderUrgencyBadge(selectedRequest.urgency_level)}</p>
                            <p><strong>Trạng thái:</strong> {this.renderStatusBadge(selectedRequest.status)}</p>
                            <p><strong>Thời gian liên hệ:</strong> {this.renderAvailableTime(selectedRequest.available_time)}</p>
                            <p><strong>Phương thức liên hệ:</strong> {this.renderContactMethod(selectedRequest.contact_method)}</p>
                            <p><strong>Ngày tạo:</strong> {new Date(selectedRequest.created_at).toLocaleString('vi-VN')}</p>
                        </div>
                        
                        <div className="problem-details">
                            <h4>Mô tả vấn đề</h4>
                            <p>{selectedRequest.problem_detail}</p>
                            
                            {selectedRequest.attempted_solutions && (
                                <>
                                    <h4>Giải pháp đã thử</h4>
                                    <p>{selectedRequest.attempted_solutions}</p>
                                </>
                            )}
                            
                            {selectedRequest.additional_info && (
                                <>
                                    <h4>Thông tin bổ sung</h4>
                                    <p>{selectedRequest.additional_info}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderAvailableTime = (time) => {
        const timeMap = {
            'morning': 'Buổi sáng (8h-12h)',
            'afternoon': 'Buổi chiều (13h-17h)',
            'evening': 'Buổi tối (18h-21h)',
            'anytime': 'Bất kỳ lúc nào',
            'weekend': 'Chỉ cuối tuần'
        };
        return timeMap[time] || time || 'Không xác định';
    };

    renderContactMethod = (method) => {
        const methodMap = {
            'email': 'Email',
            'phone': 'Điện thoại',
            'messenger': 'Facebook Messenger',
            'zalo': 'Zalo',
            'meeting': 'Gặp trực tiếp'
        };
        return methodMap[method] || method || 'Không xác định';
    };

    render() {
        const { helpRequests, isLoading } = this.state;

        return (
            <div className="help-request-list-container">
                <Header />
                <Breadcrumb
                    eventBannerImg="https://raw.githubusercontent.com/Trantoan12022004/host_image_page_anhtonton/main/images/helprequest.jpg"
                    eventCategory="Hỗ Trợ"
                    eventTitle="DANH SÁCH YÊU CẦU HỖ TRỢ"
                    eventLocation="Trực tuyến"
                />
                
                <div className="help-request-list-content">
                    <div className="container">
                        <div className="section-title text-center">
                            <h2>Danh sách yêu cầu hỗ trợ</h2>
                        </div>

                        {isLoading ? (
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                                <p>Đang tải dữ liệu...</p>
                            </div>
                        ) : helpRequests.length > 0 ? (
                            <div className="requests-table-container">
                                <table className="requests-table">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Họ và tên</th>
                                            <th>Loại hỗ trợ</th>
                                            <th>Mức độ khẩn cấp</th>
                                            <th>Trạng thái</th>
                                            <th>Ngày tạo</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {helpRequests.map((request, index) => (
                                            <tr key={request.id}>
                                                <td>{index + 1}</td>
                                                <td>{request.full_name}</td>
                                                <td>{this.renderHelpType(request.help_type)}</td>
                                                <td>{this.renderUrgencyBadge(request.urgency_level)}</td>
                                                <td>{this.renderStatusBadge(request.status)}</td>
                                                <td>{new Date(request.created_at).toLocaleDateString('vi-VN')}</td>
                                                <td>
                                                    <button 
                                                        className="btn-view-detail"
                                                        onClick={() => this.handleViewDetail(request)}
                                                    >
                                                        Xem chi tiết
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="no-data-message">
                                <p>Không có yêu cầu hỗ trợ nào được tìm thấy.</p>
                            </div>
                        )}
                    </div>
                </div>
                
                {this.renderDetailModal()}
                
                <Footer />
                <ScrollToTop />
            </div>
        );
    }
}

// Đảm bảo bạn thêm hàm này vào userServices.js
// export const getAllHelpRequests = () => {
//     return axios.get('/api/v1/help-requests');
// };

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

export default connect(mapStateToProps, mapDispatchToProps)(HelpRequestList);