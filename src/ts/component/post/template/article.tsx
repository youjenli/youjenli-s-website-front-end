import * as React from 'react';
import * as terms from '../terms';
import * as Countable from 'countable';

interface PropsOfArticle {
    width:number;
    paddingLeftRight:number;
    toc:{
        title:{
            fontSize:number;
            marginTopBottom:number;
        }
        item:{
            fontSize:number;
            margin:{
                topBottom:number;
                leftRight:number;
            }
            descendent:{
                marginLeft:number;
            }
        }
    }
    marginTopOfContent:number;
    content:string;
    wordCountCallback?:(counter:Countable.CountingResult) => void;
}

export default class Article extends React.Component<PropsOfArticle> {
    counter
    componentDidMount() {
        this.props.wordCountCallback(this.counter);
    }
    render() {
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.props.content, 'text/html');
        const toc = doc.getElementById('toc');
        const subject = doc.getElementsByClassName('subject')[0];
        let styleOfArticle = {}, subjectElement = null;
        if(subject) {
            subject.parentElement.removeChild(subject);
            subjectElement = 
            <fieldset className="subject">
                <legend>{terms.titleOfSuject}</legend>
                <span dangerouslySetInnerHTML={{__html:subject.innerHTML}}></span>
            </fieldset>;
        } else {
            styleOfArticle['marginTop'] = this.props.marginTopOfContent;
        }

        let tocElement = null, styleOfToc = null;
        if (toc) {
            toc.parentElement.removeChild(toc);           
            tocElement = 
                <div id="toc">
                    <div className="title">{terms.titleOfToc}</div>
                    <div className="sap"></div>
                    <ol id="content" dangerouslySetInnerHTML={{__html:toc.innerHTML}}></ol>
                </div>;
            styleOfToc = <style>{`
            #toc {
                width:${this.props.width}px;
                padding:0 ${this.props.paddingLeftRight}px;
            }
            #toc .title {
                font-size:${this.props.toc.title.fontSize}px;
                margin:${this.props.toc.title.marginTopBottom}px 0;
            }
            #toc #content {
                font-size:${this.props.toc.item.fontSize}px;
            }
            #toc #content ol {
                margin:0 0 0 ${this.props.toc.item.descendent.marginLeft}px;
            }
            #toc #content li {
                margin:${this.props.toc.item.margin.topBottom}px 0;
            }
            #toc #content > li {
                margin-left:${this.props.toc.item.margin.leftRight}px;
                margin-right:${this.props.toc.item.margin.leftRight}px;
            }
            `}</style>;
        }
        Countable.count(doc.body.innerHTML, counter => {
            this.counter = counter;
        });
        
        return (
          <React.Fragment>
                {subjectElement}
                {styleOfToc}
                {tocElement}
                <div dangerouslySetInnerHTML={{__html:doc.body.innerHTML}}></div>
          </React.Fragment>  
        );
    }
}