import React from 'react';
import Svg, {Polygon, Circle} from 'react-native-svg';

export const ComponentLayers = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-layers">
      <Polygon points="12 2 2 7 12 12 22 7 12 2"></Polygon>
      <Polygon points="2 17 12 22 22 17"></Polygon>
      <Polygon points="2 12 12 17 22 12"></Polygon>
    </Svg>
  );
};
