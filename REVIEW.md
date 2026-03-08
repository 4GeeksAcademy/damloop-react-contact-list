## 📝 Revisión del proyecto Contact List App Using React & Context

### ✅ Aspectos Positivos

1. **CRUD real conectado a la API**: El proyecto sí consume la API oficial de contactos y resuelve las cuatro operaciones principales (`read`, `create`, `update`, `delete`) con persistencia real.

2. **Buena intención de separación visual**: La UI está partida en varias piezas (`Contact`, `AddContact`, `ContactCard`, `Navbar`, `Footer`), lo que hace el proyecto más entendible que una sola vista gigante.

3. **Estilo visual con personalidad**: La estética cartoon tiene identidad propia, y el modal de borrado aporta una capa de confirmación útil para evitar eliminaciones accidentales.

### 🔍 Áreas de Mejora

#### 1. La arquitectura global no seguía el patrón pedido por la rúbrica

La funcionalidad estaba bien encaminada, pero el proyecto montaba un contexto alternativo en `src/js/store/appContext.jsx` en vez de usar el patrón obligatorio `src/js/store.js` + `src/js/hooks/useGlobalReducer.jsx`.

**Código actual:**

```jsx
export const Context = React.createContext(null);

const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            contacts: [],
            loading: false,
            error: null,
            currentContact: null
        },
        actions: {
            loadContacts: async () => { /* fetch */ },
            addContact: async () => { /* fetch */ },
            updateContact: async () => { /* fetch */ }
        }
    };
};

const injectContext = (PassedComponent) => {
    // provider + lógica + estado en el mismo archivo
};
```

**Código mejorado:**

```jsx
// src/js/store.js
export const loadContacts = async (dispatch) => {
    dispatch(setContactsLoadingAction());
    try {
        await syncContacts(dispatch);
        return true;
    } catch (error) {
        dispatch(requestFailureAction("Unable to load contacts."));
        return false;
    }
};

export default function storeReducer(store, action = {}) {
    switch (action.type) {
        case ACTION_TYPES.loadContactsSuccess:
            return {
                ...store,
                contacts: action.payload,
                isLoadingContacts: false,
                isSavingContact: false,
                hasLoadedContacts: true,
                error: null,
            };
        default:
            throw new Error("Unknown action.");
    }
}

// src/js/hooks/useGlobalReducer.jsx
export function StoreProvider({ children }) {
    const [store, dispatch] = useReducer(storeReducer, initialStore());
    return (
        <StoreContext.Provider value={{ store, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
}
```

**¿Por qué es mejor?**

- Se alinea exactamente con la solución de referencia y con la rúbrica del ejercicio.
- Separa la lógica de negocio (`store.js`) del provider/hook compartido (`useGlobalReducer.jsx`).
- Hace más fácil reutilizar acciones, probar el reducer y localizar bugs.

#### 2. La validación del formulario era demasiado básica y dependía de `alert`

El formulario era controlado, lo cual está bien, pero la validación solo comprobaba campos vacíos y mostraba errores mediante `alert`, sin feedback visible dentro del propio formulario. Tampoco validaba el formato del email.

**Código actual:**

```jsx
if (!form.full_name || !form.email || !form.phone || !form.address) {
    alert("Please fill all fields");
    return;
}
```

**Código mejorado:**

```jsx
const validationErrors = validateContactData(formData);
setErrors(validationErrors);

if (Object.keys(validationErrors).length > 0) {
    return;
}

<input
    className={`form-control ${errors[field.name] ? "is-invalid" : ""}`}
    name={field.name}
    value={formData[field.name]}
    onChange={handleChange}
/>
{errors[field.name] ? (
    <div className="invalid-feedback">{errors[field.name]}</div>
) : null}
```

**¿Por qué es mejor?**

- El usuario ve el error justo donde ocurre, sin depender de ventanas emergentes.
- Se valida también el email, que es un requisito mínimo razonable para este formulario.
- El flujo de edición y creación queda más claro y profesional.

#### 3. Las acciones dependían de iconos no cargados y la configuración de lint no estaba operativa

Los botones de editar y borrar usaban clases de Font Awesome sin cargar la librería. Además, el proyecto tenía `eslint.cjs`, por lo que `npm run lint` no encontraba configuración.

**Código actual:**

```jsx
<button className="btn btn-outline-primary btn-sm">
    <i className="fas fa-pencil-alt"></i>
</button>

<button className="btn btn-outline-danger btn-sm">
    <i className="fas fa-trash"></i>
</button>
```

**Código mejorado:**

```jsx
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
    disabled={isBusy}
>
    Delete
</button>
```

**¿Por qué es mejor?**

- El botón sigue siendo entendible aunque no cargue ningún asset externo.
- La semántica mejora porque cada acción es más explícita.
- `npm run lint` vuelve a ser usable al renombrar la configuración a `.eslintrc.cjs`.

### 🎯 Patrones y Anti-patrones Identificados

### Patrones Positivos Encontrados ✅

#### 1. CRUD persistido contra API oficial

**Tipo:** Patrón ✅

**Descripción:** El proyecto no se queda en memoria local; consulta y modifica datos persistidos en la API oficial.

**Dónde aparece:**
- Archivo: `src/js/store/appContext.jsx`

**¿Por qué es importante?**

- Demuestra comprensión del objetivo real del proyecto.
- Evita una solución "falsa" que solo funciona mientras la página sigue abierta.
- Es la base correcta para un proyecto de React con datos remotos.

#### 2. Componente separado para cada contacto

**Tipo:** Patrón ✅

**Descripción:** Cada tarjeta de contacto vive en `ContactCard`, en lugar de renderizar todo el markup dentro de la vista principal.

**Dónde aparece:**
- Archivo: `src/components/ContactCard.jsx`

**¿Por qué es importante?**

- Mejora la legibilidad.
- Facilita reutilización y mantenimiento.
- Hace más simple aplicar cambios de UI sin tocar la pantalla completa.

### Anti-patrones a Mejorar ❌

#### 1. Contexto paralelo que ignora el store esperado por el ejercicio

**Tipo:** Anti-patrón ❌

**Descripción:** La app inventaba un `appContext.jsx` con estado, acciones async y provider propios, en vez de respetar la estructura del template académico.

**Dónde aparece:**
- Archivo: `src/js/store/appContext.jsx`

**Alternativa:**

```jsx
// store.js -> reducer, acciones y helpers
// hooks/useGlobalReducer.jsx -> provider y hook compartido
```

**Conceptos relacionados:**

- Context API
- useReducer
- Separación de responsabilidades

#### 2. Validación con `alert` en lugar de feedback inline

**Tipo:** Anti-patrón ❌

**Descripción:** La validación existía, pero sacaba al usuario del flujo con `alert` y no mostraba qué campo estaba fallando.

**Dónde aparece:**
- Archivo: `src/js/pages/AddContact.jsx`

**Alternativa:**

```jsx
const validationErrors = validateContactData(formData);
setErrors(validationErrors);
```

**Conceptos relacionados:**

- Formularios controlados
- UX de validación
- Feedback contextual

## 📊 Evaluación Detallada

### Criterios de Evaluación (Total: 83/100)

| Criterio | Puntos | Obtenido | Comentario |
|----------|--------|----------|------------|
| **Funcionalidad Básica** | 30 | 30 | El CRUD estaba conectado a la API oficial y las operaciones principales funcionaban. |
| **Código Limpio** | 20 | 16 | El código era legible, pero había duplicación de payloads, dependencias visuales no cargadas y el lint no estaba operativo. |
| **Estructura** | 15 | 8 | Existían vistas y `ContactCard`, pero la arquitectura global ignoraba el patrón obligatorio `store.js` + `useGlobalReducer.jsx`. |
| **Buenas Prácticas** | 15 | 11 | Buen uso general de React Router y formulario controlado, pero faltaba validación visible y mejor manejo del feedback asíncrono. |
| **HTML/CSS** | 10 | 9 | La maquetación era clara y con personalidad; solo faltaban pequeños ajustes de consistencia y assets. |
| **UX/Animaciones** | 10 | 9 | La experiencia era agradable y el modal suma, pero el flujo de errores/guardado podía ser más claro. |
| **TOTAL** | **100** | **83** | **⚠️ Necesita mejora** |

### Desglose de Puntos Perdidos (-17 puntos)

1. **-6 puntos** - El proyecto ignoraba el patrón de store exigido por la solución y movía toda la lógica global a `src/js/store/appContext.jsx`.
2. **-3 puntos** - `npm run lint` no era usable porque la configuración estaba en `eslint.cjs` en vez de `.eslintrc.cjs`.
3. **-2 puntos** - La validación del formulario no comprobaba el formato del email.
4. **-2 puntos** - Los errores de guardado/edición se mostraban con `alert`, sin feedback inline dentro de la UI.
5. **-2 puntos** - Había duplicación en la construcción del payload para crear y editar contactos.
6. **-2 puntos** - Los botones dependían de iconos de Font Awesome que no estaban cargados.

### Cómo Llegar a 100/100

Aplicando las correcciones de este PR:

- ✅ +7 puntos - Reorganizar el proyecto al patrón correcto con `src/js/store.js` y `src/js/hooks/useGlobalReducer.jsx`.
- ✅ +4 puntos - Añadir validación reutilizable con feedback inline y validación de email.
- ✅ +3 puntos - Recuperar una herramienta de calidad real arreglando la configuración de ESLint.
- ✅ +3 puntos - Hacer más robusta la UI con acciones explícitas, estados de carga/guardado y mejor semántica.

**= 100/100** 🎉

### 📊 Resumen

| Aspecto | Estado |
|---------|--------|
| CRUD con API | ✅ Muy bien |
| `ContactCard` separado | ✅ Muy bien |
| Arquitectura del store | ⚠️ Debía alinearse con la solución |
| Validación del formulario | ⚠️ Mejorable |
| Calidad de tooling | ⚠️ Lint roto al inicio |

**Nota final**: El proyecto estaba funcional y con una estética personal clara, pero la rúbrica de este ejercicio exigía respetar la arquitectura global del template. Con este PR ya queda alineado con la solución oficial y además mejora la validación, la semántica y la mantenibilidad. Buen trabajo en la base funcional; aquí el salto importante era estructural. 🎉
