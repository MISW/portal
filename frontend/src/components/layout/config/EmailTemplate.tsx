import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import {
  Box,
  Button,
  Divider,
  Typography,
  TextField,
  Grid,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    box: {
      width: "100%",
    },
  })
);

function EmailTemplate<T extends string>(param: {
  selected: string | undefined;
  options: { key: T; label: string }[];
  values: { subject: string; body: string } | undefined;
  setSelected: (s: T) => void;
  setValues: (v: { subject: string; body: string } | undefined) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const { selected, options, values, setSelected, setValues, onClose, onSave } =
    param;

  const classes = useStyles();

  const handleSelected = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelected(event.target.value as T);
  };

  const handleChange = (
    kind: "subject" | "body",
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    if (values) setValues({ ...values, [kind]: event.target.value as string });
  };

  return (
    <>
      <ExpansionPanelDetails>
        <Box display="block" className={classes.box} ml={1} mr={1}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography>
                各種メールの送信用テンプレートの設定です。
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <FormControl disabled={selected === undefined}>
                <InputLabel id="period-input-label">種類</InputLabel>
                <Select
                  labelId="period-select-label"
                  id="period-select-label"
                  value={selected ?? ""}
                  onChange={handleSelected}
                >
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
                value={values?.subject ?? ""}
                onChange={(event) => handleChange("subject", event)}
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
                rowsMax={10}
                disabled={values === undefined}
                value={values?.body ?? ""}
                onChange={(event) => handleChange("body", event)}
              />
            </Grid>
          </Grid>
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
}

export default EmailTemplate;
