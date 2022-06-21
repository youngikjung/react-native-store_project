import React from 'react';
import Svg, {Line,Polyline} from 'react-native-svg';

export const ComponentArrowRight = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} strokeWidth="2" strokeLinecap="round" strokeLineJoin="round" class="feather feather-arrow-right">
      <Line x1="5" y1="12" x2="19" y2="12"></Line>
      <Polyline points="12 5 19 12 12 19"></Polyline>
    </Svg>
  );
};
