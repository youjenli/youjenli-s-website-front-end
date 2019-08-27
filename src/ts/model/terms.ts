export interface Term {
    id:number,
    name:string,
    slug?:string,
    url:string,
    description?:string,
}

/* category taxonomy 的資料介面
*/
export interface Category extends Term {
    parent?:Category;
    children?:Category[];
}

/*tag taxonomy 的資料介面
*/
export interface Tag extends Term {};