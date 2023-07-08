interface IViewerOptions {
    skipHello : boolean;
    disableInfoLog : boolean,
    disableBlur : boolean,
    resourceUrl : string,
    fonts : {
        jp : FontSetting,
        translated : FontSetting,
        [key: string]: FontSetting;
    },
    translate : {
        master_list : string,
        CSV_url : string,
    },
    assets : {
        touchToStart : string,
        autoBtn : {
            On : string,
            Off : string
        },
        translationBtn : {
            On : string,
            Off : string
        }
    }
}

type FontSetting = {
    filepath : string
    family : string
}

type Optional<T> = {
    [P in keyof T]?: Optional<T[P]>;
}
