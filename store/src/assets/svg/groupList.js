import React from 'react';
import Svg, {Path, Line, Polyline} from 'react-native-svg';

export const ComponentGroupList = ({iHeight,iWidth,iColor}) => {
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
      <Path d="M4 5H16" stroke="#B0B7C1" stroke-width="1.5" stroke-linecap="round"/>
      <Path d="M4 9.7998H16" stroke="#B0B7C1" stroke-width="1.5" stroke-linecap="round"/>
      <Path d="M4 14.5996H16" stroke="#B0B7C1" stroke-width="1.5" stroke-linecap="round"/>
    </Svg>
  );
};
