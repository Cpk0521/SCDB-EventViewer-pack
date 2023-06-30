export async function loadJson<T extends Object>(source : string) : Promise<T>{
    return fetch(source)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            return response.json() as Promise<T>;
        })
}
export async function loadCSVText<T extends string>(source : string) : Promise<T>{
    return fetch(source)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            return response.text() as Promise<T>;
        })
}