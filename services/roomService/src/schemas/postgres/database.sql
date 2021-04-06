CREATE DATABASE user_details;

\c user_details

CREATE TABLE userdata(
    id SERIAL PRIMARY KEY,
    email TEXT,
    name VARCHAR(50),
    password TEXT,
    avatar VARCHAR(50)
);