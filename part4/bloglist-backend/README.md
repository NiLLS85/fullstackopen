# bloglist-backend (ejercicios 4.1 a 4.23)

API de una lista de blogs con Node.js, Express 5, MongoDB y autenticación con tokens JWT.

## Estructura

- `app.js` monta la aplicación; `index.js` solo la arranca.
- `controllers/`: rutas de blogs, usuarios y login.
- `models/`: esquemas de Mongoose de `Blog` y `User`, relacionados con `populate`.
- `utils/`: configuración, registro, middleware (`tokenExtractor`, `userExtractor`, manejo de errores) y funciones auxiliares (`list_helper.js`).
- `tests/`: pruebas con `node:test` y SuperTest.

## API

| Método | Ruta | Token | Qué hace |
|---|---|---|---|
| GET | `/api/blogs` | No | Lista los blogs con su creador |
| POST | `/api/blogs` | Sí | Añade un blog (400 sin `title` o `url`; `likes` vale 0 si falta) |
| PUT | `/api/blogs/:id` | No | Cambia los datos de un blog, normalmente los likes |
| DELETE | `/api/blogs/:id` | Sí | Borra un blog; solo puede hacerlo quien lo creó (403 si no) |
| GET | `/api/users` | No | Lista los usuarios con sus blogs, sin el hash de la contraseña |
| POST | `/api/users` | No | Crea un usuario (usuario único y usuario y contraseña de al menos 3 caracteres) |
| POST | `/api/login` | No | Devuelve un token que caduca a la hora |

Las contraseñas se guardan cifradas con bcrypt.

## Pruebas

41 pruebas: funciones auxiliares (`dummy`, `totalLikes`, `favoriteBlog`, `mostBlogs`, `mostLikes`) y pruebas de la API para blogs, usuarios y login. Usan una base de datos aparte (`TEST_MONGODB_URI`) y se ejecutan de una en una.

```bash
cp .env.example .env   # y rellena los valores
npm install
npm test
npm run dev            # servidor en http://localhost:3003
```
