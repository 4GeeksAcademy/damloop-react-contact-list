import React from "react";
import ReactDOM from "react-dom/client";
import Layout from "./js/layout.jsx";
import injectContext from "./js/store/appContext.jsx";
import "./index.css";

const LayoutWithContext = injectContext(Layout);

ReactDOM.createRoot(document.getElementById("app")).render(
    <React.StrictMode>
        <LayoutWithContext />
    </React.StrictMode>
);
