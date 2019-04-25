export interface MetaOfPage {
    title:string;
    id:number;
    date:Date;
    modified:Date;
    parent?:{
        title:string;
        url:string;
    }
    imageUrl?:string;
    excerpt?:string;
}

export interface Page extends MetaOfPage {
    content:string;
}

export interface ParsedPage extends MetaOfPage {
    dom:Document;
}