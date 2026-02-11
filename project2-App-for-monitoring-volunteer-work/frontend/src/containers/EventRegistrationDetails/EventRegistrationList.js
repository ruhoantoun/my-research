import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EventRegistrationList.scss"; // Tạo file SCSS riêng cho component
import { updateEventRegistration } from "../../services/eventServices";
import { getEventRegistrationsById } from "../../services/eventServices";
import { deleteEventRegistration } from "../../services/eventServices";

class EventRegistrationList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedRow: null,
            searchTerm: "",
            isEditing: false,
            editingRegistration: null,
            showConfirmDelete: false,
            deleteId: null,
        };
    }
    // 1. Hàm mở modal chỉnh sửa
    handleEditRegistration = (registration) => {
        if (!this.canModifyRegistration(registration)) {
            toast.warning("Bạn không có quyền chỉnh sửa đăng ký này!");
            return;
        }
        this.setState({
            isEditing: true,
            editingRegistration: { ...registration },
        });

        console.log(this.state.editingRegistration);
    };
    // Hàm đóng modal chỉnh sửa
    handleCloseEdit = () => {
        this.setState({
            isEditing: false,
            editingRegistration: null,
        });
    };

    // 3. Hàm cập nhật thông tin đang chỉnh sửa
    handleEditChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            editingRegistration: {
                ...prevState.editingRegistration,
                [name]: value,
            },
        }));
    };

    handleSaveEdit = async () => {
        try {
            const { editingRegistration } = this.state;
            // Gọi API cập nhật thông tin đăng ký
            // Giả định bạn có service updateEventRegistration
            const response = await updateEventRegistration(editingRegistration);
            console.log("check response updateEventRegistration", response);
            if (response && response.data.errCode === 0) {
                toast.success("Cập nhật thông tin đăng ký thành công");
                if (this.props.onRefreshData) {
                    await this.props.onRefreshData();
                }

                this.handleCloseEdit();
            } else {
                toast.error(response.data.errMessage || "Cập nhật không thành công");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin đăng ký:", error);
            toast.error("Đã xảy ra lỗi khi cập nhật thông tin");
        }
    };

    // Thêm hàm kiểm tra quyền cho phép chỉnh sửa hoặc xóa đăng ký
    canModifyRegistration = (registration) => {
        const { userInforr } = this.props;

        // Nếu không có thông tin người dùng đăng nhập, không cho phép chỉnh sửa
        if (!userInforr) return false;

        // Admin (roleId = R1) có thể chỉnh sửa tất cả
        if (userInforr.roleId === "R1") return true;

        // Người dùng thường chỉ được chỉnh sửa đăng ký của chính mình
        return userInforr.id === registration.userId;
    };
    // // 1. Hàm mở modal chỉnh sửa
    // handleEditRegistration = (registration) => {
    //     if (!this.canModifyRegistration(registration)) {
    //         toast.warning("Bạn không có quyền chỉnh sửa đăng ký này!");
    //         return;
    //     }
    //     this.setState({
    //         isEditing: true,
    //         editingRegistration: { ...registration },
    //     });
    // };
    // 5. Hàm xác nhận xóa đăng ký
    handleConfirmDelete = (registration) => {
        this.setState({
            showConfirmDelete: true,
            deleteId: { ...registration },
        });
        console.log(this.state.deleteId);
    };

    // 6. Hàm hủy xóa đăng ký
    handleCancelDelete = () => {
        this.setState({
            showConfirmDelete: false,
            deleteId: null,
        });
    };

    // 7. Hàm thực hiện xóa đăng ký
    handleDeleteRegistration = async () => {
        try {
            const { deleteId } = this.state;
            console.log("check state", this.state);
            // Gọi API xóa đăng ký
            // Giả định bạn có service deleteEventRegistration
            const response = await deleteEventRegistration(deleteId);

            if (response && response.data.errCode === 0) {
                toast.success("Xóa đăng ký thành công");

                // Cập nhật lại danh sách đăng ký trong props
                // Hoặc gọi lại API để lấy danh sách mới
                if (this.props.onRefreshData) {
                    this.props.onRefreshData();
                }

                this.handleCancelDelete();
            } else {
                toast.error(response.data.errMessage || "Xóa đăng ký không thành công");
            }
        } catch (error) {
            console.error("Lỗi khi xóa đăng ký:", error);
            toast.error("Đã xảy ra lỗi khi xóa đăng ký");
        }
    };

    // Toggle mở rộng hàng
    toggleRow = (id) => {
        this.setState((prevState) => ({
            expandedRow: prevState.expandedRow === id ? null : id,
        }));
    };

    // Format date
    formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    // Format cost to VND
    formatCost = (cost) => {
        if (!cost) return "0 VND";
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(parseFloat(cost));
    };

    // Lọc danh sách đăng ký
    getFilteredRegistrations = () => {
        const { eventRegistrationData } = this.props;
        const { searchTerm } = this.state;

        if (!eventRegistrationData || !Array.isArray(eventRegistrationData) || eventRegistrationData.length === 0) {
            return [];
        }

        return eventRegistrationData.filter((reg) => {
            // Tìm kiếm theo tên, email hoặc số điện thoại
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                return reg.name.toLowerCase().includes(searchLower) || reg.email.toLowerCase().includes(searchLower) || reg.phoneNumber.includes(searchLower);
            }

            return true;
        });
    };

    // Xử lý thay đổi bộ lọc
    handleFilterChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };
    render() {
        const { eventData, eventRegistrationData } = this.props;
        const { expandedRow, searchTerm, isEditing, editingRegistration, showConfirmDelete } = this.state;

        // console.log("check edit", this.props);
        if (!eventData || !eventRegistrationData) {
            return (
                <div className="loading-container">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                </div>
            );
        }

        const filteredRegistrations = this.getFilteredRegistrations();
        console.log("check filteredRegistrations", filteredRegistrations);
        return (
            <div className="event-registration-container">
                <div className="container-fuild">
                    {/* Bộ lọc danh sách đăng ký */}
                    <div className="registration-filter-container ">
                        <h3>Danh sách người đăng ký ({filteredRegistrations.length})</h3>
                    </div>

                    {/* Bảng danh sách người đăng ký */}
                    <div className="registration-table-container">
                        <div className="card-header">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label>Tìm kiếm:</label>
                                                <div className="search-input">
                                                    <i className="fas fa-search"></i>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Tên, email, số điện thoại..."
                                                        name="searchTerm"
                                                        value={searchTerm}
                                                        onChange={this.handleFilterChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-success">
                                    <i className="fas fa-file-excel"></i> Xuất Excel
                                </button>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                {filteredRegistrations.length > 0 ? (
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Người đăng ký</th>
                                                <th scope="col">Email</th>
                                                <th scope="col">Số điện thoại</th>
                                                <th scope="col">Ngày đăng ký</th>
                                                <th scope="col">Trạng thái</th>
                                                <th scope="col">Phương thức</th>
                                                <th scope="col">Chi tiết</th>
                                                <th scope="col">Điểm danh</th>
                                                <th scope="col">Ngày điểm danh</th>
                                                <th scope="col" style={{ width: "150px" }}>
                                                    Thao tác
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredRegistrations.map((registration, index) => (
                                                <React.Fragment key={registration.id}>
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{registration.name}</td>
                                                        <td>{registration.email}</td>
                                                        <td>{registration.phoneNumber}</td>
                                                        <td>{this.formatDate(registration.registeredAt)}</td>
                                                        <td>
                                                            <span className={`status-badge ${registration.statusCostCode === "PS1" ? "paid" : "unpaid"}`}>
                                                                {registration.statusCost.valueVi}
                                                            </span>
                                                        </td>
                                                        <td>{registration.payMethod.valueVi}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-outline-primary" onClick={() => this.toggleRow(registration.id)}>
                                                                <i className={`fas fa-chevron-${expandedRow === registration.id ? "up" : "down"}`}></i>
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <div className="attendance-toggle">
                                                                <div className="form-check form-switch">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id={`attendance-${registration.id}`}
                                                                        checked={registration.attendanceStatus === 1}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {registration.attendanceTime
                                                                ? this.formatDate(registration.attendanceTime) +
                                                                  " " +
                                                                  new Date(registration.attendanceTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
                                                                : "-"}
                                                        </td>
                                                        <td>
                                                            {this.canModifyRegistration(registration) ? (
                                                                <>
                                                                    <button
                                                                        className="btn btn-sm btn-primary me-1"
                                                                        title="Chỉnh sửa"
                                                                        onClick={() => this.handleEditRegistration(registration)}
                                                                    >
                                                                        <i className="fas fa-edit"></i>
                                                                    </button>
                                                                    <button className="btn btn-sm btn-danger" title="Xóa" onClick={() => this.handleConfirmDelete(registration)}>
                                                                        <i className="fas fa-trash"></i>
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <button
                                                                    className="btn btn-sm btn-secondary"
                                                                    title="Không có quyền chỉnh sửa"
                                                                    // disabled
                                                                    onClick={() => this.handleEditRegistration(registration)}
                                                                >
                                                                    <i className="fas fa-lock"></i>
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                    {expandedRow === registration.id && (
                                                        <tr className="expanded-row">
                                                            <td colSpan="8">
                                                                <div className="expanded-content">
                                                                    <div className="row">
                                                                        <div className="col-md-6">
                                                                            <div className="user-info">
                                                                                <h5>Thông tin người dùng</h5>
                                                                                <ul>
                                                                                    <li>
                                                                                        <strong>ID:</strong> {registration.userId}
                                                                                    </li>
                                                                                    <li>
                                                                                        <strong>Họ:</strong> {registration.User?.firstName || "-"}
                                                                                    </li>
                                                                                    <li>
                                                                                        <strong>Tên:</strong> {registration.User?.lastName || "-"}
                                                                                    </li>
                                                                                    <li>
                                                                                        <strong>Địa chỉ:</strong> {registration.User?.address || "-"}
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <div className="note-info">
                                                                                <h5>Ghi chú</h5>
                                                                                <div className="note-content">
                                                                                    {registration.notes ? registration.notes : <em>Không có ghi chú</em>}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="no-results">
                                        <i className="fas fa-search"></i>
                                        <p>Không tìm thấy kết quả phù hợp với bộ lọc.</p>
                                        {eventRegistrationData.length === 0 && <p>Chưa có người đăng ký tham gia sự kiện này.</p>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal chỉnh sửa đăng ký */}
                {isEditing && editingRegistration && (
                    <div className="modal-backdrop edit-modal-backdrop">
                        <div className="edit-modal">
                            <div className="edit-modal-content">
                                <div className="edit-modal-header">
                                    <h4>Chỉnh sửa thông tin đăng ký</h4>
                                    <button type="button" className="close-btn" onClick={this.handleCloseEdit}>
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                                <div className="edit-modal-body">
                                    <form>
                                        <div className="row mb-3">
                                            <div className="col-md-6 mb-3">
                                                <label>Họ tên:</label>
                                                <input type="text" name="name" className="form-control" value={editingRegistration.name} onChange={this.handleEditChange} />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label>Email:</label>
                                                <input type="email" name="email" className="form-control" value={editingRegistration.email} onChange={this.handleEditChange} />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-md-6 mb-3">
                                                <label>Số điện thoại:</label>
                                                <input
                                                    type="text"
                                                    name="phoneNumber"
                                                    className="form-control"
                                                    value={editingRegistration.phoneNumber}
                                                    onChange={this.handleEditChange}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label>Ngày đăng ký:</label>
                                                <div className="input-with-icon disabled-field">
                                                    <input
                                                        type="date"
                                                        name="registeredAt"
                                                        className="form-control"
                                                        value={editingRegistration.registeredAt ? new Date(editingRegistration.registeredAt).toISOString().split("T")[0] : ""}
                                                        disabled
                                                    />
                                                </div>
                                                <small className="text-muted">Ngày đăng ký không thể thay đổi</small>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-md-6 mb-3">
                                                <label>Trạng thái thanh toán:</label>
                                                <select name="statusCostCode" className="form-select" value={editingRegistration.statusCostCode} onChange={this.handleEditChange}>
                                                    <option value="PS1">Đã thanh toán</option>
                                                    <option value="PS2">Chưa thanh toán</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label>Phương thức thanh toán:</label>
                                                <select name="payMethodCode" className="form-select" value={editingRegistration.payMethodCode} onChange={this.handleEditChange}>
                                                    <option value="PM1">Tiền mặt</option>
                                                    <option value="PM2">Chuyển khoản</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label>Ghi chú:</label>
                                            <textarea
                                                name="notes"
                                                className="form-control"
                                                value={editingRegistration.notes || ""}
                                                onChange={this.handleEditChange}
                                                rows="3"
                                            ></textarea>
                                        </div>
                                    </form>
                                </div>
                                <div className="edit-modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={this.handleCloseEdit}>
                                        Hủy
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={this.handleSaveEdit}>
                                        Lưu thay đổi
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal xác nhận xóa */}
                {showConfirmDelete && (
                    <div className="modal-backdrop delete-modal-backdrop">
                        <div className="delete-confirm-modal">
                            <div className="delete-modal-content">
                                <div className="delete-modal-header">
                                    <h4>Xác nhận xóa</h4>
                                </div>
                                <div className="delete-modal-body">
                                    <p>Bạn có chắc chắn muốn xóa đăng ký này không?</p>
                                    <p>Hành động này không thể hoàn tác.</p>
                                </div>
                                <div className="delete-modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={this.handleCancelDelete}>
                                        Hủy
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={this.handleDeleteRegistration}>
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
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

export default connect(mapStateToProps)(EventRegistrationList);
