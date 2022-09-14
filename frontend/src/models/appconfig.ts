export type Period = number;

export type EmailKind = 'email_verification' | 'after_registration' | 'payment_receipt' | 'payment_reminder';

export type EmailTemplate = Readonly<{
  subject: string;
  body: string;
}>;
