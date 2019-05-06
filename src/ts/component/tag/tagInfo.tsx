import * as React from 'react';
import {TagOfPost} from '../../model/post';
import * as icons from '../category/icons';
import * as terms from './terms';

interface PropsOfInformationOfTag {
    tag:TagOfPost;
    numberOfPostsMarkedByThisTag:number;
    style?:React.CSSProperties;
}

export class InformationOfTag extends React.Component<PropsOfInformationOfTag> {
    render() {
        let desc = null;
        if (this.props.tag.description) {
            desc = terms.descriptionOfTag(this.props.tag.name, this.props.tag.description);
        } else {
            desc = <span className="noData">{terms.tagDoesNotHaveDescription}</span>;
        }
        const descElement = <div className="desc"><icons.Information />{desc}</div>;

        let countElement = 
            <div className="count"><icons.Count />
                {terms.countOfArticlesMarkedByThisTag(
                    this.props.tag.name, this.props.numberOfPostsMarkedByThisTag)}
            </div>;

        return (
            <div style={this.props.style}>{descElement}{countElement}</div>
        );
    }
}