import { type ErrorDataSchema } from "./schemas/error.schema.js";

export function errorData(type : string, title : string, status : number, detail : string, instance : string) : ErrorDataSchema {
    return {
        type,
        title,
        status,
        detail,
        instance
    }
}

export class ErrorJSON extends Error {
    public request_id!: string;
    public type!: string;
    public title!: string;
    public status!: number;
    public detail!: string;
    public instance!: string;
    public _links!: Record<string, unknown>;

    constructor(message: string = 'HTTP Error', request_id : string, errorData : ErrorDataSchema, link: Record<string, any> = {}) {
        super(message);
        this.request_id = request_id;
        Object.assign(this, errorData);
        this._links = link;
        Object.setPrototypeOf(this, new.target.prototype);
    }

    toJSON() {
        return {
            request_id: this.request_id,
            type: this.type,
            title: this.title,
            status: this.status,
            detail: this.detail,
            instance: this.instance,
            _links: this._links
        };
    }
}


