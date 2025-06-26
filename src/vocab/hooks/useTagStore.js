import {
  useAddTagMutation,
  useDeleteTagMutation,
  useGetTagsQuery,
  useUpdateTagMutation,
} from "../../services/tagsApi";

export const useTagStore = () => {
  const { data: tags = [], isLoading, isError, refetch } = useGetTagsQuery();
  const [addTag, { isLoading: isAdding }] = useAddTagMutation();
  const [deleteTag, { isLoading: isDeleting }] = useDeleteTagMutation();
  const [updateTag, { isLoading: isUpdating }] = useUpdateTagMutation();

  const createTag = async (tagData) => {
    return await addTag(tagData).unwrap();
  };

  const deleteTagById = async (id) => {
    return await deleteTag(id).unwrap();
  };

  const updateTagById = async (id, updatedData) => {
    return await updateTag({ id, ...updatedData }).unwrap();
  };

  return {
    tags,
    isLoading,
    isError,

    refetch,
    createTag,
    deleteTagById,
    updateTagById,

    isUpdating,
    isDeleting,
    isAdding,
  };
};
