import * as React from 'react';
import { MetaDataOfPost } from '../../model/posts';
import { TemplateOfFoundPost } from './found-post';

interface PropsOfPostsAmongParticularTaxonomy {
    pageContent:MetaDataOfPost[];
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

export class PostsAmongParticularTaxonomy extends React.Component<PropsOfPostsAmongParticularTaxonomy> {
    render() {
        let settingsOfDate = {
            fontSize:this.props.post.fontSizeOfDate,
            marginRight:this.props.post.gapBetweenDateAndTitle
        }
        
        let settingsOfPostInfo = {
            marginRightOfIcon:this.props.post.gapBetweenIconAndCategories
        }
        const posts = [];
        this.props.pageContent.forEach((post, idx) => {
            posts.push(
                <TemplateOfFoundPost key={idx} post={post} width={this.props.width} 
                    paddingLeftRight={this.props.post.paddingLeftRight} date={settingsOfDate} 
                    title={{fontSize:this.props.post.fontSizeOfTitle}} postInfo={settingsOfPostInfo } />
            );
        });

        const leftOverItemsAtTheLastRow = this.props.pageContent.length % this.props.numberOfPostInARow;
        if (leftOverItemsAtTheLastRow > 0) {
            const numberOfItemsInBlockOfResults = this.props.pageContent.length 
                    + this.props.numberOfPostInARow - leftOverItemsAtTheLastRow;
            const styleOfPlaceHoldingItem = {
                width:`${this.props.width}px`
            }
            for (let j = this.props.pageContent.length ; j < numberOfItemsInBlockOfResults ; j ++ ) {
                posts[j] = 
                    <div key={j} style={styleOfPlaceHoldingItem}>&nbsp;</div>
            }           
        }
        return <div className="results">{posts}</div>;
    }
}

