import type { Container } from "pixi.js"

export interface IController {
    process? : (...parems : any[]) => void,
    reset? : () => void,
    addTo? : <C extends Container>(parent : C) => void,
    init? : () => void,
}

// export interface ControllerClass<C extends IController>{
//     new() : C
// }