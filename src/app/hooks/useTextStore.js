import {
  useGetTextsQuery,
  useAddTextMutation,
  useUpdateTextMutation,
  useDeleteTextMutation,
} from "../../services";

export const useTextStore = () => {
  const { data: texts = [], isLoading, isError, refetch } = useGetTextsQuery();

  const [addText, { isLoading: isAdding }] = useAddTextMutation();
  const [deleteText, { isLoading: isDeleting }] = useDeleteTextMutation();
  const [updateText, { isLoading: isUpdating }] = useUpdateTextMutation();

  const createText = async (textData) => {
    return await addText({
      ...textData,

      isFavorite: false,
      isLearned: false,
    }).unwrap();
  };

  const deleteTextById = async (id) => {
    return await deleteText(id).unwrap();
  };

  const updateTextById = async (id, updatedData) => {
    return await updateText({ id, ...updatedData }).unwrap();
  };

  const toggleFavoriteById = async (id, currentData) => {
    const isFavorite = currentData?.isFavorite ?? false;
    return await updateText({
      id,
      ...currentData,
      isFavorite: !isFavorite,
    }).unwrap();
  };

  const toggleIsLearnedById = async (id, currentData) => {
    const isLearned = currentData?.isLearned ?? false;
    return await updateText({
      id,
      ...currentData,
      isLearned: !isLearned,
    }).unwrap();
  };

  return {
    // datos
    texts,
    isLoading,
    isError,

    // acciones
    refetch,
    createText,
    deleteTextById,
    updateTextById,
    toggleFavoriteById,
    toggleIsLearnedById,

    // estados de carga
    isAdding,
    isDeleting,
    isUpdating,
  };
};
