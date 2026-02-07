import { type DomainError } from "../user/user.errors.js";

export class InternalServerError extends Error implements DomainError {
    public code : number;
    constructor(message : string) {
        super(message),
        this.code = 500,
        this.name = 'InternalServerError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}