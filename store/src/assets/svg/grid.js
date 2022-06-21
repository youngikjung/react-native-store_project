import React from 'react';
import Svg, {Rect} from 'react-native-svg';

export const ComponentGrid = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-grid">
      <Rect x="3" y="3" width="7" height="7"></Rect>
      <Rect x="14" y="3" width="7" height="7"></Rect>
      <Rect x="14" y="14" width="7" height="7"></Rect>
      <Rect x="3" y="14" width="7" height="7"></Rect>
    </Svg>
  );
};
