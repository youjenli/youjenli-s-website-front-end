
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
            stickyPositionSupported = 
                CSS.supports('position', 'sticky') ||
                CSS.supports('position', '-webkit-sticky') ||
                CSS.supports('position', '-moz-sticky') ||
                CSS.supports('position', '-ms-sticky') ||
                CSS.supports('position', '-o-sticky');
        } else {
            const test = document.createElement('div');
            const mStyle = test.style;
            mStyle.cssText = `
                position: -webkit-sticky;
                position: -moz-sticky;
                position: -ms-sticky;
                position: -o-sticky;
                position: sticky;
                `;
            stickyPositionSupported = 
                mStyle.position.indexOf("sticky") !== -1 ||
                mStyle.position.indexOf("-webkit-sticky") !== -1 ||
                mStyle.position.indexOf("-moz-sticky") !== -1 ||
                mStyle.position.indexOf("-ms-sticky") !== -1 ||
                mStyle.position.indexOf("-o-sticky") !== -1 ;
        }
    }
    return stickyPositionSupported;
}