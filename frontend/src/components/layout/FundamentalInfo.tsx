import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { RadioGroup, Radio, FormControl, FormLabel } from "@material-ui/core";
import { UserProfile, SexType } from "../../user";
import {
  useValidateAfterEdited,
  SetUserProfileFuncs,
  UserValidation,
} from "../../hooks/formHooks";

const NameField: React.FC<{
  name: string;
  valid: boolean;
  onChange: (name: string) => void;
}> = ({ name, onChange, valid }) => {
  const nameArray = name.split(/\s+/);
  const lastName = nameArray[0] ?? "";
  const firstName = nameArray[1] ?? "";

  const { touch, error } = useValidateAfterEdited(valid);

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
            touch();
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
            touch();
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

  const { touch, error } = useValidateAfterEdited(valid);

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
            touch();
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
            touch();
          }}
        />
      </Grid>
    </>
  );
};

const GenderField: React.FC<{
  sex: SexType;
  onChange: (gender: SexType) => void;
}> = ({ sex, onChange }) => {
  return (
    <Grid item xs={12} sm={6}>
      <FormControl component="fieldset">
        <FormLabel component="legend" required>
          性別
        </FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender"
          value={sex}
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

const PhoneNumberField: React.FC<{
  phoneNumber: string;
  onChange: (phoneNumber: string) => void;
  valid: boolean;
}> = ({ phoneNumber, valid, onChange }) => {
  const { touch, error } = useValidateAfterEdited(valid);
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
        error={error}
        onBlur={(e) => {
          onChange(e.target.value);
          touch();
        }}
      />
    </Grid>
  );
};

const EmailField: React.FC<{
  email: string;
  valid: boolean;
  onChange: (email: string) => void;
}> = ({ email, onChange, valid }) => {
  const { touch, error } = useValidateAfterEdited(valid);
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
        error={error}
        onBlur={(e) => {
          onChange(e.target.value);
          touch();
        }}
      />
    </Grid>
  );
};

const FundamentalInfo: React.FC<{
  user: UserProfile;
  valid: UserValidation;
  setFuncs: SetUserProfileFuncs;
}> = ({
  user,
  valid,
  setFuncs: { setName, setKana, setSex, setPhoneNumber, setEmail },
}) => {
  return (
    <Grid container spacing={3}>
      <NameField name={user.name} valid={valid.name} onChange={setName} />
      <KanaNameField name={user.kana} valid={valid.kana} onChange={setKana} />
      <GenderField sex={user.sex} onChange={setSex} />
      <PhoneNumberField
        phoneNumber={user.phoneNumber}
        valid={valid.phoneNumber}
        onChange={setPhoneNumber}
      />
      <EmailField email={user.email} valid={valid.email} onChange={setEmail} />
    </Grid>
  );
};

export default FundamentalInfo;
