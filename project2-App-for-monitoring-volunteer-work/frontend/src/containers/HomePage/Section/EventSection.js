import React, { Component, useState, useEffect } from "react";
import Slider from "react-slick";

// import SectionTitle from '../../components/SectionTitle'
import SectionTitle from "../../../components/SectionTitle/index.js";
import SingleEvent from "../../../components/Event/SingleEvent";
import { toast } from "react-toastify";
import events from "../../../data/Events.json";
import { getRecentEvents } from "../../../services/eventServices";
const Event = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await getRecentEvents();
            if (response && response.data && response.data.errCode === 0) {
                setEvents(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
            toast.error("Không thể tải danh sách sự kiện");
        } finally {
            setLoading(false);
        }
    };
    const eventSettings = {
        dots: true,
        arrows: false,
        infinite: true,
        centerMode: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    arrows: false,
                },
            },
        ],
    };
    if (loading) return <div>Loading...</div>;
    return (
        <div className="react-upcoming__event blog__area">
            <div className="container">
                <SectionTitle Title="Upcoming Events" />
                <div
                    className="event-slider owl-carousel wow animate__fadeInUp"
                    data-wow-duration="0.3s"
                >
                    <Slider {...eventSettings}>
                        {events
                            .map((data, index) => {
                                return (
                                    <SingleEvent
                                        key={data.id}
                                        eventID={data.id}
                                        eventImg={data.eventMarkdown?.image || ''}
                                        eventTitle={data.name}
                                        eventDate={data.date}
                                        eventLocation={data.address}
                                        eventType={data.eventType?.valueVi}
                                        eventStatus={data.status?.valueVi}
                                        eventDescription={data.eventMarkdown?.description}
                                        eventCost={data.cost}
                                        eventQuantityMember={data.quantityMember}
                                        eventBtnText="Xem chi tiết"
                                    />
                                );
                            })
                            .slice(0, 6)}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

export default Event;
