import * as React from 'react';
import {Category} from '../../model/terms';
import * as icons from './icons';
import * as terms from './terms';

interface PropsOfInformationOfCategory {
    category:Category;
    numberOfPostsSubjectToThisCategory?:number;
    style?:React.CSSProperties;
}

export class InformationOfCategory extends React.Component<PropsOfInformationOfCategory> {
    render() {
        let desc = null;
        if (this.props.category.description) {
            desc = <span>{this.props.category.description}</span>;
        } else {
            desc = <span className="noData">{terms.categoryDoesNotHaveDescription}</span>;
        }
        const descElement = <div className="desc"><icons.Information />{desc}</div>;

        let parent = null;
        if (this.props.category.parent) {
            parent = <terms.ParentCategory>
                        <a href={this.props.category.parent.url} data-navigo 
                            title={terms.learnMoreAboutThisCategoryAndRelatedPosts(this.props.category.name)}>
                            {this.props.category.parent.name}</a></terms.ParentCategory>;
        } else {
            parent = <span className="noData">{terms.categoryDoesNotHaveParent}</span>;
        }
        let parentElement = <div className="parentCat"><icons.ParentCategory />{parent}</div>

        let countElement = null;
        if (this.props.numberOfPostsSubjectToThisCategory) {
            countElement = 
            <div className="count"><icons.Count />
                {terms.countOfArticlesSubjectToCategory(this.props.numberOfPostsSubjectToThisCategory)}
            </div>;
        }

        return (
            <div style={this.props.style}>{descElement}{parentElement}{countElement}</div>
        );
    }
}