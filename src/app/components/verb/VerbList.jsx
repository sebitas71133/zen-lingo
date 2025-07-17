import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Swal from "sweetalert2";
import { Box, Grid, Pagination, Stack } from "@mui/material";

import { VerbCard, VerbFormDialog } from "../../components";
import { closeDialog, openDialog } from "../../../store/slices/uiSlice";

import { useFiltered, usePagination, useVerbStore } from "../../hooks";
import { SearchAndFilters } from "../common";
import { verbTypeColors } from "../../utils";

export const VerbList = ({ verbs, showFilters }) => {
  const dispatch = useDispatch();

  // Uso del hook personalizado con filtros y data filtrada
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

    setOnlyFavorite,
    setOnlyLearned,
    onlyLearned,
    onlyFavorite,

    filteredItems,
  } = useFiltered(verbs, "verb", localStorage.getItem("verb_page") ?? 6);

  //Paginacion y data para mostrar

  console.log({ verbs });

  const {
    currentPageData: currentVerbs,
    page,
    setPage,
    totalPages,
  } = usePagination(filteredItems, itemsPerPage);

  const { verbEditForm: openForm } = useSelector((state) => state.ui.dialogs);

  const {
    deleteVerbById,
    toggleFavoriteById,
    toggleIsLearnedById,
    isUpdating,
  } = useVerbStore();

  //Verbo a editar
  const [verbToEdit, setVerbToEdit] = useState(null);

  // Handles para editar, borrar, togle, etc

  const handleEdit = (verb) => {
    setVerbToEdit(verb);
    dispatch(openDialog("verbEditForm"));
  };

  const handleToggleFavorite = async (verb) => {
    await toggleFavoriteById(verb.id, verb);
  };

  const handleToggleIsLearned = async (verb) => {
    await toggleIsLearnedById(verb.id, verb);
  };

  const handleDelete = async (verb) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Vas a eliminar el verbo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      await deleteVerbById(verb.id);
      Swal.fire({
        title: "Eliminado",
        text: "El verbo fue eliminado correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  useEffect(() => {
    if (!openForm) setVerbToEdit(null);
  }, [openForm]);

  return (
    <Box sx={{ mt: 4 }}>
      <SearchAndFilters
        showFilters={showFilters}
        setSearch={setSearch}
        search={search}
        // setSortBy={setSortBy}
        // sortBy={sortBy}
        setOrder={setOrder}
        order={order}
        setItemsPerPage={setItemsPerPage}
        itemsPerPage={itemsPerPage}
        setType={setType}
        type={type}
        setSelectedTags={setSelectedTags}
        selectedTags={selectedTags}
        typeColors={verbTypeColors}
        setOnlyFavorite={setOnlyFavorite}
        setOnlyLearned={setOnlyLearned}
        onlyLearned={onlyLearned}
        onlyFavorite={onlyFavorite}
      ></SearchAndFilters>

      {/* VERB LIST */}
      <Box>
        <Grid container spacing={2}>
          {currentVerbs.map((verb) => (
            <Grid item key={verb.id} xs={12} sm={6} md={4} lg={3}>
              <VerbCard
                verb={verb}
                onEdit={() => handleEdit(verb)}
                onDelete={() => handleDelete(verb)}
                onToggleLearned={() => handleToggleIsLearned(verb)}
                onToggleFavorite={() => handleToggleFavorite(verb)}
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

        <VerbFormDialog
          open={openForm}
          onClose={() => dispatch(closeDialog("verbEditForm"))}
          initialData={verbToEdit}
        />
      </Box>
    </Box>
  );
};
