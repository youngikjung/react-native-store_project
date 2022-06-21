import React from 'react';
import Svg, {Polygon, Circle} from 'react-native-svg';

export const ComponentZap = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" height={sHeight} width={sWidth} viewBox="0 0 24 24" fill="none" stroke={sColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-zap">
      <Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></Polygon>
    </Svg>
  );
};
