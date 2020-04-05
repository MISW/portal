import React, { useState } from "react";
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
import { UserProfile, UserValidation } from "../../user";

export const GenerationSelector: React.FC<{
  value: number;
  gen1stYear: number;
  onChange: (generation: number) => void;
}> = (props) => {
  return (
    <Grid item xs={12}>
      <FormControl component="fieldset" required>
        <FormLabel component="legend">代</FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender"
          value={props.value}
          onChange={(e) => {
            props.onChange(parseInt(e.target.value, 10));
          }}
        >
          <Grid container>
            {[props.gen1stYear, props.gen1stYear - 1, props.gen1stYear - 2].map((y: number, i: number) => (
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

export const HandleNameForm: React.FC<{
  defaultValue: string;
  valid: boolean;
  onChange: (props: string) => void;
}> = ({ defaultValue, valid, onChange }) => {
  const [edited, setEdited] = useState(false);
  const error = !valid && edited;
  return (
    <Grid item xs={12} sm={6}>
      <TextField
        required
        id="handle"
        name="handle"
        label="ハンドルネーム"
        fullWidth
        defaultValue={defaultValue}
        error={error}
        onBlur={(e) => {
          onChange(e.target.value);
          setEdited(true);
        }}
        helperText={error ? "入力されていません" : null}
      />
    </Grid>
  );
};
export const WorkshopsForm: React.FC<{
  value: string[];
  valid: boolean;
  onChange: (props: string[]) => void;
}> = ({ value, valid, onChange }) => {
  const allWorkshops = ["プログラミング", "CG", "MIDI"] as const;
  const workshops = new Set(value);

  const [edited, setEdited] = useState(false);
  const error = !valid && edited;

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
            setEdited(true);
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

export const SquadsForm: React.FC<{
  defaultValue: string[];
  onChange: (props: string[]) => void;
}> = (props) => (
  <Grid item xs={12}>
    <TextField
      id="squads"
      name="squads"
      label="班"
      fullWidth
      defaultValue={props.defaultValue}
      onChange={(e) => props.onChange(e.target.value.split(" "))}
    />
  </Grid>
);

export const OtherCircleForm: React.FC<{
  defaultValue: string;
  onChange: (props: string) => void;
}> = (props) => (
  <Grid item xs={12}>
    <TextField
      id="otherCircle"
      name="otherCircle`"
      label="ほか所属サークル"
      fullWidth
      defaultValue={props.defaultValue}
      onChange={(e) => props.onChange(e.target.value)}
    />
  </Grid>
);

const CircleInfo: React.FC<{
  user: UserProfile;
  valid: UserValidation;
  onChange: (user: UserProfile) => void;
  gen1stYear: number;
}> = ({ user, onChange, valid, gen1stYear }) => {
  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <GenerationSelector
          gen1stYear={gen1stYear}
          value={user.generation}
          onChange={(generation) => onChange({ ...user, generation })}
        />
        <HandleNameForm
          defaultValue={user.handle}
          valid={valid.handle}
          onChange={(handle) => onChange({ ...user, handle })}
        />
        <WorkshopsForm
          value={user.workshops}
          valid={valid.workshops}
          onChange={(workshops) => onChange({ ...user, workshops })}
        />
        <SquadsForm defaultValue={user.squads} onChange={(squads) => onChange({ ...user, squads })} />
        <OtherCircleForm
          defaultValue={user.other_circles}
          // eslint-disable-next-line @typescript-eslint/camelcase
          onChange={(other_circles) => onChange({ ...user, other_circles })}
        />
      </Grid>
    </React.Fragment>
  );
};

export default CircleInfo;
