import * as React from 'react';

interface IconProps {
    style?:React.CSSProperties;
}

export class CategoryIcon extends React.Component<IconProps> {
    render() {
        return (
            <svg className="icon" style={this.props.style} viewBox="0 0 28 28" version="1.1" >
                <title>文章分類</title>
                <g stroke="none" strokeWidth="1" fillRule="evenodd">
                    <polygon fillRule="nonzero" points="15 18 15 14 11 14 11 22 15 22.001 15 20 23 20 23 28 15 28 15 24 9 24 9 8 5 8 5 0 13 0 13 8 11 8 11 12 15 12 15 10 23 10 23 18"></polygon>
                </g>
            </svg>
        );
    }
}

export class TagIcon extends React.Component<IconProps> {
    render() {
        return (
            <svg className="icon" style={this.props.style} viewBox="0 0 26 26" version="1.1">
                <title>文章標籤</title>
                <g stroke="none" strokeWidth="1" fillRule="evenodd">
                    <g transform="translate(-1.000000, -1.000000)" fillRule="nonzero">
                        <g transform="translate(1.000000, 1.000000)">
                            <path d="M25.5730835,2.10557794 C25.5306021,1.19681255 24.803395,0.469606337 23.8946284,0.427125014 L14.8072275,0.00204737967 C14.3119052,-0.021925483 13.8291863,0.165538778 13.4784065,0.516406301 L0.516298553,13.478586 C0.18578992,13.8091824 0,14.2574397 0,14.7249986 C0,15.1925576 0.185701784,15.640903 0.516298553,15.9714993 L10.0286896,25.4837902 C10.3727711,25.8279595 10.8239374,26 11.2751037,26 C11.7261819,26 12.1773482,25.8278713 12.521606,25.4837902 L25.4836258,12.5217868 C25.8344056,12.1710074 26.0212532,11.6885535 25.9980735,11.1929675 L25.5730835,2.10557794 Z M22.2525734,6.70598792 C21.4356442,7.52291609 20.1110537,7.52291609 19.2941245,6.70598792 C18.4771953,5.88905974 18.4771953,4.56447094 19.2941245,3.74754277 C20.1110537,2.93061459 21.4356442,2.93061459 22.2525734,3.74754277 C23.0695026,4.56447094 23.0695907,5.88897161 22.2525734,6.70598792 Z"></path>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
}

export class PublishIcon extends React.Component<IconProps> {
    render() {
        return (
            <svg className="icon" style={this.props.style} viewBox="0 0 27 27" version="1.1">
                <title>發佈資訊</title>
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g fill="#888888" fillRule="nonzero">
                        <path d="M7,17 L3,14 L7,11 L7,1 C7,0.44771525 7.44771525,1.01453063e-16 8,0 L26,0 C26.5522847,-1.01453063e-16 27,0.44771525 27,1 L27,26 C27,26.5522847 26.5522847,27 26,27 L8,27 C7.44771525,27 7,26.5522847 7,26 L7,17 Z M20,9 C21.1045695,9 22,8.1045695 22,7 C22,5.8954305 21.1045695,5 20,5 C18.8954305,5 18,5.8954305 18,7 C18,8.1045695 18.8954305,9 20,9 Z M14.5,9 L10,14 L19,14 L14.5,9 Z M9,18 L9,20 L25,20 L25,18 L9,18 Z M9,22 L9,24 L25,24 L25,22 L9,22 Z M9,4 L9,14 L10,14 L10,4 L9,4 Z M9,3 L9,4 L25,4 L25,3 L9,3 Z M24,4 L24,14 L25,14 L25,4 L24,4 Z M9,14 L9,15 L25,15 L25,14 L9,14 Z M-8.8817842e-16,0 L2.5,0 L2.5,27 L-8.8817842e-16,27 L-8.8817842e-16,0 Z"></path>
                    </g>
                </g>
            </svg>
        );
    }
}