import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const MenuItems = (props) => {
    const location = useLocation();
    const postURL = location.pathname.split("/");
    const pathLength = Number(postURL.length);
    const currentPath = postURL[1];

    const [page, setPage] = useState(false);
    const [home, setHome] = useState(false);
    const [event, setEvent] = useState(false);
    const [profile, setProfile] = useState(false);
    const [blog, setBlog] = useState(false);
    const [helpRequest, setHelpRequest] = useState(false);

    const openMobileMenu = (menu) => {
        // Close all menus first
        setHome(false);
        setPage(false);
        setEvent(false);
        setProfile(false);
        setBlog(false);
        setHelpRequest(false);

        // Open the selected menu
        switch (menu) {
            case "home":
                setHome(true);
                break;
            case "event":
                setEvent(true);
                break;
            case "profile":
                setProfile(true);
                break;
            case "blog":
                setBlog(true);
                break;
            case "helpRequest":
                setHelpRequest(true);
                break;
            case "page":
                setPage(true);
                break;
            default:
                break;
        }
    };

    // Helper to check if current path matches exactly
    const isActive = (path) => location.pathname === path;

    // Helper to check if current path starts with a prefix
    const isActivePrefix = (prefix) => currentPath === prefix;

    return (
        <>
            <li className={isActive("/home") || location.pathname === "/" ? "menu-active" : ""}>
                <Link to="/home">Home</Link>
            </li>

            <li className={isActive("/event") ? "menu-active" : ""}>
                <Link to="/event">Events</Link>
            </li>

            <li className={isActivePrefix("user-profile") ? "has-sub menu-active" : "has-sub"}>
                <Link to="#" className={profile ? "hash menu-active" : "hash"} onClick={() => openMobileMenu("profile")}>
                    Profile
                    <span className="arrow"></span>
                </Link>
                <ul className={profile ? "sub-menu sub-menu-open" : "sub-menu"}>
                    <li className={isActive("/user-profile/manage-list") ? "menu-active" : ""}>
                        <Link to="/user-profile/manage-list">Ban Quản Lí</Link>
                    </li>
                    <li className={isActive("/user-profile") ? "menu-active" : ""}>
                        <Link to="/user-profile">Tình Nguyện Viên</Link>
                    </li>
                </ul>
            </li>

            {/* <li className={isActivePrefix("blog") ? "has-sub menu-active" : "has-sub"}>
                <Link to="#" className={blog ? "hash menu-active" : "hash"} onClick={() => openMobileMenu("blog")}>
                    Blog
                    <span className="arrow"></span>
                </Link>
                <ul className={blog ? "sub-menu sub-menu-open" : "sub-menu"}>
                    <li className={isActive("/blog") ? "menu-active" : ""}>
                        <Link to="/blog">Blog</Link>
                    </li>
                    <li className={currentPath === "blog" && pathLength > 2 ? "menu-active" : ""}>
                        <Link to="/blog/1">Blog Single</Link>
                    </li>
                </ul>
            </li> */}

            <li className={isActivePrefix("help-request") || isActivePrefix("help-request-list") ? "has-sub menu-active" : "has-sub"}>
                <Link to="#" className={helpRequest ? "hash menu-active" : "hash"} onClick={() => openMobileMenu("helpRequest")}>
                    HelpRequest
                    <span className="arrow"></span>
                </Link>
                <ul className={helpRequest ? "sub-menu sub-menu-open" : "sub-menu"}>
                    <li className={isActive("/help-request") ? "menu-active" : ""}>
                        <Link to="/help-request">Tạo yêu cầu</Link>
                    </li>
                    <li className={isActive("/help-request-list") ? "menu-active" : ""}>
                        <Link to="/help-request-list">Danh sách yêu cầu</Link>
                    </li>
                </ul>
            </li>

            <li className={isActive("/contact") ? "menu-active" : ""}>
                <Link to="/contact">Contact</Link>
            </li>
            <li className={isActive("/contact") ? "menu-active" : ""}>
                <Link to="/recruitment">Recruitment</Link>
            </li>
        </>
    );
};

export default MenuItems;
