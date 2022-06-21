import React from 'react';
import Svg, {Path} from 'react-native-svg';

export const ComponentSliderToggle = ({iHeight,iWidth,iColor}) => {
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
    <Svg width={sWidth} height={sHeight} viewBox="0 0 21 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M4.8 1.5H16.2C18.0225 1.5 19.5 2.97746 19.5 4.8V35.2C19.5 37.0225 18.0225 38.5 16.2 38.5H4.8C2.97746 38.5 1.5 37.0225 1.5 35.2V4.8C1.5 2.97746 2.97746 1.5 4.8 1.5Z" fill="white" stroke="#6490E8"/>
    <Path d="M16.2001 1.2375H4.80005C2.83253 1.2375 1.23755 2.83248 1.23755 4.8V35.2C1.23755 37.1675 2.83253 38.7625 4.80005 38.7625H16.2001C18.1676 38.7625 19.7626 37.1675 19.7626 35.2V4.8C19.7626 2.83248 18.1676 1.2375 16.2001 1.2375Z" stroke="#6490E8"/>
    <Path d="M10.5 24.0375L7.17495 18.3375H13.825L10.5 24.0375Z" fill="#6490E8"/>
    </Svg>
    
  );
};
