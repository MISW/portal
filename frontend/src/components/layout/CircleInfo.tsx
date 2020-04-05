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
} from "@material-ui/core";
import { UserForSignUp } from "../../user";

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
  onChange: (props: string) => void;
}> = (props) => (
  <Grid item xs={12} sm={6}>
    <TextField
      required
      id="handle"
      name="handle"
      label="ハンドルネーム"
      fullWidth
      defaultValue={props.defaultValue}
      onChange={(e) => props.onChange(e.target.value)}
    />
  </Grid>
);

export const WorkshopsForm: React.FC<{
  value: string[];
  onChange: (props: string[]) => void;
}> = (props) => {
  const allWorkshops = ["プログラミング", "CG", "MIDI"] as const;

  const workshops = new Set(props.value);

  return (
    <Grid item xs={12}>
      <FormControl required fullWidth>
        <InputLabel id="demo-mutiple-checkbox-label" shrink={true}>
          研究会(複数可)
        </InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={Array.from(workshops)}
          onChange={(e) => props.onChange([...(e.target.value as string[])])}
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
  user: UserForSignUp;
  onChange: (user: UserForSignUp) => void;
  gen1stYear: number;
}> = ({ user, onChange, gen1stYear }) => {
  return (
    <React.Fragment>
      <Grid container spacing={3}>
        {/* 代 */}
        <GenerationSelector
          gen1stYear={gen1stYear}
          value={user.generation}
          onChange={(generation) => onChange({ ...user, generation })}
        />
        {/* ハンドルネーム */}
        <HandleNameForm defaultValue={user.handle} onChange={(handle) => onChange({ ...user, handle })} />
        {/* 研究会 */}
        <WorkshopsForm value={user.workshops} onChange={(workshops) => onChange({ ...user, workshops })} />
        {/* 班 */}
        <SquadsForm defaultValue={user.squads} onChange={(squads) => onChange({ ...user, squads })} />
        {/* ほか所属サークル */}
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
