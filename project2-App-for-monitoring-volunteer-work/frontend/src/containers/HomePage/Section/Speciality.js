import React, { Component } from "react";
import { connect } from "react-redux";
import "./Speciality.scss";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import specialityImg from '../../../assets/specialityImg/1.jpg';

class Speciality extends Component {
    render() {
        let settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 2,
            nextArrow: <div className="slick-next"></div>,
            prevArrow: <div className="slick-prev"></div>,
        };

        return (
            <React.Fragment>
                <div className="section-speciality">
                    <div className="speciality-content">
                        <div className="speciality-title text-center mb-3">
                                Chuyên Khoa
                        </div>
                        <Slider {...settings}>
                                <div className="speciality-item">
                                    <img
                                        className="speciality-img"
                                        src={specialityImg}
                                        alt="speciality"
                                    />
                                    <span className="speciality-title">
                                        Xương khớp
                                    </span>
                                </div>
                                <div className="speciality-item">
                                    <img
                                        className="speciality-img"
                                        src={specialityImg}
                                        alt="speciality"
                                    />
                                    <span className="speciality-title">
                                        Xương khớp
                                    </span>
                                </div>
                                <div className="speciality-item">
                                    <img
                                        className="speciality-img"
                                        src={specialityImg}
                                        alt="speciality"
                                    />
                                    <span className="speciality-title">
                                        Xương khớp
                                    </span>
                                </div>
                                <div className="speciality-item">
                                    <img
                                        className="speciality-img"
                                        src={specialityImg}
                                        alt="speciality"
                                    />
                                    <span className="speciality-title">
                                        Xương khớp
                                    </span>
                                </div>
                                <div className="speciality-item">
                                    <img
                                        className="speciality-img"
                                        src={specialityImg}
                                        alt="speciality"
                                    />
                                    <span className="speciality-title">
                                        Xương khớp
                                    </span>
                                </div>
                                <div className="speciality-item">
                                    <img
                                        className="speciality-img"
                                        src={specialityImg}
                                        alt="speciality"
                                    />
                                    <span className="speciality-title">
                                        Xương khớp
                                    </span>
                                </div>
                        </Slider>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Speciality);
