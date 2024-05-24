import { EventUrlResolver } from "./UrlResolver";
import { EventTranslateReader } from "./TranslateReader";
import { loadJson } from "@/utils/loadJson";
import { isUrl } from '@/utils/isUrl';
import { TrackFrames } from "@/types/track";
import { TranslateRecord } from "@/types/translate";

export abstract class EventHelper{

    public static UrlResolver = EventUrlResolver;
    public static translateReader = EventTranslateReader;

    public static async loadTrack(source : string, urlResolver : string = 'default') : Promise<TrackFrames[] | undefined>{
        const resolver = this.UrlResolver.getResolver(urlResolver)!;
        const url = isUrl(source) ? source : resolver.story(source);
        return loadJson<TrackFrames[]>(url);
    }

    public static async loadTranslate(source : string, language : string) : Promise<TranslateRecord | undefined>{
        const reader = this.translateReader.getReader(language);
        if(!reader){
            console.warn(`Translation reader for ${language} is not found`);
            return;
        }
        return (isUrl(source) ? await reader.readByUrl(source) : await reader.readByLabel(source));
    }

    public static async loadTranslateCSV(csvText : string, language : string) : Promise<TranslateRecord | undefined>{
        const reader = this.translateReader.getReader(language);
        if(!reader){
            console.warn(`Translation reader for ${language} is not found`);
            return;
        }
        return reader.readByCSV(csvText);
    }
}
