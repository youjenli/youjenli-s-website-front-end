const regex = /^[1-9]$/;

export function formatMonthOrDayTo2Digits(monthOrDay:number):string {
    let str = monthOrDay.toString();
    let match = regex.exec(str);
    if (match) {
        str = "0" + match[0];
    }
    return str;
}