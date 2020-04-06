import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { RadioGroup, Radio, FormControl, FormLabel } from "@material-ui/core";
import { SexType } from "../../user";
import {
  UserProfileHooks,
  FormContentProps,
} from "../../hooks/formHooks";

const NameField: React.FC<FormContentProps<string>> = ({ value, onChange, error }) => {
  const nameArray = value.split(/\s+/);
  const lastName = nameArray[0] ?? "";
  const firstName = nameArray[1] ?? "";

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

const KanaNameField: React.FC<FormContentProps<string>> = ({value, onChange, error}) => {
  const nameArray = value.split(/\s+/);
  const lastName = nameArray[0] ?? "";
  const firstName = nameArray[1] ?? "";

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
          autoComplete="lname kana"
          defaultValue={lastName}
          onBlur={(e) => {
            // eslint-disable-next-line no-irregular-whitespace
            console.log(Boolean(e.target.value.match(/^[ァ-ヶー　]+$/)));
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
          onBlur={(e) => {
            const s = e.target.value;
            // eslint-disable-next-line no-irregular-whitespace
            console.log(Boolean(s.match(/^[ァ-ヶー　]+$/)));
            // eslint-disable-next-line no-irregular-whitespace
            onChange(`${lastName} ${e.target.value.split(/\s|'　'/g)}`);
          }}
        />
      </Grid>
    </>
  );
};

const GenderField: React.FC<FormContentProps<SexType>> = ({value, onChange }) => {
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
            onChange(e.target.value as "women" | "men");
          }}
        >
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
  );
};

const PhoneNumberField: React.FC<FormContentProps<string>> = ({ value, onChange, error }) => {
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
        onBlur={(e) => {
          onChange(e.target.value);
        }}
      />
    </Grid>
  );
};

const EmailField: React.FC<FormContentProps<string>> = ({value, onChange, error}) => {
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

const FundamentalInfo: React.FC<{
  userHooks: UserProfileHooks;
}> = ({
  userHooks: {name, kana, sex, emergencyPhoneNumber, email}
}) => {
  return (
    <Grid container spacing={3}>
      <NameField {...name} />
      <KanaNameField {...kana} />
      <GenderField {...sex} />
      <PhoneNumberField
        {...emergencyPhoneNumber }
      />
      <EmailField {...email} />
    </Grid>
  );
};

export default FundamentalInfo;
