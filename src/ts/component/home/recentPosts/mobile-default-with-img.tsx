import * as React from 'react';
import * as terms from './terms';
import {Category} from '../../../model/terms';
import {formatMonthOrDayTo2Digits} from '../../../service/formatters';
import {isNotBlank} from '../../../service/validator';

interface PropsOfMobileRecentPostWithImg {
    width:number;
    margin:{
        top:number;
        leftRight:number;
        bottom:number;
    }
    padding:{
        top:number;
        leftRight:number;
        bottom:number;
    }
    title:{
        name:string,
        margin:{
            top:number;
            bottom:number;
        }
        fontSize:number;
    }
    postProps:{
        fontSize:number,
        marginBottom:number
    }
    date:Date;
    categories:Category[];
    imgUrl:string;
    urlOfPost:string;
}

export default class MobileRecentPostWithImg extends React.Component<PropsOfMobileRecentPostWithImg> {
    render() {
        let titleText = null, classesOfTitle = 'title';
        if (isNotBlank(this.props.title.name)) {
            titleText = this.props.title.name;
        } else {
            titleText = terms.titleFieldIsBlank;
            classesOfTitle += ' blank';
        }

        const month = formatMonthOrDayTo2Digits(this.props.date.getMonth());
        const day = formatMonthOrDayTo2Digits(this.props.date.getDate());

        let styleOfPost = {
            width:`${this.props.width}px`,
            margin:`${this.props.margin.top}px ${this.props.margin.leftRight}px ${this.props.margin.bottom}px ${this.props.margin.leftRight}px`,
            padding:`${this.props.padding.top}px ${this.props.padding.leftRight}px ${this.props.padding.bottom}px ${this.props.padding.leftRight}px`
        }

        const styleOfTitle = {
            fontSize:`${this.props.title.fontSize}px`,
            paddingTop:`${this.props.title.margin.top}px`,
            paddingBottom:`${this.props.title.margin.bottom}px`,
            alignItems:'flex-start',
            flexGrow:0.5
        }
        const styleOfPostProps = {
            fontSize:`${this.props.postProps.fontSize}px`,
            paddingBottom:`${this.props.postProps.marginBottom}px`,
            flexGrow:1
        };

        let categories = null;
        let dataOfCategories = this.props.categories;
        if (dataOfCategories === null) {
            categories = <span className="dataNotFound">{terms.cannotFoundTaxonomies}</span>;
        } else if (dataOfCategories.length > 0) {
            categories = dataOfCategories.map((category, idx, array) => {
                return (
                <span key={idx}>
                    <a className="category" href={category.url} data-navigo>{category.name}</a>
                    { idx < array.length - 1 ? '．' : null }
                </span>)
            });
        } else {
            categories = (<span className="noData" key={0}>{terms.postWasNotCategorized}</span>);
        }
        
        const widthOfImg = this.props.width - 2 * this.props.padding.leftRight;
        let styleOfImg = {
            width:`${widthOfImg}px`,
            height:`${widthOfImg * 3/5}px`
        }

        return (
            <article className="rPost img" style={styleOfPost} title={this.props.title.name}>
                <a href={this.props.urlOfPost} style={styleOfTitle} className={classesOfTitle} data-navigo>{titleText}</a>
                <div style={styleOfPostProps} className="postProps">
                    <span className="date">{this.props.date.getFullYear()}/{month}/{day}．</span>
                    <span className="categories">{categories}</span>
                </div>
                <a href={this.props.urlOfPost} data-navigo><img style={styleOfImg} src={this.props.imgUrl} /></a>
            </article>
        );
    }
}
