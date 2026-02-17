import { pg } from "../../connections/postgres.connection.js";

export async function getUserDBURIDataStore(id: string) {
    const query = 'SELECT u.username, short_code, original_url, (expires_at IS NOT NULL AND expires_at <= NOW()) AS is_expired, (deleted_at IS NOT NULL AND deleted_at <= NOW()) AS is_deleted, is_private FROM users u JOIN urls ON u.id = user_id WHERE u.id = $1';
    const values = [id];

    const res = await pg.query(query, values)
    return res.rows
}