import { BtnSetting, FontSetting } from "./setting";

export type TranslateRecord = {
    url?: string;
    translator: string;
    table: translateTable[];
};

export type translateTable = {
    id: string;
    charName: string;
    text?: string;
    translatedText: string;
};

// export type translateText = {
//     translated_text?: string;
// };

// export type TextRecord = {
//     jp: string;
//     translated: string;
//     [label: string]: string;
// };

export interface TranslateReader {
    asset? : {
        switchBtn?: BtnSetting;
        fonts? : FontSetting
    }
    language: string;
    name?: string;
    read: (tag: string) => Promise<TranslateRecord | undefined>;
    test?(): Promise<any>;
}
