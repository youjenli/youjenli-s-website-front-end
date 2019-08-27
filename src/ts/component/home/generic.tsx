import * as React from 'react';
import {router} from '../../service/router';
import {MetaDataOfPost} from '../../model/posts';
import { calculateViewPortWidth, calculateViewPortHeight } from '../../service/dimensionsCalculator';
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
import {DisposableWidget} from './error-and-warning/disposable-widget';

interface PropsOfHome {
    posts:MetaDataOfPost[];
    errorMsg:string[];
    onWidgetOfErrorMsgDismissed?:() => void;
}

interface StateOfHomePage {
    viewportWidth:number;
    viewportHeight:number;
}

export default class GenericHomePage extends React.Component<PropsOfHome, StateOfHomePage> {
    constructor(props){
        super(props);
        this.calculateViewPortDimensions = this.calculateViewPortDimensions.bind(this);
        this.state = {
            viewportWidth:calculateViewPortWidth(),
            viewportHeight:calculateViewPortHeight(),
        }
    }
    componentDidMount() {
        window.addEventListener('resize', this.calculateViewPortDimensions);
        window.addEventListener('orientationchange', this.calculateViewPortDimensions);
        router.updatePageLinks();
    }
    componentDidUpdate() {
        router.updatePageLinks();
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
                        <HomeOf16To10LargeExternalScreen viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex - 20}
                            posts={this.props.posts} errorMsg={this.props.errorMsg} 
                            onWidgetOfErrorMsgDismissed={this.props.onWidgetOfErrorMsgDismissed} />
                    </React.Fragment>
                );
            } else {
                return (
                    <React.Fragment>
                        <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                            aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                            baseZIndex={headerBaseZIndex} />
                        <HomeOf16To9LargeExternalScreen viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex - 20}
                            posts={this.props.posts} errorMsg={this.props.errorMsg} 
                            onWidgetOfErrorMsgDismissed={this.props.onWidgetOfErrorMsgDismissed} />
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
                            posts={this.props.posts} errorMsg={this.props.errorMsg} 
                            onWidgetOfErrorMsgDismissed={this.props.onWidgetOfErrorMsgDismissed} />
                    </React.Fragment>
                );
            } else if (aspectRatio > 0.6) {//套用 16:10 外接螢幕的佈局規則
                return (
                    <React.Fragment>
                        <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                            aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                            baseZIndex={headerBaseZIndex} />
                        <HomeOf16To10ExternalScreen viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex - 20}
                            posts={this.props.posts} errorMsg={this.props.errorMsg} 
                            onWidgetOfErrorMsgDismissed={this.props.onWidgetOfErrorMsgDismissed} />
                    </React.Fragment>
                );
            } else {//套用 16:9 外接螢幕的佈局規則
                return (
                    <React.Fragment>
                        <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                            aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                            baseZIndex={headerBaseZIndex} />
                        <HomeOf16To9ExternalScreen viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex - 20}
                            posts={this.props.posts} errorMsg={this.props.errorMsg} 
                            onWidgetOfErrorMsgDismissed={this.props.onWidgetOfErrorMsgDismissed} />
                    </React.Fragment>
                );
            }
        } else if (this.state.viewportWidth > 640) {//使用平板的佈局
            let disposableWidget = null;
            if (this.props.errorMsg.length > 0) {
                const styleOfWidget = {
                    fontSize:'16px',
                    padding:`1px 18px`
                }
                disposableWidget = 
                    <DisposableWidget style={styleOfWidget} msg={this.props.errorMsg} shouldFlashAfterMount={true}
                        onDismissed={this.props.onWidgetOfErrorMsgDismissed} />;
            }
            
            return (
                <React.Fragment>
                    <MobileDeviceTitleBar className="tb" viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex}/>
                    {disposableWidget}
                    <SloganOnTablet viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex - 10}/>
                    <ListOfRecentPostsOnTablet viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex - 20} 
                        remFontSize={18} posts={this.props.posts}/>
                </React.Fragment>
            );
        } else {//使用手機版面的佈局
            if (this.state.viewportWidth > 432) {
                let disposableWidget = null;
                if (this.props.errorMsg.length > 0) {
                    const styleOfWidget = {
                        fontSize:`${(this.state.viewportWidth + 504) / 52}px`,
                        padding:`1px 1em`,
                        zIndex:headerBaseZIndex - 5
                    }
                    disposableWidget = 
                        <DisposableWidget style={styleOfWidget} msg={this.props.errorMsg} 
                            onDismissed={this.props.onWidgetOfErrorMsgDismissed}/>;
                }
                return (
                    <React.Fragment>
                        <MobileDeviceTitleBar className="sp" viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex}/>
                        <HomeOf16To9SmartPhone viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex - 10}/>
                        <ListOfRecentPostsOn16To9SmartPhone viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex - 20} 
                            remFontSize={18} posts={this.props.posts}/>
                        {disposableWidget}
                    </React.Fragment>
                );
            } else {
                let disposableWidget = null;
                if (this.props.errorMsg) {
                    const styleOfWidget = {
                        fontSize:`${(this.state.viewportWidth + 576) / 112}px`,
                        padding:`1px 0.5em`,
                        zIndex:headerBaseZIndex - 5
                    }
                    disposableWidget = 
                        <DisposableWidget style={styleOfWidget} msg={this.props.errorMsg} 
                            onDismissed={this.props.onWidgetOfErrorMsgDismissed} />;
                }
                return (
                    <React.Fragment>
                        <MobileDeviceTitleBar className="sp" viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex}/>
                        <HomeOf9To16SmartPhone viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex - 10}/>
                        <ListOfRecentPostsOn9To16SmartPhone viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex - 20} 
                            remFontSize={16} posts={this.props.posts}/>
                        {disposableWidget}
                    </React.Fragment>
                );
            }
        }
    };
}