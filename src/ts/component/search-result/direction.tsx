import * as React from 'react';
import * as terms from './terms';

interface PropsOfDirection {
    style?:React.CSSProperties
}

export class LeftDirection extends React.Component<PropsOfDirection> {
    render() {
        return (
            <svg className="direction prev" style={this.props.style} viewBox="0 0 23 40" version="1.1">
                <title>{terms.previousPage}</title>
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" opacity="0.969999969">
                    <g transform="translate(-376.000000, -1605.000000)" fill="#1B3600">
                        <g transform="translate(368.000000, 320.000000)">
                            <g transform="translate(0.000000, 127.000000)">
                                <g transform="translate(0.000000, 1157.000000)">
                                    <g>
                                        <g>
                                            <g transform="translate(0.000000, 1.000000)">
                                                <path d="M14.2627417,19.9029437 L30.0686292,35.7088312 C31.0058875,36.6460895 31.0058875,38.1656854 30.0686292,39.1029437 C29.1313708,40.040202 27.6117749,40.040202 26.6745166,39.1029437 L9.50294373,21.9313708 C8.94982176,21.3782489 8.72312412,20.6223128 8.82285081,19.9029437 C8.72312412,19.1835746 8.94982176,18.4276386 9.50294373,17.8745166 L26.6745166,0.702943725 C27.6117749,-0.234314575 29.1313708,-0.234314575 30.0686292,0.702943725 C31.0058875,1.64020203 31.0058875,3.15979797 30.0686292,4.09705627 L14.2627417,19.9029437 Z"></path>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
}

export class RightDirection extends React.Component<PropsOfDirection> {
    render() {
        return (
            <svg className="direction next" style={this.props.style} viewBox="0 0 23 40" version="1.1">
                <title>{terms.nextPage}</title>
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" opacity="0.969999969">
                    <g transform="translate(-1522.000000, -2388.000000)" fill="#4C7027">
                        <g transform="translate(368.000000, 320.000000)">
                            <g transform="translate(0.000000, 1380.000000)">
                                <g transform="translate(0.000000, 686.000000)">
                                    <g transform="translate(1068.000000, 2.000000)">
                                        <g>
                                            <g transform="translate(78.000000, 0.000000)">
                                                <path d="M14.2627417,19.9029437 L30.0686292,35.7088312 C31.0058875,36.6460895 31.0058875,38.1656854 30.0686292,39.1029437 C29.1313708,40.040202 27.6117749,40.040202 26.6745166,39.1029437 L9.50294373,21.9313708 C8.94982176,21.3782489 8.72312412,20.6223128 8.82285081,19.9029437 C8.72312412,19.1835746 8.94982176,18.4276386 9.50294373,17.8745166 L26.6745166,0.702943725 C27.6117749,-0.234314575 29.1313708,-0.234314575 30.0686292,0.702943725 C31.0058875,1.64020203 31.0058875,3.15979797 30.0686292,4.09705627 L14.2627417,19.9029437 Z" transform="translate(19.785786, 19.902944) rotate(-180.000000) translate(-19.785786, -19.902944) "></path>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
}