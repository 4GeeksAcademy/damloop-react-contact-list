import React, { useContext } from "react";
import { Context } from "../store/appContext.jsx";
import { ContactCard } from "../../components/ContactCard.jsx";
import { Link } from "react-router-dom";

export const Contact = () => {
    const { store, actions } = useContext(Context);

    return (
        <div className="contact-page">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h3 mb-0">Contacts</h1>
                <Link className="btn btn-primary" to="/add">
                    Add new contact
                </Link>
            </div>

            {store.loading && <p>Loading contacts...</p>}
            {store.error && (
                <div className="alert alert-danger d-flex justify-content-between align-items-center py-2">
                    <span>{store.error}</span>
                    <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={actions.loadContacts}
                    >
                        Retry
                    </button>
                </div>
            )}

            {store.contacts.length === 0 && !store.loading ? (
                <p>No contacts yet. Create one!</p>
            ) : (
                store.contacts.map((c) => (
                    <ContactCard key={c.id} contact={c} />
                ))
            )}
        </div>
    );
};
