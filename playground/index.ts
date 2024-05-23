import { Renderer, Application, Assets } from "pixi.js";
import { EventViewer, EventStorage } from "../src";

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
// const viewer = EventViewer.create().addTo(app.stage);
const viewer = new EventViewer({
    stage : app.stage,
})

const trackdata = await EventStorage.loadTrack('produce_events/202100711.json');
const TLData = await EventStorage.loadTranslate('produce_events/202100711.json', 'zh');

// await viewer.play({
//     Track : trackdata,
//     Translation : TLData,
// })