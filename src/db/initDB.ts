import * as db from 'zapatos/db'

export const initDB = async() => {
    db.sql`
    CREATE TABLE IF NOT EXISTS users{
        user_id SERIAL PRIMARY KEY,
        name	TEXT NOT NULL,
        email   TEXT NOT NULL,
        password TEXT NOT NULL,
        score   INTEGER DEFAULT 0,
        role    TEXT DEFAULT 'Player',
        isDeleted BOOLEAN DEFAULT FALSE
    };
    `
}