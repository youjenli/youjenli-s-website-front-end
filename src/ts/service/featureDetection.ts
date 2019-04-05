
let isPlaceHolderSupported = null;

export function isPlaceHolderOfInputSupported():boolean {
    if (isPlaceHolderSupported === null) {
        const input = document.createElement('input');
        isPlaceHolderSupported = 'placeholder' in input;
        /* 以上技巧參考自 http://diveinto.html5doctor.com/detect.html
         */
    }
    return isPlaceHolderSupported;
}