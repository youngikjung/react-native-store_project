import React from 'react';
import Svg, {Path, Circle} from 'react-native-svg';

export const ComponentWon1 = ({iHeight,iWidth,iColor}) => {
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
    <Svg height={sHeight} width={sWidth} viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path fill-rule="evenodd" clip-rule="evenodd" d="M0 4C0 3.44772 0.447715 3 1 3H4C4.55228 3 5 3.44772 5 4C5 4.55228 4.55228 5 4 5H1C0.447715 5 0 4.55228 0 4Z" fill="#525C68"/>
      <Path fill-rule="evenodd" clip-rule="evenodd" d="M14 4C14 3.44772 13.5523 3 13 3H10C9.44772 3 9 3.44772 9 4C9 4.55228 9.44772 5 10 5H13C13.5523 5 14 4.55228 14 4Z" fill="#525C68"/>
      <Path fill-rule="evenodd" clip-rule="evenodd" d="M2.68404 0.051588C3.20799 -0.12306 3.77431 0.1601 3.94895 0.684044L5.00027 3.83799L6.05159 0.684044C6.22624 0.1601 6.79256 -0.12306 7.3165 0.051588C7.84044 0.226236 8.1236 0.792556 7.94895 1.3165L5.94895 7.3165C5.81284 7.72484 5.4307 8.00027 5.00027 8.00027C4.56984 8.00027 4.1877 7.72484 4.05159 7.3165L2.05159 1.3165C1.87694 0.792556 2.1601 0.226236 2.68404 0.051588Z" fill="#525C68"/>
      <Path fill-rule="evenodd" clip-rule="evenodd" d="M11.316 0.051588C10.792 -0.12306 10.2257 0.1601 10.051 0.684044L8.99973 3.83799L7.94841 0.684044C7.77376 0.1601 7.20744 -0.12306 6.6835 0.051588C6.15956 0.226236 5.8764 0.792556 6.05105 1.3165L8.05105 7.3165C8.18716 7.72484 8.5693 8.00027 8.99973 8.00027C9.43016 8.00027 9.8123 7.72484 9.94841 7.3165L11.9484 1.3165C12.1231 0.792556 11.8399 0.226236 11.316 0.051588Z" fill="#525C68"/>
    </Svg>
  );
};
