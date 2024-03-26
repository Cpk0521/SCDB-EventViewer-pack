import { Container, Sprite, Assets, Texture,  } from 'pixi.js';
import { fadingEffect } from "@/utils/effect";
import type { TrackFrames } from "@/types/track";
import type { EventViewer } from "../EventViewer";

export class MovieController extends Container {

    protected viewer: EventViewer;
    protected _onMovieEnded : Function = () => {} 

    constructor(viewer: EventViewer, order?: number) {
        super();
        this.viewer = viewer;
        this.addTo(viewer, order);
    }
    
    public addTo<C extends Container>(parent: C, order?: number): this {
        parent.addChild(this);
        this.zIndex = order ?? 0;
        return this;
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