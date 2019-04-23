import * as React from 'react';

interface PropsOfMobileHeaderOfArticle {
    baseZIndex:number;
    className:string;
    paddingBottom?:number;
    title:{
        name:string;
        fontSize:number;
        maxWidth:number;
    }
    decorationLine?:{
        height:number;
    }
}

export default class MobileHeaderOfArticle extends React.Component<PropsOfMobileHeaderOfArticle> {
    render() {
        /* title bg 的用途是讓 img 可以輕鬆的定位在整欄資訊的最下面，在此同時又有一部分曝露在標頭的外面 */
        const styleOfTitleBg = {
            fontSize:`${this.props.title.fontSize}px`,
            zIndex:this.props.baseZIndex + 2
        }

        if (this.props.paddingBottom) {
            styleOfTitleBg['paddingBottom'] = `${this.props.paddingBottom}px`;
        }

        let decoration = null;
        if (this.props.decorationLine) {
            const styleOfDec = {
                height:`${this.props.decorationLine.height}px`,
                zIndex:this.props.baseZIndex + 1
            }

            decoration = <div id="post-dec" style={styleOfDec}></div>;
        }

        return (
            <div id="post-header" className={this.props.className}>
                <div className="titleBg" style={styleOfTitleBg}>
                    <div className="title">{this.props.title.name}</div>
                    {this.props.children}
                </div>
                {decoration}
            </div>
        );        
    }
}

