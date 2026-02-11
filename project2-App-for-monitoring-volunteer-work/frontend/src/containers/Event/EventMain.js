import React, { useState, useEffect } from 'react';
import { getRecentEvents, getAllEvents } from '../../services/eventServices';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import SingleEvent from '../../components/Event/SingleEvent';


const EventMain = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await getAllEvents();
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

    if (loading) return <div>Loading...</div>;
    return (
        <div className="react-upcoming__event react-upcoming__event_page blog__area pt---100 pb---112">
            <div className="container">  
                <div className="row align-items-center back-vertical-middle shorting__course3 mb-50">
                    <div className="col-md-6">
                        <div className="all__icons">                                   
                            <div className="result-count">Các Hoạt Động Của Đội</div>
                        </div>
                    </div>
                    <div className="col-md-6 text-right">                                
                        <select className="from-control">
                            <option>Event Type: All</option>
                            <option>Sort by popularity</option>
                            <option>Sort by average rating</option>
                            <option>Sort by lates</option>
                            <option>Sort by price: low to high</option>
                            <option>Sort by price: high to low</option>
                        </select>
                    </div>
                </div>                      
                <div className="row">
                    {events.map((data, index) => {
                        return (
                            <div className="col-lg-3">
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
                            </div>
                        )
                    }).slice(0, 12)}
                </div>  
                <ul className="back-pagination pt---20">
                    <li><Link to="#">1</Link></li>
                    <li><Link to="#">2</Link></li>
                    <li className="back-next"><Link to="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></Link></li>
                </ul>                                          
            </div>
        </div>  
    );
}

export default EventMain;