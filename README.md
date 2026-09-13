# PropTrust

Marketplace PropTech AI-first para Argentina, comenzando por CABA.

## Estado actual

Implementado en la rama `feat/mvp-core`:
- React + TypeScript + Vite.
- Routing principal.
- Firebase bootstrap con fallback demo si faltan credenciales.
- Login por email/password y Google listo para Firebase Auth.
- Bootstrap de perfil de usuario en Firestore.
- Roles base: BUYER, OWNER, AGENT, AGENCY, ADMIN y SUPER_ADMIN.
- Dashboard inicial.
- Formulario de publicación de propiedades.
- Persistencia real en Firestore cuando Firebase está configurado.
- Marketplace inverso preparado en el modelo de datos.
- Reglas de Firestore y Storage con denegación por defecto.
- Índices iniciales de Firestore.
- Datos demo claramente identificados.

## Stack
- React
- TypeScript
- Vite
- Firebase Auth
- Cloud Firestore
- Firebase Storage
- Firebase Hosting compatible

## Desarrollo local

```bash
npm install
cp .env.example .env
npm run dev
```

Configurar en `.env`:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Build

```bash
npm run build
```

## Flujo MVP objetivo

1. Usuario se registra o inicia sesión.
2. Se crea su perfil en Firestore.
3. El propietario publica una propiedad.
4. La publicación queda en `properties`.
5. Los profesionales habilitados podrán enviar propuestas de captación.
6. El propietario compara propuestas y reputación.
7. Los leads pasan al CRM.

## Próximos bloques

1. Registro completo con elección de rol y onboarding.
2. Upload y ordenamiento de fotos.
3. Listado real de propiedades desde Firestore.
4. Filtros y búsqueda.
5. Perfil profesional y matrícula.
6. Propuestas de inmobiliarias/corredores.
7. CRM de leads y agenda de visitas.
8. Trust Score y Property Score basados en señales objetivas.
9. Gemini para redacción, clasificación y detección de anomalías.
10. SEO dinámico, sitemap y páginas por ubicación.

> Ninguna propiedad, verificación, operación o score de la demo representa información real.
