import { SexType, University, RoleType } from 'infra/type';

export type PaymentStatus = {
  userId: number;
  authorizer: number;
  period: number;
  createdAt: string;
  updatedAt: string;
};

export type Avatar = {
  readonly thumbnailUrl: string;
  readonly url: string;
};

export type User = {
  id: number;
  email: string;
  generation: number;
  name: string;
  kana: string;
  handle: string;
  sex: SexType;
  avatar?: Avatar;
  university: University;
  studentId: string;
  emergencyPhoneNumber: string;
  otherCircles: string;
  workshops: string[];
  squads: string[];
  role: RoleType;

  slackId: string;
  discordId?: string;
  twitterScreenName?: string;
  slackInvitationStatus: string;

  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  cardPublished: boolean;

  paymentStatus?: PaymentStatus;
};

export type UpdateUserProfileInput = Omit<
  User,
  | 'slackId'
  | 'role'
  | 'slackInvitationStatus'
  | 'createdAt'
  | 'updatedAt'
  | 'emailVerified'
  | 'id'
>;

export type SignupInput = Omit<UpdateUserProfileInput, 'cardPublished'>;
