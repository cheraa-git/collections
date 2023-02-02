create TABLE users(
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(255) UNIQUE,
    avatar VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    token VARCHAR(255)
);

create TABLE messages(
    id SERIAL PRIMARY KEY,
    author VARCHAR(255) REFERENCES users(name),
    recipient VARCHAR(255),
    timestamp VARCHAR(255),
    title VARCHAR(500),
    text VARCHAR(1500)
);
