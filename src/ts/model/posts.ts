import { Category, Tag } from './terms';
import { TypeOfContent } from './general-types';

export interface Content {
    type:TypeOfContent;
    id:number;
    date:Date;
    modified?:Date;
    title:string;
    slug:string;
    url:string;
    commentPermitted?:boolean;
}

export interface Publication extends Content { 
    excerpt?:string;
    thumbnail?:{
        url:string;
        caption?:string;
    }
    estimatedReadingTimes:number;
}

export interface MetaDataOfPost extends Publication {
    gist?:string;
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