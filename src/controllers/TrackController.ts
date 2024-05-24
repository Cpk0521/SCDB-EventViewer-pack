import type { TrackFrames, TrackFramesRecord } from "@/types/track";
import type { EventViewer } from "../EventViewer";
import { StoryProps } from "@/types/options";
import { spineAlias } from "@/utils/spineAlias";
import { EventUrlResolver } from "@/helper/UrlResolver";
import { StoryCache } from "@/types/helper";

export class TrackController {
    private _viewer: EventViewer;
    //Track
    protected _track: TrackFramesRecord[] = [];
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
    
    public init(storydata : StoryProps){
        // get urlResolver to get the assets url
        const resolver = EventUrlResolver.getResolver(storydata.urlResolver ?? 'default')
        if (!resolver) {
            throw new Error("UrlResolver not found");
        }

        const cache : StoryCache = {
            textFrame : {},
            bg : {},
            fg : {},
            voice : {},
            se : {},
            bgm : {},
            movie : {},
            spine : {},
            neededFrame : {
                '1' : resolver.neededFrame('1'),
                '2' : resolver.neededFrame('2'),
                '3' : resolver.neededFrame('3'),
            },
            still : {},
        };

        storydata.Track.forEach((Frame : TrackFrames) => {

            const { 
                speaker, text, select, textFrame,
                bg, fg, se, voice, bgm, 
                movie, charId, charType, charLabel, charCategory, 
                stillType, stillId, still} = Frame;

            // if (speaker && text && !this._mixed && this._translationData) {
            //     Frame['translated_text'] = this._translationData.table.find(data => data.name == speaker && data.text == text)!['tran'];
            // }
            
            if (textFrame && textFrame != "off" && !cache['textFrame'][`${textFrame}`]) {
                cache['textFrame'][`${textFrame}`] = resolver.textFrame(textFrame);
            }
            if (bg && !cache['bg'][`${bg}`] && bg != "fade_out") {
                cache['bg'][`${bg}`] = resolver.bg(bg);
            }
            if (fg && !cache['fg'][`${fg}`] && fg != "off" && fg != "fade_out") {
                cache['fg'][`${fg}`] = resolver.fg(fg);
            }
            if (se && !cache['se'][`${se}`]) {
                cache['se'][`${se}`] = resolver.se(se);
            }
            if (voice && !cache['voice'][`${voice}`]) {
                cache['voice'][`${voice}`] = resolver.voice(voice);
            }
            if (bgm && !cache['bgm'][`${bgm}`] && bgm != "fade_out" && bgm != "off") {
                cache['bgm'][`${bgm}`] = resolver.bgm(bgm);
            }
            if (movie && !cache['movie'][`${movie}`]) {
                cache['movie'][`${movie}`] = resolver.movie(movie);
            }
            if (charLabel && charId) {
                const thisCharCategory = charCategory ? spineAlias[charCategory!] : "stand";
                if (!cache['spine'][`${charLabel}_${charId}_${thisCharCategory}`]) {
                    cache['spine'][`${charLabel}_${charId}_${thisCharCategory}`] = resolver.spine(charType!, thisCharCategory, charId);
                }
            }
            if (select) {
                // if (!this._mixed && this._translationData) {
                //     Frame['translated_text'] = this._translationData.table.find(data => data.id == 'select' && data.text == select)!['tran'];
                // }
            }
            if (still && !cache['still'][`${still}`] && still != "off") {
                cache['still'][`${still}`] = resolver.still(still);
            }
            if (stillType && stillId && !cache['still'][`${stillType}${stillId}`]) {
                cache['still'][`${stillType}${stillId}`] = resolver.stillWithType(stillType, stillId);
            }

        });

        return cache;
    }

    public renderTrack() {}

    public forward() {}

    public jumpTo(nextLabel: string) {}

    public endOfEvent() {}

    public afterSelection() {}

    get track() {
        return this._track;
    }
}

// protected _track: TrackFrames[] = [];
// protected _autoPlayEnabled: boolean = true;
// protected _current: number = 0;
// protected _nextLabel: string | undefined | null;
// protected _stopTrackIndex: number = -1;
// protected _timeoutToClear?: string | number | NodeJS.Timeout | undefined;
// protected _textTypingEffect?: string | number | NodeJS.Timeout | undefined;
// protected _stopped: boolean = false;
// protected _selecting: boolean = false;
