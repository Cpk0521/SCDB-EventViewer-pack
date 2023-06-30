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
    translate_text? : string
}