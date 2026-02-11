import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Breadcrumb from "../../components/Breadcrumb/EventBreadcrumbs";
import ScrollToTop from "../../components/ScrollTop";
import Logo from "../../assets/images/logos/logo2.png";
import { toast } from "react-toastify";
import axios from "axios"; // Thêm import axios
import "./HelpRequest.scss";
import { createHelpRequest } from "../../services/userServices";
import { createNotification } from "../../services/notificationServices";

class HelpRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                fullName: "",
                email: "",
                phone: "",
                organization: "", // Thêm trường này
                helpType: "",
                urgencyLevel: "",
                availableTime: "",
                contactMethod: "",
                problemDetail: "",
                attemptedSolutions: "",
                additionalInfo: "",
            },
            isSubmitting: false,
        };
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            formData: {
                ...this.state.formData,
                [name]: value,
            },
        });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({ isSubmitting: true });

        try {
            // Transform camelCase to snake_case for API compatibility
            const apiData = {
                full_name: this.state.formData.fullName,
                email: this.state.formData.email,
                phone: this.state.formData.phone,
                organization: this.state.formData.organization,
                help_type: this.state.formData.helpType,
                urgency_level: this.state.formData.urgencyLevel,
                available_time: this.state.formData.availableTime,
                contact_method: this.state.formData.contactMethod,
                problem_detail: this.state.formData.problemDetail,
                attempted_solutions: this.state.formData.attemptedSolutions,
                additional_info: this.state.formData.additionalInfo,
            };

            // Call API with transformed data
            const response = await createHelpRequest(apiData);

            // Check response from API
            if (response && response.data.errCode === 0) {
                toast.success("Yêu cầu đã gửi thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.");
                // Lấy ID của sự kiện mới tạo từ response
                const newHelpRequestId = response.data.id;

                // Tạo thông báo cho tất cả người dùng về sự kiện mới
                await this.createNotification(newHelpRequestId);
                // Reset form
                this.setState({
                    formData: {
                        fullName: "",
                        email: "",
                        phone: "",
                        organization: "",
                        helpType: "",
                        urgencyLevel: "",
                        availableTime: "",
                        contactMethod: "",
                        problemDetail: "",
                        attemptedSolutions: "",
                        additionalInfo: "",
                    },
                });
            } else {
                // Show error message from API
                toast.error(response.data.errMessage || "Có lỗi xảy ra khi gửi yêu cầu.");
            }
        } catch (error) {
            console.error("Error submitting help request:", error);
            toast.error(error.response?.data?.message || "Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau!");
        } finally {
            this.setState({ isSubmitting: false });
        }
    };
    // Hàm mới để tạo thông báo sự kiện
    createNotification = async (helpRequestId) => {
        try {
            const notificationData = {
                title: "Nhận yêu cầu trợ giúp mới",
                message: `Yêu cầu trợ giúp từ "${this.state.formData.fullName}"`,
                type: "help_request",
                link: `/help-request-list`, // Đường dẫn đến chi tiết yêu cầu trợ giúp
                created_by: this.state.formData.fullName, // ID của người tạo sự kiện (admin)
                reference_id: helpRequestId,
                reference_type: "HELP_REQUEST",
                role_code: "R1",
            }; 

            const response = await createNotification(notificationData);
                if (response && response.errCode === 0) {
                console.log("Thông báo sự kiện đã được tạo thành công:", response.data);
            } else {
                console.error("Lỗi khi tạo thông báo:", response.errMessage);
            }
        } catch (error) {
            console.error("Lỗi khi tạo thông báo sự kiện:", error);
            // Không hiển thị lỗi cho người dùng vì đây là tính năng phụ
        }
    };
    render() {
        const { formData, isSubmitting } = this.state;
        console.log("state:", this.state); // Log form data to console for debugging

        return (
            <div className="help-request-container">
                <Header />
                <Breadcrumb
                    eventBannerImg="https://raw.githubusercontent.com/Trantoan12022004/host_image_page_anhtonton/main/images/helprequest.jpg"
                    eventCategory="Hỗ Trợ"
                    eventTitle="YÊU CẦU TRỢ GIÚP"
                    eventLocation="Trực tuyến"
                />

                {/* Phần nội dung chính */}
                <div className="help-request-content">
                    <div className="container">
                        {/* Phần mô tả */}
                        <div className="help-request-description">
                            <h2>Mẫu Yêu Cầu Trợ Giúp</h2>
                            <p>
                                Bạn đang gặp khó khăn và cần sự hỗ trợ? Đừng lo lắng, chúng tôi luôn sẵn sàng giúp đỡ bạn. Hãy điền đầy đủ thông tin vào mẫu dưới đây để chúng tôi
                                có thể hiểu rõ vấn đề và hỗ trợ bạn một cách hiệu quả nhất.
                            </p>
                        </div>

                        {/* Form yêu cầu trợ giúp */}
                        <div className="help-request-form-container">
                            <form onSubmit={this.handleSubmit} className="help-request-form">
                                {/* Phần 1: Thông tin cá nhân */}
                                <div className="form-section">
                                    <h3>Thông tin liên hệ</h3>

                                    <div className="form-group">
                                        <label htmlFor="fullName">
                                            Họ và tên <span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={this.handleInputChange}
                                            required
                                            className="form-control"
                                            placeholder="Nguyễn Văn A"
                                        />
                                        <small className="form-text text-muted">Nhập đầy đủ họ tên để chúng tôi dễ dàng xưng hô</small>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">
                                            Email <span className="required">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={this.handleInputChange}
                                            required
                                            className="form-control"
                                            placeholder="example@mail.com"
                                        />
                                        <small className="form-text text-muted">Chúng tôi sẽ liên hệ qua email này</small>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="organization">
                                            Tổ chức <span className="required">*</span>{" "}
                                        </label>
                                        <input
                                            type="text"
                                            id="organization"
                                            name="organization"
                                            value={formData.organization} // Sửa từ formData.phone thành formData.organization
                                            onChange={this.handleInputChange}
                                            className="form-control"
                                            placeholder="Tên tổ chức (nếu có)"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="phone">
                                            Số điện thoại <span className="required">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone} // Sửa từ formData.studentId thành formData.phone
                                            onChange={this.handleInputChange}
                                            required
                                            className="form-control"
                                            placeholder="0363870102"
                                        />
                                    </div>
                                </div>

                                {/* Phần 2: Thông tin yêu cầu trợ giúp */}
                                <div className="form-section">
                                    <h3>Chi tiết yêu cầu</h3>

                                    <div className="form-group">
                                        <label htmlFor="helpType">
                                            Loại hỗ trợ cần thiết <span className="required">*</span>
                                        </label>
                                        <select id="helpType" name="helpType" value={formData.helpType} onChange={this.handleInputChange} required className="form-control">
                                            <option value="">-- Chọn loại hỗ trợ --</option>
                                            <option value="academic">Học tập / Bài tập</option>
                                            <option value="financial">Tài chính / Học phí</option>
                                            <option value="mental">Tâm lý / Tư vấn</option>
                                            <option value="technical">Kỹ thuật / CNTT</option>
                                            <option value="facility">Cơ sở vật chất</option>
                                            <option value="documents">Thủ tục hành chính</option>
                                            <option value="other">Khác</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="urgencyLevel">
                                            Mức độ khẩn cấp <span className="required">*</span>
                                        </label>
                                        <select
                                            id="urgencyLevel"
                                            name="urgencyLevel"
                                            value={formData.urgencyLevel}
                                            onChange={this.handleInputChange}
                                            required
                                            className="form-control"
                                        >
                                            <option value="">-- Chọn mức độ --</option>
                                            <option value="low">Thấp - Có thể đợi vài ngày</option>
                                            <option value="medium">Trung bình - Cần giải quyết trong tuần</option>
                                            <option value="high">Cao - Cần giải quyết trong 24h</option>
                                            <option value="urgent">Rất cao - Cần giải quyết ngay</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="problemDetail">
                                            Mô tả chi tiết vấn đề <span className="required">*</span>
                                        </label>
                                        <textarea
                                            id="problemDetail"
                                            name="problemDetail"
                                            value={formData.problemDetail}
                                            onChange={this.handleInputChange}
                                            required
                                            className="form-control"
                                            rows="4"
                                            placeholder="Vui lòng mô tả chi tiết vấn đề bạn đang gặp phải..."
                                        ></textarea>
                                        <small className="form-text text-muted">Càng chi tiết càng giúp chúng tôi hỗ trợ tốt hơn</small>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="attemptedSolutions">Bạn đã thử giải quyết như thế nào?</label>
                                        <textarea
                                            id="attemptedSolutions"
                                            name="attemptedSolutions"
                                            value={formData.attemptedSolutions}
                                            onChange={this.handleInputChange}
                                            className="form-control"
                                            rows="3"
                                            placeholder="Các biện pháp bạn đã thử..."
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Phần 3: Thông tin liên hệ và bổ sung */}
                                <div className="form-section">
                                    <h3>Thông tin bổ sung</h3>

                                    <div className="form-group">
                                        <label htmlFor="availableTime">Thời gian thuận tiện để liên hệ</label>
                                        <select id="availableTime" name="availableTime" value={formData.availableTime} onChange={this.handleInputChange} className="form-control">
                                            <option value="">-- Chọn thời gian --</option>
                                            <option value="morning">Buổi sáng (8h-12h)</option>
                                            <option value="afternoon">Buổi chiều (13h-17h)</option>
                                            <option value="evening">Buổi tối (18h-21h)</option>
                                            <option value="anytime">Bất kỳ lúc nào</option>
                                            <option value="weekend">Chỉ cuối tuần</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="contactMethod">Phương thức liên hệ ưa thích</label>
                                        <select id="contactMethod" name="contactMethod" value={formData.contactMethod} onChange={this.handleInputChange} className="form-control">
                                            <option value="">-- Chọn phương thức --</option>
                                            <option value="email">Email</option>
                                            <option value="phone">Điện thoại</option>
                                            <option value="messenger">Facebook Messenger</option>
                                            <option value="zalo">Zalo</option>
                                            <option value="meeting">Gặp trực tiếp</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="additionalInfo">Thông tin bổ sung khác</label>
                                        <textarea
                                            id="additionalInfo"
                                            name="additionalInfo"
                                            value={formData.additionalInfo}
                                            onChange={this.handleInputChange}
                                            className="form-control"
                                            rows="3"
                                            placeholder="Bất kỳ thông tin nào khác mà bạn muốn chia sẻ..."
                                        ></textarea>
                                    </div>

                                    <div className="form-group form-check">
                                        <input type="checkbox" className="form-check-input" id="confirmCheck" required />
                                        <label className="form-check-label" htmlFor="confirmCheck">
                                            Tôi xác nhận thông tin trên là chính xác và đồng ý với <a href="#">chính sách bảo mật</a> của đơn vị <span className="required">*</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Nút gửi đơn */}
                                <div className="form-submit">
                                    <button type="submit" className="btn btn-primary submit-button" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            <>
                                                Gửi yêu cầu trợ giúp
                                                <i className="bi bi-send-fill ms-2"></i>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <Footer />
                <ScrollToTop />
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(HelpRequest);
