import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerEvent } from "../../services/eventServices";
import "./ContactForm.scss"; // Tạo file SCSS riêng cho component

class EventRegistrationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventId: props.eventId || "",
            name: "",
            email: "",
            phone: "",
            payMethodCode: "",
            statusCostCode: "",
            notes: "",
            registeredAt: new Date().toISOString().split("T")[0],
            isSubmitting: false,
        };
    }
    // Trong componentDidMount:
    componentDidMount() {
        const { userInforr, isLoggedIn } = this.props;

        // Auto-fill user information if logged in
        if (isLoggedIn && userInforr) {
            this.setState({
                name: `${userInforr.firstName} ${userInforr.lastName}`.trim(),
                email: userInforr.email || "",
                phone: userInforr.phoneNumber || "",
            });
        }
    }

    // Cập nhật eventId khi props thay đổi
    componentDidUpdate(prevProps) {
        if (this.props.eventId !== prevProps.eventId) {
            this.setState({ eventId: this.props.eventId || "" });
        }
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        });
    };

    checkValidateInput = () => {
        let isValid = true;
        const requiredFields = {
            name: "Họ và tên",
            email: "Email",
            phone: "Số điện thoại",
            payMethodCode: "Phương thức thanh toán",
            statusCostCode: "Trạng thái thanh toán",
        };

        for (let field in requiredFields) {
            if (!this.state[field]) {
                isValid = false;
                toast.error(
                    `Thiếu thông tin bắt buộc: ${requiredFields[field]}`
                );
                break;
            }
        }

        return isValid;
    };

    handleRegisterEvent = async () => {
        const { userInforr } = this.props;
        let isValid = this.checkValidateInput();
        if (!isValid) return;

        this.setState({ isSubmitting: true });

        try {
                   // Get userId from Redux store
        const userId = userInforr?.id;
        
        if (!userId) {
            toast.error("Không tìm thấy thông tin người dùng!");
            this.setState({ isSubmitting: false });
            return;
        }
            console.log("check userInforr", userId);
            console.log("check state", this.state);
            let response = await registerEvent({
                eventId: this.state.eventId,
                name: this.state.name,
                userId: userId,
                email: this.state.email,
                phone: this.state.phone,
                registeredAt: this.state.registeredAt,
                statusCostCode: this.state.statusCostCode,
                payMethodCode: this.state.payMethodCode,
                notes: this.state.notes,
            });
            console.log("check res", response);
            if (response && response.data.errCode === 0) {
                toast.success("Đăng ký sự kiện thành công!");
                this.setState({
                    name: "",
                    email: "",
                    phone: "",
                    payMethodCode: "",
                    statusCostCode: "",
                    notes: "",
                    registeredAt: new Date().toISOString().split("T")[0],
                    isSubmitting: false,
                });
            } else {
                toast.error(
                    response.data.errMessage || "Đăng ký không thành công"
                );
                this.setState({ isSubmitting: false });
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi...");
            console.error("Lỗi khi đăng ký sự kiện:", error);
            this.setState({ isSubmitting: false });
        }
    };

    render() {
        return (
            <div className="event-registration-container">
                <div className="container">
                    <div className="registration-form-wrapper">
                        <div className="form-header">
                            <h2>Đăng Ký Tham Gia Sự Kiện</h2>
                            <p>
                                Vui lòng điền đầy đủ thông tin bên dưới để hoàn
                                tất đăng ký.
                            </p>
                        </div>

                        <form className="registration-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>
                                        Họ và tên{" "}
                                        <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={this.state.name}
                                        onChange={(event) =>
                                            this.handleOnChangeInput(
                                                event,
                                                "name"
                                            )
                                        }
                                        placeholder="Nhập họ và tên của bạn"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Email{" "}
                                        <span className="required">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={this.state.email}
                                        onChange={(event) =>
                                            this.handleOnChangeInput(
                                                event,
                                                "email"
                                            )
                                        }
                                        placeholder="Nhập địa chỉ email"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>
                                        Số điện thoại{" "}
                                        <span className="required">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={this.state.phone}
                                        onChange={(event) =>
                                            this.handleOnChangeInput(
                                                event,
                                                "phone"
                                            )
                                        }
                                        placeholder="Nhập số điện thoại của bạn"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Ngày đăng ký</label>
                                    <input
                                        type="date"
                                        value={this.state.registeredAt}
                                        onChange={(event) =>
                                            this.handleOnChangeInput(
                                                event,
                                                "registeredAt"
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>
                                        Phương thức thanh toán{" "}
                                        <span className="required">*</span>
                                    </label>
                                    <select
                                        value={this.state.payMethodCode}
                                        onChange={(event) =>
                                            this.handleOnChangeInput(
                                                event,
                                                "payMethodCode"
                                            )
                                        }
                                    >
                                        <option value="">
                                            Chọn phương thức thanh toán
                                        </option>
                                        <option value="PM2">
                                            Chuyển khoản ngân hàng
                                        </option>
                                        <option value="PM1">Tiền mặt</option>
                                        <option value="PM3">Ví MoMo</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>
                                        Trạng thái thanh toán{" "}
                                        <span className="required">*</span>
                                    </label>
                                    <select
                                        value={this.state.statusCostCode}
                                        onChange={(event) =>
                                            this.handleOnChangeInput(
                                                event,
                                                "statusCostCode"
                                            )
                                        }
                                    >
                                        <option value="">
                                            Chọn trạng thái thanh toán
                                        </option>
                                        <option value="PS1">
                                            Đã thanh toán
                                        </option>
                                        <option value="PS2">
                                            Chưa thanh toán
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label>Ghi chú bổ sung</label>
                                    <textarea
                                        rows="4"
                                        value={this.state.notes}
                                        onChange={(event) =>
                                            this.handleOnChangeInput(
                                                event,
                                                "notes"
                                            )
                                        }
                                        placeholder="Nhập thông tin bổ sung nếu cần thiết"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="register-button"
                                    onClick={() => this.handleRegisterEvent()}
                                >
                                    Đăng Ký Ngay
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        userInforr: state.user.userInforr,
        isLoggedIn: state.user.isLoggedIn,
    };
};

export default connect(mapStateToProps)(EventRegistrationForm);
