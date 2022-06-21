import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard, ScrollView, Animated } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

import { ComponentDelete } from '../../../../assets/svg/delete';
import { ComponentQuestionMark } from '../../../../assets/svg/question_mark';
import { ComponentArrowLeft3 } from '../../../../assets/svg/arrowLeft3';
import { ComponentSelectedCircle } from '../../../../assets/svg/selectedCircle';
import { ComponentUnSelectedCircle } from '../../../../assets/svg/unselectedCircle';
import { ComponentArrowDown1 } from '../../../../assets/svg/arrow_down1';

import { CompModalAboutOptionGroup } from '../../../modal/ModalContents';

const { width, height } = Dimensions.get('window');

const Step1 = ({ fnNextStep, fnDelete, iNm, sAnimated, oProps, iMaxNm, iMinNm, iMustItem }) => {
    const iMinList = [];
    for (let i = 1; i < 11 ; i++) {
        iMinList.push({
            key: i,
            value: i,
            name: `${i} 개`
        });
    };

    const [minCount, setMinCount] = useState(false);
    const [maxCount, setMaxCount] = useState(false);

    const [mustItem, setMustItem] = useState("radio");
    const [sMaxNm, setMaxNm] = useState(1);
    const [sMinNm, setMinNm] = useState(1);
    const [textMaxNm, setTextMaxNm] = useState("1 개");
    const [sNm, setNm] = useState("");
    const [errNmColor, setErrNmColor] = useState("#EFF0F6");
    const [errNmText, setErrNmText] = useState("");
    const [iData, setData] = useState([]);

    const [textInputType, setTextInputType] = useState("");

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const [animated] = useState(new Animated.Value(sAnimated));

    const onChangeNm = text => {
        setNm(text);
        setErrNmColor("#6490E7");
        setErrNmText("");
    };

    const activeNmText = () => {
        setErrNmColor("#6490E7");
        setTextInputType("nm");
    };

    const unactiveNmText = () => {
        setErrNmColor("#EFF0F6");
        setTextInputType("");
        Keyboard.dismiss();
    };

    const onChangeMax = async () => {
        setMinCount(false);
        setMaxCount(true);
    }

    const onChangeMaxCount = async (sIndex) => {
        setMinCount(false);
        setMaxCount(false);
        setMaxNm(sIndex.value);
        setTextMaxNm(sIndex.name);
    }

    const onChangeType = async (sIndex) => {
        setMustItem(sIndex);
        setMinCount(false);
        setMaxCount(false);
        setMaxNm(1);
        setMinNm(1);
        setTextMaxNm("1개");
    }

    const done = async () => {
        if(sNm !== ""){
            if(fnNextStep !== undefined && typeof fnNextStep === "function"){
                await fnNextStep(sNm,mustItem,sMaxNm,sMinNm);
            }
        } else {
            Keyboard.dismiss();
            setErrNmColor("#EF4452");
            setErrNmText("옵션그룹명을 입력해주세요.");
        }
    }
    
    const onKeyboardDidShow = (e) => {
        setKeyboardHeight(e.endCoordinates.height);
    }

    const quitStep = async () => {
        if(fnDelete !== undefined && typeof fnDelete === "function"){
            await fnDelete();
        }
    }

    const animationStyles = {
        width: animated,
    };

    const openAboutMenuGroup = () => {
        oProps.appManager.showModal(
            true,
            <CompModalAboutOptionGroup
                fnClose={() => oProps.appManager.hideModal()}
            />, 
            "custom"
        );
    }

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    }, []);

    useEffect(() => {
        if(iNm !== undefined && iMustItem !== undefined && iMaxNm !== undefined && iMinNm !== undefined){
            setNm(iNm);
            setMustItem(iMustItem);
            setMaxNm(iMaxNm);
            setMinNm(iMinNm);
            setTextMaxNm(iMaxNm.toString() + "개");
        }
    }, [iNm,iMaxNm,iMinNm,iMustItem]);

    Animated.timing(animated, {
        toValue: width * 0.33,
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
            </View>
            <Animated.View style={[objectStyles.object, animationStyles]}/>
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <View style={{height: height * 0.18, alignItems: "center"}}>
                    <View style={{height: height * 0.07, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>옵션그룹명</Text>
                    </View>
                    <TextInput
                        placeholder="예) 맛 선택"
                        placeholderTextColor="#919AA7"
                        returnKeyType="done"
                        onChangeText={text => onChangeNm(text)}
                        onFocus={() => activeNmText()}
                        onBlur={() => unactiveNmText()}
                        onSubmitEditing={() => addPage()}
                        value={sNm}
                        style={{
                            width: "90%",
                            height: height * 0.06,
                            fontSize: RFPercentage(2),
                            borderColor: errNmColor,
                            borderWidth: 1,
                            fontWeight: '500',
                            paddingLeft: "5%",
                            backgroundColor: '#FAFAFB',
                            borderRadius: 5,
                            color: "#000"
                        }}
                    />
                    <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{errNmText}</Text>
                    </View>
                </View>
                {textInputType === "" &&
                <>
                    <View style={{height: height * 0.18}}>
                        <TouchableOpacity onPress={openAboutMenuGroup} style={{height: height * 0.05, width, alignItems: "center", marginLeft: "5%", flexDirection: "row"}}>
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>필수 여부</Text>
                            <ComponentQuestionMark iHeight={height * 0.02} iWidth={width * 0.08} iColor={"#6B7583"}/>
                        </TouchableOpacity>
                        <View style={{height: height * 0.1, width, justifyContent: "flex-start", marginLeft: "5%"}}>
                            <TouchableOpacity onPress={() => onChangeType("radio")} style={{height: height * 0.05, width, alignItems: "center", flexDirection: "row"}}>
                                {mustItem === "radio" ?
                                    <ComponentSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                :
                                    <ComponentUnSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                }
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#333D4B", marginLeft: "2%" }}> 옵션을 반드시 선택해야 주문이 가능해요</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onChangeType("checkbox")} style={{height: height * 0.05, width, alignItems: "center", flexDirection: "row"}}>
                                {mustItem === "radio" ?
                                    <ComponentUnSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                :
                                    <ComponentSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                }
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#333D4B", marginLeft: "2%" }}> 옵션을 선택하지 않아도 주문이 가능해요</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{height: height * 0.18}}>
                        <View style={{height: height * 0.07, width, alignItems: "center", marginLeft: "5%", flexDirection: "row"}}>
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>선택 가능한 옵션 수</Text>
                        </View>
                        <View style={{height: height * 0.1, width: "90%", flexDirection: "row", marginLeft: "5%"}}>
                            {mustItem === "radio" ?
                                <View style={{height: "70%", width: "11%", justifyContent: "center"}}>
                                    <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#6B7583" }}>최소</Text>
                                </View>
                            :
                                <View style={{height: "70%", width: "11%", justifyContent: "center"}}>
                                    <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#6B7583" }}>최대</Text>
                                </View>
                            }
                            <TouchableOpacity onPress={onChangeMax} style={{height: "60%", width: "25%", backgroundColor: "#FAFAFB", borderRadius: 5, borderWidth: 1, borderColor: "#EFF0F6", alignItems: "center", justifyContent: "space-between", flexDirection: "row", paddingLeft: "5%", paddingRight: "5%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>{textMaxNm}</Text>
                                <ComponentArrowDown1 iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                            </TouchableOpacity>
                            {maxCount &&
                                <ScrollView style={{position: "absolute", left: "11%", top: 0, width: "25%", minHeight: height * 0.07, maxHeight: height * 0.25, backgroundColor: "#E5E7EA", borderRadius: 5, zIndex: 100}}>
                                    {iMinList.map((item,index) => {
                                        return (
                                            <TouchableOpacity key={index} onPress={() => onChangeMaxCount(item)} style={{ height: height * 0.07, width: "100%", alignItems: "center", justifyContent: "space-between", flexDirection: "row", paddingLeft: "20%", borderBottomColor: "#fff",  borderBottomWidth: 1}}>
                                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>{item.name}</Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </ScrollView>
                            }
                            <View style={{height: "70%", width: "60%", justifyContent: "center", marginLeft: "3%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>의 옵션을 고객이 선택할 수 있어요.</Text>
                            </View>
                        </View>
                    </View>
                </>
                }
                {textInputType === "nm" &&
                    <TouchableOpacity activeOpacity={0.8} onPress={() => unactiveNmText()} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.42}}>
                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                    </TouchableOpacity>
                }
            </View>
            {textInputType === "" &&
                <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center"}}>
                    <TouchableOpacity onPress={done} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>다음</Text>
                    </TouchableOpacity>
                </View>
            }
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

export default Step1;