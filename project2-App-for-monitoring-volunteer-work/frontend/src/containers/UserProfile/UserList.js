import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Breadcrumb from "../../components/Breadcrumb";
import UserListMain from "./UserListMain";
import ScrollToTop from "../../components/ScrollTop";

import Logo from "../../assets/images/logos/logo2.png";

const Course = () => {
    return (
        <div class="courses-grid-page">
            <Header parentMenu="page" headerNormalLogo={Logo} headerStickyLogo={Logo} />

            <div class="react-wrapper">
                <div class="react-wrapper-inner">
                    <Breadcrumb pageTitle="Thành Viên"/>

                    <UserListMain />

                    {/* scrolltop-start */}
                    <ScrollToTop />
                    {/* scrolltop-end */}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Course;
