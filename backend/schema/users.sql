CREATE TABLE users (
    id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
    email VARCHAR(256) NOT NULL UNIQUE,
    generation INTEGER NOT NULL,
    name VARCHAR(128) NOT NULL,
    kana VARCHAR(128) NOT NULL,
    handle VARCHAR(128) NOT NULL,
    sex VARCHAR(16) NOT NULL,

    university_name VARCHAR(256) NOT NULL,
    university_department VARCHAR(256) NOT NULL,
    university_subject VARCHAR(256) NOT NULL,

    student_id VARCHAR(128) NOT NULL,
    emergency_phone_number VARCHAR(128) NOT NULL,
    other_circles VARCHAR(512) NOT NULL,
    workshops VARCHAR(128) NOT NULL,
    squads VARCHAR(512) NOT NULL,

    slack_id VARCHAR(128),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
);

ALTER TABLE users ADD INDEX handle_index(handle);
ALTER TABLE users ADD INDEX generation_index(generation);

CREATE TABLE payment_statuses (
    id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    period INTEGER NOT NULL,
    authorizer INTEGER NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
);

ALTER TABLE payment_statuses ADD UNIQUE INDEX user_period_index(user_id, period);
