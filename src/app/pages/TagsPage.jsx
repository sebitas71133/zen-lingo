import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Modal,
  CircularProgress,
  Chip,
  Tooltip,
  Paper,
  Stack,
  Fab,
  Container,
  Grid,
  MenuItem,
  Collapse,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import Pagination from "@mui/material/Pagination";
import Swal from "sweetalert2";

import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";

import { usePagination, useTagStore } from "../hooks";

import { tagColors } from "../utils";

// import { SeedWords } from "../../seed/SeedWords";
// import { SeedTags } from "../../seed/SeedTags";

export const TagsPage = () => {
  const {
    tags: tagsData = [],
    isLoading,
    createTag,
    updateTagById,
    deleteTagById,
  } = useTagStore();

  console.log({ tagsData });

  const [selectedTag, setSelectedTag] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchName, setSearchName] = useState("");

  const [order, setOrder] = useState("asc");

  const [itemsPerPage, setItemsPerPage] = useState(
    localStorage.getItem("tag_page") ?? 20
  );

  const setItemsPerPageStorage = (itemsPerPage) => {
    localStorage.setItem(`tag_page`, itemsPerPage);
    setItemsPerPage(itemsPerPage);
  };

  const [showFilters, setShowFilters] = useState(false);

  let filtered = [...tagsData];

  if (searchName) {
    filtered = filtered.filter((tag) =>
      tag.name.toLowerCase().includes(searchName.toLowerCase())
    );
  }

  if (order) {
    filtered.sort((a, b) =>
      order === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  }

  const {
    page: pageTags,
    setPage: setPageTags,
    totalPages: totalPagesTags,
    currentPageData: paginatedTags,
  } = usePagination(filtered, itemsPerPage);

  const handleOpenModal = (tag = { name: "", color: tagColors[0] }) => {
    setSelectedTag(tag);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTag(null);
    setIsModalOpen(false);
  };

  const handleSaveTag = async () => {
    if (!selectedTag.name.trim()) {
      Swal.fire(
        "Error",
        "El nombre de la etiqueta no puede estar vacío",
        "warning"
      );
      return;
    }

    try {
      if (selectedTag.id) {
        await updateTagById(selectedTag.id, selectedTag);
        Swal.fire(
          "Actualizado",
          "Etiqueta actualizada correctamente",
          "success"
        );
      } else {
        await createTag(selectedTag);
        Swal.fire("Creado", "Etiqueta creada correctamente", "success");
      }
      handleCloseModal();
    } catch (err) {
      Swal.fire(
        "Error",
        err.data?.error || "No se pudo guardar la etiqueta",
        "error"
      );
    }
  };

  const handleDeleteTag = async (tag) => {
    const confirm = await Swal.fire({
      title: `¿Eliminar "${tag.name}"?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteTagById(tag.id);
        Swal.fire("Eliminado", "Etiqueta eliminada correctamente", "success");
      } catch (err) {
        Swal.fire("Error", err.data?.error || "No se pudo eliminar", "error");
      }
    }
  };

  if (isLoading) {
    return <CircularProgress sx={{ mt: 5 }} />;
  }

  return (
    <>
      <Container sx={{ mt: 5 }}>
        {/* <SeedTags></SeedTags> */}
        {/* FILTERS */}
        <Collapse in={showFilters}>
          <Box sx={{ mb: 5 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Buscar"
                  size="small"
                  fullWidth
                  variant="outlined"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                ></TextField>
              </Grid>

              <Grid item xs={6} sm={4} md={2}>
                <TextField
                  label="Dirección"
                  select
                  size="small"
                  fullWidth
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                >
                  <MenuItem value="asc">Ascendente</MenuItem>
                  <MenuItem value="desc">Descendente</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Tooltip title="Cantidad de palabras por página">
                  <TextField
                    label="Por página"
                    select
                    size="small"
                    fullWidth
                    value={itemsPerPage}
                    onChange={(e) =>
                      setItemsPerPageStorage(Number(e.target.value))
                    }
                  >
                    {[3, 6, 9, 12, 15, 25, 40, 50].map((num) => (
                      <MenuItem key={num} value={num}>
                        {num}
                      </MenuItem>
                    ))}
                  </TextField>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>
        </Collapse>

        <Fab
          color="primary"
          onClick={() => handleOpenModal()}
          sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 100 }}
        >
          <AddIcon />
        </Fab>

        <Fab
          color="secondary"
          onClick={() => setShowFilters(!showFilters)}
          sx={{
            position: "fixed",
            bottom: 94, // un poco más arriba que el botón de crear
            right: 24,
            zIndex: 100,
          }}
        >
          <FilterListIcon />
        </Fab>

        {/* Lista de etiquetas */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            {paginatedTags?.length > 0 ? (
              paginatedTags.map((tag, i) => {
                const color = tag.color || tagColors[i % tagColors.length];
                return (
                  <Chip
                    key={tag.id}
                    label={tag.name}
                    sx={{
                      fontSize: "1rem",
                      px: 2,
                      py: 0.8,
                      backgroundColor: color,
                      color: "#0F172A",
                      borderRadius: "20px",
                      "&:hover": {
                        opacity: 0.9,
                        cursor: "pointer",
                      },
                      ml: 2,
                      mt: 2,
                    }}
                    onClick={() => handleOpenModal(tag)}
                    deleteIcon={
                      <Tooltip title="Eliminar">
                        <DeleteIcon
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTag(tag);
                          }}
                          sx={{ color: "#fff" }}
                        />
                      </Tooltip>
                    }
                    onDelete={() => {}}
                  />
                );
              })
            ) : (
              <Paper sx={{ p: 3, width: "100%", textAlign: "center" }}>
                <Typography variant="body1" mb={1}>
                  No hay etiquetas creadas aún.
                </Typography>
                <Button variant="contained" onClick={() => handleOpenModal()}>
                  Crear Etiqueta
                </Button>
              </Paper>
            )}{" "}
          </Grid>
        </Grid>

        {/* Modal de edición / creación */}
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              width: "90%",
              maxWidth: 400,
            }}
          >
            <Typography variant="h6" gutterBottom>
              {selectedTag?.id ? "Editar etiqueta" : "Nueva etiqueta"}
            </Typography>
            <TextField
              label="Nombre"
              fullWidth
              value={selectedTag?.name || ""}
              onChange={(e) =>
                setSelectedTag((prev) => ({ ...prev, name: e.target.value }))
              }
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Color
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              {tagColors.map((color) => (
                <Box
                  key={color}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: color,
                    border:
                      selectedTag?.color === color
                        ? "3px solid #000"
                        : "2px solid transparent",
                    cursor: "pointer",
                    transition: "0.2s",
                    "&:hover": {
                      opacity: 0.8,
                    },
                  }}
                  onClick={() =>
                    setSelectedTag((prev) => ({
                      ...prev,
                      color,
                    }))
                  }
                />
              ))}
            </Box>
            <Box display="flex" justifyContent="flex-end" gap={1}>
              <Button onClick={handleCloseModal}>Cancelar</Button>
              <Button variant="contained" onClick={handleSaveTag}>
                Guardar
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Paginación */}
        {totalPagesTags > 1 && (
          <Stack spacing={2} mt={5} alignItems="center">
            <Pagination
              count={totalPagesTags}
              page={pageTags}
              onChange={(_, value) => setPageTags(value)}
              color="primary"
            />
          </Stack>
        )}
      </Container>
    </>
  );
};
