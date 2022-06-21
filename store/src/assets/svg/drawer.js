import React from 'react';
import Svg, {Path} from 'react-native-svg';

export const ComponentDrawer = ({iHeight,iWidth,iColor}) => {
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
    <Svg 
      width={sWidth}
      height={sHeight}
      viewBox="0 0 40 40"
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path d="M27.5 20.75H12.5C12.09 20.75 11.75 20.41 11.75 20C11.75 19.59 12.09 19.25 12.5 19.25H27.5C27.91 19.25 28.25 19.59 28.25 20C28.25 20.41 27.91 20.75 27.5 20.75Z" fill={sColor}/>
      <Path d="M21.5 16.25H12.5C12.09 16.25 11.75 15.91 11.75 15.5C11.75 15.09 12.09 14.75 12.5 14.75H21.5C21.91 14.75 22.25 15.09 22.25 15.5C22.25 15.91 21.92 16.25 21.5 16.25Z" fill={sColor}/>
      <Path d="M27.5 25.25H12.5C12.09 25.25 11.75 24.91 11.75 24.5C11.75 24.09 12.09 23.75 12.5 23.75H27.5C27.91 23.75 28.25 24.09 28.25 24.5C28.25 24.91 27.91 25.25 27.5 25.25Z" fill={sColor}/>
    </Svg>
  );
};
