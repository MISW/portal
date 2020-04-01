import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { RadioGroup, Radio, FormControl, FormLabel } from "@material-ui/core";
import { UserForSignUp } from "../../user";

const FundamentalInfo: React.FC<{
  user: UserForSignUp;
  onChange: (user: UserForSignUp) => void;
}> = (props) => {
  const name = props.user.name.split(/\s+/);
  const [lastName, setLastName] = useState(name[0] ?? "");
  const [firstName, setFirstName] = useState(name[1] ?? "");

  const kanaName = props.user.kana.split(/\s+/);
  const [kanaLastName, setKanaLastName] = useState(kanaName[0] ?? "");
  const [kanaFirstName, setKanaFirstName] = useState(kanaName[1] ?? "");

  useEffect(() => {
    props.onChange({
      ...props.user,
      name: `${lastName} ${firstName}`,
      kana: `${kanaLastName} ${kanaFirstName}`,
    });
  }, [lastName, firstName, kanaLastName, kanaFirstName]);

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
            defaultValue={name[0]}
            autoComplete="family-name"
            onBlur={(e) => {
              // eslint-disable-next-line no-irregular-whitespace
              setLastName(e.target.value.split(/\s|'　'/g).join(""));
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
            defaultValue={name[1]}
            onBlur={(e) => {
              // eslint-disable-next-line no-irregular-whitespace
              setFirstName(e.target.value.split(/\s|'　'/g).join(""));
            }}
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
            defaultValue={kanaName[0]}
            onBlur={(e) => {
              // eslint-disable-next-line no-irregular-whitespace
              console.log(Boolean(e.target.value.match(/^[ァ-ヶー　]+$/)));
              // eslint-disable-next-line no-irregular-whitespace
              setKanaLastName(e.target.value.split(/\s|'　'/g).join(""));
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
            autoComplete="fname kana"
            defaultValue={kanaName[1]}
            onBlur={(e) => {
              const s = e.target.value;
              // eslint-disable-next-line no-irregular-whitespace
              console.log(Boolean(s.match(/^[ァ-ヶー　]+$/)));
              // eslint-disable-next-line no-irregular-whitespace
              setKanaFirstName(s.split(/\s|'　'/g).join(""));
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl component="fieldset">
            <FormLabel component="legend">性別</FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender"
              value={props.user.sex}
              onChange={(e) => {
                props.onChange({
                  ...props.user,
                  sex: e.target.value as "women" | "men",
                });
              }}
            >
              <Grid container>
                <FormControlLabel value="women" control={<Radio color="primary" />} label="女" labelPlacement="start" />
                <FormControlLabel value="men" control={<Radio color="primary" />} label="男" labelPlacement="start" />
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
            defaultValue={props.user.emergency_phone_number}
            onBlur={(e) =>
              props.onChange({
                ...props.user,
                // eslint-disable-next-line @typescript-eslint/camelcase
                emergency_phone_number: e.target.value,
              })
            }
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
            defaultValue={props.user.email}
            onBlur={(e) =>
              props.onChange({
                ...props.user,
                email: e.target.value,
              })
            }
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default FundamentalInfo;
