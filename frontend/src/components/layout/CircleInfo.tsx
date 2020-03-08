import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { FormControl, FormLabel, RadioGroup, Radio, InputLabel, Select, MenuItem, Checkbox, ListItemText, Input } from '@material-ui/core';

type Workshop = 'プログラミング' | 'CG' | 'MIDI';

export const GenerationSelector: React.FC<{
  onChange: (generation: number) => void
}> = (props) => {
  const now = new Date();
  const businessYear= now.getFullYear() - (now.getMonth() >= 4 ? 0 : 1);
  const generationOf1stYearStu = businessYear - 1969 + 4;

  return (
    <Grid item xs={12}>
      <FormControl component="fieldset" required>
        <FormLabel component="legend">代</FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender"
          value={generationOf1stYearStu}
          onChange={(e) => {props.onChange(parseInt(e.target.value, 10))}}
        >
          <Grid container>
            {((y: number) => [y, y - 1, y - 2])(generationOf1stYearStu).map((y: number, i: number) => (
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
  onChange: (props: string) => void
}> = (props) => (
  <Grid item xs={12} sm={6}>
    <TextField
      required
      id="handle"
      name="handle"
      label="ハンドルネーム"
      fullWidth
      onChange={(e) => props.onChange(e.target.value as string)}
    />
  </Grid>
);

export const SquadsForm: React.FC<{
  onChange: (props: string[]) => void
}> = (props) => (
  <Grid item xs={12}>
    <TextField
      id="squads"
      name="squads"
      label="班"
      fullWidth
    />
  </Grid>
);

export const OtherCircleForm: React.FC<{
  onChange: (props: string) => void
}> = (props) => (
  <Grid item xs={12}>
    <TextField
      id="otherCircle"
      name="otherCircle`"
      label="ほか所属サークル"
      fullWidth
      onChange={(e) => props.onChange(e.target.value as string)}
    />
  </Grid>
);

// TODO: onChangeに対応する
export const WorkshopsForm: React.FC<{
  onChange: (props: Workshop[]) => void
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


export default function CircleInfo() {
  return (
    <React.Fragment>
      <Grid container spacing={3}>
        {/* 代 */}
        <GenerationSelector onChange={(_) => _} />
        {/* ハンドルネーム */}
        <HandleNameForm onChange={(_) => _} />
        {/* 研究会 */}
        <WorkshopsForm onChange={(_) => _} />
        {/* 班 */}
        <SquadsForm onChange={(_) => _} />
        {/* ほか所属サークル */}
        <OtherCircleForm onChange={(_) => _} />
      </Grid>
    </React.Fragment>
  );
}