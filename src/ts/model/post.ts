export interface CategoryOfPost {
    id:number,
    name:string,
    url:string,
    description?:string
}

export type TagOfPost = CategoryOfPost;

export interface Post {
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