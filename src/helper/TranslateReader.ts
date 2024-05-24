import type { EventViewer } from "../EventViewer";
import type { TranslateRecord } from "@/types/translate";
import { TranslateReader } from "@/types/helper";
import { loadJson, loadCSVText } from "@/utils/loadJson";
import { updateConfig } from "..";
import { csv2json } from 'csvjson-csv2json';

const ZhReader: TranslateReader = {
    language: "zh",
    masterListURL: "https://raw.githubusercontent.com/biuuu/ShinyColors/gh-pages/story.json",
    CSVURL: "https://raw.githubusercontent.com/biuuu/ShinyColors/gh-pages/data/story/{uid}.csv",
    async readByLabel(tag: string) {
        tag = tag.includes('.json') ? tag : `${tag}.json`;
        const master_list = this.masterListURL;
        const CSV_url = this.CSVURL;

        let list = await loadJson<string[][]>(master_list);
        const result = list.find(([key, _]) => key === tag);
        if (!result) {
            return void 0;
        }

        let translateUrl: string | undefined = CSV_url.replace(
            "{uid}",
            result[1]
        );
        
        return this.readByUrl(translateUrl);
    },
    async readByUrl(url: string) {

        let csvtext = await loadCSVText<string>(url);
        if (csvtext === "") {
            return void 0;
        }

        return this.readByCSV(csvtext);
    },
    async readByCSV(csvText: string) {
        const data: TranslateRecord = {
            language: this.language,
            translator: "",
            table: [],
        };

        const table = csv2json(csvText);
        table.forEach((row : any, index: number) => {
            if(index === table.length-2){
                data["info"] = row['name'];
            }
            else if(index === table.length-1){
                data["translator"] = row['name'];
            }
            else {
                data["table"].push({
                    id: row['id'],
                    charName: row['name'],
                    text: row['text'].replace(/(\n)|(\\n)/g, "\r\n"),
                    translatedText: row["trans"].replace(/(\n)|(\\n)/g, "\r\n"),
                });
            }
        })

        return data;
    }
};

export abstract class EventTranslateReader {
    public static readonly readers: Map<string, TranslateReader> = new Map([
        [ZhReader.language, ZhReader],
    ]);

    public static addReader(reader: TranslateReader) {
        if (this.readers.has(reader.language)) {
            console.info('the reader for this language already exists')
            return;
        }
        this.readers.set(reader.language, updateConfig({...ZhReader}, reader));
        return reader;
    }

    public static getReader(language: string) {
        return this.readers.get(language);
    }
}
