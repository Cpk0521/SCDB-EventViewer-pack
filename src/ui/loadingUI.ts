import { createEmptySprite } from "@/utils/emptySprite";
import { Container, Text } from "pixi.js";

export class LoadingComponent extends Container {
    
    protected _loglist : string[] = [];
    protected _logText : Text;
    protected _percent_text : Text;

    constructor() {
        super();
        this.addChild(createEmptySprite({ color: 0x000000 }));

        this._logText = new Text({
            text: "",
            style: {
                fill: "#FFF",
                fontSize : 20,
            }
        });
        this._logText.anchor.set(1);
        this._logText.position.set(1136-30, 640-100);
        this.addChild(this._logText);

        this._percent_text = new Text({
            text: "0 %",
            style: {
                fill: "#FFF",
                fontSize : 50,
            }
        });
        this._percent_text.anchor.set(1);
        this._percent_text.position.set(1136-30, 640-30);
        this.addChild(this._percent_text);
    }

    static create(){
        return new this();
    }

    public addTo<T extends Container>(parent : T){
        parent.addChild(this);
        return this;
    }

   public progress(assetName : string, progressNum : number){
        this._percent_text.text = `${progressNum * 100} %`;
        
        this._loglist.push(assetName);
        if(this._loglist.length > 5){
            this._loglist.shift();
        }

        this._logText.text = this._loglist.join('\n');

        if(progressNum === 1){
            this._done();
        }
    }

    protected _done(){
        this._percent_text.visible = false;
        this._logText.visible = false;

        this.visible = false;
        // this.parent.removeChild(this);
        this.emit('done');
    }
}