import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Contact } from "./pages/Contact.jsx";
import { AddContact } from "./pages/AddContact.jsx";
import { Navbar } from "../components/Navbar.jsx";
import { Footer } from "../components/Footer.jsx";
import ScrollToTop from "../components/ScrollToTop.jsx";

const Layout = () => {
    return (
        <BrowserRouter>
            <ScrollToTop>
                <Navbar />
                <div className="container my-4">
                    <Routes>
                        <Route path="/" element={<Contact />} />
                        <Route path="/add" element={<AddContact />} />
                        <Route path="/edit/:id" element={<AddContact />} />
                    </Routes>
                </div>
                <Footer />
            </ScrollToTop>
        </BrowserRouter>
    );
};

export default Layout;
