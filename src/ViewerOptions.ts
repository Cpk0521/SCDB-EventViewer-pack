import type { IViewerOptions } from '@/types/setting';

export const Options : IViewerOptions = {
    skipHello : false,
    disableInfoLog : false,
    disableBlur : false,
    resourceUrl : "https://viewer.shinycolors.moe",
    fonts : {
        jp : {
            filepath : './assets/TsunagiGothic.ttf',
            family : 'TsunagiGothic'
        },
        translated : {
            filepath : './assets/three.ttf',
            family : 'three'
        }        
    },
    translate : {
        master_list : 'https://raw.githubusercontent.com/biuuu/ShinyColors/gh-pages/story.json',
        CSV_url : 'https://raw.githubusercontent.com/biuuu/ShinyColors/gh-pages/data/story/{uid}.csv'
    },
    assets : {
        touchToStart : './assets/touchToStart.png',
        autoBtn : {
            On : './assets/autoOn.png',
            Off : './assets/autoOff.png',
        },
        translationBtn : {
            On : './assets/zhOn.png',
            Off : './assets/jpOn.png',
        }
    }
}