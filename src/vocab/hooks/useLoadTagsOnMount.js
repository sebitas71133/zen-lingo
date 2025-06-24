import { useEffect } from "react";
import { useTagStore } from "./useTagStore";

export const useLoadTagsOnMount = () => {
  const { loadTags } = useTagStore();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        await loadTags();
      } catch (err) {
        console.error("Error cargando tags", err);
      }
    };

    fetchTags();
  }, []);
};
