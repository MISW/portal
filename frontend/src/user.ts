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
  payment_status?: PaymentStatus;
};

export type UserInfoJSON = Omit<
  UserAllInfoJSON,
  "slack_id" | "role" | "created_at" | "updated_at" | "id"
> & {
  id?: number;
  role?: RoleType;
};

export type ConfigurableProfile = Omit<
  UserInfoJSON,
  | "other_circles"
  | "emergency_phone_number"
  | "student_id"
  | "university"
  | "discord_id"
> & {
  otherCircles: UserAllInfoJSON["other_circles"];
  emergencyPhoneNumber: UserAllInfoJSON["emergency_phone_number"];
  studentId: UserAllInfoJSON["student_id"];
  univName: University["name"];
  department: University["department"];
  subject: University["subject"];
  discordId: UserAllInfoJSON["discord_id"];
};

export const toUserProfile = (json: UserInfoJSON): ConfigurableProfile => {
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

export const toUserInfoJSON = (p: ConfigurableProfile): UserInfoJSON => {
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

export const toPaymentTableData = (j: UserWithPaymentJSON) => ({
  id: j.id,
  email: j.email,
  generation: j.generation,
  name: j.name,
  kana: j.kana,
  handle: j.handle,
  sex: j.sex,
  univName: j.university.name,
  department: j.university.department,
  subject: j.university.subject,
  studentId: j.student_id,
  emergencyPhoneNumber: j.emergency_phone_number,
  otherCircles: j.other_circles,
  workshops: j.workshops.join(", "),
  squads: j.squads.join(", "),
  slackId: j.slack_id,
  discordId: j.discord_id,
  role: j.role,
  authorizer: j.payment_status?.authorizer ?? "",
  paid: j.payment_status ? "YES" : "NO",
});

export type PaymentTableData = ReturnType<typeof toPaymentTableData>;

export const labelsInJapanese = {
  id: "ID",
  generation: "代",
  handle: "ハンドル",
  paid: "支払済",
  authorizer: "納入確認者",
  role: "権限",
  name: "氏名",
  kana: "カナ",
  sex: "性別",
  univName: "大学名",
  department: "学部",
  subject: "学科",
  studentId: "学籍番号",
  email: "Email",
  emergencyPhoneNumber: "緊急連絡先",
  workshops: "研究会",
  squads: "班",
  otherCircles: "他サークル",
  slackId: "Slack ID",
  discordId: "Discord ID",
};
