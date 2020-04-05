import { useState } from "react";

export const useValidateAfterEdited = (valid: boolean) => {
  const [edited, setEdited] = useState(false);
  const touch = () => setEdited(true);
  const error = !valid && edited;
  return { touch, error };
};

// wip
// export const useUser = (user?: UserProfile) => {
//   const now = new Date();
//   const businessYear = now.getFullYear() - (now.getMonth() + 1 >= 4 ? 0 : 1);
//   const gen1stYear = businessYear - 1969 + 4;

//   const [email, setEmail] = useState<string>("");
//   const [generation, setGeneration] = useState<number>(gen1stYear);
//   const [name, setName] = useState<string>("");
//   const [kana, setKana] = useState<string>("");
//   const [sex, setSex] = useState<SexType>("women");
//   const [univName, setUnivName] = useState<string>("");
// };
