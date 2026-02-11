import React from "react";
import { Link } from "react-router-dom";

import breadcrumbsImg from "../../assets/images/breadcrumbs/1.jpg";

const Breadcrumb = (props) => {
    const { pageTitle, pageTitle1, pageTitle2, pageTitle3, pageTitle4 } = props;
    const { linkPageTitle, linkPageTitle1, linkPageTitle2, linkPageTitle3, linkPageTitle4 } = props;
    
    // Xác định pageTitle cuối cùng để hiển thị
    const getLastPageTitle = () => {
        if (pageTitle4) return pageTitle4;
        if (pageTitle3) return pageTitle3;
        if (pageTitle2) return pageTitle2;
        if (pageTitle1) return pageTitle1;
        return pageTitle || ""; 
    };

    // Tạo đối tượng chứa thông tin các mục breadcrumb
    const breadcrumbItems = [
        { title: pageTitle, link: linkPageTitle },
        { title: pageTitle1, link: linkPageTitle1 },
        { title: pageTitle2, link: linkPageTitle2 },
        { title: pageTitle3, link: linkPageTitle3 },
        { title: pageTitle4, link: linkPageTitle4 },
    ];

    return (
        <div className="react-breadcrumbs">
            <div className="breadcrumbs-wrap">
                <img className="desktop" src={breadcrumbsImg} alt="Breadcrumbs" />
                <img className="mobile" src={breadcrumbsImg} alt="Breadcrumbs" />
                <div className="breadcrumbs-inner">
                    <div className="container">
                        <div className="breadcrumbs-text">
                            {/* Chỉ hiển thị pageTitle cuối cùng */}
                            <h1 className="breadcrumbs-title">{getLastPageTitle()}</h1>
                            
                            <div className="back-nav">
                                <ul>
                                    <li>
                                        <Link to="/home">Home</Link>
                                    </li>
                                    
                                    {/* Render các mục breadcrumb chỉ khi có dữ liệu */}
                                    {breadcrumbItems.map((item, index) => (
                                        item.title ? (
                                            <li key={index}>
                                                <Link to={item.link || "#"}>{item.title}</Link>
                                            </li>
                                        ) : null
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Breadcrumb;