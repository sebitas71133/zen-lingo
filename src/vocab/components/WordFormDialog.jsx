import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Chip,
  Box,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { useGetTagsQuery } from "../../services/tagsApi";
import { useWordStore } from "../hooks/useWordStoreQuery";

const types = ["sustantivo", "verbo", "adjetivo", "adverbio", "expresión"];

export const WordFormDialog = ({ open, onClose, initialData }) => {
  const { createWord, updateWordById, isUpdating, isAdding } = useWordStore();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [tags, setTags] = useState([]);
  const [examples, setExamples] = useState([]);
  const [exampleInput, setExampleInput] = useState("");

  const { data: allTags = [], isLoading: loadingTags } = useGetTagsQuery();

  const onSubmit = async (data) => {
    const wordData = {
      ...data,
      tags,
      examples,
      updatedAt: new Date().toISOString(),
    };

    if (initialData?.id) {
      await updateWordById(initialData.id, wordData);
    } else {
      await createWord({
        ...wordData,
        createdAt: new Date().toISOString(),
        isLearned: false,
      });
    }

    reset();
    setTags([]);
    setExamples([]);
    onClose();
  };

  useEffect(() => {
    if (initialData) {
      const { tags, examples, ...rest } = initialData;

      Object.entries(rest).forEach(([key, value]) => {
        setValue(key, value);
      });

      if (Array.isArray(tags)) {
        setTags(
          tags.map((tag) =>
            typeof tag === "string" ? { id: tag.toLowerCase(), name: tag } : tag
          )
        );
      } else {
        setTags([]);
      }

      if (Array.isArray(examples)) {
        setExamples(examples);
      } else {
        setExamples([]);
      }
    }
  }, [initialData, setValue]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {initialData?.id ? "Editar palabra" : "Agregar palabra"}
      </DialogTitle>
      <DialogContent>
        <form>
          <Controller
            name="word"
            control={control}
            rules={{ required: "Palabra requerida" }}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Palabra"
                fullWidth
                margin="normal"
                error={!!errors.word}
                helperText={errors.word?.message}
              />
            )}
          />

          <Controller
            name="translation"
            control={control}
            rules={{ required: "Traducción requerida" }}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Traducción"
                fullWidth
                margin="normal"
                error={!!errors.translation}
                helperText={errors.translation?.message}
              />
            )}
          />

          <Controller
            name="type"
            control={control}
            rules={{ required: "Tipo requerido" }}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Tipo"
                fullWidth
                margin="normal"
                error={!!errors.type}
                helperText={errors.type?.message}
              >
                {types.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="definition"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Definición"
                fullWidth
                margin="normal"
              />
            )}
          />

          {/* 🌟 Añadir Ejemplos */}
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <TextField
              label="Añadir ejemplo"
              value={exampleInput}
              onChange={(e) => setExampleInput(e.target.value)}
              fullWidth
            />
            <Button
              variant="outlined"
              onClick={() => {
                const trimmed = exampleInput.trim();
                if (trimmed && !examples.includes(trimmed)) {
                  setExamples([...examples, trimmed]);
                  setExampleInput("");
                }
              }}
            >
              Agregar
            </Button>
          </Box>

          {/* Mostrar ejemplos */}
          <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
            {examples.map((ex, i) => (
              <Chip
                key={i}
                label={ex}
                onDelete={() =>
                  setExamples(examples.filter((_, index) => index !== i))
                }
              />
            ))}
          </Stack>

          {/* 🌈 Tags desde API */}
          <Autocomplete
            multiple
            disableCloseOnSelect
            options={allTags}
            getOptionLabel={(option) => option.name}
            loading={loadingTags}
            value={tags}
            onChange={(event, newValue) => setTags(newValue)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Etiquetas"
                placeholder="Selecciona tags"
                margin="normal"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingTags ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        {isUpdating || isAdding ? (
          <CircularProgress size={20} />
        ) : (
          <>
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              disabled={isUpdating}
              variant="contained"
              onClick={handleSubmit(onSubmit)}
            >
              Guardar
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
