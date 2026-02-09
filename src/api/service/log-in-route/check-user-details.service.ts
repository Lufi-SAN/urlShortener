import { InvalidLoginCredentials } from "../../../domain/user/user.errors.js";
import { checkUserDetailsStore } from "../../store/check-user-details-service/check-user-details.store.js";
import { mapPostgresError } from "../../../errors/mappings/pg-error-mapping.errors.js";
import { DatabaseError } from "pg";

export async function checkUserDetailsService(username: string, password: string) {
    try {
        const user = await checkUserDetailsStore(username, password);
        if (!user) {
            throw new InvalidLoginCredentials('Invalid username or password');
        }
        return user;
    } catch(err) {
        if (err instanceof DatabaseError && err.code && err.constraint) {
            mapPostgresError(err);
        }
        throw err;//bcrypt & domain errors
    }
}