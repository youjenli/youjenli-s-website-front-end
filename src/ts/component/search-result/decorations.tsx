import * as React from 'react';

interface PropsOfDecorations {
    style?:React.CSSProperties;
}

export class KhakiDecorationOfCategory extends React.Component<PropsOfDecorations > {
    render() {
        return (
            <svg style={this.props.style} viewBox="0 0 154 44" version="1.1">
                <defs>
                    <path d="M8,0 L146,0 C150.418278,-8.11624501e-16 154,3.581722 154,8 L154,124.399858 C154,127.762298 151.897443,130.765875 148.738076,131.916702 L117.692363,143.225374 C117.581678,143.265692 117.470117,143.30356 117.357759,143.338951 L79.6494318,155.216529 C78.0328804,155.725719 76.2963826,155.70835 74.6903398,155.166927 C57.4044397,149.339563 45.7462563,145.379207 39.7157895,143.285858 C33.9937808,141.299584 22.5836774,137.475879 5.48547923,131.814746 L5.48547944,131.814745 C2.21091945,130.730554 4.22427077e-16,127.669575 0,124.220196 L0,8 C-5.41083001e-16,3.581722 3.581722,8.11624501e-16 8,0 Z" id="path-1"></path>
                    <filter x="-3.2%" y="-2.6%" width="106.5%" height="106.1%" filterUnits="objectBoundingBox" id="filter-2">
                        <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                        <feGaussianBlur stdDeviation="1.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                        <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
                    </filter>
                </defs>
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g transform="translate(0.000000, -122.000000)">
                        <path d="M8,9 L146,9 C150.418278,9 154,12.581722 154,17 L154,134.24546 C154,137.601862 151.904875,140.601393 148.753554,141.756647 L117.69308,153.143222 C117.581918,153.183974 117.469864,153.222253 117.357002,153.25803 L79.6639207,165.206912 C78.0384649,165.722189 76.2908895,165.704618 74.6761229,165.156763 C57.3980474,159.294683 45.7446029,155.310548 39.7157895,153.204357 C33.9921636,151.204785 22.5772271,147.35496 5.47097998,141.654881 L5.47097931,141.654883 C2.20383211,140.566216 4.21738299e-16,137.508902 0,134.065148 L0,17 C-5.41083001e-16,12.581722 3.581722,9 8,9 Z" fill="#FAD297"></path>
                        <g>
                            <use fill="black" fillOpacity="1" filter="url(#filter-2)" xlinkHref="#path-1"></use>
                            <use fill="#FFE9AC" fillRule="evenodd" xlinkHref="#path-1"></use>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
}

export class GreenDecorationOfCategory extends React.Component<PropsOfDecorations> {
    render() {
        return (
            <svg style={this.props.style} viewBox="0 0 154 44" version="1.1">
                <defs>
                    <path d="M8,0 L146,-7.10542736e-15 C150.418278,-7.91705186e-15 154,3.581722 154,8 L154,124.378175 C154,127.740771 151.897252,130.744451 148.737679,131.895164 L117.692345,143.201839 C117.581672,143.242146 117.470123,143.280004 117.357779,143.315385 L79.6490627,155.191134 C78.0327396,155.700169 76.2965256,155.682805 74.6907065,155.141546 C57.4046046,149.315073 45.746299,145.355327 39.7157895,143.262307 C33.993823,141.276373 22.5838455,137.453339 5.48585706,131.793205 L5.48585551,131.79321 C2.21110303,130.709132 4.22445053e-16,127.648057 0,124.198532 L0,8 C-5.41083001e-16,3.581722 3.581722,8.11624501e-16 8,0 Z" id="path-1"></path>
                    <filter x="-3.2%" y="-2.6%" width="106.5%" height="106.1%" filterUnits="objectBoundingBox" id="filter-2">
                        <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                        <feGaussianBlur stdDeviation="1.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                        <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
                    </filter>
                </defs>
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g transform="translate(0.000000, -124.000000)">
                        <path d="M8,9 L146,9 C150.418278,9 154,12.581722 154,17 L154,134.212937 C154,137.569572 151.90459,140.569258 148.75296,141.724343 L117.693053,153.10792 C117.581908,153.148655 117.469874,153.186918 117.357031,153.222681 L79.6633668,165.168822 C78.0382528,165.683865 76.291103,165.666302 74.6766712,165.118694 C57.3982939,159.257948 45.7446667,155.274727 39.7157895,153.16903 C33.992225,151.169969 22.577472,147.321148 5.47153063,141.622567 L5.47153205,141.622562 C2.20410251,140.534068 4.21764428e-16,137.476616 0,134.032648 L0,17 C-5.41083001e-16,12.581722 3.581722,9 8,9 Z" fill="#A9E44F"></path>
                        <g>
                            <use fill="black" fillOpacity="1" filter="url(#filter-2)" xlinkHref="#path-1"></use>
                            <use fill="#D9FFAF" fillRule="evenodd" xlinkHref="#path-1"></use>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
}

export class RedDecorationOfTag extends React.Component<PropsOfDecorations> {
    render() {
        return (
            <svg style={this.props.style} viewBox="0 0 160 39" version="1.1">
                <defs>
                    <filter x="-4.2%" y="-18.6%" width="108.3%" height="137.1%" filterUnits="objectBoundingBox" id="filter-1">
                        <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                        <feGaussianBlur stdDeviation="1" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                        <feColorMatrix values="0 0 0 0 0.145098039   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1" result="shadowMatrixOuter1"></feColorMatrix>
                        <feMerge>
                            <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
                            <feMergeNode in="SourceGraphic"></feMergeNode>
                        </feMerge>
                    </filter>
                </defs>
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g transform="translate(-8.000000, -13.000000)">
                        <g filter="url(#filter-1)" transform="translate(10.000000, 14.000000)">
                            <path d="M156,20 L156,35 L0,35 L0,20 L39,10 L78,0 L115,10 L156,20 Z M78,29 C82.418278,29 86,25.418278 86,21 C86,16.581722 82.418278,13 78,13 C73.581722,13 70,16.581722 70,21 C70,25.418278 73.581722,29 78,29 Z" fill="#FFD5D6"></path>
                            <path d="M78,32 C71.9248678,32 67,27.0751322 67,21 C67,14.9248678 71.9248678,10 78,10 C84.0751322,10 89,14.9248678 89,21 C89,27.0751322 84.0751322,32 78,32 Z M78,29 C82.418278,29 86,25.418278 86,21 C86,16.581722 82.418278,13 78,13 C73.581722,13 70,16.581722 70,21 C70,25.418278 73.581722,29 78,29 Z" fill="#C09191"></path>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
}

export class BlueDecorationOfTag extends React.Component<PropsOfDecorations> {
    render() {
        return (
            <svg style={this.props.style} viewBox="0 0 160 39" version="1.1">
                <defs>
                    <filter x="-4.2%" y="-18.6%" width="108.3%" height="137.1%" filterUnits="objectBoundingBox" id="filter-1">
                        <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                        <feGaussianBlur stdDeviation="1" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                        <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0.145098039  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1" result="shadowMatrixOuter1"></feColorMatrix>
                        <feMerge>
                            <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
                            <feMergeNode in="SourceGraphic"></feMergeNode>
                        </feMerge>
                    </filter>
                </defs>
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g transform="translate(-14.000000, -11.000000)">
                        <g filter="url(#filter-1)" transform="translate(16.000000, 12.000000)">
                            <path d="M156,20 L156,35 L0,35 L0,20 L39,10 L78,0 L115,10 L156,20 Z M78,29 C82.418278,29 86,25.418278 86,21 C86,16.581722 82.418278,13 78,13 C73.581722,13 70,16.581722 70,21 C70,25.418278 73.581722,29 78,29 Z" fill="#C1D6F0"></path>
                            <path d="M78,32 C71.9248678,32 67,27.0751322 67,21 C67,14.9248678 71.9248678,10 78,10 C84.0751322,10 89,14.9248678 89,21 C89,27.0751322 84.0751322,32 78,32 Z M78,29 C82.418278,29 86,25.418278 86,21 C86,16.581722 82.418278,13 78,13 C73.581722,13 70,16.581722 70,21 C70,25.418278 73.581722,29 78,29 Z" fill="#859DBB"></path>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
}