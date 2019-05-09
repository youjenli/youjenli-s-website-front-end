import * as React from 'react';
import { ParsedPage } from '../../model/page';
import MobileHeaderOfArticle from '../template/mobile-header-of-article';
import {LinkOfParent} from './terms';
import {PublishInfo} from '../template/post-info';
import {CategoryIcon} from '../template/icons';
import * as Countable from 'countable';

interface PropsOfSmartPhonePage {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    page:ParsedPage;
}

export default class SmartPhonePage extends React.Component<PropsOfSmartPhonePage> {
    render() {
        const page = this.props.page, vw = this.props.viewportWidth;
        const maxWidthOfTitle = vw - 2 * this.props.remFontSize;
        const fontSizeOfTitle = (vw + 1024) / 56;
        const title = {
            name:this.props.page.title,
            fontSize:fontSizeOfTitle,
            maxWidth:maxWidthOfTitle
        };
        const fontSizeOfPageInfo = (vw + 464) / 56;
        const styleOfPageInfo = {
            fontSize:`${fontSizeOfPageInfo}px`
        }

        let parentElement = null;
        if (page.parent) {
            parentElement = 
            <div className="parent">
                <CategoryIcon />
                <LinkOfParent name={page.parent.title} url={page.parent.url} />
            </div>;            
        }

        let countingResult:Countable.CountingResult = null;
        Countable.count(this.props.page.dom.body.innerHTML, counter => {
            countingResult = counter;
        });

        const publishInfo = 
                <PublishInfo date={page.date} modified={page.modified} wordCount={countingResult.characters} />;

        const styleOfPostBg = {
            paddingTop:this.props.remFontSize * 1.5
        }

        if (this.props.page.imageUrl) {
            const heightOfImg = maxWidthOfTitle * 0.6;
            const styleOfImg = {
                height:`${heightOfImg}px`
            }
 
            return (
                <React.Fragment>
                    <MobileHeaderOfArticle baseZIndex={this.props.baseZIndex} title={title} className="sp">
                        <img src={page.imageUrl} style={styleOfImg}/>
                        <div className="pageInfo" style={styleOfPageInfo}>
                            {parentElement}
                            {publishInfo}
                        </div>
                    </MobileHeaderOfArticle>
                    <div id="postBg" className="sp" style={styleOfPostBg} dangerouslySetInnerHTML={{__html:this.props.page.dom.body.innerHTML}}>
                    </div>
                </React.Fragment>
            );
        } else {
            const decoration = {
                height:fontSizeOfTitle / 3
            }

            return (
                <React.Fragment>
                    <MobileHeaderOfArticle baseZIndex={this.props.baseZIndex} className="sp"
                        title={title} decorationLine={decoration}>
                        <div className="pageInfo" style={styleOfPageInfo}>
                            {parentElement}
                            {publishInfo}
                        </div>                        
                    </MobileHeaderOfArticle> 
                    <div id="postBg" className="sp" style={styleOfPostBg} dangerouslySetInnerHTML={{__html:this.props.page.dom.body.innerHTML}}>
                    </div>
                </React.Fragment>
            );
        }
    }
}