import { useAddWordMutation } from "../services/wordApi";
import { sampleWords } from "./sampleWords";

export const SeedWords = () => {
  const [addWord] = useAddWordMutation();

  const handleSeed = async () => {
    try {
      for (const word of sampleWords) {
        await addWord(word).unwrap();
      }
      alert("Palabras insertadas correctamente.");
    } catch (error) {
      console.error(" Error insertando palabras:", error);
      alert("Ocurrió un error al insertar las palabras.");
    }
  };

  //   if (process.env.NODE_ENV !== "development") return null;

  return (
    <button
      onClick={handleSeed}
      style={{
        margin: "1rem",
        padding: "0.5rem 1rem",
        backgroundColor: "#1976d2",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Insertar palabras de ejemplo
    </button>
  );
};
