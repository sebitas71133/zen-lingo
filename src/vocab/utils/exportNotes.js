import jsPDF from "jspdf";
import * as XLSX from "xlsx";
// import "jspdf-autotable";

export const exportAllToJSON = ({ words, phrases, texts, verbs, tags }) => {
  const data = {
    palabras: words,
    frases: phrases,
    textos: texts,
    verbos: verbs,
    etiquetas: tags,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mi-data-translator.json";
  a.click();
  URL.revokeObjectURL(url);
};

const formatTags = (tags) => tags.map((t) => t.name).join(", ");
const formatExamples = (examples) =>
  Array.isArray(examples) ? examples.join(" | ") : "";

export const exportAllToExcel = ({ words, phrases, texts, verbs, tags }) => {
  const wb = XLSX.utils.book_new();

  // 📘 Palabras
  const formattedWords = words.map((w) => ({
    Palabra: w.word,
    Traducción: w.translation,
    Hablado: w.spokenForm,
    Definición: w.definition || "",
    Etiquetas: formatTags(w.tags || []),
    Ejemplos: formatExamples(w.examples || []),
    Aprendida: w.isLearned ? "Sí" : "No",
    Favorita: w.isFavorite ? "Sí" : "No",
    FechaCreación: w.createdAt,
    FechaActualización: w.updatedAt,
  }));
  const sheetWords = XLSX.utils.json_to_sheet(formattedWords);
  XLSX.utils.book_append_sheet(wb, sheetWords, "Palabras");

  // 📝 Frases
  const formattedPhrases = phrases.map((p) => ({
    Frase: p.phrase,
    Traducción: p.translation,
    Contexto: p.context || "",
    Etiquetas: formatTags(p.tags || []),
    Ejemplos: formatExamples(p.examples || []),
    Aprendida: p.isLearned ? "Sí" : "No",
    Favorita: p.isFavorite ? "Sí" : "No",
    FechaCreación: p.createdAt,
    FechaActualización: p.updatedAt,
  }));
  const sheetPhrases = XLSX.utils.json_to_sheet(formattedPhrases);
  XLSX.utils.book_append_sheet(wb, sheetPhrases, "Frases");

  // 📄 Textos
  const formattedTexts = texts.map((t) => ({
    Título: t.title,
    TextoOriginal: t.originalText,
    Traducción: t.translation,
    Notas: t.notes || "",
    Etiquetas: formatTags(t.tags || []),
    Aprendido: t.isLearned ? "Sí" : "No",
    Favorito: t.isFavorite ? "Sí" : "No",
    FechaCreación: t.createdAt,
    FechaActualización: t.updatedAt,
  }));
  const sheetTexts = XLSX.utils.json_to_sheet(formattedTexts);
  XLSX.utils.book_append_sheet(wb, sheetTexts, "Textos");

  // 🔤 Verbos
  const formattedVerbs = verbs.map((v) => ({
    Verbo: v.verb,
    Traducción: v.translation,
    Base: v.conjugations?.base || "",
    TerceraPersona: v.thirdPerson || "",
    Pasado: v.past || "",
    ParticipioPasado: v.pastParticiple || "",
    ParticipioPresente: v.presentParticiple || "",
    FuturoGoingTo: v.conjugations?.future?.goingTo || "",
    ModalCan: v.modals?.can || "",
    ModalCould: v.modals?.could || "",
    ModalShould: v.modals?.should || "",
    ModalWould: v.modals?.would || "",
    ModalMust: v.modals?.must || "",
    ModalMight: v.modals?.might || "",
    Ejemplos: formatExamples(v.examples || []),
    Etiquetas: formatTags(v.tags || []),
    Aprendido: v.isLearned ? "Sí" : "No",
    Favorito: v.isFavorite ? "Sí" : "No",
    FechaCreación: v.createdAt,
    FechaActualización: v.updatedAt,
  }));

  const sheetVerbs = XLSX.utils.json_to_sheet(formattedVerbs);
  XLSX.utils.book_append_sheet(wb, sheetVerbs, "Verbos");

  // 📝 Tags
  const formattedTags = phrases.map((p) => ({
    Name: p.name,
    Color: p.color,
    FechaCreación: p.createdAt,
    FechaActualización: p.updatedAt,
  }));
  const sheetTags = XLSX.utils.json_to_sheet(formattedTags);
  XLSX.utils.book_append_sheet(wb, sheetTags, "Etiquetas");

  // 📥 Guardar archivo
  XLSX.writeFile(wb, "mi-data-translator.xlsx");
};

export const exportAllToPDF = ({ words, phrases, texts, verbs, tags }) => {
  const doc = new jsPDF();
  let y = 10;

  const addSection = (title, items, extractor) => {
    doc.setFontSize(14);
    doc.text(title, 10, y);
    y += 8;
    doc.setFontSize(11);

    items.forEach((item) => {
      const line = extractor(item);
      const lines = doc.splitTextToSize(`• ${line}`, 180);
      lines.forEach((l) => {
        doc.text(l, 10, y);
        y += 6;
        if (y > 270) {
          doc.addPage();
          y = 10;
        }
      });
    });

    y += 10;
  };

  addSection("📘 Palabras", words, (w) => `${w.word} - ${w.translation}`);
  addSection("📝 Frases", phrases, (p) => `${p.phrase} - ${p.translation}`);
  addSection("📄 Textos", texts, (t) => `${t.title} - ${t.translation}`);
  addSection("🔤 Verbos", verbs, (v) => `${v.verb} - ${v.translation}`);
  addSection("🔤 Etiquetas", verbs, (v) => `${v.tags} - ${v.name}`);

  doc.save("mi-data-translator.pdf");
};
