import React from 'react';
import { Link } from 'react-router-dom'
import "./SingleCourse.scss"
import defaultAvatar from '../../assets/images/404.png';

const SingleCourse = (props) => {
    const { 
        itemClass, 
        personID, 
        avatar, 
        firstName, 
        lastName, 
        role, 
        description, 
        contactInfo 
    } = props;

    // Có thể thêm xử lý HTML content nếu cần
    const renderMarkdown = () => {
        if (props.markdownContent) {
            return <div className="markdown-content" dangerouslySetInnerHTML={{ __html: props.markdownContent }} />;
        }
        return null;
    }

    return(
        <div className={itemClass ? itemClass : 'person__item mb-30'}>
            <div className="person__thumb">
                <Link to={`/user-profile/profile/${personID}`}>
                    <img 
                        src={avatar || defaultAvatar} 
                        alt={`${firstName} ${lastName}`} 
                        className="person-avatar"
                    />
                </Link>
            </div>
            <div className="person__inner">
                <div className="person-role">
                    <span>{role || 'Thành viên'}</span>
                </div>
                <h3 className="person-name">
                    <Link to={`/user-profile/profile/${personID}`}>
                        {firstName && lastName ? `${firstName} ${lastName}` : 'Chưa có thông tin'}
                    </Link>
                </h3>
                <div className="person-description">
                    <p>{description || 'Chưa cập nhật thông tin mô tả'}</p>
                </div>
                {/* {renderMarkdown()} */}
                <div className="person__card-info d-flex align-items-center">
                    <div className="person__card-info--contact">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        <span>{contactInfo?.email || 'Chưa cập nhật email'}</span>
                    </div>                                            
                    <div className="person__social-links">
                        {contactInfo?.phone && (
                            <a href={`tel:${contactInfo.phone}`} className="phone-link" title="Gọi điện">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-phone">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                            </a>
                        )}
                        {/* Có thể thêm các liên kết mạng xã hội khác tại đây */}
                    </div>
                </div>
            </div>                                    
        </div>
    );
}

export default SingleCourse;