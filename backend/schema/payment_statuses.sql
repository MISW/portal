CREATE TABLE payment_statuses (
    id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    period INTEGER NOT NULL,
    authorizer INTEGER NOT NULL,

    -- created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE payment_statuses ADD UNIQUE INDEX user_period_index(user_id, period);
ALTER TABLE payment_statuses ADD INDEX user_index(user_id);
ALTER TABLE payment_statuses ADD INDEX period_index(period);
