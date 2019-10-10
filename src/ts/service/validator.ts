export function isString(param):boolean {
    //抄錄自 https://stackoverflow.com/questions/4059147/check-if-a-variable-is-a-string-in-javascript 的好做法
    return Object.prototype.toString.call(param) === "[object String]";
}

export function isNotBlank(str:string):boolean {
    return isString(str) && str !== '';
}

export function isNum(param):boolean {
    return param && !isNaN(param);
    /*
        判斷是否為數字的原理：
        1. 前面讀取變數 param 可以過濾掉 undefined, null, 空字串的情況。
        2. 後面 !isNaN 可以接著過濾掉內容為 undefined, null 的字串，但是又會讓純數值字串通過。

        欲進一步了解運作邏輯，可參閱這個實驗
        https://codepen.io/youjenli/pen/XWrambm?editors=1111
    */
}

export function isObject(obj):boolean {
    return typeof obj === 'object' && obj !== null;
}