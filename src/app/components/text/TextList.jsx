import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Swal from "sweetalert2";
import { Box, Grid, Pagination, Stack } from "@mui/material";

import { TextFormDialog } from "./TextFormDialog";

import { closeDialog, openDialog } from "../../../store/slices/uiSlice";
import { TextCard } from "./TextCard";

import {
  useFiltered,
  usePagination,
  useTextStore,
  useTagStore,
} from "../../hooks";

import { textTypeColors } from "../../utils/wordTypes";
import { SearchAndFilters } from "../common/SearchAndFilters";

export const TextList = ({ texts, showFilters }) => {
  const dispatch = useDispatch();

  // Obtener tags
  const { tags = [], isLoading } = useTagStore();

  const {
    search,
    type,
    order,
    itemsPerPage,
    selectedTags,
    setSearch,
    setType,
    setOrder,
    setItemsPerPage,
    setSelectedTags,

    filteredItems,
  } = useFiltered(texts, "title", localStorage.getItem("text_page") ?? 6);

  const {
    currentPageData: currentTexts,
    page,
    setPage,
    totalPages,
  } = usePagination(filteredItems, itemsPerPage);

  const { textEditForm: openForm } = useSelector((state) => state.ui.dialogs);

  const { deleteTextById, toggleFavoriteById, toggleIsReadById, isUpdating } =
    useTextStore();

  const [textToEdit, setTextToEdit] = useState(null);

  const handleEdit = (text) => {
    setTextToEdit(text);
    dispatch(openDialog("textEditForm"));
  };

  const handleToggleFavorite = async (text) => {
    await toggleFavoriteById(text.id, text);
  };

  const handleToggleIsRead = async (text) => {
    await toggleIsReadById(text.id, text);
  };

  const handleDelete = async (text) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Vas a eliminar el texto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      await deleteTextById(text.id);
      Swal.fire({
        title: "Eliminado",
        text: "El texto fue eliminado correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  useEffect(() => {
    if (!openForm) setTextToEdit(null);
  }, [openForm]);

  return (
    <Box sx={{ mt: 4 }}>
      <SearchAndFilters
        showFilters={showFilters}
        setSearch={setSearch}
        search={search}
        setOrder={setOrder}
        order={order}
        setItemsPerPage={setItemsPerPage}
        itemsPerPage={itemsPerPage}
        setType={setType}
        type={type}
        setSelectedTags={setSelectedTags}
        selectedTags={selectedTags}
        typeColors={textTypeColors}
      ></SearchAndFilters>

      <Grid container spacing={2}>
        {currentTexts.map((text) => (
          <Grid item key={text.id} xs={12} sm={6} md={4} lg={3}>
            <TextCard
              text={text}
              onEdit={() => handleEdit(text)}
              onDelete={() => handleDelete(text)}
              onToggleRead={() => handleToggleIsRead(text)}
              onToggleFavorite={() => handleToggleFavorite(text)}
              isUpdating={isUpdating}
            />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Stack mt={4} alignItems="center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Stack>
      )}

      <TextFormDialog
        open={openForm}
        onClose={() => dispatch(closeDialog("textEditForm"))}
        initialData={textToEdit}
      />
    </Box>
  );
};
