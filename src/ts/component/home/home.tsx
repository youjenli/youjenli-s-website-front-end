import * as React from 'react';
import ExternalScreenTitleBar from '../title/external-screen-title-bar';
import MobileDeviceTitleBar from '../title/mobile-device-title-bar';
import HomeOfLarge16To9ExternalScreen from './large-external-16-9th-screen-home';
import HomeOfLarge16To10ExternalScreen from './large-external-16-10th-screen-home';
import { calculateViewPortWidth, calculateViewPortHeight } from '../../service/dimensionsCalculator';

import { posts } from '../../model/test/fake-posts-for-test';

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
        const headerBaseZIndex = 100;
        const aspectRatio = this.state.viewportHeight / this.state.viewportWidth;
        if (this.state.viewportWidth > 1440) {//使用大外接螢幕的佈局
            if (aspectRatio > 0.6) {//適用 16:10 的螢幕
                return (
                    <React.Fragment>
                        <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                            aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                            baseZIndex={headerBaseZIndex} />
                        <HomeOfLarge16To10ExternalScreen viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex - 20}
                            posts={posts} />
                    </React.Fragment>
                );
            } else {
                return (
                    <React.Fragment>
                        <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                            aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                            baseZIndex={headerBaseZIndex} />
                        <HomeOfLarge16To9ExternalScreen viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex - 20}
                            posts={posts} />
                    </React.Fragment>
                );
            }            
        } else if (this.state.viewportWidth > 1024) {//使用外接螢幕的佈局
            return (
                <React.Fragment>
                    <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                        aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                        baseZIndex={headerBaseZIndex} />
                    <HomeOfLarge16To10ExternalScreen viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex - 20}
                        posts={posts} />
                </React.Fragment>
            );
        } else {//使用行動裝置的佈局
            return (
                <React.Fragment>
                    <MobileDeviceTitleBar viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex}/>
                </React.Fragment>
            );
        }
    };
}