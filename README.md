# SCDB-EventViewer-pack
![GitHub package.json version](https://img.shields.io/github/package-json/v/ShinyColorsDB/ShinyColorsDB-EventViewer-pack?style=flat-square)
![Spine version](https://img.shields.io/badge/Spine-3.6%20/%203.7-ff69b4?style=flat-square)

[ShinyColorsDB-EventViewer](https://github.com/ShinyColorsDB/ShinyColorsDB-EventViewer) typescript version

A simple viewer that renders shinycolors events

## Requirements
-   PixiJS : >7
-   GSAP : >3
-   pixi-spine : >4


## Basic usage

```html
<script src="https://pixijs.download/v7.2.4/pixi.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@pixi/sound@5.2.0/dist/pixi-sound.js"></script>
<script src="https://cdn.jsdelivr.net/npm/pixi-spine@4.0.4/dist/pixi-spine.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.2/PixiPlugin.min.js"></script>
<script src="scdb-eventviewer.js"></script> 
```

```js
//create pixi app
const pixiapp = new PIXI.Application({
        width: 1136,
        height: 640,
        view: document.getElementById('canvas'),
});

/**
 * create EventViewer
 * same as 
 * const viewer = SCDB.EventViewer.new()
*/
const viewer = new SCDB.EventViewer();

/**
 * add the viewer to app stage
 * same as
 * pixiapp.stage.addChild(viewer);
*/
viewer.addTo(pixiapp.stage)


// const url = await SCDB.Helper.searchFromMasterList('produce_events/202100711.json');
// const csv = await SCDB.Helper.loadCSV(url);
// const data = SCDB.Helper.CSVToJSON(csv);

// await viewer.loadTrack('https://viewer.shinycolors.moe/json/produce_events/202100711.json');
// await viewer.loadTranslateData(url);
// viewer.start();

viewer.loadAndPlayTrack('https://viewer.shinycolors.moe/json/produce_events/202100711.json');

```
