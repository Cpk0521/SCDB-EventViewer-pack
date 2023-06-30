export interface IHelper {
    loadJson : <T extends Object>(source: string) => Promise<T>
    loadCSV : <T extends string>(source: string) => Promise<T>
    CSVToJSON : (csvtext : string) => TranslateData
    [label : string] : Function
}