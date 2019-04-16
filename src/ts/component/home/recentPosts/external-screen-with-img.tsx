import * as React from 'react';
import * as terms from './terms';
import {CategoryOfPost} from '../../../model/post';
import {formatMonthOrDayTo2Digits} from '../../../service/date-formatter';

interface ExternalScreenRecentPostWithImgProps {
    width:number;
    margin:{
        top:number;
        leftRight:number;
        bottom:number;
    }
    padding:{
        top:number;
        leftRight:number;
    }
    imgUrl:string;
    postProps:{
        fontSize:number,
        marginTop:number
    }
    date:Date;
    categories:CategoryOfPost[];
    title:{
        margin:{
            top:number;
            bottom:number;
        }
        name:string,
        fontSize:number;
    }
}

export default class ExternalScreenRecentPostWithImg extends React.Component<ExternalScreenRecentPostWithImgProps> {
    render() {
        const month = formatMonthOrDayTo2Digits(this.props.date.getMonth());
        const day = formatMonthOrDayTo2Digits(this.props.date.getDate());

        let categories = null;
        if (this.props.categories && this.props.categories.length > 0) {
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
            margin:`${this.props.margin.top}px ${this.props.margin.leftRight}px ${this.props.margin.bottom} ${this.props.margin.leftRight}px`,
            padding:`${this.props.padding.top}px ${this.props.padding.leftRight}px 0 ${this.props.padding.leftRight}px`
        } 

        const widthOfImg = this.props.width - 2 * this.props.padding.leftRight;
        let styleOfImg = {
            width:`${widthOfImg}px`,
            height:`${widthOfImg * 3/5}px`
        }
        const styleOfPostProps = {
            marginTop:`${this.props.postProps.marginTop}px`,
            fontSize:`${this.props.postProps.fontSize}px`,
            flexGrow:0.75
        };
        const styleOfTitle = {
            marginTop:`${this.props.title.margin.top}px`,
            marginBottom:`${this.props.title.margin.bottom}px`,
            fontSize:`${this.props.title.fontSize}px`,
            flexGrow:1            
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
