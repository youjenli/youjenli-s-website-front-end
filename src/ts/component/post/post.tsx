import * as React from 'react';
import { calculateViewPortWidth, calculateViewPortHeight } from '../../service/dimensionsCalculator';
import ExternalScreenTitleBar from '../title/external-screen-title-bar';
import MobileDeviceTitleBar from '../title/mobile-device-title-bar';
import LargeExternalScreenPostPage from './large-external-screen';
import ExternaScreenPostPage from './external-screen';
import {Post} from '../../model/post';

interface PropsOfPostPage {
    post:Post;
}

interface StateOfPostPage {
    viewportWidth:number;
    viewportHeight:number;    
}

export default class PostPage extends React.Component<PropsOfPostPage, StateOfPostPage> {
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
        const headerBaseZIndex = 100;
        const vw = this.state.viewportWidth
        if (vw > 1440) {
            return (
                <React.Fragment>
                    <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                        aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                        baseZIndex={headerBaseZIndex} />
                    <LargeExternalScreenPostPage viewportWidth={this.state.viewportWidth}
                        baseZIndex={headerBaseZIndex - 10} remFontSize={18} post={this.props.post}/>
                </React.Fragment>
            );
        } else if (vw > 1060) {
            return (
                <React.Fragment>
                    <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                        aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                        baseZIndex={headerBaseZIndex} />
                    <ExternaScreenPostPage viewportWidth={this.state.viewportWidth}
                        baseZIndex={headerBaseZIndex - 10} remFontSize={18} post={this.props.post}/>
                </React.Fragment>
            );
        } else if (vw > 640) {
            return (
                <React.Fragment>
                    <MobileDeviceTitleBar viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex}/>
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <MobileDeviceTitleBar viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex}/>
                </React.Fragment>
            );
        }
    };
}