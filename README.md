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
- jsPDF, xlsx – exportar contenido
- React Toastify, SweetAlert2 – notificaciones y alertas
- Slick Carousel – carruseles de contenido

---

### 🖼️ Vista previa de la aplicación

| Words                                                                                     | View                                                                                     |
| ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | 
| ![Words](https://github.com/user-attachments/assets/afff44d3-663d-4432-b075-05111c2de927) | ![View](https://github.com/user-attachments/assets/6666ec06-7d5f-4c3e-96df-08e25f92599d) | 

| Autocomplete                                                                                   | Tags                                                                                | 
| ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | 
| ![Autocomplete](https://github.com/user-attachments/assets/01f403a4-ec1c-417f-b374-4def6a3c60e1) | ![Tags](https://github.com/user-attachments/assets/65de5471-7ca5-4f79-a095-48527242aac3)  |

 | Tools                                                                                     | Dashboard                                                                                     |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| ![Tools](https://github.com/user-attachments/assets/e6874873-2c75-4e59-b192-740ed93353f5) | ![Dashboard](https://github.com/user-attachments/assets/87d23939-2dfa-41c3-98fd-7835290ffd61) |

| Home                                                                                     | Login                                                                                    |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| ![Home](https://github.com/user-attachments/assets/9f8c21c3-e088-4cf6-ac09-12aacd6bfc0c) | ![Login](https://github.com/user-attachments/assets/ecf8cd0b-7996-4758-9470-04108c1c6868) |


---

## 📦 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/sebitas71133/zen-lingo
cd zen-lingo
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea el archivo `.env`:

```bash
cp .env.template .env
```
Edita tu archivo `.env` con las claves necesarias de Firebase y Gemini:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
VITE_GEMINI_API_KEY=...
```

4. Levanta el proyecto:

```bash
npm run dev
```

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

## 🧩 Video

https://github.com/user-attachments/assets/09c2974e-5bac-48e0-aad1-2ccb2345e839

---

## 🛠️ Autor

Jesús Sebastián Huamanculi Casavilca - [GitHub](https://github.com/sebitas71133)

---

## 📄 Licencia

MIT
