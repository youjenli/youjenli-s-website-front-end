import * as React from 'react';
import {isNotBlank, isNum} from '../../service/validator';

interface PropsOfCurriculumVitaeIcon {
    width?:number;
    marginRight?:number;
    colorInHexCode?:string;
}

export class CurriculumVitaeIcon extends React.Component<PropsOfCurriculumVitaeIcon> {
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

        let color = "#FCBE60";
        if (isNotBlank(this.props.colorInHexCode)) {
            color = this.props.colorInHexCode;
        }

        return (
            <svg viewBox="0 0 50 50" version="1.1" style={style}>
                <title>curriculum-vitae</title>
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g transform="translate(0.000000, -88.000000)" fill={color} fill-rule="nonzero">
                        <g transform="translate(0.000000, 88.100000)">
                            <g>
                                <path d="M19.7557186,15.9668427 C20.8217065,14.9182172 21.4082088,13.5573898 21.4082088,12.1152967 C21.4082088,9.00651158 18.6860372,6.52362131 15.479034,6.52362131 C12.2695037,6.52362131 9.54985931,9.00968019 9.54985931,12.1152967 C9.54985931,13.557483 10.1362644,14.9182172 11.2023495,15.9668427 C8.52177929,17.3869419 6.63387173,20.1024459 6.63387173,23.2986475 L6.63387173,24.6965664 C6.63387173,25.4685904 7.28666415,26.0944852 8.09186552,26.0944852 L22.8662026,26.0944852 C23.6714039,26.0944852 24.3241963,25.4685904 24.3241963,24.6965664 L24.3241963,23.2986475 C24.3241963,20.1578966 22.4891654,17.4149935 19.7557186,15.9668427 Z M15.479034,9.31945901 C17.1123759,9.31945901 18.4922212,10.5997663 18.4922212,12.1152967 C18.4922212,13.6308271 17.1123759,14.9111344 15.479034,14.9111344 C13.8456922,14.9111344 12.4658469,13.6308271 12.4658469,12.1152967 C12.4658469,10.5997663 13.8456922,9.31945901 15.479034,9.31945901 Z M9.54985931,23.2986475 C9.54985931,20.2153977 12.2096288,17.7069721 15.479034,17.7069721 C18.7484393,17.7069721 21.4082088,20.2153977 21.4082088,23.2986475 L9.54985931,23.2986475 Z" ></path>
                                <path d="M48.4753431,16.4207002 C46.7703195,14.7439894 43.9958296,14.7439894 42.290806,16.4207002 L41.0099731,17.6801923 L41.0099731,10.2248208 C41.0099731,9.85194232 40.8652721,9.49473583 40.5831584,9.21139788 C40.5830613,9.21130232 40.5830613,9.21120676 40.5829641,9.21120676 L31.8481313,0.431075035 C31.5636854,0.146781479 31.1801158,0 30.8060699,0 L4.3731014,0 C1.95603967,0 0,2.01595188 0,4.39579951 L0,44.6269211 C0,46.9980727 1.96177329,48.9271598 4.3731014,48.9271598 L36.6368717,48.9271598 C39.0481999,48.9271598 41.0099731,46.9980727 41.0099731,44.6269211 L41.0099731,29.8430829 L44.352286,26.5564583 L48.4753431,22.5021933 C50.1802696,20.825578 50.1802696,18.097411 48.4753431,16.4207002 Z M32.2637703,4.94852352 L36.0870271,8.79159903 L32.2637703,8.79159903 L32.2637703,4.94852352 Z M38.0945722,44.6269211 C38.0945722,45.417305 37.4406478,46.060334 36.6368717,46.060334 L4.3731014,46.060334 C3.56932536,46.060334 2.91540093,45.417305 2.91540093,44.6269211 L2.91540093,4.39579951 C2.91540093,3.58133431 3.59653577,2.86682577 4.3731014,2.86682577 L29.3483694,2.86682577 L29.3483694,10.2250119 C29.3483694,11.0166381 30.0010305,11.6584248 30.8060699,11.6584248 L38.0945722,11.6584248 L38.0945722,20.5471137 L25.7987716,32.6379513 C25.6973156,32.7376213 25.5965399,32.8712154 25.5256957,33.0104476 L21.8056441,40.3266825 L16.1318852,40.3266825 C15.3268458,40.3266825 14.6741847,40.9684692 14.6741847,41.7600954 C14.6741847,42.5517215 15.3268458,43.1935083 16.1318852,43.1935083 L22.0598671,43.1935083 C22.1715269,43.1935083 23.0690817,43.18443 23.3584838,43.0422354 L31.604501,38.9879704 C31.74755,38.9170643 31.8791318,38.821599 31.9833088,38.7194444 L38.0945722,32.7100042 L38.0945722,44.6269211 Z M29.3611972,36.8856315 L25.9660184,38.5548886 L27.6636564,35.2162789 C28.4635452,35.4761088 29.0970618,36.0989745 29.3611972,36.8856315 Z M31.6674737,34.9756566 C31.1744794,34.1342433 30.4615667,33.4332088 29.6059937,32.9484286 L39.1986345,23.5158073 L41.2601145,25.5429398 L31.6674737,34.9756566 Z M46.413766,20.4750608 L43.3214974,23.5157117 L41.2600174,21.4885792 L44.352286,18.4478327 C44.920692,17.8889928 45.8454571,17.8889928 46.413766,18.4478327 C46.982172,19.0067682 46.982172,19.9161253 46.413766,20.4750608 Z" ></path>
                                <path d="M31.8794392,14.1345128 L26.7197611,14.1345128 C26.0073816,14.1345128 25.4298416,14.6213199 25.4298416,15.221783 C25.4298416,15.8222461 26.0073816,16.3090533 26.7197611,16.3090533 L31.8794392,16.3090533 C32.5918187,16.3090533 33.1693587,15.8222461 33.1693587,15.221783 C33.1693587,14.6213199 32.5918187,14.1345128 31.8794392,14.1345128 Z" ></path>
                                <path d="M31.8794392,20.6581341 L26.7197611,20.6581341 C26.0073816,20.6581341 25.4298416,21.1449413 25.4298416,21.7454044 C25.4298416,22.3458675 26.0073816,22.8326746 26.7197611,22.8326746 L31.8794392,22.8326746 C32.5918187,22.8326746 33.1693587,22.3458675 33.1693587,21.7454044 C33.1693587,21.1449413 32.5918187,20.6581341 31.8794392,20.6581341 Z" ></path>
                                <path d="M19.588834,29.3562959 L8.05229825,29.3562959 C7.26894857,29.3562959 6.63387173,29.843103 6.63387173,30.4435661 C6.63387173,31.0440292 7.26894857,31.5308363 8.05229825,31.5308363 L19.588834,31.5308363 C20.3721836,31.5308363 21.0072605,31.0440292 21.0072605,30.4435661 C21.0072605,29.843103 20.3721836,29.3562959 19.588834,29.3562959 Z" ></path>
                                <path d="M19.588834,35.8799172 L8.05229825,35.8799172 C7.26894857,35.8799172 6.63387173,36.3667243 6.63387173,36.9671874 C6.63387173,37.5676505 7.26894857,38.0544576 8.05229825,38.0544576 L19.588834,38.0544576 C20.3721836,38.0544576 21.0072605,37.5676505 21.0072605,36.9671874 C21.0072605,36.3667243 20.3721836,35.8799172 19.588834,35.8799172 Z" ></path>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
}