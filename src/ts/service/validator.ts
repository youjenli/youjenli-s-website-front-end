export function isString(param):boolean {
    //抄錄自 https://stackoverflow.com/questions/4059147/check-if-a-variable-is-a-string-in-javascript 的好做法
    return Object.prototype.toString.call(param) === "[object String]";
}

export function isNotBlank(str:string):boolean {
    return isString(str) && str !== '';
}

/*
    判斷參數的型態是否為數值，而且又是有理數──也就是不含 NaN、正負無限大。
*/
export function isNum(param):boolean {
    return typeof param == 'number' && param == Number(param) && Number.isFinite(param) === true;
    /*
        這個函式早先使用 !NaN 判斷 param 的做法沒有考慮到數值、null、undefined 以外其他型態的資料，
        例如 !isNaN(' ') 的結果就是 true，而且邏輯上也非常合理。
        
        為解決這個問題我參考了以下範例改寫實作：
        https://codepen.io/grok/pen/LvOQbW?editors=0010

        註：param == Number(param) 這句是利用 NaN 絕對不等於自己的特性過濾掉 NaN
    */
}

export function isObject(obj):boolean {
    return typeof obj === 'object' && obj !== null;
}