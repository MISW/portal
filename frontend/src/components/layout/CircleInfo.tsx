import * as React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FormControl, FormLabel, RadioGroup, Radio, InputLabel, Select, MenuItem, Checkbox, ListItemText, Input, FormHelperText } from '@mui/material';
import { UserProfileHooks, FormContentProps } from '../../hooks/formHooks';
import { Alert } from '@mui/material';

export const GenerationSelector: React.FC<
  React.PropsWithChildren<
    FormContentProps<number> & {
      genFirstYear: number;
      formType: 'setting' | 'new';
    }
  >
> = ({ value, onChange, genFirstYear, formType }) => {
  return (
    <Grid item xs={12}>
      <FormControl component="fieldset" required disabled={formType === 'setting'}>
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
            {[genFirstYear, genFirstYear - 1, genFirstYear - 2, genFirstYear - 3].map((y: number, i: number) => (
              <FormControlLabel value={y} key={y} control={<Radio color="primary" />} label={`${y}代 (学部${i + 1}年)`} labelPlacement="end" />
            ))}
          </Grid>
        </RadioGroup>
      </FormControl>
    </Grid>
  );
};

export const HandleNameForm: React.FC<React.PropsWithChildren<FormContentProps<string>>> = ({ value, error, onChange }) => {
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
        helperText={error ? '入力されていません' : 'twitterアカウント名など'}
      />
    </Grid>
  );
};
export const WorkshopsForm: React.FC<React.PropsWithChildren<FormContentProps<Array<string>>>> = ({ value, error, onChange }) => {
  const allWorkshops = ['プログラミング', 'CG', 'MIDI'];
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
            e.preventDefault();
            onChange([...(e.target.value as string[])]);
          }}
          input={<Input />}
          renderValue={(selected) => (selected as string[]).join(', ')}
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

export const SquadsForm: React.FC<React.PropsWithChildren<FormContentProps<Array<string>>>> = ({ value, onChange }) => (
  <Grid item xs={12}>
    <TextField
      id="squads"
      name="squads"
      label="班"
      fullWidth
      helperText="MISWには研究会以外に様々な班が存在します。空白でもOK。"
      defaultValue={value}
      // TODO: 雑
      onChange={(e) => onChange(e.target.value.split(' '))}
    />
  </Grid>
);

export const OtherCircleForm: React.FC<React.PropsWithChildren<FormContentProps<string>>> = ({ value, onChange }) => (
  <Grid item xs={12}>
    <TextField id="otherCircle" name="otherCircle`" label="ほか所属サークル" fullWidth defaultValue={value} onChange={(e) => onChange(e.target.value)} />
  </Grid>
);

export const DiscordIdForm: React.FC<React.PropsWithChildren<FormContentProps<string>>> = ({ value, onChange, error }) => (
  <Grid item xs={12}>
    <TextField
      id="other_id"
      name="discord_id`"
      label="Discord ID: [アカウント名]#[数字4ケタ]"
      error={error}
      fullWidth
      defaultValue={value}
      helperText="公式Discordのアカウント整理に使用します"
      onChange={(e) => onChange(e.target.value)}
    />
  </Grid>
);

const CircleInfo: React.FC<
  React.PropsWithChildren<{
    userHooks: UserProfileHooks;
    genFirstYear: number;
    formType: 'setting' | 'new';
  }>
> = ({ userHooks: { generation, handle, workshops, otherCircles, squads, discordId }, genFirstYear, formType }) => {
  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <GenerationSelector genFirstYear={genFirstYear} {...generation} formType={formType} />
        <HandleNameForm {...handle} />
        <WorkshopsForm {...workshops} />
        <SquadsForm {...squads} />
        <OtherCircleForm {...otherCircles} />
        <DiscordIdForm {...discordId} />
        <Alert
          severity="info"
          style={{
            width: '100%',
          }}
        >
          ここで入力した情報は代以外あとで変えることが出来ます。
          <br />
          研究会/班は現在興味のあるものを選択してください。
        </Alert>
      </Grid>
    </React.Fragment>
  );
};

export default CircleInfo;
