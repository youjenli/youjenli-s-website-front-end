import * as React from 'react';
import * as terms from './terms';

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
        /*
            註 20190520 發現這套檢驗方法只在 zoom level 是 100% 的情況下有用。
            因此必須在這裡透過 transform scale(1) 規定大小，這樣才不會因為瀏覽器 zoom level 不是 100% 而判斷失準。
            //todo 結果還是有問題
        */
        test.style.transform = 'scale(1)';
        test.innerHTML = testStr;
        document.getElementsByTagName('body')[0].appendChild(test);
        /*
            因為對測試用的元素套用 transform scale 之後與原尺寸相比還是有小數點誤差，
            所以這邊兩項數值在比較前都要先以 Math.round 處理過。
        */
        if (Math.round(test.offsetWidth) > Math.round(testStr.length * this.props.fontSize)) {
            //表示支援我要用的字體，因此不要以 png 圖片替代標題
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
        let basicStyle = {
            top:this.props.top + "px",
            left:this.props.left + "px"
        }
        if (this.state.showSiteNameWithPNG) {
            basicStyle["height"] = `${this.props.fontSize * 1.15}px`;//1.15 是 html 文字預設的行高。
            return (
                <a id="site-name" className="backToHome" href="/" title={terms.backToHome} data-navigo>
                    <img src={this.props.base64EncodedTitle} style={basicStyle} alt={this.props.name}/></a>
            );
        } else {
            basicStyle["fontFamily"] = "'HanziPen SC', 'HanziPenSC-W5', 'Arial'";
            basicStyle["fontSize"] = `${this.props.fontSize}px`;
            return (
                <span id="site-name" style={basicStyle}>
                    <a className="backToHome" href="/" title={terms.backToHome} data-navigo>{this.props.name}</a>
                </span>
            );
        }
    }
}