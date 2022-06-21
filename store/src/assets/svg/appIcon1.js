import React from 'react';
import Svg, {Path, Polyline,Line} from 'react-native-svg';

export const ComponentAppIcon1 = ({iHeight,iWidth,iColor,bColor}) => {
  let sWidth = 40;
  let sHeight = 40;
  let sColor = "#000";
  let kColor = "#001E62"

  if(iHeight !== undefined && iHeight !== null){
    sHeight = iHeight;
  }

  if(iWidth !== undefined && iWidth !== null){
    sWidth = iWidth;
  }

  if(iColor !== undefined && iColor !== null){
    sColor = iColor;
  }

  if(bColor !== undefined && bColor !== null){
    kColor = bColor;
  }

  return (
    <Svg width={sWidth} height={sHeight} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M31.559 63.0853C48.9885 63.0853 63.118 48.9632 63.118 31.5426C63.118 14.1221 48.9885 0 31.559 0C14.1294 0 0 14.1221 0 31.5426C0 48.9632 14.1294 63.0853 31.559 63.0853Z" fill={kColor}/>
      <Path d="M43.2844 35.6432C42.6046 35.6432 41.9006 35.4734 41.2452 35.1094L22.5768 24.4577C20.6104 23.3416 19.9307 20.8425 21.0474 18.8771C22.1641 16.9118 24.6646 16.2324 26.6309 17.3485L45.2993 28.0002C47.2657 29.1163 47.9454 31.6155 46.8287 33.5808C46.0761 34.891 44.6924 35.6432 43.2844 35.6432Z" fill="white"/>
      <Path d="M24.5917 46.295C23.1594 46.295 21.7757 45.5428 21.0231 44.2325C19.9064 42.2672 20.5862 39.7681 22.5525 38.6519L29.3013 34.8183C31.2677 33.7022 33.7681 34.3815 34.8848 36.3469C36.0015 38.3122 35.3218 40.8114 33.3554 41.9275L26.6066 45.7612C25.9755 46.1251 25.2957 46.295 24.5917 46.295Z" fill="white"/>
    </Svg>
  );
};
