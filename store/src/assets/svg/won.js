import React from 'react';
import Svg, {Path,Circle} from 'react-native-svg';

export const ComponentWon = ({iHeight,iWidth,iColor}) => {
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
    <Svg width={sWidth} height={sHeight} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path fill-rule="evenodd" clip-rule="evenodd" d="M4 11.0002C4 10.448 4.44772 10.0002 5 10.0002H8C8.55228 10.0002 9 10.448 9 11.0002C9 11.5525 8.55228 12.0002 8 12.0002H5C4.44772 12.0002 4 11.5525 4 11.0002Z" fill="#525C68"/>
    <Path fill-rule="evenodd" clip-rule="evenodd" d="M18 11.0002C18 10.448 17.5523 10.0002 17 10.0002H14C13.4477 10.0002 13 10.448 13 11.0002C13 11.5525 13.4477 12.0002 14 12.0002H17C17.5523 12.0002 18 11.5525 18 11.0002Z" fill="#525C68"/>
    <Path fill-rule="evenodd" clip-rule="evenodd" d="M6.68404 7.05159C7.20799 6.87694 7.77431 7.1601 7.94895 7.68404L9.00027 10.838L10.0516 7.68404C10.2262 7.1601 10.7926 6.87694 11.3165 7.05159C11.8404 7.22624 12.1236 7.79256 11.949 8.3165L9.94895 14.3165C9.81284 14.7248 9.4307 15.0003 9.00027 15.0003C8.56984 15.0003 8.1877 14.7248 8.05159 14.3165L6.05159 8.3165C5.87694 7.79256 6.1601 7.22624 6.68404 7.05159Z" fill="#525C68"/>
    <Path fill-rule="evenodd" clip-rule="evenodd" d="M15.316 7.05159C14.792 6.87694 14.2257 7.1601 14.051 7.68404L12.9997 10.838L11.9484 7.68404C11.7738 7.1601 11.2074 6.87694 10.6835 7.05159C10.1596 7.22624 9.8764 7.79256 10.051 8.3165L12.051 14.3165C12.1872 14.7248 12.5693 15.0003 12.9997 15.0003C13.4302 15.0003 13.8123 14.7248 13.9484 14.3165L15.9484 8.3165C16.1231 7.79256 15.8399 7.22624 15.316 7.05159Z" fill="#525C68"/>
    <Path fill-rule="evenodd" clip-rule="evenodd" d="M11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11C20 10.4477 20.4477 10 21 10C21.5523 10 22 10.4477 22 11C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11C0 4.92487 4.92487 0 11 0C14.5994 0 17.7951 1.7299 19.8003 4.39942C20.132 4.84101 20.0429 5.46788 19.6013 5.79957C19.1597 6.13126 18.5329 6.04217 18.2012 5.60058C16.5575 3.41232 13.9438 2 11 2Z" fill="#6490E7"/>
    <Path fill-rule="evenodd" clip-rule="evenodd" d="M19 1C19.5523 1 20 1.44772 20 2V5C20 5.55228 19.5523 6 19 6C18.4477 6 18 5.55228 18 5V2C18 1.44772 18.4477 1 19 1Z" fill="#6490E7"/>
    <Path fill-rule="evenodd" clip-rule="evenodd" d="M15.5 5C15.5 4.44772 15.9477 4 16.5 4H19C19.5523 4 20 4.44772 20 5C20 5.55228 19.5523 6 19 6H16.5C15.9477 6 15.5 5.55228 15.5 5Z" fill="#6490E7"/>
    </Svg>
  );
};
