import React from 'react';
import Svg, {Path, Circle} from 'react-native-svg';

export const ComponentRss = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-rss">
      <Path d="M4 11a9 9 0 0 1 9 9"></Path>
      <Path d="M4 4a16 16 0 0 1 16 16"></Path>
      <Circle cx="5" cy="19" r="1"></Circle>
    </Svg>
  );
};
