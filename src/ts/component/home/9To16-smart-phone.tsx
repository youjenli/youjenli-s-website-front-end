import * as React from 'react';
import SloganOnSmartPhone from './slogan/smart-phone-slogan';

interface PropsOfHomeOf9To16SmartPhone {
    viewportWidth:number;
    baseZIndex:number;
}

export default class HomeOf9To16SmartPhone extends React.Component<PropsOfHomeOf9To16SmartPhone> {
    render() {
        const remFontSize = 16;
        const widthOfPortrait = this.props.viewportWidth - 2 * remFontSize;
        const heightOfPortrait = widthOfPortrait * 0.6;
        const topShiftOfPortrait = heightOfPortrait * 0.28;
        const marginTopOfL1bg = topShiftOfPortrait + remFontSize;
        const marginLeftRightOfL1bg = remFontSize / 2;
        const leftShiftOfPortrait = (this.props.viewportWidth - 2 * marginLeftRightOfL1bg - widthOfPortrait)/2;
        
        const fontSizeOfGreetings = this.props.viewportWidth / 11.43;
        const fontSizeOfWelMsg = this.props.viewportWidth / 13.33;
        const marginBottomOfSlogan = remFontSize * 0.5;
        const l1bg = {
            margin:{
                top:marginTopOfL1bg,
                leftRight:marginLeftRightOfL1bg
            },
            portrait:{
                imgUrl:'img/portrait-5-3rd.png',
                width:widthOfPortrait,
                height:heightOfPortrait,
                topShift:-1 * topShiftOfPortrait,
                leftShift:leftShiftOfPortrait
            },
            greetings:{
                fontSize:fontSizeOfGreetings,
                marginTopBottom:fontSizeOfGreetings * 0.5
            }
        }
        const descPanel = {
            padding:{
                top:fontSizeOfWelMsg * 0.75,
                leftRight:remFontSize,//todo 缺少規格
                bottom:remFontSize
            },
            welMsg:{
                fontSize:fontSizeOfWelMsg,
                marginBottom:fontSizeOfWelMsg * 0.5
            },
            desc:{
                fontSize:remFontSize
            }
        }

        return (
            <SloganOnSmartPhone marginBottom={marginBottomOfSlogan} 
                baseZIndex={this.props.baseZIndex} l1bg={l1bg} descPanel={descPanel} />
        );
    }
}