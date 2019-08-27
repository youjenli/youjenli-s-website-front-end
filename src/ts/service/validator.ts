export function isString(param):boolean {
    //抄錄自 https://stackoverflow.com/questions/4059147/check-if-a-variable-is-a-string-in-javascript 的好做法
    return Object.prototype.toString.call(param) === "[object String]";
}

export function isNotBlank(str:string):boolean {
    return isString(str) && str !== '';
}