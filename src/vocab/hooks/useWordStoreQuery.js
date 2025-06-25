import {
  useAddWordMutation,
  useDeleteWordMutation,
  useGetWordsQuery,
  useUpdateWordMutation,
} from "../../services/wordApi";

export const useWordStore = () => {
  const { data: words = [], isLoading, isError, refetch } = useGetWordsQuery();
  const [addWord, { isLoading: isAdding }] = useAddWordMutation();
  const [deleteWord, { isLoading: isDeleting }] = useDeleteWordMutation();
  const [updateWord, { isLoading: isUpdating }] = useUpdateWordMutation();

  const createWord = async (wordData) => {
    await addWord(wordData);
  };

  const deleteWordById = async (id) => {
    console.log({ id });
    await deleteWord(id);
  };

  const updateWordById = async (id, updatedData) => {
    await updateWord({ id, updatedData });
  };

  return {
    words,
    isLoading,
    isError,
    refetch,
    createWord,
    deleteWordById,
    updateWordById,
    isUpdating,
    isDeleting,
    isAdding,
  };
};
