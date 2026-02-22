import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.jsx";
import { Link, useNavigate, useParams } from "react-router-dom";

export const AddContact = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const params = useParams();

    const [form, setForm] = useState({
        full_name: "",
        email: "",
        phone: "",
        address: ""
    });

    const isEdit = Boolean(params.id);

    useEffect(() => {
        if (isEdit) {
            // 1. Si currentContact existe, úsalo
            if (store.currentContact && store.currentContact.id === parseInt(params.id)) {
                setForm({
                    full_name: store.currentContact.full_name || "",
                    email: store.currentContact.email || "",
                    phone: store.currentContact.phone || "",
                    address: store.currentContact.address || ""
                });
            } else {
                // 2. Si no existe, buscar en store.contacts (caso de recarga)
                const found = store.contacts.find(c => c.id === parseInt(params.id));
                if (found) {
                    actions.setCurrentContact(found);
                    setForm({
                        full_name: found.full_name,
                        email: found.email,
                        phone: found.phone,
                        address: found.address
                    });
                }
            }
        } else {
            // Modo creación
            actions.clearCurrentContact();
            setForm({
                full_name: "",
                email: "",
                phone: "",
                address: ""
            });
        }
    }, [isEdit, params.id, store.currentContact, store.contacts]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.full_name || !form.email || !form.phone || !form.address) {
            alert("Please fill all fields");
            return;
        }

        if (isEdit) {
            actions.updateContact(params.id, form, navigate);
        } else {
            actions.addContact(form, navigate);
        }
    };

    return (
        <div className="add-contact-wrapper">
            <h1 className="h3 mb-4">
                {isEdit ? "Edit contact" : "Add a new contact"}
            </h1>

            <form className="add-contact-form" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Full Name"
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                    Save
                </button>
            </form>

            <div className="mt-3">
                <Link to="/" className="text-muted">
                    or get back to contacts
                </Link>
            </div>
        </div>
    );
};
