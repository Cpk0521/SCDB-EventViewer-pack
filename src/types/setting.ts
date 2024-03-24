// export interface IViewerOptions {
//     skipHello : boolean;
//     disableInfoLog : boolean,
//     disableBlur : boolean,
//     resourceUrl : string,
//     fonts : {
//         jp : FontSetting,
//         translated : FontSetting,
//         [key: string]: FontSetting;
//     },
//     translate : {
//         master_list : string,
//         CSV_url : string,
//     },
//     assets : {
//         touchToStart : string,
//         autoBtn : {
//             On : string,
//             Off : string
//         },
//         translationBtn : {
//             On : string,
//             Off : string
//         }
//     }
// }

export type ViewerProps = {
    skipHello : boolean;
    disableInfoLog : boolean,
    disableBlur : boolean,
    resourceUrl : string,
    assets : {
        font : FontSetting,
        touchToStart : string,
        autoBtn : {
            On : string,
            Off : string
        },
        translationBtn : {
            On : string,
            Off : string
        }
    }
}

export type FontSetting = {
    filepath : string
    family : string
}

export const spineAlias : Record<string, string> = {
    stand_fix : 'stand',
    stand_costume_fix : 'stand_costume',
    stand_flex : 'stand',
    stand_costume_flex : 'stand_costume',
    stand : 'stand',
    stand_costume : 'stand_costume',
    stand_jersey : 'stand_jersey',
    stand_silhouette : 'stand_silhouette'
}