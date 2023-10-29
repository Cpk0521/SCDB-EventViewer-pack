export type Ieffect = {
    type? : 'from' | 'to',
    ease? : 'none' | 'easeInOutQuad' | 'easeInQuad' | 'easeOutQuad' | string,
    time? : number,
    alpha? : number
}

export type Oeffect = {
    duration? : number,
    ease? : gsap.EaseFunction | string,
    alpha? : number
}