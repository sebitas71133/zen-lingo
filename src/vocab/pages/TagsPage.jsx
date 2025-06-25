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
} from "@mui/material";
import {
  NoteAdd as NoteAddIcon,
  Delete as DeleteIcon,
  Label as LabelIcon,
} from "@mui/icons-material";
import Pagination from "@mui/material/Pagination";
import Swal from "sweetalert2";
import { useOutletContext } from "react-router-dom";
import {
  useAddTagMutation,
  useDeleteTagMutation,
  useGetTagsQuery,
  useUpdateTagMutation,
} from "../../services/tagsApi";
import { usePagination } from "../hooks/usePagination";

const tagColors = [
  "#E57373",
  "#64B5F6",
  "#81C784",
  "#FFD54F",
  "#BA68C8",
  "#4DB6AC",
  "#FF8A65",
  "#A1887F",
];

export const TagsPage = () => {
  // const { totalTags } = useOutletContext();

  const { data: tagsData = [], isLoading } = useGetTagsQuery();
  const [addTag] = useAddTagMutation();
  const [updateTag] = useUpdateTagMutation();
  const [deleteTag] = useDeleteTagMutation();

  console.log(tagsData);

  const [selectedTag, setSelectedTag] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const totalTags = tagsData?.length;

  const itemsPerPage = 3;

  console.log({ selectedTag });

  const {
    page: pageTags,
    setPage: setPageTags,
    totalPages: totalPagesTags,
    currentPageData: paginatedTags,
  } = usePagination(tagsData, itemsPerPage);

  console.log(paginatedTags);

  const handleOpenModal = (tag = { name: "" }) => {
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
        await updateTag(selectedTag).unwrap();
        Swal.fire(
          "Actualizado",
          "Etiqueta actualizada correctamente",
          "success"
        );
      } else {
        await addTag(selectedTag).unwrap();
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
        await deleteTag(tag.id).unwrap();
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
    <Box>
      {/* Título y botón de creación */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          variant="h4"
          component="h1"
          display="flex"
          alignItems="center"
        >
          <LabelIcon sx={{ mr: 1 }} color="primary" />
          Etiquetas
        </Typography>

        <Button
          variant="contained"
          startIcon={<NoteAddIcon />}
          onClick={() => handleOpenModal()}
        >
          Nueva etiqueta
        </Button>
      </Box>

      {/* Lista de etiquetas */}
      <Box display="flex" flexWrap="wrap" gap={1.5}>
        {paginatedTags?.length > 0 ? (
          paginatedTags.map((tag, i) => {
            const color = tagColors[i % tagColors.length];
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
    </Box>
  );
};
