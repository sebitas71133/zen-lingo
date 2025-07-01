import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useTagStore } from "../hooks/useTagStore";
import { useTextStore } from "../hooks/useTextStore"; // Asegúrate de tener este store

const TEXT_TYPES = ["poema", "cuento", "frase", "diálogo", "otro"];
const DEFAULT_VALUES = {
  title: "",
  originalText: "",
  translation: "",
  notes: "",
  tags: [],
  type: "",
};

const MotionBox = motion(Box);

export const TextFormDialog = ({ open, onClose, initialData }) => {
  const theme = useTheme();
  const { tags: allTags = [], isLoading: loadingTags } = useTagStore();
  const { createText, updateTextById, isAdding, isUpdating } = useTextStore();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: DEFAULT_VALUES });

  useEffect(() => {
    if (initialData) {
      reset({ ...DEFAULT_VALUES, ...initialData });
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    const payload = { ...data, updatedAt: new Date().toISOString() };
    if (initialData?.id) {
      await updateTextById(initialData.id, payload);
    } else {
      await createText({
        ...payload,
        createdAt: new Date().toISOString(),
      });
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <MotionBox
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Box
          sx={{
            backdropFilter: "blur(12px)",
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(0,0,0,0.6)"
                : "rgba(255,255,255,0.85)",
            borderRadius: 2,
          }}
        >
          <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
            {initialData?.id ? "✏️ Editar texto" : "📄 Nuevo texto"}
          </DialogTitle>

          <DialogContent dividers>
            <Stack spacing={2}>
              {/* Título */}
              <Controller
                name="title"
                control={control}
                rules={{ required: "Campo obligatorio" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Título"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />

              {/* Tipo de texto */}
              <Controller
                name="type"
                control={control}
                rules={{ required: "Campo obligatorio" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Tipo de texto"
                    fullWidth
                    error={!!errors.type}
                    helperText={errors.type?.message}
                  >
                    {TEXT_TYPES.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              {/* Texto original */}
              <Controller
                name="originalText"
                control={control}
                rules={{ required: "Campo obligatorio" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Texto en inglés"
                    multiline
                    minRows={4}
                    fullWidth
                    error={!!errors.originalText}
                    helperText={errors.originalText?.message}
                  />
                )}
              />

              {/* Traducción */}
              <Controller
                name="translation"
                control={control}
                rules={{ required: "Campo obligatorio" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Traducción"
                    multiline
                    minRows={4}
                    fullWidth
                    error={!!errors.translation}
                    helperText={errors.translation?.message}
                  />
                )}
              />

              {/* Notas */}
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Notas (opcional)"
                    multiline
                    minRows={3}
                    fullWidth
                  />
                )}
              />

              {/* Etiquetas */}
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    options={allTags}
                    getOptionLabel={(option) => option.name}
                    loading={loadingTags}
                    value={field.value || []}
                    onChange={(_, newValue) => field.onChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Etiquetas"
                        placeholder="Seleccionar etiquetas"
                      />
                    )}
                  />
                )}
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              disabled={isAdding || isUpdating}
            >
              Guardar
            </Button>
          </DialogActions>
        </Box>
      </MotionBox>
    </Dialog>
  );
};
