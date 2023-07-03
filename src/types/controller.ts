import { Container } from "@pixi/display"

export interface IController {
    options? : IViewerOptions
    process? : (...parems : any[]) => void
    reset? : () => void
    addTo? : <C extends Container>(parent : C) => void
    init? : () => void
}

export interface ControllerClass<C extends IController>{
    label? : string
    new() : C
}