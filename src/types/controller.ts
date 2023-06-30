import { Container } from "@pixi/display"

export interface IController {
    setting? : ISetting
    process? : (...parems : any[]) => void
    reset? : () => void
    addTo? : <C extends Container>(parent : C) => void
    init? : () => void
}

export interface ControllerClass<C extends IController>{
    new() : C
}