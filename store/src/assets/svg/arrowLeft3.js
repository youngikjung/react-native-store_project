import React from 'react';
import Svg, {Path, Line, Polyline} from 'react-native-svg';

export const ComponentArrowLeft3 = ({iHeight,iWidth,iColor}) => {
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
    <Svg width={sWidth} height={sHeight} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M13.5 3L6 10.5" stroke="#333D4B" strokeWidth="1.5" strokeLinecap="round"/>
      <Path d="M13.5 18L6 10.5" stroke="#333D4B" strokeWidth="1.5" strokeLinecap="round"/>
    </Svg>
  );
};
