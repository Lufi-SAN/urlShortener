import { type Request } from "express";

export function buildLinks(req: Request, linksConfig: { rel: string; path: string; method: string }[]) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return linksConfig.reduce((acc, link) => {
        acc[link.rel] = {
            href: `${baseUrl}${link.path}`,
            rel: link.rel,
            method: link.method
        };
        return acc;
    }, {} as Record<string, { href: string; rel: string; method: string }>);
}

 