import * as React from 'react';
import * as terms from './terms';
import {CategoryOfPost} from '../../../model/post';
import {formatMonthOrDayTo2Digits} from '../../../service/date-formatter';

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
    categories:CategoryOfPost[];
    imgUrl:string;
}

export default class MobileRecentPostWithImg extends React.Component<PropsOfMobileRecentPostWithImg> {
    render() {
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
        
        const widthOfImg = this.props.width - 2 * this.props.padding.leftRight;
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
