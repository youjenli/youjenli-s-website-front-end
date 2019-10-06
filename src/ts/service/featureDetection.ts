import { isNum } from './validator';

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

export function isFontSupported(test:string, control:string, targetSize?:number):boolean {
    const str = "註 20190520 發現這套檢驗方法只在 zoom level 是 100% 的情況下有用。";
    const testElement = document.createElement('span');
    let fontSize = isNum(targetSize) ? targetSize : 16;
    testElement.style.fontFamily = `'${test}', '${control}'`;
    testElement.style.fontSize = `${fontSize}px`;
    testElement.style.transform = 'scale(1)';
    testElement.innerHTML = str;
    const controlElement = document.createElement('span');
    controlElement.style.fontFamily = `${control}`;
    controlElement.style.fontSize = `${fontSize}px`;
    controlElement.style.transform = 'scale(1)';
    controlElement.innerHTML = str;
    const body = document.getElementsByTagName('body')[0];
    body.appendChild(testElement);
    body.appendChild(controlElement);

    let fontSupported = false;
    if (testElement.offsetWidth != controlElement.offsetWidth) {
       //支援 MacOS 的 Yuppy 字體
       fontSupported = true;
    }

    //檢測完成後，移除測試用的元素。
    testElement.parentElement.removeChild(testElement);
    controlElement.parentElement.removeChild(controlElement);

    return fontSupported;
}