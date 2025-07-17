export const cleanedText = (text) => {
  return text.replace(/\s*\([^)]*\)/g, "").trim();
};

export const splitIntoSentences = (text) => {
  return (
    text
      .replace(/\n+/g, " ") // Reemplaza saltos de línea por espacio
      .match(/[^.!?]+[.!?]+[\])'"`’”]*|[^.!?]+$/g) // Extrae oraciones
      ?.map((s) => s.trim()) || []
  );
};
