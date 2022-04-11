import * as React from 'react';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionActions from '@mui/material/AccordionActions';
import { Box, Button, Divider, Typography, TextField, Grid } from '@mui/material';

const PREFIX = 'EmailTemplate';

const classes = {
  formControl: `${PREFIX}-formControl`,
  box: `${PREFIX}-box`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
  [`& .${classes.formControl}`]: {
    margin: theme.spacing(1),
    minWidth: 120,
  },

  [`& .${classes.box}`]: {
    width: '100%',
  },
}));

function EmailTemplate<T extends string>(param: {
  selected: string | undefined;
  options: {
    key: T;
    label: string;
  }[];
  values:
    | {
        subject: string;
        body: string;
      }
    | undefined;
  setSelected: (s: T) => void;
  setValues: (
    v:
      | {
          subject: string;
          body: string;
        }
      | undefined,
  ) => void;
  onClose: () => void;
  onSave: () => void;
}): JSX.Element {
  const { selected, options, values, setSelected, setValues, onClose, onSave } = param;

  const handleSelected = (event: SelectChangeEvent<unknown>) => {
    setSelected(event.target.value as T);
  };

  const handleChange = (
    kind: 'subject' | 'body',
    event: React.ChangeEvent<{
      value: unknown;
    }>,
  ) => {
    if (values)
      setValues({
        ...values,
        [kind]: event.target.value as string,
      });
  };

  return (
    <Root>
      <AccordionDetails>
        <Box display="block" className={classes.box} ml={1} mr={1}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography>各種メールの送信用テンプレートの設定です。</Typography>
            </Grid>
            <Grid item xs={6}>
              <FormControl disabled={selected === undefined}>
                <InputLabel id="period-input-label">種類</InputLabel>
                <Select labelId="period-select-label" id="period-select-label" value={selected ?? ''} onChange={handleSelected}>
                  {options.map((p) => (
                    <MenuItem key={p.key} value={p.key}>
                      {p.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="subject-field"
                label="件名"
                placeholder="例: MISWへようこそ！"
                helperText="一部変数を利用することができます(例: {{.VerificationLink}})"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={values === undefined}
                value={values?.subject ?? ''}
                onChange={(event) => handleChange('subject', event)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="body-field"
                label="本文"
                placeholder="例: 以下のリンクをクリックし、メールアドレスを認証してください。"
                helperText="一部変数を利用することができます(例: {{.VerificationLink}})"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                multiline={true}
                rows={1}
                maxRows={10}
                disabled={values === undefined}
                value={values?.body ?? ''}
                onChange={(event) => handleChange('body', event)}
              />
            </Grid>
          </Grid>
        </Box>
      </AccordionDetails>
      <Divider />
      <AccordionActions>
        <Button size="small" onClick={onClose}>
          Cancel
        </Button>
        <Button size="small" color="primary" onClick={onSave}>
          Save
        </Button>
      </AccordionActions>
    </Root>
  );
}

export default EmailTemplate;
