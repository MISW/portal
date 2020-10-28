TRUNCATE users;
INSERT INTO users (
    email,
    generation,
    name,
    kana,
    handle,
    sex,

    university_name,
    university_department,
    university_subject,

    student_id,
    emergency_phone_number,
    other_circles,
    workshops,
    squads,
    role,

    slack_invitation_status,

    slack_id,
    discord_id,

    email_verified
) VALUES (
    "tsuzu@example.com", 53, "TSUZU", "ツズ", "Tsuzu", "male", "Foo大学", "Bar学部", "Hoge学科", "12345678", "0123456789", "", "プログラミング", "Web", "admin", "invited", "UAJ1882QP", NULL, 1
);
