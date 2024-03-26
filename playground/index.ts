import { Renderer, Application, Container } from "pixi.js";
import { EventViewer, TranslateReader} from "../src";

async function createApp(preference: "webgl" | "webgpu" = "webgpu") {
    if (document.getElementById("ShinyColors")) {
        document.getElementById("ShinyColors")!.remove();
    }

    const app = new Application<Renderer<HTMLCanvasElement>>();

    await app.init({
        preference,
        backgroundAlpha: 1,
        backgroundColor: 0x000000,
        width: 1136,
        height: 640,
        antialias: false,
        hello: true,
    });

    (globalThis as any).__PIXI_APP__ = app;

    app.canvas.setAttribute("id", "ShinyColors");
    document.body.appendChild(app.canvas);

    let resize = () => {
        let height = document.documentElement.clientHeight;
        let width = document.documentElement.clientWidth;

        let ratio = Math.min(width / 1136, height / 640);

        let resizedX = 1136 * ratio;
        let resizedY = 640 * ratio;

        app.canvas.style.width = resizedX + "px";
        app.canvas.style.height = resizedY + "px";
    };

    resize();
    window.onresize = () => resize();

    return app;
}

const app = await createApp();
const viewer = EventViewer.create();


const reader : TranslateReader = {
    language : 'en',
    read(uid) {
        return undefined
    },
    get(){
        return undefined
    }
}

viewer.addTranslateReader(reader);

viewer.addTo(app.stage);
