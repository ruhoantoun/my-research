import React, { Component } from "react";
import { connect } from "react-redux";
import "./Manual.scss";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import medicalImg from "../../../assets/Manual/1.jpg";
import medicalImg from "../../../assets/medical/1.jpg";
import Manuals from "../../../components/Manuals";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
class Manual extends Component {
    render() {
        let settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 2,
            slidesToScroll: 2,
            nextArrow: <div className="slick-next"></div>,
            prevArrow: <div className="slick-prev"></div>,
        };
        return (
            <React.Fragment>
                <div className="section-doctors">
                    <div className="doctors-content">
                        <div className="doctors-header">
                            <div className="doctors-title mb-3 ml-1">
                                Bác sĩ nổi bật tuần qua
                            </div>
                            <button type="button" class="btn btn-outline-primary">Tìm kiếm</button>
                        </div>

                        <Slider {...settings}>

                            <div className="doctors-item">
                            <Manuals/>
                            </div>
                            <div className="doctors-item">
                            <Manuals/>
                            </div>
                            <div className="doctors-item">
                            <Manuals/>
                            </div>
                            <div className="doctors-item">
                            <Manuals/>
                            </div>
                            <div className="doctors-item">
                            <Manuals/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Manual);
