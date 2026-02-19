import React, { useContext, useState } from "react";
import { Context } from "../js/store/appContext.jsx";

import { useNavigate } from "react-router-dom";

export const ContactCard = ({ contact }) => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const handleEdit = () => {
        actions.setCurrentContact(contact);
        navigate(`/edit/${contact.id}`);
    };

    const handleDeleteClick = () => {
        setShowModal(true);
    };

    const confirmDelete = () => {
        actions.deleteContact(contact.id);
        setShowModal(false);
    };

    const cancelDelete = () => {
        setShowModal(false);
    };

    return (
        <>
            <div className="card mb-3 contact-card">
                <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="card-title mb-1">{contact.full_name}</h5>
                        <p className="mb-0 text-muted">{contact.email}</p>
                        <p className="mb-0 text-muted">{contact.phone}</p>
                        <p className="mb-0 text-muted">{contact.address}</p>
                    </div>
                    <div className="btn-group">
                        <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={handleEdit}
                        >
                            <i className="fas fa-pencil-alt"></i>
                        </button>
                        <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={handleDeleteClick}
                        >
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-backdrop-custom">
                    <div className="modal-custom">
                        <h5 className="mb-3">Are you sure?</h5>
                        <p className="mb-4">
                            Do you really want to delete this contact?
                        </p>
                        <div className="d-flex justify-content-end gap-2">
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={cancelDelete}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
