CREATE TABLE payment_transactions (
    id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token VARCHAR(512) NOT NULL,

    expired_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE payment_transactions ADD INDEX user_index(user_id);
ALTER TABLE payment_transactions ADD INDEX token_index(token);
