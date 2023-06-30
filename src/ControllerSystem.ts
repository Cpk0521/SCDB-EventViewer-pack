import { Container } from '@pixi/display'
import { IController , ControllerClass} from './types/controller'
import type { EventViewer } from './EventViewer';

export class ControllerSystem {

    private _viewer : EventViewer
    public readonly allcontroller : Map<string, IController> = new Map()

    constructor(viewer : EventViewer){
        this._viewer = viewer
    }

    public add<C extends IController>(name : string, Class : ControllerClass<C>, order? : number){

        if(this.allcontroller.has(name)){
            let controller = this.allcontroller.get(name) as C
            if(order && controller instanceof Container){
                controller.zIndex = order
            }
            return controller
        }
    
        const controller = new Class()

        if('setting' in controller){
            controller.setting = this._viewer.config
        }
        
        if(controller instanceof Container){
            controller.addTo?.(this._viewer);
            controller.zIndex = order ?? 0
        }
        
        this.allcontroller.set(name, controller)
        
        return controller as C
    }

    public get<C extends IController>(Class : ControllerClass<C>){
        for (let value of this.allcontroller.values()) {
            if (value instanceof Class)
            return value as C;
        }

        return
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

}