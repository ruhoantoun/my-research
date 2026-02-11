import React, { Component } from "react";
import { connect } from "react-redux";
import { languages } from "../../../utils/constant";
import "./FeaturedDoctors.scss";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as actions from "../../../store/actions";
// import medicalImg from "../../../assets/FeaturedDoctors/1.jpg";

import CardDoctor from "../../../components/CardDoctor";

class FeaturedDoctors extends Component {
    componentDidMount() {
        this.props.fetchAllDoctors();
    }
    render() {
        const { isLoading, allDoctors, language } = this.props;
        console.log("check allDoctor", allDoctors)
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
                <div className="section-doctors">
                    <div className="doctors-content">
                        <div className="doctors-header">
                            <div className="doctors-title mb-3 ml-1">
                                Bác sĩ nổi bật tuần qua
                            </div>
                            <button
                                type="button"
                                class="btn btn-outline-primary"
                            >
                                Tìm kiếm
                            </button>
                        </div>

                        {isLoading ? (
                            <div>Loading...</div>
                        ) : (
                            <Slider {...settings}>
                                {allDoctors && allDoctors.map((doctor, index) => (
                                    <div className="doctors-item" key={doctor.id}>
                                        <CardDoctor
                                            imageUrl={doctor.image ? 
                                                doctor.image : 
                                                '/default-doctor.png'
                                            }
                                            name={language === languages.VI ? 
                                                `${doctor.lastName} ${doctor.firstName}` :
                                                `${doctor.firstName} ${doctor.lastName}`
                                            }
                                            position={language === languages.VI ?
                                                doctor.positionData.valueVi :
                                                doctor.positionData.valueEn
                                            }
                                            id={doctor.id}
                                        />
                                    </div>
                                ))}
                            </Slider>
                        )}
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
        allDoctors: state.admin.allDoctors,
    };
};

const mapDispatchToProps = (dispatch) => ({
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
});

export default connect(mapStateToProps, mapDispatchToProps)(FeaturedDoctors);
