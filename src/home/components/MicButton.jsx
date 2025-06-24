import { useState, useEffect, useRef } from "react";
import { IconButton } from "@mui/material";
import { Mic, MicOff } from "@mui/icons-material";

export const MicButton = ({
  onResult,
  language = "es-ES",
  silenceDelay = 3000,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const silenceTimerRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.warn("Speech Recognition is not supported in this browser.");
      return;
    }

    const recog = new window.webkitSpeechRecognition();
    recog.lang = language;
    recog.continuous = true;
    recog.interimResults = false;

    recog.onresult = (event) => {
      // Reiniciamos el temporizador cada vez que se obtiene un resultado
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      const transcript = event.results[event.results.length - 1][0].transcript;
      console.log("Texto reconocido:", transcript);
      if (onResult) onResult(transcript);

      // Inicia un temporizador para detener el reconocimiento tras 'silenceDelay' ms de silencio
      silenceTimerRef.current = setTimeout(() => {
        console.log("Silencio detectado, se detiene el reconocimiento.");
        recog.stop();
        setIsListening(false);
      }, silenceDelay);
    };

    recog.onerror = (event) => {
      console.error("Error en reconocimiento:", event.error);
      recog.stop();
      setIsListening(false);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };

    recog.onend = () => {
      console.log("Reconocimiento finalizado");
      setIsListening(false);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };

    setRecognition(recog);
  }, [language, onResult, silenceDelay]);

  const handleMicClick = () => {
    if (!recognition) return;
    if (!isListening) {
      recognition.start();
      setIsListening(true);
    } else {
      recognition.stop();
      setIsListening(false);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    }
  };

  return (
    <IconButton onClick={handleMicClick} sx={{ ml: 2 }} color="primary">
      {isListening ? <Mic /> : <MicOff />}
    </IconButton>
  );
};
