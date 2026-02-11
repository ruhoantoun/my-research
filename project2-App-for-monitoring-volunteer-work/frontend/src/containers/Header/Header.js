import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../../store/actions";
import Navigator from "../../components/Navigator";
import { adminMenu, doctorMenu } from "./menuApp";
import "./Header.scss";
import { languages } from "../../utils/constant";
import { FormattedMessage } from "react-intl";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuApp: [],
        };
    }

    componentDidMount() {
        let { userInforr } = this.props;
        let menu = [];
        if (userInforr && userInforr.roleId) {
            if (userInforr.roleId === "R1") {
                menu = adminMenu;
            }
            if (userInforr.roleId === "R2") {
                menu = doctorMenu;
            }
        }
        this.setState({
            menuApp: menu,
        });
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.userInforr !== this.props.userInforr) {
            let { userInforr } = this.props;
            let menu = [];
            if (userInforr && userInforr.roleId) {
                if (userInforr.roleId === "R1") {
                    menu = adminMenu;
                }
                if (userInforr.roleId === "R2") {
                    menu = doctorMenu;
                }
            }
            this.setState({
                menuApp: menu,
            });
        }
    }
    handleChangeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    };
    render() {
        let language = this.props.language;
        const { processLogout, langguage, userInforr } = this.props;
        const {menuApp} = this.state;
        console.log("check", userInforr);
        return (
            <div className="header-container">
                {/* thanh navigator */}
                <div className="header-tabs-container">
                    <Navigator menus={menuApp} />
                </div>
                <div className="languages-logout">
                    <span className="welcome">
                        <FormattedMessage id="home-header.welcome" />
                        {userInforr && userInforr.lastName
                            ? userInforr.lastName
                            : " "}
                    </span>
                    <div className="languages">
                        <span
                            className={
                                language === languages.VI
                                    ? "language-vi active"
                                    : "language-vi"
                            }
                            onClick={() =>
                                this.handleChangeLanguage(languages.VI)
                            }
                        >
                            VN
                        </span>
                        <span
                            className={
                                language === languages.EN
                                    ? "language-en active"
                                    : "language-en"
                            }
                            onClick={() =>
                                this.handleChangeLanguage(languages.EN)
                            }
                        >
                            EN
                        </span>
                    </div>
                    <div
                        className="btn btn-logout"
                        onClick={processLogout}
                        title="Log out"
                    >
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInforr: state.user.userInforr,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) =>
            dispatch(actions.changeLanguageApp(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
