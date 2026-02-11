import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Breadcrumb from "../../components/Breadcrumb/EventBreadcrumbs";
import ScrollToTop from "../../components/ScrollTop";
import Logo from "../../assets/images/logos/logo2.png";
import { toast } from "react-toastify";
import "./Recruitment.scss";

class Recruitment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                fullName: "",
                email: "",
                phone: "",
                studentId: "",
                department: "",
                course: "",
                reason: "",
                experience: "",
                expectation: "",
                timeCommitment: "",
                reference: "",
            },
            isSubmitting: false
        };
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            formData: {
                ...this.state.formData,
                [name]: value
            }
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ isSubmitting: true });

        // Giả lập API call
        setTimeout(() => {
            toast.success("Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.");
            this.setState({
                isSubmitting: false,
                formData: {
                    fullName: "",
                    email: "",
                    phone: "",
                    studentId: "",
                    department: "",
                    course: "",
                    reason: "",
                    experience: "",
                    expectation: "",
                    timeCommitment: "",
                    reference: "",
                }
            });
        }, 1500);
    }

    render() {
        const { formData, isSubmitting } = this.state;

        return(
            <div className="recruitment-container">
                <Header 
                    />
                <Breadcrumb
                    eventBannerImg="https://raw.githubusercontent.com/Trantoan12022004/host_image_page_anhtonton/main/images/tuyenthanhvien.jpg"
                    eventCategory="Sự kiện"
                    eventDate="2023-10-01"
                    eventStartTime="09:00"
                    eventEndTime="17:00"
                    eventTitle="TUYỂN THÀNH VIÊN K17"
                    eventLocation="D3-HUST"
                />
                
                {/* Phần nội dung chính */}
                <div className="recruitment-content">
                    <div className="container">
                        {/* Phần mô tả */}
                        <div className="recruitment-description">
                            <h2>Đơn Đăng Ký Tuyển Thành Viên K17</h2>
                            <p>
                                Chào mừng các bạn đến với sự kiện tuyển thành viên K17 của chúng tôi! 
                                Đây là cơ hội tuyệt vời để bạn gia nhập vào một cộng đồng năng động và sáng tạo. 
                                Vui lòng điền đầy đủ thông tin bên dưới để hoàn tất đăng ký.
                            </p>
                        </div>
                        
                        {/* Form đăng ký */}
                        <div className="recruitment-form-container">
                            <form onSubmit={this.handleSubmit} className="recruitment-form">
                                {/* Phần 1: Thông tin cá nhân */}
                                <div className="form-section">
                                    <h3>Thông tin cá nhân</h3>
                                    
                                    <div className="form-group">
                                        <label htmlFor="fullName">Họ và tên <span className="required">*</span></label>
                                        <input 
                                            type="text" 
                                            id="fullName" 
                                            name="fullName" 
                                            value={formData.fullName}
                                            onChange={this.handleInputChange}
                                            required 
                                            className="form-control"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="email">Email <span className="required">*</span></label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            name="email" 
                                            value={formData.email}
                                            onChange={this.handleInputChange}
                                            required 
                                            className="form-control"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="phone">Số điện thoại <span className="required">*</span></label>
                                        <input 
                                            type="tel" 
                                            id="phone" 
                                            name="phone" 
                                            value={formData.phone}
                                            onChange={this.handleInputChange}
                                            required 
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                
                                {/* Phần 2: Thông tin học tập */}
                                <div className="form-section">
                                    <h3>Thông tin học tập</h3>
                                    
                                    <div className="form-group">
                                        <label htmlFor="studentId">Mã số sinh viên <span className="required">*</span></label>
                                        <input 
                                            type="text" 
                                            id="studentId" 
                                            name="studentId" 
                                            value={formData.studentId}
                                            onChange={this.handleInputChange}
                                            required 
                                            className="form-control"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="department">Khoa/Viện <span className="required">*</span></label>
                                        <input 
                                            type="text" 
                                            id="department" 
                                            name="department" 
                                            value={formData.department}
                                            onChange={this.handleInputChange}
                                            required 
                                            className="form-control"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="course">Khóa <span className="required">*</span></label>
                                        <select 
                                            id="course" 
                                            name="course" 
                                            value={formData.course}
                                            onChange={this.handleInputChange}
                                            required 
                                            className="form-control"
                                        >
                                            <option value="">-- Chọn khóa --</option>
                                            <option value="K67">K67</option>
                                            <option value="K68">K68</option>
                                            <option value="K69">K69</option>
                                        </select>
                                    </div>
                                </div>
                                
                                {/* Phần 3: Câu hỏi */}
                                <div className="form-section">
                                    <h3>Thông tin bổ sung</h3>
                                    
                                    <div className="form-group">
                                        <label htmlFor="reason">Lý do bạn muốn tham gia CLB chúng tôi? <span className="required">*</span></label>
                                        <textarea 
                                            id="reason" 
                                            name="reason" 
                                            value={formData.reason}
                                            onChange={this.handleInputChange}
                                            required 
                                            className="form-control"
                                            rows="3"
                                        ></textarea>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="experience">Bạn đã có kinh nghiệm gì trước đây?</label>
                                        <textarea 
                                            id="experience" 
                                            name="experience" 
                                            value={formData.experience}
                                            onChange={this.handleInputChange}
                                            className="form-control"
                                            rows="3"
                                        ></textarea>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="expectation">Bạn mong đợi điều gì khi tham gia CLB? <span className="required">*</span></label>
                                        <textarea 
                                            id="expectation" 
                                            name="expectation" 
                                            value={formData.expectation}
                                            onChange={this.handleInputChange}
                                            required 
                                            className="form-control"
                                            rows="3"
                                        ></textarea>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="timeCommitment">Bạn có thể dành bao nhiêu thời gian cho CLB mỗi tuần? <span className="required">*</span></label>
                                        <select 
                                            id="timeCommitment" 
                                            name="timeCommitment" 
                                            value={formData.timeCommitment}
                                            onChange={this.handleInputChange}
                                            required 
                                            className="form-control"
                                        >
                                            <option value="">-- Chọn thời gian --</option>
                                            <option value="1-3">1-3 giờ</option>
                                            <option value="4-6">4-6 giờ</option>
                                            <option value="7-10">7-10 giờ</option>
                                            <option value="10+">Trên 10 giờ</option>
                                        </select>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="reference">Bạn biết về CLB chúng tôi từ đâu?</label>
                                        <select 
                                            id="reference" 
                                            name="reference" 
                                            value={formData.reference}
                                            onChange={this.handleInputChange}
                                            className="form-control"
                                        >
                                            <option value="">-- Chọn nguồn --</option>
                                            <option value="Facebook">Facebook</option>
                                            <option value="Friends">Bạn bè giới thiệu</option>
                                            <option value="School">Trường học</option>
                                            <option value="Event">Sự kiện của CLB</option>
                                            <option value="Other">Khác</option>
                                        </select>
                                    </div>
                                </div>
                                
                                {/* Nút gửi đơn */}
                                <div className="form-submit">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary submit-button"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Đang gửi...' : 'Gửi đơn đăng ký'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                
                <Footer />
                <ScrollToTop />
            </div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(Recruitment);