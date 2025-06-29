import { useMemo } from "react";

export const useFilteredWords = (words, filters) => {
  return useMemo(() => {
    let filtered = [...words];

    // Filtrar
    if (filters.searchText) {
      filtered = filtered.filter((word) =>
        word.word.toLowerCase().includes(filters.searchText.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter(
        (word) => word.type?.toLowerCase() === filters.type.toLowerCase()
      );
    }

    if (filters.onlyLearned) {
      filtered = filtered.filter((word) => word.isLearned);
    }

    if (filters.onlyFavorite) {
      filtered = filtered.filter((word) => word.isFavorite);
    }

    if (filters.selectedTags.length > 0) {
      const selectedTagNames = filters.selectedTags.map((tag) => tag.name);

      filtered = filtered.filter((word) =>
        word.tags?.some((tag) => selectedTagNames.includes(tag.name))
      );
    }

    // Ordenar
    if (filters.sortBy === "alphabetical") {
      filtered.sort((a, b) =>
        filters.sortOrder === "asc"
          ? a.word.localeCompare(b.word)
          : b.word.localeCompare(a.word)
      );
    }

    if (filters.sortBy === "createdAt") {
      filtered.sort((a, b) =>
        filters.sortOrder === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    return filtered;
  }, [words, filters]);
};
