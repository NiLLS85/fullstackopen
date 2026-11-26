# phonebook-frontend (parte 3)

La agenda de la parte 2 adaptada al backend propio de [phonebook-backend](../phonebook-backend):

- Las peticiones van a `/api/persons` (rutas relativas). En desarrollo, Vite las reenvía a `http://localhost:3001`.
- Muestra los errores de validación que devuelve el servidor (nombre de menos de 3 letras o número con formato incorrecto).
- La versión compilada (`dist`) se copia al backend con `npm run build:ui` desde la carpeta del backend.

```bash
npm install
npm run dev
```
