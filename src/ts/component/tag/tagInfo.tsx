import * as React from 'react';
import {Tag} from '../../model/terms';
import * as icons from '../category/icons';
import * as terms from './terms';

interface PropsOfInformationOfTag {
    tag:Tag;
    numberOfPostsMarkedByThisTag?:number;
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

        let countElement = null;
        if (this.props.numberOfPostsMarkedByThisTag) {
            countElement = <div className="count"><icons.Count />
                               {terms.countOfArticlesMarkedByThisTag(
                                   this.props.tag.name, this.props.numberOfPostsMarkedByThisTag)}
                           </div>;
        }

        return (
            <div style={this.props.style}>{descElement}{countElement}</div>
        );
    }
}