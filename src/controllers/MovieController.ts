import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Assets } from '@pixi/assets'
import { IController } from '../types/controller'
import { Texture, VideoResource } from "@pixi/core";
import { fadingEffect } from "@/utils/effect";

export class MovieController extends Container implements IController {

    protected _onMovieEnded : Function = () => {} 

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
        let texture = Assets.get(`movie_${movie}`);
        let movieSprite = new Sprite(texture);

        this.addChild(movieSprite);

        const controller = (movieSprite.texture as Texture<VideoResource>).baseTexture.resource.source;
        controller.play() //!!!
        controller.addEventListener("ended", () => {
            setTimeout(() => {
                fadingEffect(movieSprite, {
                    type: "to", alpha: 0, time: 1000, ease: "easeOutQuart" //???
                });
            }, 1500);

            setTimeout(() => {
                this.removeChild(movieSprite);
                this._onMovieEnded();
            }, 2500);
        });
    }

}