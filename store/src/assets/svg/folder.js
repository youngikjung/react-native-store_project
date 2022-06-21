import React from 'react';
import Svg, {Path,Polyline} from 'react-native-svg';

export const ComponentFolder = ({iHeight,iWidth,iColor}) => {
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
    <Svg width={sWidth} height={sHeight} viewBox="0 0 21 19" fill={sColor} xmlns="http://www.w3.org/2000/svg">
      <Path d="M19.5 15.9C19.5 16.3774 19.3104 16.8352 18.9728 17.1728C18.6352 17.5104 18.1774 17.7 17.7 17.7H3.3C2.82261 17.7 2.36477 17.5104 2.02721 17.1728C1.68964 16.8352 1.5 16.3774 1.5 15.9V3.3C1.5 2.82261 1.68964 2.36477 2.02721 2.02721C2.36477 1.68964 2.82261 1.5 3.3 1.5H7.8L9.6 4.2H17.7C18.1774 4.2 18.6352 4.38964 18.9728 4.72721C19.3104 5.06477 19.5 5.52261 19.5 6V15.9Z" stroke="#2F2F2F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </Svg>
  );
};
