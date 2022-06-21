import React from 'react';
import Svg, {Path, Rect, G, LinearGradient, Stop, RadialGradient, ClipPath} from 'react-native-svg';

export const ComponentStoreManage = ({iHeight,iWidth,iColor}) => {
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
    <Svg width={sWidth} height={sHeight} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M47.5 0H12.5C5.59644 0 0 5.59644 0 12.5V47.5C0 54.4036 5.59644 60 12.5 60H47.5C54.4036 60 60 54.4036 60 47.5V12.5C60 5.59644 54.4036 0 47.5 0Z" fill="#FFE69B"/>
    <Path d="M39 22.15H21C19.3431 22.15 18 23.4932 18 25.15V38.575C18 40.2319 19.3431 41.575 21 41.575H39C40.6569 41.575 42 40.2319 42 38.575V25.15C42 23.4932 40.6569 22.15 39 22.15Z" fill="#FFB031"/>
    <Path d="M42.6106 26.9999H17.3906C16.7006 26.9999 16.2156 26.3149 16.4506 25.6649L18.8056 19.0899C18.9456 18.6949 19.3256 18.4299 19.7456 18.4299H40.2456C40.6656 18.4299 41.0456 18.6949 41.1856 19.0899L43.5406 25.6649C43.7756 26.3149 43.2906 26.9999 42.6006 26.9999H42.6106Z" fill="#FFCF58"/>
    <Path d="M27.5551 32.955H32.4501C32.9201 32.955 33.3001 33.335 33.3001 33.805V41.91H26.7051V33.805C26.7051 33.335 27.0851 32.955 27.5551 32.955Z" fill="white"/>
    <Path d="M33.8393 41.575H26.1543V42.7999H33.8393V41.575Z" fill="#FFE69B"/>
    </Svg>
  );
};
