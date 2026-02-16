import { pg } from "../../connections/postgres.connection.js";

export async function checkUserDetailsStore(username: string, password: string) {
    const query = 'SELECT id, password_hash, token_version FROM users WHERE username = $1';
    const values = [username];
    
    const res = await pg.query(query, values);
    return res.rows[0]
}