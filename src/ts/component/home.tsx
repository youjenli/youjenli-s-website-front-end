import * as React from 'react';
import ExternalScreenTitleBar from '../component/title/external-screen-title-bar';
import MobileDeviceTitleBar from '../component/title/mobile-device-title-bar';
import ExternalScreenSlogan from '../component/slogan/external-screen-slogan';
import { calculateViewPortWidth, calculateViewPortHeight } from '../service/dimensionsCalculator';

interface HomePageState {
    viewportWidth:number;
    viewportHeight:number;
}

export default class HomePage extends React.Component<{}, HomePageState> {
    constructor(props){
        super(props);
        this.calculateViewPortDimensions = this.calculateViewPortDimensions.bind(this);
        this.state = {
            viewportWidth:calculateViewPortWidth(),
            viewportHeight:calculateViewPortHeight()
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
    calculateViewPortDimensions() {
        this.setState({
            viewportWidth:calculateViewPortWidth(),
            viewportHeight:calculateViewPortHeight()
        });
    }
    render () {
        if (this.state.viewportWidth > 1024) {//使用外接螢幕的佈局
            return (
                <React.Fragment>
                    <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                        aspectRatio={this.state.viewportHeight / this.state.viewportWidth} />
                    <ExternalScreenSlogan viewportWidth={this.state.viewportWidth} />
                </React.Fragment>           
            ); 
        } else {//使用行動裝置的佈局
            return (
                <React.Fragment>
                    <MobileDeviceTitleBar viewportWidth={this.state.viewportWidth} />
                </React.Fragment>
            );  
        }                  
    };
}