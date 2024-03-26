import { BtnSetting } from "./setting";

export type TranslateData = {
    url: string;
    translater: string;
    table: translateTable[];
};

export type translateTable = {
    id: string;
    name: string;
    text?: string;
    tran: string;
};

export type translateText = {
    translated_text?: string;
};

export type TextRecord = {
    jp: string;
    translated: string;
    [label: string]: string;
};

export interface TranslateReader {
    language: string;
    name?: string;
    assets?: BtnSetting;
    read: (tag: string) => Promise<TranslateData | undefined>;
    test?(): Promise<any>;
}
