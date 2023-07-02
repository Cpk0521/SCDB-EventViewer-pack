/**
 * author : darwintree
 * https://github.com/darwintree/sc-story-editor/tree/main/src/interfaces
 */

interface CharPosition {
    x: 568 | 796 | 310 | 936 | 200 | 686 | 420 | 150 | 986;
    y?: number;
    order?: number;
}

interface CharEffect {
    x?: number;
    y?: number;
    type?: "from" | "to"; // will defaults to "to"
    alpha: 0 | 1;
    time?: number; // defauts to 100
    scale?: number;
}

type CharSpine = {
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

type CharAnim = {
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

type Character = {
    // charSpine: string;
    charLabel: string;
    charPosition: CharPosition;
    charEffect: CharEffect;
    // lip: string;
} & CharSpine & CharAnim;

type Bg = {
    bg: string;
    bgEffect: string;
    bgEffectTime: number;
}

type Fg = {
    fg: string;
    fgEffect: string;
    fgEffectTime: number;
}

type FrameText = {
    speaker: string;
    text: string;
    textCtrl?: string;
    textWait?: number;
    textFrame?: string;
}

interface EffectValue {
    type: 'from' | 'to',
    x: number,
    alpha: number,
    time: number,
    easing: 'easeInQuart',
}

interface EffectTarget {
    type: 'rect',
    width: number, // 1136
    height: number, // 640
    color: string, // '000000', 'ffffff'
}

type Effect = {
    effectLabel: string;
    effectTarget: EffectTarget;
    effectValue: EffectValue;
}

type Select = {
    select: string;
    nextLabel: string;
}

type Sound = {
    bgm?: string;
    se?: string;
    voice?: string;
    voiceKeep?: boolean;
}

type Wait = {
    waitType: "time" | "effect";
    waitTime: number; // ms
}

type Still = {
    stillId: string;
    stillCtrl: string;
    still: string;
    stillType: string;
}


type FrameData = {
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
    Optional<Wait>;

type TrackFrames = FrameData & translateText;