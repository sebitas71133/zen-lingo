import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { getPromptByType } from "./prompts";
import { toast } from "react-toastify";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

export const translatorApi = async (
  translation,
  type = "word",
  typeText = "cuento"
) => {
  const maxOutputTokens = type === "text" ? 1500 : 500;
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings,
    generationConfig: {
      maxOutputTokens: maxOutputTokens,
    },
  });

  const prompt = getPromptByType(type, translation, typeText);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    if (rawText.includes("[blocked]")) {
      const errorMsg =
        "La respuesta fue bloqueada por las políticas de seguridad de Gemini.";
      toast.error(errorMsg);
      return { error: errorMsg };
    }

    const cleanText = rawText.replace(/```json|```/g, "").trim();

    try {
      const parsed = JSON.parse(cleanText);
      return parsed;
    } catch {
      const errorMsg = "No se pudo interpretar la respuesta del modelo.";
      toast.error(errorMsg);
      return {
        error: errorMsg,
        raw: cleanText,
      };
    }
  } catch (error) {
    console.error("Error en la API de traducción:", error);
    toast.error("Hubo un error al comunicarse con el modelo.");
    return {
      error: "Hubo un error al comunicarse con el modelo.",
    };
  }
};
