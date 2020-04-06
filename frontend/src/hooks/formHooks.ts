import { useState } from "react";
import { UserProfile, SexType } from "../user";

export const useValidateAfterEdited = (valid: boolean) => {
  const [edited, setEdited] = useState(false);
  const touch = () => setEdited(true);
  const error = !valid && edited;
  return { touch, error };
};

export const useUser = (gen1stYear: number, user?: Partial<UserProfile>) => {
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [generation, setGeneration] = useState<number>(
    user?.generation ?? gen1stYear
  );
  const [name, setName] = useState<string>(user?.name ?? "");
  const [kana, setKana] = useState<string>(user?.kana ?? "");
  const [handle, setHandle] = useState<string>(user?.handle ?? "");
  const [sex, setSex] = useState<SexType>(user?.sex ?? "women");
  const [univName, setUnivName] = useState<string>(
    user?.university?.name ?? "早稲田大学"
  );
  const [department, setDepartment] = useState<string>(
    user?.university?.department ?? ""
  );
  const [subject, setSubject] = useState<string>(
    user?.university?.subject ?? ""
  );
  const [studentId, setStudentId] = useState<string>(user?.studentId ?? "");
  const [emergencyPhoneNumber, setPhoneNumber] = useState<string>(
    user?.emergencyPhoneNumber ?? ""
  );
  const [otherCircles, setOtherCircles] = useState<string>(
    user?.otherCircles ?? ""
  );
  const [workshops, setWorkshops] = useState<Array<string>>(
    user?.workshops ?? []
  );
  const [squads, setSquads] = useState<Array<string>>(user?.squads ?? []);

  const retUser: UserProfile = {
    email,
    generation,
    name,
    kana,
    handle,
    sex,
    studentId,
    emergencyPhoneNumber,
    otherCircles,
    workshops,
    squads,
    university: {
      name: univName,
      department,
      subject,
    },
  };
  return {
    user: retUser,
    setFuncs: {
      setEmail,
      setGeneration,
      setName,
      setKana,
      setHandle,
      setSex,
      setUnivName,
      setDepartment,
      setSubject,
      setStudentId,
      setPhoneNumber,
      setOtherCircles,
      setWorkshops,
      setSquads,
    },
  };
};

export type SetUserProfileFuncs = ReturnType<typeof useUser>["setFuncs"];

export type UserValidation = {
  [P in keyof Omit<UserProfile, "university">]: boolean;
} & {
  university: { [P in keyof UserProfile["university"]]: boolean };
};

export const useUserWithValidation = (
  gen1stYear: number,
  user?: Partial<UserProfile>
) => {
  const { user: u, setFuncs } = useUser(gen1stYear, user);

  const valid: UserValidation = {
    email: /^\S+@\S+$/.test(u.email),
    generation: true,
    name: /^\S+\s\S+$/.test(u.name),
    kana: /^\S+\s\S+$/.test(u.kana),
    handle: /^\S+$/.test(u.handle),
    sex: true,
    university: {
      name: /^\S+$/.test(u.university.name),
      department: /^\S+$/.test(u.university.department),
      subject: true,
    },
    studentId: /^\S+$/.test(u.studentId), // TODO: ガバガバ
    emergencyPhoneNumber: /^(0[5-9]0[0-9]{8}|0[1-9][1-9][0-9]{7})$/.test(u.emergencyPhoneNumber),
    otherCircles: true,
    workshops: u.workshops.length !== 0,
    squads: true,
  };

  return {
    user: u,
    valid,
    setFuncs,
  };
};
