import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { RadioGroup, Radio, FormControl, FormLabel } from "@material-ui/core";
import { UserProfile, UserValidation, SexType } from "../../user";

const NameField: React.FC<{
  name: string;
  valid: boolean;
  onChange: (name: string) => void;
}> = ({ name, onChange, valid }) => {
  const nameArray = name.split(/\s+/);
  const lastName = nameArray[0] ?? "";
  const firstName = nameArray[1] ?? "";

  const [edited, setEdited] = useState(false);

  return (
    <>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="lastName"
          name="lastName"
          label="姓"
          fullWidth
          error={!valid && edited}
          defaultValue={lastName}
          autoComplete="family-name"
          onBlur={(e) => {
            // eslint-disable-next-line no-irregular-whitespace
            onChange(`${e.target.value.split(/\s|'　'/g)} ${firstName}`);
            setEdited(true);
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
          error={!valid && edited}
          onBlur={(e) => {
            // eslint-disable-next-line no-irregular-whitespace
            onChange(`${lastName} ${e.target.value.split(/\s|'　'/g)}`);
            setEdited(true);
          }}
        />
      </Grid>
    </>
  );
};

const KanaNameField: React.FC<{
  name: string;
  valid: boolean;
  onChange: (name: string) => void;
}> = ({ name, onChange, valid }) => {
  const nameArray = name.split(/\s+/);
  const lastName = nameArray[0] ?? "";
  const firstName = nameArray[1] ?? "";

  const [edited, setEdited] = useState(false);

  return (
    <>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="kanaLastName"
          name="kanaLastName"
          label="セイ"
          error={!valid && edited}
          fullWidth
          autoComplete="lname kana"
          defaultValue={lastName}
          onBlur={(e) => {
            // eslint-disable-next-line no-irregular-whitespace
            console.log(Boolean(e.target.value.match(/^[ァ-ヶー　]+$/)));
            // eslint-disable-next-line no-irregular-whitespace
            onChange(`${e.target.value.split(/\s|'　'/g)} ${firstName}`);
            setEdited(true);
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
          error={!valid && edited}
          autoComplete="fname kana"
          defaultValue={firstName}
          onBlur={(e) => {
            const s = e.target.value;
            // eslint-disable-next-line no-irregular-whitespace
            console.log(Boolean(s.match(/^[ァ-ヶー　]+$/)));
            // eslint-disable-next-line no-irregular-whitespace
            onChange(`${lastName} ${e.target.value.split(/\s|'　'/g)}`);
            setEdited(true);
          }}
        />
      </Grid>
    </>
  );
};

const GenderField: React.FC<{ sex: SexType; onChange: (gender: SexType) => void; valid: boolean }> = ({
  sex,
  onChange,
  valid,
}) => {
  const [edited, setEdited] = useState(false);
  return (
    <Grid item xs={12} sm={6}>
      <FormControl component="fieldset">
        <FormLabel component="legend" error={!valid && edited}>
          性別
        </FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender"
          value={sex}
          onChange={(e) => {
            onChange(e.target.value as "women" | "men");
            setEdited(true);
          }}
        >
          <Grid container>
            <FormControlLabel value="women" control={<Radio color="primary" />} label="女" labelPlacement="start" />
            <FormControlLabel value="men" control={<Radio color="primary" />} label="男" labelPlacement="start" />
          </Grid>
        </RadioGroup>
      </FormControl>
    </Grid>
  );
};

const PhoneNumberField: React.FC<{ phoneNumber: string; onChange: (phoneNumber: string) => void; valid: boolean }> = ({
  phoneNumber,
  valid,
  onChange,
}) => {
  const [edited, setEdited] = useState(false);
  return (
    <Grid item xs={12} sm={6}>
      <TextField
        required
        id="phone-number"
        name="address1"
        label="緊急連絡先(電話番号)"
        fullWidth
        autoComplete="tel-national"
        defaultValue={phoneNumber}
        error={!valid && edited}
        onBlur={(e) => {
          onChange(e.target.value);
          setEdited(true);
        }}
      />
    </Grid>
  );
};

const EmailField: React.FC<{ email: string; valid: boolean; onChange: (email: string) => void }> = ({
  email,
  onChange,
  valid,
}) => {
  const [edited, setEdited] = useState(false);
  return (
    <Grid item xs={12}>
      <TextField
        required
        id="email"
        name="email"
        label="メールアドレス"
        fullWidth
        autoComplete="email"
        defaultValue={email}
        error={!valid && edited}
        onBlur={(e) => {
          onChange(e.target.value);
          setEdited(true);
        }}
      />
    </Grid>
  );
};

const FundamentalInfo: React.FC<{
  user: UserProfile;
  valid: UserValidation;
  onChange: (user: UserProfile) => void;
}> = ({ user, valid, onChange }) => {
  return (
    <Grid container spacing={3}>
      <NameField name={user.name} valid={valid.name} onChange={(name: string) => onChange({ ...user, name })} />
      <KanaNameField name={user.kana} valid={valid.kana} onChange={(kana: string) => onChange({ ...user, kana })} />
      <GenderField sex={user.sex} valid={valid.sex} onChange={(sex: SexType) => onChange({ ...user, sex })} />
      <PhoneNumberField
        phoneNumber={user.emergency_phone_number}
        valid={valid.emergency_phone_number}
        onChange={(phoneNumber: string) => onChange({ ...user, emergency_phone_number: phoneNumber })}
      />
      <EmailField email={user.email} valid={valid.email} onChange={(email: string) => onChange({ ...user, email })} />
    </Grid>
  );
};

export default FundamentalInfo;
