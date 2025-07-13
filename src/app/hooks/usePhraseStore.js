// store/hooks/usePhraseStore.js
import {
  useAddPhraseMutation,
  useDeletePhraseMutation,
  useGetPhrasesQuery,
  useUpdatePhraseMutation,
} from "../../services";

export const usePhraseStore = () => {
  const {
    data: phrases = [],
    isLoading,
    isError,
    refetch,
  } = useGetPhrasesQuery();
  const [addPhrase, { isLoading: isAdding }] = useAddPhraseMutation();
  const [deletePhrase, { isLoading: isDeleting }] = useDeletePhraseMutation();
  const [updatePhrase, { isLoading: isUpdating }] = useUpdatePhraseMutation();

  const createPhrase = async (phraseData) => {
    return await addPhrase(phraseData).unwrap();
  };

  const deletePhraseById = async (id) => {
    return await deletePhrase(id).unwrap();
  };

  const updatePhraseById = async (id, updatedData) => {
    return await updatePhrase({ id, ...updatedData }).unwrap();
  };

  const toggleFavoriteById = async (id, updatedData) => {
    const isFavorite = updatedData?.isFavorite ?? false;

    return await updatePhrase({
      id,
      ...updatedData,
      isFavorite: !isFavorite,
    }).unwrap();
  };

  const toggleIsLearnedById = async (id, updatedData) => {
    const isLearned = updatedData?.isLearned ?? false;

    return await updatePhrase({
      id,
      ...updatedData,
      isLearned: !isLearned,
    }).unwrap();
  };

  return {
    phrases,
    isLoading,
    isError,

    refetch,
    createPhrase,
    deletePhraseById,
    updatePhraseById,
    toggleFavoriteById,
    toggleIsLearnedById,

    isAdding,
    isDeleting,
    isUpdating,
  };
};
