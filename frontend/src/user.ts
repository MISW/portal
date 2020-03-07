export type SexType = 'men' | 'women' | 'other';

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
  name:       string;
  department: string;
  subject:    string;
}

export interface User {
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

export type UserDataForSignUp = Omit<User,
  | 'id'
  | 'slack_id'
  | 'role'
  | 'created_at'
  | 'updated_at'
>;
