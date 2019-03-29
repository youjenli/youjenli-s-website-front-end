/* 此頁程式負責的事務:
   初始化 router 並提供給其他模組使用
*/
import Navigo = require('navigo');

let root = null;
const router = new Navigo(null);
/*
宣告變數和輸出 default 物件要在不同的表達句中完成，否則會出現以下錯誤訊息:
error TS1109: Expression expected.
*/
export default router;