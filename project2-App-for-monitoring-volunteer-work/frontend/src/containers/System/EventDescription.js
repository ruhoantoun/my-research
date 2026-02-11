import React, { Component } from "react";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { createEventDescription, getEventById } from "../../services/eventServices";
import { getAllEvents } from "../../services/eventServices";
import { getAllCodes } from "../../services/userServices";
import { languages } from "../../utils/constant";
import * as actions from "../../../src/store/actions";
import Select from "react-select";
import "./EventDescription.scss";
import { FormattedMessage } from "react-intl";
import { Spinner } from 'reactstrap';

const mdParser = new MarkdownIt();

class EventDescription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentMarkdown: "",
            contentHTML: "",
            description: "",
            selectedPosition: null,
            selectedEvent: null,
            image: "",
            positions: [],
            events: [],
            isLoading: false,
            isLoadingEvent: false,
            hasExistingData: false,
            originalEventData: null
        };
    }
    
    async componentDidMount() {
        this.setState({ isLoading: true });
        try {
            await this.fetchEvents();
            
            // Kiểm tra nếu có eventId từ URL (trong trường hợp chỉnh sửa)
            const urlParams = new URLSearchParams(window.location.search);
            const eventId = urlParams.get('id');
            
            if (eventId) {
                await this.handleEventSelection({ value: eventId });
            }
        } catch (error) {
            console.error("Error in componentDidMount:", error);
            toast.error("Error loading initial data");
        } finally {
            this.setState({ isLoading: false });
        }
    }
    
    fetchEvents = async () => {
        try {
            const response = await getAllEvents();
            
            if (response && response.data && response.data.errCode === 0) {
                const events = response.data.data;
                
                this.setState({
                    events: this.buildSelectOptions(events)
                });
            } else {
                toast.error("Failed to fetch events");
            }
        } catch (error) {
            console.error("Error fetching events:", error);
            toast.error("Error loading events");
        }
    }

    buildSelectOptions = (items) => {
        return items.map(item => ({
            value: item.id,
            label: item.name
        }));
    };
    
    // Hàm mới để xử lý sự kiện khi người dùng chọn một event
    handleEventSelection = async (selectedEvent) => {
        this.setState({ 
            selectedEvent,
            isLoadingEvent: true,
            hasExistingData: false
        });
        
        if (selectedEvent) {
            try {
                const response = await getEventById(selectedEvent.value);
                
                if (response && response.data && response.data.errCode === 0) {
                    const eventData = response.data.data;
                    const eventMarkdown = eventData.eventMarkdown;
                    
                    // Lưu dữ liệu gốc để so sánh sau này
                    this.setState({ originalEventData: eventData });
                    
                    // Kiểm tra xem event đã có mô tả chưa
                    if (eventMarkdown) {
                        this.setState({
                            contentMarkdown: eventMarkdown.contentMarkdown || "",
                            contentHTML: eventMarkdown.contentHTML || "",
                            description: eventMarkdown.description || "",
                            image: eventMarkdown.image || "",
                            hasExistingData: true
                        });
                        
                        toast.info("Đã tải thông tin mô tả sẵn có của sự kiện");
                    } else {
                        // Nếu chưa có mô tả thì reset form
                        this.setState({
                            contentMarkdown: "",
                            contentHTML: "",
                            description: "",
                            image: ""
                        });
                        
                        toast.info("Sự kiện chưa có mô tả chi tiết. Vui lòng tạo mới.");
                    }
                } else {
                    toast.error(response?.data?.errMessage || "Không thể tải thông tin sự kiện");
                }
            } catch (error) {
                console.error("Error fetching event details:", error);
                toast.error("Lỗi khi tải thông tin sự kiện");
            } finally {
                this.setState({ isLoadingEvent: false });
            }
        }
    };

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html
        });
    };
    
    handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                this.setState({ image: reader.result });
            };
        }
    };

    handleSaveContent = async () => {
        const { contentHTML, contentMarkdown, description, 
                 selectedEvent, image, hasExistingData } = this.state;

        if (!selectedEvent) {
            toast.error("Vui lòng chọn một sự kiện");
            return;
        }
        
        if (!contentMarkdown.trim()) {
            toast.warning("Vui lòng nhập nội dung chi tiết");
            return;
        }

        this.setState({ isLoading: true });
        
        try {
            const data = {
                contentHTML,
                contentMarkdown,
                description,
                eventId: selectedEvent.value,
                image
            };
            
            // Nếu đã có dữ liệu, thêm id để update
            if (hasExistingData && this.state.originalEventData?.eventMarkdown?.id) {
                data.id = this.state.originalEventData.eventMarkdown.id;
            }
            
            const response = await createEventDescription(data);

            if (response && response.data.errCode === 0) {
                toast.success(hasExistingData ? "Cập nhật mô tả thành công!" : "Tạo mô tả thành công!");
                
                // Reload event data to get the latest changes
                await this.handleEventSelection(selectedEvent);
            } else {
                toast.error(response.data.errMessage || "Có lỗi xảy ra khi lưu");
            }
        } catch (error) {
            console.error("Error saving content:", error);
            toast.error("Lỗi khi lưu nội dung");
        } finally {
            this.setState({ isLoading: false });
        }
    };
    
    renderEventPreview() {
        const { originalEventData } = this.state;
        console.log("originalEventData", originalEventData);
        if (!originalEventData) return null;
        
        return (
            <div className="event-preview mb-4 p-3 border rounded bg-light">
                <h5 className="border-bottom pb-2 mb-3">Thông tin sự kiện</h5>
                
                <div className="row">
                    <div className="col-md-6">
                        <p><strong>Tên:</strong> {originalEventData.name}</p>
                        <p><strong>Loại Sự Kiện:</strong> {originalEventData.eventType?.valueVi || "N/A"}</p>
                        <p><strong>Ngày:</strong> {new Date(originalEventData.date).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div className="col-md-6">
                        <p><strong>Địa điểm:</strong> {originalEventData.address || "N/A"}</p>
                        <p><strong>Chi phí:</strong> {originalEventData.cost ? `${originalEventData.cost.toLocaleString()} VNĐ` : "Miễn phí"}</p>
                        <p><strong>Trạng thái:</strong> {originalEventData.status?.valueVi || "N/A"}</p>
                    </div>
                </div>
            </div>
        );
    }
    
    render() {
        const { selectedEvent, events, isLoading, isLoadingEvent, hasExistingData, image } = this.state;

        return (
            <div className="event-description-container p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Chỉnh sửa mô tả sự kiện</h2>
                    {hasExistingData && (
                        <span className="badge bg-info">Đã có mô tả</span>
                    )}
                </div>
                
                {isLoading ? (
                    <div className="text-center my-5">
                        <Spinner color="primary" /> 
                        <p className="mt-2">Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <>
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label className="form-label">Chọn sự kiện:</label>
                                <Select
                                    value={selectedEvent}
                                    onChange={this.handleEventSelection}
                                    options={events}
                                    className="basic-select"
                                    placeholder="Chọn sự kiện để mô tả"
                                    isSearchable={true}
                                    isDisabled={isLoadingEvent}
                                />
                            </div>
                        </div>
                        
                        {isLoadingEvent ? (
                            <div className="text-center my-3">
                                <Spinner size="sm" color="primary" /> 
                                <span className="ms-2">Đang tải thông tin sự kiện...</span>
                            </div>
                        ) : selectedEvent ? (
                            <>
                                {this.renderEventPreview()}
                                
                                <div className="mb-4">
                                    <label className="form-label">Mô tả ngắn:</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={this.state.description}
                                        onChange={(e) => this.setState({ description: e.target.value })}
                                        placeholder="Nhập mô tả ngắn về sự kiện..."
                                    ></textarea>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Hình ảnh đại diện:</label>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        value={this.state.image}
                                        onChange={(e) => this.setState({ image: e.target.value })}
                                        placeholder="Nhập URL hình ảnh"
                                    />
                                    
                                    {image && (
                                        <div className="mt-2 text-center border p-2">
                                            <img 
                                                src={image} 
                                                alt="Preview" 
                                                style={{ maxHeight: '200px' }} 
                                                className="img-thumbnail"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/400x200?text=Hình+ảnh+không+tồn+tại';
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="markdown-editor mb-4">
                                    <label className="form-label">Nội dung chi tiết:</label>
                                    <MdEditor
                                        style={{ height: "500px" }}
                                        renderHTML={(text) => mdParser.render(text)}
                                        onChange={this.handleEditorChange}
                                        value={this.state.contentMarkdown}
                                    />
                                </div>

                                <button
                                    className="btn btn-primary"
                                    onClick={this.handleSaveContent}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Đang lưu...
                                        </>
                                    ) : hasExistingData ? (
                                        "Cập nhật mô tả"
                                    ) : (
                                        "Tạo mô tả mới"
                                    )}
                                </button>
                            </>
                        ) : (
                            <div className="alert alert-info">
                                <i className="fas fa-info-circle me-2"></i>
                                Vui lòng chọn một sự kiện để bắt đầu chỉnh sửa mô tả
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    language: state.app.language
});

export default connect(mapStateToProps)(EventDescription);