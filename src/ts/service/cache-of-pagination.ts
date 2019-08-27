export enum TypesOfCachedItem {
    Post = 'Post',
    Page = 'Page',
    Category = 'Category',
    Tag = 'Tag',
    Search = 'Search'
}

interface RecordOfCache {
    type:TypesOfCachedItem;
    identifier:string;
    content:any;
    timeoutId?:number;
}

/*
  頁面快取的管理方法：
  為避免佔用太多客戶端的記憶體，只保一定數量的紀錄。
  
  為辨識快取的資料是否符合需要，因此勢必要保留資源的分頁資訊，只是這一樣就有分頁紀錄可能過時而與伺服器不同步的問題。
  我要用來解決這個問題的方法是在快取加入紀錄時，排程在時間到的時候就刪除該筆紀錄。
  這樣客戶端雖然可能會從快取拿到過時的分頁紀錄，但是這個過時的狀態不會維持太久，
  他很快可以藉由重新取得網頁，或是快取紀錄消失等狀況使模組載入最新的分頁紀錄。

  此外，當功能模組從快取拿資料時，我們還會更新刪除快取的排程。
*/

const MAX_SIZE_OF_CACHE = 10;
let cache:RecordOfCache[] = [];

export function deleteRecord(type:TypesOfCachedItem, identifier:string):void {
    cache = cache.filter( item => item.type != type || item.identifier != identifier );
}

export function addRecord(type:TypesOfCachedItem, identifier:string, content:any):void {
    if (cache.length == MAX_SIZE_OF_CACHE) {//若紀錄已超出上限，則刪除最早加入的紀錄
        const item = cache.shift();
        if (item) {
            clearTimeout(item.timeoutId);
        }
    }
    //接下來的動作是產生新的快取紀錄
    const record = {
        type:type,
        identifier:identifier,
        content:content
    };
    const timeoutId = window.setTimeout(() => {
        deleteRecord(record.type, record.identifier);
    }, 30/*分*/ * 60/*秒*/ * 1000/*毫秒*/);
    record['timeoutId'] = timeoutId;
    cache.push(record);
}

export function getRecord(type:TypesOfCachedItem, identifier:string):any {
    let found = cache.find(record => record.type == type && record.identifier == identifier );
    if (found != undefined) {
        clearTimeout(found.timeoutId);
        const newTimeoutId = window.setTimeout(() => {
            deleteRecord(found.type, found.identifier);
        }, 30/*分*/ * 60/*秒*/ * 1000/*毫秒*/);
        found['timeoutId'] = newTimeoutId;
        return found.content;
    } else {
        return null;
    }
}