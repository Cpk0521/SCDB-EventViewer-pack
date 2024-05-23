import { Assets } from "pixi.js";
import { EventUrlResolver } from "./UrlResolver";
import { EventTranslateReader } from "./TranslateReader";
import { loadJson } from "../utils/loadJson";
import { isUrl } from '../utils/isUrl';
import { TrackFrames } from "@/types/track";
import { TranslateRecord } from "@/types/translate";

export class EventStorageClass {

    public assets: typeof Assets;
    public UrlResolver : EventUrlResolver;
    public translateReader : EventTranslateReader;

    constructor(){
        this.assets = Assets;
        this.UrlResolver = new EventUrlResolver();
        this.translateReader = new EventTranslateReader();
    }

    public async loadTrack(source : string, urlResolver : string = 'default') : Promise<TrackFrames[] | undefined>{
        const resolver = this.UrlResolver.getResolver(urlResolver)!;
        const url = isUrl(source) ? source : resolver.story(source);

        return await loadJson<TrackFrames[]>(url);
    }

    public async loadTranslate(source : string, language : string) : Promise<TranslateRecord | undefined>{
        const reader = this.translateReader.getReader(language);
        if(!reader){
            console.warn(`Translation reader for ${language} is not found`);
            return;
        }
        return (isUrl(source) ? await reader.readByUrl(source) : await reader.readByLabel(source));
    }

    public async loadTranslateCSV(csvText : string, language : string){
        const reader = this.translateReader.getReader(language);
        if(!reader){
            console.warn(`Translation reader for ${language} is not found`);
            return;
        }
        return await reader.readByCSV(csvText);
    }

    public async addAssets(assets: Record<string, string> = {}, callback? : (name : string, index : number, done : boolean)=>void){
        const list = Object.entries(assets);
        let loadedindex = 1;
        const promises = list.map(([name, src]) => {
            return this.assets.load({
                alias: name,
                src: src,
            })
            .then(()=>{
                callback?.(name, Math.floor(((loadedindex++) / list.length) * 100) / 100, true);
            })
            .catch((error)=>{
                callback?.(name, Math.floor(((loadedindex++) / list.length) * 100) / 100, false);
                //skip 404
                if (error.message.includes(': 404')) {
                    return null;
                }
                return Promise.reject(error);
            })
        });

        return Promise.all(promises);
    }

}

export const EventStorage = new EventStorageClass();
