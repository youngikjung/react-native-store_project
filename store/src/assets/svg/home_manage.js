import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const ComponentHomeManage = ({iHeight,iWidth,iColor}) => {
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
    <Svg width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke={sColor} strokeWidth="2"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M12.75 8.75C12.75 8.33579 12.4142 8 12 8C11.5858 8 11.25 8.33579 11.25 8.75V11.25H8.75C8.33579 11.25 8 11.5858 8 12C8 12.4142 8.33579 12.75 8.75 12.75H11.25V15.25C11.25 15.6642 11.5858 16 12 16C12.4142 16 12.75 15.6642 12.75 15.25V12.75H15.25C15.6642 12.75 16 12.4142 16 12C16 11.5858 15.6642 11.25 15.25 11.25H12.75V8.75Z" fill={sColor}/>
    </Svg>
  );
};
