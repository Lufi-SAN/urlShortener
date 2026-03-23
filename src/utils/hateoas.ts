import { type Request } from "express";

export function buildLinks(req: Request, linksConfig: { rel: string; path: string; method: string }[]) {
    const selfUrl = `${process.env.APP_DOMAIN}${req.originalUrl}`;
    const baseUrl = `${process.env.APP_DOMAIN}`;
    return linksConfig.reduce((acc, link) => {
        acc[link.rel] = {
            href: `${baseUrl}${link.path}`,
            rel: link.rel,
            method: link.method
        };
        return acc;
    }, { self : { href: selfUrl, rel: 'self', method: req.method.toUpperCase() } } as Record<string, { href: string; rel: string; method: string }>);
}

 