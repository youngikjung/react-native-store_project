import React from 'react';
import Svg, {Circle,Polyline} from 'react-native-svg';

export const ComponentAward = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg"width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} strokeWidth="2" strokeLinecap="round" strokeLineJoin="round" class="feather feather-award">
      <Circle cx="12" cy="8" r="7"></Circle>
      <Polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></Polyline>
    </Svg>
  );
};
