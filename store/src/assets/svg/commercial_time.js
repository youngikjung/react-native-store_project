import React from 'react';
import Svg, {Path, Circle} from 'react-native-svg';

export const ComponentCommercialTime = ({iHeight,iWidth,iColor}) => {
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
    <Svg height={sHeight} width={sWidth} viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path fillRule="evenodd" clipRule="evenodd" d="M9 3.5C5.70343 3.5 3 6.20343 3 9.5C3 12.7966 5.70343 15.5 9 15.5C12.2966 15.5 15 12.7966 15 9.5C15 6.20343 12.2966 3.5 9 3.5ZM9 2C4.875 2 1.5 5.375 1.5 9.5C1.5 13.625 4.875 17 9 17C13.125 17 16.5 13.625 16.5 9.5C16.5 5.375 13.125 2 9 2Z" fill="#2F2F2F"/>
    <Path fillRule="evenodd" clipRule="evenodd" d="M9.375 9.90033V6.3125C9.375 6.00184 9.12316 5.75 8.8125 5.75C8.50184 5.75 8.25 6.00184 8.25 6.3125V10.5994L11.4926 12.2428C11.772 12.3844 12.1132 12.2708 12.2519 11.9899C12.3884 11.7136 12.2773 11.3788 12.0027 11.2389L9.375 9.90033Z" fill="#2F2F2F"/>
    </Svg>
  );
};
