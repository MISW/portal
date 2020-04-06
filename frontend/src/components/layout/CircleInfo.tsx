import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Input,
  FormHelperText,
} from "@material-ui/core";
import { UserProfileHooks, FormContentProps } from "../../hooks/formHooks";

export const GenerationSelector: React.FC<FormContentProps<number> & {genFirstYear: number}> = ({
  value, onChange, genFirstYear
}) => {
  return (
    <Grid item xs={12}>
      <FormControl component="fieldset" required>
        <FormLabel component="legend">代</FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender"
          value={value}
          onChange={(e) => {
            onChange(parseInt(e.target.value, 10));
          }}
        >
          <Grid container>
            {[genFirstYear, genFirstYear - 1, genFirstYear - 2].map((y: number, i: number) => (
              <FormControlLabel
                value={y}
                key={y}
                control={<Radio color="primary" />}
                label={`${y}代 (学部${i + 1}年)`}
                labelPlacement="start"
              />
            ))}
          </Grid>
        </RadioGroup>
      </FormControl>
    </Grid>
  );
};

export const HandleNameForm: React.FC<FormContentProps<string>> = ({ value, error, onChange }) => {
  return (
    <Grid item xs={12} sm={6}>
      <TextField
        required
        id="handle"
        name="handle"
        label="ハンドルネーム"
        fullWidth
        defaultValue={value}
        error={error}
        onBlur={(e) => {
          onChange(e.target.value);
        }}
        helperText={error ? "入力されていません" : null}
      />
    </Grid>
  );
};
export const WorkshopsForm: React.FC<FormContentProps<Array<string>>> = ({ value, error, onChange }) => {
  const allWorkshops = ["プログラミング", "CG", "MIDI"];
  const workshops = new Set(value.filter((s: string) => allWorkshops.includes(s)));

  return (
    <Grid item xs={12}>
      <FormControl required fullWidth error={error}>
        <InputLabel id="demo-multiple-checkbox-label" shrink={true}>
          研究会(複数可)
        </InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={Array.from(workshops)}
          onChange={(e) => {
            onChange([...(e.target.value as string[])]);
            console.log(e.target.value);
          }}
          input={<Input />}
          renderValue={(selected) => (selected as string[]).join(", ")}
          // MenuProps={MenuProps}
        >
          {allWorkshops.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={workshops.has(option)} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>少なくとも１つの研究会を選択してください</FormHelperText>}
      </FormControl>
    </Grid>
  );
};

export const SquadsForm: React.FC<FormContentProps<Array<string>>> = ({value, onChange}) => (
  <Grid item xs={12}>
    <TextField
      id="squads"
      name="squads"
      label="班"
      fullWidth
      defaultValue={value}
      // TODO: 雑
      onChange={(e) => onChange(e.target.value.split(" "))}
    />
  </Grid>
);

export const OtherCircleForm: React.FC<FormContentProps<string>> = ({value, onChange}) => (
  <Grid item xs={12}>
    <TextField
      id="otherCircle"
      name="otherCircle`"
      label="ほか所属サークル"
      fullWidth
      defaultValue={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </Grid>
);

const CircleInfo: React.FC<{
  userHooks: UserProfileHooks;
  genFirstYear: number;
}> = ({ userHooks: {generation ,handle, workshops, otherCircles, squads}, genFirstYear}) => {
  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <GenerationSelector
          genFirstYear={genFirstYear}
          {...generation}
        />
        <HandleNameForm
          {...handle}
        />
        <WorkshopsForm
          {...workshops}
        />
        <SquadsForm {...squads} />
        <OtherCircleForm
          {...otherCircles}
        />
      </Grid>
    </React.Fragment>
  );
};

export default CircleInfo;
