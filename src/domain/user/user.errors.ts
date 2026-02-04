export interface DomainError {
    message: string,
    code: number,
    name: string
}

export function isDomainError(obj: Record<string, any>): obj is DomainError {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.message === 'string' &&
    typeof obj.code === 'number' &&
    typeof obj.name === 'string'
  );
}

export class BadRequestError extends Error implements DomainError {
    public code : number;
    constructor(message : string) {
        super(message),
        this.code = 400,
        this.name = 'BadRequestError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class InvalidSignUpCredentials extends Error implements DomainError {
    public code : number;
    constructor(message : string) {
        super(message),
        this.code = 422,
        this.name = 'InvalidSignUpCredentials';
        Object.setPrototypeOf(this, new.target.prototype);
    }
} 

export class UserAlreadyExists extends Error implements DomainError {
    public code : number;
    constructor(message : string) {
        super(message),
        this.code = 409,
        this.name = 'UserAlreadyExists';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}