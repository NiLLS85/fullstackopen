# bloglist-frontend (ejercicios 5.1 a 5.16)

Interfaz en React para el backend de la parte 4 ([bloglist-backend](../../part4/bloglist-backend)).

- Inicio y cierre de sesión con el token guardado en `localStorage`.
- Formulario para crear blogs dentro de un componente `Togglable` que se oculta al terminar.
- Cada blog muestra u oculta sus detalles, tiene botón de *like* y, solo para quien lo creó, botón para borrarlo (con confirmación).
- Lista ordenada por número de *likes* y avisos de éxito o error durante unos segundos.
- Pruebas de componentes con Vitest y React Testing Library (`Blog.test.jsx` y `BlogForm.test.jsx`).
- ESLint con reglas de estilo propias.

```bash
npm install
npm run dev    # necesita el backend en http://localhost:3003
npm test
npm run lint
```
