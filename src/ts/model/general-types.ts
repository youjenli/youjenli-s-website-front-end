import { AxiosResponse } from 'axios';

export const enum TypeOfContent {
    Post = 'post',
    Page = 'page',
    Attachment = 'attachment'
}

//這是各項負責抓取資料的 ajax 程式回傳給業務程式的預設資料格式
export interface ResultOfFetching<T> {
    modelObjs:T[];
    response:AxiosResponse;
    isComplete:boolean;
}