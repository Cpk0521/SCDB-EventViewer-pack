import { BtnSetting, FontSetting } from "./options";

export type TranslateRecord = {
    language?: string;
    info?: string;
    translator: string;
    table: translateColumn[];
};

export type translateColumn = {
    id: string;
    charName: string;
    text?: string;
    translatedText: string;
};

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
}