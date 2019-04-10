import * as React from 'react';
import {CategoryOfPost} from '../../model/post';
import {formatMonthOrDayTo2Digits} from '../../service/date-formatter';

interface ExternalScreenRecentPostWithImgProps {
    width:number;
    minHeight:number;
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

        let styleOfPost = {
            width:`${this.props.width}px`,
            minHeight:`${this.props.minHeight}px`,
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
            fontSize:`${this.props.title.fontSize}px`,
            margin:`${this.props.title.marginTopMarginBottom}px 0`
        }
        return (
            <article className="rPost img" style={styleOfPost} title={this.props.title.name}>
                <a><img style={styleOfImg} src={this.props.imgUrl} /></a>
                <h4 style={styleOfPostProps}>
                    <span className="date">{this.props.date.getFullYear()}/{month}/{day}﹒</span>
                    <span className="categories">
                        {this.props.categories.map((category, idx, array) => {
                            return (<span>
                                <a className="category">{category.name}</a>
                                { idx != array.length - 1 ? 
                                    '﹒' : null }
                            </span>)
                        })}
                    </span>
                </h4>
                <h3 style={styleOfTitle} className="title">{this.props.title.name}</h3>
            </article>
        );
    }
}
