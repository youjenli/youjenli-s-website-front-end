import { isNotBlank } from './validator';

/*
    解析 url query string 字串為 javascript 物件
    若格式都正確則回傳解析後的物件，否則回傳 null。
*/
export function interpretQueryString(query:string):{} {
    const result = {};
    if (isNotBlank(query)) {
        const params = query.split('&');
        for (let param of params) {
            const keyValuePair = param.split('=');
            if (isNotBlank(keyValuePair[0]) && isNotBlank(keyValuePair[1])) {
                result[keyValuePair[0]] = keyValuePair[1];
            } else {
                return null;
            }
        }
    }
    return result;
}