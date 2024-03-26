export type ViewerProps = {
    skipBanner: boolean;
    disableInfoLog: boolean;
    disableBlur: boolean;
    resourceUrl: string;
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

export const spineAlias: Record<string, string> = {
    stand_fix: "stand",
    stand_costume_fix: "stand_costume",
    stand_flex: "stand",
    stand_costume_flex: "stand_costume",
    stand: "stand",
    stand_costume: "stand_costume",
    stand_jersey: "stand_jersey",
    stand_silhouette: "stand_silhouette",
};
