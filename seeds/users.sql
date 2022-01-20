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
    "tsuzu@example.com", 53, "TSUZU", "ツズ", "Tsuzu", "male", "Foo大学", "Bar学部", "Hoge学科", "12345678", "0123456789", "", "プログラミング", "Web", "admin", "invited", "UAJ1882QP", NULL, 1
),
(
    "tosuke@example.com", 54, "TOSUKE", "トスケ", "tosuke", "male", "Foo大学", "Bar学部", "Hoge学科", "35782161", "0123456789", "", "プログラミング", "Web", "admin", "invited", "UJDEJGY2V", NULL, 1
),
(
    "biraki@example.com", 53, "BIRAKI", "ビラキ", "biraki", "male", "Foo大学", "Bar学部", "Hoge学科", "35782161", "0123456789", "", "プログラミング", "Web", "admin", "invited", "UAGR0VB6X", NULL, 1
),
(
    "hebi@example.com", 55, "HEBI", "ヘビ", "hebi", "male", "Foo大学", "Bar学部", "Hoge学科", "35782161", "0123456789", "", "プログラミング", "Web", "admin", "invited", "U014KLTG3CZ", NULL, 1
),
(
    "caffeeren@example.com", 56, "CAFFEEREN", "カフィレン", "caffeeren", "male", "Foo大学", "Bar学部", "Hoge学科", "35782161", "0123456789", "", "プログラミング", "Web", "admin", "invited", "U0203QJ9683", NULL, 1
);
