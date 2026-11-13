# Multicentro Los Pits — tienda online

Base inicial de una tienda pública en español para lubricantes, baterías, filtros y accesorios automotrices. Identidad visual inspirada en la referencia proporcionada: negro, blanco y rojo; no incluye ni reutiliza el archivo de logo original.

## Ejecutar localmente

No requiere dependencias. Abre `index.html` en un navegador o sirve la carpeta con cualquier servidor estático, por ejemplo:

```bash
python3 -m http.server 8000
```

Luego visita `http://localhost:8000`.

## Incluye

- Página pública responsive con marca Multicentro Los Pits.
- Catálogo de demostración con filtros por categoría, búsqueda y orden por precio.
- Carrito interactivo con cantidades y control de stock de demostración.
- CTA de asesoría y estado inicial de checkout.

## Antes de vender en producción

Los productos y el inventario actuales viven en `app.js` y solo son datos de demostración del navegador. No hay persistencia, panel administrativo, cálculo de envíos ni backend. Para producción, se necesita una API y base de datos que gestionen productos, inventario, pedidos y clientes; el stock debe validarse en el servidor.

Stripe aún no procesa pagos. La integración debe crear una sesión de Checkout desde un backend seguro, mantener claves secretas en variables de entorno del servidor y verificar los webhooks antes de confirmar pedidos. Nunca publiques claves secretas en el frontend.

Reemplaza precios, productos, disponibilidad, correo de contacto y textos de ejemplo por los datos reales del negocio. La moneda de demostración está configurada como USD.
