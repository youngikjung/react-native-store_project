import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

export const ComponentIcChat = ({iHeight,iWidth,iColor}) => {
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
    <Svg height={sHeight} width={sWidth} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path fillRule="evenodd" clipRule="evenodd" d="M2.25 16.4334V5.25C2.25 3.59315 3.59315 2.25 5.25 2.25H12.75C14.4069 2.25 15.75 3.59315 15.75 5.25V10.5C15.75 12.1569 14.4069 13.5 12.75 13.5H5.9168L2.25 16.4334ZM3.75 5.25C3.75 4.42157 4.42157 3.75 5.25 3.75H12.75C13.5784 3.75 14.25 4.42157 14.25 5.25V10.5C14.25 11.3284 13.5784 12 12.75 12H5.65371C5.5101 12 5.3701 12.0412 5.25 12.1179C5.22767 12.1322 5.20604 12.1477 5.18519 12.1643L3.75 13.3125V5.25Z" fill={sColor}/>
      <Rect x="8.0625" y="6.9375" width="1.875" height="1.875" rx="0.9375" fill={sColor}/>
      <Rect x="10.875" y="6.9375" width="1.875" height="1.875" rx="0.9375" fill={sColor}/>
      <Rect x="5.25" y="6.9375" width="1.875" height="1.875" rx="0.9375" fill={sColor}/>
    </Svg>
    
  );
};
