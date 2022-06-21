import React from 'react';
import Svg, {Path, Circle} from 'react-native-svg';

export const Componentbag = ({iHeight,iWidth,iColor}) => {
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
    // <Svg height={sHeight} width={sWidth} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    // <Path d="M1 8H19" stroke="#6490E7" strokeLinecap="round"/>
    // <Path d="M2.5 8L4.5 18H15.5L17.5 8" stroke="#6490E7" strokeLinecap="round" strokeLinejoin="round"/>
    // <Path d="M15 8C15 5.23858 12.7614 3 10 3C7.23858 3 5 5.23858 5 8" stroke="#6490E7"/>
    // <Path d="M13 11L12.5 15" stroke="#6490E7" strokeLinecap="round"/>
    // <Path d="M7 11L7.5 15" stroke="#6490E7" strokeLinecap="round"/>
    // </Svg>


    <Svg height={sHeight} width={sWidth} viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M17 6H3L5 16H15L17 6Z" fill="#fff"/>
      <Path d="M1 6H19" stroke="#fff" strokeLinecap="round"/>
      <Path d="M2.5 6L4.5 16H15.5L17.5 6" stroke="#fff" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M15 6C15 3.23858 12.7614 1 10 1C7.23858 1 5 3.23858 5 6" stroke="#fff"/>
      <Path d="M13 9L12.5 13" stroke="#001E62" strokeLinecap="round"/>
      <Path d="M7 9L7.5 13" stroke="#001E62" strokeLinecap="round"/>
    </Svg>
  );
};
