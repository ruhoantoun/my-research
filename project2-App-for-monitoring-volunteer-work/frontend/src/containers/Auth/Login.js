import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Login.scss";
import { FormattedMessage } from "react-intl";
import { languages } from "../../utils";
import { Form, Button, Container, Row, Col, Card, InputGroup, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faFacebookF, faTwitter, faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLock, faEye, faEyeSlash, faExclamationTriangle, faLeaf, faSignInAlt } from "@fortawesome/free-solid-svg-icons";

import { handleLoginApi } from "../../services/userServices";
import logoImg from "../../assets/images/logos/logo.png";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            password: "",
            errMessage: "",
            showPassword: false,
            isLoading: false,
            rememberMe: false,
        };
    }

    handleOnChangeUsername = (event) => {
        this.setState({
            userName: event.target.value,
            errMessage: "",
        });
    };

    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value,
            errMessage: "",
        });
    };

    toggleShowPassword = () => {
        this.setState({
            showPassword: !this.state.showPassword,
        });
    };

    toggleRememberMe = () => {
        this.setState({
            rememberMe: !this.state.rememberMe,
        });
    };

    handleLogin = async () => {
        this.setState({
            errMessage: "",
            isLoading: true,
        });

        // Kiểm tra form trước khi gửi
        if (!this.state.userName || !this.state.password) {
            this.setState({
                errMessage: "Vui lòng nhập email và mật khẩu",
                isLoading: false,
            });
            return;
        }

        try {
            let response = await handleLoginApi(this.state.userName, this.state.password);

            this.setState({ isLoading: false });

            if (response.data.errCode !== 0) {
                this.setState({
                    errMessage: response.data.message || "Đăng nhập không thành công",
                });
            } else {
                this.props.userLoginSuccess(response.data.user);
            }
        } catch (error) {
            this.setState({ isLoading: false });

            if (error.response && error.response.data) {
                this.setState({
                    errMessage: error.response.data.message,
                });
            } else {
                this.setState({
                    errMessage: "Không thể kết nối đến máy chủ",
                });
            }
        }
    };

    handleKeyDown = (event) => {
        if (event.key === "Enter") {
            this.handleLogin();
        }
    };

    render() {
        const { userName, password, errMessage, showPassword, isLoading, rememberMe } = this.state;

        return (
            <div className="login-page d-flex align-items-center min-vh-100">
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
                                        <h2 className="welcome-heading">Chào mừng trở lại!</h2>
                                        <p className="welcome-text opacity-75">
                                            Đăng nhập để tham gia các sự kiện môi trường cùng CTES và theo dõi các hoạt động bảo vệ môi trường mới nhất
                                        </p>
                                        <div className="mt-4 welcome-features">
                                            <div className="feature-item mb-3">
                                                <span className="feature-icon">
                                                    <FontAwesomeIcon icon={faLeaf} />
                                                </span>
                                                <span>Tham gia các sự kiện môi trường</span>
                                            </div>
                                            <div className="feature-item mb-3">
                                                <span className="feature-icon">
                                                    <FontAwesomeIcon icon={faLeaf} />
                                                </span>
                                                <span>Đóng góp ý tưởng bảo vệ môi trường</span>
                                            </div>
                                            <div className="feature-item">
                                                <span className="feature-icon">
                                                    <FontAwesomeIcon icon={faLeaf} />
                                                </span>
                                                <span>Kết nối với cộng đồng yêu môi trường</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                                {/* Cột form đăng nhập */}
                                <Col lg={6} className="bg-white p-0">
                                    <div className="login-form-container p-4 p-md-5 h-100 d-flex flex-column justify-content-center">
                                        <div className="text-center mb-4 d-lg-none">
                                            <img src={logoImg} alt="CTES Logo" className="login-logo-mobile mb-3" />
                                        </div>

                                        <h3 className="card-title fw-bold text-center mb-4">
                                            <FontAwesomeIcon icon={faSignInAlt} className="me-2 text-primary" />
                                            Đăng nhập tài khoản
                                        </h3>

                                        {errMessage && (
                                            <div className="alert alert-danger d-flex align-items-center" role="alert">
                                                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2 flex-shrink-0" />
                                                <div>{errMessage}</div>
                                            </div>
                                        )}

                                        <Form className="login-form">
                                            <Form.Group className="mb-4" controlId="formEmail">
                                                <Form.Label className="fw-semibold">Email đăng nhập</Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Text className="bg-light border-end-0">
                                                        <FontAwesomeIcon icon={faEnvelope} className="text-primary" />
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        type="email"
                                                        placeholder="Nhập email của bạn"
                                                        value={userName}
                                                        onChange={this.handleOnChangeUsername}
                                                        onKeyDown={this.handleKeyDown}
                                                        className="py-2 border-start-0"
                                                    />
                                                </InputGroup>
                                            </Form.Group>

                                            <Form.Group className="mb-4" controlId="formPassword">
                                                <Form.Label className="fw-semibold">Mật khẩu</Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Text className="bg-light border-end-0">
                                                        <FontAwesomeIcon icon={faLock} className="text-primary" />
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Nhập mật khẩu của bạn"
                                                        value={password}
                                                        onChange={this.handleOnChangePassword}
                                                        onKeyDown={this.handleKeyDown}
                                                        className="py-2 border-start-0 border-end-0"
                                                    />
                                                    <Button variant="light" onClick={this.toggleShowPassword} className="border border-start-0">
                                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-secondary" />
                                                    </Button>
                                                </InputGroup>
                                            </Form.Group>

                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <Form.Check
                                                    type="checkbox"
                                                    id="rememberMe"
                                                    label="Ghi nhớ đăng nhập"
                                                    checked={rememberMe}
                                                    onChange={this.toggleRememberMe}
                                                    className="user-select-none"
                                                />
                                                <Link to="/forgot-password" className="forgot-link text-decoration-none">
                                                    Quên mật khẩu?
                                                </Link>
                                            </div>

                                            <Button
                                                variant="primary"
                                                className="login-btn w-100 py-2 mb-4 d-flex align-items-center justify-content-center"
                                                onClick={this.handleLogin}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                                        Đang xử lý...
                                                    </>
                                                ) : (
                                                    "Đăng nhập"
                                                )}
                                            </Button>

                                            <div className="text-center mb-4">
                                                <p className="mb-0">
                                                    Chưa có tài khoản?{" "}
                                                    <a href="/register" className="register-link text-decoration-none fw-semibold">
                                                        Liên hệ với BQL để nhận tài khoản
                                                    </a>
                                                </p>
                                            </div>

                                            {/* <div className="separator">
                                                <span>Hoặc đăng nhập với</span>
                                            </div>

                                            <div className="social-buttons">
                                                <Button variant="outline-primary" className="social-btn">
                                                    <FontAwesomeIcon icon={faFacebookF} />
                                                </Button>
                                                <Button variant="outline-info" className="social-btn">
                                                    <FontAwesomeIcon icon={faTwitter} />
                                                </Button>
                                                <Button variant="outline-danger" className="social-btn">
                                                    <FontAwesomeIcon icon={faGoogle} />
                                                </Button>
                                                <Button variant="outline-dark" className="social-btn">
                                                    <FontAwesomeIcon icon={faGithub} />
                                                </Button>
                                            </div> */}
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
        userLoginSuccess: (userInfor) => dispatch(actions.userLoginSuccess(userInfor)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
