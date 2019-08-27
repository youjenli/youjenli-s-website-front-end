import * as React from 'react';
import { Pagination, createUrlForPage } from '../../../model/pagination';

interface PropsOfLinksOfPagination {
    pagination:Pagination;
}

export class LinksOfPagination extends React.Component<PropsOfLinksOfPagination> {
    render () {
        const totalPages = this.props.pagination.totalPages;
        const currentPage = this.props.pagination.currentPage;
        let endSize = this.props.pagination.endSize;
        let midSize = this.props.pagination.midSize;

        let pages = [];
        const createLink = (page:number) => {
            if (page == currentPage) {
                pages.push(
                    <span className="current" key={page} >{page}</span>);
            } else {
                const url = 
                    createUrlForPage(this.props.pagination.baseUrl, page);
                pages.push(
                    <a key={page} href={url} data-navigo>{page}</a>);
            }
        }

        const renderLinks = () => {
            let endOfLeadingLinks = endSize;
            if (currentPage - midSize <= endSize + 1) {
               /*
                   前段連結會與中段連結接壤，因此處置做法是呈現第一頁到中段結束的連結
               */
               endOfLeadingLinks = currentPage + midSize;
               if (totalPages - endSize <= endOfLeadingLinks + 1 ) {
                   /*
                     這表示中段與末段連結接壤，要直接產生連結到最後一頁。
                   */
                   for (let i = 1 ; i <= totalPages ; i ++) {
                      createLink(i);
                   }
                   return pages;
               } else {
                  /*
                     中段與末段沒接壤，先產生前段連結和中段與末段的分隔符號
                  */
                  for (let j = 1 ; j <= endOfLeadingLinks ; j ++) {
                     createLink(j);
                  }
                  //然後產生前段和中段的分隔符號
                  pages.push(<span key={endOfLeadingLinks + 1}>…</span>);
                  /*
                    最後是末段連結
                  */
                  for (let p = totalPages - endSize ; p <= totalPages ; p ++) {
                     createLink(p);
                  }
               }
            } else {
                /*
                   前段與中段連結沒接壤，先產生前段連結
                */
                for (let q = 1 ; q <= endSize ; q ++ ) {
                    createLink(q);
                }
                //然後再加入前段和中段的分隔符號
                pages.push(<span key={endSize + 1}>…</span>);

                if ( totalPages - endSize <= currentPage + midSize + 1 ) {
                    /*
                        中段連結與末段相連，直接從中段產生連結到結束
                    */
                    for (let m = currentPage - midSize ; m <= totalPages ; m ++) {
                        createLink(m);
                    }
                    return pages;
                } else {
                    /*
                        當中段連結與末段相連沒接壤，那就產生中段連結
                    */
                    for (let n = currentPage - midSize ; n <= currentPage + midSize ; n ++) {
                        createLink(n);
                    }
                    //接著加入中段和末段的分隔符號
                    pages.push(<span key={currentPage + midSize + 1}>…</span>);

                    /*
                        產生末段連結
                    */
                    for ( let s = totalPages - endSize ; s <= totalPages ; s ++) {
                        createLink(s);
                    }
                }
            }
        }

        const links = renderLinks();
        return (<React.Fragment>{links}</React.Fragment>);
    }
}