import type { EventViewer } from "../EventViewer";
import type { TranslateRecord, TranslateReader } from "@/types/translate";
import { loadJson, loadCSVText } from "@/utils/loadJson";

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

        const data: TranslateRecord = {
            translator: "",
            table: [],
        };

        let table = csvtext.split(/\r\n/).slice(1);
        table.forEach((row) => {
            let columns = row.split(",");

            if (columns[0] === "info") {
                data["url"] = columns[1];
            } else if (columns[0] === "译者") {
                data["translator"] = columns[1];
            } else if (columns[0] != "") {
                data["table"].push({
                    id: columns[0],
                    charName: columns[1],
                    text: columns[2].replace("\\n", "\r\n"),
                    translatedText: columns[3].replace("\\n", "\r\n"),
                });
            }
        });

        return data;
    },
};

export class TranslateManager {
    protected viewer: EventViewer;
    protected readonly _readers: Map<string, TranslateReader> = new Map();
    protected readonly _results: Map<string, TranslateRecord | undefined> =
        new Map();
    protected _translate: boolean = false;

    constructor(viewer: EventViewer) {
        this.viewer = viewer;
        this.addReader(ZhReader);
    }

    addReader(reader: TranslateReader) {
        if (this._readers.has(reader.language)) {
            console.info('the reader for this language already exists')
            return;
        }
        this._readers.set(reader.language, reader);
    }

    getReader(language: string) {
        return this._readers.get(language);
    }

    addRecord(recordData: { language: string; record: TranslateRecord }) {
        if (this._results.has(recordData.language)) {
            console.info('the record for this language already exists')
            return;
        }
        this._results.set(recordData.language, recordData.record);
    }

    getRecord(language: string) {
        return this._results.get(language);
    }

    async load(label: string) {
        for (const [key, reader] of this._readers.entries()) {
            try {
                const data = await reader.read(label);
                this._results.set(key, data);
            } catch (e) {
                console.error(
                    "can not read the translate data of " + key + ": " + e
                );
            }
        }
    }
}
