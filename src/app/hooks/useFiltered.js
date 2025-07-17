import { useMemo, useState } from "react";

export const useFiltered = (
  data = [],
  nameText = "",
  defaultItemsPerPage = 6
) => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [order, setOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("alphabetical");

  const [itemsPerPage, setItemsPerPageS] = useState(defaultItemsPerPage);
  const [selectedTags, setSelectedTags] = useState([]);

  const [onlyLearned, setOnlyLearned] = useState(false);
  const [onlyFavorite, setOnlyFavorite] = useState(false);

  const setItemsPerPage = (itemsPerPage) => {
    localStorage.setItem(`${nameText}_page`, itemsPerPage);
    setItemsPerPageS(itemsPerPage);
  };

  const filteredItems = useMemo(() => {
    let result = [...data];

    // Filtrar
    if (search) {
      result = result.filter((verb) =>
        verb[`${nameText}`].toLowerCase().includes(search.toLowerCase())
      );
    }

    if (type) {
      result = result.filter(
        (verb) => verb.type?.toLowerCase() === type.toLowerCase()
      );
    }

    if (onlyLearned) {
      result = result.filter((verb) => verb.isLearned);
    }

    if (onlyFavorite) {
      result = result.filter((verb) => verb.isFavorite);
    }

    if (selectedTags.length > 0) {
      const selectedTagNames = selectedTags.map((tag) => tag.name);

      result = result.filter((verb) =>
        verb.tags?.some((tag) => selectedTagNames.includes(tag.name))
      );
    }

    // Ordenamiento
    switch (sortBy) {
      case "createdAt":
        result.sort((a, b) =>
          order === "asc"
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;

      case "alphabetical":
        result.sort((a, b) =>
          order === "asc"
            ? a[`${nameText}`].localeCompare(b[`${nameText}`])
            : b[`${nameText}`].localeCompare(a[`${nameText}`])
        );
        break;

      default:
        // Por defecto, ordenar alfabéticamente
        result.sort((a, b) =>
          order === "asc"
            ? a[`${nameText}`].localeCompare(b[`${nameText}`])
            : b[`${nameText}`].localeCompare(a[`${nameText}`])
        );
        break;
    }

    return result;
  }, [
    data,
    search,
    type,
    order,
    sortBy,
    onlyLearned,
    onlyFavorite,
    selectedTags,
  ]);

  return {
    // estados
    search,
    type,
    order,
    sortBy,
    onlyLearned,
    onlyFavorite,

    itemsPerPage,

    // setters
    setSearch,
    setOrder,
    setOnlyFavorite,
    setOnlyLearned,
    setSortBy,
    setSelectedTags,
    setType,
    setItemsPerPage,

    // resultado filtrado
    filteredItems,
  };
};
