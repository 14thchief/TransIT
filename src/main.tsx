import React, { ComponentType } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./main.scss";
import { Provider } from "react-redux";
import store from "./redux/store/store.ts";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import ErrorBoundary from "components/Global/ErrorBoundary/ErrorBoundary.tsx";
import AppFallback from "components/Global/ErrorBoundary/AppFallback/index.tsx";
import { FallbackProps } from "react-error-boundary";
import ActionModal from "components/Global/ActionModal/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary fallback={AppFallback as ComponentType<FallbackProps>}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <ToastContainer />
          <ActionModal />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);