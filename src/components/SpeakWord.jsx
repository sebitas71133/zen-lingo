import React from "react";
import { handleSpeak } from "../vocab/utils/gemini/handleSpeak";
import { IconButton } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

export const SpeakWord = ({ textToSpeak }) => {
  return (
    <IconButton
      size="small"
      color="primary"
      onClick={() => handleSpeak(textToSpeak, {})}
    >
      <VolumeUpIcon fontSize="small" />
    </IconButton>
  );
};
