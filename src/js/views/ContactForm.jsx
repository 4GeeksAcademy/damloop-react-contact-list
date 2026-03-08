import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import {
    addContact,
    clearErrorAction,
    createEmptyContact,
    getContactById,
    loadContacts,
    updateContact,
    validateContactData,
} from "../store.js";

const FORM_FIELDS = [
    {
        name: "name",
        label: "Full Name",
        type: "text",
        placeholder: "Enter full name",
    },
    {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "Enter email",
    },
    {
        name: "phone",
        label: "Phone",
        type: "tel",
        placeholder: "Enter phone number",
    },
    {
        name: "address",
        label: "Address",
        type: "text",
        placeholder: "Enter address",
    },
];

const ContactForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const contactId = id ? Number(id) : null;
    const isEditMode = id !== undefined;
    const hasInvalidId = isEditMode && !Number.isInteger(contactId);

    const { store, dispatch } = useGlobalReducer();
    const {
        contacts,
        error,
        hasLoadedContacts,
        isLoadingContacts,
        isSavingContact,
    } = store;

    const [formData, setFormData] = useState(createEmptyContact);
    const [errors, setErrors] = useState({});

    const selectedContact =
        isEditMode && !hasInvalidId ? getContactById(contacts, contactId) : null;

    useEffect(() => {
        if (isEditMode || hasInvalidId) {
            return;
        }

        setFormData(createEmptyContact());
        setErrors({});
    }, [hasInvalidId, isEditMode]);

    useEffect(() => {
        if (!isEditMode || hasInvalidId || hasLoadedContacts || isLoadingContacts) {
            return;
        }

        void loadContacts(dispatch);
    }, [
        dispatch,
        hasInvalidId,
        hasLoadedContacts,
        isEditMode,
        isLoadingContacts,
    ]);

    useEffect(() => {
        if (!isEditMode || !selectedContact) {
            return;
        }

        setFormData({
            name: selectedContact.name,
            email: selectedContact.email,
            phone: selectedContact.phone,
            address: selectedContact.address,
        });
    }, [isEditMode, selectedContact]);

    const handleChange = ({ target }) => {
        const { name, value } = target;

        setFormData((currentFormData) => ({
            ...currentFormData,
            [name]: value,
        }));

        setErrors((currentErrors) => {
            if (!currentErrors[name]) {
                return currentErrors;
            }

            return {
                ...currentErrors,
                [name]: null,
            };
        });

        if (error) {
            dispatch(clearErrorAction());
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationErrors = validateContactData(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        const didSave = isEditMode
            ? await updateContact(dispatch, contactId, formData)
            : await addContact(dispatch, formData);

        if (didSave) {
            navigate("/");
        }
    };

    if (hasInvalidId) {
        return (
            <section className="contact-feedback-card text-center">
                <h1 className="h4 mb-2">Invalid contact id</h1>
                <p className="text-muted mb-4">
                    This route does not point to a valid contact.
                </p>
                <Link to="/" className="btn btn-primary">
                    Back to contacts
                </Link>
            </section>
        );
    }

    if (isEditMode && !hasLoadedContacts) {
        return (
            <section className="contact-feedback-card text-center">
                {isLoadingContacts ? (
                    <>
                        <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Loading contact...</span>
                        </div>
                        <h1 className="h4">Loading contact...</h1>
                        <p className="text-muted mb-0">
                            Fetching the current values before opening edit mode.
                        </p>
                    </>
                ) : (
                    <>
                        <h1 className="h4">Unable to load the contact yet</h1>
                        <p className="text-muted mb-4">
                            Reload the agenda before editing this contact.
                        </p>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                void loadContacts(dispatch);
                            }}
                        >
                            Retry loading contacts
                        </button>
                    </>
                )}
            </section>
        );
    }

    if (isEditMode && hasLoadedContacts && !selectedContact) {
        return (
            <section className="contact-feedback-card text-center">
                <h1 className="h4 mb-2">Contact not found</h1>
                <p className="text-muted mb-4">
                    The selected contact is no longer available in this agenda.
                </p>
                <Link to="/" className="btn btn-primary">
                    Back to contacts
                </Link>
            </section>
        );
    }

    return (
        <section className="contact-form-page">
            <div className="add-contact-wrapper">
                <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
                    <div>
                        <p className="text-uppercase text-muted small mb-2">
                            {isEditMode ? "Edit flow" : "Create flow"}
                        </p>
                        <h1 className="h3 mb-1">
                            {isEditMode ? "Edit contact" : "Add a new contact"}
                        </h1>
                        <p className="text-muted mb-0">
                            All changes are synced with the official contacts API.
                        </p>
                    </div>
                    <Link to="/" className="btn btn-outline-secondary btn-sm">
                        Back
                    </Link>
                </div>

                {error ? (
                    <div className="alert alert-danger mb-4" role="alert">
                        {error}
                    </div>
                ) : null}

                <form className="add-contact-form" noValidate onSubmit={handleSubmit}>
                    {FORM_FIELDS.map((field) => (
                        <div key={field.name} className="mb-3">
                            <label htmlFor={field.name} className="form-label">
                                {field.label}
                            </label>
                            <input
                                type={field.type}
                                className={`form-control ${errors[field.name] ? "is-invalid" : ""}`}
                                id={field.name}
                                placeholder={field.placeholder}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                            />
                            {errors[field.name] ? (
                                <div className="invalid-feedback">{errors[field.name]}</div>
                            ) : null}
                        </div>
                    ))}

                    <div className="contact-form-actions mt-4">
                        <Link to="/" className="btn btn-light">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSavingContact}
                        >
                            {isSavingContact
                                ? "Saving..."
                                : isEditMode
                                    ? "Save changes"
                                    : "Save contact"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default ContactForm;
