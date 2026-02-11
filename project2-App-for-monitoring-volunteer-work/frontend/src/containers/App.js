import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";
import { history } from "../redux";
import { ToastContainer } from "react-toastify";
import CustomScrollbars from "../components/CustomScrollbars";
import {
    userIsAuthenticated,
    userIsNotAuthenticated,
} from "../hoc/authentication";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { path } from "../utils";
import Home from "../routes/Home";
// import Login from '../routes/Login';
import Login from "./Auth/Login";
import System from "../routes/System";
import Profile from "../routes/Profile";
import HomePage from "./HomePage/HomePage";
import Event from "./Event/Event";
import EventDetails from "./Event/event-details";
import EventRegistration from "./EventRegistration/index"
import EventRegistrationDetails from "./EventRegistrationDetails/EventRegistrationDetails"
import Recruitment from "./Recruitment/index";
import Contact from "./Contact/Contact";
import ForgotPassword from "./Auth/Forgot_Password";
import HelpRequest from "./HelpRequest/index";
import HelpRequestList from "./HelpRequest/HelpRequestList";
class App extends Component {
    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }

    render() {
        return (
            <Fragment>
                <Router history={history}>
                    <div className="main-container">
                        <div className="content-container">
                            <CustomScrollbars
                                style={{ height: "100vh", width: "100vw" }}
                            >
                                <Switch>
                                    <Route
                                        path={path.HOME}
                                        exact
                                        component={Home}
                                    />
                                    <Route
                                        path={path.LOGIN}
                                        component={userIsNotAuthenticated(
                                            Login
                                        )}
                                    />
                                    <Route
                                        path={path.SYSTEM}
                                        component={userIsAuthenticated(System)}
                                    />
                                    <Route
                                        path={path.HOMEPAGE}
                                        component={HomePage}
                                    />
                                    <Route
                                        path={path.EVENT}
                                        component={Event}
                                    />
                                    <Route
                                        path={path.EVENT_DETAIL}
                                        component={EventDetails}
                                    />
                                    <Route
                                        path={path.EVENT_REGISTRATION}
                                        component={EventRegistration}
                                    />
                                    <Route
                                        path={path.EVENT_REGISTRATION_DETAILS}
                                        component={EventRegistrationDetails}
                                    />
                                    <Route
                                        path={path.USER_PROFILE}
                                        component={Profile}
                                    />
                                    <Route
                                        path={path.RECRUITMENT}
                                        component={Recruitment}
                                    />
                                    <Route
                                        path={path.CONTACT}
                                        component={Contact}
                                    />
                                    <Route
                                        path={path.FORGOT_PASSWORD}
                                        component={ForgotPassword}
                                    />
                                    <Route
                                        path={path.HELP_REQUEST}
                                        component={HelpRequest}
                                    />
                                    <Route
                                        path={path.HELP_REQUEST_LIST}
                                        component={HelpRequestList}
                                    />
                         
                                </Switch>
                            </CustomScrollbars>
                        </div>

                        <ToastContainer
                            position="top-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />
                    </div>
                </Router>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        started: state.app.started,
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
