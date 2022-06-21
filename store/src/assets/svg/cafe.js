import React from 'react';
import Svg, {Path, Rect, Polyline} from 'react-native-svg';

export const ComponentCafe = ({iHeight,iWidth,iColor}) => {
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
    <Svg  width={sWidth} height={sHeight} viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M2.0711 7.06652C2.03262 6.48934 2.49042 6 3.06889 6H14.9311C15.5096 6 15.9674 6.48934 15.9289 7.06652L15.0622 20.0665C15.0272 20.5918 14.5909 21 14.0644 21H3.93555C3.40909 21 2.97279 20.5918 2.93777 20.0665L2.0711 7.06652Z" fill="#B6FFDF"/>
    <Path d="M2.26953 10H15.7305L15.2695 17H2.73438L2.26953 10Z" fill="#40D295"/>
    <Path d="M15.6894 2.75746C15.8472 3.38861 15.3698 4 14.7192 4L3.28078 4C2.63021 4 2.15285 3.38861 2.31063 2.75746L2.81063 0.757464C2.92193 0.312297 3.32191 8.3739e-08 3.78078 1.23854e-07L14.2192 1.03641e-06C14.6781 1.07653e-06 15.0781 0.312298 15.1894 0.757466L15.6894 2.75746Z" fill="#333D4B"/>
    <Rect y="3" width="18" height="4" rx="1" fill="#333D4B"/>
    </Svg>
  );
};
