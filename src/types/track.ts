/**
 * author : darwintree
 * https://github.com/darwintree/sc-story-editor/tree/main/src/interfaces
 */

import type { translateText } from './translate'

export type Optional<T> = {
    [P in keyof T]?: Optional<T[P]>;
}

export interface CharPosition {
    x: 568 | 796 | 310 | 936 | 200 | 686 | 420 | 150 | 986;
    y?: number;
    order?: number;
}

export interface CharEffect {
    x?: number;
    y?: number;
    type?: "from" | "to"; // will defaults to "to"
    alpha: 0 | 1;
    time?: number; // defauts to 100
    scale?: number;
}

export type CharSpine = {
    charId: string;
    charCategory:
      | "cb"
      | "cb_costume"
      | "cb_gasha"
      | "stand"
      | "stand_fix"
      | "stand_jersey"
      | "stand_costume"
      | "stand_silhouette"
      | "stand_costume_fix"
      | "stand_costume_flex";
    charType: "characters" | "idols" | "sub_characters";
    charScale : number //????
};

export type CharAnim = {
    charAnim1?: string;
    charAnim2?: string;
    charAnim3?: string;
    charAnim4?: string;
    charAnim5?: string;
    charAnim1Loop?: boolean; // always defaults to false
    charAnim2Loop?: boolean; // always defaults to false
    charAnim3Loop?: boolean; // always defaults to false
    charAnim4Loop?: boolean;
    charAnim5Loop?: boolean;
    charLipAnim?: string;
    lipAnimDuration?: number;
};

export type Character = {
    // charSpine: string;
    charLabel: string;
    charPosition: CharPosition;
    charEffect: CharEffect;
    // lip: string;
} & CharSpine & CharAnim;

export type Bg = {
    bg: string;
    bgEffect: string;
    bgEffectTime: number;
}

export type Fg = {
    fg: string;
    fgEffect: string;
    fgEffectTime: number;
}

export type FrameText = {
    speaker: string;
    text: string;
    textCtrl?: string;
    textWait?: number;
    textFrame?: string;
}

export interface EffectValue {
    type: 'from' | 'to',
    x: number,
    alpha: number,
    time: number,
    easing: 'easeInQuart',
}

export interface EffectTarget {
    type: 'rect',
    width: number, // 1136
    height: number, // 640
    color: string, // '000000', 'ffffff'
}

export type Effect = {
    effectLabel: string;
    effectTarget: EffectTarget;
    effectValue: EffectValue;
}

export type Select = {
    select: string;
    nextLabel: string;
}

export type Sound = {
    bgm?: string;
    se?: string;
    voice?: string;
    voiceKeep?: boolean;
}

export type Wait = {
    waitType: "time" | "effect";
    waitTime: number; // ms
}

export type Still = {
    stillId: string;
    stillCtrl: string;
    still: string;
    stillType: string;
}

export type FrameData = {
    id?: number;
    movie?: string;
    label?: string;
} & Optional<Character> &
    Optional<Bg> &
    Optional<Fg> &
    Optional<Effect> &
    Optional<Sound> &
    Optional<FrameText> &
    Optional<Select> &
    Optional<Still> &
    Optional<Wait> ;

export type TrackFrames = FrameData & translateText;