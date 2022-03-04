export type SexType = 'male' | 'female' | 'other';

export type RoleType =
  // 管理者(会員資格あり)
  | 'admin'
  // 正式なメンバー(会員資格あり)
  | 'member'
  // 引退済みのメンバー(会員資格あり)
  | 'retired'
  // 未払い状態のメンバー(会員資格なし)
  | 'not_member';

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

// 04: 春, 10: 秋
export function periodsInJapanese(period: number): string {
  const seasons = ['冬', '春', '夏', '秋'];

  return `${Math.floor(period / 100)}年${seasons[((period % 100) - 1) / 3]}`;
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
  discord_id: string;
  slack_invitation_status: string;

  created_at: number;
  updated_at: number;
  email_verified: boolean;
}

export type UserWithPaymentJSON = UserAllInfoJSON & {
  payment_status?: PaymentStatus;
};

export type UserInfoJSON = Omit<UserAllInfoJSON, 'slack_id' | 'role' | 'slack_invitation_status' | 'created_at' | 'email_verified' | 'updated_at' | 'id'> & {
  id?: number;
  role?: RoleType;
};

export type ConfigurableProfile = Omit<
  UserInfoJSON,
  'other_circles' | 'emergency_phone_number' | 'student_id' | 'university' | 'discord_id' | 'slack_invitation_status'
> & {
  otherCircles: UserAllInfoJSON['other_circles'];
  emergencyPhoneNumber: UserAllInfoJSON['emergency_phone_number'];
  studentId: UserAllInfoJSON['student_id'];
  univName: University['name'];
  department: University['department'];
  subject: University['subject'];
  discordId: UserAllInfoJSON['discord_id'];
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

export const toUserTableData = (j: UserWithPaymentJSON) => ({
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
  workshops: j.workshops.join(', '),
  squads: j.squads.join(', '),
  slackId: j.slack_id,
  discordId: j.discord_id,
  role: j.role,
  authorizer: j.payment_status?.authorizer ?? '',
  paid: j.payment_status ? 'YES' : 'NO',
  slackInvitationStatus: j.slack_invitation_status,
});

export type UserTableData = ReturnType<typeof toUserTableData>;

export const labelsInJapanese = [
  {
    id: 'id',
    label: 'ID',
  },
  {
    id: 'generation',
    label: '代',
  },
  {
    id: 'handle',
    label: 'ハンドル',
  },
  {
    id: 'paid',
    label: '支払済',
  },
  {
    id: 'authorizer',
    label: '納入確認者',
  },
  {
    id: 'role',
    label: '権限',
  },
  {
    id: 'name',
    label: '氏名',
  },
  {
    id: 'kana',
    label: 'カナ',
  },
  {
    id: 'sex',
    label: '性別',
  },
  {
    id: 'univName',
    label: '大学名',
  },
  {
    id: 'department',
    label: '学部',
  },
  {
    id: 'subject',
    label: '学科',
  },
  {
    id: 'studentId',
    label: '学籍番号',
  },
  {
    id: 'email',
    label: 'Email',
  },
  {
    id: 'emergencyPhoneNumber',
    label: '緊急連絡先',
  },
  {
    id: 'workshops',
    label: '研究会',
  },
  {
    id: 'squads',
    label: '班',
  },
  {
    id: 'otherCircles',
    label: '他サークル',
  },
  {
    id: 'slackId',
    label: 'Slack ID',
  },
  {
    id: 'discordId',
    label: 'Discord ID',
  },
];
