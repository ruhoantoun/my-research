import React, { Component } from "react";
import { connect } from "react-redux";
import "./EventDisplay.scss";
import { getAllEvents, deleteEvent, updateEvent } from "../../services/eventServices";
import { createNotification } from "../../services/notificationServices";
import { toast } from "react-toastify";
import ModalEditEvent from "./ModalEditEvent";
import moment from "moment";
import { FormattedMessage } from "react-intl";
import Swal from "sweetalert2";
import { Link, withRouter } from "react-router-dom";
class EventDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            isOpenModalEdit: false,
            eventId: null,
        };
    }
    formatCost = (cost) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(cost);
    };

    async componentDidMount() {
         const { match } = this.props;
         console.log("match", match);
        await this.fetchEvents();
    }

    // Thêm các hàm xử lý modal
    handleEditEvent = (eventId) => {
        this.setState({
            isOpenModalEdit: true,
            eventId: eventId,
        });
    };

    handleCloseModalEdit = () => {
        this.setState({
            isOpenModalEdit: false,
            eventId: null,
        });
    };

    // Hàm xử lý sau khi cập nhật thành công
    handleEditEventSuccess = () => {
        this.fetchEvents(); // Lấy lại danh sách sự kiện sau khi cập nhật
        this.handleCloseModalEdit(); // Đóng modal
    };

    // Hàm mới để tạo thông báo khi sự kiện bị hủy
    createCancellationNotification = async (event) => {
        try {
            const userId = this.props.userInforr?.id;

            if (!userId) {
                console.error("Không có thông tin người dùng để tạo thông báo");
                return;
            }

            const notificationData = {
                title: "Thông báo hủy sự kiện",
                message: `Sự kiện "${event.name}" được dự kiến diễn ra vào ngày ${event.date} tại ${event.address} đã bị hủy bỏ.`,
                type: "event_updated",
                reference_id: event.id,
                reference_type: "EVENT",
                link: `/event`, // Dẫn về trang danh sách sự kiện
                created_by: userId, // ID của admin thực hiện thao tác
                send_to_all: true, // Gửi cho tất cả người dùng
            };

            const response = await createNotification(notificationData);
            // Kiểm tra phản hồi từ server
            console.log("response createNotification", response);

            if (response && response.data.errCode === 0) {
                console.log("Thông báo hủy sự kiện đã được gửi thành công:", response.data.data);
            } else {
                console.error("Lỗi khi gửi thông báo hủy sự kiện:", response.derrMessage);
            }
        } catch (error) {
            console.error("Lỗi khi tạo thông báo hủy sự kiện:", error);
        }
    };

    // Sửa lại hàm handleDeleteEvent để gửi thông báo
    handleDeleteEvent = async (event) => {
        try {
            const fullName = `${event.name}`;

            // Sử dụng SweetAlert2 để xác nhận
            const result = await Swal.fire({
                title: "Xác nhận xóa",
                html: `Bạn có chắc chắn muốn xóa sự kiện <strong>${fullName}</strong>?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Xóa",
                cancelButtonText: "Hủy",
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                reverseButtons: true,
            });

            if (result.isConfirmed) {
                let response = await deleteEvent(event);
                if (response && response.data.errCode === 0) {
                    // Gửi thông báo hủy sự kiện tới người dùng
                    await this.createCancellationNotification(event);

                    Swal.fire("Thành công", `Đã xóa sự kiện ${fullName}!`, "success");
                    await this.fetchEvents();
                } else {
                    Swal.fire("Thất bại", `Xóa thất bại: ${response.data.errMessage}`, "error");
                }
            }
        } catch (error) {
            Swal.fire("Lỗi", "Có lỗi xảy ra khi xóa sự kiện", "error");
            console.error("Lỗi khi xóa sự kiện:", error);
        }
    };

    fetchEvents = async () => {
        try {
            const response = await getAllEvents();
            console.log("response", response);
            if (response && response.data.errCode === 0) {
                this.setState({
                    events: response.data.data || [],
                });
            } else {
                toast.error(response.data.errMessage || "Có lỗi khi lấy danh sách sự kiện");
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sự kiện:", error);
            toast.error("Không thể kết nối đến server");
        }
    };

    render() {
        const { events, isOpenModalEdit, eventId } = this.state;
        console.log("events", events);

        return (
            <div className="event-display-container">
                <div className="title text-center">
                    <h2>Quản lý sự kiện</h2>
                </div>
                <div className="table-container">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Tên sự kiện</th>
                                <th scope="col">Loại sự kiện</th>
                                <th scope="col">Ngày diễn ra</th>
                                <th scope="col">Địa điểm</th>
                                <th scope="col">Số thành viên</th>
                                <th scope="col">Chi phí</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events && events.length > 0 ? (
                                events.map((event, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{event.id}</td>
                                            <td>{event.name}</td>
                                            <td>{event.eventType.valueVi}</td>
                                            <td>{event.date}</td>
                                            <td>{event.address}</td>
                                            <td>{event.quantityMember}</td>
                                            <td>{this.formatCost(event.cost)}</td>
                                            <td>{event.status.valueVi}</td>
                                            <td>
                                                <button className="btn btn-primary" onClick={() => this.handleEditEvent(event.id)} title="Chỉnh sửa">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="btn btn-info" onClick={() => this.setState({ isOpenModalEdit: true, currentEvent: event })} title="Thông báo">
                                                    <i className="fas fa-bell"></i>
                                                </button>
                                                <button className="btn btn-danger" onClick={() => this.handleDeleteEvent(event)} title="Xóa">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                                <Link to={`/system/event-registration/${event.id}`}>
                                                    <button className="btn btn-primary">
                                                        <i className="fas fa-chart-bar"></i>
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center">
                                        Không có sự kiện nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Thêm Modal */}
                    {isOpenModalEdit && (
                        <ModalEditEvent isOpen={isOpenModalEdit} eventId={eventId} closeModal={this.handleCloseModalEdit} onSuccess={this.handleEditEventSuccess} />
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userInforr: state.user.userInforr, // Thêm userInforr từ Redux store
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(EventDisplay);
