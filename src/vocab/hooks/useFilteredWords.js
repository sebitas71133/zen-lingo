import { useMemo } from "react";

export const useFilteredWords = (words, filters) => {
  return useMemo(() => {
    return words.filter((word) => {
      const matchesSearch =
        word.word?.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        word.translation
          ?.toLowerCase()
          .includes(filters.searchText.toLowerCase());

      const matchesType =
        !filters.type ||
        word.type?.toLowerCase() === filters.type.toLowerCase();

      const matchesTags =
        filters.selectedTags.length === 0 ||
        filters.selectedTags.every((tag) =>
          word.tags?.map((e) => e.name).includes(tag.name)
        );

      console.log({ matchesTags });
      const matchesLearned = !filters.onlyLearned || word.isLearned;

      return matchesSearch && matchesType && matchesTags && matchesLearned;
    });
  }, [words, filters]);
};
