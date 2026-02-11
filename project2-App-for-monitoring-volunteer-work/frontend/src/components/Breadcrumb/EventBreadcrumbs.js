import React from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import "./EventBreadcrumbs.scss";
const Breadcrumb = (props) => {
    const {
        eventBannerImg,
        eventCategory,
        eventDate,
        eventStartTime,
        eventEndTime,
        eventTitle,
        eventLocation,
    } = props;

    return (
        <div className="react-breadcrumbs single-page-breadcrumbs">
            <div className="breadcrumbs-wrap">
                <img
                    className="desktop"
                    src={eventBannerImg || "https://raw.githubusercontent.com/Trantoan12022004/host_image_page_anhtonton/main/testpage.jpg"}
                    alt={eventTitle}
                />
                <img
                    className="mobile"
                    src={eventBannerImg || "https://raw.githubusercontent.com/Trantoan12022004/host_image_page_anhtonton/main/testpage.jpg"}
                    alt={eventTitle}
                />
                <div className="breadcrumbs-inner">
                    <div className="container">
                        <div className="breadcrumbs-text">
                            <Link to="#" className="cate">
                                {eventCategory}
                            </Link>
                            <h1 className="breadcrumbs-title">{eventTitle}</h1>
                            <ul className="user-section">
                                <li>
                                    <FaCalendarAlt className="icon" />
                                    {new Date(eventDate).toLocaleDateString('vi-VN')}
                                </li>
                                <li>
                                    <FaClock className="icon" />
                                    {eventStartTime} - {eventEndTime}
                                </li>
                                <li>
                                    <FaMapMarkerAlt className="icon" />
                                    {eventLocation}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Breadcrumb;
