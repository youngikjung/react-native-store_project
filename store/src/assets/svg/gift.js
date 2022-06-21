import React from 'react';
import Svg, {Line,Polyline,Rect,Path} from 'react-native-svg';

export const ComponentGift = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-gift">
      <Polyline points="20 12 20 22 4 22 4 12"></Polyline>
      <Rect x="2" y="7" width="20" height="5"></Rect>
      <Line x1="12" y1="22" x2="12" y2="7"></Line>
      <Path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></Path>
      <Path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></Path>
    </Svg>
  );
};
