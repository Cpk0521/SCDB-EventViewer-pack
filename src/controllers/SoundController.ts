import { Assets } from "pixi.js";
import { IController } from "../types/controller";
import { IMediaInstance, sound, Sound } from "@pixi/sound";
import { gsap } from "gsap";
import type { TrackFrames } from "@/types/track";
import type { EventViewer } from "../EventViewer";

// import { EventEmitter } from '@pixi/utils'

export class SoundController implements IController {
    protected _voiceDuration: number = 0;
    protected _currentBgm: Sound | undefined | null = null;
    protected _currentVoice: Sound | undefined | null = null;
    protected _currentSe: Sound | undefined | null = null;
    protected _onVoiceEnd: Function = () => {};
    protected viewer: EventViewer;

    constructor(viewer: EventViewer) {
        // super()
        this.viewer = viewer;
        sound.disableAutoPause = true;
        sound.volumeAll = 0.1;
    }

    public reset() {
        if (this._currentVoice) {
            this._currentVoice.stop();
            this._currentVoice = null;
        }

        if (this._currentBgm) {
            this._currentBgm.stop();
            this._currentBgm = null;
        }

        if (this._currentSe) {
            this._currentSe.stop();
            this._currentSe = null;
        }
    }

    // public process(bgm: string, se: string, voice: string, charLabel: string, onVoiceEnd : Function): void {
    public process({
        bgm,
        se,
        voice,
        charLabel,
        onVoiceEnd,
    }: TrackFrames & Record<string, any>): void {
        if (bgm) {
            this._playBgm(bgm);
        }

        if (se) {
            this._playSe(se);
        }

        if (voice) {
            this._playVoice(voice, charLabel!, onVoiceEnd);
        }
    }

    protected _playBgm(bgmName: string) {
        if (bgmName == "fade_out") {
            // TweenMax.to(this._currentBgm, 0, { volume: 0 });
            // gsap.to(this._currentBgm!, 0, { volume: 0 });
            gsap.to(this._currentBgm!, { duration: 0, volume: 0 });
            return;
        }

        if (this._currentBgm) {
            this._currentBgm.stop();
        }
        if (bgmName == "off") {
            return;
        }

        this._currentBgm = Assets.get(`bgm_${bgmName}`);
        if (this._currentBgm) {
            this._currentBgm.autoPlay = true;
            this._currentBgm.play({
                loop: true,
                singleInstance: true,
            });
            this._currentBgm.volume = 0.3;
        }
    }

    protected _playSe(seName: string) {
        this._currentSe = Assets.get(`se_${seName}`);
        if (this._currentSe) {
            this._currentSe.play({
                loop: false,
            });
        }
    }

    protected _playVoice(
        voiceName: string,
        charLabel: string,
        onVoiceEnd: Function
    ) {
        this._voiceDuration = 0;
        if (this._currentVoice) {
            this._currentVoice.stop();
            this._onVoiceEnd();
        }

        this._currentVoice = Assets.get(`voice_${voiceName}`);
        // console.log(this._currentVoice)
        if (this._currentVoice) {
            let instance = this._currentVoice.play({
                loop: false,
            });

            this._voiceDuration = this._currentVoice.duration * 1000 + 1000;
            this._onVoiceEnd = () => {
                onVoiceEnd(charLabel);
            };

            (instance as IMediaInstance).on("end", () => {
                this._onVoiceEnd();
                this._currentVoice = null;
            });
        }
    }

    get voiceDuration() {
        return this._voiceDuration;
    }
}
