import React from 'react';
import Svg, {Path, Circle, Polyline} from 'react-native-svg';

export const ComponentNotice1 = ({iHeight,iWidth,iColor}) => {
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
    <Svg width={sWidth} height={sHeight} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Circle cx="7" cy="7" r="7" fill={sColor}/>
      <Path d="M7.00013 2.92383C6.86947 2.92383 6.74432 2.97615 6.65246 3.06918C6.56074 3.1622 6.51002 3.28807 6.51176 3.41874V8.54358C6.51176 8.8132 6.73037 9.03195 7.00013 9.03195C7.2699 9.03195 7.48851 8.8132 7.48851 8.54358V3.41874C7.49025 3.28807 7.43952 3.1622 7.34781 3.06918C7.25595 2.97615 7.13081 2.92383 7.00013 2.92383Z" fill="#fff"/>
      <Path d="M6.65516 10.1223C6.46359 10.3128 6.46286 10.6226 6.65341 10.8142C6.84411 11.0056 7.15384 11.0063 7.34528 10.8158C7.53685 10.6251 7.53758 10.3153 7.34703 10.1239C7.15633 9.93232 6.8466 9.93159 6.65516 10.1223Z" fill="#fff"/>
    </Svg>
  );
};
