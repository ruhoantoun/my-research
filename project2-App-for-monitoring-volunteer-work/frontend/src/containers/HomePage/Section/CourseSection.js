import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../../../components/SectionTitle'

import SingleCourse from '../../../components/Course/SingleCourse';
import { getUsersByPosition } from '../../../services/userServices';


class CourseSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            managers: [],
            loading: true,
            error: null
        };
    }

    // Lifecycle method để fetch dữ liệu khi component mount
    componentDidMount() {
        this.fetchManagers();
    }

    // Hàm fetch dữ liệu từ API
    fetchManagers = async () => {
        try {
            // Mã vị trí cho Ban Quản Lý - thay đổi theo cấu trúc dữ liệu của bạn
            const positionCode = 'P1'; 
            
            // Gọi API thông qua service
            const response = await getUsersByPosition(positionCode);
            
            if (response && response.data && response.data.errCode === 0) {
                this.setState({ 
                    managers: response.data.data || [],
                    loading: false
                });
            } else {
                this.setState({ 
                    error: response.data.errMessage || 'Đã xảy ra lỗi khi tải dữ liệu',
                    loading: false 
                });
            }
        } catch (error) {
            console.error('Error fetching managers:', error);
            this.setState({ 
                error: 'Không thể kết nối đến server',
                loading: false 
            });
        }
    };

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

    renderError = () => {
        const { error } = this.state;
        
        return (
            <div className="alert alert-danger" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error || 'Đã xảy ra lỗi khi tải dữ liệu'}
            </div>
        );
    };

    renderManagers = () => {
        const { managers } = this.state;
        
        if (managers.length === 0) {
            return (
                <div className="col-12 text-center py-4">
                    <p>Chưa có thông tin thành viên Ban Quản Lý</p>
                </div>
            );
        }

        return managers.slice(0, 3).map((manager) => (
            <div 
                key={manager.id} 
                className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 wow animate__fadeInUp" 
                data-wow-duration="0.3s"
            >
                <SingleCourse
                    personID={manager.id}
                    avatar={manager.image}
                    firstName={manager.firstName}
                    lastName={manager.lastName}
                    role={manager.positionData?.valueVi || manager.roleData?.valueVi || 'Thành viên'}
                    description={manager.userMarkdown?.description || 'Chưa có thông tin mô tả'}
                    contactInfo={{
                        email: manager.email,
                        phone: manager.phoneNumber
                    }}
                />
            </div>
        ));
    };

    render() {
        const { loading, error, managers } = this.state;

        return (
            <div className="popular__course__area pt---100 pb---100">
                <div className="container">
                    <SectionTitle Title="Ban Quản Lý K16 - CTES" />
                    
                    <div className="row">
                        {loading ? this.renderLoading() : error ? this.renderError() : this.renderManagers()}
                    </div>
                    
                    {!loading && !error && managers.length > 2 && (
                        <div className="text-center mt-4">
                            <Link to="/user-profile/manage-list" className="view-courses">
                                Xem tất cả thành viên <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default CourseSection;