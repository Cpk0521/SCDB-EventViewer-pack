import { Sprite, Texture } from "pixi.js";

export function createEmptySprite({
    color,
    alpha = 1,
    width = 1136,
    height = 640,
}: Partial<Record<string, number>>) {
    let sprite = new Sprite(Texture.WHITE);
    sprite.width = width;
    sprite.height = height;
    sprite.anchor.set(0.5);
    sprite.position.set(width / 2, height / 2);
    sprite.alpha = alpha || 1;

    if (color != undefined) {
        sprite.tint = color;
    }

    return sprite;
}
