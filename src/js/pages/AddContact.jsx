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
    const [formErrors, setFormErrors] = useState({});

    const isEdit = Boolean(params.id);
    const contactId = Number(params.id);

    useEffect(() => {
        actions.clearError();
    }, []);

    useEffect(() => {
        if (isEdit) {
            if (store.currentContact && store.currentContact.id === contactId) {
                setForm({
                    full_name: store.currentContact.full_name || "",
                    email: store.currentContact.email || "",
                    phone: store.currentContact.phone || "",
                    address: store.currentContact.address || ""
                });
            } else {
                const found = store.contacts.find((c) => c.id === contactId);
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
            actions.clearCurrentContact();
            setForm({
                full_name: "",
                email: "",
                phone: "",
                address: ""
            });
        }
    }, [contactId, isEdit, store.currentContact, store.contacts]);

    const validateForm = () => {
        const nextErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!form.full_name.trim()) nextErrors.full_name = "Full name is required.";
        if (!form.email.trim()) {
            nextErrors.email = "Email is required.";
        } else if (!emailRegex.test(form.email.trim())) {
            nextErrors.email = "Enter a valid email address.";
        }
        if (!form.phone.trim()) nextErrors.phone = "Phone is required.";
        if (!form.address.trim()) nextErrors.address = "Address is required.";

        setFormErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });

        if (formErrors[name]) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                [name]: null
            }));
        }

        if (store.error) {
            actions.clearError();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (isEdit) {
            const success = await actions.updateContact(contactId, form);
            if (success) navigate("/");
        } else {
            const success = await actions.addContact(form);
            if (success) navigate("/");
        }
    };

    return (
        <div className="add-contact-wrapper">
            <h1 className="h3 mb-4">
                {isEdit ? "Edit contact" : "Add a new contact"}
            </h1>

            <form className="add-contact-form" onSubmit={handleSubmit}>
                {store.error && (
                    <div className="alert alert-danger py-2" role="alert">
                        {store.error}
                    </div>
                )}

                <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                        type="text"
                        className={`form-control ${formErrors.full_name ? "is-invalid" : ""}`}
                        placeholder="Full Name"
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                        disabled={store.loading}
                    />
                    {formErrors.full_name && (
                        <div className="invalid-feedback">{formErrors.full_name}</div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
                        placeholder="Enter email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        disabled={store.loading}
                    />
                    {formErrors.email && (
                        <div className="invalid-feedback">{formErrors.email}</div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                        type="tel"
                        className={`form-control ${formErrors.phone ? "is-invalid" : ""}`}
                        placeholder="Enter phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        disabled={store.loading}
                    />
                    {formErrors.phone && (
                        <div className="invalid-feedback">{formErrors.phone}</div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                        type="text"
                        className={`form-control ${formErrors.address ? "is-invalid" : ""}`}
                        placeholder="Enter address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        disabled={store.loading}
                    />
                    {formErrors.address && (
                        <div className="invalid-feedback">{formErrors.address}</div>
                    )}
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={store.loading}
                >
                    {store.loading ? "Saving..." : "Save"}
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
