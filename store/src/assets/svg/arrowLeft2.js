import React from 'react';
import Svg, {Path, Line, Polyline} from 'react-native-svg';

export const ComponentArrowLeft2 = ({iHeight,iWidth,iColor}) => {
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
    <Svg width={sWidth} height={sHeight} viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M1 1L5 5L1 9" stroke="#95959E"/>
    </Svg>
  );
};
