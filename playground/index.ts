import * as PIXI from 'pixi.js'
import * as SCDB from '../src'

function createApp() {
    if (document.getElementById("ShinyColors")) {
        document.getElementById("ShinyColors")!.remove();
    }

    const pixiapp = new PIXI.Application<HTMLCanvasElement>({
        hello : false,
        width: 1136,
        height: 640,
    });

    globalThis.__PIXI_APP__ = pixiapp;

    pixiapp.view.setAttribute("id", "ShinyColors");
    document.body.appendChild(pixiapp.view);

    let resize = () => {
        let height = document.documentElement.clientHeight;
        let width = document.documentElement.clientWidth;

        let ratio = Math.min(width / 1136, height / 640);

        let resizedX = 1136 * ratio;
        let resizedY = 640 * ratio;

        pixiapp.view.style.width = resizedX + 'px';
        pixiapp.view.style.height = resizedY + 'px';
    }

    resize();
    window.onresize = () => resize();

    return pixiapp
}

const app = createApp();
const viewer = new SCDB.EventViewer();
app.stage.addChild(viewer);


// viewer.init()

// await viewer.searchAndLoadTranslation('produce_events/202100711.json');
await viewer.loadTranslation('https://raw.githubusercontent.com/biuuu/ShinyColors/gh-pages/data/story/ac1b168.csv')

// await viewer.loadTrack('https://viewer.shinycolors.moe/json/produce_events/202100711.json');
// viewer.start();
viewer.loadAndPlayTrack('https://viewer.shinycolors.moe/json/produce_events/202100711.json');
