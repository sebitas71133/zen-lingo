export const handleSpeak = ({
  text,
  lang = "en-US",
  rate = 0.6,
  pitch = 1,
  voice = null,
}) => {
  console.log({ text });
  if (!text) return;
  window.speechSynthesis.cancel();

  const sentences = (Array.isArray(text) ? text.join(" ") : text).match(
    /[^.!?]+[.!?]+/g
  ) || [text];

  const speakNext = (index = 0) => {
    if (index < sentences.length) {
      const utterance = new SpeechSynthesisUtterance(sentences[index]);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = pitch;
      if (voice) utterance.voice = voice;

      utterance.onend = () => speakNext(index + 1);
      utterance.onerror = (e) => console.error("Speech error:", e);

      window.speechSynthesis.speak(utterance);
    }
  };

  speakNext();
};
