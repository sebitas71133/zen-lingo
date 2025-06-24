import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE, // Más restrictivo
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE, // Mayor control
  },

  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH, // Evitar contenido sexual explícito
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH, // Evitar consejos peligrosos
  },
];

export const translatorApi = async (
  text,
  targetLanguage,
  formalityLevel,
  translationType,
  situation,
  variant,
  idiomatic,
  infoType
) => {
  console.log({
    text,
    targetLanguage,
    formalityLevel,
    translationType,
    situation,
    variant,
    idiomatic,
    infoType,
  });

  targetLanguage =
    targetLanguage === "quy" ? "Quechua Ayacuchano" : targetLanguage;

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings,
    generationConfig: {
      maxOutputTokens: 500, // Ajusta según necesidad
    },
  });

  const prompt =
    translationType !== "word"
      ? `Traduce el siguiente texto a ${targetLanguage}. 
        - Nivel de formalidad: ${formalityLevel}.
        - Contexto: ${situation} . (ejemplos: conversación, videojuego, reunión de negocios).
        - Variante(solo si el idioma a traducir es el Ingles): ${variant}. (ejemplo: inglés británico, español latinoamericano).
        ${
          idiomatic
            ? "- **Usa expresiones idiomáticas y frases naturales en el idioma de destino.**"
            : "- **Evita expresiones idiomáticas, usa un lenguaje claro y directo.**"
        }
        Texto original: "${text}"
        
        Responde solo con la traducción, sin explicaciones ni texto adicional y usa la palabra traducida al idioma pedido en cada oracion.`
      : `Realiza la siguiente tarea para la palabra "${text}" en ${targetLanguage}:
      
     ${
       infoType === "Definición"
         ? `- Proporciona una definición clara y concisa de la palabra, Además incluye sinónimos y un ejemplo de uso en una oración.  
            Usa saltos de línea para organizar mejor la información.  
            
            Ejemplo:
            Palabra: Liderazgo (Leadership)  
            Definición: The ability to influence and guide individuals or groups toward achieving a common goal.  
            Sinónimos: guidance, authority, management  
            Ejemplo: A good leader inspires their team to achieve great results.`
         : infoType === "Ejemplos"
         ? `- Da 5 ejemplos de uso de la palabra en oraciones naturales. 
             
             Devuelve la respuesta en un arreglo JSON con la estructura:
             ["Ejemplo 1", "Ejemplo 2", "Ejemplo 3","Ejemplo 4","Ejemplo 5"]`
         : infoType === "Sinónimos"
         ? `- Proporciona al menos 5 sinónimos con un ejemplo de oracion de la palabra en el idioma de destino.
             
             Devuelve la respuesta en un arreglo JSON con la estructura:
             ["Sinónimo 1 : oracion 1", "Sinónimo 2 : oracion 2", "Sinónimo 3 : oracion 3", "Sinónimo 4 : oracion 4", "Sinónimo 5 : oracion 5"]`
         : infoType === "Antónimos"
         ? `- Proporciona al menos 5 antónimos de la palabra en el idioma de destino.
             
             Devuelve la respuesta en un arreglo JSON con la estructura:
             ["Antónimo 1 : oracion 1", "Antónimo 2 : oracion 2", "Antónimo 3 : oracion 3", "Antónimo 4 : oracion 4", "Antónimo 5 : oracion 5"]`
         : infoType === "Conjugaciones"
         ? `- Conjuga la palabra en los tiempos verbales más comunes en el idioma de destino.
             
             Devuelve la respuesta en formato JSON con la estructura:
             ["Conjugacion 1", "Conjugacion 2", "Conjugacion 3", "Conjugacion 4", "Conjugacion 5"]`
         : "Indica un tipo de información válido."
     }
      Responde sin explicaciones ni texto adicional.`;
  try {
    console.log(prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log(response);

    const translatedText = await response.text();
    console.log(translatedText);

    if (translatedText.includes("[blocked]")) {
      return "La respuesta no pudo generarse debido a restricciones de seguridad.";
    }

    // console.log(translatedText);

    // const resultJSON = await JSON.parse(translatedText);

    try {
      const translatedTextClear = translatedText
        .replace(/```json|```/g, "")
        .trim();
      console.log(translatedTextClear);
      const jsonString = JSON.parse(translatedTextClear);

      return jsonString;
    } catch (error) {
      // Si no se puede parsear, devuelve el texto como está
      return translatedText.trim();
    }
  } catch (error) {
    console.error("Error en la traducción:", error);
    return "Error en la traducción.";
  }
};
