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
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import React, { useEffect, useState } from "react";

import { useVerbStore } from "../../hooks/useVerbStore";
import { Controller, useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { translatorApi } from "../../utils/gemini/translatorApi";
import { SpeakWord } from "../../../components/SpeakWord";
import { useTagStore } from "../../hooks/useTagStore";

const VERB_TYPES = ["regular", "irregular"];
const DEFAULT_VALUES = {
  verb: "",
  translation: "",
  type: "",
  examples: [],
  tags: [],
  commonForms: {
    base: "",
    thirdPerson: "",
    past: "",
    pastParticiple: "",
    presentParticiple: "",
  },
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

  //Para la llamada a gemini
  const [loading, setLoading] = useState(false);

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
    reset();
  };

  const handleAutoFill = async () => {
    const translation = getValues("translation").trim();
    if (!translation) return;

    setLoading(true);
    try {
      // Llamada a API Gemini (o tu función generadora)
      const result = await translatorApi(translation, "verb");

      console.log({ result });

      if (result) {
        // Campos simples
        if (result.verb) setValue("verb", result.verb);
        // if (result.type) setValue("type", result.type);
        if (result.examples && Array.isArray(result.examples)) {
          setValue("examples", result.examples);
          setExampleInput("");
        }

        // Common forms

        if (result.commonForms) {
          const comForms = result.commonForms;

          if (comForms.base) setValue("commonForms.base", comForms.base);
          if (comForms.thirdPerson)
            setValue("commonForms.thirdPerson", comForms.thirdPerson);
          if (comForms.past) setValue("commonForms.past", comForms.past);
          if (comForms.pastParticiple)
            setValue("commonForms.pastParticiple", comForms.pastParticiple);
          if (comForms.presentParticiple)
            setValue(
              "commonForms.presentParticiple",
              comForms.presentParticiple
            );
        }

        // Conjugaciones
        if (result.conjugations) {
          const conj = result.conjugations;

          if (conj.base) setValue("conjugations.base", conj.base);
          if (conj.thirdPerson)
            setValue("conjugations.thirdPerson", conj.thirdPerson);
          if (conj.past) setValue("conjugations.past", conj.past);
          if (conj.pastParticiple)
            setValue("conjugations.pastParticiple", conj.pastParticiple);
          if (conj.presentParticiple)
            setValue("conjugations.presentParticiple", conj.presentParticiple);

          if (
            result?.tenses?.past &&
            result?.tenses?.pastParticiple &&
            result?.tenses?.present
          ) {
            const isRegular = isRegularVerb(
              result?.tenses?.past.toLowerCase().trim(),
              result?.tenses?.pastParticiple.toLowerCase().trim(),
              result?.tenses?.present.toLowerCase().trim()
            );

            setValue("type", isRegular ? "regular" : "irregular");
          } else if (result.type) {
            // Fallback si no puedes validar
            setValue("type", result.type);
          }

          // Futuro
          if (conj.future) {
            if (conj.future.simple)
              setValue("conjugations.future.simple", conj.future.simple);
            if (conj.future.goingTo)
              setValue("conjugations.future.goingTo", conj.future.goingTo);
          }

          // Modales
          if (conj.modals) {
            if (conj.modals.can)
              setValue("conjugations.modals.can", conj.modals.can);
            if (conj.modals.could)
              setValue("conjugations.modals.could", conj.modals.could);
            if (conj.modals.would)
              setValue("conjugations.modals.would", conj.modals.would);
            if (conj.modals.should)
              setValue("conjugations.modals.should", conj.modals.should);
            if (conj.modals.might)
              setValue("conjugations.modals.might", conj.modals.might);
            if (conj.modals.must)
              setValue("conjugations.modals.must", conj.modals.must);
          }
        }
      }
    } catch (error) {
      console.error("Error al autocompletar con Gemini:", error);
    } finally {
      setLoading(false);
    }
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
              {/* Traducción */}
              <Controller
                name="translation"
                control={control}
                rules={{ required: "Campo obligatorio" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Verbo en español"
                    fullWidth
                    error={!!errors.translation}
                    helperText={errors.translation?.message}
                    multiline
                    maxRows={4}
                  />
                )}
              />
              {/* Boton para autocompletar con IA */}

              {watch("translation") && (
                <Button
                  variant="outlined"
                  onClick={handleAutoFill}
                  loading={loading}
                >
                  ✨ Autocompletar con IA
                </Button>
              )}
              {/* Verbo */}

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="verb"
                    control={control}
                    rules={{ required: "Campo obligatorio" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Forma base"
                        fullWidth
                        error={!!errors.verb}
                        helperText={errors.verb?.message}
                      />
                    )}
                  />
                  <SpeakWord textToSpeak={watch("verb")} />
                </Grid>

                {[
                  { name: "thirdPerson", label: "Tercera persona" },
                  { name: "past", label: "Pasado" },
                  { name: "pastParticiple", label: "Participio pasado" },
                  { name: "presentParticiple", label: "Gerundio" },
                ].map(({ name, label }) => (
                  <Grid item xs={12} sm={4} key={name}>
                    <Controller
                      name={`commonForms.${name}`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={label}
                          multiline
                          maxRows={4}
                          fullWidth
                        />
                      )}
                    />
                    <SpeakWord textToSpeak={watch(`commonForms.${name}`)} />
                  </Grid>
                ))}
              </Grid>

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
                    multiline
                    maxRows={4}
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
                          <TextField
                            {...field}
                            label={label}
                            fullWidth
                            multiline
                            maxRows={4}
                          />
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
                          <TextField
                            {...field}
                            label={label}
                            fullWidth
                            multiline
                            maxRows={4}
                          />
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
                          <TextField
                            {...field}
                            label={label}
                            fullWidth
                            multiline
                            maxRows={4}
                          />
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
                    multiple
                    options={allTags}
                    getOptionLabel={(opt) => opt.name}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    filterSelectedOptions
                    loading={loadingTags}
                    value={field.value}
                    onChange={(_, newValue) => field.onChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Etiquetas"
                        placeholder="Selecciona..."
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingTags && <CircularProgress size={20} />}
                              {params.InputProps?.endAdornment}
                            </>
                          ),
                        }}
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

const isRegularVerb = (past, pastParticiple, base) => {
  const edForm = base + "ed";

  return past === edForm && pastParticiple === edForm;
};
