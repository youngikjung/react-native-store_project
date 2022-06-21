import React from 'react';
import Svg, {Path, Rect, Polyline} from 'react-native-svg';

export const ComponentPush1 = ({iHeight,iWidth,iColor}) => {
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
    <Svg width={sWidth} height={sHeight} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Rect width="28" height="28" rx="6" fill="#FFBEC9"/>
    <Rect x="3" y="10" width="22" height="6" rx="1" fill="#FF8397"/>
    <Rect x="4" y="18" width="20" height="6" rx="1" fill="#D96779"/>
    <Rect x="3" y="17" width="22" height="6" rx="1" fill="#FF8397"/>
    </Svg>
  );
};
