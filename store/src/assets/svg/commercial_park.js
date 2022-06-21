import React from 'react';
import Svg, {Path, Circle} from 'react-native-svg';

export const ComponentCommercialPark = ({iHeight,iWidth,iColor}) => {
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
    <Svg height={sHeight} width={sWidth} viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M2.25 9.5C2.25 5.77208 5.27208 2.75 9 2.75C12.7279 2.75 15.75 5.77208 15.75 9.5C15.75 13.2279 12.7279 16.25 9 16.25C5.27208 16.25 2.25 13.2279 2.25 9.5Z" stroke="#2F2F2F" stroke-width="1.5"/>
    <Path d="M6.75 12.5623C6.75 12.8729 7.00184 13.1248 7.3125 13.1248C7.62316 13.1248 7.875 12.8729 7.875 12.5623L7.875 10.3H9.30876C10.8971 10.3 11.75 9.34637 11.75 8.0267C11.75 6.71373 10.9072 5.75 9.32555 5.75H6.75V12.5623ZM7.875 9.28257V6.78425H9.13751C10.071 6.78425 10.4874 7.29466 10.4874 8.0267C10.4874 8.75873 10.071 9.28257 9.14087 9.28257H7.875Z" fill="#2F2F2F"/>
    </Svg>
  );
};
