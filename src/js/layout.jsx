import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "../components/Navbar.jsx";
import { Footer } from "../components/Footer.jsx";
import ScrollToTop from "../components/ScrollToTop.jsx";
import ContactForm from "./views/ContactForm.jsx";
import ContactList from "./views/ContactList.jsx";

const Layout = () => {
    return (
        <BrowserRouter>
            <ScrollToTop>
                <div className="app-shell">
                    <Navbar />
                    <main className="container my-4 pb-4">
                        <Routes>
                            <Route path="/" element={<ContactList />} />
                            <Route path="/add" element={<ContactForm />} />
                            <Route path="/edit/:id" element={<ContactForm />} />
                            <Route path="*" element={<Navigate replace to="/" />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </ScrollToTop>
        </BrowserRouter>
    );
};

export default Layout;
