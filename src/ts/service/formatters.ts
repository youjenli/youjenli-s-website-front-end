import { isNotBlank } from './validator';

const regex = /^[1-9]$/;

export function formatMonthOrDayTo2Digits(monthOrDay:number):string {
    let str = monthOrDay.toString();
    let match = regex.exec(str);
    if (match) {
        str = "0" + match[0];
    }
    return str;
}

/*
    參考自 
    https://stackoverflow.com/questions/6525538/convert-utc-date-time-to-local-date-time
*/
export function convertGMTDateToLocalDate(date_gmt:Date) {
    var newDate = new Date(date_gmt.getTime()+date_gmt.getTimezoneOffset()*60*1000);

    var offset = date_gmt.getTimezoneOffset() / 60;
    var hours = date_gmt.getHours();

    newDate.setHours(hours - offset);

    return newDate;
}

/*
  這個函式的用途是為了逃逸字串裡面的 regex 字串。
  它的主要用途是幫忙產生發表物分頁連結的格式。
  https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
*/
export function escapeRegexCharacters(token:string):string {
    return token.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export function prependLeadingSlash(str:string):string {
    if (isNotBlank(str)) {
        str = `/${str.replace(/^\/(.*)$/, '$1')}`
    }
    return str;
}

export function trailingSlashIt(str:string):string {
    if (isNotBlank(str) && !/\/$/.test(str)) {
        str = str + '/';
    }
    return str;
}