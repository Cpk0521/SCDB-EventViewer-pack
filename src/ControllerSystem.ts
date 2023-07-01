import { Container } from '@pixi/display'
import { IController , ControllerClass} from './types/controller'
import type { EventViewer } from './EventViewer';

////打包後出現問題
// function getParamNames(func: Function): string[] {
//     const fnStr = func.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm, '');
//     const result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
//     if (result === null) {
//       return [];
//     }
//     return result;
// }

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
        
        // const processFn = controller.process
        // if(processFn){
        //     result.argNames = getParamNames(processFn);
        // }

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

    //打包後出現問題
    // public process(args : Record<string, any>){
    //     this.allcontroller.forEach(cont => {
    //         const processFn = cont.CClass.process
    //         if(processFn){
    //             processFn.call(cont.CClass, ...cont.argNames.map(argName => args[argName]!));
    //         }
    //     })
    // }

}