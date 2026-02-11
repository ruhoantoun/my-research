import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';
import ManageListMain from './ManageListMain'
import ScrollToTop from '../../components/ScrollTop';

import Logo from '../../assets/images/logos/logo2.png';

const Course = () => {
    return (
        <div class="courses-grid-page">
            <Header
                parentMenu='course'
                headerNormalLogo={Logo}
                headerStickyLogo={Logo}
            />

            <div class="react-wrapper">
                <div class="react-wrapper-inner">
                    <Breadcrumb
                        pageTitle1="Thành Viên"
                        pageTitle2="Ban Quản Lý"
                        linkPageTitle1="/user-profile"
                        linkPageTitle2="/user-profile/manage-list"
                    />

                    <ManageListMain />

                    {/* scrolltop-start */}
                    <ScrollToTop />
                    {/* scrolltop-end */}
                </div>
            </div>

            <Footer />

        </div>
    );
}


export default Course;

