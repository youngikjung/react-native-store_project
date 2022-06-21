import React from 'react';
import Svg, {Path, Circle} from 'react-native-svg';

export const ComponentMenuLine = ({iHeight,iWidth,iColor}) => {
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
    <Svg height={sHeight} width={sWidth} viewBox="0 0 15 3" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Circle cx="1.5" cy="1.5" r="1.5" fill="#333D4B"/>
    <Circle cx="7.5" cy="1.5" r="1.5" fill="#333D4B"/>
    <Circle cx="13.5" cy="1.5" r="1.5" fill="#333D4B"/>
    </Svg>
  );
};
