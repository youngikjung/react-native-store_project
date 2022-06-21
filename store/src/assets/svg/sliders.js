import React from 'react';
import Svg, {Line} from 'react-native-svg';

export const ComponentSliders = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={iColor} strokeWidth={"2"} strokeLinecap="round" strokeLinejoin="round" class="feather feather-sliders">
      <Line x1="4" y1="21" x2="4" y2="14"></Line>
      <Line x1="4" y1="10" x2="4" y2="3"></Line>
      <Line x1="12" y1="21" x2="12" y2="12"></Line>
      <Line x1="12" y1="8" x2="12" y2="3"></Line>
      <Line x1="20" y1="21" x2="20" y2="16"></Line>
      <Line x1="20" y1="12" x2="20" y2="3"></Line>
      <Line x1="1" y1="14" x2="7" y2="14"></Line>
      <Line x1="9" y1="8" x2="15" y2="8"></Line>
      <Line x1="17" y1="16" x2="23" y2="16"></Line>
    </Svg>
  );
};
