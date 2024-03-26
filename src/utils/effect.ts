import type { Ieffect, Oeffect } from "@/types/effect";
import { Container } from "pixi.js";
import { gsap, Power0, Quad } from "gsap";
import "gsap/PixiPlugin";

export function fadingEffect<T extends Container>(
    target: T,
    effectValue: Ieffect,
    isFastForward?: boolean
) {
    let effectrun: Oeffect = {} as Oeffect;
    const EffectFunction = getFromTo(effectValue.type!);

    if ("alpha" in effectValue) {
        effectrun.alpha = effectValue.alpha;
    }

    if (effectValue.time) {
        effectrun.duration = effectValue.time / 1000;
    }
    if (isFastForward) {
        // effectrun.duration = 50 / 1000;
    }
    if (!effectValue.ease) {
        effectrun.ease = "easeInOutQuad";
    } else {
        effectrun.ease = getEasing(effectValue.ease);
    }

    EffectFunction!(target, effectrun);
}

function getFromTo(fromto: string) {
    switch (fromto) {
        case "from":
            return gsap.from;
        case "to":
            return gsap.to;
        default:
            return gsap.to;
    }
}

function getEasing(easing: string) {
    switch (easing) {
        case "easeInOutQuad":
            return Quad.easeInOut;
        case "easeInQuad":
            return Quad.easeIn;
        case "easeOutQuad":
            return Quad.easeOut;
        case "none":
            return Power0.easeNone;
        default:
            return Quad.easeInOut;
    }
}
