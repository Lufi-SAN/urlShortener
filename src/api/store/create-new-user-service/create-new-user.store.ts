import { pg } from "../../connections/postgres.connection.js";


export async function createNewUserStore(username: string, passwordHash: string) {
    const query = 'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING username, created_at';
    const values = [username, passwordHash];

    const res = await pg.query(query, values);
    return res.rows[0];//MAIN GOAL: return true if user created successfully.
}