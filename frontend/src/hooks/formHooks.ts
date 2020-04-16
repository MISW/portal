import { useState, useCallback, useMemo } from "react";
import { UserProfile } from "../user";

type UserHook<T> = {
  value: T;
  onChange: (v: T) => void;
  error: boolean;
  valid: boolean;
  check: () => boolean;
};

export const useStateWithValidate = <T>(initialValue: T, validate?: (value: T) => boolean): UserHook<T> => {
  const [value, setValue] = useState<T>(initialValue);
  const [edited, setEdited] = useState<boolean>(false);
  const onChange = useCallback(
    (v: T) => {
      setEdited(true);
      setValue(v);
    },
    [setEdited, setValue]
  );
  const valid = useMemo(() => (validate ? validate(value) : true), [value, validate]);
  const check = useCallback(() => {
    setEdited(true);
    return valid;
  }, [setEdited, valid]);
  const error = useMemo(() => !valid && edited, [valid, edited]);
  return { value, onChange, error, valid, check };
};

// const hoge: React.FC<FormContentProp<number>> = (props) => {
//   return <></>
// };
// 上記のように使う
export interface FormContentProps<T> {
  value: T;
  onChange: (newValue: T) => void;
  error: boolean;
}

export type UserProfileHooks = { [P in keyof UserProfile]: UserHook<UserProfile[P]> };
// user情報を操作するためのフックを返す.
const useUserHooks = (genFirstYear: number, user?: Partial<UserProfile>): UserProfileHooks => {
  return {
    email: useStateWithValidate(user?.email ?? "", (value) => /^\S+@\S+$/.test(value)),
    generation: useStateWithValidate(user?.generation ?? genFirstYear),
    name: useStateWithValidate(user?.name ?? "", (value) => /^\S+\s\S+$/.test(value)),
    kana: useStateWithValidate(user?.kana ?? "", (value) => /^[ァ-ヶー]+\s[ァ-ヶー]+$/.test(value)),
    handle: useStateWithValidate(user?.handle ?? "", (value) => /^\S+$/.test(value)),
    sex: useStateWithValidate(user?.sex ?? "female"),
    univName: useStateWithValidate(user?.univName ?? "早稲田大学", (value) => /^\S+$/.test(value)),
    department: useStateWithValidate(user?.department ?? "", (value) => /^\S+$/.test(value)),
    subject: useStateWithValidate(user?.subject ?? ""),
    studentId: useStateWithValidate(user?.studentId ?? "", (value) => /^\S+$/.test(value)),
    emergencyPhoneNumber: useStateWithValidate(user?.emergencyPhoneNumber ?? "", (value) =>
      /^(0[5-9]0[0-9]{8}|0[1-9][1-9][0-9]{7})$/.test(value)
    ),
    otherCircles: useStateWithValidate(user?.otherCircles ?? ""),
    workshops: useStateWithValidate(user?.workshops ?? [], (value) => value.length !== 0),
    squads: useStateWithValidate(user?.squads ?? []),
    discordId: useStateWithValidate(user?.discordId ?? "", (value) => /^\S+#[0-9]{4}$/.test(value)),
  };
};

export type UserValidation = { [P in keyof UserProfile]: boolean };

export const useUser = (
  genFirstYear: number,
  user?: Partial<UserProfile>
): {
  user: UserProfile;
  valid: UserValidation;
  userHooks: UserProfileHooks;
} => {
  const userHooks = useUserHooks(genFirstYear, user);
  const retUser = Object.entries(userHooks).reduce(
    (prev, [k, v]) => ({ [k]: v?.value ?? true, ...prev }),
    {}
  ) as UserProfile;
  const valid = Object.entries(userHooks).reduce(
    (prev, [k, v]) => ({ [k]: v?.valid ?? true, ...prev }),
    {}
  ) as UserValidation;
  return {
    user: {
      id: user?.id,
      ...retUser,
    },
    valid,
    userHooks,
  };
};
