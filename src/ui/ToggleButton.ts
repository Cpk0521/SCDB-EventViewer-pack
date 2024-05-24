import { Container, Sprite, Texture } from "pixi.js";

type ButtonProps = {
    ON : Texture,
    OFF : Texture
    visible? : boolean, // default true
}

export class ToggleButton extends Sprite {
    private _isOn: boolean = false;
    protected _btnTexture : ButtonProps

    constructor(options: ButtonProps) {
        super(options.OFF);

        this._btnTexture = options;
        this.anchor.set(0.5);
        this.zIndex = 50;
        this.eventMode = 'static';
        this.on('pointertap', this.click);
    }

    static create(options: ButtonProps) : ToggleButton{
        return new this(options);
    }

    public addTo<T extends Container>(parent : T){
        parent.addChild(this);
        return this;
    }

    public click(){
        this._isOn = !this._isOn;
        this.texture = this._isOn ? this._btnTexture.ON : this._btnTexture.OFF;
        this.emit('Btnclicked', this._isOn);
    }

    public setPosition(x: number, y: number){
        this.position.set(x, y);
        return this;
    }
}