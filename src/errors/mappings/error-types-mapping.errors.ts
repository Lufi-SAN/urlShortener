export const errorTypesMapping : Record<number, [string, string, number]> = {
    400 : ['#', 'Bad Request', 400],
    401 : ['#', 'Unauthorized', 401],
    403 : ['#', 'Forbidden', 403],
    404 : ['#', 'Not Found', 404],
    409 : ['#', 'Conflict', 409],
    422 : ['#', 'Unprocessable Entity', 422],
    429 : ['#', 'Too Many Requests', 429],
    500 : ['#', 'Internal Server Error', 500],
    503 : ['#', 'Service Unavailable', 503],
}

export type ErrorTypesMappingProps = [string, string, number];