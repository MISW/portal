export type SexType = "men" | "women" | "other";

export type RoleType =
  // 管理者(会員資格あり)
  | "admin"
  // 正式なメンバー(会員資格あり)
  | "member"
  // 引退済みのメンバー(会員資格あり)
  | "retired"
  // 未払い状態のメンバー(会員資格なし)
  | "not_member";

export interface University {
  name: string;
  department: string;
  subject: string;
}

export interface UserAllInfoJSON {
  id: number;
  email: string;
  generation: number;
  name: string;
  kana: string;
  handle: string;
  sex: SexType;
  university: University;
  student_id: string;
  emergency_phone_number: string;
  other_circles: string;
  workshops: string[];
  squads: string[];
  role: RoleType;

  slack_id: string;

  created_at: number;
  updated_at: number;
}

export type UserInfoJSON = Omit<
  UserAllInfoJSON,
  "id" | "slack_id" | "role" | "created_at" | "updated_at"
>;

export type UserProfile = Omit<
  UserInfoJSON,
  "other_circles" | "emergency_phone_number" | "student_id"
> & {
  otherCircles: UserAllInfoJSON["other_circles"];
  emergencyPhoneNumber: UserAllInfoJSON["emergency_phone_number"];
  studentId: UserAllInfoJSON["student_id"];
};

export const toUserProfile = (json: UserInfoJSON): UserProfile => {
  const toCamel = (s: string) =>
    s.replace(/([-_][a-z])/gi, (m) =>
      m.toUpperCase().replace("-", "").replace("_", "")
    );
  return Object.entries(json).reduce(
    (prev, [k, v]) => ({ ...prev, [toCamel(k)]: v }),
    {}
  ) as UserProfile;
};

export const toUserInfoJSON = (profile: UserProfile): UserInfoJSON => {
  const toSnake = (s: string) =>
    s.replace(/[\w]([A-Z])/g, (m) => m[0] + "_" + m[1]).toLowerCase();
  return Object.entries(profile).reduce(
    (prev, [k, v]) => ({ ...prev, [toSnake(k)]: v }),
    {}
  ) as UserInfoJSON;
};