import type { Container } from "@pixi/display"
import type { IViewerOptions } from "./setting"

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