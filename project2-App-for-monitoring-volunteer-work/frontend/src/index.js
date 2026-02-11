import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./styles/styles.scss";

import App from "./containers/App";
import * as serviceWorker from "./serviceWorker";
import IntlProviderWrapper from "./hoc/IntlProviderWrapper";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/main.scss";
import { Provider } from "react-redux";
import reduxStore, { persistor } from "./redux";

const renderApp = () => {
    ReactDOM.render(
        <Provider store={reduxStore}>
            <BrowserRouter>
                <IntlProviderWrapper>
                    <App persistor={persistor} />
                </IntlProviderWrapper>
            </BrowserRouter>
        </Provider>,
        document.getElementById("root")
    );
};

renderApp();
serviceWorker.unregister();
