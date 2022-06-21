import React from 'react';
import Svg, {Path, Circle,Line} from 'react-native-svg';

export const ComponentSearch1 = ({iHeight,iWidth,iColor}) => {
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
    <Svg width={sWidth} height={sHeight} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Circle cx="6.06667" cy="6.06667" r="5.31667" stroke="#6B7583" stroke-width="1.5"/>
    <Path d="M9.80005 10.2676L13.5334 14.0009" stroke="#6B7583" stroke-width="1.5" stroke-linecap="round"/>
    </Svg>
  );
};
