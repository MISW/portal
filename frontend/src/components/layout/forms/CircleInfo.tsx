import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { FormControl, FormLabel, RadioGroup, Radio, InputLabel, Select, MenuItem, Checkbox, ListItemText, Input } from '@material-ui/core';

type Workshop = 'プログラミング' | 'CG' | 'MIDI';

export default function FundamentalInfo() {
  const [generation, setGeneration] = useState(55);
  const [belongToWorkshop, setWorkshops] = useState<Record<Workshop, boolean>>({
    'プログラミング': true,
    'CG': false,
    'MIDI': false
  });
  return (
    <React.Fragment>
      {/* 代,  ハンドルネーム, 研究会, 班, 他のサークル, */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">代</FormLabel>
            <RadioGroup aria-label="gender" name="gender" value={generation} onChange={(e) => {setGeneration(parseInt(e.target.value, 10));}}>
              <Grid container>
                {((y: number) => [y + 2, y + 1, y])(53).map((y: number, i: number) => (
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
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="handle"
            name="handle"
            label="ハンドルネーム"
            fullWidth
          />
        </Grid>
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
        <Grid item xs={12}>
          <TextField
            id="squads"
            name="squads"
            label="班"
            fullWidth
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}