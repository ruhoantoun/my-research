import React, { Component } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { connect } from "react-redux";
import "./UserDisplay.scss";
import {
    getAllUsers,
    deleteUser,
    updateUser,
    createUser,
} from "../../services/userServices";
import ModalEditUser from "./ModalUser";
import { toast } from "react-toastify";
class UserDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            isOpenModalEdit: false,
            currentUser: null,
        };
    }

    async componentDidMount() {
        try {
            const response = await getAllUsers();
            if (response && response.data.errCode === 0) {
                this.setState({
                    users: response.data.data,
                });
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }
    handleEditUser = (user) => {
        this.setState({
            isOpenModalEdit: true,
            currentUser: user,
        });
    };
    toggleModalEdit = () => {
        this.setState({
            isOpenModalEdit: false,
            currentUser: null, // Clear current user when closing
        });
    };
    handleDeleteUser = async (userId) => {
        try {
            // Find the user in the current users list
            const userToDelete = this.state.users.find(user => user.id === userId);
            const fullName = `${userToDelete.firstName} ${userToDelete.lastName}`;
    
            if (window.confirm(`Are you sure you want to delete user: ${fullName}?`)) {
                let response = await deleteUser(userId);
                if (response && response.data.errCode === 0) {
                    toast.success(`Deleted user ${fullName} successfully!`);
                    await this.getAllUsersFromReact();
                } else {
                    toast.error(`Failed to delete user ${fullName}: ${response.data.errMessage}`);
                }
            }
        } catch (error) {
            toast.error('Something went wrong while deleting the user');
            console.error('Error deleting user:', error);
        }
    };
// Thêm hàm handleUpdateUser
    handleUpdateUser = async (userData) => {
        try {
            let response = await updateUser(userData);
            if (response && response.data.errCode === 0) {
                toast.success("Cập nhật người dùng thành công!");
                await this.getAllUsersFromReact();
                this.toggleModalEdit(); // Đóng modal sau khi cập nhật
            } else {
                toast.error(response.data.errMessage || "Lỗi cập nhật người dùng");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Đã xảy ra lỗi khi cập nhật");
        }
    };
    getAllUsersFromReact = async () => {
        try {
            const response = await getAllUsers();
            if (response && response.data.errCode === 0) {
                this.setState({
                    users: response.data.data,
                });
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };
    render() {
        const { users } = this.state;
        return (
            <div className="user-display-container">
                <div className="title text-center mb-4">
                    <h2>Quản lý người dùng</h2>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>STT</th>
                                <th>Email</th>
                                <th>Họ</th>
                                <th>Tên</th>
                                <th>Địa chỉ</th>
                                <th>Số điện thoại</th>
                                <th>Giới tính</th>
                                <th>Chức vụ</th>
                                <th>Vị trí</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users &&
                                users.map((user, index) => (
                                    <tr key={user.id}>
                                        <td>{index + 1}</td>
                                        <td>{user.email}</td>
                                        <td>{user.firstName}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.address || "N/A"}</td>
                                        <td>{user.phoneNumber || "N/A"}</td>
                                        <td>
                                            {user.genderData?.valueVi || "N/A"}
                                        </td>
                                        <td>
                                            {user.roleData?.valueVi || "N/A"}
                                        </td>
                                        <td>
                                            {user.positionData?.valueVi ||
                                                "N/A"}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() =>
                                                    this.handleEditUser(user)
                                                }
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
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

                <ModalEditUser
                    isOpen={this.state.isOpenModalEdit}
                    toggleModal={this.toggleModalEdit}
                    currentUser={this.state.currentUser}
                    handleUpdateUser={this.handleUpdateUser}
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

export default connect(mapStateToProps, mapDispatchToProps)(UserDisplay);
