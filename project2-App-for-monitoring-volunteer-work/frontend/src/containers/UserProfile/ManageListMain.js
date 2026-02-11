import React, { Component } from "react";
import { Link } from "react-router-dom";
import SingleCourse from "../../components/Course/SingleCourse";
import {getUsersByRole } from "../../services/userServices";
import { toast } from "react-toastify";
import "./ManageListMain.scss";

class ManageListMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            managers: [], // Dữ liệu gốc từ API
            filteredManagers: [], // Dữ liệu sau khi lọc
            loading: true,
            error: null,
            searchTerm: "", // Từ khóa tìm kiếm
            filters: {
                // Các bộ lọc
                position: "ALL",
                gender: "ALL",
            },
            sortBy: "default", // Sắp xếp
            currentPage: 1, // Phân trang
            itemsPerPage: 9, // Số item mỗi trang
            selectedRole: "R1", // Role mặc định (Admin)
        };
    }

    // Lifecycle method để fetch dữ liệu khi component mount
    componentDidMount() {
        this.fetchUsersByRole();
    }

    /**
     * Lấy danh sách người dùng theo role từ API
     */
    fetchUsersByRole = async () => {
        try {
            const roleCode = "R1";
            // Gọi API để lấy người dùng theo role
            const response = await getUsersByRole(roleCode);
            console.log("Fetch users by role:", response);

            if (response && response.data && response.data.errCode === 0) {
                const users = response.data.data || [];
                this.setState({
                    managers: users,
                    filteredManagers: users,
                    loading: false,
                    currentPage: 1, // Reset về trang 1 khi thay đổi dữ liệu
                });
            } else {
                this.setState({
                    error: response.data?.errMessage || "Đã xảy ra lỗi khi tải dữ liệu",
                    loading: false,
                });
                toast.error(`Không thể tải danh sách người dùng có vai trò ${roleCode}`);
            }
        } catch (error) {
            console.error("Error fetching users by role:", error);
            this.setState({
                error: "Không thể kết nối đến server",
                loading: false,
            });
            toast.error("Lỗi kết nối đến server");
        }
    };

    /**
     * Áp dụng tất cả bộ lọc cho dữ liệu
     * Sử dụng dữ liệu gốc từ managers, sau đó lọc và lưu vào filteredManagers
     */
    applyFilters = () => {
        const { managers, searchTerm, filters, sortBy } = this.state;

        // Bắt đầu với tất cả người dùng từ dữ liệu gốc
        let filteredUsers = [...managers];

        // 1. Áp dụng lọc theo vị trí (position)
        if (filters.position !== "ALL") {
            filteredUsers = filteredUsers.filter((user) => user.positionCode === filters.position);
        }

        // 2. Áp dụng lọc theo giới tính (gender)
        if (filters.gender !== "ALL") {
            filteredUsers = filteredUsers.filter((user) => user.genderCode === filters.gender);
        }

        // 3. Áp dụng tìm kiếm theo từ khóa (searchTerm)
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            filteredUsers = filteredUsers.filter(
                (user) =>
                    (user.firstName && user.firstName.toLowerCase().includes(searchLower)) ||
                    (user.lastName && user.lastName.toLowerCase().includes(searchLower)) ||
                    (user.email && user.email.toLowerCase().includes(searchLower)) ||
                    (user.phoneNumber && user.phoneNumber.includes(searchTerm))
            );
        }

        // 4. Áp dụng sắp xếp (sortBy)
        switch (sortBy) {
            case "name-asc": // Sắp xếp theo tên từ A-Z
                filteredUsers.sort((a, b) => {
                    const nameA = `${a.firstName || ""} ${a.lastName || ""}`.trim().toLowerCase();
                    const nameB = `${b.firstName || ""} ${b.lastName || ""}`.trim().toLowerCase();
                    return nameA.localeCompare(nameB);
                });
                break;
            case "name-desc": // Sắp xếp theo tên từ Z-A
                filteredUsers.sort((a, b) => {
                    const nameA = `${a.firstName || ""} ${a.lastName || ""}`.trim().toLowerCase();
                    const nameB = `${b.firstName || ""} ${b.lastName || ""}`.trim().toLowerCase();
                    return nameB.localeCompare(nameA);
                });
                break;
            case "date-asc": // Sắp xếp theo ngày tạo tăng dần
                filteredUsers.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case "date-desc": // Sắp xếp theo ngày tạo giảm dần
                filteredUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            default:
                // Mặc định không sắp xếp, giữ nguyên thứ tự
                break;
        }

        // 5. Xử lý logic phân trang khi số lượng kết quả thay đổi
        this.setState((prevState) => {
            const totalPagesAfterFilter = Math.ceil(filteredUsers.length / prevState.itemsPerPage);

            // Nếu trang hiện tại lớn hơn tổng số trang sau khi lọc, reset về trang 1
            const newCurrentPage = prevState.currentPage > totalPagesAfterFilter && totalPagesAfterFilter > 0 ? 1 : prevState.currentPage;

            // Cập nhật dữ liệu đã lọc và trang hiện tại
            return {
                filteredManagers: filteredUsers,
                currentPage: newCurrentPage,
            };
        });
    };

    /**
     * Xử lý thay đổi trong ô tìm kiếm
     */
    handleSearchChange = (e) => {
        this.setState({ searchTerm: e.target.value }, this.applyFilters);
    };

    /**
     * Xử lý thay đổi từ các dropdown bộ lọc
     * @param {object} e - Sự kiện change từ select
     */
    handleFilterChange = (e) => {
        const { name, value } = e.target;

        this.setState(
            (prevState) => ({
                filters: {
                    ...prevState.filters,
                    [name]: value,
                },
                currentPage: 1, // Reset về trang 1 khi thay đổi bộ lọc
            }),
            this.applyFilters
        );
    };

    /**
     * Xử lý thay đổi vai trò (Role)
     * @param {object} e - Sự kiện change từ select
     */


    /**
     * Xử lý thay đổi cách sắp xếp
     * @param {object} e - Sự kiện change từ select
     */
    handleSortChange = (e) => {
        this.setState({ sortBy: e.target.value }, this.applyFilters);
    };

    /**
     * Chuyển đến trang được chỉ định
     * @param {number} page - Số trang cần chuyển đến
     */
    handlePageChange = (page) => {
        this.setState({ currentPage: page });
    };

    /**
     * Hiển thị trạng thái đang tải
     */
    renderLoading = () => {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
                <p className="mt-2">Đang tải dữ liệu...</p>
            </div>
        );
    };

    /**
     * Hiển thị thông báo lỗi
     */
    renderError = () => {
        const { error } = this.state;

        return (
            <div className="alert alert-danger" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error || "Đã xảy ra lỗi khi tải dữ liệu"}
            </div>
        );
    };

    /**
     * Hiển thị danh sách người dùng với phân trang
     */
    renderManagers = () => {
        const { filteredManagers, currentPage, itemsPerPage } = this.state;

        // Kiểm tra nếu không có kết quả nào sau khi lọc
        if (filteredManagers.length === 0) {
            return (
                <div className="col-12 text-center py-4">
                    <p>Không tìm thấy thành viên phù hợp với tiêu chí tìm kiếm</p>
                </div>
            );
        }

        // Tính toán phân trang
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = filteredManagers.slice(indexOfFirstItem, indexOfLastItem);

        // Hiển thị các người dùng trong trang hiện tại
        return currentItems.map((manager) => (
            <div key={manager.id} className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 wow animate__fadeInUp" data-wow-duration="0.3s" style={{ marginBottom: "30px" }}>
                <SingleCourse
                    personID={manager.id}
                    avatar={manager.image || manager.userMarkdown?.image}
                    firstName={manager.firstName}
                    lastName={manager.lastName}
                    role={manager.positionData?.valueVi || manager.roleData?.valueVi || "Thành viên"}
                    description={manager.userMarkdown?.description || "Chưa có thông tin mô tả"}
                    contactInfo={{
                        email: manager.email,
                        phone: manager.phoneNumber,
                    }}
                />
            </div>
        ));
    };

    /**
     * Hiển thị điều khiển phân trang
     */
    renderPagination = () => {
        const { filteredManagers, currentPage, itemsPerPage } = this.state;
        const totalPages = Math.ceil(filteredManagers.length / itemsPerPage);

        // Nếu chỉ có 1 trang hoặc không có dữ liệu, không hiển thị phân trang
        if (totalPages <= 1) return null;

        // Tạo mảng các số trang để hiển thị
        const pageNumbers = [];

        // Giới hạn số trang hiển thị để tránh quá nhiều nút
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = startPage + maxPagesToShow - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <ul className="back-pagination pt---20">
                {/* Nút quay lại trang trước */}
                {currentPage > 1 && (
                    <li>
                        <Link
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                this.handlePageChange(currentPage - 1);
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-arrow-left"
                            >
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                        </Link>
                    </li>
                )}

                {/* Các nút số trang */}
                {pageNumbers.map((number) => (
                    <li key={number} className={currentPage === number ? "active" : ""}>
                        <Link
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                this.handlePageChange(number);
                            }}
                        >
                            {number}
                        </Link>
                    </li>
                ))}

                {/* Nút đến trang tiếp theo */}
                {currentPage < totalPages && (
                    <li className="back-next">
                        <Link
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                this.handlePageChange(currentPage + 1);
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-arrow-right"
                            >
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </Link>
                    </li>
                )}
            </ul>
        );
    };

    render() {
        const { loading, error, filteredManagers, searchTerm, filters, sortBy } = this.state;

        return (
            <div className="react-course-filter back__course__page_grid pb---40 pt---110">
                <div className="container pb---70">
                    {/* Tìm kiếm */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="search-container">
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="fas fa-search"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                                        value={searchTerm}
                                        onChange={this.handleSearchChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Bộ lọc */}
                    <div className="row align-items-center back-vertical-middle shorting__course mb-50">
                        <div className="col-md-2">
                            <div className="all__icons">
                                <div className="list__icons">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-sliders"
                                    >
                                        <line x1="4" y1="21" x2="4" y2="14"></line>
                                        <line x1="4" y1="10" x2="4" y2="3"></line>
                                        <line x1="12" y1="21" x2="12" y2="12"></line>
                                        <line x1="12" y1="8" x2="12" y2="3"></line>
                                        <line x1="20" y1="21" x2="20" y2="16"></line>
                                        <line x1="20" y1="12" x2="20" y2="3"></line>
                                        <line x1="1" y1="14" x2="7" y2="14"></line>
                                        <line x1="9" y1="8" x2="15" y2="8"></line>
                                        <line x1="17" y1="16" x2="23" y2="16"></line>
                                    </svg>
                                </div>
                                <div className="result-count">Bộ lọc</div>
                            </div>
                        </div>
                        <div className="col-md-10 text-right">
                            <select className="from-control position" name="position" value={filters.position} onChange={this.handleFilterChange}>
                                <option value="ALL">Tất cả vị trí</option>
                                <option value="P1">Đội trưởng</option>
                                <option value="P2">Ban Quản Lý</option>
                            </select>
                            <select className="from-control gender" name="gender" value={filters.gender} onChange={this.handleFilterChange}>
                                <option value="ALL">Tất cả giới tính</option>
                                <option value="M">Nam</option>
                                <option value="F">Nữ</option>
                                <option value="O">Khác</option>
                            </select>
                        </div>
                    </div>

                    {/* Kết quả và sắp xếp */}
                    <div className="row align-items-center back-vertical-middle shorting__course2 mb-50">
                        <div className="col-md-6">
                            <div className="all__icons">
                                <div className="result-count">Tìm thấy {filteredManagers.length} thành viên</div>
                            </div>
                        </div>
                        <div className="col-md-6 text-right">
                            <select className="from-control" value={sortBy} onChange={this.handleSortChange}>
                                <option value="default">Sắp xếp theo: Mặc định</option>
                                <option value="name-asc">Tên A-Z</option>
                                <option value="name-desc">Tên Z-A</option>
                                <option value="date-desc">Mới nhất</option>
                                <option value="date-asc">Cũ nhất</option>
                            </select>
                        </div>
                    </div>

                    {/* Hiển thị danh sách */}
                    <div className="row">{loading ? this.renderLoading() : error ? this.renderError() : this.renderManagers()}</div>

                    {/* Phân trang */}
                    {!loading && !error && this.renderPagination()}
                </div>
            </div>
        );
    }
}

export default ManageListMain;
