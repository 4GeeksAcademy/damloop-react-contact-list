import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ContactCard } from "../../components/ContactCard.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { loadContacts } from "../store.js";

const ContactList = () => {
    const { store, dispatch } = useGlobalReducer();
    const {
        contacts,
        error,
        hasLoadedContacts,
        isLoadingContacts,
        isSavingContact,
    } = store;

    useEffect(() => {
        if (hasLoadedContacts || isLoadingContacts) {
            return;
        }

        void loadContacts(dispatch);
    }, [dispatch, hasLoadedContacts, isLoadingContacts]);

    const isBusy = isLoadingContacts || isSavingContact;

    return (
        <section className="contact-page">
            <header className="contact-page-header mb-4">
                <div>
                    <p className="text-uppercase text-muted small mb-2">
                        Damian Lopez
                    </p>
                    <h1 className="h3 mb-1">Contact List</h1>
                    <p className="text-muted mb-0">
                        CRUD conectado a la API oficial con un store global
                        reutilizable.
                    </p>
                </div>
                <div className="contact-actions">
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => {
                            void loadContacts(dispatch);
                        }}
                        disabled={isBusy}
                    >
                        {isLoadingContacts ? "Refreshing..." : "Refresh"}
                    </button>
                    <Link to="/add" className="btn btn-primary">
                        Add new contact
                    </Link>
                </div>
            </header>

            {error ? (
                <div
                    className="alert alert-danger d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
                    role="alert"
                >
                    <span>{error}</span>
                    <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => {
                            void loadContacts(dispatch);
                        }}
                        disabled={isBusy}
                    >
                        Retry
                    </button>
                </div>
            ) : null}

            {isLoadingContacts && !hasLoadedContacts ? (
                <div className="contact-feedback-card text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <h2 className="h5">Loading contacts...</h2>
                    <p className="text-muted mb-0">
                        Syncing the shared agenda before showing the list.
                    </p>
                </div>
            ) : null}

            {hasLoadedContacts && contacts.length === 0 ? (
                <div className="contact-feedback-card text-center">
                    <h2 className="h4 mb-2">No contacts yet</h2>
                    <p className="text-muted mb-4">
                        Create the first contact and it will be persisted in the
                        API agenda.
                    </p>
                    <Link to="/add" className="btn btn-primary">
                        Create your first contact
                    </Link>
                </div>
            ) : null}

            <div className="d-grid gap-3">
                {contacts.map((contact) => (
                    <ContactCard key={contact.id} contact={contact} />
                ))}
            </div>

            {hasLoadedContacts && contacts.length > 0 ? (
                <footer className="text-center mt-4 text-muted contact-list-footer">
                    Total contacts: {contacts.length}
                </footer>
            ) : null}
        </section>
    );
};

export default ContactList;
