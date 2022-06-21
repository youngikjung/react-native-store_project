import React from 'react';
import Svg, {Line, Polygon} from 'react-native-svg';

export const ComponentSend = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-send">
      <Line x1="22" y1="2" x2="11" y2="13"></Line>
      <Polygon points="22 2 15 22 11 13 2 9 22 2"></Polygon>
    </Svg>
  );
};
