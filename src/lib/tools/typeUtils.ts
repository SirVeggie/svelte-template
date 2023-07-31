
type Keys<T> = keyof T;
export type UnionKeys<T> = T extends unknown ? Keys<T> : never;

export type UnionPick<T, K extends UnionKeys<T>> =
  T extends unknown
    ? keyof Pick_<T, K> extends never
      ? never
      : { [P in keyof Pick_<T, K>]: Pick_<T, K>[P] }
    : never;

type Pick_<T, K> = Pick<T, Extract<keyof T, K>>;

export type UnionOmit<T, K extends UnionKeys<T>> =
  T extends unknown
    ? keyof Omit_<T, K> extends never
      ? never
      : { [P in keyof Omit_<T, K>]: Omit_<T, K>[P] }
    : never;

type Omit_<T, K> = Omit<T, Extract<keyof T, K>>;



// Type validation

export function testType(object: any, keylist: (string | ((o: any) => boolean))[]) {
    for (const key of keylist) {
        if (typeof key === "string" && !(key in object))
            return false;
        if (typeof key === "function" && !key(object))
            return false;
        if (typeof key !== "string" && typeof key !== "function")
            return false;
    }
    return true;
}

export function testp(key: string, check?: string | (() => boolean)) {
    return (object: any) => {
        if (!(key in object))
            return false;
        if (typeof check === "string")
            return typeof object[key] === check;
        return check?.() ?? true;
    };
}