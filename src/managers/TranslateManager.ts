import type { EventViewer } from "../EventViewer";
import type { TranslateData, TranslateReader } from "@/types/translate";

enum translateState {
    ON = "translated",
    OFF = "jp",
}

export class TranslateManager {
    protected viewer: EventViewer;
    protected readonly _readers: Map<string, TranslateReader> = new Map();
    protected _language: translateState = translateState.OFF;
    protected _translationData: TranslateData | undefined | null;
    protected _translate: boolean = false;

    constructor(viewer: EventViewer) {
        this.viewer = viewer;
    }

    addReader(reader : TranslateReader){
        this._readers.set(reader.language, reader);
    }

    getReader(lang : string){
        return this._readers.get(lang);
    }

    
}
