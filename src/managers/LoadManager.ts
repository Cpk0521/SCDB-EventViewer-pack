import type { EventViewer } from "../EventViewer";

export interface LoadReader {
    
}


export class LoadManager {
    protected _viewer: EventViewer;

    constructor(viwer: EventViewer) {
        this._viewer = viwer;
    }

    

}
