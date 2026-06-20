# ChatHub Frontend — Contexto para Agentes de Código

## 🗂 Descripción General

**ChatHub Frontend** es la interfaz de usuario de la plataforma **ChatHub**, una aplicación de chat en tiempo real con salas temáticas. Está construida con **Next.js 16 (App Router)** y se comunica con el backend vía REST API y WebSockets (Socket.IO).

El nombre de la app en la UI es **ChatHub**. El proyecto en disco se llama `random_chat`.

---

## 🏗 Arquitectura General

```
random_chat/
├── src/
│   ├── app/                     # Next.js App Router (rutas de la aplicación)
│   │   ├── layout.tsx           # Root layout: providers, fonts, metadata SEO
│   │   ├── globals.css          # Variables CSS globales, temas y estilos base
│   │   ├── constants.ts         # Constantes de la app
│   │   ├── proxy.ts             # Middleware de Next.js: autenticación y redirecciones
│   │   │
│   │   ├── (main)/              # Route group: landing page con layout propio
│   │   │   ├── layout.tsx       # Layout con navbar
│   │   │   ├── page.tsx         # Home / Landing page
│   │   │   └── components/      # Componentes exclusivos de la landing
│   │   │       ├── HeroSection.tsx
│   │   │       ├── FeaturesSection.tsx
│   │   │       ├── CtaSection.tsx
│   │   │       ├── AnimatedBackground.tsx
│   │   │       ├── ScrollConnector.tsx
│   │   │       └── Reveal.tsx
│   │   │
│   │   ├── login/               # Página de inicio de sesión
│   │   ├── signup/              # Página de registro
│   │   ├── verify-email/        # Verificación de email
│   │   ├── profile/             # Perfil del usuario (propio y público por username)
│   │   ├── welcome/             # Pantalla de bienvenida post-registro
│   │   ├── admin/               # Panel de administración
│   │   │
│   │   ├── rooms/               # Explorador de salas
│   │   │   ├── page.tsx         # Listado paginado con búsqueda y live user counts
│   │   │   ├── create/          # Formulario crear sala
│   │   │   ├── my-rooms/        # Salas del usuario autenticado
│   │   │   ├── favorites/       # Salas favoritas
│   │   │   ├── components/      # RoomCard, RoomSkeleton, etc.
│   │   │   └── hooks/           # useRoom, useRoomUserCounts
│   │   │
│   │   ├── chat/[id]/           # Sala de chat en tiempo real
│   │   │   ├── page.tsx         # Página principal del chat
│   │   │   ├── layout.tsx       # Layout del chat (sin navbar)
│   │   │   ├── components/      # Todos los componentes del chat (ver sección)
│   │   │   └── hooks/           # Hooks específicos del chat (ver sección)
│   │   │
│   │   ├── faq/                 # Preguntas frecuentes
│   │   ├── legal/               # Términos y condiciones, privacidad
│   │   ├── guia-comunidad/      # Guía de la comunidad
│   │   │
│   │   ├── hooks/               # Hooks globales de la app
│   │   ├── lib/                 # Configuraciones singleton (auth-client, socket)
│   │   ├── components/          # Componentes globales (auth, providers, etc.)
│   │   ├── utils/               # Utilidades de la app
│   │   └── data/                # Datos estáticos de la app
│   │
│   ├── components/ui/           # Componentes UI reutilizables (shadcn/ui pattern)
│   ├── lib/utils.ts             # Función `cn()` de clsx + tailwind-merge
│   └── types/                   # Tipos TypeScript compartidos (incluye chat.ts)
```

---

## 🛠 Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **Next.js 16 (App Router)** | Framework React con SSR/SSG, file-based routing |
| **React 19** | UI library |
| **TypeScript** | Lenguaje principal |
| **TailwindCSS 4** | Utility-first CSS |
| **shadcn/ui (Radix UI)** | Componentes UI accesibles (Dialog, Select, Avatar, etc.) |
| **better-auth** (client) | Cliente de autenticación, sincronizado con el backend |
| **Socket.IO Client** | WebSocket para el chat en tiempo real |
| **Framer Motion** | Animaciones declarativas |
| **Lottie Web** | Animaciones Lottie (campfire en el chat) |
| **React Hook Form + Zod** | Formularios con validación tipada |
| **Sonner** | Sistema de notificaciones toast |
| **next-themes** | Sistema de temas dark/light |
| **immer** | Inmutabilidad para actualizaciones de estado |
| **lucide-react** | Iconos SVG |
| **Montserrat** | Tipografía principal (Google Fonts) |

---

## 🗺 Páginas y Rutas

| Ruta | Descripción | Auth |
|---|---|---|
| `/` | Landing page con hero, features, CTA | Pública |
| `/login` | Inicio de sesión (email/password + OAuth) | Pública |
| `/signup` | Registro de cuenta | Pública |
| `/verify-email` | Verificación de email | Pública |
| `/welcome` | Pantalla post-registro | Autenticada |
| `/rooms` | Explorador de salas con búsqueda en tiempo real | Pública |
| `/rooms/create` | Crear nueva sala | Autenticada |
| `/rooms/my-rooms` | Salas propias del usuario | Autenticada |
| `/rooms/favorites` | Salas favoritas del usuario | Autenticada |
| `/chat/[id]` | Sala de chat en tiempo real | Pública (con username anónimo) |
| `/profile` | Perfil del usuario autenticado | Autenticada |
| `/profile/[username]` | Perfil público por username | Pública |
| `/admin` | Panel de administración | ADMIN |
| `/faq` | Preguntas frecuentes | Pública |
| `/legal` | Términos y privacidad | Pública |
| `/guia-comunidad` | Guía de la comunidad | Pública |

### Middleware de Autenticación (`src/proxy.ts`)
El middleware de Next.js verifica la sesión en cada request:
- Rutas **autenticadas** sin sesión → redirect a `/login`
- Rutas **públicas** con sesión activa → redirect a `/rooms` (excepto `/rooms` y `/chat/*`)
- La verificación se hace contra el endpoint `/api/v1/users/session` del backend

---

## 💬 Módulo de Chat (`/chat/[id]`)

El chat es la funcionalidad más compleja del proyecto.

### Componentes del Chat

| Componente | Descripción |
|---|---|
| `ChatProvider.tsx` | Context provider con el estado global del chat (mensajes, usuarios, typing, etc.) |
| `ChatHeader.tsx` | Header con nombre de sala, conteo de usuarios, toggle user list |
| `MessageList.tsx` | Lista scrolleable de mensajes |
| `ChatMessage.tsx` | Renderizado individual de mensajes (texto, imagen, audio, GIF, sistema, reply) |
| `MessageInput.tsx` | Input complejo: texto, emoji picker, GIF picker, audio recording, image upload |
| `UserList.tsx` | Panel lateral con usuarios en sala (desktop sidebar / mobile overlay) |
| `TypingIndicator.tsx` | Indicador de "usuarios escribiendo..." |
| `GifPicker.tsx` | Picker de GIFs con búsqueda en Giphy API |
| `AudioPlayer.tsx` | Player de notas de voz |
| `ReactionPicker.tsx` | Picker de reacciones a mensajes |
| `ReportUserDialog.tsx` | Diálogo para reportar usuarios |
| `MentionList.tsx` | Lista de sugerencias de @ menciones |
| `ImagePreviewModal.tsx` | Preview de imagen antes de enviar |
| `ImageViewerModal.tsx` | Visor fullscreen de imágenes |
| `ChatConnecting.tsx` | Pantalla de loading mientras conecta |
| `UserJoinedNotification.tsx` | Notificación flotante cuando alguien se une |
| `CampfireBackground.tsx` | Fondo animado modo oscuro (campfire) |
| `ParkBackground.tsx` | Fondo animado modo claro (parque) |
| `CampfireLottie.tsx` | Animación Lottie de fuego (modo oscuro) |
| `TreeIllustration.tsx` | Ilustración SVG de árbol (modo claro) |

### Hooks del Chat (`/chat/[id]/hooks/`)

| Hook | Responsabilidad |
|---|---|
| `useMessageInput.ts` | Estado del input, detección de @menciones, envío de mensajes |
| `useAutoScroll.ts` | Auto-scroll al nuevo mensaje |
| `useImageHandling.ts` | Selección, preview y subida de imágenes via signed URL |
| `useAudioRecording.ts` | Grabación de notas de voz con MediaRecorder API |
| `useGifSearch.ts` | Búsqueda de GIFs en la API de Giphy |
| `useFavoriteGifs.ts` | CRUD de GIFs favoritos del usuario |
| `useImageViewer.ts` | Estado del visor fullscreen de imágenes |
| `useLongPress.ts` | Detección de long-press (mobile) para contextos de mensaje |
| `useReportUser.ts` | Lógica de reporte de usuario via socket |

---

## 🪝 Hooks Globales (`/app/hooks/`)

| Hook | Descripción |
|---|---|
| `useAuth.ts` | Wrapper de `authClient.useSession()` de better-auth |
| `useSocketHandler.ts` | Suscripción a eventos del socket: mensajes, usuarios, typing |
| `useJoinRoom.ts` | Une al usuario a la sala via socket al montar el componente |
| `useUsername.ts` | Obtiene o genera username (autenticado o anónimo) |
| `useRoomSearch.ts` | Búsqueda de salas con debounce |
| `useInfiniteScroll.ts` | Intersection Observer para carga infinita |
| `useDebounce.ts` | Debounce de valores con delay configurable |
| `useClickOutside.ts` | Detección de click fuera de un elemento |
| `useHover.ts` | Detección de si el dispositivo tiene hover (desktop vs mobile) |
| `useProfileSetup.ts` | Lógica de setup inicial del perfil post-registro |

---

## 🔌 Conexión con el Backend

### REST API
Las llamadas REST se hacen directamente con `fetch` usando la variable `NEXT_PUBLIC_API_URL`.

Patrón típico:
```typescript
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/rooms`, {
    credentials: 'include', // Siempre para cookies de sesión
});
```

### Socket.IO (`src/app/lib/socket.ts`)
Singleton del cliente Socket.IO. Se conecta al backend con `credentials: true` para cookies de sesión.

El `SocketEventProvider` (provider global en el root layout) mantiene la instancia activa y escucha eventos globales como `user-count` para actualizar los conteos en la lista de salas.

### Autenticación (`src/app/lib/auth-client.ts`)
Cliente de better-auth configurado con la URL del backend. Provee hooks y funciones:
- `authClient.useSession()` → estado de sesión reactivo
- `authClient.signIn.*`, `authClient.signOut()`, etc.

---

## 🎨 Sistema de Diseño

- **Fuente**: Montserrat (Google Fonts) en todo el proyecto
- **Temas**: Dark / Light vía `next-themes`. El chat tiene backgrounds animados según el tema
  - **Dark**: Fondo de campfire (CampfireBackground + CampfireLottie)
  - **Light**: Fondo de parque (ParkBackground + TreeIllustration)
- **Componentes UI**: Patrón shadcn/ui — componentes en `src/components/ui/` basados en Radix UI con `class-variance-authority`
- **CSS**: Tailwind 4 + variables CSS en `globals.css`
- **Animaciones**: Framer Motion para transiciones de entrada, Lottie para animaciones complejas

---

## 📁 Providers del Root Layout

El `RootLayout` envuelve toda la app con estos providers (de exterior a interior):

```
SessionProvider (better-auth)
  └── SocketEventProvider (Socket.IO global + user-count updates)
        └── ThemeProvider (next-themes, dark/light/system)
              └── Toaster (sonner, top-right)
```

---

## 🔧 Variables de Entorno

```env
NEXT_PUBLIC_API_URL=          # URL del backend (ej: http://localhost:3001)
NEXT_PUBLIC_APP_URL=          # URL del frontend (para SEO y metadata)
NEXT_PUBLIC_GIPHY_API_KEY=    # API key de Giphy para el GIF picker
```

---

## 📌 Convenciones y Patrones

### Tipos de Mensajes (`src/types/chat.ts`)
Los mensajes del chat están tipados con una union type. Hay un type guard `isTextMessage()` para distinguir mensajes de texto de otros tipos (imagen, audio, GIF).

### Optimistic Updates
El chat implementa mensajes optimistas: los mensajes del usuario propio se añaden a la UI inmediatamente con `addOptimisticMessage()` antes de recibir confirmación del servidor.

### Estado del Chat
El estado global del chat (mensajes, usuarios en sala, typing indicators, etc.) se maneja en `ChatProvider.tsx` y se consume por los componentes del chat sin prop-drilling.

### Sub-Rooms
El backend asigna al usuario a un "sub-room" específico dentro de la sala padre. El frontend **no necesita conocer** el sub-room; solo hace `join-room` con el `roomId` de la URL y el backend se encarga de la asignación.

### Salas con Status
Solo las salas con `status: ACCEPTED` son accesibles para el chat. El backend rechaza conexiones a salas con otro status.

### Imágenes en el Chat
El flujo de subida de imágenes:
1. Usuario selecciona imagen → `useImageHandling` la previewea localmente
2. Al confirmar, el cliente emite `request-chat-image-upload` al socket
3. El backend genera una URL firmada de Supabase y responde con `grant-chat-image-upload`
4. El cliente sube la imagen directamente a Supabase Storage vía PUT
5. El cliente emite el evento `image` con la `publicUrl` final

### Notificaciones
Se usa `sonner` para toasts. Importar `toast` desde `sonner` directamente.

### Formularios
React Hook Form + Zod. Los resolvers de Zod se importan desde `@hookform/resolvers/zod`.
