import React from "react";
import ReactDOM from "react-dom/client";
import Layout from "./js/layout.jsx";
import { StoreProvider } from "./js/hooks/useGlobalReducer.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("app")).render(
    <React.StrictMode>
        <StoreProvider>
            <Layout />
        </StoreProvider>
    </React.StrictMode>
);
