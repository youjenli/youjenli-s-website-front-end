/// <reference path="../model/global-vars.d.ts"/>
/*
    因為 Navigo 是以 UMD 模組格式輸出，而裡面 commonjs 的部分又是以 Navigo 建構函式取代 commonjs 預設 export 物件，
    所以 TypeScript 型態定義檔要採用 export = module 的方式輸出。這使得我們要用下面的方法載入 Navigo 模組。
*/
import Navigo = require('navigo');
import {isNotBlank} from './validator';
import {prependLeadingSlash} from './formatters';

let siteUrl = null;
if (isNotBlank(window.wp.siteUrl)) {
  siteUrl = window.wp.siteUrl;
} else {
  siteUrl = 'http://127.0.0.1';
}

export function extractPathFromUrl(url:string):string {
  if (isNotBlank(url)) {
    url = prependLeadingSlash(url.replace(siteUrl, ''));
  }
  return url;
}

/*
  實驗發現一定要給 Navigo root 的路徑。
  此路徑要包含通訊協定和 host name，缺一不可，否則它會無法正常解析部分路徑。
*/
const navigo:Navigo = new Navigo(siteUrl, false);

/*
  替換 navigo 預設從錨點取得連結的方式，使它只解析 wordpress site url 之後的路徑，
  這樣它才不會在原本網址的後面再度加上完整的網址
*/
navigo.getLinkPath = (link) => {
  return extractPathFromUrl(link.getAttribute('href'));
}

export const router:Navigo = navigo;