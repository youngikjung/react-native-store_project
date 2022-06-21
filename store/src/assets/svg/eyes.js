import React from 'react';
import Svg, {Path, Polyline,Line} from 'react-native-svg';

export const ComponentEyes = ({iHeight,iWidth,iColor}) => {
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
    <Svg width={sWidth} height={sHeight} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M26.8503 15.5034C20.0772 6.80679 11.8974 6.85766 5.14947 15.5034H5.1497C4.9501 15.7742 4.9501 16.1433 5.1497 16.4141C11.9228 25.1107 20.1026 25.0599 26.8505 16.4141H26.8503C27.0499 16.1433 27.0499 15.7742 26.8503 15.5034ZM15.9999 21.4428C11.6722 21.4428 7.90198 17.3503 6.75081 15.9588C12.8592 8.70975 19.1611 8.73548 25.249 15.9588C24.0979 17.345 20.3277 21.4428 15.9999 21.4428Z" fill="#93939F"/>
      <Path d="M15.9999 11.5746C14.8372 11.5746 13.722 12.0366 12.8999 12.8588C12.0778 13.6809 11.6157 14.7961 11.6157 15.9587C11.8459 21.77 20.1539 21.77 20.3842 15.9587C20.3842 14.796 19.9222 13.6809 19.1 12.8588C18.2779 12.0366 17.1627 11.5746 16.0001 11.5746H15.9999ZM15.9999 18.8084C12.2349 18.6908 12.2349 13.2273 15.9999 13.1095C19.7648 13.2271 19.7648 18.6908 15.9999 18.8084Z" fill="#93939F"/>
    </Svg>
  );
};
