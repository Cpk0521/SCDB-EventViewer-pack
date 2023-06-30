export function hello(){
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
