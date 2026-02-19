import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    Contact List
                </Link>
                <Link className="btn btn-success" to="/add">
                    Add new contact
                </Link>
            </div>
        </nav>
    );
};
