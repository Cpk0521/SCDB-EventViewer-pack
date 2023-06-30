import { Container } from "@pixi/display";
import { Assets } from '@pixi/assets'
import { Spine , EventTimeline, Event, TrackEntry} from '@pixi-spine/runtime-3.7'
import { IController } from '../types/controller'
import { fadingEffect } from "@/utils/effect";

type SpineRecord = {
    currCharId : string,
    currCharCategory : string
}

export const spineAlias : Record<string, string> = {
    stand_fix : 'stand',
    stand_costume_fix : 'stand_costume',
    stand_flex : 'stand',
    stand_costume_flex : 'stand_costume',
    stand : 'stand',
    stand_costume : 'stand_costume',
    stand_jersey : 'stand_jersey',
    stand_silhouette : 'stand_silhouette'
}

enum TRACK_INDEXES {
    ANIM1 = 0,
    ANIM2 = 1,
    ANIM3 = 2,
    ANIM4 = 3,
    ANIM5 = 4,
    LIP_ANIM = 5,
    LIP_ANIM2 = 6,
}

const LIP_EVENT_NAME : string = "lip";
const RELAY_EVENT_NAME : string = "relay";
const LOOP_EVENT_NAME : string = "loop_start";
const ANIMATION_MIX : number = 0.3;
// const TRACK_DEFAULT_ALPHA : number = 0.99;

export class SpineController extends Container implements IController {

    protected readonly _spineMap : Map<string, Spine>= new Map();
    protected _currSpine : Record<string, SpineRecord> = {};
    protected _keepsLipAnimation : boolean = false;
    protected _timeoutToClear : number | NodeJS.Timer | null | undefined = null;
    protected _replacingLipTrack : TrackEntry | undefined | null;
    protected _lipTrack : TrackEntry | undefined | null;
    protected _lipAnim : string | undefined | null;

    public addTo<C extends Container>(parent : C): this {
        parent.addChild(this);
        return this;
    }

    public reset() {
        this.removeChildren(0, this.children.length);
        this._spineMap.clear();
        this._currSpine = {};
    }

    public process(
        charLabel:string, charId:string, charCategory:any, charPosition:Optional<CharPosition>,
        charScale:number, charAnim1:string, charAnim2:string, charAnim3:string, 
        charAnim4:string, charAnim5:string, charAnim1Loop:boolean, charAnim2Loop:boolean, 
        charAnim3Loop:boolean, charAnim4Loop:boolean, charAnim5Loop:boolean, charLipAnim:string|boolean, 
        lipAnimDuration:number, charEffect:Optional<CharEffect>, isFastForward?:boolean)
    {
        if (!charLabel) { return; }
        if (charId) {
            this._currSpine[charLabel] = {
                currCharId: charId,
                // currCharCategory: this.spineAlias[charCategory] ?? 'stand'
                currCharCategory: spineAlias[charCategory] ?? 'stand'
            };
        }
        let { currCharId, currCharCategory } = this._currSpine[charLabel];
        let char_uid = `${charLabel}_${currCharId}_${currCharCategory}`;
        if (!this._spineMap.has(char_uid)) {
            // this._spineMap.set(char_uid, new Spine(this._loader.resources[char_uid].spineData));
            this._spineMap.set(char_uid, new Spine(Assets.get(char_uid).spineData));
            this._spineMap.get(char_uid)!.alpha = 1;
            this.addChild(this._spineMap.get(char_uid)!);
        }

        charAnim1Loop = charAnim1Loop === undefined ? true : charAnim1Loop;
        charAnim2Loop = charAnim2Loop === undefined ? true : charAnim2Loop;
        charAnim3Loop = charAnim3Loop === undefined ? true : charAnim3Loop;
        charAnim4Loop = charAnim4Loop === undefined ? true : charAnim4Loop;
        charAnim5Loop = charAnim5Loop === undefined ? true : charAnim5Loop;
        charLipAnim = charLipAnim === undefined ? false : charLipAnim;

        let thisSpine = this._spineMap.get(char_uid);

        try {
            thisSpine!.skeleton.setSkinByName('normal');
        }
        catch {
            thisSpine!.skeleton.setSkinByName('default');
        }

        if (charPosition) {
            thisSpine!.position.set(charPosition.x, charPosition.y);
            this.setChildIndex(thisSpine!, this.children.length <= charPosition.order! ? this.children.length - 1 : charPosition.order!);
        }

        if (charScale) {
            thisSpine!.scale = {x : charScale, y : charScale};
        }

        if (charEffect) {
            if (charEffect.type == "from") { thisSpine!.alpha = 1; }
            if (charEffect?.x) { charEffect.x += thisSpine!.x; }
            if (charEffect?.y) { charEffect.y += thisSpine!.y; }
            // if (isFastForward) { charEffect.time = 50; }
            // Utilities.fadingEffect(thisSpine, charEffect);
            fadingEffect(thisSpine!, charEffect);
        }

        if (charAnim1) {
            this._setCharacterAnimation(charAnim1, charAnim1Loop, TRACK_INDEXES.ANIM1, thisSpine!);
        }
        if (charAnim2) {
            this._setCharacterAnimation(charAnim2, charAnim2Loop, TRACK_INDEXES.ANIM2, thisSpine!);
        }
        if (charAnim3) {
            this._setCharacterAnimation(charAnim3, charAnim3Loop, TRACK_INDEXES.ANIM3, thisSpine!);
        }
        if (charAnim4) {
            this._setCharacterAnimation(charAnim4, charAnim4Loop, TRACK_INDEXES.ANIM4, thisSpine!);
        }
        if (charAnim5) {
            this._setCharacterAnimation(charAnim5, charAnim5Loop, TRACK_INDEXES.ANIM5, thisSpine!);
        }

        if (charLipAnim && !isFastForward) {
            const trackEntry = this._setCharacterAnimation(charLipAnim as string, true, TRACK_INDEXES.LIP_ANIM, thisSpine!);
            if (lipAnimDuration && trackEntry) {
                this._timeoutToClear = setTimeout(() => {
                    if (trackEntry.trackIndex === TRACK_INDEXES.LIP_ANIM) {
                        // trackEntry.time = 0;
                        trackEntry.trackTime = 0
                        trackEntry.timeScale = 0;
                    }
                    if (this._replacingLipTrack && this._replacingLipTrack.trackIndex === TRACK_INDEXES.LIP_ANIM) {
                        // this._replacingLipTrack.time = 0;
                        this._replacingLipTrack.trackTime = 0
                        this._replacingLipTrack.timeScale = 0;
                    }

                    this._keepsLipAnimation = false;
                }, lipAnimDuration * 1000);
            }

            const isReplacingLipAnimation = !lipAnimDuration && this._keepsLipAnimation;
            if (isReplacingLipAnimation) {
                this._replacingLipTrack = trackEntry;
            }
            else {
                this._lipTrack = trackEntry;
            }
        }

        thisSpine!.skeleton.setToSetupPose();
        thisSpine!.update(0);
        thisSpine!.autoUpdate = true;
    }

    public stopLipAnimation(charLabel : string){
        if (!this._currSpine[charLabel]) { return; }
        let { currCharId, currCharCategory } = this._currSpine[charLabel];
        let char_uid = `${charLabel}_${currCharId}_${currCharCategory}`;
        if (!this._spineMap.has(char_uid) || !this._spineMap.get(char_uid)!.state.tracks[TRACK_INDEXES.LIP_ANIM]) { return; }
        if (this._lipTrack && this._lipTrack.trackIndex === TRACK_INDEXES.LIP_ANIM) {
            // this._lipTrack.time = 0;
            this._lipTrack.trackTime = 0
            this._lipTrack.timeScale = 0;
        }

        if (this._replacingLipTrack && this._replacingLipTrack.trackIndex === TRACK_INDEXES.LIP_ANIM) {
            // this._replacingLipTrack.time = 0;
            this._replacingLipTrack.trackTime = 0
            this._replacingLipTrack.timeScale = 0;
        }
    }

    protected _setCharacterAnimation(charAnim : string, charAnimLoop:boolean, trackNo:number, thisSpine:Spine) {
        if (!charAnim || !this._getAnimation(charAnim, thisSpine)) { return; }
        let trackEntry : TrackEntry | undefined | null = undefined;
        let relayAnim : string | undefined | null = undefined;

        const animation = this._getAnimation(charAnim, thisSpine);

        // const eventTimeline = animation.timelines.find(timeline => timeline.events);
        const eventTimeline = animation!.timelines.find(timeline => timeline instanceof EventTimeline);

        let loopStartTime : number | null | undefined = null // , _this = this;
        if (eventTimeline) {
            (eventTimeline as EventTimeline).events.forEach( (event : Event) => {
                switch (event.data.name) {
                    case LOOP_EVENT_NAME:
                        loopStartTime = event.time;
                        break;
                    case LIP_EVENT_NAME:
                        this._lipAnim = event.stringValue;
                        break;
                    default:
                        break;
                }
            });
        }

        if (loopStartTime) {
            charAnimLoop = false;
        }

        const before = thisSpine.state.getCurrent(trackNo);
        const beforeAnim = before ? before.animation.name : null;

        if (beforeAnim) {
            // const beforeEventTimeline = this._getAnimation(beforeAnim!, thisSpine)!.timelines.find(function (timeline) {
            //     return timeline.events;
            // });
            const beforeEventTimeline = this._getAnimation(beforeAnim!, thisSpine)!.timelines.find(timeline => timeline instanceof EventTimeline);

            if (beforeEventTimeline) {
                // const relayAnimEvent = (beforeEventTimeline as EventTimeline).events.find(function (event) {
                //     return event.data.name === RELAY_EVENT_NAME;
                // });

                const relayAnimEvent = (beforeEventTimeline as EventTimeline).events.find(event => event.data.name === RELAY_EVENT_NAME);
                if (relayAnimEvent) {
                    relayAnim = relayAnimEvent.stringValue;
                }
            }
        }

        if (relayAnim) {
            if (beforeAnim) {
                thisSpine.stateData.setMix(beforeAnim, relayAnim, ANIMATION_MIX);
            }
            thisSpine.stateData.setMix(relayAnim, charAnim, ANIMATION_MIX);
            thisSpine.state.setAnimation(trackNo, relayAnim, false);
            // trackEntry = thisSpine.state.addAnimation(trackNo, charAnim, charAnimLoop);
            trackEntry = thisSpine.state.addAnimation(trackNo, charAnim, charAnimLoop, 0); //????
        } else {
            if (beforeAnim) {
                thisSpine.stateData.setMix(beforeAnim, charAnim, ANIMATION_MIX);
            }
            trackEntry = thisSpine.state.setAnimation(trackNo, charAnim, charAnimLoop);
        }

        const listener = {
            complete: function complete() {
                const currentAnim = thisSpine.state.getCurrent(trackNo);
                const currentAnimName = currentAnim ? currentAnim.animation.name : null;
                if ((!loopStartTime || charAnim !== currentAnimName)) {
                    return;
                }
                // let trackEntry = thisSpine.state.setAnimation(trackNo, charAnim);
                let trackEntry = thisSpine.state.setAnimation(trackNo, charAnim, false); //????
                trackEntry.listener = listener;
                // trackEntry.time = loopStartTime;
                trackEntry.trackTime = loopStartTime;
            }
        };

        trackEntry.listener = listener;
        
        return trackEntry;
    }

    protected _getAnimation(charAnim:string, thisSpine:Spine){
        const animation = thisSpine.spineData.animations.find((a) => a.name === charAnim);
        if (!animation) {
            console.error(`${charAnim} is not found in spineData`);
        }
        return animation;
    }
}