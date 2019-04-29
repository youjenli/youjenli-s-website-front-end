import * as React from 'react';
import { calculateViewPortWidth, calculateViewPortHeight } from '../../service/dimensionsCalculator';
import ExternalScreenTitleBar from '../title/external-screen-title-bar';
import MobileDeviceTitleBar from '../title/mobile-device-title-bar';
import { DataOfSearchResults } from '../../model/search-results';
import LargeExternalScreenPageOfSearchResults from './large-external-screen';

interface PropsOfSearchResults {
    result:DataOfSearchResults
}

interface StateOfPageOfSearchResults {
    viewportWidth:number;
    viewportHeight:number;    
}

export default class PageOfSearchResults extends React.Component<PropsOfSearchResults, StateOfPageOfSearchResults> {
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
        const baseZIndex = 100;
        const vw = this.state.viewportWidth
        if (vw > 1440) { //採用大外接螢幕佈局模式
            return (
                <React.Fragment>
                    <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                        aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                        baseZIndex={baseZIndex + 20} />
                    <LargeExternalScreenPageOfSearchResults viewportWidth={this.state.viewportWidth}
                        baseZIndex={baseZIndex} remFontSize={18} results={this.props.result} />
                </React.Fragment>
            );
        } else if (vw > 1060) { //採用外接螢幕佈局模式
            return (
                <React.Fragment>
                    <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                        aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                        baseZIndex={baseZIndex + 20} />
                </React.Fragment>
            );
        } else if (vw > 630) { //採用平板佈局模式
            return (
                <React.Fragment>
                    <MobileDeviceTitleBar  className="tb" viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex + 20} />
                </React.Fragment>
            );
        } else {//手機佈局模式
            return (
                <React.Fragment>
                    <MobileDeviceTitleBar  className="sp" viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex + 20} />
                </React.Fragment>
            );
        }
    }
}