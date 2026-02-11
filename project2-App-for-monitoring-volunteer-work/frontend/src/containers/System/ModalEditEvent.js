import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { connect } from "react-redux"; // Thêm connect để lấy thông tin người dùng
import { toast } from "react-toastify";
import _ from "lodash";
import { getEventById, updateEvent } from "../../services/eventServices";
import { getAllCodes } from "../../services/userServices";
import { createNotification } from "../../services/notificationServices"; // Thêm import
import "./ModalEditEvent.scss";

class ModalEditEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            name: "",
            date: "",
            address: "",
            cost: "",
            quantityMember: "",
            typeEventCode: "",
            statusCode: "",
            description: "",
            contentMarkdown: "",
            contentHTML: "",
            isLoading: true,
            eventTypes: [],
            statuses: [],
            // Thêm để lưu dữ liệu ban đầu cho việc so sánh thay đổi
            originalData: null,
        };
    }

    async componentDidMount() {
        await this.fetchEventData();
        await this.fetchSelectOptions();
    }

    fetchEventData = async () => {
        const { eventId } = this.props;
        if (eventId) {
            try {
                const response = await getEventById(eventId);
                if (response && response.data.errCode === 0) {
                    const eventData = response.data.data;
                    // Cập nhật state với dữ liệu từ API
                    const eventState = {
                        id: eventData.id,
                        name: eventData.name,
                        typeEventCode: eventData.typeEventCode || "",
                        statusCode: eventData.statusCode || "",
                        date: eventData.date,
                        address: eventData.address || "",
                        cost: eventData.cost || "",
                        quantityMember: eventData.quantityMember || "",
                        description: eventData.eventMarkdown?.description || "",
                        contentMarkdown: eventData.eventMarkdown?.contentMarkdown || "",
                        contentHTML: eventData.eventMarkdown?.contentHTML || "",
                    };

                    this.setState({
                        ...eventState,
                        originalData: { ...eventState }, // Lưu trữ dữ liệu gốc để so sánh sau này
                        isLoading: false,
                    });
                } else {
                    toast.error("Không thể lấy thông tin sự kiện!");
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin sự kiện:", error);
                toast.error("Đã xảy ra lỗi khi kết nối với server!");
            }
        }
    };

    fetchSelectOptions = async () => {
        try {
            const eventTypeResponse = await getAllCodes("EVENT_TYPE");
            const statusResponse = await getAllCodes("EVENT_STATUS");
            // Lưu dữ liệu vào state
            if (eventTypeResponse && eventTypeResponse.data.errCode === 0) {
                this.setState({
                    eventTypes: eventTypeResponse.data.data || [],
                });
            }

            if (statusResponse && statusResponse.data.errCode === 0) {
                this.setState({
                    statuses: statusResponse.data.data || [],
                });
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu tùy chọn:", error);
        }
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value,
        });
    };

    validateInput = () => {
        const requiredFields = ["name", "typeEventCode", "date", "address", "statusCode"];
        for (let i = 0; i < requiredFields.length; i++) {
            const field = requiredFields[i];
            if (!this.state[field]) {
                toast.error(
                    `Vui lòng điền ${
                        field === "name"
                            ? "tên sự kiện"
                            : field === "typeEventCode"
                            ? "loại sự kiện"
                            : field === "date"
                            ? "ngày diễn ra"
                            : field === "address"
                            ? "địa điểm"
                            : "trạng thái"
                    }`
                );
                return false;
            }
        }
        return true;
    };

    // Hàm mới tạo thông báo cập nhật sự kiện
    createEventUpdateNotification = async () => {
        try {
            if (!this.props.userInforr?.id) {
                console.error("Không có thông tin người dùng để tạo thông báo");
                return;
            }

            // So sánh dữ liệu cũ và mới để xác định những gì đã thay đổi
            const changes = this.getChangedFields();
            if (Object.keys(changes).length === 0) return; // Không có thay đổi

            // Tạo nội dung thông báo chi tiết
            const messageDetails = this.formatChangesMessage(changes);

            // Tạo và gửi thông báo
            const notificationData = {
                title: `Thông tin sự kiện "${this.state.name}" đã được cập nhật`,
                message: `Sự kiện "${this.state.name}" đã được cập nhật: ${messageDetails}`,
                type: "event_updated",
                reference_id: this.state.id,
                reference_type: "EVENT",
                link: `/event-details/${this.state.id}`,
                created_by: this.props.userInforr.id,
                send_to_all: true, // Gửi cho tất cả người dùng
            };
            console.log("notificationData", notificationData);
            // Gọi API để tạo thông báo
            const response = await createNotification(notificationData);

            if (response && response.data.errCode === 0) {
                console.log("Thông báo cập nhật sự kiện đã được gửi thành công:", response.data.data);
            } else {
                console.error("Lỗi khi gửi thông báo cập nhật sự kiện:", response.data.errMessage);
            }
        } catch (error) {
            console.error("Lỗi khi tạo thông báo cập nhật sự kiện:", error);
        }
    };

    // Hàm xác định các trường đã thay đổi
    getChangedFields = () => {
        const { originalData } = this.state;
        const changes = {};

        // Danh sách trường cần kiểm tra
        const fieldsToCheck = ["name", "date", "address", "cost", "quantityMember", "typeEventCode", "statusCode"];

        fieldsToCheck.forEach((field) => {
            if (originalData[field] !== this.state[field]) {
                changes[field] = {
                    old: originalData[field],
                    new: this.state[field],
                };
            }
        });

        return changes;
    };

    // Hàm định dạng thông điệp thay đổi
    formatChangesMessage = (changes) => {
        const messages = [];

        // Map tên trường sang tên hiển thị tiếng Việt
        const fieldNames = {
            name: "tên sự kiện",
            date: "ngày diễn ra",
            address: "địa điểm",
            cost: "chi phí",
            quantityMember: "số lượng thành viên tham gia",
            typeEventCode: "loại sự kiện",
            statusCode: "trạng thái",
        };

        // Định dạng thông báo cho từng trường đã thay đổi
        for (const field in changes) {
            if (field === "date") {
                // Định dạng ngày tháng đẹp hơn
                const oldDate = new Date(changes[field].old).toLocaleDateString("vi-VN");
                const newDate = new Date(changes[field].new).toLocaleDateString("vi-VN");
                messages.push(`${fieldNames[field]} từ ${oldDate} thành ${newDate}`);
            } else if (field === "typeEventCode" || field === "statusCode") {
                // Lấy tên hiển thị từ các options
                const optionsArray = field === "typeEventCode" ? this.state.eventTypes : this.state.statuses;
                const oldValue = optionsArray.find((item) => item.keyName === changes[field].old)?.valueVi || changes[field].old;
                const newValue = optionsArray.find((item) => item.keyName === changes[field].new)?.valueVi || changes[field].new;
                messages.push(`${fieldNames[field]} từ "${oldValue}" thành "${newValue}"`);
            } else {
                messages.push(`${fieldNames[field]} từ "${changes[field].old}" thành "${changes[field].new}"`);
            }
        }

        return messages.join(", ");
    };

    // Sửa lại hàm handleSaveEvent để gọi thông báo sau khi cập nhật thành công
    handleSaveEvent = async () => {
        if (!this.validateInput()) return;

        try {
            const eventData = {
                id: this.state.id,
                name: this.state.name,
                typeEventCode: this.state.typeEventCode,
                date: this.state.date,
                address: this.state.address,
                cost: this.state.cost,
                quantityMember: this.state.quantityMember,
                statusCode: this.state.statusCode,
                description: this.state.description,
            };

            // Gọi API để cập nhật sự kiện
            const response = await updateEvent(eventData);

            if (response && response.data && response.data.errCode === 0) {
                // Tạo thông báo về việc cập nhật sự kiện
                await this.createEventUpdateNotification();

                toast.success("Cập nhật sự kiện thành công!");
                this.props.onSuccess();
            } else {
                toast.error(response.data.errMessage || "Có lỗi khi cập nhật sự kiện!");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật sự kiện:", error);
            toast.error("Đã xảy ra lỗi khi kết nối với server!!");
        }
    };

    render() {
        const { isOpen, closeModal } = this.props;
        const { name, date, address, cost, quantityMember, description, typeEventCode, statusCode, isLoading, eventTypes, statuses, contentMarkdown } = this.state;
        return (
            <Modal isOpen={isOpen} toggle={closeModal} className="modal-edit-event" size="lg">
                <ModalHeader toggle={closeModal}>Chỉnh sửa thông tin sự kiện</ModalHeader>
                <ModalBody>
                    {isLoading ? (
                        <div className="loading-spinner">Đang tải dữ liệu...</div>
                    ) : (
                        <div className="form-container">
                            <div className="row">
                                <div className="col-6 form-group mb-3">
                                    <label>Tên sự kiện</label>
                                    <input type="text" className="form-control" name="name" value={name} onChange={this.handleInputChange} />
                                </div>
                                <div className="col-6 form-group mb-3">
                                    <label>Loại sự kiện</label>
                                    <select className="form-select" name="typeEventCode" value={typeEventCode} onChange={this.handleInputChange}>
                                        {eventTypes &&
                                            eventTypes.length > 0 &&
                                            eventTypes.map((item) => (
                                                <option key={item.id} value={item.keyName}>
                                                    {item.valueVi}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="col-6 form-group mb-3">
                                    <label>Ngày diễn ra</label>
                                    <input type="date" className="form-control" name="date" value={date} onChange={this.handleInputChange} />
                                </div>
                                <div className="col-6 form-group mb-3">
                                    <label>Địa điểm</label>
                                    <input type="text" className="form-control" name="address" value={address} onChange={this.handleInputChange} />
                                </div>
                                <div className="col-6 form-group mb-3">
                                    <label>Chi phí</label>
                                    <input type="number" className="form-control" name="cost" value={cost} onChange={this.handleInputChange} />
                                </div>
                                <div className="col-6 form-group mb-3">
                                    <label>Số thành viên</label>
                                    <input type="number" className="form-control" name="quantityMember" value={quantityMember} onChange={this.handleInputChange} />
                                </div>
                                <div className="col-6 form-group mb-3">
                                    <label>Trạng thái</label>
                                    <select className="form-select" name="statusCode" value={statusCode} onChange={this.handleInputChange}>
                                        {statuses &&
                                            statuses.length > 0 &&
                                            statuses.map((item) => (
                                                <option key={item.id} value={item.keyName}>
                                                    {item.valueVi}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="col-12 form-group mb-3">
                                    <label>Mô tả</label>
                                    <textarea className="form-control" name="description" value={description} onChange={this.handleInputChange} rows="4" />
                                </div>
                                <div className="col-12 form-group mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <label className="fw-bold">Bài viết</label>
                                        <Button
                                            color="info"
                                            size="sm"
                                            className="edit-content-btn"
                                            onClick={() => window.open(`http://localhost:3000/system/event-description`, "_blank")}
                                        >
                                            <i className="fas fa-edit me-1"></i> Chỉnh sửa bài viết
                                        </Button>
                                    </div>
                                    <div
                                        className="content-preview p-3 border rounded"
                                        style={{
                                            minHeight: "200px",
                                            maxHeight: "300px",
                                            overflow: "auto",
                                            backgroundColor: "#f8f9fa",
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: this.state.contentHTML || "<em>Chưa có nội dung HTML</em>",
                                        }}
                                    />
                                    <div className="content-actions mt-2 text-end">
                                        {this.state.contentMarkdown ? (
                                            <Button
                                                color="outline-secondary"
                                                size="sm"
                                                onClick={() => window.open(`http://localhost:3000/event-details/${this.state.id}`, "_blank")}
                                                className="view-btn"
                                            >
                                                <i className="fas fa-eye me-1"></i> Xem bài viết đầy đủ
                                            </Button>
                                        ) : (
                                            <small className="text-muted">
                                                <i className="fas fa-info-circle me-1"></i>
                                                Chưa có bài viết chi tiết. Nhấn "Chỉnh sửa bài viết" để tạo.
                                            </small>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={closeModal}>
                        Hủy
                    </Button>
                    <Button color="primary" onClick={this.handleSaveEvent} disabled={isLoading}>
                        Lưu thay đổi
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

// Kết nối với Redux để lấy thông tin người dùng
const mapStateToProps = (state) => ({
    userInforr: state.user.userInforr,
});

export default connect(mapStateToProps)(ModalEditEvent);
