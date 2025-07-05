export const getPromptByType = (type = "", translation) => {
  let prompt = "";

  switch (type) {
    case "word":
      prompt = `Quiero que analices la palabra o frase "${translation}" y me devuelvas solo un objeto JSON que contenga los siguientes campos para llenar un formulario:

        {
        "word": "traduccion al ingles(1 palabra)",
        "type": "tipo de palabra en español (verbo, sustantivo, adjetivo, adverbio o expresiòn)",
        "definition": "una definición clara y breve en inglés y seguida entre parentesis su traduccion al español",
        "examples": ["Ejemplo 1", "Ejemplo 2", "Ejemplo 3"] ejemplos no tan breves,
        
        }

        
        No incluyas texto adicional, solo responde con el JSON directamente.`;

      break;

    case "phrase":
      prompt = `Quiero que analices el phrasal verb o idiom : "${translation}" y me devuelvas solo un objeto JSON que contenga los siguientes campos para llenar un formulario:

        {
  
        "type": "segun lo analizado coloca phrases o idioms, solo puedes elegir uno de esas dos opciones",
        "context": "En que contexto se usa dicha frase o idiom en inglés y seguida entre parentesis su traduccion al español",
        "examples": ["Ejemplo 1", "Ejemplo 2", "Ejemplo 3"]
        
        }

        Los ejemplos no deben ser tan breves y en ingles
        No incluyas texto adicional, solo responde con el JSON directamente.`;

      break;

    case "verb":
      prompt = `Quiero que analices el verbo: "${translation}" y me devuelvas únicamente un objeto JSON con esta estructura para completar un formulario:

        {
            "verb": "traducción al inglés (una sola palabra)",
            "type": "si el verb es regular o irregular",
            "examples": [
                "Ejemplo 1 usando el verbo.",
                "Ejemplo 2 usando el verbo.",
                "Ejemplo 3 usando el verbo."
            ],
            "conjugations": {
                "base": "Ejemplo usando la forma base",
                "thirdPerson": "Ejemplo usando la tercera persona",
                "past": "Ejemplo usando el pasado simple",
                "pastParticiple": "Ejemplo usando el participio pasado",
                "presentParticiple": "Ejemplo usando el verbo en -ing (presente continuo)",
                "future": {
                "simple": "Ejemplo usando will + verbo",
                "goingTo": "Ejemplo usando going to + verbo"
                },
                "modals": {
                "can": "Ejemplo usando can + verbo",
                "could": "Ejemplo usando could + verbo",
                "would": "Ejemplo usando would + verbo",
                "should": "Ejemplo usando should + verbo",
                "might": "Ejemplo usando might + verbo",
                "must": "Ejemplo usando must + verbo"
                }
            }
            "tenses": {
                "past": "verbo en pasado",
                "present": "verbo en presente",
                "pastParticiple": "verbo en pastParticiple",
            }    
        }
        Todos los ejemplos no deben ser tan breves y en ingles
        No incluyas texto adicional ni explicaciones, solo responde con el JSON directamente.`;

      break;

    default:
      break;
  }

  return prompt;
};
