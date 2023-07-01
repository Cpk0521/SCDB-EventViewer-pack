export function updateConfig<T>(target: T, source: Partial<T>): T {
    for (const key in source) {       
        if (source[key] instanceof Object && !Array.isArray(source[key])) {
            if(key in (target as object)){
                target[key] = updateConfig(target[key], source[key]!);
            }
        } else {
            (target as any)[key] = source[key];
        }
    }

    return target;
}

export const flatten = (obj : any) => {
	let result = {} as any;
    let process = (key : string, value : any) => {
        if (Object(value) !== value) {
            if (key) {
            	result[key] = value;
            }
        } 
        else if(Array.isArray(value)){
       		for (let i = 0; i < value.length; i++) {
            	process(`${key}[${i}]`, value[i])
            }
            if (value.length === 0) {
            	result[key] = [];
            }
        }
        else {
        	let objArr = Object.keys(value);
            objArr.forEach(item => {
            	process(key?`${key}_${item}`:`${item}`, value[item])
            });
            if (objArr.length === 0 && key) {
            	result[key] = {};
            }
        }
    }
    process('', obj)
    return result;
}
