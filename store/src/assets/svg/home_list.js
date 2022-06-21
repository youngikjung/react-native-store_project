import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const ComponentHomeList = ({iHeight,iWidth,iColor}) => {
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
      <Path d="M16.8213 4.48625H14.0783C13.9275 4.05171 13.6487 3.67557 13.2801 3.40955C12.9115 3.14353 12.4713 3.00073 12.0201 3.00073C11.5688 3.00073 11.1286 3.14353 10.76 3.40955C10.3915 3.67557 10.1126 4.05171 9.96183 4.48625H7.18271C6.60407 4.4868 6.04929 4.722 5.64022 5.14011C5.23116 5.55823 5.00124 6.12507 5.00098 6.71623V18.7708C5.00177 19.3618 5.23185 19.9283 5.6408 20.3463C6.04976 20.7643 6.60423 20.9996 7.18271 21.0007H16.8213C17.3995 20.9994 17.9536 20.7639 18.3622 20.3459C18.7707 19.9279 19.0004 19.3615 19.001 18.7708V6.71623C19.0004 6.1255 18.7707 5.55911 18.3622 5.14112C17.9536 4.72312 17.3995 4.48761 16.8213 4.48625Z" stroke={sColor} strokeWidth="2"/>
      <Path d="M8.25 4.75V7.75C8.25 8.30228 8.69772 8.75 9.25 8.75H14.75C15.3023 8.75 15.75 8.30228 15.75 7.75V4.75" stroke={sColor} strokeWidth="2"/>
    </Svg>
  );
};
