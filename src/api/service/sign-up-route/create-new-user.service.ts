import bcrypt from 'bcrypt';
import { createNewUserStore } from "../../store/create-new-user-service/create-new-user.store.js";
import { mapPostgresError } from "../../../errors/mappings/pg-error-mapping.errors.js";
import { DatabaseError } from "pg";

export async function createNewUserService(username: string, password: string) {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return await createNewUserStore(username, passwordHash);
    } catch (err) {
        //I need to check pg 23505 error here and throw a UserAlreadyExists error
        if (err instanceof DatabaseError && err.code && err.constraint) {
            mapPostgresError(err);
        }
        throw err;
    }
}