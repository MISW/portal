import { useState, useCallback, useMemo } from "react";
import { UserProfile } from "../user";

export const useStateWithValidate = <T>(
  initialValue: T,
  validate?: (value: T) => boolean
) => {
  const [value, setValue] = useState<T>(initialValue);
  const [edited, setEdited] = useState<boolean>(false);
  const onChange = useCallback((v: T) => {
    setEdited(true);
    setValue(v);
  }, [setEdited, setValue]);
  const valid = useMemo(() => validate ? validate(value) : true, [value, validate]);
  const error = useMemo(() => !valid && edited, [valid, edited]);
  return { value, onChange, error, valid };
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

const useUserHooks = (genFirstYear: number, user?: Partial<UserProfile>) => {
  return {
    email: useStateWithValidate(user?.email ?? "", (value) => /^\S+@\S+$/.test(value)),
    generation: useStateWithValidate(user?.generation ?? genFirstYear),
    name: useStateWithValidate(user?.name ?? "", (value) => /^\S+\s\S+$/.test(value)),
    kana: useStateWithValidate(user?.kana ?? "", (value) => /^\S+\s\S+$/.test(value)),
    handle: useStateWithValidate(user?.handle ?? "", (value) => /^\S+$/.test(value)),
    sex: useStateWithValidate(user?.sex ?? "women"),
    univName: useStateWithValidate(
      user?.university?.name ?? "早稲田大学",
      (value) => /^\S+$/.test(value)
    ),
    department: useStateWithValidate(
      user?.university?.department ?? "",
      (value) => /^\S+$/.test(value)
    ),
    subject: useStateWithValidate(user?.university?.subject ?? ""),
    studentId: useStateWithValidate(user?.studentId ?? "", (value) => /^\S+$/.test(value)),
    emergencyPhoneNumber: useStateWithValidate(
      user?.emergencyPhoneNumber ?? "",
      (value) => /^(0[5-9]0[0-9]{8}|0[1-9][1-9][0-9]{7})$/.test(value)
    ),
    otherCircles: useStateWithValidate(user?.otherCircles ?? ""),
    workshops: useStateWithValidate(
      user?.workshops ?? [],
      (value) => value.length !== 0
    ),
    squads: useStateWithValidate(user?.squads ?? []),
  };
};

export type UserProfileHooks = ReturnType<typeof useUserHooks>;
export type UserValidation = { [P in keyof UserProfileHooks]: boolean };

export const useUser = (
  genFirstYear: number,
  user?: Partial<UserProfile>
): {
  user: UserProfile;
  valid: UserValidation;
  userHooks: UserProfileHooks;
} => {
  const h = useUserHooks(genFirstYear, user);
  return {
    user: {
      id: user?.id,
      email: h.email.value,
      generation: h.generation.value,
      name: h.name.value,
      kana: h.kana.value,
      handle: h.handle.value,
      sex: h.sex.value,
      university: {
        name: h.univName.value,
        department: h.department.value,
        subject: h.subject.value,
      },
      studentId: h.studentId.value,
      emergencyPhoneNumber: h.emergencyPhoneNumber.value,
      otherCircles: h.otherCircles.value,
      workshops: h.workshops.value,
      squads: h.squads.value,
    },
    valid: {
      email: h.email.valid,
      generation: h.generation.valid,
      name: h.name.valid,
      kana: h.kana.valid,
      handle: h.handle.valid,
      sex: h.sex.valid,
      univName: h.univName.valid,
      department: h.department.valid,
      subject: h.subject.valid,
      studentId: h.studentId.valid,
      emergencyPhoneNumber: h.emergencyPhoneNumber.valid,
      otherCircles: h.otherCircles.valid,
      workshops: h.workshops.valid,
      squads: h.squads.valid,
    },
    userHooks: h,
  };
};

// export const useValidateAfterEdited = (valid: boolean) => {
//   const [edited, setEdited] = useState(false);
//   const touch = () => setEdited(true);
//   const error = !valid && edited;
//   return { touch, error };
// };

// export const useUser = (gen1stYear: number, user?: Partial<UserProfile>) => {
//   const [email, setEmail] = useState<string>(user?.email ?? "");
//   const [generation, setGeneration] = useState<number>(
//     user?.generation ?? gen1stYear
//   );
//   const [name, setName] = useState<string>(user?.name ?? "");
//   const [kana, setKana] = useState<string>(user?.kana ?? "");
//   const [handle, setHandle] = useState<string>(user?.handle ?? "");
//   const [sex, setSex] = useState<SexType>(user?.sex ?? "women");
//   const [univName, setUnivName] = useState<string>(
//     user?.university?.name ?? "早稲田大学"
//   );
//   const [department, setDepartment] = useState<string>(
//     user?.university?.department ?? ""
//   );
//   const [subject, setSubject] = useState<string>(
//     user?.university?.subject ?? ""
//   );
//   const [studentId, setStudentId] = useState<string>(user?.studentId ?? "");
//   const [emergencyPhoneNumber, setPhoneNumber] = useState<string>(
//     user?.emergencyPhoneNumber ?? ""
//   );
//   const [otherCircles, setOtherCircles] = useState<string>(
//     user?.otherCircles ?? ""
//   );
//   const [workshops, setWorkshops] = useState<Array<string>>(
//     user?.workshops ?? []
//   );
//   const [squads, setSquads] = useState<Array<string>>(user?.squads ?? []);

//   const retUser: UserProfile = {
//     id: user?.id,
//     email,
//     generation,
//     name,
//     kana,
//     handle,
//     sex,
//     studentId,
//     emergencyPhoneNumber,
//     otherCircles,
//     workshops,
//     squads,
//     university: {
//       name: univName,
//       department,
//       subject,
//     },
//   };
//   return {
//     user: retUser,
//     setFuncs: {
//       setEmail,
//       setGeneration,
//       setName,
//       setKana,
//       setHandle,
//       setSex,
//       setUnivName,
//       setDepartment,
//       setSubject,
//       setStudentId,
//       setPhoneNumber,
//       setOtherCircles,
//       setWorkshops,
//       setSquads,
//     },
//   };
// };

// export type SetUserProfileFuncs = ReturnType<typeof useUser>["setFuncs"];

// export type UserValidation = {
//   [P in keyof Omit<UserProfile, "university">]: boolean;
// } & {
//   university: { [P in keyof UserProfile["university"]]: boolean };
// };

// export const useUserWithValidation = (
//   gen1stYear: number,
//   user?: Partial<UserProfile>
// ): {user: UserProfile; valid: UserValidation; setFuncs: SetUserProfileFuncs} => {
//   const { user: u, setFuncs } = useUser(gen1stYear, user);

//   const valid: UserValidation = {
//     email: /^\S+@\S+$/.test(u.email),
//     generation: true,
//     name: /^\S+\s\S+$/.test(u.name),
//     kana: /^\S+\s\S+$/.test(u.kana),
//     handle: /^\S+$/.test(u.handle),
//     sex: true,
//     university: {
//       name: /^\S+$/.test(u.university.name),
//       department: /^\S+$/.test(u.university.department),
//       subject: true,
//     },
//     studentId: /^\S+$/.test(u.studentId), // TODO: ガバガバ
//     emergencyPhoneNumber: /^(0[5-9]0[0-9]{8}|0[1-9][1-9][0-9]{7})$/.test(u.emergencyPhoneNumber),
//     otherCircles: true,
//     workshops: u.workshops.length !== 0,
//     squads: true,
//   };

//   return {
//     user: u,
//     valid,
//     setFuncs
//   };
// };
