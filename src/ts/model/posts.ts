import { Category, Tag } from './terms';
import { TypeOfContent } from './general-types';

export interface Publication {
    type:TypeOfContent;
    id:number;
    title:string;
    slug:string;
    url:string;
    date:Date;
    modified?:Date;
    excerpt?:string;
    thumbnail?:{
        url:string;
        caption?:string;
    }
}

export interface MetaDataOfPost extends Publication {
    categories?:Category[];
    tags?:Tag[];
}

export interface MetaDataOfPage extends Publication {
    parent?:{
        title:string;
        url:string;
        slug:string;
    }
}

export interface Post extends MetaDataOfPost {
    content:string;
}

export interface ParsedPost extends MetaDataOfPost {
    dom:Document;
}

export interface Page extends MetaDataOfPage {
    content:string;
}

export interface ParsedPage extends MetaDataOfPage {
    dom:Document;
}