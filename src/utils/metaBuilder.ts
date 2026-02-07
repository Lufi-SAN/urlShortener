import { type Request } from "express";
import { aslStore } from "../api/logging/loggerContext.js";

export function buildMeta(req: Request) {
    return {
        request_id: aslStore.getStore()?.get('requestId') || 'unknown',
        timestamp: new Date().toISOString(),
        rate_limit: req.rateLimit ? req.rateLimit : {},
        api_version: req.path.split('/')[1] || 'unknown'
    };
}
