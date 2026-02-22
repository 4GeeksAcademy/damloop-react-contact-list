import React, { useState, useEffect } from "react";

export const Context = React.createContext(null);

const getState = ({ getStore, getActions, setStore }) => {
    const API_BASE = "https://playground.4geeks.com/contact";
    const AGENDA_SLUG = "damloop_agenda";

    return {
        store: {
            contacts: [],
            loading: false,
            error: null,
            currentContact: null
        },

        actions: {
            // --------------------------------------------------
            // CARGAR CONTACTOS
            // --------------------------------------------------
            loadContacts: async () => {
                setStore({ loading: true, error: null });

                try {
                    // Crear agenda si no existe
                    await fetch(`${API_BASE}/agendas/${AGENDA_SLUG}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" }
                    }).catch(() => {});

                    // Obtener contactos
                    const resp = await fetch(`${API_BASE}/agendas/${AGENDA_SLUG}`);
                    const data = await resp.json();

                    if (!resp.ok) {
                        throw new Error(data.msg || "Error cargando contactos");
                    }

                    setStore({
                        contacts: data.contacts || [],
                        loading: false
                    });
                } catch (err) {
                    setStore({ error: err.message, loading: false });
                }
            },

            // --------------------------------------------------
            // CREAR CONTACTO
            // --------------------------------------------------
            addContact: async (contact, navigate) => {
                const { loadContacts } = getActions();

                const body = {
                    name: contact.full_name,
                    email: contact.email,
                    phone: contact.phone,
                    address: contact.address,
                    agenda_slug: AGENDA_SLUG
                };

                try {
                    const resp = await fetch(
                        `${API_BASE}/agendas/${AGENDA_SLUG}/contacts`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(body)
                        }
                    );

                    const data = await resp.json();
                    if (!resp.ok) {
                        throw new Error(data.msg || "Error creando contacto");
                    }

                    await loadContacts();
                    navigate("/");
                } catch (err) {
                    alert(err.message);
                }
            },

            // --------------------------------------------------
            // ACTUALIZAR CONTACTO
            // --------------------------------------------------
            updateContact: async (id, contact, navigate) => {
                const { loadContacts } = getActions();

                const body = {
                    name: contact.full_name,
                    email: contact.email,
                    phone: contact.phone,
                    address: contact.address,
                    agenda_slug: AGENDA_SLUG
                };

                try {
                    const resp = await fetch(`${API_BASE}/contacts/${id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body)
                    });

                    const data = await resp.json();
                    if (!resp.ok) {
                        throw new Error(data.msg || "Error actualizando contacto");
                    }

                    await loadContacts();
                    navigate("/");
                } catch (err) {
                    alert(err.message);
                }
            },

            // --------------------------------------------------
            // ELIMINAR CONTACTO (CORREGIDO)
            // --------------------------------------------------
            deleteContact: async (id) => {
                const { loadContacts } = getActions();

                try {
                    const resp = await fetch(
                        `${API_BASE}/agendas/${AGENDA_SLUG}/contacts/${id}`,
                        { method: "DELETE" }
                    );

                    if (!resp.ok) {
                        const text = await resp.text();
                        throw new Error(text || "Error eliminando contacto");
                    }

                    await loadContacts();
                } catch (err) {
                    alert(err.message);
                }
            },

            // --------------------------------------------------
            // CONTACTO ACTUAL PARA EDITAR
            // --------------------------------------------------
            setCurrentContact: (contact) => {
                setStore({ currentContact: contact });
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
