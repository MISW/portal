CREATE TABLE users (
    id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
    email VARCHAR(256) NOT NULL UNIQUE,
    generation INTEGER NOT NULL,
    name VARCHAR(128) NOT NULL,
    kana VARCHAR(128) NOT NULL,
    handle VARCHAR(128) NOT NULL,
    sex VARCHAR(16) NOT NULL,

    avatar_url VARCHAR(256),
    avatar_thumbnail_url VARCHAR(256),

    university_name VARCHAR(256) NOT NULL,
    university_department VARCHAR(256) NOT NULL,
    university_subject VARCHAR(256) NOT NULL,

    student_id VARCHAR(128) NOT NULL,
    emergency_phone_number VARCHAR(128) NOT NULL,
    other_circles VARCHAR(512) NOT NULL,
    workshops VARCHAR(128) NOT NULL,
    squads VARCHAR(512) NOT NULL,
    role VARCHAR(128) NOT NULL,

    account_id VARCHAR(128) UNIQUE,
    discord_id VARCHAR(128),
    twitter_screen_name VARCHAR(128),

    email_verified BOOLEAN DEFAULT 0,
    card_published BOOLEAN DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE users ADD INDEX handle_index(handle);
ALTER TABLE users ADD INDEX generation_index(generation);
ALTER TABLE users ADD INDEX role_account_id_index(role, account_id);
