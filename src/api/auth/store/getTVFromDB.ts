import { pg } from "../../connections/postgres.connection.js"

export async function getTVFromDB(userId: number) {
    const query = 'SELECT token_version FROM users WHERE id = $1';
    const values = [userId]

    const res =  await pg.query(query, values)
    return res.rows[0].token_version
}