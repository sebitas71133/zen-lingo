import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useEffect, useState } from "react";
import { useTagStore } from "../hooks/useTagStore";
import { useVerbStore } from "../hooks/useVerbStore";
import { Controller, useForm } from "react-hook-form";
import { motion } from "framer-motion";

const VERB_TYPES = ["regular", "irregular"];
const DEFAULT_VALUES = {
  verb: "",
  translation: "",
  type: "",
  examples: [],
  tags: [],
  conjugations: {
    base: "",
    thirdPerson: "",
    past: "",
    pastParticiple: "",
    presentParticiple: "",
    future: {
      simple: "",
      goingTo: "",
    },
    modals: {
      can: "",
      could: "",
      would: "",
      should: "",
      might: "",
      must: "",
    },
  },
};

const MotionBox = motion.create(Box);

export const VerbFormDialog = ({ open, onClose, initialData }) => {
  const theme = useTheme();
  const [exampleInput, setExampleInput] = useState("");

  const { tags: allTags = [], isLoading: loadingTags } = useTagStore();
  const { createVerb, updateVerbById, isAdding, isUpdating } = useVerbStore();

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: DEFAULT_VALUES });

  useEffect(() => {
    if (initialData) {
      reset({ ...DEFAULT_VALUES, ...initialData });
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [initialData, reset]);

  const handleAddExample = () => {
    const text = exampleInput.trim();
    if (!text) return;
    const exs = getValues("examples") || [];
    if (!exs.includes(text)) {
      setValue("examples", [...exs, text]);
    }
    setExampleInput("");
  };

  const handleRemoveExample = (idx) => {
    const exs = getValues("examples") || [];
    setValue(
      "examples",
      exs.filter((_, i) => i !== idx)
    );
  };

  const onSubmit = async (data) => {
    const payload = { ...data, updatedAt: new Date().toISOString() };
    if (initialData?.id) {
      await updateVerbById(initialData.id, payload);
    } else {
      await createVerb({
        ...payload,
        createdAt: new Date().toISOString(),
        isLearned: false,
        isFavorite: false,
      });
    }
    onClose();
  };

  const examples = watch("examples");

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
            {initialData?.id ? "✏️ Editar verbo" : "🆕 Nuevo verbo"}
          </DialogTitle>

          <DialogContent dividers>
            <Stack spacing={2}>
              {/* Verbo */}
              <Controller
                name="verb"
                control={control}
                rules={{ required: "Campo obligatorio" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Verbo en inglés"
                    fullWidth
                    error={!!errors.verb}
                    helperText={errors.verb?.message}
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
                    fullWidth
                    error={!!errors.translation}
                    helperText={errors.translation?.message}
                  />
                )}
              />

              {/* Tipo */}
              <Controller
                name="type"
                control={control}
                rules={{ required: "Campo obligatorio" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tipo"
                    select
                    fullWidth
                    error={!!errors.type}
                    helperText={errors.type?.message}
                  >
                    {VERB_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              {/* Ejemplos */}
              <Box>
                <Stack direction="row" spacing={1}>
                  <TextField
                    label="Ejemplo"
                    value={exampleInput}
                    onChange={(e) => setExampleInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddExample()}
                    fullWidth
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddExample}
                    disabled={!exampleInput.trim()}
                  >
                    + Añadir
                  </Button>
                </Stack>
                <Stack direction="row" flexWrap="wrap" spacing={1} mt={1}>
                  {examples?.map((ex, i) => (
                    <Chip
                      key={i}
                      label={ex}
                      onDelete={() => handleRemoveExample(i)}
                      sx={{
                        bgcolor: theme.palette.primary.light,
                        color: theme.palette.primary.contrastText,
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Conjugaciones */}

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Conjugaciones</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Formas simples */}
                  <Typography variant="subtitle1" gutterBottom>
                    Formas simples
                  </Typography>
                  <Stack spacing={1} mb={2}>
                    {[
                      { name: "base", label: "Forma base" },
                      { name: "thirdPerson", label: "Tercera persona" },
                      { name: "past", label: "Pasado" },
                      { name: "pastParticiple", label: "Participio pasado" },
                      { name: "presentParticiple", label: "Gerundio" },
                    ].map(({ name, label }) => (
                      <Controller
                        key={name}
                        name={`conjugations.${name}`}
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label={label} fullWidth />
                        )}
                      />
                    ))}
                  </Stack>

                  {/* Futuro */}
                  <Typography variant="subtitle1" gutterBottom>
                    Futuro
                  </Typography>
                  <Stack spacing={1} mb={2}>
                    {[
                      { name: "simple", label: "Futuro simple (will eat)" },
                      { name: "goingTo", label: "Going to (is going to eat)" },
                    ].map(({ name, label }) => (
                      <Controller
                        key={name}
                        name={`conjugations.future.${name}`}
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label={label} fullWidth />
                        )}
                      />
                    ))}
                  </Stack>

                  {/* Modales */}
                  <Typography variant="subtitle1" gutterBottom>
                    Modales
                  </Typography>
                  <Stack spacing={1}>
                    {[
                      { name: "can", label: "Can (puede)" },
                      { name: "could", label: "Could (podría)" },
                      { name: "would", label: "Would (haría)" },
                      { name: "should", label: "Should (debería)" },
                      { name: "might", label: "Might (podría tal vez)" },
                      { name: "must", label: "Must (debe)" },
                    ].map(({ name, label }) => (
                      <Controller
                        key={name}
                        name={`conjugations.modals.${name}`}
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label={label} fullWidth />
                        )}
                      />
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>

              {/* Tags */}
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
