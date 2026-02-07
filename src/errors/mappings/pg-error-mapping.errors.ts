import { UserAlreadyExists } from "../../domain/user/user.errors.js";
import { InternalServerError } from "../../domain/shared/errors.js";

export function mapPostgresError(error: any) {
    if (error.code === '23505') {
        switch (error.constraint) {
            case 'users_username_key':
                throw new UserAlreadyExists('A user with this username already exists');
            default:
                throw new InternalServerError('An unexpected database error occurred');
        }
    }
    throw new InternalServerError('An unexpected database error occurred');
}