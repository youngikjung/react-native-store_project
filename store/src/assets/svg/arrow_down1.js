import React from 'react';
import Svg, {Path, Circle} from 'react-native-svg';

export const ComponentArrowDown1 = ({iHeight,iWidth,iColor}) => {
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
    <Svg height={sHeight} width={sWidth} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M5 8L10 13" stroke={sColor} strokeWidth="1.5" strokeLinecap="round"/>
      <Path d="M15 8L10 13" stroke={sColor} strokeWidth="1.5" strokeLinecap="round"/>
    </Svg>
  );
};
