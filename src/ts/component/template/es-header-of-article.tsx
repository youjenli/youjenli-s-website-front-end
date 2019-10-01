import * as React from 'react';
import { isNotBlank } from '../../service/validator';
import * as terms from './terms';

interface PropsOfDefaultHeaderOfArticle {
    baseZIndex:number;
    className:string;
    titleBg:{
        paddingBottom?:number;
    }
    title:{
        name:string;
        fontSize?:number;
        maxWidth:number;
    }
    appendDecorationLine:boolean;
}

export default class DefaultHeaderOfArticle extends React.Component<PropsOfDefaultHeaderOfArticle> {
    render() {
        const styleOfPostHeader = {
            zIndex:this.props.baseZIndex + 1
        }

        if(this.props.title.fontSize) {
            styleOfPostHeader['fontSize'] = `${this.props.title.fontSize}px`;
        }
        const styleOfTitleBg = {
            paddingBottom:`${this.props.titleBg.paddingBottom}px`,
            zIndex:this.props.baseZIndex + 3
        }

        let classesOfTitle = "title", titleText = null;
        if (isNotBlank(this.props.title.name)) {
            titleText = this.props.title.name;
        } else {
            titleText = terms.noTitle;
            classesOfTitle += ' noTitle';
        }

        const styleOfPostInfo = {
            width:`${this.props.title.maxWidth}px`
        }

        let decoration = null;
        if (this.props.appendDecorationLine) {
            const styleOfDec = {
                zIndex:this.props.baseZIndex + 2
            }

            decoration = <div id="post-dec" style={styleOfDec}></div>;
        }
        
        return (
            <div id="post-header" className={this.props.className} style={styleOfPostHeader}>
                <div id="titleBg" style={styleOfTitleBg}>
                    <div className="postInfo" style={styleOfPostInfo}>
                        <div className={classesOfTitle}>{titleText}</div>
                        {this.props.children}
                    </div>
                </div>
                {decoration}
            </div>
        );
    }    
}