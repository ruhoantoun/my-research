import React, { Component } from "react";
import { connect } from "react-redux";
import "./EventManage.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createEvent } from "../../services/eventServices";
import { createNotification } from "../../services/notificationServices";
class EventManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typeEventCode: "",
            name: "",
            date: "",
            address: "",
            quantityMember: 0,
            cost: 0,
            statusCode: "",
        };
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
            name: "Event name",
            date: "Event date",
            address: "Event address",
            typeEventCode: "Event type",
            statusCode: "Event status",
        };

        for (let field in requiredFields) {
            if (!this.state[field]) {
                isValid = false;
                toast.error(`Missing required parameter: ${requiredFields[field]}`);
                break;
            }
        }

        return isValid;
    };

    handleSaveEvent = async () => {
        let isValid = this.checkValidateInput();
        if (!isValid) return;

        try {
            let response = await createEvent({
                typeEventCode: this.state.typeEventCode,
                name: this.state.name,
                date: this.state.date,
                address: this.state.address,
                quantityMember: this.state.quantityMember,
                cost: this.state.cost,
                statusCode: this.state.statusCode,
            });

            if (response && response.data.errCode === 0) {
                toast.success("Create new event successfully!");
                console.log("Event created successfully:", response.data);
                // Lấy ID của sự kiện mới tạo từ response
                const newEventId = response.data.id;

                // Tạo thông báo cho tất cả người dùng về sự kiện mới
                await this.createEventNotification(newEventId);
                this.setState({
                    typeEventCode: "",
                    name: "",
                    date: "",
                    address: "",
                    quantityMember: 0,
                    cost: 0,
                    statusCode: "",
                });
            } else {
                toast.error(response.data.errMessage);
            }
        } catch (error) {
            toast.error("Something went wrong...");
            console.error("Error creating event:", error);
        }
    };
    // Hàm mới để tạo thông báo sự kiện
    createEventNotification = async (eventId) => {
        try {
            const eventDate = new Date(this.state.date).toLocaleDateString("vi-VN");
            const userId = this.props.userInforr?.id;

            if (!userId) {
                console.error("Không có thông tin người dùng để tạo thông báo");
                return;
            }
            const notificationData = {
                title: "Sự kiện mới được tạo", // title là bắt buộc
                message: `Sự kiện "${this.state.name}" sẽ diễn ra vào ngày ${eventDate} tại ${this.state.address}.`, // message thay vì content
                type: "event_created", // type thay vì notification_type
                reference_id: eventId,
                reference_type: "EVENT",
                link: `/event-details/${eventId}`,
                created_by: userId, // created_by thay vì sender_id (bắt buộc)
                send_to_all: true, // Gửi cho tất cả người dùng
                // Có thể chọn một trong những cách sau để xác định người nhận:
                // 1. send_to_all: true - gửi cho tất cả
                // 2. user_ids: [1, 2, 3] - gửi cho danh sách người dùng cụ thể
                // 3. role_code: "R2" - gửi cho nhóm người dùng theo role (ví dụ: R2 là Volunteer)
                // 4. user_id: 5 - gửi cho một người dùng cụ thể
            };

            const response = await createNotification(notificationData);

            if (response && response.errCode === 0) {
                console.log("Thông báo sự kiện đã được tạo thành công:", response.data);
            } else {
                console.error("Lỗi khi tạo thông báo:", response.errMessage);
            }
        } catch (error) {
            console.error("Lỗi khi tạo thông báo sự kiện:", error);
            // Không hiển thị lỗi cho người dùng vì đây là tính năng phụ
        }
    };
    render() {
        return (
            <div className="event-manage-container">
                <div className="container-fluid px-5">
                    <div className="title text-center">
                        <h2>Event Management</h2>
                    </div>
                    <form className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Event Type</label>
                            <select className="form-select" value={this.state.typeEventCode} onChange={(event) => this.handleOnChangeInput(event, "typeEventCode")}>
                                <option value="">Choose event type...</option>
                                <option value="E1">Small Event</option>
                                <option value="E2">Medium Event</option>
                                <option value="E3">Large Event</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Event Name</label>
                            <input type="text" className="form-control" value={this.state.name} onChange={(event) => this.handleOnChangeInput(event, "name")} />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Date</label>
                            <input type="date" className="form-control" value={this.state.date} onChange={(event) => this.handleOnChangeInput(event, "date")} />
                        </div>

                        <div className="col-12">
                            <label className="form-label">Address</label>
                            <input type="text" className="form-control" value={this.state.address} onChange={(event) => this.handleOnChangeInput(event, "address")} />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Quantity Member</label>
                            <input
                                type="number"
                                className="form-control"
                                min="0"
                                value={this.state.quantityMember}
                                onChange={(event) => this.handleOnChangeInput(event, "quantityMember")}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Cost</label>
                            <input
                                type="number"
                                className="form-control"
                                step="0.01"
                                min="0"
                                value={this.state.cost}
                                onChange={(event) => this.handleOnChangeInput(event, "cost")}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Status</label>
                            <select className="form-select" value={this.state.statusCode} onChange={(event) => this.handleOnChangeInput(event, "statusCode")}>
                                <option value="">Choose status...</option>
                                <option value="S1">Ongoing</option>
                                <option value="S2">Completed</option>
                                <option value="S3">Canceled</option>
                            </select>
                        </div>

                        <div className="col-12">
                            <button type="button" className="btn btn-primary" onClick={() => this.handleSaveEvent()}>
                                Save Event
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        userInforr: state.user.userInforr,
    };
};

export default connect(mapStateToProps)(EventManage);
