import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Forgot_Password.scss";
import { Link } from "react-router-dom";
import { Form, Button, Container, Row, Col, InputGroup, Spinner, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLock, faEye, faEyeSlash, faExclamationTriangle, faLeaf, faKey, faArrowLeft, faShieldAlt, faCheck } from "@fortawesome/free-solid-svg-icons";

import logoImg from "../../assets/images/logos/logo.png";
import { RequestPasswordReset, VerifyOTP, ResetPassword } from "../../services/otpServices.js"; // Import các hàm từ userServices

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            otp: "",
            newPassword: "",
            confirmPassword: "",
            resetToken: "",
            showPassword: false,
            showConfirmPassword: false,
            errMessage: "",
            successMessage: "",
            isLoading: false,
            currentStep: 1, // 1: Nhập email, 2: Nhập OTP, 3: Đặt lại mật khẩu
            otpTimer: 0,
        };
        this.timerInterval = null;
    }

    componentWillUnmount() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    handleInputChange = (event, fieldName) => {
        this.setState({
            [fieldName]: event.target.value,
            errMessage: "",
        });
    };

    togglePasswordVisibility = (field) => {
        if (field === "password") {
            this.setState({ showPassword: !this.state.showPassword });
        } else {
            this.setState({ showConfirmPassword: !this.state.showConfirmPassword });
        }
    };

    startOtpTimer = () => {
        this.setState({ otpTimer: 60 });
        if (this.timerInterval) clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {
            this.setState(
                (prevState) => ({
                    otpTimer: prevState.otpTimer - 1,
                }),
                () => {
                    if (this.state.otpTimer <= 0 && this.timerInterval) {
                        clearInterval(this.timerInterval);
                    }
                }
            );
        }, 1000);
    };

    // Bước 1: Gửi email để lấy mã OTP
    handleRequestOTP = async () => {
        const { email } = this.state;

        // Kiểm tra email
        if (!email) {
            this.setState({ errMessage: "Vui lòng nhập địa chỉ email của bạn" });
            return;
        }

        // Kiểm tra định dạng email đơn giản
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.setState({ errMessage: "Địa chỉ email không hợp lệ" });
            return;
        }

        this.setState({ isLoading: true, errMessage: "", successMessage: "" });

        try {
            // Gọi API để yêu cầu mã OTP
            const response = await RequestPasswordReset(email);

            if (response.data.errCode === 0) {
                this.setState({
                    isLoading: false,
                    currentStep: 2,
                    successMessage: response.data.errMessage || "Mã xác nhận đã được gửi đến email của bạn",
                });

                this.startOtpTimer();
            } else {
                this.setState({
                    isLoading: false,
                    errMessage: response.data.errMessage || "Có lỗi xảy ra khi gửi yêu cầu",
                });
            }
        } catch (error) {
            this.setState({
                isLoading: false,
                errMessage: error.response?.data?.errMessage || "Không thể gửi mã xác nhận. Vui lòng thử lại sau.",
            });
        }
    };

    // Bước 2: Xác minh mã OTP
    handleVerifyOTP = async () => {
        const { email, otp } = this.state;

        if (!otp) {
            this.setState({ errMessage: "Vui lòng nhập mã xác nhận" });
            return;
        }

        this.setState({ isLoading: true, errMessage: "", successMessage: "" });

        try {
            // Gọi API để xác minh OTP
            const response = await VerifyOTP(email, otp);

            if (response.data.errCode === 0) {
                this.setState({
                    isLoading: false,
                    currentStep: 3,
                    resetToken: response.data.resetToken,
                    successMessage: response.data.errMessage || "Xác thực OTP thành công. Vui lòng tạo mật khẩu mới.",
                });
            } else {
                this.setState({
                    isLoading: false,
                    errMessage: response.data.errMessage || "Có lỗi xảy ra khi xác thực mã OTP",
                });
            }
        } catch (error) {
            this.setState({
                isLoading: false,
                errMessage: error.response?.data?.errMessage || "Mã xác nhận không chính xác hoặc đã hết hạn",
            });
        }
    };

    // Bước 3: Đặt lại mật khẩu
    handleResetPassword = async () => {
        const { email, resetToken, newPassword, confirmPassword } = this.state;

        // Kiểm tra mật khẩu
        if (!newPassword) {
            this.setState({ errMessage: "Vui lòng nhập mật khẩu mới" });
            return;
        }

        if (newPassword.length < 6) {
            this.setState({ errMessage: "Mật khẩu phải có ít nhất 6 ký tự" });
            return;
        }

        if (newPassword !== confirmPassword) {
            this.setState({ errMessage: "Mật khẩu xác nhận không khớp" });
            return;
        }

        this.setState({ isLoading: true, errMessage: "", successMessage: "" });

        try {
            // Gọi API để đặt lại mật khẩu
            const response = await ResetPassword(email, resetToken, newPassword);

            if (response.data.errCode === 0) {
                this.setState({
                    isLoading: false,
                    successMessage: response.data.errMessage || "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay bây giờ.",
                });

                // Chuyển hướng đến trang đăng nhập sau 3 giây
                setTimeout(() => {
                    this.props.navigate("/login");
                }, 3000);
            } else {
                this.setState({
                    isLoading: false,
                    errMessage: response.data.errMessage || "Có lỗi xảy ra khi đặt lại mật khẩu",
                });
            }
        } catch (error) {
            this.setState({
                isLoading: false,
                errMessage: error.response?.data?.errMessage || "Không thể đặt lại mật khẩu. Vui lòng thử lại.",
            });
        }
    };

    // Xử lý khi nhấn "Gửi lại" mã OTP
    handleResendOTP = async () => {
        const { email } = this.state;

        this.setState({ isLoading: true, errMessage: "", successMessage: "" });

        try {
            // Gọi API để yêu cầu mã OTP mới
            const response = await RequestPasswordReset(email);

            if (response.data.errCode === 0) {
                this.setState({
                    isLoading: false,
                    successMessage: "Mã xác nhận mới đã được gửi đến email của bạn",
                });

                this.startOtpTimer();
            } else {
                this.setState({
                    isLoading: false,
                    errMessage: response.data.errMessage || "Có lỗi xảy ra khi gửi lại mã xác nhận",
                });
            }
        } catch (error) {
            this.setState({
                isLoading: false,
                errMessage: error.response?.data?.errMessage || "Không thể gửi lại mã xác nhận",
            });
        }
    };

    // Quay lại bước trước
    handleBack = () => {
        this.setState((prevState) => ({
            currentStep: prevState.currentStep - 1,
            errMessage: "",
            successMessage: "",
        }));
    };

    render() {
        const { email, otp, newPassword, confirmPassword, showPassword, showConfirmPassword, errMessage, successMessage, isLoading, currentStep, otpTimer } = this.state;

        return (
            <div className="forgot-password-page d-flex align-items-center min-vh-100">
                <div className="login-bg-shape"></div>
                <div className="login-wave"></div>

                <Container>
                    <Row className="justify-content-center g-0">
                        <Col lg={12} className="shadow-lg rounded-3 overflow-hidden">
                            <Row className="g-0 h-100">
                                {/* Cột hình ảnh và thông điệp */}
                                <Col lg={6} className="d-none d-lg-block p-0">
                                    <div className="login-welcome h-100 d-flex flex-column justify-content-center p-5 text-white">
                                        <div className="mb-4">
                                            <img src={logoImg} alt="CTES Logo" className="login-logo" />
                                        </div>
                                        <h2 className="welcome-heading">Quên mật khẩu?</h2>
                                        <p className="welcome-text opacity-75">Đừng lo lắng! Chúng tôi sẽ giúp bạn khôi phục tài khoản. Chỉ cần làm theo các bước đơn giản.</p>
                                        <div className="mt-4 welcome-features">
                                            <div className="feature-item mb-3">
                                                <span className="feature-icon">
                                                    <FontAwesomeIcon icon={faEnvelope} />
                                                </span>
                                                <span>Nhập email của bạn</span>
                                            </div>
                                            <div className="feature-item mb-3">
                                                <span className="feature-icon">
                                                    <FontAwesomeIcon icon={faShieldAlt} />
                                                </span>
                                                <span>Xác minh bằng mã OTP</span>
                                            </div>
                                            <div className="feature-item">
                                                <span className="feature-icon">
                                                    <FontAwesomeIcon icon={faKey} />
                                                </span>
                                                <span>Tạo mật khẩu mới</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                                {/* Cột form quên mật khẩu */}
                                <Col lg={6} className="bg-white p-0">
                                    <div className="forgot-password-container p-4 p-md-5 h-100 d-flex flex-column justify-content-center">
                                        <div className="text-center mb-4 d-lg-none">
                                            <img src={logoImg} alt="CTES Logo" className="login-logo-mobile mb-3" />
                                        </div>

                                        <h3 className="card-title fw-bold text-center mb-4">
                                            <FontAwesomeIcon icon={faKey} className="me-2 text-primary" />
                                            {currentStep === 1 && "Quên mật khẩu"}
                                            {currentStep === 2 && "Xác minh OTP"}
                                            {currentStep === 3 && "Tạo mật khẩu mới"}
                                        </h3>

                                        {/* Hiển thị thông báo lỗi */}
                                        {errMessage && (
                                            <Alert variant="danger" className="d-flex align-items-center">
                                                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2 flex-shrink-0" />
                                                <div>{errMessage}</div>
                                            </Alert>
                                        )}

                                        {/* Hiển thị thông báo thành công */}
                                        {successMessage && (
                                            <Alert variant="success" className="d-flex align-items-center">
                                                <FontAwesomeIcon icon={faCheck} className="me-2 flex-shrink-0" />
                                                <div>{successMessage}</div>
                                            </Alert>
                                        )}

                                        {/* Hiển thị các bước */}
                                        <div className="progress-steps mb-4">
                                            <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
                                                <div className="step-icon">1</div>
                                                <div className="step-label">Email</div>
                                            </div>
                                            <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
                                                <div className="step-icon">2</div>
                                                <div className="step-label">OTP</div>
                                            </div>
                                            <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
                                                <div className="step-icon">3</div>
                                                <div className="step-label">Mật khẩu mới</div>
                                            </div>
                                        </div>

                                        <Form className="forgot-password-form">
                                            {/* Bước 1: Nhập email */}
                                            {currentStep === 1 && (
                                                <>
                                                    <p className="text-muted mb-4">Vui lòng nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi mã xác nhận để đặt lại mật khẩu.</p>

                                                    <Form.Group className="mb-4" controlId="formEmail">
                                                        <Form.Label className="fw-semibold">Email đăng ký</Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text className="bg-light border-end-0">
                                                                <FontAwesomeIcon icon={faEnvelope} className="text-primary" />
                                                            </InputGroup.Text>
                                                            <Form.Control
                                                                type="email"
                                                                placeholder="Nhập email của bạn"
                                                                value={email}
                                                                onChange={(e) => this.handleInputChange(e, "email")}
                                                                className="py-2 border-start-0"
                                                            />
                                                        </InputGroup>
                                                    </Form.Group>

                                                    <Button
                                                        variant="primary"
                                                        className="login-btn w-100 py-2 mb-4 d-flex align-items-center justify-content-center"
                                                        onClick={this.handleRequestOTP}
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading ? (
                                                            <>
                                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                                                Đang xử lý...
                                                            </>
                                                        ) : (
                                                            "Gửi mã xác nhận"
                                                        )}
                                                    </Button>
                                                </>
                                            )}

                                            {/* Bước 2: Nhập OTP */}
                                            {currentStep === 2 && (
                                                <>
                                                    <p className="text-muted mb-4">
                                                        Mã xác nhận đã được gửi đến email <strong>{email}</strong>. Vui lòng nhập mã để tiếp tục.
                                                    </p>

                                                    <Form.Group className="mb-4" controlId="formOTP">
                                                        <Form.Label className="fw-semibold">Mã xác nhận</Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text className="bg-light border-end-0">
                                                                <FontAwesomeIcon icon={faShieldAlt} className="text-primary" />
                                                            </InputGroup.Text>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Nhập mã xác nhận"
                                                                value={otp}
                                                                onChange={(e) => this.handleInputChange(e, "otp")}
                                                                className="py-2 border-start-0"
                                                                maxLength={6}
                                                            />
                                                        </InputGroup>
                                                    </Form.Group>

                                                    <div className="d-flex justify-content-between mb-4">
                                                        <Button variant="outline-secondary" className="px-3" onClick={this.handleBack}>
                                                            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                                                            Quay lại
                                                        </Button>

                                                        <Button variant="primary" className="px-4" onClick={this.handleVerifyOTP} disabled={isLoading}>
                                                            {isLoading ? (
                                                                <>
                                                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                                                    Đang xử lý...
                                                                </>
                                                            ) : (
                                                                "Xác nhận"
                                                            )}
                                                        </Button>
                                                    </div>

                                                    <div className="text-center">
                                                        <p className="mb-0 small">
                                                            Không nhận được mã?
                                                            {otpTimer > 0 ? (
                                                                <span className="text-muted ms-1">Gửi lại sau {otpTimer}s</span>
                                                            ) : (
                                                                <Button
                                                                    variant="link"
                                                                    className="p-0 ms-1 text-decoration-none"
                                                                    onClick={this.handleResendOTP}
                                                                    disabled={isLoading}
                                                                >
                                                                    Gửi lại
                                                                </Button>
                                                            )}
                                                        </p>
                                                    </div>
                                                </>
                                            )}

                                            {/* Bước 3: Đặt mật khẩu mới */}
                                            {currentStep === 3 && (
                                                <>
                                                    <p className="text-muted mb-4">Vui lòng tạo mật khẩu mới cho tài khoản của bạn.</p>

                                                    <Form.Group className="mb-4" controlId="formNewPassword">
                                                        <Form.Label className="fw-semibold">Mật khẩu mới</Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text className="bg-light border-end-0">
                                                                <FontAwesomeIcon icon={faLock} className="text-primary" />
                                                            </InputGroup.Text>
                                                            <Form.Control
                                                                type={showPassword ? "text" : "password"}
                                                                placeholder="Nhập mật khẩu mới"
                                                                value={newPassword}
                                                                onChange={(e) => this.handleInputChange(e, "newPassword")}
                                                                className="py-2 border-start-0 border-end-0"
                                                            />
                                                            <Button variant="light" onClick={() => this.togglePasswordVisibility("password")} className="border border-start-0">
                                                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-secondary" />
                                                            </Button>
                                                        </InputGroup>
                                                    </Form.Group>

                                                    <Form.Group className="mb-4" controlId="formConfirmPassword">
                                                        <Form.Label className="fw-semibold">Xác nhận mật khẩu</Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text className="bg-light border-end-0">
                                                                <FontAwesomeIcon icon={faLock} className="text-primary" />
                                                            </InputGroup.Text>
                                                            <Form.Control
                                                                type={showConfirmPassword ? "text" : "password"}
                                                                placeholder="Nhập lại mật khẩu mới"
                                                                value={confirmPassword}
                                                                onChange={(e) => this.handleInputChange(e, "confirmPassword")}
                                                                className="py-2 border-start-0 border-end-0"
                                                            />
                                                            <Button variant="light" onClick={() => this.togglePasswordVisibility("confirm")} className="border border-start-0">
                                                                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="text-secondary" />
                                                            </Button>
                                                        </InputGroup>
                                                    </Form.Group>

                                                    <div className="d-flex justify-content-between mb-4">
                                                        <Button variant="outline-secondary" className="px-3" onClick={this.handleBack}>
                                                            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                                                            Quay lại
                                                        </Button>

                                                        <Button variant="primary" className="px-4" onClick={this.handleResetPassword} disabled={isLoading}>
                                                            {isLoading ? (
                                                                <>
                                                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                                                    Đang xử lý...
                                                                </>
                                                            ) : (
                                                                "Hoàn tất"
                                                            )}
                                                        </Button>
                                                    </div>
                                                </>
                                            )}

                                            <div className="text-center mt-3">
                                                <Link to="/login" className="text-decoration-none">
                                                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                                                    Trở về trang đăng nhập
                                                </Link>
                                            </div>
                                        </Form>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
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
    return {
        navigate: (path) => dispatch(push(path)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
