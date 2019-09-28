import * as React from 'react';
import { Pagination } from '../../model/pagination';
import { calculateViewPortWidth, calculateViewPortHeight } from '../../service/dimensionsCalculator';
import ExternalScreenTitleBar from '../title/external-screen-title-bar';
import MobileDeviceTitleBar from '../title/mobile-device-title-bar';
import { MetaDataOfPost } from '../../model/posts';
import { Category } from '../../model/terms';
import PageOfCategoryOnLargeExternalScreen from './large-external-screen';
import PageOfCategoryOnExternalScreen from './external-screen';
import PageOfCategoryOnTabletScreen from './tablet';
import PageOfCategoryOnSmartPhone from './smart-phone';

interface PropsOfGenericCategory {
    category:Category;
    numberOfResults:number;
    pageContent:MetaDataOfPost[];
    pagination:Pagination;
}

interface StateOfGenericCategory {
    viewportWidth:number;
    viewportHeight:number;
}

export default class GenericCategory extends React.Component<PropsOfGenericCategory, StateOfGenericCategory> {
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
                <div id="category" className="bg">
                    <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                        aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                        baseZIndex={baseZIndex + 20} />
                    <PageOfCategoryOnLargeExternalScreen viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex}
                        remFontSize={18} category={this.props.category} numberOfResults={this.props.numberOfResults}
                        pageContent={this.props.pageContent} pagination={this.props.pagination} />
                </div>
            );
        } else if (vw > 1060) { //採用外接螢幕佈局模式
            return (
                <div id="category" className="bg">
                    <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                        aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                        baseZIndex={baseZIndex + 20} />
                    <PageOfCategoryOnExternalScreen viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex}
                        remFontSize={18} category={this.props.category} numberOfResults={this.props.numberOfResults}
                        pageContent={this.props.pageContent} pagination={this.props.pagination} />
                </div>
            );
        } else if (vw > 630) { //採用平板佈局模式
            return (
                <div id="category" className="bg">
                    <MobileDeviceTitleBar className="tb" viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex + 20} />
                    <PageOfCategoryOnTabletScreen viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex}
                        remFontSize={18} category={this.props.category} numberOfResults={this.props.numberOfResults}
                        pageContent={this.props.pageContent} pagination={this.props.pagination} />
                </div>
            );
        } else if (vw > 432) {//採用手機水平佈局模式
            return (
                <div id="category" className="bg">
                    <MobileDeviceTitleBar className="sp" viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex + 20} />
                    <PageOfCategoryOnSmartPhone viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex} 
                        remFontSize={18} category={this.props.category} numberOfResults={this.props.numberOfResults}
                        pageContent={this.props.pageContent} pagination={this.props.pagination} />
                </div>
            );
        } else {//採用手機垂直佈局模式
            return (
                <div id="category" className="bg">
                    <MobileDeviceTitleBar  className="sp" viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex + 20} />
                    <PageOfCategoryOnSmartPhone viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex} 
                        remFontSize={16}  category={this.props.category} numberOfResults={this.props.numberOfResults}
                        pageContent={this.props.pageContent} pagination={this.props.pagination} />
                </div>
            );
        }
    }
}