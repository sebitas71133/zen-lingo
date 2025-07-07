import { nanoid } from "@reduxjs/toolkit";
import { useAddTagMutation } from "../services/tagsApi";
import { sampleTags } from "./sampleTags";
import { delay } from "framer-motion";

export const SeedTags = () => {
  const [addTag] = useAddTagMutation();

  const handleSeed = async () => {
    try {
      for (const tag of sampleTags) {
        await addTag({ ...tag, id: nanoid() }).unwrap();
        // 100ms entre requests
      }
      alert("Tags insertados correctamente.");
    } catch (error) {
      console.error("Error insertando tags:", error);
      alert("Ocurrió un error al insertar los tags.");
    }
  };

  return (
    <button
      onClick={handleSeed}
      style={{
        margin: "1rem",
        padding: "0.5rem 1rem",
        backgroundColor: "#388e3c",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Insertar tags de ejemplo
    </button>
  );
};
