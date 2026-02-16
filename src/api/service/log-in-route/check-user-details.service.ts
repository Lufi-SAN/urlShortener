import { InvalidLoginCredentials, isDomainError } from "../../../domain/user/user.errors.js";
import { checkUserDetailsStore } from "../../store/check-user-details-service/check-user-details.store.js";
import bcrypt from "bcrypt"

export async function checkUserDetailsService(username: string, password: string) {
    try {
        const user = await checkUserDetailsStore(username, password);
        if (!user) {
            throw new InvalidLoginCredentials('Invalid username or password');
        }
        const {id, password_hash, token_version} = user
        const isPasswordValid = await bcrypt.compare(password, password_hash);
        if (!isPasswordValid) {
            throw new InvalidLoginCredentials('Invalid username or password');// Invalid password
        }
        return { id, token_version };
    } catch(err) {
        throw err;
    }
}