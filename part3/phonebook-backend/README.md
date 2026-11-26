# phonebook-backend (ejercicios 3.1 a 3.22)

Backend de la agenda telefónica con Node.js, Express y MongoDB (Mongoose). Sirve también el frontend compilado desde `dist`.

**Versión publicada:** <https://phonebook-fso-t3uq.onrender.com> (API en [/api/persons](https://phonebook-fso-t3uq.onrender.com/api/persons) e [/info](https://phonebook-fso-t3uq.onrender.com/info)). Está en el plan gratis de Render con la base de datos en MongoDB Atlas, así que la primera visita tras un rato sin uso puede tardar unos 50 segundos en despertar.

## API

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/persons` | Lista todas las personas |
| GET | `/api/persons/:id` | Una persona (404 si no existe, 400 si el id no es válido) |
| POST | `/api/persons` | Añade una persona (400 si falta el nombre o el número, o no pasan la validación) |
| PUT | `/api/persons/:id` | Cambia el número de una persona |
| DELETE | `/api/persons/:id` | Borra una persona |
| GET | `/info` | Número de personas y fecha de la petición |

Validación en el modelo (`models/person.js`): nombre de al menos 3 letras y número de al menos 8 caracteres con la forma `09-1234556` o `040-22334455`. Los errores pasan por un middleware propio (`errorHandler`) y el registro de peticiones usa morgan, mostrando el cuerpo de los POST.

## Cómo arrancarlo

```bash
cp .env.example .env     # y pon tu MONGODB_URI de MongoDB Atlas
npm install
npm run dev              # servidor en http://localhost:3001, se reinicia al guardar
npm run build:ui         # compila ../phonebook-frontend y lo copia a dist
npm run lint
```

`mongo.js` es el programa de línea de órdenes del ejercicio 3.12:

```bash
node mongo.js <contraseña>                      # lista la agenda
node mongo.js <contraseña> "Ada Lovelace" 040-1234567   # añade una persona
```

`requests.rest` tiene peticiones de prueba para la extensión REST Client de VS Code.
