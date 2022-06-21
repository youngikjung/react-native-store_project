import React from 'react';
import Svg, {Path,Polyline} from 'react-native-svg';

export const ComponentRefresh = ({iHeight,iWidth,iColor}) => {
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
      <Path fill-rule="evenodd" clip-rule="evenodd" d="M11.9998 4C14.2098 4 16.1998 4.9 17.6498 6.35L19.9998 4V11H12.9998L16.2198 7.78C15.1398 6.69 13.6598 6 11.9998 6C8.68977 6 5.99977 8.69 5.99977 12C5.99977 15.31 8.68977 18 11.9998 18C14.3737 18 16.425 16.6185 17.3936 14.6153C17.538 14.2405 17.9015 13.9746 18.3271 13.9746C18.8794 13.9746 19.3271 14.4223 19.3271 14.9746C19.3271 15.1675 19.2725 15.3477 19.1779 15.5004C17.8831 18.1642 15.1646 20 11.9998 20C7.57977 20 4.00977 16.42 4.00977 12C4.00977 7.58 7.57977 4 11.9998 4Z" fill="#6490E8"/>
    </Svg>
    
  );
};
