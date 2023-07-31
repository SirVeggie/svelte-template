import type { Writable } from "svelte/store";

const funcs: (() => void)[] = [];
const names: string[] = [];
let init = false;

export function syncStorage() {
    init = true;
    for (const func of funcs) {
        func();
    }
    
    setTimeout(() => {
        cleanStorage();
    }, 5000);
}

export function cleanStorage() {
    const values = new Map<string, string | null>();
    for (const name of names) {
        values.set(name, localStorage.getItem(name));
    }

    localStorage.clear();

    for (const name of names) {
        const value = values.get(name);
        if (value != null) {
            localStorage.setItem(name, value);
        }
    }
}

export function addStorageSync<T>(name: string, store: Writable<T>, validator?: (x: T) => boolean) {
    names.push(name);

    if (init) {
        sync(name, store, validator);
    }

    funcs.push(() => sync(name, store, validator));
}

function sync<T>(name: string, store: Writable<T>, validator?: (x: T) => boolean) {
    const value = localStorage.getItem(name);
    if (value !== null) {
        const obj = JSON.parse(value);

        if (validator?.(obj) ?? true) {
            store.set(obj);
        } else {
            localStorage.removeItem(name);
        }
    }

    store.subscribe(x => {
        localStorage.setItem(name, JSON.stringify(x));
    });
}