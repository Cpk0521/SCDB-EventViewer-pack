import { Resolver } from "../types/helper";
import { updateConfig } from "../utils/updateSetting";

const Default_Resolver : Resolver = {
    resourceUrl: "https://viewer.shinycolors.moe",
    name: "default",
    story(track : string){
        return `${this.resourceUrl}/json/${track.includes('.json') ? track : `${track}.json`}`;
    },
    bg(bg: string) {
        return `${this.resourceUrl}/images/event/bg/${bg}.jpg`;
    },
    textFrame(textFrame:string) {
        return `${this.resourceUrl}/images/event/textFrame/${textFrame}.png`;
    },
    fg: function (fg: string): string {
        return `${this.resourceUrl}/images/event/fg/${fg}.png`;
    },
    se: function (se: string): string {
        return `${this.resourceUrl}/sounds/se/event/${se}.m4a`;
    },
    bgm: function (bgm: string): string {
        return `${this.resourceUrl}/sounds/bgm/${bgm}.m4a`;
    },
    voice: function (voice: string): string {
        return `${this.resourceUrl}/sounds/voice/events/${voice}.m4a`;
    },
    movie: function (movie: string): string {
        return `${this.resourceUrl}/movies/idols/card/${movie}.mp4`;
    },
    spine: function (charType: string, thisCharCategory: string, charId: string): string {
        return `${this.resourceUrl}/spine/${charType}/${thisCharCategory}/${charId}/data.json`;
    },
    neededFrame: function (label: string): string {
        return `${this.resourceUrl}/images/event/select_frame/00${label}.png`;
    },
    still: function (still: string): string {
        return `${this.resourceUrl}/images/event/still/${still}.jpg`;
    },
    stillWithType: function (stillType: string, stillId: string): string {
        return `${this.resourceUrl}/images/content/${stillType}/card/${stillId}.jpg`;
    }
}

export abstract class EventUrlResolver {
    public static readonly resolvers: Map<string, Resolver> = new Map([
        [Default_Resolver.name, Default_Resolver]
    ]);

    public static addResolver(resolver : Partial<Resolver>&{name: string}) : void {
        this.resolvers.set(resolver.name, updateConfig({...Default_Resolver}, resolver));
    }

    public static getResolver(name: string): Resolver | undefined {
        return this.resolvers.get(name);
    }
}