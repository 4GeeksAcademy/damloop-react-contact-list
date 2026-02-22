import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <nav className="navbar bg-white shadow-sm">
            <div className="container d-flex justify-content-between align-items-center">
                <Link className="navbar-brand text-dark" to="/">
                    Contact List
                </Link>

                <Link className="btn btn-primary" to="/add">
                    Add new contact
                </Link>
            </div>
        </nav>
    );
};
