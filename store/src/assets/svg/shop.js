import React from 'react';
import Svg, {Path, Rect, Polyline} from 'react-native-svg';

export const ComponentShop = ({iHeight,iWidth,iColor}) => {
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
    <Svg width={sWidth} height={sHeight} viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M2.39548 12.5596C2.11381 11.3091 3.06474 10.1201 4.3466 10.1201H19.6531C20.935 10.1201 21.8859 11.3091 21.6042 12.5596L19.6041 21.4396C19.3986 22.352 18.5882 23.0001 17.653 23.0001H6.34673C5.41149 23.0001 4.60112 22.352 4.39561 21.4396L2.39548 12.5596Z" fill="#4D5967"/>
      <Rect x="7.38422" y="13.7998" width="1.84615" height="6.44" rx="0.923077" fill="#D3D7E0"/>
      <Rect x="11.0767" y="13.7998" width="1.84615" height="6.44" rx="0.923077" fill="#D3D7E0"/>
      <Rect x="14.7692" y="13.7998" width="1.84615" height="6.44" rx="0.923077" fill="#D3D7E0"/>
      <Rect y="8.28027" width="24" height="3.68" rx="1.84" fill="#353E4D"/>
      <Rect width="2.76605" height="12.8949" rx="1.38302" transform="matrix(0.809949 0.586501 -0.58907 0.808082 17.7501 0)" fill="#4D5967"/>
    </Svg>
  );
};
