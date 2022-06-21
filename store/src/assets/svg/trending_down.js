import React from 'react';
import Svg, {Polyline,Circle} from 'react-native-svg';

export const ComponentTrendingDown = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-trending-down">
      <Polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></Polyline>
      <Polyline points="17 18 23 18 23 12"></Polyline>
    </Svg>
  );
};
