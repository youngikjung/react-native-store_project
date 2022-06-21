import React from 'react';
import Svg, {Line, Polyline} from 'react-native-svg';

export const ComponentItalic = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-italic">
      <Line x1="19" y1="4" x2="10" y2="4"></Line>
      <Line x1="14" y1="20" x2="5" y2="20"></Line>
      <Line x1="15" y1="4" x2="9" y2="20"></Line>
    </Svg>
  );
};
