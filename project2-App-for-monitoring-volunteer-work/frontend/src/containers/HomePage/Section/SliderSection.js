import { useState, useEffect } from "react";
import ModalVideo from "react-modal-video";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { toast } from "react-toastify";
import { getRecentEvents } from "../../../services/eventServices";
import "./SliderSection.scss";
const HomeSlider = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const openModal = () => setIsOpen(!isOpen);

    useEffect(() => {
        fetchEvents();
    }, []);
    const fetchEvents = async () => {
        try {
            const response = await getRecentEvents();
            console.log("Response from getRecentEvents:", response);
            if (response && response.data && response.data.errCode === 0) {
                console.log("Event data:", response.data.data);
                setEvents(response.data.data);
            }
            // console.log("check event", this.useState.event)
        } catch (error) {
            console.error("Error fetching events:", error);
            toast.error("Failed to load events");
        }
    };
    const sliderSettings = {
        dots: false,
        arrows: true,
        infinite: true,
        margin: 0,
        centerMode: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    arrows: true,
                },
            },
            {
                breakpoint: 767,
                settings: {
                    arrows: false,
                },
            },
        ],
    };

    return (
        <>
            <div className="react-slider-part">
                <ModalVideo
                    channel="youtube"
                    isOpen={isOpen}
                    videoId="e5Hc2B50Z7c"
                    onClose={openModal}
                />
                <div className="home-sliders home2">
                    <Slider {...sliderSettings}>
                        {events &&
                            events.map((event, index) => (
                                <div className="single-slide" key={event.id}>
                                    <div className="slider-img">
                                        <img
                                            className="desktop"
                                            src={
                                                event.eventMarkdown?.image || ""
                                            }
                                            alt={event.name}
                                        />
                                        <img
                                            className="mobile"
                                            src={
                                                event.eventMarkdown?.image || ""
                                            }
                                            alt={event.name}
                                        />
                                    </div>
                                    <div className="container">
                                        <div className="slider-content">
                                            <div className="content-part">
                                                <span
                                                    className="slider-pretitle wow animate__fadeInUp"
                                                    data-wow-duration="1s"
                                                >
                                                    {event.eventType?.valueVi}
                                                </span>
                                                <h2
                                                    className="slider-title wow animate__fadeInUp"
                                                    data-wow-duration="1s"
                                                >
                                                    {event.name}
                                                </h2>
                                                <div
                                                    className="slider-btn wow animate__fadeInUp"
                                                    data-wow-duration="1.2s"
                                                >
                                                    <Link
                                                        to={`/event-details/${event.id}`}
                                                        className="react-btn-border"
                                                    >
                                                        Chi tiết
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="event__video-btn--play wow animate__fadeInUp"
                                            data-wow-duration="1.4s"
                                        >
                                            <Link
                                                to="#"
                                                className="event__video-btn--play-btn custom-popup"
                                                onClick={openModal}
                                            >
                                                <i className="arrow_triangle-right"></i>
                                                <em>
                                                    Xem Video
                                                    <br />
                                                    Giới thiệu
                                                </em>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </Slider>
                </div>
            </div>
        </>
    );
};

export default HomeSlider;
