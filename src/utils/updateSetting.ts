export function updateConfig<T>(target: T, source: Partial<T>): T {
    for (const key in source) {       
        if (source[key] instanceof Object && !Array.isArray(source[key])) {
            console.log(typeof target[key] === typeof source[key])
            if(!(key in (target as any))){
                (target as any)[key] = updateConfig({} as T[Extract<keyof T, string>], source[key]!);
            }
            target[key] = updateConfig(target[key], source[key]!);
        } else {
            target[key]! = source[key]!;
        }
    }

    return target;
}