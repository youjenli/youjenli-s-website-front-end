import * as React from 'react';
import * as termsOfArticle from '../post/terms';
import DisquzMessageBoard from './disquz';
import { isObject } from '../../service/validator';

interface PropsOfPostBackgroundOnExternalScreen {
    baseZIndex:number;
    className:string;
    width:number;
    padding:{
        top:number;
        leftRight:number;
    }
    marginBottom:number;
    toc?:{
        width:number;
        title:{
            fontSize:number;
            marginTopBottom:number;
        }
        item:{
            fontSize:number;
        }
        paddingLeftRight:number;
        content:string;
    }
    content:{
        margin:{
            top?:number;
            bottom:number;
        }
        post:string;
    },
    comment?:{
        id:string;
        title?:string;
        url?:string;
        categoryId?:string;
    };
}

export default class PostBackgroundOnExternalScreen extends React.Component<PropsOfPostBackgroundOnExternalScreen> {
    render() {
        const pp = this.props.padding;
        let styleOfPostBG;
        if (this.props.padding.top != 0) {
            styleOfPostBG = {
                width:`${this.props.width}px`,
                paddingTop:`${this.props.padding.top}px`,
                paddingLeft:`${pp.leftRight}px`,
                paddingRight:`${pp.leftRight}px`,
                paddingBottom:`1px`,
                marginBottom:`${this.props.marginBottom}px`,
                zIndex:this.props.baseZIndex + 1
            };  
        } else {
            styleOfPostBG = {
                width:`${this.props.width}px`,
                padding:`1px ${pp.leftRight}px`,
                /* 上下加入 1px 的 padding 以便讓裡面元素的 margin-top, margin-bottom 不會頂到 post bg 外面 */
                marginBottom:`${this.props.marginBottom}px`,
                zIndex:this.props.baseZIndex + 1
            };
        }

        let tocElement = null;
        if (this.props.toc) {
            const styleOfToc = {
                width:`${this.props.toc.width}px`,
                padding:`0 ${this.props.toc.paddingLeftRight}px`,
                /* 外接螢幕版的目錄必須套用高的 zIndex，否則要是它右邊有清單這種不是靜態定位的元素，
                   那麼使用者將無法點擊與清單同列的目錄項目。
                */
                zIndex:this.props.baseZIndex + 100
            }
            const styleOfTocTitle = {
                fontSize:`${this.props.toc.title.fontSize}px`,
                margin:`${this.props.toc.title.marginTopBottom}px 0`
            };
            const styleOfContent = {
                fontSize:`${this.props.toc.item.fontSize}px`
            };
            tocElement = 
                <div id="toc" style={styleOfToc}>
                    <div className="title" style={styleOfTocTitle}>{termsOfArticle.titleOfToc}</div>
                    <div className="sap"></div>
                    <ol className="content" style={styleOfContent} dangerouslySetInnerHTML={{__html:this.props.toc.content}}></ol>
                </div>;
        }
        const styleOfPostContent = {
            marginBottom:`${this.props.content.margin.bottom}px`
        }
        if(this.props.content.margin.top) {
            styleOfPostContent['marginTop'] = `${this.props.content.margin.top}px`;
        }

        return (
            <div id="postBg" className={this.props.className} style={styleOfPostBG}>
                {this.props.children}
                <div className="content post" style={styleOfPostContent}>
                    {tocElement}
                    <div className="article" dangerouslySetInnerHTML={{__html:this.props.content.post}}></div>
                </div>
                { isObject(this.props.comment) ? 
                    <DisquzMessageBoard id={this.props.comment.id} title={this.props.comment.title} 
                        url={this.props.comment.url} categoryId={this.props.comment.categoryId} 
                        backgroundColorOfDocument={"rgb(255,253,249)"} /> : null }
            </div>
        );
    }    
}