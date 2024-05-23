import { Container } from "pixi.js";
import { TrackFrames } from "./track";
import { TranslateRecord } from "./translate";

export type ViewerProps = {
    stage? : Container;
    skipBanner: boolean;
    disableInfoLog: boolean;
    disableBlur: boolean;
    // resourceUrl?: string;
    assets: {
        font: FontSetting;
        touchToStart: string;
        autoBtn: BtnSetting;
        translationBtn: BtnSetting;
    };
};

export type FontSetting = {
    filepath: string;
    family?: string;
};

export type BtnSetting = {
    On: string;
    Off: string;
};

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
    cardstill(stillType : string, stillId:string) : string;
}

export type LoadProps = {
    Track : TrackFrames[];
    TranslateData? : TranslateRecord;
    urlResolver?: string;
}

