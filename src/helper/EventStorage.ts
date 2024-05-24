import { Assets } from "pixi.js";

// export type StoryCache = {
//     init : Record<string, string>;
//     textFrame : Record<string, string>;
//     bg : Record<string, string>;
//     fg : Record<string, string>;
//     voice : Record<string, string>;
//     se : Record<string, string>;
//     bgm : Record<string, string>;
//     movie : Record<string, string>;
//     spine : Record<string, string>;
//     neededFrame : Record<string, string>;
//     still : Record<string, string>;
// }

export abstract class EventStorage {

    // public static cache : Partial<StoryCache> = {}

    public static async addAssets(assets: Record<string, string> = {}, callback? : (name : string, index : number) => void){
        const list = Object.entries(assets);
        let loadedindex = 1;
        const promises = list.map(([name, src]) => {
            return Assets.load({
                alias: name,
                src: src,
            })
            .catch((error)=>{
                //skip 404
                if (error.message.includes(': 404')) {
                    return null;
                }
                return Promise.reject(error);
            })
            .finally(() => callback?.(name, Math.floor(((loadedindex++) / list.length) * 100) / 100))
        });
        return Promise.all(promises);
    }
}