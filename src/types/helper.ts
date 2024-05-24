import { BtnSetting, FontSetting } from "./options";
import { TranslateRecord } from "./translate";

export type Resolver = { //parser
    name : string;
    resourceUrl: string;
    story(label : string) :string;
    textFrame(label : string) : string;
    bg(label : string) : string;
    fg(label : string) : string;
    voice(label : string) : string;
    se(label : string) : string;
    bgm(label : string) : string;
    movie(label : string) : string;
    spine(charType:string, thisCharCategory:string, charId:string) : string;
    neededFrame(label : string) : string;
    still(label : string) : string;
    stillWithType(stillType : string, stillId:string) : string;
}

export interface TranslateReader {
    name?: string;
    asset? : {
        switchBtn?: BtnSetting;
        fonts? : FontSetting
    }
    language: string;
    CSVURL : string;
    masterListURL : string,
    readByLabel: (label: string) => Promise<TranslateRecord | undefined>;
    readByUrl: (url: string) => Promise<TranslateRecord | undefined>;
    readByCSV: (csvText: string) => Promise<TranslateRecord | undefined>;
}

export type StoryCache = {
    textFrame : Record<string, string>;
    bg : Record<string, string>;
    fg : Record<string, string>;
    voice : Record<string, string>;
    se : Record<string, string>;
    bgm : Record<string, string>;
    movie : Record<string, string>;
    spine : Record<string, string>;
    neededFrame : Record<string, string>;
    still : Record<string, string>;
}