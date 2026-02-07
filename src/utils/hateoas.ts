import { type Request } from "express";

export function buildLinks(req: Request, linksConfig: { rel: string; path: string; method: string }[]) {
    const selfUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return linksConfig.reduce((acc, link) => {
        acc[link.rel] = {
            href: `${baseUrl}${link.path}`,
            rel: link.rel,
            method: link.method
        };
        return acc;
    }, { self : { href: selfUrl, rel: 'self', method: req.method.toUpperCase() } } as Record<string, { href: string; rel: string; method: string }>);
}

 