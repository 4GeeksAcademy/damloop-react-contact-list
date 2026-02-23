import React, { useState, useEffect } from "react";

export const Context = React.createContext(null);

const getState = ({ getStore, getActions, setStore }) => {
    const API_BASE = "https://playground.4geeks.com/contact";
    const AGENDA_SLUG = "damloop_agenda";
    const CONTACT_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const normalizeApiContact = (contact) => ({
        ...contact,
        full_name: contact?.full_name || contact?.name || "",
        email: contact?.email || "",
        phone: contact?.phone || "",
        address: contact?.address || ""
    });

    const getApiErrorMessage = async (response, fallbackMessage) => {
        try {
            const contentType = response.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
                const payload = await response.json();
                if (payload?.msg) return payload.msg;
                if (payload?.message) return payload.message;
            } else {
                const textPayload = await response.text();
                if (textPayload) return textPayload;
            }
        } catch {
            // Si falla el parseo, devolvemos mensaje por defecto
        }

        return fallbackMessage;
    };

    const buildContactPayload = (contact) => ({
        name: (contact?.full_name || "").trim(),
        email: (contact?.email || "").trim(),
        phone: (contact?.phone || "").trim(),
        address: (contact?.address || "").trim(),
        agenda_slug: AGENDA_SLUG
    });

    return {
        store: {
            contacts: [],
            loading: false,
            error: null,
            currentContact: null
        },

        actions: {
            clearError: () => setStore({ error: null }),

            ensureAgendaExists: async () => {
                const response = await fetch(`${API_BASE}/agendas/${AGENDA_SLUG}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                });

                // Esta API responde error si la agenda ya existe; eso no es fallo funcional.
                if (!response.ok && ![400, 409].includes(response.status)) {
                    const message = await getApiErrorMessage(
                        response,
                        "Error verificando la agenda"
                    );
                    throw new Error(message);
                }
            },

            loadContacts: async () => {
                setStore({ loading: true, error: null });

                try {
                    await getActions().ensureAgendaExists();

                    const response = await fetch(`${API_BASE}/agendas/${AGENDA_SLUG}`);

                    if (!response.ok) {
                        const message = await getApiErrorMessage(
                            response,
                            "Error cargando contactos"
                        );
                        throw new Error(message);
                    }

                    const data = await response.json();
                    const normalizedContacts = Array.isArray(data.contacts)
                        ? data.contacts.map(normalizeApiContact)
                        : [];

                    setStore({
                        contacts: normalizedContacts,
                        loading: false
                    });
                    return true;
                } catch (err) {
                    setStore({ error: err.message, loading: false });
                    return false;
                }
            },

            addContact: async (contact) => {
                const { loadContacts } = getActions();

                const body = buildContactPayload(contact);

                if (!body.name || !body.email || !body.phone || !body.address) {
                    setStore({
                        loading: false,
                        error: "Please fill in all fields before saving."
                    });
                    return false;
                }

                if (!CONTACT_EMAIL_REGEX.test(body.email)) {
                    setStore({
                        loading: false,
                        error: "Please enter a valid email address."
                    });
                    return false;
                }

                setStore({ loading: true, error: null });

                try {
                    const response = await fetch(
                        `${API_BASE}/agendas/${AGENDA_SLUG}/contacts`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(body)
                        }
                    );

                    if (!response.ok) {
                        const message = await getApiErrorMessage(
                            response,
                            "Error creando contacto"
                        );
                        throw new Error(message);
                    }

                    return await loadContacts();
                } catch (err) {
                    setStore({ error: err.message, loading: false });
                    return false;
                }
            },

            updateContact: async (id, contact) => {
                const { loadContacts } = getActions();

                const body = buildContactPayload(contact);

                if (!body.name || !body.email || !body.phone || !body.address) {
                    setStore({
                        loading: false,
                        error: "Please fill in all fields before saving."
                    });
                    return false;
                }

                if (!CONTACT_EMAIL_REGEX.test(body.email)) {
                    setStore({
                        loading: false,
                        error: "Please enter a valid email address."
                    });
                    return false;
                }

                setStore({ loading: true, error: null });

                try {
                    const response = await fetch(`${API_BASE}/contacts/${id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body)
                    });

                    if (!response.ok) {
                        const message = await getApiErrorMessage(
                            response,
                            "Error actualizando contacto"
                        );
                        throw new Error(message);
                    }

                    return await loadContacts();
                } catch (err) {
                    setStore({ error: err.message, loading: false });
                    return false;
                }
            },

            deleteContact: async (id) => {
                const { loadContacts } = getActions();

                setStore({ loading: true, error: null });

                try {
                    const response = await fetch(
                        `${API_BASE}/agendas/${AGENDA_SLUG}/contacts/${id}`,
                        { method: "DELETE" }
                    );

                    if (!response.ok) {
                        const message = await getApiErrorMessage(
                            response,
                            "Error eliminando contacto"
                        );
                        throw new Error(message);
                    }

                    return await loadContacts();
                } catch (err) {
                    setStore({ error: err.message, loading: false });
                    return false;
                }
            },

            setCurrentContact: (contact) => {
                setStore({ currentContact: normalizeApiContact(contact) });
            },

            clearCurrentContact: () => {
                setStore({ currentContact: null });
            }
        }
    };
};

// --------------------------------------------------
// INJECT CONTEXT
// --------------------------------------------------
const injectContext = (PassedComponent) => {
    const StoreWrapper = (props) => {
        const [state, setState] = useState(
            getState({
                getStore: () => state.store,
                getActions: () => state.actions,
                setStore: (updatedStore) =>
                    setState({
                        store: { ...state.store, ...updatedStore },
                        actions: { ...state.actions }
                    })
            })
        );

        useEffect(() => {
            state.actions.loadContacts();
        }, []);

        return (
            <Context.Provider value={state}>
                <PassedComponent {...props} />
            </Context.Provider>
        );
    };

    return StoreWrapper;
};

export default injectContext;
