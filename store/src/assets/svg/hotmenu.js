import React from 'react';
import Svg, {Path, Rect, G, LinearGradient, Stop, RadialGradient, ClipPath} from 'react-native-svg';

export const ComponentHotMenu = ({iHeight,iWidth,iColor}) => {
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
    <Svg width={sWidth} height={sHeight} viewBox="0 0 27 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M4.25586 12.075H1.25586C0.703575 12.075 0.255859 12.5227 0.255859 13.075V20.49C0.255859 21.0423 0.703575 21.49 1.25586 21.49H4.25586C4.80814 21.49 5.25586 21.0423 5.25586 20.49V13.075C5.25586 12.5227 4.80814 12.075 4.25586 12.075Z" fill="#4E5968"/>
    <Path d="M22.4952 13.1401C24.7512 13.1401 26.5802 11.3112 26.5802 9.05509C26.5802 6.79901 24.7512 4.97009 22.4952 4.97009C20.2391 4.97009 18.4102 6.79901 18.4102 9.05509C18.4102 11.3112 20.2391 13.1401 22.4952 13.1401Z" fill="#F44357"/>
    <Path d="M20.9209 17.56L12.0059 15.245C11.5659 15.13 11.2559 14.73 11.2559 14.275V3.82504C11.2559 3.37004 11.5659 2.97004 12.0059 2.85504L20.9209 0.540041C21.5559 0.375041 22.1759 0.85504 22.1759 1.51004V16.585C22.1759 17.24 21.5559 17.72 20.9209 17.555V17.56Z" fill="#4E5968"/>
    <Path d="M10.2559 3.05505H1.25586C0.703575 3.05505 0.255859 3.50277 0.255859 4.05505V14.0551C0.255859 14.6073 0.703575 15.0551 1.25586 15.0551H10.2559C10.8081 15.0551 11.2559 14.6073 11.2559 14.0551V4.05505C11.2559 3.50277 10.8081 3.05505 10.2559 3.05505Z" fill="#E2E5E8"/>
    </Svg>
  );
};
