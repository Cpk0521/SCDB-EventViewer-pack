// searchFromMasterList -> getCSVUrl => fetch => CSVToJSON
import { loadJson } from "./loadJson";

export async function searchFromMasterList(
    tag : string,
    master_list : string,
    translate_CSV_url : string
) {
    let translateUrl : string | undefined;
    let list = await loadJson<string[][]>(master_list)
    if(list){
        list.forEach(([key, hash]) => {
            if (key === tag){
                translateUrl = translate_CSV_url.replace('{uid}', hash);
            }
        })
    }

    return translateUrl
}

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