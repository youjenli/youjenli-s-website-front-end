import * as React from 'react';
import * as terms from './terms';
import {CategoryOfPost} from '../../../model/post';
import {formatMonthOrDayTo2Digits} from '../../../service/date-formatter';

interface PropsOfTabletRecentPostWithImg {
    width:number;
    minHeight:number;
    margin:{
        top:number;
        leftRight:number;
    }
    padding:number;
    imgUrl:string;
    postProps:{
        fontSize:number,
        marginBottom:number
    }
    date:Date;
    categories:CategoryOfPost[];
    title:{
        name:string,
        margin:{
            top:number;
            bottom:number;
        }
        fontSize:number;
    }
}

export default class TabletRecentPostWithImg extends React.Component<PropsOfTabletRecentPostWithImg> {
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
            margin:`${this.props.margin.top}px ${this.props.margin.leftRight}px 0 ${this.props.margin.leftRight}px`,
            padding:`${this.props.padding}px`
        }
        const styleOfTitle = {
            fontSize:`${this.props.title.fontSize}px`,
            marginTop:`${this.props.title.margin.top}px`,
            marginBottom:`${this.props.title.margin.bottom}px`
        }
        const styleOfPostProps = {
            marginBottom:`${this.props.postProps.marginBottom}px`,
            fontSize:`${this.props.postProps.fontSize}px`
        };
        const widthOfImg = this.props.width - 2 * this.props.padding;
        let styleOfImg = {
            width:`${widthOfImg}px`,
            height:`${widthOfImg * 3/5}px`
        }
                
        return (
            <article className="rPost img" style={styleOfPost} title={this.props.title.name}>
                <div style={styleOfTitle} className="title">{this.props.title.name}</div>
                <div style={styleOfPostProps} className="postProps">
                    <span className="date">{this.props.date.getFullYear()}/{month}/{day}﹒</span>
                    <span className="categories">{categories}</span>
                </div>                
                <img style={styleOfImg} src={this.props.imgUrl} />
            </article>
        );
    }
}
