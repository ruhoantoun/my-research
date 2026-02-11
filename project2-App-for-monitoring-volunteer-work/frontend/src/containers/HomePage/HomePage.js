import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "./HomeHeader";
import Speciality from "./Section/Speciality";
import Medical from "./Section/Medical";
import FeaturedDoctors from "./Section/FeaturedDoctors";
import Manual from "./Section/Manual";
import Header from "../../components/Header";
import HomeSlider from "./Section/SliderSection";
import Event from "./Section/EventSection";
import Campus from "./Section/CampusSection";
import Course from "./Section/CourseSection";
import Footer from "../../components/Footer/FooterTwo";
import Blogs from "./Section/BlogSection";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../../assets/scss/main.scss";
class HomePage extends Component {
    render() {
        return (
            <div>
                <Header parentMenu="home" topbarEnable="enable" />
                <HomeSlider />
                <Event />
                <Campus />
                <Course/>
                {/* <Blogs /> */}
                <Footer />

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
