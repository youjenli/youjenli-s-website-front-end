import * as React from 'react';
import {ResultsOfSearch} from '../../../model/search-results';
import {CategoryOfPost} from '../../../model/post';
import * as terms from '../terms';
import {KhakiDecorationOfCategory, GreenDecorationOfCategory} from './decorations';

interface PropsOfCategoryOnPageOfSearchResults {
    category:CategoryOfPost;
    width:number;
    bgColor:string;
    fontSizeOfName?:number;
    fontSizeOfDesc?:number;
}

export class CategoryOnPageOfSearchResults extends React.Component<PropsOfCategoryOnPageOfSearchResults> {
    render() {
        let description = this.props.category.description;
        if (!description) {
            description = terms.categoryDoesNotHaveDesc;
        }

        const styleOfContent = {
            backgroundColor:this.props.bgColor
        }

        let styleOfCategory = null;
        if (this.props.fontSizeOfName) {
            styleOfCategory = {
                fontSize:`${this.props.fontSizeOfName}px`,
                width:`${this.props.width}px`
            };
        }
        let styleOfDesc = null;
        if (this.props.fontSizeOfDesc) {
            styleOfDesc = {
                fontSize:`${this.props.fontSizeOfDesc}px`
            }
        }

        return (
            <div className="category" style={styleOfCategory}>
                <div className="content" style={styleOfContent}>
                    <div className="name"><a>{this.props.category.name}</a></div>
                    <div className="desc" style={styleOfDesc}>{description}</div>
                </div>                
                {this.props.children}
            </div>
        );
    }
}

interface PropsOfSearchResultsOfCategory {
    results:ResultsOfSearch<CategoryOfPost>;
    width:number;
    numberOfCategoriesInARow:number;
    fontSizeOfCategoryName?:number;
    fontSizeOfDesc?:number;
}

export class SearchResultsOfCategory extends React.Component<PropsOfSearchResultsOfCategory> {
    render() {
        const categories = [];
        const styleOfDecoration = {
            width:`${this.props.width + 2}px`
            /* 寬度要加上 2px 的原因是這樣才能跟文字區域吻合在一起。 */
        }
        const pageContent = this.props.results.pageContent;
        for (let i = 0 ; i < pageContent.length ; i ++) {
            if (i % this.props.numberOfCategoriesInARow % 2 == 0) {
                categories[i] = 
                    <CategoryOnPageOfSearchResults bgColor={'#FEECB8'} width={this.props.width} category={pageContent[i]} key={i}
                        fontSizeOfName={this.props.fontSizeOfCategoryName} fontSizeOfDesc={this.props.fontSizeOfDesc}>
                        <KhakiDecorationOfCategory style={styleOfDecoration}/>
                    </CategoryOnPageOfSearchResults>;
            } else {
                categories[i] =
                    <CategoryOnPageOfSearchResults bgColor={'#DBFFB4'} width={this.props.width}  category={pageContent[i]} key={i}
                        fontSizeOfName={this.props.fontSizeOfCategoryName} fontSizeOfDesc={this.props.fontSizeOfDesc}>
                        <GreenDecorationOfCategory style={styleOfDecoration}/>
                    </CategoryOnPageOfSearchResults>;
            }
        }
        const leftOverItemsAtTheLastRow = pageContent.length % this.props.numberOfCategoriesInARow;
        if (leftOverItemsAtTheLastRow > 0) {
            const numberOfItemsInBlockOfResults = pageContent.length 
                + this.props.numberOfCategoriesInARow - leftOverItemsAtTheLastRow;
            const styleOfPlaceHoldingItem = {
                width:`${this.props.width}px`
            }
            for (let j = pageContent.length ; j < numberOfItemsInBlockOfResults ; j ++ ) {
                categories[j] = 
                    <div key={j} style={styleOfPlaceHoldingItem}>&nbsp;</div>
            }
        }
        
        return <div className="results">{categories}</div>;
    }
}