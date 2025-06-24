import { useDispatch, useSelector } from "react-redux";
import { FormControlLabel, Switch, Tooltip } from "@mui/material";
import { setUseIdiomatic } from "../store/slices/translatorSlice";

export const IdiomaticToggle = () => {
  const dispatch = useDispatch();
  const idiomatic = useSelector((state) => state.translator.idiomatic);
  console.log(idiomatic);

  return (
    <Tooltip title="Activar o desactivar expresiones idiomáticas">
      <FormControlLabel
        control={
          <Switch
            checked={idiomatic}
            onChange={() => dispatch(setUseIdiomatic(!idiomatic))}
            color="primary"
          />
        }
        label="Idiomatic"
      />
    </Tooltip>
  );
};
