import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { FormControl, FormLabel, RadioGroup, Radio, InputLabel, Select, MenuItem, Checkbox, ListItemText, Input } from '@material-ui/core';
import { UserForSignUp } from '../../user';

type Workshop = 'プログラミング' | 'CG' | 'MIDI';

export const GenerationSelector: React.FC<{
  value?: number
  onChange: (generation: number) => void
}> = (props) => {
  const now = new Date();
  const businessYear= now.getFullYear() - (now.getMonth() >= 4 ? 0 : 1);
  const gen1stYear = businessYear - 1969 + 4;

  return (
    <Grid item xs={12}>
      <FormControl component="fieldset" required>
        <FormLabel component="legend">代</FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender"
          value={props.value ?? gen1stYear}
          onChange={(e) => {props.onChange(parseInt(e.target.value, 10))}}
        >
          <Grid container>
            {[gen1stYear, gen1stYear - 1, gen1stYear - 2].map((y: number, i: number) => (
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
  defaultValue?: string
  onChange: (props: string) => void
}> = (props) => (
  <Grid item xs={12} sm={6}>
    <TextField
      required
      id="handle"
      name="handle"
      label="ハンドルネーム"
      fullWidth
      defaultValue={props.defaultValue ?? ''}
      onChange={(e) => props.onChange(e.target.value)}
    />
  </Grid>
);

// TODO: onChangeに対応する
export const WorkshopsForm: React.FC<{
  defaultValue?: string[]
  onChange: (props: Workshop[]) => void;
}> = (props) => {
  const [belongToWorkshop, setWorkshops] = useState<Record<Workshop, boolean>>({
    'プログラミング': true,
    'CG': false,
    'MIDI': false
  });

  return (
    <Grid item xs={12}>
      <FormControl
        required
      >
        <InputLabel id="demo-mutiple-checkbox-label">研究会(複数可)</InputLabel>
        <Select
          labelId="demo-mutiple-checkbox-label"
          id="demo-mutiple-checkbox"
          multiple
          value={Object.entries(belongToWorkshop).filter(([_, b]) => b).map(([w, _]) => w)}
          // onChange={handleChange}
          input={<Input />}
          renderValue={selected => (selected as string[]).join(', ')}
          // MenuProps={MenuProps}
        >
          {Object.entries(belongToWorkshop).map( ([workshop, isBelonging]) => (
              <MenuItem key={workshop} value={workshop}>
                <Checkbox checked={isBelonging} />
                <ListItemText primary={workshop} />
              </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
};

export const SquadsForm: React.FC<{
  defaultValue?: string[]
  onChange: (props: string[]) => void
}> = (props) => (
  <Grid item xs={12}>
    <TextField
      id="squads"
      name="squads"
      label="班"
      fullWidth
      defaultValue={props.defaultValue ?? ''}
      // TODO:
      onChange={(e) => props.onChange(e.target.value.split(' '))}
    />
  </Grid>
);

export const OtherCircleForm: React.FC<{
  defaultValue?: string
  onChange: (props: string) => void
}> = (props) => (
  <Grid item xs={12}>
    <TextField
      id="otherCircle"
      name="otherCircle`"
      label="ほか所属サークル"
      fullWidth
      defaultValue={props.defaultValue ?? ''}
      onChange={(e) => props.onChange(e.target.value)}
    />
  </Grid>
);


const CircleInfo: React.FC<{
  user: Partial<UserForSignUp>
  onChange: (user: Partial<UserForSignUp>) => void
}> = ({user, onChange}) => {
  
  return (
    <React.Fragment>
      <Grid container spacing={3}>
        {/* 代 */}
        <GenerationSelector
          value={user.generation}
          onChange={(generation) => onChange({ ...user, generation })}
        />
        {/* ハンドルネーム */}
        <HandleNameForm
          defaultValue={user.handle}
          onChange={(handle) => onChange({ ...user, handle })}
        />
        {/* 研究会 */}
        <WorkshopsForm
          defaultValue={user.workshops}
          onChange={(workshops) => onChange({ ...user, workshops })}
        />
        {/* 班 */}
        <SquadsForm
          defaultValue={user.squads}
          onChange={(squads) => onChange({ ...user, squads })}
        />
        {/* ほか所属サークル */}
        <OtherCircleForm defaultValue={user.other_circles}
          onChange={(other_circles) => onChange({ ...user, other_circles})}
        />
      </Grid>
    </React.Fragment>
  );
};

export default CircleInfo;