export interface CategoryOfPost {
    id:number,
    name:string,
    url:string,
    description?:string,
    parent?:CategoryOfPost
}

export type TagOfPost = CategoryOfPost;

export interface MetaOfPost {
    id:number,
    urlOfPost:string,
    date:Date,
    modified?:Date,
    categories?:CategoryOfPost[],
    tags?:TagOfPost[],
    title:string,
    imageUrl?:string,
    excerpt?:string
}

export interface Post extends MetaOfPost {
    content:string;
}

export interface ParsedPost extends MetaOfPost {
    dom:Document;
}