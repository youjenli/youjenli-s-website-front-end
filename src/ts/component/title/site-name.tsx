import * as React from 'react';

interface SiteNameProps {
    name:string,
    base64EncodedTitle:string,
    fontSize:number,
    top:number,
    left:number
}

interface SiteNameState {
    showSiteNameWithPNG:boolean;
}

export default class SiteName extends React.Component<SiteNameProps, SiteNameState> {
    constructor(props) {
        super(props);

        /*
            為了解瀏覽器是否支援我要使用的字體，
            把指定字串安置到螢幕上看不見之處再量測寬度，然後比對寬度是否和事先預設的數值相同。
            若相同則視為存在，否則標記 true、false 準備以 png 替換。
            詳情可參閱此模組的樣式表以了解測試元素的樣式。
        */
        const testStr = "卻說曹操欲斬劉岱、王忠。孔融諫曰：「二人本非劉備";
        const test = document.createElement('span');
        test.style.fontFamily = "'HanziPen SC', 'HanziPenSC-W5'";
        test.style.fontSize = `${this.props.fontSize}px`;
        test.innerHTML = testStr;
        document.getElementsByTagName('body')[0].appendChild(test);
        if (test.offsetWidth > testStr.length * this.props.fontSize) {
            //表示支援我要用的字體，不要以 png 替代標題
            this.state = {
                showSiteNameWithPNG:false
            }
        } else {
            this.state = {
                showSiteNameWithPNG:true
            }
        }
        //檢測完成後，移除測試用的元素。
        test.parentElement.removeChild(test);
    }
    render () {
        const title = "網站標題";
        let basicStyle = {
            top:this.props.top + "px",
            left:this.props.left + "px"
        }
        if (this.state.showSiteNameWithPNG) {
            basicStyle["height"] = `${this.props.fontSize * 1.15}px`;//1.15 是 html 文字預設的行高。
            return (
                <img id="site-name" src={this.props.base64EncodedTitle} style={basicStyle} 
                alt={this.props.name} title={title}/>
            );
        } else {
            basicStyle["fontFamily"] = "'HanziPen SC', 'HanziPenSC-W5', 'Arial'";
            basicStyle["fontSize"] = `${this.props.fontSize}px`;
            return (
                <span id="site-name" style={basicStyle} title={title}>{this.props.name}</span>
            );
        }
    }
}