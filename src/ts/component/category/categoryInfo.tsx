import * as React from 'react';
import {CategoryOfPost} from '../../model/post';
import * as icons from './icons';
import * as terms from './terms';

interface PropsOfInformationOfCategory {
    category:CategoryOfPost;
    numberOfPostsSubjectToThisCategory:number;
    style?:React.CSSProperties;
}

export class InformationOfCategory extends React.Component<PropsOfInformationOfCategory> {
    render() {
        let desc = null;
        if (this.props.category.description) {
            desc = terms.descriptionOfCategory(this.props.category.name, this.props.category.description);
        } else {
            desc = <span className="noData">{terms.categoryDoesNotHaveDescription}</span>;
        }
        const descElement = <div className="desc"><icons.Information />{desc}</div>;

        let parent = null;
        if (this.props.category.parent) {
            parent = terms.parentOfCategoryOrTag(this.props.category.parent.name);
        } else {
            parent = <span className="noData">{terms.categoryDoesNotHaveParent}</span>;
        }
        let parentElement = <div className="parent"><icons.ParentCategory />{parent}</div>

        let countElement = 
            <div className="count"><icons.Count />
                {terms.countOfArticlesSubjectToCategory(
                    this.props.category.name,this.props.numberOfPostsSubjectToThisCategory)}
            </div>;

        return (
            <div style={this.props.style}>{descElement}{parentElement}{countElement}</div>
        );
    }
}