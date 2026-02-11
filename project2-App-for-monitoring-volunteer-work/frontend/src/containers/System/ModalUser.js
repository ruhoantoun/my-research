import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import {
    getAllUsers,
    deleteUser,
    updateUser,
    createUser,
} from "../../services/userServices";
class ModalEditUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            phoneNumber: "",
            firstName: "",
            lastName: "",
            address: "",
            genderCode: "",
            roleCode: "",
            positionCode: "",
            image: "",
        };
    }

    componentDidMount() {
        let user = this.props.currentUser;
        if (user) {
            this.setState({
                email: user.email,
                password: "********", // Masked password
                phoneNumber: user.phoneNumber || "",
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address || "",
                genderCode: user.genderCode || "",
                roleCode: user.roleCode || "",
                positionCode: user.positionCode || "",
                image: user.image || "",
            });
        }
    }

    // Add componentDidUpdate to handle new user data
    componentDidUpdate(prevProps) {
        if (
            this.props.currentUser !== prevProps.currentUser &&
            this.props.currentUser
        ) {
            const user = this.props.currentUser;
            this.setState({
                email: user.email || "",
                password: "********",
                phoneNumber: user.phoneNumber || "",
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                address: user.address || "",
                genderCode: user.genderCode || "",
                roleCode: user.roleCode || "",
                positionCode: user.positionCode || "",
                image: user.image || "",
            });
        }
    }

    resetState = () => {
        this.setState({
            email: "",
            password: "",
            phoneNumber: "",
            firstName: "",
            lastName: "",
            address: "",
            genderCode: "",
            roleCode: "",
            positionCode: "",
            image: "",
        });
    };

    handleOnChangeInput = (event, id) => {
        // Only allow changes for editable fields
        if (!["email", "password", "phoneNumber"].includes(id)) {
            this.setState({
                [id]: event.target.value,
            });
        }
    };

    checkValidateInput = () => {
        let isValid = true;
        const requiredFields = ["firstName", "lastName"];

        for (let field of requiredFields) {
            if (!this.state[field]) {
                isValid = false;
                toast.error(`Missing parameter: ${field}`);
                break;
            }
        }
        return isValid;
    };

    handleSaveUser = () => {
        if (!this.checkValidateInput()) return;
        console.log("check id", this.props.currentUser.id)
        const editableData = {
            id: this.props.currentUser.id, // Important: Include ID for update
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: this.state.address,
            genderCode: this.state.genderCode,
            roleCode: this.state.roleCode,
            positionCode: this.state.positionCode,
            // image: this.state.image,
        };

        this.props.handleUpdateUser(editableData);
        console.log("check editableData", editableData)

    };

    handleClose = () => {
        this.props.toggleModal();
    };

    render() {
        return (
            <Modal
                show={this.props.isOpen}
                onHide={this.handleClose}
                size="lg"
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit User Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        {/* Non-editable fields */}
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control bg-light"
                                    value={this.state.email}
                                    disabled
                                    style={{ cursor: "not-allowed" }}
                                />
                            </div>
                            <div className="col-md-4">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="form-control bg-light"
                                    value={this.state.password}
                                    disabled
                                    style={{ cursor: "not-allowed" }}
                                />
                            </div>
                            <div className="col-md-4">
                                <label>Phone Number</label>
                                <input
                                    type="text"
                                    className="form-control bg-light"
                                    value={this.state.phoneNumber}
                                    disabled
                                    style={{ cursor: "not-allowed" }}
                                />
                            </div>
                        </div>

                        {/* Editable fields */}
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={this.state.firstName}
                                    onChange={(event) =>
                                        this.handleOnChangeInput(
                                            event,
                                            "firstName"
                                        )
                                    }
                                />
                            </div>
                            <div className="col-md-6">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={this.state.lastName}
                                    onChange={(event) =>
                                        this.handleOnChangeInput(
                                            event,
                                            "lastName"
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-12">
                                <label>Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={this.state.address}
                                    onChange={(event) =>
                                        this.handleOnChangeInput(
                                            event,
                                            "address"
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4">
                                <label>Gender</label>
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
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label>Role</label>
                                <select
                                    className="form-select"
                                    value={this.state.roleCode}
                                    onChange={(event) =>
                                        this.handleOnChangeInput(
                                            event,
                                            "roleCode"
                                        )
                                    }
                                >
                                    <option value="">Choose role...</option>
                                    <option value="R1">Admin</option>
                                    <option value="R2">Management</option>
                                    <option value="R3">Volunteer</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label>Position</label>
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
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.handleSaveUser}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ModalEditUser;
