import * as React from 'react';
import PostPageOnExternalScreen from './template/external-screen';
import { Post } from '../../model/post';

interface PropsOfLargeExternalScreenPostPage {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    post:Post;
}

export default class LargeExternalScreenPostPage extends React.Component<PropsOfLargeExternalScreenPostPage> {
    render() {
        const post = this.props.post;
        const maxWidthOfTitle = (this.props.viewportWidth >= 1657 ? this.props.viewportWidth * 0.618 : 1024 );
        const heightOfImg = maxWidthOfTitle * 0.6;
        const fontSizeOfTitle = maxWidthOfTitle / 22.8;
        const paddingBTOfTitleBg = heightOfImg * 0.618;
        
        const titleBg = {
            paddingBottom:paddingBTOfTitleBg
        };

        const title = {
            name:post.title,
            maxWidth:maxWidthOfTitle,
            fontSize:fontSizeOfTitle
        };
        const postInfo = {
            categories:post.categories,
            tags:post.tags,
            date:post.date,
            modified:post.modified
        };
        const widthOfPostBg = 0.764 * this.props.viewportWidth;
        const postBg = {
            width:widthOfPostBg,
            padding:{
                top:(this.props.post.imageUrl ? 0.382 * heightOfImg : 0),
                leftRight:(widthOfPostBg - maxWidthOfTitle) / 2,
                bottom:this.props.remFontSize * 2
            },
            marginBottom:this.props.remFontSize * 2
        };
        const marginTopOfContent = this.props.remFontSize * 1.5;

        return (
            <PostPageOnExternalScreen titleBg={titleBg} title={title} postInfo={postInfo} baseZIndex={this.props.baseZIndex} 
                imgUrl={post.imageUrl} postBg={postBg} content={post.content} marginTopOfContent={marginTopOfContent}/>
        );
    }
}