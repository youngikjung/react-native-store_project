import React from 'react';
import Svg, {Path, Rect, Polyline} from 'react-native-svg';

export const ComponentAppIcon = ({iHeight,iWidth,iColor}) => {
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
    <Svg width={sWidth} height={sHeight} viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M31 62C48.1208 62 62 48.1208 62 31C62 13.8792 48.1208 0 31 0C13.8792 0 0 13.8792 0 31C0 48.1208 13.8792 62 31 62Z" fill="#001E62"/>
    <Path d="M42.5177 35.03C41.85 35.03 41.1585 34.8631 40.5146 34.5054L22.1769 24.037C20.2454 22.94 19.5777 20.4839 20.6746 18.5524C21.7716 16.6208 24.2277 15.9531 26.1592 17.0501L44.497 27.5185C46.4285 28.6154 47.0962 31.0716 45.9993 33.0031C45.26 34.2908 43.9008 35.03 42.5177 35.03Z" fill="white"/>
    <Path d="M24.1562 45.4985C22.7493 45.4985 21.3901 44.7593 20.6508 43.4716C19.5539 41.5401 20.2216 39.0839 22.1531 37.987L28.7824 34.2193C30.7139 33.1224 33.1701 33.7901 34.267 35.7216C35.3639 37.6531 34.6962 40.1093 32.7647 41.2062L26.1354 44.9739C25.5154 45.3316 24.8478 45.4985 24.1562 45.4985Z" fill="white"/>
    </Svg>
  );
};
