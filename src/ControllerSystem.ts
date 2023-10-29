import { Container } from '@pixi/display'
import { IController , ControllerClass} from './types/controller'
import type { EventViewer } from './EventViewer';
import type { TrackFrames } from "@/types/track";

export class ControllerSystem {

    private _viewer : EventViewer
    public readonly allcontroller : Map<string, IController> = new Map()

    constructor(viewer : EventViewer){
        this._viewer = viewer
    }

    public add<C extends IController>(name : string, CClass : ControllerClass<C>, order? : number){

        if(this.allcontroller.has(name)){
            let controller = this.allcontroller.get(name) as C
            if(order && controller instanceof Container){
                controller.zIndex = order
            }
            return controller
        }
    
        const controller = new CClass()
        
        if('options' in controller){
            controller.options = this._viewer.Options
        }
        
        if(controller instanceof Container){
            controller.addTo?.(this._viewer);
            controller.zIndex = order ?? 0
        }
        
        this.allcontroller.set(name, controller)
        
        return controller as C
    }

    public get<C extends IController>(Class : ControllerClass<C>){
        return [...this.allcontroller].find(([_, val]) => val instanceof Class)?.[1] as C
    }
    
    public getByName<C extends IController>(name : string){
        return this.allcontroller.get(name) as C
    }

    public init(){
        this.allcontroller.forEach((cont) => cont.init?.());
    }

    public reset(){
        this.allcontroller.forEach((cont) => cont.reset?.());
    }

    public process(data : TrackFrames & Record<string, any>){
        this.allcontroller.forEach((cont) => cont.process?.(data));
    }

}