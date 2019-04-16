import * as React from 'react';
import LayoutStrategyAdopter from '../layout-strategy-adopter';
import ExternalScreenTitleBar from '../title/external-screen-title-bar';
import MobileDeviceTitleBar from '../title/mobile-device-title-bar';
import HomeOf16To9LargeExternalScreen from './16To9-large-external-screen';
import HomeOf16To10LargeExternalScreen from './16To10-large-external-screen';
import HomeOf4To3ExternalScreen from './4To3-external-screen';
import HomeOf16To10ExternalScreen from './16To10-external-screen';
import HomeOf16To9ExternalScreen from './16To9-external-screen';
import SloganOnTablet from './slogan/tablet-slogan';
import HomeOf16To9SmartPhone from './16To9-smart-phone';
import HomeOf9To16SmartPhone from './9To16-smart-phone';
import ListOfRecentPostsOnTablet from './listOfPosts/tablet';
import ListOfRecentPostsOn16To9SmartPhone from './listOfPosts/16To9-smart-phone';
import ListOfRecentPostsOn9To16SmartPhone from './listOfPosts/9To16-smart-phone';

import { posts } from '../../model/test/fake-posts-for-test';

export default class HomePage extends LayoutStrategyAdopter {
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
                        <HomeOf16To10LargeExternalScreen viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex - 20}
                            posts={posts} />
                    </React.Fragment>
                );
            } else {
                return (
                    <React.Fragment>
                        <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                            aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                            baseZIndex={headerBaseZIndex} />
                        <HomeOf16To9LargeExternalScreen viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex - 20}
                            posts={posts} />
                    </React.Fragment>
                );
            }
        } else if (this.state.viewportWidth > 1024) {//使用外接螢幕的佈局
            if (aspectRatio > 0.7) {//套用 4:3 外接螢幕的佈局規則
                return (
                    <React.Fragment>
                        <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                            aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                            baseZIndex={headerBaseZIndex} />
                        <HomeOf4To3ExternalScreen viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex - 20}
                            posts={posts} />
                    </React.Fragment>
                );
            } else if (aspectRatio > 0.6) {//套用 16:10 外接螢幕的佈局規則
                return (
                    <React.Fragment>
                        <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                            aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                            baseZIndex={headerBaseZIndex} />
                        
                        <HomeOf16To10ExternalScreen viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex - 20}
                            posts={posts} />
                    </React.Fragment>
                );
            } else {//套用 16:9 外接螢幕的佈局規則
                return (
                    <React.Fragment>
                        <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                            aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                            baseZIndex={headerBaseZIndex} />
                        <HomeOf16To9ExternalScreen viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex - 20}
                            posts={posts} />
                    </React.Fragment>
                );
            }
        } else if (this.state.viewportWidth > 640) {//使用平板的佈局
            return (
                <React.Fragment>
                    <MobileDeviceTitleBar viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex}/>
                    <SloganOnTablet viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex - 10}/>
                    <ListOfRecentPostsOnTablet viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex - 20} 
                        remFontSize={18} posts={posts}/>
                </React.Fragment>
            );
        } else {//使用手機版面的佈局
            if (this.state.viewportWidth > 432) {
                return (
                    <React.Fragment>
                        <MobileDeviceTitleBar viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex}/>
                        <HomeOf16To9SmartPhone viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex - 10}/>
                        <ListOfRecentPostsOn16To9SmartPhone viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex - 20} 
                            remFontSize={18} posts={posts}/>
                    </React.Fragment>
                );
            } else {
                return (
                    <React.Fragment>
                        <MobileDeviceTitleBar viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex}/>
                        <HomeOf9To16SmartPhone viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex - 10}/>
                        <ListOfRecentPostsOn9To16SmartPhone viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex - 20} 
                            remFontSize={16} posts={posts}/>
                    </React.Fragment>
                );
            }
        }
    };
}