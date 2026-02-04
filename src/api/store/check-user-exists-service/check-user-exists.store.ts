import { pg } from "../../connections/postgres.connection.js";

export async function checkUserExistsStore(username: string) {
    const query = 'SELECT id FROM users WHERE username = $1';
    const values = [username];

    
    const res = await pg.query(query, values);
    return res.rows.length > 0;//MAIN GOAL: return true if user exists
}