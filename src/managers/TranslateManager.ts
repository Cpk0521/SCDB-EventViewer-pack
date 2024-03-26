import type { EventViewer } from "../EventViewer";
import type { TranslateData, TranslateReader } from "@/types/translate";
import { loadJson, loadCSVText } from "@/utils/loadJson";

// enum translateState {
//     ON = "translated",
//     OFF = "jp",
// }

const ZhReader: TranslateReader = {
    name: "中文",
    language: "zh",
    async read(tag: string) {
        const master_list =
            "https://raw.githubusercontent.com/biuuu/ShinyColors/gh-pages/story.json";
        const CSV_url =
            "https://raw.githubusercontent.com/biuuu/ShinyColors/gh-pages/data/story/{uid}.csv";

        let list = await loadJson<string[][]>(master_list);
        const result = list.find(([key, _]) => key === tag);
        if (!result) {
            return void 0;
        }

        let translateUrl: string | undefined = CSV_url.replace(
            "{uid}",
            result[1]
        );
        let csvtext = await loadCSVText<string>(translateUrl);
        if (csvtext === "") {
            return void 0;
        }

        const data: TranslateData = {
            url: "",
            translater: "",
            table: [],
        };

        let table = csvtext.split(/\r\n/).slice(1);
        table.forEach((row) => {
            let columns = row.split(",");

            if (columns[0] === "info") {
                data["url"] = columns[1];
            } else if (columns[0] === "译者") {
                data["translater"] = columns[1];
            } else if (columns[0] != "") {
                data["table"].push({
                    id: columns[0],
                    name: columns[1],
                    text: columns[2].replace("\\n", "\r\n"),
                    tran: columns[3].replace("\\n", "\r\n"),
                });
            }
        });

        return data;
    },
};

export class TranslateManager {
    protected viewer: EventViewer;
    protected readonly _readers: Map<string, TranslateReader> = new Map();
    protected readonly _results: Map<string, TranslateData | undefined> =
        new Map();
    protected _current_language: string = "jp";
    protected _translate: boolean = false;

    constructor(viewer: EventViewer) {
        this.viewer = viewer;
        this.addReader(ZhReader);
    }

    addReader(reader: TranslateReader) {
        this._readers.set(reader.language, reader);
    }

    getReader(lang: string) {
        return this._readers.get(lang);
    }

    async load(tag: string) {
        for (const [key, reader] of this._readers.entries()) {
            try{
                const data = await reader.read(tag);
                this._results.set(key, data);
            }catch(e){
                console.error('can not read the translate data of ' + key + ': ' + e);
            }
        }
    }
}
