import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../js/hooks/useGlobalReducer.jsx";
import { deleteContact } from "../js/store.js";

export const ContactCard = ({ contact }) => {
    const { store, dispatch } = useGlobalReducer();
    const [showModal, setShowModal] = useState(false);
    const isBusy = store.isLoadingContacts || store.isSavingContact;

    const handleDeleteClick = () => {
        setShowModal(true);
    };

    const confirmDelete = async () => {
        const didDelete = await deleteContact(dispatch, contact.id);

        if (didDelete) {
            setShowModal(false);
        }
    };

    const cancelDelete = () => {
        setShowModal(false);
    };

    return (
        <>
            <article className="card mb-3 contact-card">
                <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div>
                        <h2 className="h5 mb-2">{contact.name}</h2>
                        <p className="mb-1 contact-detail">
                            <span className="contact-detail-label">Email:</span>
                            {contact.email}
                        </p>
                        <p className="mb-1 contact-detail">
                            <span className="contact-detail-label">Phone:</span>
                            {contact.phone}
                        </p>
                        <p className="mb-0 contact-detail">
                            <span className="contact-detail-label">Address:</span>
                            {contact.address}
                        </p>
                    </div>
                    <div className="contact-actions">
                        <Link
                            to={`/edit/${contact.id}`}
                            className="btn btn-outline-primary btn-sm"
                            aria-label={`Edit ${contact.name}`}
                        >
                            Edit
                        </Link>
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={handleDeleteClick}
                            disabled={isBusy}
                            aria-label={`Delete ${contact.name}`}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </article>

            {showModal && (
                <div className="modal-backdrop-custom">
                    <div
                        className="modal-custom"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={`delete-contact-${contact.id}`}
                    >
                        <h5 id={`delete-contact-${contact.id}`} className="mb-3">
                            Delete contact
                        </h5>
                        <p className="mb-4">
                            Are you sure you want to remove <strong>{contact.name}</strong>?
                        </p>
                        <div className="d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={cancelDelete}
                                disabled={isBusy}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={confirmDelete}
                                disabled={isBusy}
                            >
                                {isBusy ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

ContactCard.propTypes = {
    contact: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
    }).isRequired,
};
