
const isCssSupportFunctionAvailable = (CSS && CSS.supports)
let inputPlaceHolderSupported = null;
let stickyPositionSupported = null;

export function isPlaceHolderOfInputSupported():boolean {
    if (inputPlaceHolderSupported === null) {
        const input = document.createElement('input');
        inputPlaceHolderSupported = 'placeholder' in input;
        /* 以上技巧參考自 http://diveinto.html5doctor.com/detect.html
         */
    }
    return inputPlaceHolderSupported;
}

export function isStickyPositionSupported():boolean {
    if (stickyPositionSupported === null) {
        if (isCssSupportFunctionAvailable){
            stickyPositionSupported = CSS.supports('position', 'sticky');
        } else {
            const test = document.createElement('div');
            const mStyle = test.style;
            mStyle.cssText = "position:sticky";
            stickyPositionSupported = mStyle.position.indexOf("sticky") !== -1;
        }        
    }
    return stickyPositionSupported;
}