import React, { useMemo } from "react";
import clsx from "clsx";
import {
  FieldErrors,
  Control,
  SubmitHandler,
  useController,
  useForm,
} from "react-hook-form";
import { MdEdit } from "react-icons/md";
import type { SexType } from "models/user";
import { Select, TextInput } from "components/ui";
import { SettingsCard, SettingsCardItem } from "./SettingsCard";

type AccountFormValues = {
  name: string;
  kana: string;
  sex: SexType;
  phoneNumber: string;
};
type NameFieldProps = Readonly<{
  control: Control<AccountFormValues>;
  errors: FieldErrors<AccountFormValues>;
  canEditName: boolean;
  defaultName: string;
  defaultKana: string;
}>;
const NameField: React.VFC<NameFieldProps> = ({
  control,
  errors,
  canEditName,
  defaultName,
  defaultKana,
}) => {
  const {
    field: { onChange: onNameChange, onBlur: onNameBlur, value: name },
  } = useController({
    name: "name",
    control,
    rules: {
      required: "入力が必要です",
    },
    defaultValue: defaultName,
  });

  const {
    field: { onChange: onKanaChange, onBlur: onKanaBlur, value: kana },
  } = useController({
    name: "kana",
    control,
    rules: {
      required: "入力が必要です",
      pattern: {
        value: /^[\p{Script=Katakana}\s]+$/u,
        message: "カタカナで記入してください",
      },
    },
    defaultValue: defaultKana,
  });

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
      <div className="flex flex-row justify-between items-center">
        <span aria-label={name} className="flex-1">
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
        <button
          className={clsx(
            "w-8 h-8 rounded grid place-items-center disabled:cursor-not-allowed disabled:opacity-50",
            "bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-800",
            "focus"
          )}
          title={
            canEditName
              ? "氏名を変更する"
              : "氏名を変更したい場合、管理者に連絡してください"
          }
          disabled={!canEditName}
          onClick={() => {}}
        >
          <MdEdit className="w-4 h-4 disabled:opacity-50" />
        </button>
      </div>
    </SettingsCardItem>
  );
};
type AccountSettingsProps = Readonly<{
  onSubmit?: SubmitHandler<AccountFormValues>;
  canEditName: boolean;
  defaultName: string;
  defaultKana: string;
  defaultSex: SexType;
  defaultPhoneNumber: string;
}>;
export const AccountSettings: React.VFC<AccountSettingsProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSubmit = () => {},
  canEditName,
  defaultName,
  defaultKana,
  defaultSex,
  defaultPhoneNumber,
}) => {
  const {
    register,
    handleSubmit,
    formState,
    errors,
    control,
    trigger,
  } = useForm<AccountFormValues>();
  return (
    <SettingsCard label="アカウント設定" onSubmit={handleSubmit(onSubmit)}>
      <NameField
        control={control}
        errors={errors}
        canEditName={canEditName}
        defaultName={defaultName}
        defaultKana={defaultKana}
      />
      <SettingsCardItem label="性別" htmlFor="account-settings__sex">
        <Select
          id="account-settings__sex"
          className="w-40 bg-gray-200 dark:bg-gray-800"
          name="sex"
          defaultValue={defaultSex}
          ref={register({ required: true })}
        >
          <option value="male">男性</option>
          <option value="female">女性</option>
        </Select>
      </SettingsCardItem>
      <SettingsCardItem
        label="緊急連絡先(電話番号)"
        htmlFor="account-settings__phone-number"
      >
        <TextInput
          id="account-settings__phone-number"
          className="w-full bg-gray-200 dark:bg-gray-800"
          type="tel"
          name="phoneNumber"
          defaultValue={defaultPhoneNumber}
          placeholder="01201230123"
          ref={register({
            required: "入力が必要です",
            pattern: {
              value: /^\s*[0-9]{5,20}\s*$/,
              message: "ハイフンなしの半角数字で入力してください",
            },
          })}
        />
        {errors.phoneNumber && (
          <AlertMessage>{errors.phoneNumber.message}</AlertMessage>
        )}
      </SettingsCardItem>
      <section className="w-full p-4 flex flex-row justify-end bg-gray-200 dark:bg-gray-800">
        <input
          className={clsx(
            "rounded px-4 py-2 outline-none text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700",
            "ring-blue-500 ring-offset-2 ring-offset-gray-200 dark:ring-offset-gray-800 focus:ring-2",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:text-gray-900 dark:disabled:text-white disabled:bg-gray-300 dark:disabled:bg-gray-700"
          )}
          type="submit"
          value="変更を保存"
          disabled={!formState.isDirty}
        />
      </section>
    </SettingsCard>
  );
};

const AlertMessage: React.FC<{ readonly className?: string }> = ({
  children,
  className,
}) => (
  <span role="alert" className={clsx(className, "text-red-500")}>
    {children}
  </span>
);
