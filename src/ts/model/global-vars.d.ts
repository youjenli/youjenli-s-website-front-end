import {MetaDataOfPost, Post} from './posts';
import { Term, Category, Tag } from './terms';
import { Page } from './posts';
import { FoundPublication } from './search-results';
import { SettingsOfPagination, Pagination} from './pagination';
import { TypeOfContent } from './general-types';
import { Content } from './posts';

export interface MenuItem extends Content {
    name:string;
    hint:string;
    pathOfIcon?:string;
}

export interface Archive<T extends Term> {
    taxonomy:T;
    postsPerPage:number;
    foundPosts:number;
    posts:MetaDataOfPost[];
}
/*
    這個指令稿的用途是宣告此專案會透過全域變數，而不是 rest api 查詢結果所得到的物件。
    這些物件多半來自場景樣板的 template-parts 資料匣裡面。
*/
declare global {
    interface Window { 
        wp:{
            siteName:string;//網站名稱。可能是中文也可能是英文。
            /*
                以下參數的用途是讓 navigo 知道 site url，這樣解析路徑的規則就不用寫死在客戶端。
                site_url 是當使用者加上 wp-admin 之後就可以存取到管理介面的路徑。
                https://developer.wordpress.org/reference/functions/get_site_url/
            */
            siteUrl:string;
            /*
                themeUrl 的用途是提供場景的路徑給前端，這樣前端才可以讀取到圖片的網址。
                這邊之所以要利用這項參數傳遞網址，而不用 base 屬性的原因是那會導致頁面內的錨點功能採用 base 屬性指定的路徑，
                進而導致頁面內的導覽功能失效，因此這邊要透過參數傳遞場景路徑。
            */
            themeUrl:string;
            jsSrcFolder:string;
            urlOfPrismJsSrcFile:string,
            urlOfPrismCssSrcFile:string
            titleBar:{
                menuItems:MenuItem[];
            };
            responseCode:number;
            paginationSettings:SettingsOfPagination;
            pagination:Pagination;
            // posts 是首頁的文章列表
            recentPosts?:MetaDataOfPost[];
            /*
               發文的資訊。
               雖然發文頁理應只有一篇發表物，但我仍採用陣列儲存資料。
               這樣做原因是 wp 發文頁原本的設計就是以陣列的形式吐資料，
               因此若以物件的格式收發文的話可能會有格式錯誤的問題，於是乾脆以陣列格式收資料，
               最後再挑選第一篇來呈現即可。
            */
            completePosts?:Post[];
            /*
               wordpress 專頁 (page) 的資料。
               雖然理論上讀取的情境應該跟發文頁一樣只會讀取一篇，
               但是因為他也會碰到與發文頁一次會讀取整個資料集的問題，
               所以還是以陣列的形式接收資料。
            */
            completePages?:Page[];
            disquz?:{
                shortName:string;
            }
            search?:{
                query:string;
                publications:{
                    totalItems:number;
                    itemsInCurrentPage:FoundPublication[];
                }
                /*
                  註：發文查詢結果的資訊是幫裝在上面的 pagination 裡面，
                  因此這邊不像下面分類和標籤一樣包含分頁資訊。
                */
                categories:{
                    totalItems:number;
                    currentPage:number;
                    totalPages:number;
                    itemsPerPage:number;
                    itemsInCurrentPage:Category[];
                };
                tags:{
                    totalPages:number;
                    currentPage:number;
                    totalItems:number;
                    itemsPerPage:number;
                    itemsInCurrentPage:Tag[];
                }
            }
            archive?:{
                category?:Archive<Category>;
                tag?:Archive<Tag>;
            }
        }
    }
}