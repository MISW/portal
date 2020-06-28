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

export interface PaymentStatusJSON {
  user_id: number;
  authorizer: number;
  period: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfileJSON {
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
  discord_id: string;
  slack_invitation_status: string;

  created_at: number;
  updated_at: number;
  email_verified: boolean;

  payment_status?: PaymentStatusJSON;
}

export type UpdateUserProfileInput = Omit<
  UserProfileJSON,
  | "slack_id"
  | "role"
  | "slack_invitation_status"
  | "created_at"
  | "email_verified"
  | "updated_at"
  | "id"
> & {
  id?: number;
  role?: RoleType;
};
