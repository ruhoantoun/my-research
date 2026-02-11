import React, { Component } from "react";
import { connect } from "react-redux";
import "./Medical.scss";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import medicalImg from "../../../assets/medical/1.jpg";
class Medical extends Component {
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
                <div className="section-medical">
                    <div className="medical-content">
                        <div className="medical-header">
                            <div className="medical-title mb-3 ml-1">
                                Chuyên Khoa
                            </div>
                            <button type="button" class="btn btn-outline-primary">Tìm kiếm</button>
                        </div>

                        <Slider {...settings}>
                            <div className="medical-item">
                                <img
                                    className="medical-img"
                                    src={medicalImg}
                                    alt="medical"
                                />
                                <span className="medical-title">
                                    Bệnh viện Bạch Mai
                                </span>
                            </div>
                            <div className="medical-item">
                                <img
                                    className="medical-img"
                                    src={medicalImg}
                                    alt="medical"
                                />
                                <span className="medical-title">
                                    Bệnh viện Bạch Mai
                                </span>
                            </div>
                            <div className="medical-item">
                                <img
                                    className="medical-img"
                                    src={medicalImg}
                                    alt="medical"
                                />
                                <span className="medical-title">
                                    Bệnh viện Bạch Mai
                                </span>
                            </div>
                            <div className="medical-item">
                                <img
                                    className="medical-img"
                                    src={medicalImg}
                                    alt="medical"
                                />
                                <span className="medical-title">
                                    Bệnh viện Bạch Mai
                                </span>
                            </div>
                            <div className="medical-item">
                                <img
                                    className="medical-img"
                                    src={medicalImg}
                                    alt="medical"
                                />
                                <span className="medical-title">
                                    Bệnh viện Bạch Mai
                                </span>
                            </div>
                            <div className="medical-item">
                                <img
                                    className="medical-img"
                                    src={medicalImg}
                                    alt="medical"
                                />
                                <span className="medical-title">
                                    Bệnh viện Bạch Mai
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

export default connect(mapStateToProps, mapDispatchToProps)(Medical);
