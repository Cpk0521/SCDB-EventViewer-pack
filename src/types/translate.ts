type TranslateData = {
    url : string,
    translater : string,
    table : translateTable[]
}

type translateTable = {
    id : string,
    name : string,
    text : string,
    tran : string
}

type translateText = {
    translated_text? : string
}

type TextRecord = {
    jp: string
    translated: string
    [label : string] : string
}



