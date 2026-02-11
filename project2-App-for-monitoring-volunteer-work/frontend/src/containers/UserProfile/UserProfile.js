import React, { Component } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Breadcrumb from "../../components/Breadcrumb";
import UserProfileMain from "./UserProfileMain";
import ScrollToTop from "../../components/ScrollTop";
import { getUserById } from "../../services/userServices";
import { toast } from "react-toastify";
import Logo from "../../assets/images/logos/logo2.png";

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: null,
            userId: null,
            loading: true,
            error: null,
        };
    }

    componentDidMount() {
        // Lấy userId từ URL params
        const { match } = this.props;
        console.log("Match object:", match);

        if (match && match.params && match.params.id) {
            const userId = match.params.id;
            console.log("User ID from params:", userId);

            // Lưu userId vào state và sau đó gọi fetchUserData
            this.setState({ userId }, () => {
                this.fetchUserData();
            });
        } else {
            console.error("Không tìm thấy ID trong URL params");
            this.setState({
                error: "ID người dùng không hợp lệ",
                loading: false,
            });
        }
    }

    // Lấy thông tin user từ API
    fetchUserData = async () => {
        try {
            const { userId } = this.state;
            console.log("Fetching data for user ID:", userId);

            if (!userId) {
                this.setState({
                    error: "ID người dùng không hợp lệ",
                    loading: false,
                });
                return;
            }

            // Gọi API lấy thông tin user
            const response = await getUserById(userId);
            console.log("API response:", response);

            if (response && response.data && response.data.errCode === 0) {
                this.setState({
                    userInfo: response.data.data,
                    loading: false,
                });
            } else {
                this.setState({
                    error: "Không thể tải thông tin người dùng",
                    loading: false,
                });
                toast.error("Không tìm thấy thông tin người dùng");
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            this.setState({
                error: "Lỗi kết nối đến server",
                loading: false,
            });
            toast.error("Có lỗi xảy ra khi tải thông tin");
        }
    };

    render() {
        const { userInfo, loading, error } = this.state;

        return (
            <div className="courses-grid-page">
                <Header parentMenu="user-profile" 
                headerNormalLogo={Logo} 
                headerStickyLogo={Logo} 
                />

                <div className="react-wrapper">
                    <div className="react-wrapper-inner">
                        <Breadcrumb pageTitle="Thành Viên" pageTitle1="Chi tiết thành viên" linkPageTitle="/user-profile"/>

                        {/* Truyền dữ liệu xuống UserProfileMain */}
                        <UserProfileMain userInfo={userInfo} loading={loading} error={error} />

                        <ScrollToTop />
                    </div>
                </div>

                <Footer />
            </div>
        );
    }
}

export default UserProfile;
