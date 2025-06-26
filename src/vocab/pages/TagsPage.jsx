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
} from "@mui/material";
import {
  NoteAdd as NoteAddIcon,
  Delete as DeleteIcon,
  Label as LabelIcon,
} from "@mui/icons-material";
import Pagination from "@mui/material/Pagination";
import Swal from "sweetalert2";

import AddIcon from "@mui/icons-material/Add";

import { usePagination } from "../hooks/usePagination";
import { useTagStore } from "../hooks/useTagStore";

const tagColors = [
  "#E57373", // Rojo suave
  "#F06292", // Rosa
  "#BA68C8", // Púrpura
  "#9575CD", // Lavanda
  "#64B5F6", // Azul claro
  "#4FC3F7", // Celeste
  "#4DD0E1", // Turquesa
  "#4DB6AC", // Verde azulado
  "#81C784", // Verde
  "#AED581", // Verde lima
  "#DCE775", // Lima claro
  "#FFD54F", // Amarillo
  "#FFB74D", // Naranja
  "#FF8A65", // Naranja coral
  "#A1887F", // Marrón suave
  "#90A4AE", // Gris azulado
  "#B0BEC5", // Gris claro
  "#F48FB1", // Rosa claro
  "#CE93D8", // Lila
  "#FFF176", // Amarillo suave
  "#A5D6A7", // Verde pastel
  "#81D4FA", // Azul pastel
  "#E1BEE7", // Lavanda claro
  "#B39DDB", // Morado grisáceo
];

export const TagsPage = () => {
  const {
    tags: tagsData = [],
    isLoading,
    createTag,
    updateTagById,
    deleteTagById,
  } = useTagStore();

  const [selectedTag, setSelectedTag] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 3;

  console.log({ selectedTag });

  const {
    page: pageTags,
    setPage: setPageTags,
    totalPages: totalPagesTags,
    currentPageData: paginatedTags,
  } = usePagination(tagsData, itemsPerPage);

  console.log(paginatedTags);

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
    <Container>
      {/* botón de creación */}

      <Fab
        color="primary"
        onClick={() => handleOpenModal()}
        sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 100 }}
      >
        <AddIcon />
      </Fab>

      {/* Lista de etiquetas */}
      <Box display="flex" flexWrap="wrap" gap={1.5}>
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
                  color: "#fff",
                  borderRadius: "20px",
                  "&:hover": {
                    opacity: 0.9,
                    cursor: "pointer",
                  },
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
        )}
      </Box>

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
  );
};
