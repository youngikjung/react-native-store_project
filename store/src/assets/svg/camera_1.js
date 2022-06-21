import React from 'react';
import Svg, {Path, Rect, Polyline} from 'react-native-svg';

export const ComponentCamera1 = ({iHeight,iWidth,iColor}) => {
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
    <Svg width={sWidth} height={sHeight} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Rect width="28" height="28" rx="6" fill="#D5D4DA"/>
      <Path d="M16.903 15.5427C16.903 17.1435 15.6008 18.4457 14 18.4457C12.3992 18.4457 11.0975 17.1435 11.0975 15.5427C11.0975 13.9419 12.3992 12.6397 14 12.6397C15.6008 12.6397 16.903 13.9424 16.903 15.5427ZM23 11.4206V19.6658C23 20.765 22.1088 21.6562 21.0096 21.6562H6.99038C5.89119 21.6562 5 20.765 5 19.6658V11.4206C5 10.3214 5.89119 9.43025 6.99038 9.43025H9.43855V8.74158C9.43855 7.77973 10.2178 7 11.1801 7H16.8199C17.7822 7 18.5615 7.77973 18.5615 8.74158V9.42976H21.0096C22.1088 9.43025 23 10.3214 23 11.4206ZM18.3958 15.5427C18.3958 13.1189 16.4238 11.147 14 11.147C11.5767 11.147 9.60474 13.1189 9.60474 15.5427C9.60474 17.9665 11.5767 19.9385 14 19.9385C16.4238 19.9385 18.3958 17.9665 18.3958 15.5427Z" fill="#454251"/>
    </Svg>
  );
};
