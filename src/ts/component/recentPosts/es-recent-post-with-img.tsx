import * as React from 'react';
import * as terms from './terms';
import {CategoryOfPost} from '../../model/post';
import {formatMonthOrDayTo2Digits} from '../../service/date-formatter';

interface ExternalScreenRecentPostWithImgProps {
    width:number;
    minHeight:number;
    marginTop:number;
    marginLeftRight:number;
    padding:number;
    imgUrl:string;
    postProps:{
        fontSize:number,
        marginTop:number
    }
    date:Date;
    categories:CategoryOfPost[];
    title:{
        name:string,
        marginTopMarginBottom:number;
        fontSize:number;
    }
}

export default class ExternalScreenRecentPostWithImg extends React.Component<ExternalScreenRecentPostWithImgProps> {
    render() {
        const month = formatMonthOrDayTo2Digits(this.props.date.getMonth());
        const day = formatMonthOrDayTo2Digits(this.props.date.getDate());

        let categories = null;
        if (this.props.categories.length > 0) {
            categories = this.props.categories.map((category, idx, array) => {
                return (
                <span key={idx}>
                    <a className="category">{category.name}</a>
                    { idx != array.length - 1 ? '﹒' : null }
                </span>)
            });
        } else {
            categories = (<span className="noData" key={0}>{terms.postWasNotCategorized}</span>);
        }

        let styleOfPost = {
            width:`${this.props.width}px`,
            minHeight:`${this.props.minHeight}px`,
            margin:`${this.props.marginTop}px ${this.props.marginLeftRight}px 0 ${this.props.marginLeftRight}px`,
            padding:`${this.props.padding}px`
        } 

        const widthOfImg = this.props.width - 2 * this.props.padding;
        let styleOfImg = {
            width:`${widthOfImg}px`,
            height:`${widthOfImg * 3/5}px`
        }
        const styleOfPostProps = {
            marginTop:`${this.props.postProps.marginTop}px`,
            fontSize:`${this.props.postProps.fontSize}px`
        };
        const styleOfTitle = {
            fontSize:`${this.props.title.fontSize}px`
        }
        return (
            <article className="rPost img" style={styleOfPost} title={this.props.title.name}>
                <img style={styleOfImg} src={this.props.imgUrl} />
                <div style={styleOfPostProps} className="postProps">
                    <span className="date">{this.props.date.getFullYear()}/{month}/{day}﹒</span>
                    <span className="categories">{categories}</span>
                </div>
                <div style={styleOfTitle} className="title">{this.props.title.name}</div>
            </article>
        );
    }
}
