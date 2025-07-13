// store/hooks/useVerbStore.js
import {
  useAddVerbMutation,
  useDeleteVerbMutation,
  useGetVerbsQuery,
  useUpdateVerbMutation,
} from "../../services";

export const useVerbStore = () => {
  const { data: verbs = [], isLoading, isError, refetch } = useGetVerbsQuery();

  const [addVerb, { isLoading: isAdding }] = useAddVerbMutation();
  const [deleteVerb, { isLoading: isDeleting }] = useDeleteVerbMutation();
  const [updateVerb, { isLoading: isUpdating }] = useUpdateVerbMutation();

  const createVerb = async (verbData) => {
    return await addVerb({
      ...verbData,
      isFavorite: false,
      isLearned: false,
    }).unwrap();
  };

  const deleteVerbById = async (id) => {
    return await deleteVerb(id).unwrap();
  };

  const updateVerbById = async (id, updatedData) => {
    return await updateVerb({ id, ...updatedData }).unwrap();
  };

  const toggleFavoriteById = async (id, currentData) => {
    const isFavorite = currentData?.isFavorite ?? false;
    return await updateVerb({
      id,
      ...currentData,
      isFavorite: !isFavorite,
    }).unwrap();
  };

  const toggleIsLearnedById = async (id, currentData) => {
    const isLearned = currentData?.isLearned ?? false;
    return await updateVerb({
      id,
      ...currentData,
      isLearned: !isLearned,
    }).unwrap();
  };

  return {
    // datos
    verbs,
    isLoading,
    isError,

    // acciones
    refetch,
    createVerb,
    deleteVerbById,
    updateVerbById,
    toggleFavoriteById,
    toggleIsLearnedById,

    // estados de carga
    isAdding,
    isDeleting,
    isUpdating,
  };
};
