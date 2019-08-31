import { AxiosResponse } from 'axios';
import { TypeOfContent } from './general-types'

interface CommonPropertiesOfPostTypes {
    id:number;
    date:string;
    date_gmt:string;
    guid:{
        rendered:string;
    };
    modified:string;
    modified_gmt:string;
    slug:string;
    status:'publish' | 'future' | 'draft' | 'pending' | 'private';
    type:TypeOfContent;
    link:string;
    title:{
        rendered:string;
    };
    content:{
        rendered:string;
        protected:boolean;
    };
    excerpt:{
        rendered:string;
        protected:boolean;
    };
    author:number;
    featured_media:number;//發文的意象圖的編號
    comment_status:'open' | 'closed';
    ping_status:'open' | 'closed';
    template:string;
    meta:[];
    _links:{
        self: {//存取此文章的 rest api 路徑
            href:string;
        }[];
        collection: {//存取此集合的 rest api 路徑
            href:string;
        }[];
        about: {//存取此類型資源的 rest api 路徑
            href:string;
        }[];
        author: {//取得作者資訊的 rest api 位置
            embeddable:boolean;
            href:string;
        }[];
        replies: {//取得評論的 rest api 位置
            embeddable: boolean;
            href: string;
        }[];
        "version-history": {//存取版本紀錄的 rest api 位置
            href: string;
        }[];
        "wp:featuredmedia":{//文章意象圖的 rest api 位置。
            embeddable:boolean;
            href: string;
        }[];
        "wp:attachment": {//取得隨附於此發表物的媒體之 rest api 位置
            href:string;
        }[];
        "wp:term": {//取得此發表物的 taxonomy 之資訊
            taxonomy:string;
            embeddable:boolean;
            href:string;
        }[];
        "curies": {
            name:string;
            href:string;
            templated:boolean;
        }[];
    };
}

export interface PostEntity extends CommonPropertiesOfPostTypes {
    uri:string;
    password:string;
    format:'standard' | 'aside' | 'chat' | 'gallery' | 'link' | 'image' 
            | 'quote' | 'status' | 'video' | 'audio';
    
    sticky:boolean;
    categories:number[];
    tags:number[];
}

export interface PageEntity extends CommonPropertiesOfPostTypes {
    parent:number;
    menu_order:number;
}

export interface CategoryEntityInEmbedContext {
    id: string;
    link: string; //permalink
    name: string; //顯示名稱
    slug: string,
    taxonomy: string,
    _links: {
        self: {//此分類的 rest api 位置
            href:string;
        }[];
        collection: {//取得這類 taxonomy 列表的 rest api 位置
            href:string;
        }[];
        about: {//關於這類 taxonomy 的資訊之 rest api 位置
            href:string;
        }[];
        up: {//存取父母分類資訊的連結
            embeddable:boolean;
            href:string;
        }[];
        "wp:post_type": {
            /* 
             * 取得隸屬此分類的發表物之連結
             * 例：http://127.0.0.1/wp-json/wp/v2/posts?categories=3
             */
            href:string;
        }[];
        curies: {
            name:string;
            href:string;
            templated:boolean;
        }[];
    }
}

export interface CategoryEntityInViewContext extends CategoryEntityInEmbedContext {
    count: number,
    description: string;
    parent: number, //The parent term ID
    meta: [];
}

export interface TagEntityInEmbedContext {
    id: number;
    link: string;//permalink
    name: string;
    slug: string;
    taxonomy: string;//taxonomy 在資料庫中的名稱
    _links: {
        self: {
            href:string;// 透過 rest api 存取此標籤資訊的位置
        }[];
        collection: {
            href:string;// 存取標籤列表的 rest api 位置
        }[];
        about: {
            href:string;// 存取有關這種 taxonomy 的資訊之 rest api 路徑。
        }[];
        "wp:post_type": {
            href:string;//存取以此標籤標記的發表物之 rest api 位置
        }[];
        curies: {
            name:string;
            href:string;
            templated:boolean;
        }[];
    };
}

export interface TagEntityInViewContext extends TagEntityInEmbedContext {
    count: number;
    description: string;
    meta: [];
}

export interface MediaEntityInEmbedContext {
    id: string;
    date: string;
    slug: string;
    type: TypeOfContent; //Type of Post for the object. 例：attachment"
    link: string; //以網頁展示此 media 的 permalink
    title: {
        rendered: string;//The title for the object. 不含附檔名
    };
    author: number; //上傳者的 id
    caption: {
        rendered: string;//含 p 與斷行記號的 caption
    };
    alt_text: string; //替代顯示文字
    media_type: string; //媒體類型，例 image
    mime_type: string; // 例："image/jpeg"
    media_details: {
        width: number;
        height: number;
        file: string; //在主機位置之後的路徑名稱，例："2019/05/Webp.net-compress-image.jpg"
        image_meta: {
            aperture: string;
            credit: string;
            camera: string;
            caption: string;//這裡的 caption 用途不明，跟主欄位的 caption 不同。
            created_timestamp: string; //這裡的 timestamp 可能為 "0" 而跟主欄位的 date 不同。
            copyright: string;
            focal_length: string;
            iso: string;
            shutter_speed: string;
            title: string;//這裡的 title 可能為空，跟主欄位的 title 不同。
            orientation: string;
            keywords: [];
        },
        sizes: {} //不清楚用途
    };
    source_url: string;//此媒體在系統上的位置：例 "http://127.0.0.1/wp-content/uploads/2019/05/Webp.net-compress-image.jpg"
    _links: {
        self: {
            href:string;//以 rest api 存取此媒體資訊的路徑
        }[];
        collection: {
            href:string;//提供此類物件資訊的 rest api 接口，例："http://127.0.0.1/wp-json/wp/v2/media"
        }[];
        about: {
            href:string;//提供此類媒體的 rest api 接口，例："http://127.0.0.1/wp-json/wp/v2/types/attachment"
        }[];
        author: {
            embeddable:boolean;
            href:string;//提供此媒體的作者之相關資訊的 rest api 接口，例："http://127.0.0.1/wp-json/wp/v2/users/1"
        }[];
        replies: {
            embeddable:boolean;
            href:string;//提供此媒體的評論資訊之 rest api 接口，例："http://127.0.0.1/wp-json/wp/v2/comments?post=69"
        }[];
    };
}

export interface MediaEntityInViewContext extends MediaEntityInEmbedContext {
    date_gmt: string;
    guid: {
        rendered: string;
    };
    modified: string;
    modified_gmt: string;
    status: 'publish' | 'future' | 'draft' | 'pending' | 'private';
    comment_status: 'open' | 'closed';
    ping_status: 'open' | 'closed';
    template: string;
    meta: [];
    description: {
        rendered: string;//含 anchor 和 p 的字連結字串
    };
    post: number;//發表物的 id
}

export interface FoundEntityInBothViewAndEmbedContext {
    id: number;
    title:string;
    url: string;
    type: 'post';
    subtype: TypeOfContent;
    _links:{
        self:{
            embeddable:boolean;
            href:string;//以 rest api 存取此媒體資訊的路徑，例：http://127.0.0.1/wp-json/wp/v2/pages/120
        }[];
        about:{
            href: string;//提供此類媒體的 rest api 接口，例：http://127.0.0.1/wp-json/wp/v2/types/page
        }[];
        collection: {
            href:string;//提供此類物件資訊的 rest api 接口，例：http://127.0.0.1/wp-json/wp/v2/search
        }[];
    };
}

//這是各項負責抓取資料的 ajax 程式回傳給業務程式的預設資料格式
export interface ResultOfFetching<T> {
    modelObjs:T[];
    response:AxiosResponse;
}