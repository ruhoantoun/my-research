import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { languages } from "../../utils/constant";
import "./UserRedux.scss";
import * as actions from "../../../src/store/actions";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { create } from "lodash";
import { createUser } from "../../../src/services/userServices";
import {
    getAllUsers,
    deleteUser,
    updateUser,
} from "../../services/userServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
class UserRedux extends Component {
    constructor(props) {
        super(props);
        this.editFormRef = React.createRef();
        this.state = {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            address: "",
            phoneNumber: "",
            genderCode: "",
            roleCode: "",
            positionCode: "",
            image: "",
            showPassword: false,
            previewImgURL: "", // Thêm state mới
            isOpen: false, // Để control lightbox preview
        };
    }

    // gọi hàm bên redux
    async componentDidMount() {}

    handleOnChangeInput = (event, id) => {
        // Copy state hiện tại
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        });
    };

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await this.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                image: base64,
            });
        }
    };

    getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    openPreviewImage = () => {
        if (!this.state.previewImgURL) return;
        this.setState({
            isOpen: true,
        });
    };

    handleSaveUser = async () => {
        let isValid = this.checkValidateInput(); // Uncomment validation
        if (!isValid) return;

        try {
            let response = await createUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                genderCode: this.state.genderCode,
                roleCode: this.state.roleCode,
                positionCode: this.state.positionCode,
                image: this.state.image,
            });

            if (response && response.data.errCode === 0) {
                toast.success("Create new user successfully!");
                this.setState({
                    email: "",
                    password: "",
                    firstName: "",
                    lastName: "",
                    address: "",
                    phoneNumber: "",
                    genderCode: "",
                    roleCode: "",
                    positionCode: "",
                    image: "",
                    previewImgURL: "",
                });
            } else {
                toast.error(response.data.errMessage);
            }
        } catch (error) {
            toast.error("Something went wrong...");
            console.error("Error creating user:", error);
        }
    };

    checkValidateInput = () => {
        let isValid = true;
        const requiredFields = {
            email: "Email",
            password: "Password",
            firstName: "First name",
            lastName: "Last name",
            genderCode: "Gender",
            roleCode: "Role",
            positionCode: "Position",
        };

        for (let field in requiredFields) {
            if (!this.state[field]) {
                isValid = false;
                toast.error(
                    `Missing required parameter: ${requiredFields[field]}`
                );
                break;
            }
        }

        // Email validation
        if (isValid && !/\S+@\S+\.\S+/.test(this.state.email)) {
            isValid = false;
            toast.error("Invalid email format");
        }

        // Password validation (at least 6 characters)
        if (isValid && this.state.password.length < 6) {
            isValid = false;
            toast.error("Password must be at least 6 characters");
        }

        // Phone number validation (if provided)
        if (
            isValid &&
            this.state.phoneNumber &&
            !/^\d{10,11}$/.test(this.state.phoneNumber)
        ) {
            isValid = false;
            toast.error("Invalid phone number format");
        }

        return isValid;
    };
    render() {
        console.log("check state", this.state);
        return (
            <div className="user-redux-container">
                <div className="container-fluid px-5">
                    <div className="title text-center">
                        <h2>User Management</h2>
                    </div>
                    <form className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={this.state.email}
                                onChange={(event) =>
                                    this.handleOnChangeInput(event, "email")
                                }
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Password</label>
                            <div className="input-group">
                                <input
                                    type={
                                        this.state.showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    className="form-control"
                                    value={this.state.password}
                                    onChange={(event) =>
                                        this.handleOnChangeInput(
                                            event,
                                            "password"
                                        )
                                    }
                                />
                                <span
                                    className="input-group-text"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        this.setState({
                                            showPassword:
                                                !this.state.showPassword,
                                        })
                                    }
                                >
                                    <i
                                        className={
                                            this.state.showPassword
                                                ? "fas fa-eye-slash"
                                                : "fas fa-eye"
                                        }
                                    ></i>
                                </span>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={this.state.firstName}
                                onChange={(event) =>
                                    this.handleOnChangeInput(event, "firstName")
                                }
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={this.state.lastName}
                                onChange={(event) =>
                                    this.handleOnChangeInput(event, "lastName")
                                }
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label">Address</label>
                            <input
                                type="text"
                                className="form-control"
                                value={this.state.address}
                                onChange={(event) =>
                                    this.handleOnChangeInput(event, "address")
                                }
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="text"
                                className="form-control"
                                value={this.state.phoneNumber}
                                onChange={(event) =>
                                    this.handleOnChangeInput(
                                        event,
                                        "phoneNumber"
                                    )
                                }
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Gender</label>
                            <select
                                className="form-select"
                                value={this.state.genderCode}
                                onChange={(event) =>
                                    this.handleOnChangeInput(
                                        event,
                                        "genderCode"
                                    )
                                }
                            >
                                <option value="">Choose gender...</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="O">Other</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Role</label>
                            <select
                                className="form-select"
                                value={this.state.roleCode}
                                onChange={(event) =>
                                    this.handleOnChangeInput(event, "roleCode")
                                }
                            >
                                <option value="">Choose role...</option>
                                <option value="R1">Admin</option>
                                <option value="R2">Management</option>
                                <option value="R3">Volunteer</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Position</label>
                            <select
                                className="form-select"
                                value={this.state.positionCode}
                                onChange={(event) =>
                                    this.handleOnChangeInput(
                                        event,
                                        "positionCode"
                                    )
                                }
                            >
                                <option value="">Choose position...</option>
                                <option value="P1">Captain</option>
                                <option value="P2">Management</option>
                                <option value="P3">Volunteer</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Image</label>
                            <div className="preview-img-container">
                                <input
                                    type="file"
                                    className="form-control mb-3"
                                    onChange={(event) =>
                                        this.handleOnChangeImage(event)
                                    }
                                    accept="image/*"
                                />
                                {this.state.previewImgURL && (
                                    <div
                                        className="preview-image"
                                        style={{
                                            backgroundImage: `url(${this.state.previewImgURL})`,
                                        }}
                                        onClick={() => this.openPreviewImage()}
                                    ></div>
                                )}
                            </div>
                        </div>

                        <div className="col-12">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => this.handleSaveUser()}
                            >
                                Save
                            </button>
                        </div>
                    </form>
                    {this.state.isOpen === true && (
                        <Lightbox
                            mainSrc={this.state.previewImgURL}
                            onCloseRequest={() =>
                                this.setState({ isOpen: false })
                            }
                        />
                    )}
                </div>
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
