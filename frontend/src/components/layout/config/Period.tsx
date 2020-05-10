import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import { Box, Button, Divider, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

const Period: React.FC<{
  title: string;
  description?: string;
  selected: number | undefined;
  setSelected: (period: number | undefined) => void;
  options: number[];
  onClose: () => void;
  onSave: () => void;
}> = ({
  title,
  description,
  selected,
  setSelected,
  options,
  onClose,
  onSave,
}) => {
  const classes = useStyles();

  const formatPeriod = (period: number) => {
    return `${Math.floor(period / 100)}年${period % 100}月`;
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelected(event.target.value as number);
  };

  return (
    <>
      <ExpansionPanelDetails>
        <Box display="block">
          <Typography>{description ?? ""}</Typography>
          <FormControl
            className={classes.formControl}
            disabled={selected === undefined}
          >
            <InputLabel id="period-input-label">{title}</InputLabel>
            <Select
              labelId="period-select-label"
              id="period-select-label"
              value={selected && options.length !== 0 ? selected : ""}
              onChange={handleChange}
            >
              {options.map((p) => (
                <MenuItem key={p} value={p}>
                  {formatPeriod(p)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </ExpansionPanelDetails>
      <Divider />
      <ExpansionPanelActions>
        <Button size="small" onClick={onClose}>
          Cancel
        </Button>
        <Button size="small" color="primary" onClick={onSave}>
          Save
        </Button>
      </ExpansionPanelActions>
    </>
  );
};

export default Period;
