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

export type StoryProps = {
    Track : TrackFrames[];
    TranslateData? : TranslateRecord;
    urlResolver?: string;
}
