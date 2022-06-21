import React from 'react';
import Svg, {Path, Polyline,Line} from 'react-native-svg';

export const ComponentTrash2 = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
      <Polyline points="3 6 5 6 21 6"></Polyline>
      <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></Path>
      <Line x1="10" y1="11" x2="10" y2="17"></Line>
      <Line x1="14" y1="11" x2="14" y2="17"></Line>
    </Svg>
  );
};
