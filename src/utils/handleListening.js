export const startListening = () => {
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.lang = "es-ES"; // Configura el idioma
  recognition.interimResults = false; // Si es true, muestra resultados parciales
  recognition.maxAlternatives = 1; // Número de alternativas de reconocimiento

  recognition.onstart = () => console.log("🎤 Escuchando...");
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log("📝 Texto reconocido:", transcript);
  };
  recognition.onerror = (event) => console.error("❌ Error:", event.error);
  recognition.onend = () => console.log("🔴 Detenido.");

  recognition.start();
};
