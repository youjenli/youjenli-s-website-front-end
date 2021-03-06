import * as React from 'react';
import {isNotBlank, isNum} from '../../service/validator';

interface PropsOfCategoryIcon {
    width?:number;
    marginRight?:number;
    colorInHexCode?:string;
}

export class CategoryIcon extends React.Component<PropsOfCategoryIcon> {
    render() {

        let style = {};
        let width = "45px";
        if (isNum(this.props.width)) {
            width = `${this.props.width}px`;
        } else {
            style['height'] = "45px";
        }

        let marginRight = "1.5em";
        if (isNum(this.props.marginRight)) {
            marginRight =`${this.props.marginRight}px`;
        }
        style['width']  = width;
        style['marginRight'] = marginRight;

        let color = "#7FB14C";
        if (isNotBlank(this.props.colorInHexCode)) {
            color = this.props.colorInHexCode;
        }

        return (
            <svg viewBox="0 0 50 48" version="1.1" style={style}>
                <title>部落格分類照片</title>
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g transform="translate(-395.000000, -88.000000)">
                        <g transform="translate(394.950000, 88.100000)">
                            <g>
                                <g transform="translate(0.000000, 5.714286)">
                                    <rect stroke={color} stroke-width="2" fill="#FFFFFF" fill-rule="nonzero" x="1" y="1" width="30" height="35" rx="3"></rect>
                                    <g fill-rule="evenodd" stroke-width="1" transform="translate(4.740741, 20.812500)" fill={color}>
                                        <rect fill-rule="nonzero" x="0" y="4.625" width="9.48148148" height="2.3125" rx="1"></rect>
                                        <rect fill-rule="nonzero" x="0" y="9.25" width="14.2222222" height="2.3125" rx="1"></rect>
                                        <rect fill-rule="nonzero" x="0" y="0" width="18.962963" height="2.3125" rx="1"></rect>
                                    </g>
                                    <g fill-rule="evenodd" stroke-width="1" transform="translate(4.740741, 3.468750)">
                                        <path d="M1,0.5 C0.723857625,0.5 0.5,0.723857625 0.5,1 L0.5,14.03125 C0.5,14.3073924 0.723857625,14.53125 1,14.53125 L21.5185185,14.53125 C21.7946609,14.53125 22.0185185,14.3073924 22.0185185,14.03125 L22.0185185,1 C22.0185185,0.723857625 21.7946609,0.5 21.5185185,0.5 L1,0.5 Z" stroke={color} fill="#FFFFFF" fill-rule="nonzero"></path>
                                        <ellipse fill={color} fill-rule="nonzero" cx="15.4074074" cy="5.203125" rx="2.37037037" ry="2.890625"></ellipse>
                                        <polygon fill={color} fill-rule="nonzero" points="10.6666667 9.25 14.2222222 13.875 7.11111111 13.875"></polygon>
                                        <polygon fill={color} fill-rule="nonzero" points="5.33333333 5.78125 9.48148148 11.5625 1.18518519 11.5625"></polygon>
                                        <polygon fill={color} fill-rule="nonzero" points="1.18518519 11.5625 9.48148148 11.5625 9.48148148 13.875 1.18518519 13.875"></polygon>
                                    </g>
                                </g>
                                <g stroke-width="1" fill-rule="evenodd" transform="translate(33.333333, 3.428571)" fill={color}>
                                    <rect fill-rule="nonzero" x="0" y="20.5714286" width="5.95238095" height="1.14285714" rx="0.571428571"></rect>
                                    <rect fill-rule="nonzero" x="2.38095238" y="0" width="3.57142857" height="1.14285714" rx="0.571428571"></rect>
                                    <rect fill-rule="nonzero" x="2.38095238" y="0" width="1.19047619" height="41.1428571" rx="0.595238095"></rect>
                                    <rect fill-rule="nonzero" x="2.38095238" y="40" width="3.57142857" height="1.14285714" rx="0.571428571"></rect>
                                </g>
                                <rect stroke={color} stroke-width="2" fill="#FFFFFF" fill-rule="nonzero" x="41.4761905" y="1" width="7.52380952" height="6" rx="2"></rect>
                                <rect stroke={color} stroke-width="2" fill="#FFFFFF" fill-rule="nonzero" x="41.4761905" y="21.5714286" width="7.52380952" height="6" rx="2"></rect>
                                <rect stroke={color} stroke-width="2" fill="#FFFFFF" fill-rule="nonzero" x="41.4761905" y="41" width="7.52380952" height="6" rx="2"></rect>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
}