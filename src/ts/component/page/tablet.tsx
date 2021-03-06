import * as React from 'react';
import MobilePostHeader from '../template/mobile-header-of-article';
import { ParsedPage } from '../../model/posts';
import {LinkOfParent} from '../template/terms';
import {PublishInfo} from '../template/post-info';
import {CategoryIcon} from '../template/icons';

interface PropsOfTabletPage {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    page:ParsedPage;
}

export default class TabletPage extends React.Component<PropsOfTabletPage> {
    render() {
        const page = this.props.page, vw = this.props.viewportWidth;
        const maxWidthOfTitle = vw - 2 * this.props.remFontSize;
        const fontSizeOfTitle = (5 * vw + 1688) / 148;
        const title = {
            name:this.props.page.title,
            fontSize:fontSizeOfTitle,
            maxWidth:maxWidthOfTitle
        };
        const fontSizeOfPageInfo = (vw + 1088)/96;
        const styleOfPageInfo = {
            fontSize:`${fontSizeOfPageInfo}px`
        }

        let parentElement = null;
        if (page.parent) {
            parentElement = 
                <div className="parentPage">
                    <CategoryIcon />
                    <LinkOfParent name={this.props.page.parent.title} url={this.props.page.parent.url}/>
                </div>;
        }
        
        const publishInfo = <PublishInfo date={page.date} modified={page.modified} estimatedReadingTimes={page.estimatedReadingTimes}/>

        if (this.props.page.thumbnail) {
            const heightOfImg = maxWidthOfTitle * 0.6;
            const styleOfImg = {
                height:`${heightOfImg}px`
            }

            const paddingBottomOfTitleBg = heightOfImg * 0.618;
            const styleOfPostBg = {
                paddingTop:heightOfImg * 0.382 + this.props.remFontSize * 1.5
            }
            
            return (
                <React.Fragment>
                    <MobilePostHeader baseZIndex={this.props.baseZIndex} className="tb" title={title} paddingBottom={paddingBottomOfTitleBg} >
                        <div className="postInfo" style={styleOfPageInfo}>
                            {parentElement}
                            {publishInfo}
                            <img src={page.thumbnail.url} style={styleOfImg} />
                        </div>
                    </MobilePostHeader>
                    <div id="postBg" style={styleOfPostBg} className="tb page" 
                        dangerouslySetInnerHTML={{__html:this.props.page.dom.body.innerHTML}}>
                    </div>
                </React.Fragment>
            );
        } else {
            const decorationLine = {
                height:fontSizeOfTitle / 3
            }
            const styleOfPostBg = {
                paddingTop:this.props.remFontSize * 1.5
            }
            
            return (
                <React.Fragment>
                    <MobilePostHeader className="tb" baseZIndex={this.props.baseZIndex} 
                        title={title} decorationLine={decorationLine} >
                        <div className="postInfo" style={styleOfPageInfo}>
                            {parentElement}
                            {publishInfo}
                        </div>
                    </MobilePostHeader> 
                    <div id="postBg" style={styleOfPostBg} className="tb page" dangerouslySetInnerHTML={{__html:this.props.page.dom.body.innerHTML}}>
                    </div>
                </React.Fragment>
            );
        }
    }
}