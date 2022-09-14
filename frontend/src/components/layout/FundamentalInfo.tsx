import * as React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import { RadioGroup, Radio, FormControl, FormLabel } from '@mui/material';
import { SexType } from '../../user';
import { UserProfileHooks, FormContentProps } from '../../hooks/formHooks';
import { Alert } from '@mui/material';

const NameField: React.FC<React.PropsWithChildren<FormContentProps<string>>> = ({ value, onChange, error }) => {
  const nameArray = value.split(/\s+/);
  const lastName = nameArray[0] ?? '';
  const firstName = nameArray[1] ?? '';

  return (
    <>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="lastName"
          name="lastName"
          label="姓"
          fullWidth
          error={error}
          defaultValue={lastName}
          autoComplete="family-name"
          onBlur={(e) => {
            // eslint-disable-next-line no-irregular-whitespace
            onChange(`${e.target.value.split(/\s|'　'/g)} ${firstName}`);
          }}
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
          defaultValue={firstName}
          error={error}
          onBlur={(e) => {
            // eslint-disable-next-line no-irregular-whitespace
            onChange(`${lastName} ${e.target.value.split(/\s|'　'/g)}`);
          }}
        />
      </Grid>
    </>
  );
};

const KanaNameField: React.FC<React.PropsWithChildren<FormContentProps<string>>> = ({ value, onChange, error }) => {
  const nameArray = value.split(/\s+/);
  const lastName = nameArray[0] ?? '';
  const firstName = nameArray[1] ?? '';

  return (
    <>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="kanaLastName"
          name="kanaLastName"
          label="セイ"
          error={error}
          fullWidth
          helperText={error ? 'カタカナで記入してください' : null}
          autoComplete="lname kana"
          defaultValue={lastName}
          onChange={(e) => {
            // eslint-disable-next-line no-irregular-whitespace
            onChange(`${e.target.value.split(/\s|'　'/g)} ${firstName}`);
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="kanaFirstName"
          name="kanaFirstName"
          label="メイ"
          fullWidth
          error={error}
          autoComplete="fname kana"
          defaultValue={firstName}
          onChange={(e) => {
            // eslint-disable-next-line no-irregular-whitespace
            onChange(`${lastName} ${e.target.value.split(/\s|'　'/g)}`);
          }}
        />
      </Grid>
    </>
  );
};

const GenderField: React.FC<React.PropsWithChildren<FormContentProps<SexType>>> = ({ value, onChange }) => {
  return (
    <Grid item xs={12} sm={6}>
      <FormControl component="fieldset">
        <FormLabel component="legend" required>
          性別
        </FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender"
          value={value}
          onChange={(e) => {
            onChange(e.target.value as 'female' | 'male');
          }}
        >
          <Grid container>
            <FormControlLabel value="female" control={<Radio color="primary" />} label="女" labelPlacement="end" />
            <FormControlLabel value="male" control={<Radio color="primary" />} label="男" labelPlacement="end" />
          </Grid>
        </RadioGroup>
      </FormControl>
    </Grid>
  );
};

const PhoneNumberField: React.FC<React.PropsWithChildren<FormContentProps<string>>> = ({ value, onChange, error }) => {
  return (
    <Grid item xs={12} sm={6}>
      <TextField
        required
        id="phone-number"
        name="address1"
        label="緊急連絡先(電話番号)"
        fullWidth
        autoComplete="tel-national"
        defaultValue={value}
        helperText="半角数字ハイフンなしで入力"
        error={error}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </Grid>
  );
};

/*
const EmailField: React.FC<React.PropsWithChildren<FormContentProps<string>>> = ({ value, onChange, error }) => {
  return (
    <Grid item xs={12}>
      <TextField
        required
        id="email"
        name="email"
        label="メールアドレス"
        fullWidth
        autoComplete="email"
        defaultValue={value}
        error={error}
        onBlur={(e) => {
          onChange(e.target.value);
        }}
      />
    </Grid>
  );
};
*/

const FundamentalInfo: React.FC<
  React.PropsWithChildren<{
    userHooks: UserProfileHooks;
  }>
> = ({ userHooks: { name, kana, sex, emergencyPhoneNumber /*, email*/ } }) => {
  return (
    <>
      <Grid container spacing={3}>
        <Grid container item spacing={3}>
          <NameField {...name} />
          <KanaNameField {...kana} />
          <GenderField {...sex} />
          <PhoneNumberField {...emergencyPhoneNumber} />
          {/* <EmailField {...email} /> /*deprecated: emailは入力させるのではなくOIDCのアカウントのメアドを使う*/}
        </Grid>
        <Alert
          severity="info"
          style={{
            width: '100%',
          }}
        >
          大学に提出する資料に必要な情報です。
          <br />
          それ以外の目的で了承なく情報を使うことはありません。
        </Alert>
      </Grid>
    </>
  );
};

export default FundamentalInfo;
