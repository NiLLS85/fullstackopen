# countries (ejercicios 2.18 a 2.20)

Buscador de países con los datos de <https://studies.cs.helsinki.fi/restcountries/>.

- Con más de 10 coincidencias pide afinar la búsqueda; con 2 a 10 muestra la lista con un botón `show`; con una sola muestra la ficha del país (capital, superficie, idiomas y bandera).
- Si el nombre escrito coincide exactamente con un país (por ejemplo, *Sudan*), se muestra ese país aunque haya otros que lo contengan.
- La ficha incluye el tiempo actual en la capital con [Open-Meteo](https://open-meteo.com/), que no necesita clave de API, así que no hay ninguna clave que guardar en el repositorio.

```bash
npm install
npm run dev
```
