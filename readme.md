# 關於這個樣板

這是我的 wordpress 個人網站之場景。

## 系統需求

適用於 Wordpress 4.9.4 以上的版本。

## 系統設定限制

為確保場景能順利運作，要特別注意以下幾項設定問題：

### 使用非 index 型的 permalink

系統必須採用非 index (例: host_name/index.php) 類型的 permalink，否則客戶端可能會無法順利產生有效的 permalink。  

之所以要這樣做的原因是這個場景以 SPA 的架構實現，因此他要在客戶端產生分頁連結。  
然而目前 wordpress 沒有辦法直接在 rest api 提供分頁的格式，因此在透過 rest api 取得發表物的資訊之後，我假設分頁的連結是由發表物的連結再加上系統預設的分頁符號所組成，例如：`http://localhost/category/it-tech/page/%#%`。  
因此要是系統不採用 index permalink，那這樣拼湊的結果就有可能變成無效的分頁連結。  
建議使用 wordpress 內建的「Post name」格式 permalink，也就是 `http://127.0.0.1/sample-post/`。

在我有足夠的心力和時間仔細了解 wordpress rest api 的運作方式並規劃合適的方法處理此問題之前……暫時先這樣限制使用方式。  
