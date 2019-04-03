import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ExternalScreenTitleBar from '../component/title/external-screen-title-bar';
import MobileDeviceTitleBar from '../component/title/mobile-device-title-bar';

interface HomePageState {
    viewportWidth:number;
    viewportHeight:number;
}

//todo 要記得處理畫面旋轉的情境，還有顯示畫面縮放的狀況

export default class HomePage extends React.Component<{}, HomePageState> {
    constructor(props){
        super(props);
        this.calculateViewPortHeight = this.calculateViewPortHeight.bind(this);
        this.calculateViewPortWidth = this.calculateViewPortWidth.bind(this);
        this.calculateViewPortDimensions = this.calculateViewPortDimensions.bind(this);
        this.state = {
            viewportWidth:this.calculateViewPortWidth(),
            viewportHeight:this.calculateViewPortHeight()
        }
    }
    componentDidMount() {
        window.addEventListener('resize', this.calculateViewPortDimensions);
        window.addEventListener('orientationchange', this.calculateViewPortDimensions);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.calculateViewPortDimensions);
        window.removeEventListener('orientationchange', this.calculateViewPortDimensions);
    }
    calculateViewPortWidth():number {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    calculateViewPortHeight():number {
        return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }
    calculateViewPortDimensions() {
        this.setState({
            viewportWidth:this.calculateViewPortWidth(),
            viewportHeight:this.calculateViewPortHeight()
        });
    }
    render () {
        if (this.state.viewportWidth > 1024) {//使用外接螢幕的佈局
            return (
                <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                    aspectRatio={this.state.viewportHeight / this.state.viewportWidth} />
            ); 
        } else {//使用行動裝置的佈局
            return (
                <MobileDeviceTitleBar viewportWidth={this.state.viewportWidth} />
            );  
        }                  
    };
}