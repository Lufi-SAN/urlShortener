import { type DomainError } from "../user/user.errors.js";

export class ForbiddenShortenDomainError extends Error implements DomainError {
    public code : number;
    constructor(message : string) {
        super(message),
        this.code = 403,
        this.name = 'ForbiddenShortenDomainError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}