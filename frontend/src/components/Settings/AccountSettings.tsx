import React, { useMemo } from "react";
import type { User, SexType } from "models/user";
import { Select } from "components/ui";
import { SettingsCard, SettingsCardItem } from "./SettingsCard";

type NameFieldProps = Readonly<{
  name: string;
  kana: string;
}>;
const NameField: React.VFC<NameFieldProps> = ({ name, kana }) => {
  const groupedName = useMemo(() => {
    const splittedName = name.split(/\s+/);
    const splittedKana = kana.split(/\s+/);
    const len = Math.max(splittedName.length, splittedKana.length);
    const result: { text: string; ruby?: string }[] = [];
    for (let i = 0; i < len; i++) {
      if (i < splittedName.length) {
        result.push({
          text: splittedName[i],
          ruby: splittedKana[i] ?? undefined,
        });
      } else {
        result[result.length - 1].ruby += splittedKana[i];
      }
    }
    return result;
  }, [name, kana]);

  return (
    <SettingsCardItem label="氏名">
      <span aria-label={name}>
        {groupedName.map(({ text, ruby }) => (
          <>
            <ruby className="mr-2" key={text}>
              {text}
              <rp>(</rp>
              <rt>{ruby}</rt>
              <rp>)</rp>
            </ruby>
          </>
        ))}
      </span>
    </SettingsCardItem>
  );
};

type SexFieldProps = {
  sex: SexType;
};
const SexField: React.VFC<SexFieldProps> = ({ sex }) => {
  return (
    <SettingsCardItem label="性別">
      <Select className="w-40 bg-gray-200 dark:bg-gray-800" value={sex}>
        <option value="male">男性</option>
        <option value="female">女性</option>
      </Select>
    </SettingsCardItem>
  );
};

type AccountSettingsProps = {
  readonly user?: User;
};

export const AccountSettings: React.VFC<AccountSettingsProps> = ({ user }) => {
  return (
    <SettingsCard label="アカウント設定">
      <NameField name={user?.name ?? ""} kana={user?.kana ?? ""} />
      <SexField sex={user?.sex ?? "other"} />
    </SettingsCard>
  );
};
