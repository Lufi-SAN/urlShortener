export class SuccessJSON {
    constructor(public status: 'success' | 'fail' | 'error', public message: string, public data: Record<string, any> = {}, public links: Record<string, any> = {}, public meta: metaType | {}) {
    }
}

export interface metaType {
    request_id: string;
    timestamp: string;
    rate_limit: Record<string, any>;
    api_version: string;
}