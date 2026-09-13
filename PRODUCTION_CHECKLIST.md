# PropTrust — Production checklist

## Código / plataforma
- [x] Auth y roles base
- [x] Publicación y catálogo
- [x] Marketplace inverso
- [x] CRM y visitas
- [x] Verificación profesional
- [x] Operaciones/reseñas verificables
- [x] Trust Score base
- [x] Property Score v1
- [x] Super Admin base
- [x] SEO/AIO técnico inicial
- [x] Programa Fundadores
- [x] Planes y billing provider-agnostic
- [x] SPA fallback para Cloudflare Pages
- [x] robots.txt protege rutas privadas

## Requiere acción manual del titular antes de producción real
- [ ] Crear o seleccionar proyecto Firebase de producción.
- [ ] Cargar las variables `VITE_FIREBASE_*` en el entorno de deploy.
- [ ] Desplegar `firestore.rules`, `firestore.indexes.json` y `storage.rules` en ese proyecto.
- [ ] Confirmar dominio público definitivo y cargar `VITE_PUBLIC_SITE_URL`.
- [ ] Configurar DNS/hosting y validar HTTPS.
- [ ] Crear/configurar proveedor de cobros SaaS (por ejemplo Lemon Squeezy) y completar KYC/payout.
- [ ] Crear productos/checkout reales y cargar `VITE_CHECKOUT_AGENCY_*_URL`.
- [ ] Si se habilitan splits o cobros transaccionales, crear la app correspondiente de Mercado Pago y completar OAuth/KYC.
- [ ] Definir identidad fiscal que factura PropTrust Marketplace/SaaS.
- [ ] Antes de operar como PropTrust Inmobiliaria: incorporar corredor responsable habilitado y validar estructura contractual/fiscal.

## Antes del lanzamiento público
- [ ] Retirar o mantener claramente etiquetados todos los datos demo.
- [ ] Crear primer usuario SUPER_ADMIN de forma controlada; nunca vía registro público.
- [ ] Probar alta/login/recuperación de acceso.
- [ ] Probar publicación, imágenes, contacto, visita, CRM y marketplace inverso con cuentas reales de prueba.
- [ ] Verificar reglas Firestore/Storage contra lectura/escritura no autorizada.
- [ ] Probar verificación profesional y revisión admin de punta a punta.
- [ ] Probar reseñas vinculadas a operación verificada.
- [ ] Validar metadata, canonical, robots y páginas públicas sobre el dominio real.
- [ ] Configurar analítica y errores antes de adquisición masiva.

## Lanzamiento comercial inicial
- Primeras 50 inmobiliarias/corredores elegibles.
- 0% de comisión de plataforma durante 90 días.
- Sin privilegios de ranking ni de Trust Score para participantes ni para PropTrust Inmobiliaria.
- Separar expresamente fees SaaS/marketplace de honorarios inmobiliarios profesionales.
