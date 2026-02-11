import React, { Component } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { connect } from "react-redux";
import "./UserManage.scss";
import {
    getAllUsers,
    deleteUser,
    updateUser,
    createUser,
} from "../../services/userServices";
import ModalUser from "./ModalUser"; // Import ModalUser

class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            userIdToEdit: null,
            userEditData: {
                firstName: "",
                lastName: "",
                email: "",
                address: "",
            },
            showModal: false,
        };
    }

    async componentDidMount() {
        await this.fetchAllUsers();
    }

    // Lấy toàn bộ danh sách người dùng từ API
    fetchAllUsers = async () => {
        let response = await getAllUsers("ALL");
        if (response && response.data && response.data.errCode === 0) {
            this.setState({ arrUsers: response.data.users });
            console.log("check user", response);
        }
    };

    // Hiển thị modal chỉnh sửa người dùng
    handleEditUser = (user) => {
        this.setState({
            userIdToEdit: user.id,
            userEditData: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                address: user.address,
            },
            showModal: true, // Hiển thị modal
        });
    };

    // Thay đổi dữ liệu người dùng trong form
    handleChangeUserEditData = (event) => {
        let inputName = event.target.name;
        let inputValue = event.target.value;
        let updatedUserEditData = { ...this.state.userEditData };
        updatedUserEditData[inputName] = inputValue;
        this.setState({ userEditData: updatedUserEditData });
    };

    // Kiểm tra tính hợp lệ của dữ liệu người dùng
    validateUserData = () => {
        let { firstName, lastName, email, address } = this.state.userEditData;
        if (!firstName || !lastName || !email || !address) {
            alert("Vui lòng nhập đầy đủ thông tin.");
            return false;
        }
        return true;
    };

    // Lưu thay đổi thông tin người dùng
    handleSaveUserEdit = async () => {
        if (!this.validateUserData()) {
            return; // Nếu dữ liệu không hợp lệ, thoát khỏi hàm này
        }
        let { userIdToEdit, userEditData } = this.state;
        let data = {
            id: userIdToEdit,
            firstName: userEditData.firstName,
            lastName: userEditData.lastName,
            email: userEditData.email,
            address: userEditData.address,
        };
        let response = await updateUser(data);
        if (response && response.data.errCode === 0) {
            await this.fetchAllUsers();
            this.setState({
                userIdToEdit: null,
                userEditData: {
                    firstName: "",
                    lastName: "",
                    email: "",
                    address: "",
                },
                showModal: false, // Ẩn modal sau khi lưu
            });
        } else {
            alert(response.data.errMessage);
        }
    };

    // Đóng modal
    handleCloseModal = () => {
        this.setState({ showModal: false });
    };

    // Xóa người dùng
    handleDeleteUser = async (userId) => {
        let response = await deleteUser(userId);
        if (response && response.data.errCode === 0) {
            await this.fetchAllUsers();
        } else {
            alert(response.data.errMessage);
        }
    };

    render() {
        let { arrUsers, userEditData, showModal } = this.state;
        return (
            <div className="user-center">
                <div className="title text-center">
                    Manage user with anhtonton
                </div>
                <button
                    type="button"
                    className="btn btn-primary mb-2"
                    onClick={this.handleShowModal}
                >
                    + Add New User
                </button>
                <div className="user-table mt-4 mx-3">
                    <table
                        className="table table-striped table-hover table-bordered"
                        id="customers"
                    >
                        <thead className="thead-dark custom-header">
                            <tr>
                                <th style={{ width: "25%" }}>Email</th>
                                <th style={{ width: "20%" }}>Firstname</th>
                                <th style={{ width: "20%" }}>Lastname</th>
                                <th style={{ width: "25%" }}>Address</th>
                                <th style={{ width: "10%" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {arrUsers &&
                                arrUsers.length > 0 &&
                                arrUsers.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.email}</td>
                                        <td>{user.firstName}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.address}</td>
                                        <td>
                                            <button
                                                className="btn"
                                                onClick={() =>
                                                    this.handleEditUser(user)
                                                }
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="btn"
                                                onClick={() =>
                                                    this.handleDeleteUser(
                                                        user.id
                                                    )
                                                }
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <ModalUser
                    show={showModal}
                    handleClose={this.handleCloseModal}
                    userEditData={userEditData}
                    handleChangeUserEditData={this.handleChangeUserEditData}
                    handleSaveUserEdit={this.handleSaveUserEdit}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
