import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

import { ComponentArrowLeft3 } from '../../assets/svg/arrowLeft3';

const { width, height } = Dimensions.get('window');

const StepTwo = ({ fnStepPrev, fnStepNext, iBusinessType }) => {
    const [businessType, setBusinessType] = useState("personal");

    const stepPrev = async () => {
        if(fnStepPrev !== undefined && typeof fnStepPrev === "function"){
            await fnStepPrev();
        }
    }

    const access = async () => {
        if(fnStepNext !== undefined && typeof fnStepNext === "function"){
            await fnStepNext(businessType);
        }
    }

    const onChangeType = async (sIndex) => {
        setBusinessType(sIndex);
    }

    useEffect(() => {
        if(iBusinessType !== undefined){
            setBusinessType(iBusinessType);
        }
    }, [iBusinessType]);

    return (
        <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={{flex:1, backgroundColor: "#fff"}}>
            <View style={{height: height * 0.15, backgroundColor: "#fff", justifyContent: "flex-end", marginLeft: "5%"}}>
                <TouchableOpacity activeOpacity={0.8} onPress={stepPrev} style={{ height: "50%", width: "10%", justifyContent: "center", alignItems: "flex-start"}}>
                    <ComponentArrowLeft3 iHeight={height * 0.025} iWidth={width * 0.05} iColor={"#646970"}/>
                </TouchableOpacity>
            </View>
            <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>입점하는 매장이</Text>
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>법인사업자인가요? 개인사업자인가요?</Text>
            </View>
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                    <TouchableOpacity onPress={() => onChangeType("personal")} style={{ width: "43%", height: height * 0.07, backgroundColor: businessType === "personal" ? "#6490E7" : "#FAFAFB", marginRight: "5%", borderRadius: 10, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#EFF0F6"}}>
                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.8), color: businessType === "personal" ? "#fff" : "#919AA7" }}>개인사업자에요</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeType("corporate")} style={{ width: "43%", height: height * 0.07, backgroundColor: businessType !== "personal" ? "#6490E7" : "#FAFAFB", borderRadius: 10, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#EFF0F6"}}>
                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.8), color: businessType !== "personal" ? "#fff" : "#919AA7" }}>법인사업자에요</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{height: height / 7 , backgroundColor: "#fff", justifyContent: "center"}}>
                <TouchableOpacity
                    onPress={access}
                    style={{
                        height: height / 14,
                        backgroundColor: '#6490E7',
                        marginLeft: '5%',
                        marginRight: '5%',
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>다음</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

export default StepTwo;