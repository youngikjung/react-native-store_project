import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, ScrollView, Image, FlatList, Animated } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';

import { ComponentDelete } from '../../../../assets/svg/delete';
import { ComponentArrowLeft3 } from '../../../../assets/svg/arrowLeft3';

const { width, height } = Dimensions.get('window');

const Step5 = ({ oProps, fnBackGroupList, fnNextStep, fnDelete, sAnimated, iMenuData }) => {
    const [animated] = useState(new Animated.Value(sAnimated));

    const [menuData, setMenuData] = useState({});

    const done = async () => {
        if(fnNextStep !== undefined && typeof fnNextStep === "function"){
            await fnNextStep();
        }
    }

    const backStep = async () => {
        if(fnBackGroupList !== undefined && typeof fnBackGroupList === "function"){
            await fnBackGroupList("step4",width);
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

    useEffect(() => {
        setMenuData(iMenuData);
    }, [iMenuData]);

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            <View style={{height: height * 0.06, backgroundColor: "#fff", justifyContent: "flex-end", alignItems: "center"}}>
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#333D4B" }}>메뉴 추가</Text>
                <TouchableOpacity onPress={quitStep} style={{position: "absolute", bottom: 0, right: "5%", height: height * 0.05, width: height * 0.05, justifyContent: "flex-end", alignItems: "center"}}>
                    <ComponentDelete iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={backStep} style={{position: "absolute", bottom: 0, left: "5%", height: height * 0.03, width: height * 0.03, justifyContent: "flex-end", alignItems: "center"}}>
                    <ComponentArrowLeft3 iHeight={height * 0.025} iWidth={height * 0.025} iColor={"#646970"}/>
                </TouchableOpacity>
            </View>
            <View style={{ height: height * 0.03}}/>
            <Animated.View style={[objectStyles.object, animationStyles]}/>
            <ScrollView style={{flex:1, backgroundColor: "#fff"}}>
                <View style={{height : height * 0.09, justifyContent: "center", marginLeft: "5%"}}>
                    <Text style={{fontSize: RFPercentage(2.4), fontWeight: '600', color: "#191F28"}}>메뉴 정보를 확인해 주세요.</Text>
                </View>
                <View style={{height : height * 0.03, justifyContent: "flex-end", marginLeft: "5%"}}>
                    <Text style={{fontSize: RFPercentage(1.6), fontWeight: '500', color: "#4E5968"}}>메뉴명</Text>
                </View>
                <View style={{height : height * 0.05, justifyContent: "flex-start", marginLeft: "5%", marginTop: "3%"}}>
                    <Text style={{fontSize: RFPercentage(2.1), fontWeight: '600', color: "#333D4B"}}>{menuData.sNm}</Text>
                </View>
                <View style={{height : height * 0.03, justifyContent: "flex-end", marginLeft: "5%"}}>
                    <Text style={{fontSize: RFPercentage(1.6), fontWeight: '500', color: "#4E5968"}}>가격</Text>
                </View>
                <View style={{height : height * 0.05, justifyContent: "flex-start", marginLeft: "5%", marginTop: "3%"}}>
                    <Text style={{fontSize: RFPercentage(2.1), fontWeight: '600', color: "#333D4B"}}>{menuData.sOriginPrice} 원</Text>
                </View>
                <View style={{height : height * 0.03, justifyContent: "flex-end", marginLeft: "5%"}}>
                    <Text style={{fontSize: RFPercentage(1.6), fontWeight: '500', color: "#4E5968"}}>할인가격</Text>
                </View>
                {menuData.sPrice !== "" ?
                    <View style={{height : height * 0.05, justifyContent: "flex-start", marginLeft: "5%", marginTop: "3%"}}>
                        <Text style={{fontSize: RFPercentage(2.1), fontWeight: '600', color: "#333D4B"}}>{menuData.sPrice} 원</Text>
                    </View>
                :
                    <View style={{height : height * 0.05, justifyContent: "flex-start", marginLeft: "5%", marginTop: "3%"}}>
                        <Text style={{fontSize: RFPercentage(2.1), fontWeight: '600', color: "#D1D5DA"}}>할인가격없음</Text>
                    </View>
                }
                <View style={{height : height * 0.03, justifyContent: "flex-end", marginLeft: "5%"}}>
                    <Text style={{fontSize: RFPercentage(1.6), fontWeight: '500', color: "#4E5968"}}>스루 온리 메뉴</Text>
                </View>
                {menuData.productType ?
                    <View style={{height : height * 0.05, justifyContent: "flex-start", marginLeft: "5%", marginTop: "3%"}}>
                        <Text style={{fontSize: RFPercentage(2.1), fontWeight: '600', color: "#333D4B"}}>설정함</Text>
                    </View>
                :
                    <View style={{height : height * 0.05, justifyContent: "flex-start", marginLeft: "5%", marginTop: "3%"}}>
                        <Text style={{fontSize: RFPercentage(2.1), fontWeight: '600', color: "#D1D5DA"}}>설정안함</Text>
                    </View>
                }
                {menuData.iStock !== "" &&
                    <>
                        <View style={{height : height * 0.03, justifyContent: "flex-end", marginLeft: "5%"}}>
                            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '500', color: "#4E5968"}}>재고</Text>
                        </View>
                        <View style={{height : height * 0.05, justifyContent: "flex-start", marginLeft: "5%", marginTop: "3%"}}>
                            <Text style={{fontSize: RFPercentage(2.1), fontWeight: '600', color: "#333D4B"}}>{menuData.iStock}</Text>
                        </View>
                    </>
                }
                {menuData.sDetail !== "" &&
                    <>
                        <View style={{height : height * 0.03, justifyContent: "flex-end", marginLeft: "5%"}}>
                            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '500', color: "#4E5968"}}>메뉴 설명</Text>
                        </View>
                        <View style={{minHeight: height * 0.05, maxHeight : height * 0.23, justifyContent: "flex-start", marginLeft: "5%", marginTop: "3%"}}>
                            <Text style={{fontSize: RFPercentage(2.1), fontWeight: '600', color: "#333D4B"}}>{menuData.sDetail}</Text>
                        </View>
                    </>
                }
                {menuData.imgUri !== "" &&
                    <>
                        <View style={{height : height * 0.03, justifyContent: "flex-end", marginLeft: "5%"}}>
                            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '500', color: "#4E5968"}}>메뉴 사진</Text>
                        </View>
                        <View style={{height : height * 0.12, justifyContent: "flex-start", marginLeft: "5%", marginTop: "3%"}}>
                            <View style={{height : height * 0.09,  width: width * 0.25}}>
                                <Image source={{uri: menuData.imgUri}} style={{height: height * 0.09, width: width * 0.25, borderRadius: 5}}/>
                            </View>
                        </View>
                    </>
                }
                <View style={{height : height * 0.03, justifyContent: "flex-end", marginLeft: "5%"}}>
                    <Text style={{fontSize: RFPercentage(1.6), fontWeight: '500', color: "#4E5968"}}>옵션</Text>
                </View>
                {menuData.sList !== undefined &&
                    <>
                        {menuData.sList.length > 0 ?
                            <>
                                {menuData.sList.map((item,index) => {
                                    return (
                                        <View key={index} style={{height : height * 0.05, justifyContent: "center", marginLeft: "5%", marginTop: "3%"}}>
                                            <Text style={{fontSize: RFPercentage(2.1), fontWeight: '600', color: "#333D4B"}}>{item.name}</Text>
                                        </View>
                                    )
                                })}
                            </>
                            :
                            <View style={{height : height * 0.12, justifyContent: "flex-start", marginLeft: "5%", marginTop: "3%"}}>
                                <Text style={{fontSize: RFPercentage(2.1), fontWeight: '600', color: "#D1D5DA"}}>등록된 옵션이 없습니다.</Text>
                            </View>
                        }
                    </>
                }
                <View style={{height : height * 0.05}} />
            </ScrollView>
            <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center"}}>
                <TouchableOpacity onPress={done} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>등록</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const objectStyles = {
    object: {
        height: height * 0.005, 
        borderBottomColor: "#6490E7", 
        borderBottomWidth: 2
    },
}

export default Step5;