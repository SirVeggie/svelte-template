export type ServerError = {
    error: string;
    [key: string]: unknown;
};
export function isServerError(object: any): object is ServerError {
    return testType(object, ['error']);
}

export function testType(object: any, keylist: (string | ((o: any) => boolean))[]) {
    for (const key of keylist) {
        if (typeof key === 'string' && !(key in object))
            return false;
        if (typeof key === 'function' && !key(object))
            return false;
        if (typeof key !== 'string' && typeof key !== 'function')
            return false;
    }
    return true;
}