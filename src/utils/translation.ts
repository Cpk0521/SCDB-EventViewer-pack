import { Helper } from "..";

let translate_CSV_url = 'https://raw.githubusercontent.com/biuuu/ShinyColors/gh-pages/data/story/{uid}.csv';
let master_list = 'https://raw.githubusercontent.com/biuuu/ShinyColors/gh-pages/story.json';

// searchFromMasterList -> getCSVUrl => fetch => CSVToJSON

export async function searchFromMasterList(jsonPath : string){
    let masterlist = await Helper.loadJson<string[][]>(master_list)
    return getCSVUrl(masterlist, jsonPath);
}

function getCSVUrl(masterlist: string[][], jsonPath : string) {
    let translateUrl : string | undefined;
    masterlist.forEach(([key, hash]) => {
        if (key === jsonPath){
            translateUrl = translate_CSV_url.replace('{uid}', hash);
        }
    })
    return translateUrl
};

export function CSVToJSON(csvtext : string) {
    const data : TranslateData = {
        url: '',
        translater: '',
        table: [],
    }

    if (csvtext === "") { return data; }

    let table = csvtext.split(/\r\n/).slice(1);

    table.forEach(row => {
        let columns = row.split(',');

        if (columns[0] === 'info') {
            data['url'] = columns[1];
        }
        else if (columns[0] === '译者') {
            data['translater'] = columns[1];
        }
        else if (columns[0] != '') {
            data['table'].push({
                id: columns[0],
                name: columns[1],
                text: columns[2].replace('\\n', '\r\n'),
                tran: columns[3].replace('\\n', '\r\n'),
            });
        }

    })

    return data
}