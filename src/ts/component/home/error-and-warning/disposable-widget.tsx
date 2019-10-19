import * as React from 'react';
import { ExclamationMarkIcon } from '../../template/icons';

interface PropsOfDisposableWidget {
    msg:string[];
    shouldFlashAfterMount?:boolean
    onClick?:() => void;
    style?:React.CSSProperties;
    onDismissed?:() => void;
}

interface StateOfDisposableWidget {
    widgetOfErrorShouldExists:boolean;
}

export class DisposableWidget extends React.Component<PropsOfDisposableWidget, StateOfDisposableWidget> {
    constructor(props) {
        super(props);
        this.state = {
            widgetOfErrorShouldExists:true
        };
        this.onWidgetClicked = this.onWidgetClicked.bind(this);
        this.ref = React.createRef();
    }
    ref
    countDown
    onWidgetClicked() {
        /*呼叫 ref 之後要加上 current 才能找到目前的元素，否則瀏覽器將回覆沒有 classList 屬性的訊息
            詳見: https://reactjs.org/docs/refs-and-the-dom.html
        */
        this.ref.current.classList.add('fadeOut');
        window.setTimeout(() => {
            this.setState({
                widgetOfErrorShouldExists:false
            });
            if (this.props.onDismissed) {
                this.props.onDismissed();
            }
        }, 200);
    }
    componentDidMount() {
        if (this.props.shouldFlashAfterMount) {
            window.setTimeout(() => {
                this.ref.current.classList.add('flash');
            }, 500);            
        }
        //倒數計時結束後，移除錯誤訊息欄位。
        this.countDown = window.setTimeout(() => {
            this.onWidgetClicked();
        }, 10000);
    }
    componentWillUnmount() {
        window.clearTimeout(this.countDown);
    }
    render() {
        if (this.state.widgetOfErrorShouldExists) {
            const callback = (this.props.onClick ? this.props.onClick : this.onWidgetClicked);
            const msgList = this.props.msg.map((msg, idx) => {
                return <div className="msg" key={idx}>{msg}</div>;
            });
            return (
                <div id="http-error" style={this.props.style} onClick={callback} ref={this.ref}>
                    <ExclamationMarkIcon /><span className="msgList">{msgList}</span></div>
            );
        } else {
            return null;
        }        
    }   
}