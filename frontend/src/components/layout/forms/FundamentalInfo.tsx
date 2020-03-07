import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { RadioGroup, Radio, FormControl, FormLabel } from '@material-ui/core';

export default function CircleInfo() {
  const [sex, setSex] = React.useState<'women' | 'men'>('women');
  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="lastName"
            name="lastName"
            label="姓"
            fullWidth
            autoComplete="family-name"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="firstName"
            name="firstName"
            label="名"
            fullWidth
            autoComplete="given-name"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="kanaLastName"
            name="kanaLastName"
            label="セイ"
            fullWidth
            autoComplete="lname kana"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="kanaFirstName"
            name="kanaFirstName"
            label="メイ"
            fullWidth
            autoComplete="fname kana"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl component="fieldset">
            <FormLabel component="legend">性別</FormLabel>
            <RadioGroup aria-label="gender" name="gender" value={sex} onChange={(e) => {setSex(e.target.value as ('women' | 'men'));}}>
              <Grid container>
                <FormControlLabel
                  value="women"
                  control={<Radio color="primary" />}
                  label="女"
                  labelPlacement="start"
                />
                <FormControlLabel
                  value="men"
                  control={<Radio color="primary" />}
                  label="男"
                  labelPlacement="start"
                />
              </Grid>
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="phone-number"
            name="address1"
            label="緊急連絡先(電話番号)"
            fullWidth
            autoComplete="tel-national"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="email"
            name="email"
            label="メールアドレス"
            fullWidth
            autoComplete="email"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
