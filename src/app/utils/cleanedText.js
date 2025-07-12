export const cleanedText = (text) => {
  return text.replace(/\s*\([^)]*\)/g, "").trim();
};
