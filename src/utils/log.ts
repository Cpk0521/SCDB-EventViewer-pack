export function Hello(){
    const log = [
        `\n\n %c  %c   ShinyColors Event Viewer ${__VERSION__}   %c  %c  https://github.com/ShinyColorsDB  %c \n\n`,
        'background: #28de10; padding:5px 0;',
        'color: #28de10; background: #030307; padding:5px 0;',
        'background: #28de10; padding:5px 0;',
        'background: #5eff84; padding:5px 0;',
        'background: #28de10; padding:5px 0;',
    ];

    console.log(...log);
}

// console.log(`%c%s%c%s%c%s`, 'color:white;background:#23c4ed', `[INFO]`, '',' ', 'color:#23c4ed', `[${this._current}/${this._track.length - 1}]`, this.currentTrack)
export function TrackLog(current : number, length : number, Track : object){
    const log = [
        '%c%s%c%s%c%s',
        'color:white;background:#23c4ed',
        '【Track】',
        '',
        ' ',
        'color:#23c4ed',
        `[${current}/${length}]`,
        Track
    ];

    console.log(...log);
}