import { Period, EmailTemplate, EmailKind } from 'models/appconfig';

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

export interface Avatar {
    url: string;
    thumbnailUrl: string;
}

export type UpdateAppConfigInput = Readonly<
    | {
          kind: 'payment_period';
          payload: {
              readonly paymentPeriod: Period;
          };
      }
    | {
          kind: 'current_period';
          payload: {
              readonly currentPeriod: Period;
          };
      }
    | {
          kind: 'email_template';
          payload: EmailTemplate & {
              readonly emailKind: EmailKind;
          };
      }
>;
