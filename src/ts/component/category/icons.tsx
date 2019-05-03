import * as React from 'react';

interface PropsOfIconRelatedWithCategoryOrTag {
    style?:React.CSSProperties;
}

export class Information extends React.Component<PropsOfIconRelatedWithCategoryOrTag> {
    render() {
        return (
            <svg className="icon" style={this.props.style} viewBox="0 0 28 28" version="1.1">
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <circle id="Oval" stroke="#979797" strokeWidth="2" cx="14" cy="14" r="12"></circle>
                    <circle id="Oval" fill="#9B9B9B" cx="14" cy="7.75" r="2.75"></circle>
                    <rect id="Rectangle" fill="#9B9B9B" x="11.25" y="12.5" width="5.5" height="10.5"></rect>
                </g>
            </svg>
        );
    }
}

export class ParentCategory extends React.Component<PropsOfIconRelatedWithCategoryOrTag> {
    render() {
        return (
            <svg className="icon" style={this.props.style} viewBox="0 0 28 28" version="1.1">
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <rect id="Rectangle" fill="#9B9B9B" x="8" y="1" width="12" height="12"></rect>
                    <rect id="Rectangle" fill="#9B9B9B" x="13" y="13" width="2" height="6"></rect>
                    <rect id="Rectangle" fill="#9B9B9B" x="10" y="19" width="8" height="8"></rect>
                </g>
            </svg>
        );
    }
}

export class Count extends React.Component<PropsOfIconRelatedWithCategoryOrTag> {
    render() {
        return (
            <svg className="icon" style={this.props.style} viewBox="0 0 30 30" version="1.1">
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <rect id="Rectangle" fill="#9B9B9B" x="4" y="1" width="7" height="7"></rect>
                    <rect id="Rectangle" fill="#9B9B9B" x="7" y="8" width="2" height="18"></rect>
                    <rect id="Rectangle" fill="#9B9B9B" x="9" y="14" width="8" height="2"></rect>
                    <rect id="Rectangle" fill="#9B9B9B" x="9" y="24" width="8" height="2"></rect>
                    <rect id="Rectangle" fill="#9B9B9B" x="17" y="11" width="8" height="8"></rect>
                    <rect id="Rectangle" fill="#9B9B9B" x="17" y="21" width="8" height="8"></rect>
                </g>
            </svg>
        );
    }
}