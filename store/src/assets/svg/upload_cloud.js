import React from 'react';
import Svg, {Path, Polyline,Line} from 'react-native-svg';

export const ComponentUploadCloud = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-upload-cloud">
      <Polyline points="16 16 12 12 8 16"></Polyline>
      <Line x1="12" y1="12" x2="12" y2="21"></Line>
      <Path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></Path>
      <Polyline points="16 16 12 12 8 16"></Polyline>
    </Svg>
  );
};
