import React from 'react';
import Svg, {Path, G, Rect} from 'react-native-svg';

export const ComponentNoAccount = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height={sHeight} viewBox="0 0 24 24" width={iWidth} fill={sColor}>
    <G>
    <Rect fill="none" height={sHeight} width={sWidth}/>
    </G>
    <G>
    <G>
    <Path d="M15.18,10.94c0.2-0.44,0.32-0.92,0.32-1.44C15.5,7.57,13.93,6,12,6c-0.52,0-1,0.12-1.44,0.32L15.18,10.94z"/>
    <Path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M4,12c0-1.85,0.63-3.55,1.69-4.9l2.86,2.86 c0.21,1.56,1.43,2.79,2.99,2.99l2.2,2.2C13.17,15.05,12.59,15,12,15c-2.32,0-4.45,0.8-6.14,2.12C4.7,15.73,4,13.95,4,12z M12,20 c-1.74,0-3.34-0.56-4.65-1.5C8.66,17.56,10.26,17,12,17s3.34,0.56,4.65,1.5C15.34,19.44,13.74,20,12,20z M18.31,16.9L7.1,5.69 C8.45,4.63,10.15,4,12,4c4.42,0,8,3.58,8,8C20,13.85,19.37,15.54,18.31,16.9z"/>
    </G>
    </G>
    </Svg>
  );
};