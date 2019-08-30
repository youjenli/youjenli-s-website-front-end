import * as React from 'react';
import { FoundPage, FoundPost, FoundPublication } from '../../../model/search-results';
import { TemplateOfFoundPage } from '../../template/found-page';
import { TemplateOfFoundPost } from '../../template/found-post';
import { TypeOfContent } from '../../../model/general-types';

interface PropsOfPublicationsAmongSearchResult {
    pageContent:FoundPublication[];
    width?:number;
    numberOfPostInARow:number;
    post:{
        paddingLeftRight?:number;
        fontSizeOfDate:number;
        gapBetweenDateAndTitle?:number;
        fontSizeOfTitle:number;
        gapBetweenIconAndCategories?:number;
    }
}

export class PublicationsAmongSearchResult extends React.Component<PropsOfPublicationsAmongSearchResult> {
    render() {       
        
        let settingsOfDate = {
            fontSize:this.props.post.fontSizeOfDate,
            marginRight:this.props.post.gapBetweenDateAndTitle
        }
        
        let settingsOfPostInfo = {
            marginRightOfIcon:this.props.post.gapBetweenIconAndCategories
        }
        const publications = [];
        this.props.pageContent.forEach((pub, idx) => {
            if (pub.type == TypeOfContent.Post) {
                publications.push(
                    <TemplateOfFoundPost key={idx} post={pub as FoundPost} width={this.props.width} 
                        paddingLeftRight={this.props.post.paddingLeftRight} date={settingsOfDate} 
                        title={{fontSize:this.props.post.fontSizeOfTitle}} postInfo={settingsOfPostInfo } />
                );
            } else if (pub.type == TypeOfContent.Page) {
                publications.push(
                    <TemplateOfFoundPage key={idx} page={pub as FoundPage} width={this.props.width} 
                        paddingLeftRight={this.props.post.paddingLeftRight} date={settingsOfDate} 
                        title={{fontSize:this.props.post.fontSizeOfTitle}} postInfo={settingsOfPostInfo }/>
                );
            }
        });

        const leftOverItemsAtTheLastRow = this.props.pageContent.length % this.props.numberOfPostInARow;
        if (leftOverItemsAtTheLastRow > 0) {
            const numberOfItemsInBlockOfResults = this.props.pageContent.length 
                    + this.props.numberOfPostInARow - leftOverItemsAtTheLastRow;
            const styleOfPlaceHoldingItem = {
                width:`${this.props.width}px`
            }
            for (let j = this.props.pageContent.length ; j < numberOfItemsInBlockOfResults ; j ++ ) {
                publications[j] = 
                    <div key={j} style={styleOfPlaceHoldingItem}>&nbsp;</div>
            }           
        }
        return <div className="results">{publications}</div>;
    }
}

