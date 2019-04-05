export function calculateViewPortWidth():number {
    return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
}
export function calculateViewPortHeight():number {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}