import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { getPromptByType } from "./prompts";

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

export const translatorApi = async (translation, type = "word") => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings,
    generationConfig: {
      maxOutputTokens: 500,
    },
  });

  const prompt = getPromptByType(type, translation);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    if (rawText.includes("[blocked]")) {
      return {
        error:
          "La respuesta fue bloqueada por las políticas de seguridad de Gemini.",
      };
    }

    const cleanText = rawText.replace(/```json|```/g, "").trim();

    try {
      const parsed = JSON.parse(cleanText);
      return parsed;
    } catch {
      return {
        error: "No se pudo interpretar la respuesta del modelo.",
        raw: cleanText,
      };
    }
  } catch (error) {
    console.error("Error en la API de traducción:", error);
    return {
      error: "Hubo un error al comunicarse con el modelo.",
    };
  }
};
