export const ConfigSetting : ISetting = {
    infoLog : true,
    hello : true,
    assetUrl : "https://viewer.shinycolors.moe",
    assets : {
        touchToStart : './assets/touchToStart.png',
        autoOn : './assets/autoOn.png',
        autoOff : './assets/autoOff.png',
        jpON : './assets/jpOn.png',
        zhOn : './assets/zhOn.png',
    },
    fonts : {
        jp : {
            filepath : './assets/TsunagiGothic.ttf',
            family : 'TsunagiGothic'
        },
        zh : {
            filepath : './assets/three.ttf',
            family : 'three'
        },
    },
    translate : {
        master_list : 'https://raw.githubusercontent.com/biuuu/ShinyColors/gh-pages/story.json',
        CSV_url : 'https://raw.githubusercontent.com/biuuu/ShinyColors/gh-pages/data/story/{uid}.csv'
    }
}