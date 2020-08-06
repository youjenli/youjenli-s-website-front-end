# 關於這個樣板

這是我的[個人網站](https://youjenli.site)之場景。  
因為這是為應徵理想工作而為客製的場景，所以這份文件的重點會擺在介紹場景原始碼的結構，最後才概略說明建置與部署場景的方法。  

## 架構
### 前端
此場景的頁面採用 [Navigo Router], [React.js] 框架所構建的單頁應用程式（SPA），有實現響應式頁面設計（RWD）。  
服務使用者的方法是在他們發送請求給我的個人網站以建立新的會話時，由伺服器回傳前端的程式碼，然後交由 Navigo Router 解析請求並指派對應頁面的[模組](tree/master/ts/component)目錄內的 routeHandler 回應請求。  
這些模組會先透過該請求回覆的內容或是額外發送的非同步請求從 wordpress 系統取得資料，然後運用 React.js 產生對應畫面給使用者看。  
我用來發送請求的函式庫是 Axios。  

[Navigo Router]: https://github.com/krasimir/navigo
[React.js]: https://reactjs.org/

#### 實作的考量

##### 實現 RWD 的策略
前端實現 RWD 的策略是令應用程式在產生任何畫面之前都先偵測螢幕寬度 (viewport width)，然後根據寬度呼叫產生對應寬度畫面的 react.js component 產生畫面內容。  
至於各畫面元件依據螢幕寬度調整尺吋的規則是由許多事先求得的數學公式所組成。當初這樣做的原因是希望能細緻地處理各項畫面元件在不同尺吋裝置上的尺吋，只是做完發現這樣太費時費力，而且效果不如預期得好。  
未來應該會採用類似 boostrap 的策略，在一定螢幕尺吋範圍內令多數畫面元件維持固定的尺吋而不再令其隨螢幕寬度變化大小。  

##### 瀏覽器相容性問題的處理方式
目前沒有做任何事情處理瀏覽器相容性的問題，因為我的網站目前的受眾是各資訊崗位或工作的僱主，而我相信他們應該不至於還在使用 IE 6、IE 8 那樣舊的瀏覽器訪問我的網站，所以多採用各瀏覽器較早實作的 ES6 功能 ── 例如 promise ── 然後再令 TypeScript Transpiler 轉譯程式碼為 ES5 以避免各式相容性問題。至於少部分用到的新功能：css 的 `position:sticky` 和 input 元素的 `placeholder` 屬性則透過 js 偵測是否支援這些功能來採用適當的實作方式。  

未來若要為工作團隊規劃瀏覽器相容性問題的處理對策，那我會先請系統功能的設計者指出要支援的瀏覽器範圍，然後透過 [Can I Use](https://caniuse.com/) 和 [ECMAScript compatible table](https://kangax.github.io/compat-table/es6/) 等網站了解有哪些 css 和 js 功能可以使用，然後再透過 linter 提醒大家不要使用未支援的語法。若有必要也會使用 polyfill 套件以便在舊版瀏覽器提供必要的功能給開發者。  

##### SPA 各功能路由的實作方式
目前使用 Navigo router 呼叫對應的 javascript 函式回應各網址的請求，而未使用 React router 處理請求，原因是我認為應該用傳統程式語法表達路由才有助於理解和編寫程式，不宜使用 jsx 這種宣告示語法。

##### 前端各功能所需要的資料之管理方式
我沒有使用 Redux 管理應用程式的資料和狀態，理由是各模組需要的資料大不相同，而且彼此互不依賴，因此應該暫時不需要透過 redux 追蹤資料的變化以診斷難解的應用程式問題，但未來要是工作有需要，那我不排斥學習 redux，只是現在不想殺雞用牛刀。  

##### 設定樣式的方法
用來設定固定不變，不必視情況產生的 css 之方法主要是先透過 scss 撰寫樣式再轉譯成一般的 css 檔案，最後令網頁於載入過程中去下載這些 css 檔案並套用樣式。  
一開始這樣做的目的是因為我相信要是遵照 jQuery 時代撰寫 Unobstrusive JavaScript 的做法提供樣式，那將來會比較好維護，但後來事實證明這個點子糟透了。調整功能前，我常常得花不少時間找樣式所在的位置，搞得我非常煩躁。  
當畫面開始以元件的概念表達時，樣式與 JavaScript 寫在同一個檔案才是未來容易查到頁面對應程式碼的做法，因此我會在未來重構時大力採用 [Styled Component](https://github.com/styled-components/styled-components)。  

### 後端
當使用者發送請求嘗試與我的個人網站建立會話時，我的個人網站將回傳前端程式碼以及回應請求所需要資料，但我並沒有運用前端做 server-side rendering 的框架產生頁面，亦沒有使用 GraphQL 取代前端後續非同步請求查詢資料的 rest api 介面。  

#### 實作的考量

##### 提供第一個請求所需的資料之方法

這樣做的原因是我以保守的態度實現這個場景的前端功能。若非必要，寧可功能單純也不願意寫一堆未必好用的功能把架構搞得複雜難懂，因此決定在使用者發送第一個請求與我的個人網站建立會話時，透過 wordpress 樣板以 json 物件格式提供資料給前端就好，不使用 server-side rendering。  
至於 GraphQL 則會在未來調整樣板實作方式的時候一併考慮是否以之替代 wordpress 現行的 rest api。  

## 程式語言
用來開發前端頁面的程式語言是 TypeScript，後端是 php。

## 後端系統需求

Wordpress 4.9.4 以上的版本。

## 系統設定限制
為確保場景能順利運作，要特別注意幾項設定問題：

### 系統要使用非 index 型的 permalink

系統必須採用非 index (例: host_name/index.php) 類型的 permalink，否則客戶端可能會無法順利產生有效的 permalink。  

之所以要這樣做的原因是這個場景以 SPA 的架構實現，因此他要在客戶端產生分頁連結。  
然而目前 wordpress 沒有辦法直接在 rest api 提供分頁的格式，因此在透過 rest api 取得發表物的資訊之後，我假設分頁的連結是由發表物的連結再加上系統預設的分頁符號所組成，例如：`http://localhost/category/it-tech/page/%#%`。  
因此要是系統不採用 index permalink，那這樣拼湊的結果就有可能變成無效的分頁連結。  
建議使用 wordpress 內建的 ***「Post name」*** 格式 permalink，也就是 `http://127.0.0.1/sample-post/`。

在我有足夠的心力和時間仔細了解 wordpress rest api 的運作方式並規劃合適的方法處理此問題之前……暫時先這樣限制使用方式。  

## 建置與部署場景的方法

本專案採用 gulp 定義建置任務。之所以不採用常見的 webpack 和 percel 是因為我認為 html、css、javascript 根本是彼此獨立的資源，沒有道理一定得透過單一處理程序一口氣完成他們的設定作業，這樣開發者將難以理解建置作業的執行方式，反而把事情搞得複雜。  
另外，儘管 webpack 的說明文件不斷在改善，但我仍難以完全了解這兩種工具的運作方式。如此一來，當我有任何管理做法與他們預設的不同時，就要花費許多時間調校，因此最後還是毅然決然為自己的網站開發 gulp 建置作業指令稿。  

若要建置專案，請在執行 `npm install` 下載專案套件後，複製 [build-settings-template.js](tree/master/build-settings-template.js) 並更名為 build-settings.js ，然後填寫有關建置的設定欄位，最後執行 `gulp build`。
若要部署專案則同樣要先取得套件，然後同樣在 build-settings.js 指定部署方式和位置，最後執行 `gulp build deploy --series`。此指令`--series`參數是必要的，否則新版 gulp (v4) 會同時執行這兩項任務。  
