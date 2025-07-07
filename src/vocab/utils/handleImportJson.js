import { useAddWordMutation } from "../../services/wordApi";
import { useAddPhraseMutation } from "../../services/phrasesApi";
import { useAddVerbMutation } from "../../services/verbsApi";
import { useAddTextMutation } from "../../services/textsApi";
import { useAddTagMutation } from "../../services/tagsApi";

const [addWord] = useAddWordMutation();
const [addPhrase] = useAddPhraseMutation();
const [addVerb] = useAddVerbMutation();
const [addText] = useAddTextMutation();
const [addTag] = useAddTagMutation;

export const handleImportJson = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const text = await file.text();

  try {
    const json = JSON.parse(text);
    const { words = [], phrases = [], verbs = [], texts = [] } = json;

    console.log({ words, phrases, verbs, texts });

    //Procesar cada colección
    for (const word of words) {
      const { id, ...rest } = word;
      await addWord(rest);
    }

    for (const phrase of phrases) {
      const { id, ...rest } = phrase;
      await addPhrase(rest);
    }

    for (const verb of verbs) {
      const { id, ...rest } = verb;
      await addVerb(rest);
    }

    for (const text of texts) {
      const { id, ...rest } = text;
      await addText(rest);
    }

    alert("Importación completada correctamente ✅");
  } catch (err) {
    console.error("Error al importar JSON:", err);
    alert("Hubo un error al importar el archivo JSON 😢");
  }
};
