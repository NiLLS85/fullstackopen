# bloglist-frontend (ejercicios 5.1 a 5.16 y 5.24 a 5.31)

Interfaz en React para el backend de la parte 4 ([bloglist-backend](../../part4/bloglist-backend)).

- Navegación con React Router: lista en `/`, cada blog en `/blogs/:id`, formulario en `/create` (solo con sesión iniciada; si no, lleva a `/login`) y una página "page not found" para el resto de rutas.
- Barra de navegación con los enlaces *blogs*, *new blog* y *login*, y el nombre de la persona con sesión iniciada junto al botón *logout*.
- Vista de cada blog con autor, enlace, *likes* y quién lo añadió. El botón de *like* solo sale con sesión iniciada y el de borrar solo a quien lo creó (con confirmación).
- Lista ordenada por número de *likes* y avisos de éxito o error durante unos segundos.
- Estilos con Material UI: `AppBar`, `Table`, `Card`, `TextField` y `Alert`.
- Pruebas de componentes con Vitest y React Testing Library (`BlogView.test.jsx` y `BlogForm.test.jsx`).
- ESLint con reglas de estilo propias.

```bash
npm install
npm run dev    # necesita el backend en http://localhost:3003
npm test
npm run lint
```
