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