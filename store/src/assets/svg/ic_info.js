import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

export const ComponentIcInfo= ({iHeight,iWidth,iColor}) => {
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
    <Svg height={sHeight} width={sWidth} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5Z" fill="#F45552"/>
      <Path d="M11 8.31189C11 7.75961 11.4477 7.31189 12 7.31189C12.5523 7.31189 13 7.7596 13 8.31189V13.1363C13 13.6886 12.5523 14.1363 12 14.1363C11.4477 14.1363 11 13.6886 11 13.1363V8.31189Z" fill="white"/>
      <Path d="M13 15.5987C13 16.1372 12.5523 16.5736 12 16.5736C11.4477 16.5736 11 16.1372 11 15.5987C11 15.0603 11.4477 14.6238 12 14.6238C12.5523 14.6238 13 15.0603 13 15.5987Z" fill="white"/>
    </Svg>
  );
};
