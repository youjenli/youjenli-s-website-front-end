import * as React from 'react';
import LayoutStrategyAdopter from '../layout-strategy-adopter';
import ExternalScreenTitleBar from '../title/external-screen-title-bar';
import MobileDeviceTitleBar from '../title/mobile-device-title-bar';
import LargeExternalScreenPostPage from './large-external-screen';

import {fakePost} from '../../model/test/fake-single-post';

export default class PostPage extends LayoutStrategyAdopter {
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
                        baseZIndex={headerBaseZIndex - 10} remFontSize={18} post={fakePost}/>
                </React.Fragment>
            );
        } else if (vw > 1024) {
            return (
                <React.Fragment>
                    <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                        aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                        baseZIndex={headerBaseZIndex} />
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