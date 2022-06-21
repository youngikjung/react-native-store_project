import React from 'react';
import Svg, {Path, Line, Polyline} from 'react-native-svg';

export const ComponentTime = ({iHeight,iWidth,iColor}) => {
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
    <Svg width={sWidth} height={sHeight} viewBox="0 0 24 24" fill={sColor} xmlns="http://www.w3.org/2000/svg">
    <Path fillRule="evenodd" clipRule="evenodd" d="M12 4C7.60457 4 4 7.60457 4 12C4 16.3954 7.60457 20 12 20C16.3954 20 20 16.3954 20 12C20 7.60457 16.3954 4 12 4ZM12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2Z" fill="#2F2F2F"/>
    <Path fillRule="evenodd" clipRule="evenodd" d="M12.5 12.5338V7.75C12.5 7.33579 12.1642 7 11.75 7C11.3358 7 11 7.33579 11 7.75V13.4659L15.3234 15.6571C15.696 15.8459 16.151 15.6944 16.3359 15.3199C16.5179 14.9514 16.3698 14.5051 16.0036 14.3185L12.5 12.5338Z" fill="#2F2F2F"/>
    </Svg>
  );
};
