import * as React from 'react';
import { calculateViewPortWidth, calculateViewPortHeight } from '../../service/dimensionsCalculator';
import ExternalScreenTitleBar from '../title/external-screen-title-bar';
import MobileDeviceTitleBar from '../title/mobile-device-title-bar';
import { MetaDataOfPost } from '../../model/posts';
import {Tag} from '../../model/terms';
import {Pagination} from '../../model/pagination';
import PageOfTagOnLargeExternalScreen from './large-external-screen';
import PageOfTagOnExternalScreen from './external-screen';
import PageOfTagOnTabletScreen from './tablet';
import PageOfTagOnSmartPhone from './smart-phone';

interface PropsOfGenericTag {
    tag:Tag;
    numberOfResults:number;
    pageContent:MetaDataOfPost[];
    pagination:Pagination;
}

interface StateOfGenericTag {
    viewportWidth:number;
    viewportHeight:number;
}

export default class GenericTag extends React.Component<PropsOfGenericTag, StateOfGenericTag> {
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
                <div id="tag" className="bg">
                    <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                        aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                        baseZIndex={baseZIndex + 20} />
                    <PageOfTagOnLargeExternalScreen viewportWidth={this.state.viewportWidth}
                        baseZIndex={baseZIndex} remFontSize={18} tag={this.props.tag} 
                        numberOfResults={this.props.numberOfResults} pageContent={this.props.pageContent} 
                        pagination={this.props.pagination} />
                </div>
            );
        } else if (vw > 1060) { //採用外接螢幕佈局模式
            return (
                <div id="tag" className="bg">
                    <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                        aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                        baseZIndex={baseZIndex + 20} />
                    <PageOfTagOnExternalScreen viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex} 
                        remFontSize={18} tag={this.props.tag} numberOfResults={this.props.numberOfResults}
                        pageContent={this.props.pageContent} pagination={this.props.pagination} />
                </div>
            );
        } else if (vw > 630) { //採用平板佈局模式
            return (
                <div id="tag" className="bg">
                    <MobileDeviceTitleBar  className="tb" viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex + 20} />
                    <PageOfTagOnTabletScreen viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex} 
                        remFontSize={18} tag={this.props.tag} numberOfResults={this.props.numberOfResults}
                        pageContent={this.props.pageContent} pagination={this.props.pagination} />
                </div>
            );
        } else if (vw > 432) {//採用手機水平佈局模式
            return (
                <div id="tag" className="bg">
                    <MobileDeviceTitleBar  className="sp" viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex + 20} />
                    <PageOfTagOnSmartPhone viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex} 
                        remFontSize={18} tag={this.props.tag} numberOfResults={this.props.numberOfResults}
                        pageContent={this.props.pageContent} pagination={this.props.pagination} />
                </div>
            );
        } else {//採用手機垂直佈局模式
            return (
                <div id="tag" className="bg">
                    <MobileDeviceTitleBar  className="sp" viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex + 20} />
                    <PageOfTagOnSmartPhone viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex} 
                        remFontSize={16} tag={this.props.tag} numberOfResults={this.props.numberOfResults}
                        pageContent={this.props.pageContent} pagination={this.props.pagination} />
                </div>
            );
        }
    }
}