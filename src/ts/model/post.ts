export interface CategoryOfPost {
    name:string,
    url:string
}

export type TagOfPost = CategoryOfPost;

export interface Post {
    urlOfPost:string,
    date:Date,
    categories:CategoryOfPost[],
    tags?:TagOfPost[],
    title:string,
    imageUrl?:string,
    excerpt?:string
}