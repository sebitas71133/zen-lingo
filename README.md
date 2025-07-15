# 📚 EnglishApp - Aprende Inglés (React + MUI + Firebase + Gemini API)

Aplicación web construida con **React 19**, **MUI**, **Firebase** y **Redux Toolkit**, diseñada para ayudar a los usuarios a **gestionar su propio vocabulario y expresiones en inglés**. Ofrece funcionalidades para registrar y organizar **palabras**, **verbos**, **frases**, **textos** y **etiquetas**, así como una opción avanzada de autocompletado utilizando la **API de Gemini (Google Generative AI)**.

---

## 🚀 Tecnologías principales

- React 19
- Material UI (MUI)
- Firebase (Auth + Firestore)
- Redux Toolkit
- React Router v7
- Framer Motion – animaciones
- React Hook Form – formularios
- Google Generative AI (Gemini API) – autocompletar contenido
- jsPDF, xlsx, file-saver – exportar contenido
- React Toastify, SweetAlert2 – notificaciones y alertas
- Slick Carousel – carruseles de contenido

---

## 📦 Instalación

1. Clona el repositorio:

git clone https://github.com/tu-usuario/englishapp.git
cd englishapp

2. Instala las dependencias:

npm install

3. Crea el archivo `.env`:

cp .env.template .env

Edita tu archivo `.env` con las claves necesarias de Firebase y Gemini:

VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
VITE_GEMINI_API_KEY=...

4. Levanta el proyecto:

npm run dev

---

## 📘 Funcionalidades destacadas

- Autenticación con Firebase
- Gestión de:
  - ✅ Palabras
  - ✅ Verbos
  - ✅ Frases y textos personalizados
  - ✅ Etiquetas (tags)
- Organización, filtrado y búsqueda
- Exportación a PDF, Excel y descarga local
- Autocompletado de contenido con Gemini AI
- Notificaciones con toast y alertas interactivas
- Interfaz moderna y adaptable (Material UI + animaciones)

---

## 🧪 Scripts disponibles

| Comando         | Descripción                    |
| --------------- | ------------------------------ |
| npm run dev     | Inicia en modo desarrollo      |
| npm run build   | Compila para producción        |
| npm run preview | Previsualiza la build generada |

---

## 🧩 Integraciones

- 🔐 **Firebase** – autenticación y almacenamiento de datos en tiempo real.
- 🤖 **Gemini API (Google)** – generación de contenido sugerido para palabras.
- 🧾 **Exportadores/importadores** – permite exportar e importar listas de estudio en diferentes formatos.

---

## 🛠️ Autor

Jesús Sebastián Huamanculi Casavilca - [GitHub](https://github.com/tu-usuario)

---

## 📄 Licencia

MIT
