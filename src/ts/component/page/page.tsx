import * as React from 'react';
import { calculateViewPortWidth, calculateViewPortHeight } from '../../service/dimensionsCalculator';
import ExternalScreenTitleBar from '../title/external-screen-title-bar';
import MobileDeviceTitleBar from '../title/mobile-device-title-bar';
import LargeExternalScreenPage from './large-external-screen';
import ExternalScreenPage from './external-screen';
import { Page as PageModel } from '../../model/page';

interface PropsOfPage {
    page:PageModel
}

interface StateOfPage {
    viewportWidth:number;
    viewportHeight:number;    
}

export default class Page extends React.Component<PropsOfPage, StateOfPage> {
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
    render() {
        const baseZIndex = 100;
        const vw = this.state.viewportWidth
        if (vw > 1440) {
            return (
                <React.Fragment>
                    <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                        aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                        baseZIndex={baseZIndex + 20} />
                    <LargeExternalScreenPage viewportWidth={this.state.viewportWidth}
                        baseZIndex={baseZIndex} remFontSize={18} page={this.props.page} />
                </React.Fragment>
            );
        } else if (vw > 1060) {
            return (
                <React.Fragment>
                    <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                        aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                        baseZIndex={baseZIndex + 20} />
                    <ExternalScreenPage viewportWidth={this.state.viewportWidth} 
                        baseZIndex={baseZIndex} remFontSize={18} page={this.props.page} />
                </React.Fragment>
            );
        } else {//套用行動裝置的佈局規則
            if (vw > 432) {
                return (
                    <React.Fragment>
                        <MobileDeviceTitleBar  className="tb" viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex + 20} />
                    </React.Fragment>
                );
            } else {
                return (
                    <React.Fragment>
                        <MobileDeviceTitleBar className="sp" viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex + 20} />
                    </React.Fragment>
                );
            }            
        }
    }
}