import { Assets, Renderer, Application, autoDetectRenderer, Container, extensions, Sprite, ExtensionType} from 'pixi.js';
import { spineLoaderExtension, spineTextureAtlasLoader, SpinePipe, Spine, SpineDebugRenderer} from '../lib/index';

async function createApp(preference: 'webgl' | 'webgpu'){
    const app = new Application<Renderer<HTMLCanvasElement>>();

    await app.init({
        preference,
        backgroundAlpha: 1,
        backgroundColor: 0x000000,
        width: 1136,
        height: 640,
        antialias: false,
        hello : true,
    })

    globalThis.__PIXI_APP__ = app;

    if (document.getElementById("ShinyColors")) {
        document.getElementById("ShinyColors")!.remove();
    }
    (app.canvas as HTMLCanvasElement).setAttribute("id", "ShinyColors")
    document.body.appendChild(app.canvas as HTMLCanvasElement);

    let resize = () => {
        let height = document.documentElement.clientHeight;
        let width = document.documentElement.clientWidth;

        let ratio = Math.min(width / 1136, height / 640);

        let resizedX = 1136 * ratio;
        let resizedY = 640 * ratio;

        app.canvas.style!.width = resizedX + 'px';
        app.canvas.style!.height = resizedY + 'px';
    }

    resize();
    window.onresize = resize;

    return app;
}

extensions.add(spineLoaderExtension, spineTextureAtlasLoader, SpinePipe);
const app = await createApp('webgpu');

Assets.add({
    alias: 'modelskel', src: 'https://viewer.shinycolors.moe/spine/idols/stand/1040210030/data.json'
})

Assets.add({
    alias: 'modelatlas', src: 'https://viewer.shinycolors.moe/spine/idols/stand/1040210030/data.atlas'
})

const asset = await Assets.load(['modelskel', 'modelatlas'])

const model = Spine.from({
    skeleton : 'modelskel',
    atlas : 'modelatlas',
    scale : 5
})

model.width = 1136/2
model.height = 640/2
model.scale.set(0.5)
model.pivot.set(0.5)

app.stage.addChild(model);
new SpineDebugRenderer().registerSpine(model)


const texture = await Assets.load('https://viewer.shinycolors.moe/spine/idols/stand/1040210030/data.png');

const spite = new Sprite(texture);
app.stage.addChild(spite);;