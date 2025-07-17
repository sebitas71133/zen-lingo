export const getPromptByType = (type = "", translation, typeText = "") => {
  let prompt = "";

  switch (type) {
    case "word":
      prompt = `Quiero que analices la palabra o frase "${translation}" y me devuelvas solo un objeto JSON que contenga los siguientes campos para llenar un formulario:

        {
        "word": "traduccion al ingles",
        "spokenForm": "forma hablada en inglés americano natural y su expliacion, usando connected speech o reducciones si aplica. Ejemplo: 'What did you do?' -> 'Whadja do?'",
        "type": "tipo de palabra solo una de estas opciones en español (verbo, sustantivo, adjetivo, adverbio o expresiòn)",
        "definition": "una definición clara y breve en inglés y seguida entre parentesis su traduccion al español",
        "examples": ["Ejemplo 1", "Ejemplo 2", "Ejemplo 3"] ejemplos no tan breves,
        
        }

        
        No incluyas texto adicional, solo responde con el JSON directamente.`;

      break;

    case "phrase":
      prompt = `Quiero que analices el phrasal verb o idiom : "${translation}" y me devuelvas solo un objeto JSON que contenga los siguientes campos para llenar un formulario:

      {
        "translation" : "Su traduccion al español",
        "type": "segun lo analizado coloca phrases o idioms, solo puedes elegir uno de esas dos opciones",
        "context": "En qué contexto se usa dicha frase o idiom en inglés y seguida entre paréntesis su traducción al español",
        "examples": ["Ejemplo 1", "Ejemplo 2", "Ejemplo 3"],
        "flapping": "Cómo suena dicha frase con la pronunciación típica americana si aplica (por ejemplo, 'shut up' suena como 'shuddup' o 'put it on' suena como 'puddit on'). Asegúrate de analizar cuidadosamente si el 'flapping' es aplicable y, de ser así, inclúyelo.",
        "spanish_pronunciation": "Cómo sonaría esa frase si la escribimos como se pronuncia para un hispanohablante (ej: 'sharáp'. 'puri ron')"
      }

      Los ejemplos no deben ser tan breves y deben estar en inglés.
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
                "commonForms": {
                "base": "Verbo en su forma base",
                "thirdPerson": "Verbo en su tercera persona",
                "past": "Verbo en pasado simple",
                "pastParticiple": "Verbo en participio pasado",
                "presentParticiple": "Verbo en presente continuo(ing)",
                },
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

    case "text":
      prompt = `Quiero que generes un objeto JSON basado en el siguiente título en español: "${translation}", el cual representa un texto de tipo "${typeText}". Usa ese título como inspiración para crear un contenido original en inglés.

Debes devolver únicamente un objeto JSON con esta estructura (sin explicaciones ni texto fuera del JSON):

{
  "originalText": "Contenido original en inglés, bien redactado, relacionado con el título y tipo de texto.",
  "translation": "Traducción fiel del texto al español, manteniendo estilo y significado.",
  "notes": "Notas breves sobre el contenido generado, su estilo, tono o intención separado por comas."
}

Requisitos estrictos:
- El campo "originalText" debe ser 100% en inglés, no una traducción del título, sino un desarrollo creativo o narrativo relacionado.
- El contenido debe tener una extensión razonable (no muy corto).
- Asegúrate de que el JSON esté **bien formado y cerrado correctamente**, sin caracteres sueltos ni errores de sintaxis.
- No incluyas explicaciones, comentarios ni texto adicional fuera del JSON. Solo responde con el JSON, y nada más.`;

      break;

    default:
      break;
  }

  return prompt;
};
