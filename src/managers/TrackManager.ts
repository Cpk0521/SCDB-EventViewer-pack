import type { TrackFrames } from "@/types/track";
import type { EventViewer } from "../EventViewer";

export class TrackManager {
    private _viewer: EventViewer;
    //Track
    protected _track: TrackFrames[] = [];
    protected _autoPlayEnabled: boolean = true;
    protected _current: number = 0;
    protected _nextLabel: string | undefined | null;
    protected _stopTrackIndex: number = -1;
    protected _timeoutToClear?: string | number | NodeJS.Timeout | undefined;
    protected _textTypingEffect?: string | number | NodeJS.Timeout | undefined;
    protected _stopped: boolean = false;
    protected _selecting: boolean = false;

    constructor(viewer: EventViewer) {
        this._viewer = viewer;
    }
}
