import React, { useCallback } from 'react';
import { View, Dimensions, Text, Alert } from 'react-native';
import Slider from 'rn-range-slider';
import {RFPercentage} from 'react-native-responsive-fontsize';

import { ComponentSliderToggle } from '../../assets/svg/slider_toggle';
import { ComponentSliderRail } from '../../assets/svg/slider_rail';

const { width, height } = Dimensions.get('window');
const SliderScreen = ({ sValue, fnSelect, fnSelected }) => {
  const renderThumb = useCallback(() => {
    return (
      <ComponentSliderToggle iHeight={height * 0.06} iWidth={width * 0.08} />
    )
  }, []);
  const renderRail = useCallback(() => {
    return (
      <View style={{height: height * 0.03, backgroundColor: sValue ? "#2F2F2F" : "#F1F3F7", width : width * 0.85, borderRadius: 20}} />
    )
  }, []);
  const renderRailSelected = useCallback(() => {
    return (
      <View style={{height: height * 0.03, backgroundColor: sValue ? "#2F2F2F" : "#6490E8", borderRadius: 20}} />
    )
  }, []);
  const renderLabel = useCallback(value => {
    return (
      <View style={{ width: width * 0.08, backgroundColor: sValue ? "#2F2F2F" : "#6490E8", height: height * 0.03, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
        <Text style={{color: "#fff", fontWeight: "600", fontSize: RFPercentage(1.6) }}>{value} 분</Text>
      </View>
    )
  }, []);
  const renderNotch = useCallback(() => {
    return null
  }, []);
  const handleValueChange = useCallback( async (low, high) => {
    if(fnSelect !== undefined && typeof fnSelect === "function"){
      await fnSelect(low);
    }
  }, []);
  const endHandleValueChange = useCallback( async (low, high) => {
    if(fnSelected !== undefined && typeof fnSelected === "function"){
      await fnSelected(low);
    }
  }, []);

  return (
    <>
      <View style={{height : height * 0.09, position: "absolute", zIndex: 1, top: 0, left: 0, right: 0, bottom: 0, marginTop: "1%"}}>
        <View style={{flex:1, flexDirection: "row", justifyContent: "space-between", marginLeft: "10%", marginRight: "3%", alignItems: "center", marginTop: "7%"}}>
            <Text style={{fontWeight: "400", fontSize: RFPercentage(1.2), color: "#111"}}>5분</Text>
            <Text style={{fontWeight: "400", fontSize: RFPercentage(1.2), color: "#111", paddingRight: "1%"}}>30분</Text>
            <Text style={{fontWeight: "400", fontSize: RFPercentage(1.2), color: "#111", paddingLeft: "5%"}}>59분</Text>
        </View>
      </View>
      <View style={{flex:1, position: "absolute", zIndex: 5, top: 0, left: 0, right: 0, bottom: 0, marginHorizontal: "-6%"}}>
        <Slider
          style={{marginLeft: "5%", marginRight: "5%"}}
          disabled={sValue}
          min={0}
          max={59}
          step={1}
          disableRange={true}
          floatingLabel={true}
          renderThumb={renderThumb}
          renderRail={renderRail}
          renderRailSelected={renderRailSelected}
          renderLabel={renderLabel}
          renderNotch={renderNotch}
          onValueChanged={handleValueChange}
          onTouchEnd={endHandleValueChange}
        />
      </View>
    </>
  )
};

export default SliderScreen;