# 🌐 TranslatorZen

**TranslatorZen** es una aplicación web moderna e intuitiva que permite traducir palabras o frases entre inglés y español utilizando la API de Gemini AI. Además de traducciones, ofrece funcionalidades enriquecidas como definiciones, sinónimos, antónimos, conjugaciones y ejemplos de uso.

También incluye un potente **generador de respuestas conversacionales en inglés**, con ajustes personalizables como tono, estilo, nivel de entusiasmo y formato.

---

## 🚀 Características principales

- ✅ Traducción inteligente de **palabras** y **frases** entre inglés y español.
- 🎯 Configuración de:
  - Nivel de **formalidad** (informal, neutro, formal).
  - **Variante** del idioma (americano, británico, etc.).
  - Activación de **idioms** y contexto de uso (redes sociales, trabajo, etc.).
- 📚 Traducciones con:
  - **Definiciones**
  - **Ejemplos de uso**
  - **Sinónimos y antónimos**
  - **Conjugaciones verbales**
- 🗣️ Generador de respuestas en inglés con ajustes:
  - Tono: positivo, neutro, negativo.
  - Estilo: casual, formal, divertido, sarcástico.
  - Longitud, formato y nivel de creatividad.
- 🌑 Soporte de **modo oscuro elegante y profesional**.
- ❤️ Gestión de **favoritos**: guarda y elimina tus traducciones y respuestas preferidas.
- 🔐 Autenticación con Firebase y persistencia de favoritos por usuario.

---

## 🖼️ Capturas de pantalla

<div align="center">
  <table>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/4493729f-517c-477f-9ba6-b9549feef981" alt="Captura 1" width="90%"></td>
      <td><img src="https://github.com/user-attachments/assets/1e7549a0-3b62-4ba1-b899-5068f0ae5512" alt="Captura 2" width="90%"></td>
    </tr>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/1f56b469-da36-4768-a055-eba5f5418e0c" alt="Captura 3" width="90%"></td>
      <td><img src="https://github.com/user-attachments/assets/737b2cb5-eb66-42ed-875f-a5e4dd36f2da" alt="Captura 4" width="90%"></td>
    </tr>
    <tr>
     <td colspan="2" align="center">
        <img src="https://github.com/user-attachments/assets/737b2cb5-eb66-42ed-875f-a5e4dd36f2da" alt="Captura móvil 1" width="45%">
        <img src="https://github.com/user-attachments/assets/1a31b6c6-9f1f-4366-9c9d-df2b52f91227" alt="Captura móvil 2" width="45%">
      </td>
    </tr>
  </table>
</div>

---

## 🛠️ Tecnologías y herramientas

| Herramienta                                            | Descripción                             |
| ------------------------------------------------------ | --------------------------------------- |
| [**Vite**](https://vitejs.dev)                         | Empaquetador moderno para frontend      |
| [**React**](https://react.dev)                         | Librería para construir interfaces      |
| [**Redux Toolkit**](https://redux-toolkit.js.org)      | Manejo global del estado                |
| [**MUI (Material UI)**](https://mui.com)               | Componentes visuales personalizables    |
| [**React Hook Form**](https://react-hook-form.com)     | Validación y manejo de formularios      |
| [**React Router DOM**](https://reactrouter.com)        | Navegación y rutas                      |
| [**Firebase**](https://firebase.google.com)            | Autenticación y Firestore               |
| [**Google Generative AI SDK**](https://ai.google.dev/) | Traducciones y respuestas usando Gemini |

---

## ⚙️ Instalación local

### 1️⃣ Clonar repositorio

```bash
git clone https://github.com/tuusuario/translator-ia.git
cd translator-ia
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Variables de entorno

Crear un archivo `.env` con:

```env
VITE_GEMINI_API_KEY=tu_api_key_aqui
VITE_FIREBASE_API_KEY=...
VITE_AUTH_DOMAIN=...
VITE_PROJECT_ID=...
VITE_STORAGE_BUCKET=...
VITE_MESSAGING_SENDER_ID=...
VITE_APP_ID=...
```

(Obtenidos desde [Firebase Console](https://console.firebase.google.com))

### 4️⃣ Ejecutar en desarrollo

```bash
npm run dev
```

---

## 🧪 Funcionalidad de favoritos (Firebase Firestore)

Los usuarios autenticados pueden:

- ⭐ Guardar palabras, frases y respuestas favoritas.
- 🗑️ Eliminar cualquier elemento guardado.
- 🔄 Sincronización automática al iniciar sesión.

---

## 🌍 Demo en línea

🔗 [https://translator-zen.netlify.app](https://translator-zen.netlify.app)

---

## 👤 Autor

**Jesús Sebastián Huamanculi Casavilca**

- GitHub: [@sebitas71133](https://github.com/sebitas71133)
- Proyecto realizado con fines educativos y de portafolio.

---

## 📄 Licencia

MIT © 2024 – Eres libre de usar, modificar y compartir este proyecto citando la autoría.
