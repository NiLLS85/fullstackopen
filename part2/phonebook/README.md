# phonebook (ejercicios 2.6 a 2.17)

Agenda telefónica con React que guarda los datos en un servidor de pruebas (json-server).

- Añadir personas con nombre y número, sin nombres repetidos.
- Filtro por nombre que no distingue mayúsculas.
- Componentes separados: `Filter`, `PersonForm`, `Persons` y `Notification`.
- Datos en `db.json`, leídos con axios y `useEffect`. La comunicación con el servidor está en `src/services/persons.js`.
- Borrar con confirmación (`DELETE`) y cambiar el número de una persona que ya existe (`PUT`).
- Avisos de éxito y de error con estilos distintos. Si otra ventana ya ha borrado a la persona, se muestra un error en vez de fallar.

## Cómo arrancarlo

```bash
npm install
npm run server   # json-server en http://localhost:3001/persons
npm run dev      # aplicación en http://localhost:5173
```
