import React from 'react';
import Svg, {Path, Circle} from 'react-native-svg';

export const ComponentPlusButton = ({iHeight,iWidth,iColor}) => {
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
      <Path d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12Z" stroke="white" stroke-width="2"/>
      <Path d="M15.6 11.25H8.4C7.90294 11.25 7.5 11.5858 7.5 12C7.5 12.4142 7.90294 12.75 8.4 12.75H15.6C16.0971 12.75 16.5 12.4142 16.5 12C16.5 11.5858 16.0971 11.25 15.6 11.25Z" fill="white"/>
      <Path d="M12.75 15.6V8.4C12.75 7.90294 12.4142 7.5 12 7.5C11.5858 7.5 11.25 7.90294 11.25 8.4V15.6C11.25 16.0971 11.5858 16.5 12 16.5C12.4142 16.5 12.75 16.0971 12.75 15.6Z" fill="white"/>
    </Svg>
  );
};
