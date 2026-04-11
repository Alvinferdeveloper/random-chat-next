# 🚀 ChatHub - Social Interest Discovery

**ChatHub** es una plataforma de red social dinámica diseñada para conectar a personas a través de sus pasiones comunes. A diferencia de las aplicaciones de mensajería tradicionales, ChatHub se centra en el **descubrimiento social impulsado por intereses**, permitiendo a los usuarios encontrar y unirse a salas de chat temáticas donde la interacción es fluida, segura y en tiempo real.

![Status](https://img.shields.io/badge/Status-Development-yellow)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-blue)

---

## ✨ La Idea Central

En un mundo digital saturado, encontrar comunidades con intereses específicos puede ser difícil. **ChatHub** soluciona esto mediante un sistema de salas categorizadas donde el contenido es el rey. Los usuarios no solo chatean; construyen identidades dentro de nichos, gestionan sus propias comunidades y descubren nuevos espacios basados en un algoritmo de relevancia y actividad.

---

## 📸 Interfaz de Usuario (Showcase)

| Salas |
| :---: |
| ![Salas](public/images/doc/rooms.png) |

| Modo Oscuro (Chat) | Modo Claro (Chat) |
| :---: | :---: |
| ![Dark Mode Placeholder](/public/images/doc/dark_room.png) | 
! [Light Mode Placeholder](/public/images/doc/light_room.png) |
| *Inmersión total para largas sesiones nocturnas.* | *Claridad y limpieza para el uso diario.* |

---

## 🛠️ Características Principales

- **Comunicación en Tiempo Real**: Mensajería instantánea propulsada por **Socket.io** con indicadores de presencia y estados de escritura.
- **Gestión Avanzada de Salas**: Los creadores pueden personalizar totalmente sus espacios con banners e iconos únicos.
- **Sistema de Scoring por Actividad**: Implementamos una lógica de **Redis** en el backend que rastrea las interacciones para destacar las salas más vibrantes y relevantes.
- **Social Favoriting**: Guarda tus comunidades preferidas para un acceso rápido y personalizado.
- **Diseño Responsivo y Moderno**: Una interfaz pulida construida con **Next.js**, optimizada para rendimiento y SEO.

---

## 🏗️ Arquitectura y Stack Tecnológico

El proyecto utiliza un stack moderno enfocado en la seguridad, la escalabilidad y la experiencia de usuario (UX):

### 🛡️ Seguridad y Archivos (Presigned URLs)
Para garantizar la máxima seguridad y eficiencia en la carga de recursos (banners e iconos), ChatHub utiliza un flujo de **URLs Pre-firmadas**:
1. El cliente solicita permiso de subida al backend.
2. El backend genera una URL temporal y segura de **Supabase Storage**.
3. El cliente sube el archivo directamente a la nube, reduciendo la carga del servidor y protegiendo las credenciales de almacenamiento.

### ⚡ Rendimiento con Redis
Utilizamos **Redis** como capa de caché y motor de métricas en tiempo real. Esto nos permite:
- Calcular el ranking de las salas más activas sin saturar la base de datos principal.
- Gestionar sesiones y estados de actividad de forma extremadamente rápida.

### 💾 Persistencia y Auth
- **Better Auth**: Gestión de sesiones robusta y segura.
- **Prisma + PostgreSQL**: Modelado de datos relacional para una integridad total de la información de usuarios y salas.

---

## 🚀 Instalación y Desarrollo

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/random-chat-frontend.git
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   Crea un archivo `.env.local` basado en `.env.example`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```

---

## 🧭 Roadmap
- [ ] Implementación de videollamadas grupales.
- [ ] Sistema de roles y moderación avanzada dentro de las salas.
- [ ] Aplicación móvil nativa mediante PWA o React Native.

Desarrollado con ❤️ por el equipo de **ChatHub**.

---

### Notas para el desarrollador:
*Este README se enfoca en la capa de cliente. Para detalles sobre la lógica del servidor, API endpoints y esquemas de base de datos, por favor consulta el README en `/random_chat_backend`.*
