import * as React from 'react';
import * as termsOfArticle from '../terms';

interface PropsOfPostBackgroundOnExternalScreen {
    baseZIndex:number;
    className:string;
    width:number;
    padding:{
        top:number;
        leftRight:number;
        bottom:number;
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
            margin:{
                topBottom:number;
                left:number;
            }
        }
        paddingLeftRight:number;
        content:string;
    }
    contentOfPost:string;
}

export default class PostBackgroundOnExternalScreen extends React.Component<PropsOfPostBackgroundOnExternalScreen> {
    render() {
        const pp = this.props.padding;
        const styleOfPostBG = {
            width:`${this.props.width}px`,
            padding:`${pp.top}px ${pp.leftRight}px ${pp.bottom}px ${pp.leftRight}px`,
            marginBottom:`${this.props.marginBottom}px`,
            zIndex:this.props.baseZIndex + 1
        };   

        let tocElement = null, styleRulesAppliedToItems= null;
        if (this.props.toc) {
            const styleOfToc = {
                width:`${this.props.toc.width}px`,
                padding:`0 ${this.props.toc.paddingLeftRight}px`
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

            styleRulesAppliedToItems = <style>{`
            #toc .content ol {
                margin:0 0 0 ${this.props.toc.item.fontSize}px;
            }
            #toc .content li {
                margin:${this.props.toc.item.margin.topBottom}px 0;
            }
            #toc .content > li {
                margin-left:${this.props.toc.item.margin.left}px;
                margin-right:${this.props.toc.item.margin.left}px;
            }
            `}</style>;
        }   
        
        return (
            <div id="postBg" className={this.props.className} style={styleOfPostBG}>
                {this.props.children}
                {styleRulesAppliedToItems}
                {tocElement}
                <div className="content" dangerouslySetInnerHTML={{__html:this.props.contentOfPost}} ></div>
            </div>
        );
    }    
}