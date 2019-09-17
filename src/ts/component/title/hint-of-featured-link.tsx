import * as React from 'react';

interface HintOfFeaturedLinkProps {
    hint:string;
    fontSizeOfHint:number;
    fontSizeOfFeaturedLink:number;
    charactersInFeaturedLink:number;
}

export default class HintOfFeaturedLink extends React.Component<HintOfFeaturedLinkProps> {
    render() {
        /* 
        1. 事先計算提示欄位的寬度和高度
        2. 推算箭號的左位置和上位置
        */
        const maxCharactersPerRow = 20;
        const paddingUnit = 1;//提示框內沿的距離，單位是提示訊息的字體大小。
        const borderWidth = 1;
        let widthOfHintBody;
        if (this.props.hint.length > maxCharactersPerRow) {
            widthOfHintBody = (maxCharactersPerRow + 2 * paddingUnit) * this.props.fontSizeOfHint + 2 * borderWidth;
        } else {
            widthOfHintBody = (this.props.hint.length + 2 * paddingUnit) * this.props.fontSizeOfHint + 2 * borderWidth;
        }
        const widthOfArrow = 40;
        const heightOfArrow = 15;
        const leftShiftOfArrow = (widthOfHintBody - 40) / 2
        const paddingTopOfPositioningBox = this.props.fontSizeOfFeaturedLink * 0.33;
        const topShiftOfShading = borderWidth + paddingTopOfPositioningBox;
        const leftShiftOfPositioningBox = (-widthOfHintBody 
                + this.props.fontSizeOfFeaturedLink / 2 /* 除 2 的原因是這邊的字元為英文字元 */ * this.props.charactersInFeaturedLink ) / 2;
        let styleOfPoint = {
            width:`${widthOfArrow}px`,
            height:`${heightOfArrow}px`,
            left:`${leftShiftOfArrow}px`,
        }
        let styleOfShading = {
            width:`${widthOfArrow}px`,
            height:`${heightOfArrow}px`,
            left:`${leftShiftOfArrow}px`,
            top:`${topShiftOfShading}px`
        }

        const styleOfPositioningBox = {
            paddingTop:`${paddingTopOfPositioningBox}px`,
            left:`${leftShiftOfPositioningBox}px`
        }

        const styleOfHintBody = {
            borderWidth:`${borderWidth}px`,
            width:`${widthOfHintBody}px`,
            padding:`${paddingUnit}em`,
            fontSize:this.props.fontSizeOfHint
        };
        return (
            <div className="positioningBox" style={styleOfPositioningBox}>
                <svg style={styleOfPoint} className="point arrow" version="1.1">
                    <g strokeWidth={borderWidth}>
                      <g transform="translate(-149.000000, 0.000000)">
                            <polygon id="Triangle" points="168.5 0.75 188 15.75 149 15.75"></polygon>
                      </g>
                    </g>
                </svg>
                <svg style={styleOfShading} className="shading arrow" version="1.1">
                    <g>   
                      <g transform="translate(-149.000000, 0.000000)">
                            <polygon id="Triangle" points="168.5 0.75 188 15.75 149 15.75"></polygon>
                      </g>
                    </g>
                </svg>
                <div style={styleOfHintBody} className="featureHint">
                    {this.props.hint}
                </div>
            </div>
        );
    }
}