import { type ErrorSchema} from "./schemas/error.schema.js";

export class HttpError extends Error {
    public type!: string;
    public title!: string;
    public status!: number;
    public detail?: string;
    public instance?: string;
    public _links?: Record<string, unknown>;

    constructor(message: string = 'HTTP Error', errorData : ErrorSchema, link: Record<string, any> = {}) {
        super(message);
        Object.assign(this, errorData);
        this._links = link;
    }
}

