export type Period = number;

export type EmailKind =
    | 'email_verification'
    | 'slack_invitation'
    | 'after_registration'
    | 'payment_reminder';

export type EmailTemplate = Readonly<{
    subject: string;
    body: string;
}>;
