import React from 'react';
import Svg, {Path, Circle} from 'react-native-svg';

export const ComponentArrowDown = ({iHeight,iWidth,iColor}) => {
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
    <Svg height={sHeight} width={sWidth} viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path fill-rule="evenodd" clip-rule="evenodd" d="M4.00367 5.84467C4.29892 5.55178 4.77763 5.55178 5.07288 5.84467L9.83061 10.5643L14.5883 5.84467C14.8836 5.55178 15.3623 5.55178 15.6576 5.84467C15.9528 6.13756 15.9528 6.61244 15.6576 6.90533L10.3652 12.1553C10.07 12.4482 9.59126 12.4482 9.29601 12.1553L4.00367 6.90533C3.70841 6.61244 3.70841 6.13756 4.00367 5.84467Z" fill="#2F2F2F"/>
    </Svg>
  );
};
