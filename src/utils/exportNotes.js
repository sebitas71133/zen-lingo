import jsPDF from "jspdf";
import * as XLSX from "xlsx";
// import "jspdf-autotable";

export const exportFavoritesToJSON = (words, phrases, answers) => {
  const data = {
    palabras_favoritas: words,
    frases_favoritas: phrases,
    respuestas_favoritas: answers,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "favoritos-translator.json";
  a.click();
  URL.revokeObjectURL(url);
};

export const exportFavoritesToPDF = (words, phrases, answers) => {
  const doc = new jsPDF();
  let y = 10;

  const addSection = (title, items) => {
    doc.setFontSize(14);
    doc.text(title, 10, y);
    y += 8;
    doc.setFontSize(11);

    items.forEach((item, i) => {
      const lines = doc.splitTextToSize(`• ${item}`, 180);
      lines.forEach((line) => {
        doc.text(line, 10, y);
        y += 6;
        if (y > 270) {
          doc.addPage();
          y = 10;
        }
      });
    });

    y += 10;
  };

  addSection("📘 Palabras Favoritas", words);
  addSection("📝 Frases Favoritas", phrases);
  addSection("💬 Respuestas Favoritas", answers);

  doc.save("favoritos-translator.pdf");
};

export const exportFavoritesToExcel = (words, phrases, answers) => {
  const wb = XLSX.utils.book_new();

  const sheetWords = XLSX.utils.aoa_to_sheet(
    [["Palabras"]].concat(words.map((w) => [w]))
  );
  XLSX.utils.book_append_sheet(wb, sheetWords, "Palabras");

  const sheetPhrases = XLSX.utils.aoa_to_sheet(
    [["Frases"]].concat(phrases.map((p) => [p]))
  );
  XLSX.utils.book_append_sheet(wb, sheetPhrases, "Frases");

  const sheetAnswers = XLSX.utils.aoa_to_sheet(
    [["Respuestas"]].concat(answers.map((a) => [a]))
  );
  XLSX.utils.book_append_sheet(wb, sheetAnswers, "Respuestas");

  XLSX.writeFile(wb, "favoritos-translator.xlsx");
};
