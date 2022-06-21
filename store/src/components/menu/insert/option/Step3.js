import React, {useState,useEffect,useRef} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard, ScrollView, Animated, FlatList } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

import { ComponentDelete } from '../../../../assets/svg/delete';
import { ComponentArrowLeft3 } from '../../../../assets/svg/arrowLeft3';

const { width, height } = Dimensions.get('window');

const Step3 = ({ fnBackGroupList, fnNextStep, fnDelete, sAnimated, iNm, nData, iMaxNm, iMinNm, iMustItem }) => {
    const [animated] = useState(new Animated.Value(sAnimated));
    const done = async () => {
        if(fnNextStep !== undefined && typeof fnNextStep === "function"){
            await fnNextStep();
        }
    }
    
    const backStep = async () => {
        if(fnBackGroupList !== undefined && typeof fnBackGroupList === "function"){
            await fnBackGroupList("step2",width);
        }
    }

    const quitStep = async () => {
        if(fnDelete !== undefined && typeof fnDelete === "function"){
            await fnDelete();
        }
    }

    const animationStyles = {
        width: animated,
    };

    Animated.timing(animated, {
        toValue: width,
        duration: 1000,
        useNativeDriver: false,
    }).start();

    return (
        <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={{flex:1, backgroundColor: "#fff"}}>
            <View style={{height: height * 0.1, backgroundColor: "#fff", justifyContent: "flex-end", alignItems: "center"}}>
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#333D4B" }}>새 옵션 그룹 추가</Text>
                <TouchableOpacity onPress={quitStep} style={{position: "absolute", bottom: 0, right: "5%", height: height * 0.05, width: height * 0.05, justifyContent: "flex-end", alignItems: "center"}}>
                    <ComponentDelete iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={backStep} style={{position: "absolute", bottom: 0, left: "5%", height: height * 0.03, width: height * 0.03, justifyContent: "flex-end", alignItems: "center"}}>
                    <ComponentArrowLeft3 iHeight={height * 0.025} iWidth={height * 0.025} iColor={"#646970"}/>
                </TouchableOpacity>
            </View>
            <Animated.View style={[objectStyles.object, animationStyles]}/>
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <FlatList 
                    data={nData}
                    ListHeaderComponent={
                        <>
                            <View style={{height: height * 0.09, justifyContent: "center", marginLeft: "5%"}}>
                                <Text style={{fontSize: RFPercentage(2.4), fontWeight: '600', color: "#191F28"}}>옵션그룹 정보를 확인해 주세요.</Text>
                            </View>
                            <View style={{height: height * 0.09, justifyContent: "center", marginLeft: "5%"}}>
                                <Text style={{fontSize: RFPercentage(1.6), fontWeight: '500', color: "#4E5968", marginBottom: "2%"}}>옵션그룹명</Text>
                                <Text style={{fontSize: RFPercentage(2.1), fontWeight: '600', color: "#333D4B"}}>{iNm}</Text>
                            </View>
                            {iMustItem === "radio" ?
                                <>
                                    <View style={{height: height * 0.09, justifyContent: "center", marginLeft: "5%"}}>
                                        <Text style={{fontSize: RFPercentage(1.6), fontWeight: '500', color: "#4E5968", marginBottom: "2%"}}>필수 여부</Text>
                                        <Text style={{fontSize: RFPercentage(2.1), fontWeight: '600', color: "#333D4B"}}>옵션을 반드시 선택해야 주문이 가능해요</Text>
                                    </View>
                                    <View style={{height: height * 0.09, justifyContent: "center", marginLeft: "5%"}}>
                                        <Text style={{fontSize: RFPercentage(1.6), fontWeight: '500', color: "#4E5968", marginBottom: "2%"}}>필수 여부</Text>
                                        <Text style={{fontSize: RFPercentage(2.1), fontWeight: '600', color: "#333D4B"}}>최소 {iMaxNm}개</Text>
                                    </View>
                                </>
                            :
                            <>
                                    <View style={{height: height * 0.09, justifyContent: "center", marginLeft: "5%"}}>
                                        <Text style={{fontSize: RFPercentage(1.6), fontWeight: '500', color: "#4E5968", marginBottom: "2%"}}>필수 여부</Text>
                                        <Text style={{fontSize: RFPercentage(2.1), fontWeight: '600', color: "#333D4B"}}>옵션을 선택하지 않아도 주문이 가능해요</Text>
                                    </View>
                                    <View style={{height: height * 0.09, justifyContent: "center", marginLeft: "5%"}}>
                                        <Text style={{fontSize: RFPercentage(1.6), fontWeight: '500', color: "#4E5968", marginBottom: "2%"}}>필수 여부</Text>
                                        <Text style={{fontSize: RFPercentage(2.1), fontWeight: '600', color: "#333D4B"}}>최대 {iMaxNm}개</Text>
                                    </View>
                                </>
                            }
                            <View style={{height: height * 0.05, justifyContent: "center", marginLeft: "5%"}}>
                                <Text style={{fontSize: RFPercentage(1.6), fontWeight: '500', color: "#4E5968", marginBottom: "2%"}}>옵션 정보</Text>
                            </View>
                        </>
                    }
                    ListFooterComponent={
                        <View style={{height: height * 0.05 }}/>
                    }
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(data, index) => "list-" + index + Math.random()}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{height: height * 0.04, justifyContent: "center", marginLeft: "5%"}}>
                                <Text style={{fontSize: RFPercentage(2.1), fontWeight: '600', color: "#333D4B", marginBottom: "2%"}}>· {item.name} : {item.price}원</Text>
                            </View>
                        ) 
                    }}
                />
            </View>
            <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center"}}>
                <TouchableOpacity onPress={done} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>다음</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

const objectStyles = {
    object: {
        height: height * 0.03, 
        borderBottomColor: "#6490E7", 
        borderBottomWidth: 2
    },
}

export default Step3;