import { useState } from "react";
import { UserForSignUp } from "../user";

export const useUser = (user?: UserForSignUp) => {
  const now = new Date();
  const businessYear = now.getFullYear() - (now.getMonth() + 1 >= 4 ? 0 : 1);
  const gen1stYear = businessYear - 1969 + 4;

  const [userState, setUserState] = useState<UserForSignUp>(
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
