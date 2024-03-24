import { Container, Sprite, Assets, Texture,  } from 'pixi.js';
import { IController } from '../types/controller'
import { fadingEffect } from "@/utils/effect";
import type { TrackFrames } from "@/types/track";
import type { EventViewer } from "../EventViewer";

export class MovieController extends Container implements IController {

    protected viewer: EventViewer;
    protected _onMovieEnded : Function = () => {} 

    constructor(viewer: EventViewer, order?: number) {
        super();
        this.viewer = viewer;
        this.addTo(viewer);
        this.zIndex = order ?? 0;
    }
    
    public addTo<C extends Container>(parent : C): this {
        parent.addChild(this)
        return this
    }

    public reset() {
        this.removeChildren(0, this.children.length);
    }

    // public process(movie : string, onMovieEnded : Function) {
    public process({movie, onMovieEnded} : TrackFrames & Record<string, any>) {
        if (!movie) return;

        this._onMovieEnded = onMovieEnded;
        this._playMovie(movie);
    }

    _playMovie(movie : string) {
        // let texture = Assets.get(`movie_${movie}`);
        // let movieSprite = new Sprite(texture);

        // this.addChild(movieSprite);

        // const controller = (movieSprite.texture as Texture<VideoResource>).baseTexture.resource.source;
        // controller.play() //!!!
        // controller.addEventListener("ended", () => {
        //     setTimeout(() => {
        //         fadingEffect(movieSprite, {
        //             type: "to", alpha: 0, time: 1000, ease: "easeOutQuart" //???
        //         });
        //     }, 1500);

        //     setTimeout(() => {
        //         this.removeChild(movieSprite);
        //         this._onMovieEnded();
        //     }, 2500);
        // });
    }

}