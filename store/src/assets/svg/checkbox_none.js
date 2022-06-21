import React from 'react';
import Svg, {Rect, Circle, Polyline} from 'react-native-svg';

export const ComponentCheckBoxNone = ({iHeight,iWidth,iColor}) => {
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
    <Rect x="0.5" y="0.5" width="19" height="19" rx="3.5" fill="white" stroke="#E5E7EA"/>
    </Svg>
  );
};
