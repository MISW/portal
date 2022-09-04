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
) VALUES
(
    "hebi@example.com", 55, "HEBI", "ヘビ", "hebi", "male", "Foo大学", "Bar学部", "Hoge学科", "35782161", "0123456789", "", "プログラミング", "Web", "admin", "invited", "U014KLTG3CZ", NULL, 1
),
(
    "caffee@example.com", 56, "CAFFEE", "カフィ", "caffee", "female", "Foo大学", "Bar学部", "Hoge学科", "35782161", "0123456789", "", "プログラミング", "Web", "admin", "invited", "U0203QJ9683", NULL, 1
);
