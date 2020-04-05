import { useState } from "react";
import { UserProfile, SexType } from "../user";

export const useUser = (user?: UserProfile) => {
  const now = new Date();
  const businessYear = now.getFullYear() - (now.getMonth() + 1 >= 4 ? 0 : 1);
  const gen1stYear = businessYear - 1969 + 4;

  // wip
  // const [email, setEmail] = useState<string>("");
  // const [generation, setGeneration] = useState<number>(gen1stYear);
  // const [name, setName] = useState<string>("");
  // const [kana, setKana] = useState<string>("");
  // const [sex, setSex] = useState<SexType>("women");
  // const [univName, setUnivName] = useState<string>("");

  const [userState, setUserState] = useState<UserProfile>(
    user
      ? user
      : {
          email: "",
          generation: gen1stYear,
          name: "",
          kana: "",
          handle: "",
          sex: "women",
          university: {
            name: "早稲田大学",
            department: "",
            subject: "",
          },
          student_id: "",
          emergency_phone_number: "",
          other_circles: "",
          workshops: [],
          squads: [],
        }
  );
};
