import * as React from 'react';

interface HintOfFeatureLinkProps {
    hint:string;
    fontSizeOfHint:number;
    fontSizeOfFeatureLink:number;
    charactersOfFeatureLink:number;
}

export default class HintOfFeatureLink extends React.Component<HintOfFeatureLinkProps> {
    render() {
        /* 
        1. 事先計算提示欄位的寬度和高度
        2. 推算箭號的左位置和上位置
        */
        const charactersInARow = 20;
        const rowsInHint = Math.ceil(this.props.hint.length / charactersInARow);
        const paddingUnit = 1;//提示框內沿的距離，單位是提示訊息的字體大小。
        const borderWidth = 1;
        const heightOfHintBody = (rowsInHint + 2 * paddingUnit) * this.props.fontSizeOfHint + 2 * borderWidth;
        let widthOfHintBody;
        if (this.props.hint.length > charactersInARow) {
            widthOfHintBody = (charactersInARow + 2 * paddingUnit) * this.props.fontSizeOfHint + 2 * borderWidth;
        } else {
            widthOfHintBody = (this.props.hint.length + 2 * paddingUnit) * this.props.fontSizeOfHint + 2 * borderWidth;
        }
        const widthOfArrow = 40;
        const heightOfArrow = 15;
        const leftShiftOfArrow = (widthOfHintBody - 40) / 2
        const bottomShiftOfPoint = heightOfHintBody - borderWidth;
        const bottomShiftOfShading = heightOfHintBody - 2 * borderWidth;
        const bottomShiftOfHintBody = - 1 * (this.props.fontSizeOfFeatureLink * 0.33 + heightOfArrow 
            - borderWidth + heightOfHintBody);
        const leftShiftOfHintBody = 
            (this.props.fontSizeOfFeatureLink * this.props.charactersOfFeatureLink - widthOfHintBody) / 2;
        let styleOfPoint = {
            width:`${widthOfArrow}px`,
            height:`${heightOfArrow}px`,
            left:`${leftShiftOfArrow}px`,
            bottom:`${bottomShiftOfPoint}px`
        }
        let styleOfShading = {
            width:`${widthOfArrow}px`,
            height:`${heightOfArrow}px`,
            left:`${leftShiftOfArrow}px`,
            bottom:`${bottomShiftOfShading}px`
        }
    
        const styleOfHintBody = {
            borderWidth:`${borderWidth}px`,
            width:`${widthOfHintBody}px`,
            height:`${heightOfHintBody}px`,
            padding:`${paddingUnit}em`,
            bottom:`${bottomShiftOfHintBody}px`,
            left:`${leftShiftOfHintBody}px`,
            fontSize:this.props.fontSizeOfHint
        };
        return (
            <div style={styleOfHintBody} className="featureHint">
                <svg id="point" style={styleOfPoint} className="arrow" version="1.1">
                <g strokeWidth={borderWidth}>   
                      <g transform="translate(-149.000000, 0.000000)">
                                <polygon id="Triangle" points="168.5 0.75 188 15.75 149 15.75"></polygon>
                      </g>
                    </g>
                </svg>  
                {this.props.hint}
                <svg id="shading" style={styleOfShading} className="arrow" version="1.1">
                  <g>   
                    <g transform="translate(-149.000000, 0.000000)">
                              <polygon id="Triangle" points="168.5 0.75 188 15.75 149 15.75"></polygon>
                    </g>
                  </g>
                </svg>                
            </div>
        );
    }
}