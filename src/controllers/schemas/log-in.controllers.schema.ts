import { userSignUpDataSchema, type UserSignUpData } from "./sign-up.controllers.schema.js";

export const userLogInDataSchema = userSignUpDataSchema.extend({})
interface UserLogInData extends UserSignUpData {}
export type { UserLogInData };
