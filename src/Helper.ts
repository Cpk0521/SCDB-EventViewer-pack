import { IHelper } from "./types/helper"
import { loadCSVText, loadJson } from "./utils/loadJson"
import { CSVToJSON, searchFromMasterList } from "./utils/translation"

export const Helper : IHelper = {
    loadJson : loadJson,
    loadCSV : loadCSVText,
    CSVToJSON : CSVToJSON,
    searchFromMasterList : searchFromMasterList,
}