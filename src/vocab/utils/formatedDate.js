export const formattedDate = (createdAt) => {
  return new Date(createdAt).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
