const variantesCode = {
  Americano: "en-US",
  Britanico: "en-GB",
};

export const handleSpeak = (text, lang, watch) => {
  if (!text) return;
  window.speechSynthesis.cancel();
  const variation = variantesCode[watch("variant")] || "es-ES";
  const rate = watch("rate");
  console.log({ text, lang, variation, rate });
  const sentences = (Array.isArray(text) ? text.join(" ") : text).match(
    /[^.!?]+[.!?]+/g
  ) || [text];

  const speakNext = (index = 0) => {
    if (index < sentences.length) {
      const utterance = new SpeechSynthesisUtterance(sentences[index]);
      utterance.lang = lang === "en-US" ? variation : lang;
      utterance.rate = rate;

      utterance.onend = () => speakNext(index + 1); // evento que se ejecuta cuando speak termina de leer.
      window.speechSynthesis.speak(utterance);
    }
  };

  speakNext(); // Iniciar lectura
};
