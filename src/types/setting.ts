type ISetting = {
    hello : boolean,
    infoLog : boolean,
    assetUrl : string,
    fonts : {
        zh : FontSetting,
        jp : FontSetting,
        [language : string] : FontSetting,
    },
    translate : {
        master_list : string,
        CSV_url : string,
    },
    assets : {
        touchToStart : string,
        autoOn : string,
        autoOff : string,
        jpON : string,
        zhOn : string,
        [item : string] : string,
    }
}

type FontSetting = {
    filepath : string
    family : string
}

type Optional<T> = {
    [P in keyof T]?: Optional<T[P]>;
}
