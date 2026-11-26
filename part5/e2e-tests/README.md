# e2e-tests (ejercicios 5.17 a 5.23 y 5.28)

Pruebas de extremo a extremo con Playwright para la lista de blogs con rutas: página principal, formulario de inicio de sesión en `/login`, rutas desconocidas, login correcto y fallido, crear un blog, darle *like*, borrarlo, que solo su creador vea el botón de borrar y que la lista salga ordenada por *likes*.

Antes de cada prueba se vacía la base de datos con `POST /api/testing/reset`, una ruta que el backend solo monta con `NODE_ENV=test`.

```bash
# 1. backend en modo prueba (part4/bloglist-backend)
npm run start:test
# 2. frontend (part5/bloglist-frontend)
npm run dev
# 3. pruebas (esta carpeta)
npm install
npx playwright install chromium
npm test
```
