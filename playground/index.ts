import { Renderer, Application, Container, Assets, Sprite, Texture } from "pixi.js";
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
        hello: false,
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
const viewer = EventViewer.create().addTo(app.stage);




// const touchToStart = Texture.from('./assets/touchToStart.png');
// touchToStart.anchor.set(0.5);
// touchToStart.position.set(568, 500);
// touchToStart.zIndex = 10;
// app.stage.addChild(touchToStart);


// viewer.load('produce_events/202100711.json');

