import React from 'react';
import Svg, {LinearGradient, Rect, Stop, ClipPath, Path, G} from 'react-native-svg';

export const ComponentSliderRail = ({iHeight,iWidth,iColor}) => {
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
    <Svg width={sWidth} height={sHeight} viewBox="0 0 296 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#clip0_2073:30697)">
      <Path d="M14 0.500049H282C285.58 0.500049 289.014 1.92229 291.546 4.45403C294.078 6.98577 295.5 10.4196 295.5 14C295.497 17.5797 294.074 21.0119 291.543 23.543C289.012 26.0742 285.58 27.4974 282 27.5H14C10.4196 27.5 6.98585 26.0777 4.45411 23.5459C1.92236 21.0142 0.500004 17.5805 0.500004 14C0.498689 12.2268 0.847177 10.4707 1.52515 8.8322C2.20312 7.19371 3.19732 5.70495 4.45118 4.4511C5.70503 3.19725 7.19379 2.20292 8.83228 1.52495C10.4708 0.846979 12.2268 0.498735 14 0.500049Z" fill="url(#paint0_linear_2073:30697)"/>
      <G opacity="0.5">
      <Path opacity="0.5" d="M11 1H10V27H11V1Z" fill="#6490E8"/>
      <Path opacity="0.5" d="M22 1H21V27H22V1Z" fill="#6490E8"/>
      <Path opacity="0.5" d="M33 1H32V27H33V1Z" fill="#6490E8"/>
      <Path opacity="0.5" d="M55 1H54V27H55V1Z" fill="#6490E8"/>
      <Path opacity="0.5" d="M77 1H76V27H77V1Z" fill="#6490E8"/>
      <Path opacity="0.5" d="M99 1H98V27H99V1Z" fill="#6490E8"/>
      <Path opacity="0.5" d="M121 1H120V27H121V1Z" fill="#6490E8"/>
      <Path opacity="0.5" d="M143 1H142V27H143V1Z" fill="#6490E8"/>
      <Path opacity="0.5" d="M165 1H164V27H165V1Z" fill="#6490E8"/>
      <Path opacity="0.5" d="M187 1H186V27H187V1Z" fill="#6490E8"/>
      <Path opacity="0.5" d="M209 1H208V27H209V1Z" fill="#6490E8"/>
      <Path opacity="0.5" d="M231 1H230V27H231V1Z" fill="#6490E8"/>
      <Path opacity="0.5" d="M253 1H252V27H253V1Z" fill="#6490E8"/>
      <Path opacity="0.5" d="M275 1H274V27H275V1Z" fill="#6490E8"/>
      <Path opacity="0.5" d="M44 1H43V27H44V1Z" fill="#6490E8"/>
      <Path opacity="0.5" d="M66 1H65V27H66V1Z" fill="#6490E8"/>
      <Path opacity="0.5" d="M88 1H87V27H88V1Z" fill="#6490E8"/>
      <Path opacity="0.5" d="M110 1H109V27H110V1Z" fill="#6490E8"/>
      <Path opacity="0.5" d="M132 1H131V27H132V1Z" fill="#6490E8"/>
      <Path opacity="0.5" d="M154 1H153V27H154V1Z" fill="#6490E8"/>
      <Path opacity="0.5" d="M176 1H175V27H176V1Z" fill="#6490E8"/>
      <Path opacity="0.5" d="M198 1H197V27H198V1Z" fill="#6490E8"/>
      <Path opacity="0.5" d="M220 1H219V27H220V1Z" fill="#6490E8"/>
      <Path opacity="0.5" d="M242 1H241V27H242V1Z" fill="#6490E8"/>
      <Path opacity="0.5" d="M264 1H263V27H264V1Z" fill="#6490E8"/>
      <Path opacity="0.5" d="M286 1H285V27H286V1Z" fill="#6490E8"/>
      </G>
      <Path d="M282 28H14C10.287 28 6.7261 26.525 4.10059 23.8995C1.47508 21.274 0 17.7131 0 14C0 10.287 1.47508 6.72602 4.10059 4.10051C6.7261 1.475 10.287 4.57764e-05 14 4.57764e-05H282C285.713 4.57764e-05 289.274 1.475 291.9 4.10051C294.525 6.72602 296 10.287 296 14C296 17.7131 294.525 21.274 291.9 23.8995C289.274 26.525 285.713 28 282 28ZM14 1.00005C10.5522 1.00005 7.24559 2.36969 4.80762 4.80766C2.36964 7.24564 1 10.5522 1 14C1 17.4479 2.36964 20.7545 4.80762 23.1924C7.24559 25.6304 10.5522 27 14 27H282C285.448 27 288.754 25.6304 291.192 23.1924C293.63 20.7545 295 17.4479 295 14C295 10.5522 293.63 7.24564 291.192 4.80766C288.754 2.36969 285.448 1.00005 282 1.00005H14Z" fill="#DFDFE3"/>
      </G>
      <LinearGradient id="paint0_linear_2073:30697" x1="-1.18" y1="14" x2="297.33" y2="14" gradientUnits="userSpaceOnUse">
      <Stop stopColor="#2459C1"/>
      <Stop offset="1" stopColor="#617BE3"/>
      </LinearGradient>
      <ClipPath id="clip0_2073:30697">
      <Rect width={sWidth} height={sHeight} fill="white"/>
      </ClipPath>
    </Svg>
  );
};
