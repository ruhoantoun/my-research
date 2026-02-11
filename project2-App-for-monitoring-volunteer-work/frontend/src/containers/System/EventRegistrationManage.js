import React, { Component } from "react";
import { connect } from "react-redux";
import ReactToPrint from "react-to-print";
import { createRef } from "react";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "./EventDisplay.scss";
import { getAllEvents, deleteEvent, updateEvent, getEventStatistics } from "../../services/eventServices";
import { createNotification } from "../../services/notificationServices";
import { toast } from "react-toastify";
import moment from "moment";
import { FormattedMessage } from "react-intl";
import Swal from "sweetalert2";
import { Link, withRouter } from "react-router-dom";
import "./EventRegistrationManage.scss";
import { getEventRegistrationsById, updateEventRegistration, getEventById } from "../../services/eventServices";
import { Table, Badge, Button, Form, InputGroup, Spinner, Card, Container, Row, Col, Modal, Tabs, Tab, Dropdown } from "react-bootstrap";
import { FaSearch, FaFilter, FaCheck, FaTimes, FaEye, FaEdit, FaArrowLeft, FaFileExport, FaUserCheck, FaMoneyBillWave, FaCalendarCheck, FaSort } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from "recharts";
class EventRegistrationManage extends Component {
    constructor(props) {
        super(props);
        this.statisticsRef = createRef();
        this.state = {
            eventId: "",
            eventName: "",
            registrations: [],
            filteredRegistrations: [],
            isLoading: false,
            searchTerm: "",
            statusFilter: "all",
            paymentFilter: "all",
            attendanceFilter: "all",
            sortField: "registeredAt",
            sortDirection: "desc",
            showDetailModal: false,
            showAttendanceModal: false,
            selectedRegistration: null,
            attendanceDate: new Date(),
            attendanceNote: "",

            // Thống kê
            totalRegistrations: 0,
            approvedRegistrations: 0,
            pendingRegistrations: 0,
            rejectedRegistrations: 0,
            paidRegistrations: 0,
            unpaidRegistrations: 0,
            attendedRegistrations: 0,
            // Thêm state cho thống kê
            showStatisticsTab: false,
            eventStats: null,
            activeTab: "registrations",
        };
    }
    // Thêm phương thức fetch thống kê
    fetchEventStatistics = async (eventId) => {
        try {
            this.setState({ isLoading: true });
            const res = await getEventStatistics(eventId);
            console.log("API response getEventStatistics:", res);
            if (res && res.data && res.data.errCode === 0) {
                console.log("Event Statistics:", res.data.data);
                this.setState({
                    eventStats: res.data.data,
                    isLoading: false,
                });
            } else {
                toast.error(res.data.errMessage || "Lỗi khi tải thống kê sự kiện");
                this.setState({ isLoading: false });
            }
        } catch (e) {
            console.error("Error fetching event statistics:", e);
            toast.error("Không thể kết nối máy chủ");
            this.setState({ isLoading: false });
        }
    };
    async componentDidMount() {
        // Lấy eventId từ URL
        const { match } = this.props;
        const eventId = match.params.id;
        const data = {
            eventId: eventId,
        };
        console.log("Event ID from URL:", eventId);

        if (!eventId) {
            toast.error("Không tìm thấy sự kiện!");
            return;
        }

        this.setState({ eventId, isLoading: true });
        await this.fetchRegistrations(eventId);
        await this.fetchEventStatistics(data);
    }
    // Thêm hàm này vào trong class EventRegistrationManage
    removeAccents = (str) => {
        if (!str) return "";

        // Normalize chuỗi về dạng NFD (phân tách các ký tự có dấu)
        return (
            str
                .normalize("NFD")
                // Loại bỏ các dấu (các ký tự unicode trong dải 0300-036F)
                .replace(/[\u0300-\u036f]/g, "")
                // Thay thế đặc biệt cho ký tự Đ/đ mà normalize không xử lý
                .replace(/[đĐ]/g, function (m) {
                    return m === "đ" ? "d" : "D";
                })
        );
    };
    // Thêm hàm chuyển tab
    handleTabChange = (tab) => {
        this.setState({ activeTab: tab });
    };

    // Phương thức render tab thống kê
    renderStatisticsTab = () => {
        const { eventStats, isLoading } = this.state;

        if (isLoading) {
            return (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                    <div className="mt-2">Đang tải dữ liệu thống kê...</div>
                </div>
            );
        }

        if (!eventStats) {
            return (
                <div className="text-center my-5">
                    <div className="alert alert-warning">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.
                    </div>
                </div>
            );
        }

        const { eventInfo, registrationStats, attendanceStats, paymentStats } = eventStats;

        // Chuẩn bị dữ liệu cho biểu đồ phân bố đăng ký theo thời gian
        const registrationDistributionData = registrationStats.timeStats.distribution || [];

        // Chuẩn bị dữ liệu cho biểu đồ tròn tỷ lệ tham dự
        const attendanceData = [
            { name: "Đã tham dự", value: attendanceStats.attended, color: "#2dce89" },
            { name: "Chưa tham dự", value: attendanceStats.notAttended, color: "#f5365c" },
        ];

        // Chuẩn bị dữ liệu cho biểu đồ thanh phương thức thanh toán
        const paymentMethodData = paymentStats.byMethod.map((method) => ({
            name: method.name,
            count: method.count,
            amount: method.amount,
        }));

        // Màu cho biểu đồ tròn
        const COLORS = ["#2dce89", "#f5365c", "#11cdef", "#fb6340", "#8965e0"];

        return (
            <div id="statistics-container" ref={this.statisticsRef}>
                {/* Thông tin chung về sự kiện */}
                <Table className="shadow-sm mb-4">
                    <Card.Header className="bg-white">
                        <h5 className="mb-0 fw-bold">Thông tin sự kiện</h5>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={6}>
                                <h6 className="fw-bold">Thông tin cơ bản</h6>
                                <Table borderless size="sm">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <strong>Tên sự kiện:</strong>
                                            </td>
                                            <td>{eventInfo.name}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Ngày diễn ra:</strong>
                                            </td>
                                            <td>{moment(eventInfo.date).format("DD/MM/YYYY")}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Địa điểm:</strong>
                                            </td>
                                            <td>{eventInfo.address}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Loại sự kiện:</strong>
                                            </td>
                                            <td>{eventInfo.type}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Trạng thái:</strong>
                                            </td>
                                            <td>
                                                <Badge
                                                    bg={
                                                        eventInfo.status === "Đang diễn ra"
                                                            ? "success"
                                                            : eventInfo.status === "Sắp diễn ra"
                                                            ? "info"
                                                            : eventInfo.status === "Đã kết thúc"
                                                            ? "secondary"
                                                            : "warning"
                                                    }
                                                >
                                                    {eventInfo.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                            <Col md={6}>
                                <h6 className="fw-bold">Thông tin đăng ký</h6>
                                <Table borderless size="sm">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <strong>Sức chứa:</strong>
                                            </td>
                                            <td>{eventInfo.capacity} người</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Đã đăng ký:</strong>
                                            </td>
                                            <td>{registrationStats.total} người</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Còn trống:</strong>
                                            </td>
                                            <td>{registrationStats.remainingSlots} chỗ</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Tỷ lệ đăng ký:</strong>
                                            </td>
                                            <td>{registrationStats.registrationRate}%</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Tỷ lệ tham dự:</strong>
                                            </td>
                                            <td>{attendanceStats.attendanceRate}%</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Card.Body>
                </Table>

                {/* Thống kê đăng ký và tham dự */}
                <Row className="mb-4">
                    <Col md={6}>
                        <Table className="shadow-sm h-100">
                            <Card.Header className="bg-white">
                                <h5 className="mb-0 fw-bold">Phân bố đăng ký theo thời gian</h5>
                            </Card.Header>
                            <Card.Body>
                                {/* Biểu đồ đăng ký theo thời gian */}
                                <div id="registration-chart">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={registrationDistributionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" tickFormatter={(date) => moment(date).format("DD/MM")} />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(value, name) => [value + " người", "Số lượng đăng ký"]}
                                                labelFormatter={(date) => `Ngày: ${moment(date).format("DD/MM/YYYY")}`}
                                            />
                                            <Bar dataKey="count" name="Số người đăng ký" fill="#5e72e4" barSize={30} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="text-center mt-3">
                                    <small className="text-muted">
                                        {registrationStats.timeStats.earliest ? (
                                            <>
                                                Đăng ký đầu tiên: {moment(registrationStats.timeStats.earliest).format("DD/MM/YYYY HH:mm")}
                                                <br />
                                            </>
                                        ) : null}
                                        {registrationStats.timeStats.latest ? <>Đăng ký mới nhất: {moment(registrationStats.timeStats.latest).format("DD/MM/YYYY HH:mm")}</> : null}
                                    </small>
                                </div>
                            </Card.Body>
                        </Table>
                    </Col>
                    <Col md={6}>
                        <Table className="shadow-sm h-100">
                            <Card.Header className="bg-white">
                                <h5 className="mb-0 fw-bold">Tỷ lệ tham dự</h5>
                            </Card.Header>
                            <Card.Body>
                                {/* Biểu đồ tròn tỷ lệ tham dự */}
                                <div id="attendance-chart" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={attendanceData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                nameKey="name"
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {attendanceData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Legend />
                                            <Tooltip formatter={(value, name) => [`${value} người`, name]} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="text-center mt-3">
                                        <small className="text-muted">
                                            {attendanceStats.earliestAttendance ? (
                                                <>
                                                    Điểm danh sớm nhất: {moment(attendanceStats.earliestAttendance).format("DD/MM/YYYY HH:mm")}
                                                    <br />
                                                </>
                                            ) : null}
                                            {attendanceStats.latestAttendance ? (
                                                <>Điểm danh muộn nhất: {moment(attendanceStats.latestAttendance).format("DD/MM/YYYY HH:mm")}</>
                                            ) : null}
                                        </small>
                                    </div>
                                </div>
                            </Card.Body>
                        </Table>
                    </Col>
                </Row>

                {/* Thống kê thanh toán */}
                <Table className="shadow-sm mb-4">
                    <Card.Header className="bg-white">
                        <h5 className="mb-0 fw-bold">Thống kê thanh toán</h5>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={6}>
                                <div className="mb-4">
                                    <h6 className="fw-bold">Tình hình thanh toán</h6>
                                    <ul className="list-group">
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            Doanh thu dự kiến:
                                            <span>{paymentStats.expectedRevenue.toLocaleString("vi-VN")} VNĐ</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            Đã thanh toán:
                                            <span>{paymentStats.totalPaid.toLocaleString("vi-VN")} VNĐ</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            Chưa thanh toán:
                                            <span>{paymentStats.totalUnpaid.toLocaleString("vi-VN")} VNĐ</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            Tỷ lệ thanh toán:
                                            <span>{paymentStats.paymentRate}%</span>
                                        </li>
                                    </ul>
                                </div>

                                <h6 className="fw-bold">Thanh toán theo trạng thái</h6>
                                <Table hover>
                                    <thead>
                                        <tr>
                                            <th>Trạng thái</th>
                                            <th>Số lượng</th>
                                            <th>Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paymentStats.byStatus.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <Badge bg={item.code === "PS1" ? "success" : "secondary"}>{item.name}</Badge>
                                                </td>
                                                <td>{item.count}</td>
                                                <td>{item.amount.toLocaleString("vi-VN")} VNĐ</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Col>
                            <Col md={6}>
                                <h6 className="fw-bold mb-3">Phương thức thanh toán</h6>
                                <div id="payment-chart">
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={paymentMethodData} layout="vertical" margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis dataKey="name" type="category" />
                                            <Tooltip formatter={(value, name) => [value + (name === "count" ? " người" : " VNĐ"), name === "count" ? "Số lượng" : "Thành tiền"]} />
                                            <Legend formatter={(value) => (value === "count" ? "Số lượng" : "Thành tiền")} />
                                            <Bar dataKey="count" name="count" fill="#5e72e4" barSize={30} />
                                        </BarChart>
                                    </ResponsiveContainer>

                                    <h6 className="fw-bold mt-4">Chi tiết theo phương thức</h6>
                                    <Table hover>
                                        <thead>
                                            <tr>
                                                <th>Phương thức</th>
                                                <th>Số lượng</th>
                                                <th>Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paymentStats.byMethod.map((method, index) => (
                                                <tr key={index}>
                                                    <td>{method.name}</td>
                                                    <td>{method.count}</td>
                                                    <td>{method.amount.toLocaleString("vi-VN")} VNĐ</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Table>

                {/* Nút xuất thống kê */}
                <div className="d-flex justify-content-end mb-5 gap-2">
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="export-dropdown">
                            <i className="fas fa-file-export me-2"></i> Xuất báo cáo
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={this.exportStatisticsToPDF}>
                                <i className="fas fa-file-pdf me-2"></i> Xuất PDF
                            </Dropdown.Item>
                            <Dropdown.Item onClick={this.exportStatisticsToCSV}>
                                <i className="fas fa-file-csv me-2"></i> Xuất CSV
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        );
    };
    fetchRegistrations = async (eventId) => {
        try {
            const res = await getEventRegistrationsById(eventId);

            if (res && res.data && res.data.errCode === 0) {
                const registrations = res.data.data || [];

                // Lấy tên sự kiện từ response
                const events = await getEventById(eventId);
                if (!events || !events.data || events.data.errCode !== 0) {
                    toast.error("Không tìm thấy thông tin sự kiện");
                    this.setState({ isLoading: false });
                    return;
                }

                const eventName = events.data.data?.name || "Sự kiện không rõ tên";

                // Thống kê
                const approvedRegistrations = registrations.filter((r) => r.status === "approved").length;
                const pendingRegistrations = registrations.filter((r) => r.status === "pending").length;
                const rejectedRegistrations = registrations.filter((r) => r.status === "rejected").length;
                const paidRegistrations = registrations.filter((r) => r.statusCostCode === "PS1").length;
                const unpaidRegistrations = registrations.filter((r) => r.statusCostCode === "PS2").length;
                const attendedRegistrations = registrations.filter((r) => r.attendanceStatus === 1).length;

                this.setState({
                    registrations,
                    filteredRegistrations: registrations,
                    eventName,
                    isLoading: false,
                    totalRegistrations: registrations.length,
                    approvedRegistrations,
                    pendingRegistrations,
                    rejectedRegistrations,
                    paidRegistrations,
                    unpaidRegistrations,
                    attendedRegistrations,
                });
            } else {
                toast.error(res.data.errMessage || "Lỗi khi tải danh sách đăng ký");
                this.setState({ isLoading: false });
            }
        } catch (e) {
            toast.error("Không thể kết nối máy chủ");
            this.setState({ isLoading: false });
        }
    };

    // Tìm kiếm và lọc
    handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        this.setState({ searchTerm }, this.filterRegistrations);
    };

    handleFilterChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value }, this.filterRegistrations);
    };

    handleSort = (field) => {
        const { sortField, sortDirection } = this.state;
        const newDirection = field === sortField && sortDirection === "asc" ? "desc" : "asc";

        this.setState(
            {
                sortField: field,
                sortDirection: newDirection,
            },
            this.filterRegistrations
        );
    };

    filterRegistrations = () => {
        const { registrations, searchTerm, statusFilter, paymentFilter, attendanceFilter, sortField, sortDirection } = this.state;

        let filtered = [...registrations];

        // Áp dụng bộ lọc tìm kiếm
        if (searchTerm) {
            filtered = filtered.filter((item) => {
                const fullName = item.name ? item.name.toLowerCase() : "";
                const email = item.email ? item.email.toLowerCase() : "";
                const phone = item.phoneNumber ? item.phoneNumber.toLowerCase() : "";
                const notes = item.notes ? item.notes.toLowerCase() : "";

                return fullName.includes(searchTerm) || email.includes(searchTerm) || phone.includes(searchTerm) || notes.includes(searchTerm);
            });
        }

        // Áp dụng bộ lọc trạng thái đăng ký
        if (statusFilter !== "all") {
            filtered = filtered.filter((item) => item.status === statusFilter);
        }

        // Áp dụng bộ lọc trạng thái thanh toán
        if (paymentFilter !== "all") {
            filtered = filtered.filter((item) => item.statusCostCode === paymentFilter);
        }

        // Áp dụng bộ lọc trạng thái điểm danh
        if (attendanceFilter !== "all") {
            const attendanceStatus = attendanceFilter === "attended" ? 1 : 0;
            filtered = filtered.filter((item) => item.attendanceStatus === attendanceStatus);
        }

        // Sắp xếp kết quả
        filtered.sort((a, b) => {
            let valueA, valueB;

            switch (sortField) {
                case "name":
                    valueA = a.name || "";
                    valueB = b.name || "";
                    break;
                case "email":
                    valueA = a.email || "";
                    valueB = b.email || "";
                    break;
                case "phoneNumber":
                    valueA = a.phoneNumber || "";
                    valueB = b.phoneNumber || "";
                    break;
                case "registeredAt":
                default:
                    valueA = a.registeredAt ? new Date(a.registeredAt) : null;
                    valueB = b.registeredAt ? new Date(b.registeredAt) : null;
                    break;
            }

            if (sortDirection === "asc") {
                if (valueA < valueB) return -1;
                if (valueA > valueB) return 1;
                return 0;
            } else {
                if (valueA > valueB) return -1;
                if (valueA < valueB) return 1;
                return 0;
            }
        });

        this.setState({ filteredRegistrations: filtered });
    };

    // Xử lý trạng thái đăng ký
    handleApprove = async (id) => {
        await this.updateStatus(id, "approved");
    };

    handleReject = async (id) => {
        await this.updateStatus(id, "rejected");
    };

    updateStatus = async (id, status) => {
        try {
            this.setState({ isLoading: true });
            const res = await updateEventRegistration(id, status);

            if (res && res.data && res.data.errCode === 0) {
                // Cập nhật trạng thái trong state
                const updatedRegistrations = this.state.registrations.map((item) => (item.id === id ? { ...item, status } : item));

                // Cập nhật thống kê
                const approvedRegistrations =
                    status === "approved" ? this.state.approvedRegistrations + 1 : status === "rejected" ? this.state.approvedRegistrations : this.state.approvedRegistrations - 1;

                const pendingRegistrations = this.state.pendingRegistrations - 1;

                const rejectedRegistrations =
                    status === "rejected" ? this.state.rejectedRegistrations + 1 : status === "approved" ? this.state.rejectedRegistrations : this.state.rejectedRegistrations - 1;

                this.setState(
                    {
                        registrations: updatedRegistrations,
                        approvedRegistrations,
                        pendingRegistrations,
                        rejectedRegistrations,
                        isLoading: false,
                    },
                    this.filterRegistrations
                );

                toast.success(`${status === "approved" ? "Duyệt" : "Từ chối"} đăng ký thành công!`);
            } else {
                toast.error(res.data.errMessage || "Lỗi khi cập nhật trạng thái");
                this.setState({ isLoading: false });
            }
        } catch (e) {
            toast.error("Không thể kết nối máy chủ");
            this.setState({ isLoading: false });
        }
    };

    // Xử lý điểm danh
    handleAttendance = (registration) => {
        this.setState({
            showAttendanceModal: true,
            selectedRegistration: registration,
            attendanceDate: registration.attendanceTime ? new Date(registration.attendanceTime) : new Date(),
            attendanceNote: registration.attendanceNote || "",
        });
    };

    closeAttendanceModal = () => {
        this.setState({
            showAttendanceModal: false,
            selectedRegistration: null,
            attendanceDate: new Date(),
            attendanceNote: "",
        });
    };

    handleAttendanceDateChange = (date) => {
        this.setState({ attendanceDate: date });
    };

    handleAttendanceNoteChange = (e) => {
        this.setState({ attendanceNote: e.target.value });
    };

    markAttendance = async () => {
        const { selectedRegistration, attendanceDate, attendanceNote } = this.state;

        try {
            this.setState({ isLoading: true });

            const attendanceData = {
                id: selectedRegistration.id,
                attendanceStatus: 1,
                attendanceTime: attendanceDate.toISOString(),
                attendanceNote: attendanceNote,
            };

            const res = await updateEventRegistration(attendanceData);

            if (res && res.data && res.data.errCode === 0) {
                // Cập nhật danh sách đăng ký
                const updatedRegistrations = this.state.registrations.map((item) =>
                    item.id === selectedRegistration.id
                        ? {
                              ...item,
                              attendanceStatus: 1,
                              attendanceTime: attendanceDate.toISOString(),
                              attendanceNote: attendanceNote,
                          }
                        : item
                );

                // Cập nhật thống kê
                const attendedRegistrations = this.state.attendedRegistrations + 1;

                this.setState(
                    {
                        registrations: updatedRegistrations,
                        attendedRegistrations,
                        isLoading: false,
                        showAttendanceModal: false,
                    },
                    this.filterRegistrations
                );

                toast.success("Điểm danh thành công!");
            } else {
                toast.error(res.data.errMessage || "Điểm danh không thành công");
                this.setState({ isLoading: false });
            }
        } catch (e) {
            toast.error("Không thể kết nối máy chủ");
            this.setState({ isLoading: false });
        }
    };

    cancelAttendance = async (id) => {
        try {
            this.setState({ isLoading: true });

            const attendanceData = {
                id: id,
                attendanceStatus: 0,
                attendanceTime: null,
                attendanceNote: "",
            };

            const res = await updateEventRegistration(attendanceData);

            if (res && res.data && res.data.errCode === 0) {
                // Cập nhật danh sách đăng ký
                const updatedRegistrations = this.state.registrations.map((item) =>
                    item.id === id
                        ? {
                              ...item,
                              attendanceStatus: 0,
                              attendanceTime: null,
                              attendanceNote: "",
                          }
                        : item
                );

                // Cập nhật thống kê
                const attendedRegistrations = this.state.attendedRegistrations - 1;

                this.setState(
                    {
                        registrations: updatedRegistrations,
                        attendedRegistrations,
                        isLoading: false,
                    },
                    this.filterRegistrations
                );

                toast.success("Hủy điểm danh thành công!");
            } else {
                toast.error(res.data.errMessage || "Hủy điểm danh không thành công");
                this.setState({ isLoading: false });
            }
        } catch (e) {
            toast.error("Không thể kết nối máy chủ");
            this.setState({ isLoading: false });
        }
    };

    // Xem chi tiết đăng ký
    handleViewDetail = (registration) => {
        this.setState({
            showDetailModal: true,
            selectedRegistration: registration,
        });
    };

    closeDetailModal = () => {
        this.setState({
            showDetailModal: false,
            selectedRegistration: null,
        });
    };

    // Quay lại trang danh sách sự kiện
    handleBackToEvents = () => {
        this.props.history.push("/system/event-display");
    };

    // Xuất dữ liệu ra file CSV
    exportToCSV = () => {
        const { filteredRegistrations } = this.state;

        if (filteredRegistrations.length === 0) {
            toast.info("Không có dữ liệu để xuất");
            return;
        }

        // Tạo dữ liệu CSV
        const headers = [
            "STT",
            "Họ tên",
            "Email",
            "Số điện thoại",
            "Ngày đăng ký",
            "Trạng thái đăng ký",
            "Trạng thái thanh toán",
            "Phương thức thanh toán",
            "Trạng thái điểm danh",
            "Thời gian điểm danh",
            "Ghi chú",
        ];

        const csvData = [
            headers.join(","),
            ...filteredRegistrations.map((item, idx) =>
                [
                    idx + 1,
                    item.name || "",
                    item.email || "",
                    item.phoneNumber || "",
                    item.registeredAt ? moment(item.registeredAt).format("DD/MM/YYYY HH:mm") : "",
                    item.status === "approved" ? "Đã duyệt" : item.status === "pending" ? "Chờ duyệt" : "Từ chối",
                    item.statusCostCode === "PS1" ? "Đã thanh toán" : "Chưa thanh toán",
                    item.payMethod?.valueVi || "",
                    item.attendanceStatus === 1 ? "Đã điểm danh" : "Chưa điểm danh",
                    item.attendanceTime ? moment(item.attendanceTime).format("DD/MM/YYYY HH:mm") : "",
                    item.notes || "",
                ].join(",")
            ),
        ].join("\n");

        // Tạo file CSV và tải xuống
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `danh-sach-dang-ky-${this.state.eventName.replace(/[^a-z0-9]/gi, "-")}-${new Date().getTime()}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Format date
    formatDate = (dateString) => {
        if (!dateString) return "-";
        return moment(dateString).format("DD/MM/YYYY HH:mm");
    };

    // Thêm hàm xử lý toggle điểm danh nhanh vào class EventRegistrationManage
    handleAttendanceToggle = async (event, item) => {
        // Ngăn hành vi mặc định để tránh bubble event
        event.stopPropagation();

        const newAttendanceStatus = item.attendanceStatus === 1 ? 0 : 1;
        const newAttendanceTime = newAttendanceStatus === 1 ? new Date().toISOString() : null;

        try {
            // Cập nhật UI trước để tăng trải nghiệm người dùng
            const updatedRegistrations = this.state.registrations.map((reg) =>
                reg.id === item.id
                    ? {
                          ...reg,
                          attendanceStatus: newAttendanceStatus,
                          attendanceTime: newAttendanceTime,
                      }
                    : reg
            );

            const attendedRegistrations = newAttendanceStatus === 1 ? this.state.attendedRegistrations + 1 : this.state.attendedRegistrations - 1;

            this.setState(
                {
                    registrations: updatedRegistrations,
                    attendedRegistrations,
                },
                this.filterRegistrations
            );

            // Gửi request API
            const attendanceData = {
                id: item.id,
                eventId: this.state.eventId,
                attendanceStatus: newAttendanceStatus,
                attendanceTime: newAttendanceTime,
            };

            const res = await updateEventRegistration(attendanceData);
            console.log("API response updateEventRegistration:", res);
            if (res && res.data && res.data.errCode === 0) {
                toast.success(newAttendanceStatus === 1 ? "Điểm danh thành công!" : "Hủy điểm danh thành công!");
                // Tạo thông báo và gửi email
                const notificationData = {
                    user_id: item.userId,
                    title: newAttendanceStatus === 1 ? `Đã điểm danh sự kiện ${this.state.eventName}` : `Hủy điểm danh sự kiện ${this.state.eventName}`,
                    message:
                        newAttendanceStatus === 1
                            ? `Bạn đã được điểm danh tham gia sự kiện "${this.state.eventName}" vào lúc ${moment(newAttendanceTime).format("DD/MM/YYYY HH:mm")}`
                            : `Điểm danh của bạn cho sự kiện "${this.state.eventName}" đã bị hủy.`,
                    type: "event_update",
                    reference_id: this.state.eventId,
                    reference_type: "EVENT_ATTENDANCE",
                    created_by: this.props.userInfo?.id || "system", // Sử dụng ID người dùng hiện tại hoặc "system" nếu không có
                    created_at: this.state.attendanceTime || new Date().toISOString(),
                    link: `/event-registration-details/${this.state.eventId}`,
                    send_to_all: false, // Chỉ gửi cho người dùng cụ thể
                };

                try {
                    const notifyRes = await createNotification(notificationData);
                    console.log("Notification created:", notifyRes);

                    if (notifyRes && notifyRes.data && notifyRes.data.errCode === 0) {
                        console.log(`Thông báo và email đã được gửi cho người dùng ${item.name}`);
                    } else {
                        console.error("Không thể tạo thông báo:", notifyRes?.data?.errMessage || "Lỗi không xác định");
                    }
                } catch (notifyError) {
                    console.error("Lỗi khi tạo thông báo:", notifyError);
                }
            } else {
                // Rollback UI nếu API thất bại
                const revertedRegistrations = this.state.registrations.map((reg) =>
                    reg.id === item.id
                        ? {
                              ...reg,
                              attendanceStatus: item.attendanceStatus,
                              attendanceTime: item.attendanceTime,
                          }
                        : reg
                );

                const revertedCount = newAttendanceStatus === 0 ? this.state.attendedRegistrations + 1 : this.state.attendedRegistrations - 1;

                this.setState(
                    {
                        registrations: revertedRegistrations,
                        attendedRegistrations: revertedCount,
                    },
                    this.filterRegistrations
                );

                toast.error(res?.data?.errMessage || "Cập nhật điểm danh không thành công");
            }
        } catch (e) {
            console.error("Lỗi khi cập nhật điểm danh:", e);
            toast.error("Không thể kết nối máy chủ");

            // Rollback UI khi có lỗi
            const revertedRegistrations = this.state.registrations.map((reg) =>
                reg.id === item.id
                    ? {
                          ...reg,
                          attendanceStatus: item.attendanceStatus,
                          attendanceTime: item.attendanceTime,
                      }
                    : reg
            );

            const revertedCount = newAttendanceStatus === 0 ? this.state.attendedRegistrations + 1 : this.state.attendedRegistrations - 1;

            this.setState(
                {
                    registrations: revertedRegistrations,
                    attendedRegistrations: revertedCount,
                },
                this.filterRegistrations
            );
        }
    };

    // Thêm phương thức xuất thống kê ra CSV
    exportStatisticsToCSV = () => {
        const { eventStats } = this.state;

        if (!eventStats) {
            toast.info("Không có dữ liệu thống kê để xuất");
            return;
        }

        const { eventInfo, registrationStats, attendanceStats, paymentStats } = eventStats;

        // Tạo dữ liệu CSV
        let csvData = [
            // Thông tin sự kiện
            ["THỐNG KÊ SỰ KIỆN"],
            ["Tên sự kiện:", eventInfo.name],
            ["Ngày diễn ra:", moment(eventInfo.date).format("DD/MM/YYYY")],
            ["Địa điểm:", eventInfo.address],
            ["Loại sự kiện:", eventInfo.type],
            ["Trạng thái:", eventInfo.status],
            [""],

            // Thống kê đăng ký
            ["THỐNG KÊ ĐĂNG KÝ"],
            ["Sức chứa:", eventInfo.capacity + " người"],
            ["Đã đăng ký:", registrationStats.total + " người"],
            ["Còn trống:", registrationStats.remainingSlots + " chỗ"],
            ["Tỷ lệ đăng ký:", registrationStats.registrationRate + "%"],
            ["Đăng ký đầu tiên:", registrationStats.timeStats.earliest ? moment(registrationStats.timeStats.earliest).format("DD/MM/YYYY HH:mm") : "-"],
            ["Đăng ký mới nhất:", registrationStats.timeStats.latest ? moment(registrationStats.timeStats.latest).format("DD/MM/YYYY HH:mm") : "-"],
            [""],

            // Thống kê tham dự
            ["THỐNG KÊ THAM DỰ"],
            ["Đã tham dự:", attendanceStats.attended + " người"],
            ["Chưa tham dự:", attendanceStats.notAttended + " người"],
            ["Tỷ lệ tham dự:", attendanceStats.attendanceRate + "%"],
            ["Điểm danh sớm nhất:", attendanceStats.earliestAttendance ? moment(attendanceStats.earliestAttendance).format("DD/MM/YYYY HH:mm") : "-"],
            ["Điểm danh muộn nhất:", attendanceStats.latestAttendance ? moment(attendanceStats.latestAttendance).format("DD/MM/YYYY HH:mm") : "-"],
            [""],

            // Thống kê thanh toán
            ["THỐNG KÊ THANH TOÁN"],
            ["Doanh thu dự kiến:", paymentStats.expectedRevenue.toLocaleString("vi-VN") + " VNĐ"],
            ["Đã thanh toán:", paymentStats.totalPaid.toLocaleString("vi-VN") + " VNĐ"],
            ["Chưa thanh toán:", paymentStats.totalUnpaid.toLocaleString("vi-VN") + " VNĐ"],
            ["Tỷ lệ thanh toán:", paymentStats.paymentRate + "%"],
            [""],

            // Thống kê theo trạng thái thanh toán
            ["THEO TRẠNG THÁI THANH TOÁN"],
            ["Trạng thái", "Số lượng", "Thành tiền (VNĐ)"],
        ];

        // Thêm dữ liệu trạng thái thanh toán
        paymentStats.byStatus.forEach((status) => {
            csvData.push([status.name, status.count, status.amount.toLocaleString("vi-VN")]);
        });

        csvData.push([""]);
        csvData.push(["THEO PHƯƠNG THỨC THANH TOÁN"]);
        csvData.push(["Phương thức", "Số lượng", "Thành tiền (VNĐ)"]);

        // Thêm dữ liệu phương thức thanh toán
        paymentStats.byMethod.forEach((method) => {
            csvData.push([method.name, method.count, method.amount.toLocaleString("vi-VN")]);
        });

        csvData.push([""]);
        csvData.push(["PHÂN BỐ ĐĂNG KÝ THEO THỜI GIAN"]);
        csvData.push(["Ngày", "Số lượng đăng ký"]);

        // Thêm dữ liệu phân bố đăng ký theo thời gian
        registrationStats.timeStats.distribution.forEach((item) => {
            csvData.push([moment(item.date).format("DD/MM/YYYY"), item.count]);
        });

        csvData.push([""]);
        csvData.push(["DANH SÁCH NGƯỜI THAM DỰ"]);
        csvData.push(["STT", "Họ tên", "Email", "Số điện thoại", "Ngày đăng ký", "Trạng thái thanh toán", "Phương thức thanh toán", "Đã tham dự", "Thời gian tham dự", "Ghi chú"]);

        // Thêm danh sách người tham dự
        eventStats.registrations.forEach((item, idx) => {
            csvData.push([
                idx + 1,
                item.name || "",
                item.email || "",
                item.phoneNumber || "",
                item.registeredAt ? moment(item.registeredAt).format("DD/MM/YYYY HH:mm") : "",
                item.paymentStatus || "",
                item.paymentMethod || "",
                item.attended ? "Đã tham dự" : "Chưa tham dự",
                item.attendanceTime ? moment(item.attendanceTime).format("DD/MM/YYYY HH:mm") : "",
                item.notes || "",
            ]);
        });

        // Chuyển đổi mảng dữ liệu thành chuỗi CSV
        const csvContent = csvData.map((row) => row.join(",")).join("\n");

        // Tạo file CSV và tải xuống
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `thong-ke-su-kien-${eventInfo.name.replace(/[^a-z0-9]/gi, "-")}-${new Date().getTime()}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Đã xuất thống kê sự kiện thành công!");
    };

    // exportAllChartsAsImages = () => {
    //     const chartIds = [
    //         { id: "registration-chart", name: "phan-bo-dang-ky" },
    //         { id: "attendance-chart", name: "ty-le-tham-du" },
    //         { id: "payment-chart", name: "thanh-toan" },
    //     ];

    //     toast.info(`Đang chuẩn bị xuất ${chartIds.length} biểu đồ...`);

    //     // Hàm xuất từng biểu đồ
    //     const exportSingleChart = (chartId, chartName) => {
    //         return new Promise((resolve, reject) => {
    //             const chartElement = document.getElementById(chartId);
    //             if (!chartElement) {
    //                 console.warn(`Không tìm thấy biểu đồ ${chartId}`);
    //                 resolve(false);
    //                 return;
    //             }

    //             html2canvas(chartElement, {
    //                 scale: 2,
    //                 useCORS: true,
    //                 backgroundColor: "#ffffff",
    //             })
    //                 .then((canvas) => {
    //                     const link = document.createElement("a");
    //                     link.download = `${chartName}-${new Date().getTime()}.png`;
    //                     link.href = canvas.toDataURL("image/png");
    //                     link.click();
    //                     resolve(true);
    //                 })
    //                 .catch((err) => {
    //                     console.error(`Lỗi khi xuất biểu đồ ${chartId}:`, err);
    //                     reject(err);
    //                 });
    //         });
    //     };

    //     // Xuất lần lượt các biểu đồ
    //     Promise.all(chartIds.map((chart) => exportSingleChart(chart.id, chart.name)))
    //         .then((results) => {
    //             const successCount = results.filter(Boolean).length;
    //             if (successCount > 0) {
    //                 toast.success(`Đã xuất ${successCount}/${chartIds.length} biểu đồ thành công!`);
    //             } else {
    //                 toast.warning("Không thể xuất biểu đồ. Vui lòng kiểm tra ID của các biểu đồ.");
    //             }
    //         })
    //         .catch(() => {
    //             toast.error("Đã xảy ra lỗi khi xuất biểu đồ.");
    //         });
    // };

    exportStatisticsToPDF = () => {
        const { eventStats } = this.state;
        if (!eventStats) {
            toast.info("Không có dữ liệu thống kê để xuất");
            return;
        }

        // Hiển thị trạng thái đang xuất
        toast.info("Đang chuẩn bị xuất PDF, vui lòng đợi...");
        this.setState({ isExporting: true });

        // Sử dụng setTimeout để đảm bảo toast hiển thị trước khi xử lý nặng
        setTimeout(() => {
            const statisticsElement = document.getElementById("statistics-container");

            if (!statisticsElement) {
                toast.error("Không thể tìm thấy nội dung thống kê để xuất");
                this.setState({ isExporting: false });
                return;
            }

            html2canvas(statisticsElement, {
                scale: 2, // Tăng độ phân giải
                useCORS: true, // Cho phép tải hình ảnh từ các domain khác
                logging: false,
                backgroundColor: "#ffffff",
            })
                .then((canvas) => {
                    const imgData = canvas.toDataURL("image/png");
                    const pdf = new jsPDF({
                        orientation: "portrait",
                        unit: "mm",
                        format: "a4",
                    });

                    // Tính toán kích thước để vừa trang A4
                    const imgWidth = 148; // Chiều rộng trang A4 (mm)
                    const pageHeight = 210; // Chiều cao trang A4 (mm)
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;

                    let heightLeft = imgHeight;
                    let position = 0;

                    // Thêm thông tin sự kiện vào đầu PDF
                    pdf.setFontSize(16);
                    const eventName = eventStats.eventInfo.name || "Sự kiện không rõ tên";
                    const eventNameNonAccent = this.removeAccents(eventName);
                    pdf.text(`Thong_ke_su_kien: ${eventNameNonAccent}`, 15, 15);
                    pdf.setFontSize(12);
                    pdf.text(`Ngay_xuat: ${moment().format("DD/MM/YYYY HH:mm")}`, 15, 25);

                    // Tăng vị trí bắt đầu của hình ảnh
                    position = 30;

                    // Thêm hình ảnh vào PDF
                    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight - position;

                    // Nếu nội dung quá dài, thêm các trang tiếp theo
                    while (heightLeft > 0) {
                        position = 0;
                        pdf.addPage();
                        pdf.addImage(imgData, "PNG", 0, position - (pageHeight - 30), imgWidth, imgHeight);
                        heightLeft -= pageHeight;
                    }

                    // Lưu file PDF
                    pdf.save(`thong-ke-su-kien-${eventStats.eventInfo.name.replace(/[^a-z0-9]/gi, "-")}-${new Date().getTime()}.pdf`);

                    // Kết thúc xuất
                    this.setState({ isExporting: false });
                    toast.success("Đã xuất thống kê sự kiện thành PDF thành công!");
                })
                .catch((error) => {
                    console.error("Lỗi khi xuất PDF:", error);
                    this.setState({ isExporting: false });
                    toast.error("Lỗi khi xuất PDF. Vui lòng thử lại.");
                });
        }, 500);
    };

    render() {
        const {
            eventName,
            filteredRegistrations,
            isLoading,
            searchTerm,
            statusFilter,
            paymentFilter,
            attendanceFilter,
            showDetailModal,
            showAttendanceModal,
            selectedRegistration,
            attendanceDate,
            attendanceNote,
            totalRegistrations,
            approvedRegistrations,
            pendingRegistrations,
            rejectedRegistrations,
            paidRegistrations,
            unpaidRegistrations,
            attendedRegistrations,
            sortField,
            sortDirection,
            activeTab,
            eventStats,
        } = this.state;

        return (
            <Container fluid className="event-registration-manage-container p-4">
                <Button variant="outline-secondary" className="mb-3" onClick={this.handleBackToEvents}>
                    <FaArrowLeft className="me-2" /> Quay lại danh sách sự kiện
                </Button>

                <h3 className="mb-3 fw-bold">Quản lý đăng ký: {eventName}</h3>

                {/* Tab Navigation */}
                <div className="event-tabs mb-4">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === "registrations" ? "active" : ""}`} onClick={() => this.handleTabChange("registrations")}>
                                <i className="fas fa-clipboard-list me-2"></i>
                                Danh sách đăng ký
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === "statistics" ? "active" : ""}`} onClick={() => this.handleTabChange("statistics")}>
                                <i className="fas fa-chart-bar me-2"></i>
                                Thống kê sự kiện
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Dashboard Cards - hiển thị ở cả 2 tab */}
                <Row className="mb-4">
                    <Col md={3} sm={6} className="mb-3 mb-sm-0">
                        <Card className="text-center h-100 shadow-sm">
                            <Card.Body>
                                <h1 className="mb-0">{totalRegistrations}</h1>
                                <Card.Text>Tổng số đăng ký</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={3} sm={6}>
                        <Card className="text-center h-100 shadow-sm">
                            <Card.Body>
                                <h1 className="mb-0 text-info">{attendedRegistrations}</h1>
                                <Card.Text>Đã điểm danh</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* đã thanh toán */}
                    <Col md={3} sm={6} className="mb-3 mb-sm-0">
                        <Card className="text-center h-100 shadow-sm">
                            <Card.Body>
                                <h1 className="mb-0 text-success">{paidRegistrations}</h1>
                                <Card.Text>Đã thanh toán</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Tab Content */}
                {activeTab === "registrations" ? (
                    // Nội dung tab đăng ký (phần hiện tại của bạn)
                    <>
                        <Table className="shadow-sm mb-4">
                            <Card.Header className="bg-white">
                                <h5 className="mb-0 fw-bold">Bộ lọc & Tìm kiếm</h5>
                            </Card.Header>
                            <Card.Body>
                                <Row className="mb-3">
                                    <Col lg={3} md={6} className="mb-3 mb-md-0">
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <FaSearch />
                                            </InputGroup.Text>
                                            <Form.Control placeholder="Tìm kiếm theo tên, email, SĐT, ghi chú..." value={searchTerm} onChange={this.handleSearch} />
                                        </InputGroup>
                                    </Col>

                                    <Col lg={8} md={6}>
                                        <Row>
                                            <Col md={3} className="mb-3 mb-md-0">
                                                <InputGroup>
                                                    <InputGroup.Text>
                                                        <FaMoneyBillWave />
                                                    </InputGroup.Text>
                                                    <Form.Select name="paymentFilter" value={paymentFilter} onChange={this.handleFilterChange}>
                                                        <option value="all">Tất cả thanh toán</option>
                                                        <option value="PS1">Đã thanh toán</option>
                                                        <option value="PS2">Chưa thanh toán</option>
                                                    </Form.Select>
                                                </InputGroup>
                                            </Col>

                                            <Col md={3}>
                                                <InputGroup>
                                                    <InputGroup.Text>
                                                        <FaUserCheck />
                                                    </InputGroup.Text>
                                                    <Form.Select name="attendanceFilter" value={attendanceFilter} onChange={this.handleFilterChange}>
                                                        <option value="all">Tất cả điểm danh</option>
                                                        <option value="attended">Đã điểm danh</option>
                                                        <option value="not-attended">Chưa điểm danh</option>
                                                    </Form.Select>
                                                </InputGroup>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col className="d-flex justify-content-end">
                                        <Button variant="success" onClick={this.exportToCSV}>
                                            <FaFileExport className="me-2" /> Xuất file CSV
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Table>

                        <Table className="shadow-sm">
                            <Card.Body>
                                {isLoading ? (
                                    <div className="text-center my-5">
                                        <Spinner animation="border" variant="primary" />
                                        <div className="mt-2">Đang tải dữ liệu...</div>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <Table hover className="align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>#</th>
                                                    <th className="sortable" onClick={() => this.handleSort("name")}>
                                                        Họ tên
                                                        {sortField === "name" && <FaSort className="ms-1" />}
                                                    </th>
                                                    <th className="sortable" onClick={() => this.handleSort("email")}>
                                                        Email
                                                        {sortField === "email" && <FaSort className="ms-1" />}
                                                    </th>
                                                    <th>Số điện thoại</th>
                                                    <th className="sortable" onClick={() => this.handleSort("registeredAt")}>
                                                        Ngày đăng ký
                                                        {sortField === "registeredAt" && <FaSort className="ms-1" />}
                                                    </th>
                                                    {/* <th>Trạng thái</th> */}
                                                    <th>Thanh toán</th>
                                                    <th>Điểm danh</th>
                                                    <th>Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredRegistrations && filteredRegistrations.length > 0 ? (
                                                    filteredRegistrations.map((item, idx) => (
                                                        <tr key={item.id}>
                                                            <td>{idx + 1}</td>
                                                            <td>{item.name}</td>
                                                            <td>{item.email}</td>
                                                            <td>{item.phoneNumber || "-"}</td>
                                                            <td>{this.formatDate(item.registeredAt)}</td>

                                                            <td>
                                                                {item.statusCostCode === "PS1" ? (
                                                                    <Badge bg="success">{item.payMethod?.valueVi || "Đã thanh toán"}</Badge>
                                                                ) : (
                                                                    <Badge bg="secondary">Chưa thanh toán</Badge>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <div className="form-check form-switch">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id={`attendance-${item.id}`}
                                                                        checked={item.attendanceStatus === 1}
                                                                        onChange={(e) => this.handleAttendanceToggle(e, item)}
                                                                    />
                                                                    {item.attendanceStatus === 1 && (
                                                                        <small className="d-block text-muted mt-1">{moment(item.attendanceTime).format("DD/MM/YYYY HH:mm")}</small>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex">
                                                                    <Button
                                                                        variant="outline-info"
                                                                        size="sm"
                                                                        className="me-1"
                                                                        onClick={() => this.handleViewDetail(item)}
                                                                        title="Xem chi tiết"
                                                                    >
                                                                        <FaEye />
                                                                    </Button>

                                                                    {item.status === "pending" && (
                                                                        <>
                                                                            <Button
                                                                                variant="outline-success"
                                                                                size="sm"
                                                                                className="me-1"
                                                                                onClick={() => this.handleApprove(item.id)}
                                                                                title="Duyệt đăng ký"
                                                                            >
                                                                                <FaCheck />
                                                                            </Button>
                                                                            <Button
                                                                                variant="outline-danger"
                                                                                size="sm"
                                                                                onClick={() => this.handleReject(item.id)}
                                                                                title="Từ chối đăng ký"
                                                                            >
                                                                                <FaTimes />
                                                                            </Button>
                                                                        </>
                                                                    )}

                                                                    {item.status === "approved" && (
                                                                        <>
                                                                            {item.attendanceStatus === 0 ? (
                                                                                <Button
                                                                                    variant="outline-primary"
                                                                                    size="sm"
                                                                                    className="me-1"
                                                                                    onClick={() => this.handleAttendance(item)}
                                                                                    title="Điểm danh"
                                                                                >
                                                                                    <FaCalendarCheck />
                                                                                </Button>
                                                                            ) : (
                                                                                <Button
                                                                                    variant="outline-secondary"
                                                                                    size="sm"
                                                                                    className="me-1"
                                                                                    onClick={() => this.cancelAttendance(item.id)}
                                                                                    title="Hủy điểm danh"
                                                                                >
                                                                                    <FaTimes />
                                                                                </Button>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="9" className="text-center py-3">
                                                            {searchTerm || statusFilter !== "all" || paymentFilter !== "all" || attendanceFilter !== "all"
                                                                ? "Không tìm thấy đăng ký nào phù hợp với bộ lọc"
                                                                : "Chưa có ai đăng ký sự kiện này"}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                )}
                            </Card.Body>
                        </Table>

                        {/* Modal xem chi tiết đăng ký */}
                        <Modal show={showDetailModal} onHide={this.closeDetailModal} centered size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title>Chi tiết đăng ký</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedRegistration &&
                                    // kiểm tra thông tin toàn bộ sự kiện
                                    (console.log(selectedRegistration),
                                    (
                                        <div>
                                            <Tabs defaultActiveKey="user-info" className="mb-4">
                                                <Tab eventKey="user-info" title="Thông tin người đăng ký">
                                                    <Row className="mb-3">
                                                        <Col md={4} className="fw-bold">
                                                            Họ và tên:
                                                        </Col>
                                                        <Col md={8}>{selectedRegistration.name}</Col>
                                                    </Row>
                                                    <Row className="mb-3">
                                                        <Col md={4} className="fw-bold">
                                                            Email:
                                                        </Col>
                                                        <Col md={8}>{selectedRegistration.email}</Col>
                                                    </Row>
                                                    <Row className="mb-3">
                                                        <Col md={4} className="fw-bold">
                                                            Số điện thoại:
                                                        </Col>
                                                        <Col md={8}>{selectedRegistration.phoneNumber || "Không có"}</Col>
                                                    </Row>
                                                    {selectedRegistration.User?.address && (
                                                        <Row className="mb-3">
                                                            <Col md={4} className="fw-bold">
                                                                Địa chỉ:
                                                            </Col>
                                                            <Col md={8}>{selectedRegistration.User.address}</Col>
                                                        </Row>
                                                    )}
                                                    {selectedRegistration.User?.gender && (
                                                        <Row className="mb-3">
                                                            <Col md={4} className="fw-bold">
                                                                Giới tính:
                                                            </Col>
                                                            <Col md={8}>
                                                                {selectedRegistration.User.gender === "M" ? "Nam" : selectedRegistration.User.gender === "F" ? "Nữ" : "Khác"}
                                                            </Col>
                                                        </Row>
                                                    )}
                                                </Tab>
                                                <Tab eventKey="registration-info" title="Thông tin đăng ký">
                                                    <Row className="mb-3">
                                                        <Col md={4} className="fw-bold">
                                                            Thời gian đăng ký:
                                                        </Col>
                                                        <Col md={8}>{this.formatDate(selectedRegistration.registeredAt)}</Col>
                                                    </Row>
                                                    <Row className="mb-3">
                                                        <Col md={4} className="fw-bold">
                                                            Trạng thái thanh toán:
                                                        </Col>
                                                        <Col md={8}>
                                                            {selectedRegistration.statusCostCode === "PS1" ? (
                                                                <Badge bg="success">Đã thanh toán</Badge>
                                                            ) : (
                                                                <Badge bg="secondary">Chưa thanh toán</Badge>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-3">
                                                        <Col md={4} className="fw-bold">
                                                            Phương thức thanh toán:
                                                        </Col>
                                                        <Col md={8}>{selectedRegistration.payMethod?.valueVi || "-"}</Col>
                                                    </Row>
                                                    <Row className="mb-3">
                                                        <Col md={4} className="fw-bold">
                                                            Trạng thái điểm danh:
                                                        </Col>
                                                        <Col md={8}>
                                                            {selectedRegistration.attendanceStatus === 1 ? (
                                                                <Badge bg="success">Đã điểm danh</Badge>
                                                            ) : (
                                                                <Badge bg="secondary">Chưa điểm danh</Badge>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                    {selectedRegistration.attendanceStatus === 1 && (
                                                        <Row className="mb-3">
                                                            <Col md={4} className="fw-bold">
                                                                Thời gian điểm danh:
                                                            </Col>
                                                            <Col md={8}>{this.formatDate(selectedRegistration.attendanceTime)}</Col>
                                                        </Row>
                                                    )}
                                                    {selectedRegistration.notes && (
                                                        <Row className="mb-3">
                                                            <Col md={4} className="fw-bold">
                                                                Ghi chú:
                                                            </Col>
                                                            <Col md={8}>{selectedRegistration.notes}</Col>
                                                        </Row>
                                                    )}
                                                </Tab>
                                            </Tabs>

                                            <div className="d-flex justify-content-between mt-4">
                                                {selectedRegistration.status === "pending" && (
                                                    <div className="d-flex gap-2">
                                                        <Button
                                                            variant="success"
                                                            onClick={() => {
                                                                this.handleApprove(selectedRegistration.id);
                                                                this.closeDetailModal();
                                                            }}
                                                        >
                                                            <FaCheck className="me-2" /> Duyệt đăng ký
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            onClick={() => {
                                                                this.handleReject(selectedRegistration.id);
                                                                this.closeDetailModal();
                                                            }}
                                                        >
                                                            <FaTimes className="me-2" /> Từ chối đăng ký
                                                        </Button>
                                                    </div>
                                                )}

                                                {selectedRegistration.status === "approved" && selectedRegistration.attendanceStatus === 0 && (
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => {
                                                            this.closeDetailModal();
                                                            this.handleAttendance(selectedRegistration);
                                                        }}
                                                    >
                                                        <FaCalendarCheck className="me-2" /> Điểm danh
                                                    </Button>
                                                )}

                                                <Button variant="secondary" onClick={this.closeDetailModal}>
                                                    Đóng
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                            </Modal.Body>
                        </Modal>
                    </>
                ) : (
                    // Nội dung tab thống kê (phần mới)
                    this.renderStatisticsTab()
                )}

                {/* Các modal hiện tại */}
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        userInforr: state.user.userInforr, // Lấy thông tin người dùng từ Redux store
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EventRegistrationManage));
