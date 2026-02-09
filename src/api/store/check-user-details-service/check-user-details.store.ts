import { pg } from "../../connections/postgres.connection.js";
import bcrypt from 'bcrypt';

export async function checkUserDetailsStore(username: string, password: string) {
    const query = 'SELECT id, password_hash FROM users WHERE username = $1';
    const values = [username];
    
    const res = await pg.query(query, values);
    if (res.rows.length === 0) {
        return null; // User not found
    }
    const {id, password_hash, token_version} = res.rows[0];
    const isPasswordValid = await bcrypt.compare(password, password_hash);
    if (!isPasswordValid) {
        return null; // Invalid password
    }
    return { id, token_version };
}