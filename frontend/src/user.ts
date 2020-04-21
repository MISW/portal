import { isString, isObject } from "util";

export type SexType = "male" | "female" | "other";

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

export interface PaymentStatus {
  user_id: number;
  authorizer: number;
  period: number;
  created_at: string;
  updated_at: string;
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
  discord_id: string;

  slack_id: string;

  created_at: number;
  updated_at: number;
}

export type UserWithPaymentJSON = UserAllInfoJSON & {
  payment_status: PaymentStatus;
};

export type UserInfoJSON = Omit<
  UserAllInfoJSON,
  "slack_id" | "role" | "created_at" | "updated_at" | "id"
> & {
  id?: number;
  role?: RoleType;
};

export const toUserProfile = (json: UserInfoJSON) => {
  return {
    id: json.id,
    email: json.email,
    generation: json.generation,
    name: json.name,
    kana: json.kana,
    handle: json.handle,
    sex: json.sex,
    univName: json.university.name,
    department: json.university.department,
    subject: json.university.subject,
    studentId: json.student_id,
    emergencyPhoneNumber: json.emergency_phone_number,
    otherCircles: json.other_circles,
    workshops: json.workshops,
    squads: json.squads,
    discordId: json.discord_id,
    role: json.role,
  };
};

export type UserProfile = ReturnType<typeof toUserProfile>;

export const toUserInfoJSON = (p: UserProfile): UserInfoJSON => {
  return {
    id: p.id,
    email: p.email,
    generation: p.generation,
    name: p.name,
    kana: p.kana,
    handle: p.handle,
    sex: p.sex,
    university: {
      name: p.univName,
      department: p.department,
      subject: p.subject,
    },
    student_id: p.studentId,
    emergency_phone_number: p.emergencyPhoneNumber,
    other_circles: p.otherCircles,
    workshops: p.workshops,
    squads: p.squads,
    discord_id: p.discordId,
    role: p.role,
  };
};
