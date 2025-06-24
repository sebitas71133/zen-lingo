import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE, // Más restrictivo
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE, // Mayor control
  },

  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE, // Evitar contenido sexual explícito
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE, // Evitar consejos peligrosos
  },
];

export const generateChatResponse = async (
  text,
  answerTone,
  responseStyle,
  responseLength,
  enthusiasmLevel,
  conversationContext,
  responseFormat,
  userTemperature
) => {
  console.log({
    text,
    answerTone,
    responseStyle,
    responseLength,
    enthusiasmLevel,
    conversationContext,
    userTemperature,
  });

  if (!text.trim() || text.split(" ").length < 3) {
    return "El mensaje parece demasiado corto para generar una respuesta.";
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings,
    generationConfig: {
      maxOutputTokens: 500, // Ajusta según necesidad
      temperature: userTemperature || 0.7,
    },
  });

  const prompt = `Antes de responder determina si el mensaje seria parte de una conversacion, si no es asi responder con :  
  "Este mensaje no parece una conversación válida."  
  
  Si es válido, genera una respuesta siguiendo estas indicaciones:  
  - Mensaje recibido: "${text}"  
  - Tono de la respuesta: ${answerTone}.  
  - Estilo de respuesta: ${responseStyle}.  
  - Longitud: ${responseLength}.  
  - Nivel de entusiasmo: ${enthusiasmLevel}.  
  - Contexto: ${conversationContext}.  
  - Formato: ${responseFormat}.  
  
  La respuesta debe ser en inglés y español, fluida, natural y acorde al contexto.  
  Si el formato es "lista", usa números y coloca la traducción entre paréntesis.
  Si el formato es "emoji", incluye emojis apropiados en la respuesta.  
  Responde sin explicaciones ni texto adicional.
  `;

  try {
    console.log(prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = await response.text();

    if (generatedText.includes("[blocked]")) {
      return "La respuesta no pudo generarse debido a restricciones de seguridad.";
    }
    return generatedText.trim();
  } catch (error) {
    console.error("Error al generar respuesta:", error);
    return "Error al generar respuesta.";
  }
};
