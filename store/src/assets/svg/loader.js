import React from 'react';
import Svg, {Line, Circle} from 'react-native-svg';

export const ComponentLoader = ({iHeight,iWidth,iColor}) => {
  let sWidth = 40;
  let sHeight = 40;
  let sColor = "#000";

  if(iHeight !== undefined && iHeight !== null){
    sHeight = iHeight;
  }

  if(iWidth !== undefined && iWidth !== null){
    sWidth = iWidth;
  }

  if(iColor !== undefined && iColor !== null){
    sColor = iColor;
  }

  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-loader">
    <Line x1="12" y1="2" x2="12" y2="6"></Line>
    <Line x1="12" y1="18" x2="12" y2="22"></Line>
    <Line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></Line>
    <Line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></Line>
    <Line x1="2" y1="12" x2="6" y2="12"></Line>
    <Line x1="18" y1="12" x2="22" y2="12"></Line>
    <Line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></Line>
    <Line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></Line>
    </Svg>
  );
};
