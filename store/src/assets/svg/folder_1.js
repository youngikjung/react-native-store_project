import React from 'react';
import Svg, {Path, Rect, Polyline} from 'react-native-svg';

export const ComponentFolder1 = ({iHeight,iWidth,iColor}) => {
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
    <Rect width="28" height="28" rx="6" fill="#A1E7CA"/>
    <Rect x="6" y="7" width="16" height="10" rx="2" fill="#06B26C"/>
    <Rect x="14" y="6" width="8" height="12" rx="2" fill="#06B26C"/>
    <Rect x="5" y="9" width="18" height="13" rx="2" fill="#16C47E"/>
    </Svg>
  );
};
