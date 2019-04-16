import * as React from 'react';
import { calculateViewPortWidth, calculateViewPortHeight } from '../service/dimensionsCalculator';

interface StateOfLayoutStrategyAdopter {
    viewportWidth:number;
    viewportHeight:number;
}

export default class LayoutStrategyAdopter extends React.Component<{}, StateOfLayoutStrategyAdopter> {
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
}