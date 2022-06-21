import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Dimensions, TouchableOpacity, FlatList, Keyboard, TextInput, Animated, Image, ScrollView } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import Postcode from '@actbase/react-daum-postcode';
import SelectDropdown from 'react-native-select-dropdown';
import LottieView from 'lottie-react-native';
import moment from 'moment-timezone';
import 'moment/locale/ko';

import {ComponentCircle} from '../../assets/svg/circle';
import {ComponentArrowLeft3} from '../../assets/svg/arrowLeft3';
import {ComponentCheckCircle} from '../../assets/svg/check_circle';
import { ComponentDelete } from '../../assets/svg/delete';
import { ComponentResturant } from '../../assets/svg/resturant';
import { ComponentCafe } from '../../assets/svg/cafe';
import { ComponentShop } from '../../assets/svg/shop';
import { ComponentUnSelected } from '../../assets/svg/unselected';
import { ComponentCheckBoxNone } from '../../assets/svg/checkbox_none';
import { ComponentCheckBox } from '../../assets/svg/checkbox';
import { ComponentQuestionMark } from '../../assets/svg/question_mark';
import { ComponentSelectedCircle } from '../../assets/svg/selectedCircle';
import { ComponentUnSelectedCircle } from '../../assets/svg/unselectedCircle';
import { ComponentArrowDown1 } from '../../assets/svg/arrow_down1';

import optionImg from '../../assets/img/optionseleccted.jpeg';

let startHourList = [];

const objectStyles = {
    object: {
        height: height * 0.03, 
        borderBottomColor: "#6490E7", 
        borderBottomWidth: 2
    },
}
const { width, height } = Dimensions.get('window');
const typeList = [
    { key: 1, name: "음식점" },
    { key: 2, name: "카페" },
    { key: 3, name: "샵" }
];

const subTypeList1 = [
    { key: 2, name: "카페" },
    { key: 3, name: "샵" },
    { key: 4, name: "선택안함" }
];

const subTypeList2 = [
    { key: 1, name: "음식점" },
    { key: 3, name: "샵" },
    { key: 4, name: "선택안함" }
];

const subTypeList3 = [
    { key: 1, name: "음식점" },
    { key: 2, name: "카페" },
    { key: 4, name: "선택안함" }
];
const minuteList = [];
for (let i = 0; i <24 ; i++) {
    startHourList.push({
        key: i,
        value: i > 9 ? i.toString() : "0" + i.toString(),
        name: i > 9 ? `${i}시` : `0${i}시`,
    });
};
for (let i = 0; i <12 ; i++) {
    minuteList.push({
        key: i,
        value: i > 1 ? (i * 5).toString() : "0" + (i * 5).toString(),
        name: i > 1 ? `${i * 5}분` : `0${i * 5}분`,
    });
};

const sMinList = [];
for (let i = 1; i <10 ; i++) {
    sMinList.push({
        key: i,
        value: i,
        name: `${i} 개`
    });
};

const generaterAsync = (sIndex,aIndex) => {
    let temp = [];
    let count = sIndex;
    for (let iterator = count; iterator <34 ; iterator++) {
        let tempList = {};
        if(aIndex === "endlist" || aIndex === "arrange"){
            tempList = {
                key: iterator,
                value: iterator > 9 ? iterator.toString() : "0" + iterator.toString(),
                name: iterator > 9 ? (parseInt(iterator) > 24 ? `다음날(새벽) ${parseInt(iterator) - 24}시` : `${iterator}시` ) : `0${iterator}시`,
            }
        }

        temp.push(tempList);
    };
    return temp;
}

const TypeItems = ({ sData, fnCheck }) => {
    const [sId, setId] = useState("");

    const checkOut = async () => {
        if(sId === ""){
            setId(sData.key);
            await fnCheck(sData.key,sData.name,"add");
        } else {
            setId("");
            await fnCheck(sData.key,sData.name,"");
        }
    }

    return (
        <TouchableOpacity onPress={checkOut} style={{minHeight: height * 0.05, minWidth: width * 0.19, backgroundColor: sData.key === sId ? "#6490E7" : "#F2F3F5", marginRight: "3%", borderRadius: width * 0.05, justifyContent: "center", alignItems: "center"}}>
            <Text style={{fontSize: RFPercentage(1.8), fontWeight: '500', color: sData.key === sId ? "#fff" : "#353D4A"}}>{sData.name}</Text>
        </TouchableOpacity>
    )
}

const TypeSelectedItems = ({ sData, fnCheck, iData }) => {
    const [sId, setId] = useState("");

    const checkOut = async () => {
        if(sId === ""){
            setId(sData.key);
            await fnCheck(sData.key,sData.name,"add");
        } else {
            setId("");
            await fnCheck(sData.key,sData.name,"");
        }
    }

    const asyncData = async () => {
        if(iData !== undefined && iData !== null && iData.length > 0){
            for await (const iterator of iData) {
                if(iterator.key.toString() === sData.key.toString()){
                    setId(iterator.key);
                }
            }
        }
    }

    useEffect(() => {
        asyncData();
    }, [iData]);

    return (
        <TouchableOpacity onPress={checkOut} style={{minHeight: height * 0.05, minWidth: width * 0.19, backgroundColor: sData.key === sId ? "#6490E7" : "#F2F3F5", marginRight: "3%", borderRadius: width * 0.05, justifyContent: "center", alignItems: "center"}}>
            <Text style={{fontSize: RFPercentage(1.8), fontWeight: '500', color: sData.key === sId ? "#fff" : "#353D4A"}}>{sData.name}</Text>
        </TouchableOpacity>
    )
}

const OptionGroup = ({sKey, sData, fnCheck}) => {
    const [dataList, setList] = useState({});
    const [sId, setId] = useState("");

    const checkOut = async () => {
        if(sId === ""){
            setId(dataList.id);
            await checkValue(dataList.id,dataList.name,"add");
        } else {
            setId("");
            await checkValue(dataList.id,dataList.name,"");
        }
    }

    const checkValue = async (sIndex,aIndex,xIndex) => {
        if(fnCheck !== undefined && typeof fnCheck === "function"){
            await fnCheck(sIndex,aIndex,xIndex);
        }
    }

    useEffect(() => {
        setList(sData);
    }, [sData]);

    return (
        <View key={sKey} style={{minHeight: width * 0.15, backgroundColor: "#f0f6fc", margin: "5%", width: "90%"}}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => checkOut()} style={{minHeight: width * 0.15, width: "100%", flexDirection: "row"}}>
                <View style={{flex:0.2, alignItems: "center", justifyContent: "center"}}>
                    {sId === "" ?
                        <ComponentCircle iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6490E8"}/>
                        :
                        <ComponentCheckCircle iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6490E8"}/>
                    }
                </View>
                <View style={{flex:0.8, justifyContent: "center"}}>
                    <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#000" }}>{dataList.name}</Text>
                </View> 
            </TouchableOpacity>
            {(dataList !== undefined && dataList.lists !== undefined && dataList.lists.length > 0) &&
                <>
                {dataList.lists.map((item,sIndex) => {
                    return (
                        <View key={sIndex} style={{minHeight: width * 0.1, width: "90%", borderTopColor: "#dfdfdf", borderTopWidth: 1, marginLeft: "5%", marginRight: "5%", flexDirection: "row"}}>
                            <View style={{flex:1, justifyContent: "center", alignItems: "flex-start"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#6b7684" }}>{item.name}</Text>
                            </View>
                            <View style={{flex:1, justifyContent: "center", alignItems: "flex-end"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#6b7684" }}>{item.price} 원</Text>
                            </View>
                        </View>
                    )
                })}
                </>
            }
        </View>
    )
}

const OptionGroupItem = ({ sData, fnCheck }) => {
    const [sId, setId] = useState("");

    const checkOut = async () => {
        if(sId === ""){
            setId(sData.id);
            await checkValue(sData.id,sData.name,"add",sData.lists);
        } else {
            setId("");
            await checkValue(sData.id,sData.name,"",sData.lists);
        }
    }

    const checkValue = async (sIndex,aIndex,xIndex,zIndex) => {
        if(fnCheck !== undefined && typeof fnCheck === "function"){
            await fnCheck(sIndex,aIndex,xIndex,zIndex);
        }
    }

    return (
        <>
            <TouchableOpacity onPress={() => checkOut()} style={{height: height * 0.1, backgroundColor: "#fff", marginLeft: "5%", marginRight: "5%"}}>
                <View style={{flex:1, flexDirection: "row", justifyContent: "center"}}>
                    <View style={{ height: "100%", width: "10%",  justifyContent: "center", alignItems: "center"}}>
                        {sId === "" ?
                            <ComponentCheckBoxNone iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                        :
                            <ComponentCheckBox iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                        }
                    </View>
                    <View style={{ height: "100%", width: "90%", justifyContent: "center", paddingLeft: "5%" }}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#333D4B"}}>{sData.name}</Text>
                    </View>
                </View>
                <View style={{flex:1, alignItems: "flex-end"}}>
                    <View style={{ height: "100%", width: "90%", alignItems: "flex-start", paddingLeft: "5%", flexDirection: "row" }}>
                        <Text style={{fontSize: RFPercentage(1.7), fontWeight: '500', color: "#333D4B"}}>{sData.optionNm}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            {sData.menu !== "" &&
                <View style={{ height: height * 0.12, backgroundColor: "#FAFAFB", marginLeft: "5%", marginRight: "5%", borderRadius: 5}}>
                    <View style={{flex:1, justifyContent: "center"}}>
                        <View style={{ height: height * 0.035, width: width * 0.17, backgroundColor: "#F2F3F5", marginLeft: "5%", borderRadius: 5, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: RFPercentage(1.5), fontWeight: '600', color: "#3B3B46"}}>연결메뉴</Text>
                        </View>
                    </View>
                    <View style={{flex:1, justifyContent: "flex-start"}}>
                        <View style={{ flex:1, marginLeft: "5%"}}>
                            <Text style={{fontSize: RFPercentage(1.5), fontWeight: '500', color: "#505866"}}>{sData.menu}</Text>
                        </View>
                    </View>
                </View>
            }
        </>
    )
}

export const MenuItem = ({ sData, fnCheck, sMainList }) => {
    const [sId, setId] = useState("");

    const checkOut = async () => {
        
        if(sId === ""){
            setId(sData.key);
            await checkValue(sData.key,sData.name,sData.price,"add");
        } else {
            setId("");
            await checkValue(sData.key,sData.name,sData.price,"");
        }
    }

    const checkValue = async (sIndex,aIndex,xIndex,zIndex) => {
        if(fnCheck !== undefined && typeof fnCheck === "function"){
            await fnCheck(sIndex,aIndex,xIndex,zIndex);
        }
    }

    return (
        <TouchableOpacity onPress={() => checkOut()} style={{height: height * 0.1, backgroundColor: "#fff", marginLeft: "5%", marginRight: "5%"}}>
            <View style={{flex:1, flexDirection: "row", justifyContent: "center"}}>
                <View style={{ height: "100%", width: "10%",  justifyContent: "center", alignItems: "center"}}>
                    {sId === "" ?
                        <ComponentCheckBoxNone iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                    :
                        <ComponentCheckBox iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                    }
                </View>
                <View style={{ height: "100%", width: "90%", justifyContent: "center", paddingLeft: "5%" }}>
                    <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#333D4B"}}>{sData.name}</Text>
                </View>
            </View>
            <View style={{flex:1, alignItems: "flex-end"}}>
                <View style={{ height: "100%", width: "90%", alignItems: "flex-start", paddingLeft: "5%", flexDirection: "row" }}>
                    <Text style={{fontSize: RFPercentage(1.7), fontWeight: '500', color: "#333D4B"}}>{sData.price}원</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export const OptionAddPage1 = ({ fnStopStep, sAnimated, fnNextStep, iNm, iMaxNm, iMinNm, iMustItem }) => {
    const iMinList = [];
    for (let i = 1; i < 11 ; i++) {
        iMinList.push({
            key: i,
            value: i,
            name: `${i} 개`
        });
    };

    const [errLoad, setErrLoad] = useState(false);

    const [animated] = useState(new Animated.Value(sAnimated));

    const [sNm, setNm] = useState("");
    const [mustItem, setMustItem] = useState("radio");
    const [sMaxNm, setMaxNm] = useState(1);
    const [sMinNm, setMinNm] = useState(1);
    const [textMaxNm, setTextMaxNm] = useState("1 개");

    const [minCount, setMinCount] = useState(false);
    const [maxCount, setMaxCount] = useState(false);

    const [errNmColor, setErrNmColor] = useState("#EFF0F6");
    const [errNmText, setErrNmText] = useState("");

    const [textInputType, setTextInputType] = useState("");

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const animationStyles = {
        width: animated,
    };
    
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

    const stopStep = async () => {
        if(fnStopStep !== undefined && typeof fnStopStep === "function"){
            await fnStopStep();
        }
    }
    
    const addPage = async () => {
        if(sNm !== ""){
            const sBox = {
                sNm,
                mustItem,
                sMaxNm,
                sMinNm
            }
            if(fnNextStep !== undefined && typeof fnNextStep === "function"){
                await fnNextStep("step2",width * 0.33,sBox);
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

    Animated.timing(animated, {
        toValue: width * 0.33,
        duration: 1000,
        useNativeDriver: false,
    }).start();

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

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: height * 0.1,
                width: width,
                height: height * 0.9, 
                backgroundColor: "#fff",
                borderTopLeftRadius: width * 0.04, 
                borderTopRightRadius: width * 0.04, 
            }}
        >
            {errLoad &&
                <View style={{position: "absolute", zIndex: 999, top: 0, height: "100%", width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: width * 0.04}}>
                    <View style={{height: height * 0.43, width: "80%", borderRadius: 10, backgroundColor: "#fff"}}>
                        <View style={{height: height * 0.07, justifyContent: "center", marginLeft: "5%"}}>
                            <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>옵션 필수 여부</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Image source={optionImg} style={{ width: "80%", height: "100%", resizeMode: "contain"}}/>
                        </View>
                        <View style={{height: height * 0.12, width: "100%", justifyContent: "center", alignItems: "center"}}>
                            <TouchableOpacity onPress={() => setErrLoad(false)} style={{height: height * 0.07, borderWidth: 1, borderColor: "#E1E2E3", width: "90%", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>확인</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            }
            <View style={{height: height * 0.04, width}} />
            <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", justifyContent: "flex-start"}}>
                <Text style={{fontSize: RFPercentage(2.5), fontWeight: '600', color: "#191F28"}}>새 옵션 그룹 추가</Text>
                <TouchableOpacity onPress={stopStep} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", right: 0}}>
                    <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                </TouchableOpacity>
            </View>
            <Animated.View style={[{height: height * 0.005, borderBottomColor: "#6490E7", borderBottomWidth: 2 },animationStyles]} />
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <View style={{height: height * 0.15, alignItems: "center"}}>
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
                    <View style={{height: height * 0.21, borderBottomColor: "#F2F3F5", borderBottomWidth: 1}}>
                        <TouchableOpacity onPress={() => setErrLoad(true)} style={{height: height * 0.08, width, alignItems: "center", marginLeft: "5%", flexDirection: "row"}}>
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>필수 여부</Text>
                            <ComponentQuestionMark iHeight={height * 0.02} iWidth={width * 0.08} iColor={"#6B7583"}/>
                        </TouchableOpacity>
                        <View style={{height: height * 0.13, width, justifyContent: "flex-start", marginLeft: "5%"}}>
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
                                <ScrollView style={{position: "absolute", left: "11%", top: 0, width: "25%", minHeight: height * 0.01, maxHeight: height * 0.2, backgroundColor: "#E5E7EA", borderRadius: 5, zIndex: 100}}>
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
                    <TouchableOpacity activeOpacity={0.8} onPress={() => unactiveNmText()} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.2}}>
                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                    </TouchableOpacity>
                }
            </View>
            {textInputType === "" &&
                <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                    <TouchableOpacity onPress={addPage} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>다음</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}

export const SubOptionAddPage1 = ({ fnStopStep, sAnimated, fnNextStep, iNm, iMaxNm, iMinNm, iMustItem }) => {
    const iMinList = [];
    for (let i = 1; i < 11 ; i++) {
        iMinList.push({
            key: i,
            value: i,
            name: `${i} 개`
        });
    };

    const [errLoad, setErrLoad] = useState(false);

    const [animated] = useState(new Animated.Value(sAnimated));

    const [sNm, setNm] = useState("");
    const [mustItem, setMustItem] = useState("radio");
    const [sMaxNm, setMaxNm] = useState(1);
    const [sMinNm, setMinNm] = useState(1);
    const [textMaxNm, setTextMaxNm] = useState("1 개");

    const [minCount, setMinCount] = useState(false);
    const [maxCount, setMaxCount] = useState(false);

    const [errNmColor, setErrNmColor] = useState("#EFF0F6");
    const [errNmText, setErrNmText] = useState("");

    const [textInputType, setTextInputType] = useState("");

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const animationStyles = {
        width: animated,
    };
    
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

    const stopStep = async () => {
        if(fnStopStep !== undefined && typeof fnStopStep === "function"){
            await fnStopStep();
        }
    }
    
    const addPage = async () => {
        if(sNm !== ""){
            const sBox = {
                sNm,
                mustItem,
                sMaxNm,
                sMinNm
            }
            if(fnNextStep !== undefined && typeof fnNextStep === "function"){
                await fnNextStep("step2",width * 0.33,sBox);
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

    Animated.timing(animated, {
        toValue: width * 0.33,
        duration: 1000,
        useNativeDriver: false,
    }).start();

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

    return (
        <View style={{flex:1}}>
            {errLoad &&
                <View style={{position: "absolute", zIndex: 999, top: 0, height: "100%", width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: width * 0.04}}>
                    <View style={{height: height * 0.43, width: "80%", borderRadius: 10, backgroundColor: "#fff"}}>
                        <View style={{height: height * 0.07, justifyContent: "center", marginLeft: "5%"}}>
                            <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>옵션 필수 여부</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Image source={optionImg} style={{ width: "80%", height: "100%", resizeMode: "contain"}}/>
                        </View>
                        <View style={{height: height * 0.12, width: "100%", justifyContent: "center", alignItems: "center"}}>
                            <TouchableOpacity onPress={() => setErrLoad(false)} style={{height: height * 0.07, borderWidth: 1, borderColor: "#E1E2E3", width: "90%", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>확인</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            }
            <View style={{height: height * 0.04, width}} />
            <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", justifyContent: "flex-start"}}>
                <Text style={{fontSize: RFPercentage(2.5), fontWeight: '600', color: "#191F28"}}>새 옵션 그룹 추가</Text>
                <TouchableOpacity onPress={stopStep} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", right: 0}}>
                    <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                </TouchableOpacity>
            </View>
            <Animated.View style={[{height: height * 0.005, borderBottomColor: "#6490E7", borderBottomWidth: 2 },animationStyles]} />
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <View style={{height: height * 0.15, alignItems: "center"}}>
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
                    <View style={{height: height * 0.21, borderBottomColor: "#F2F3F5", borderBottomWidth: 1}}>
                        <TouchableOpacity onPress={() => setErrLoad(true)} style={{height: height * 0.08, width, alignItems: "center", marginLeft: "5%", flexDirection: "row"}}>
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>필수 여부</Text>
                            <ComponentQuestionMark iHeight={height * 0.02} iWidth={width * 0.08} iColor={"#6B7583"}/>
                        </TouchableOpacity>
                        <View style={{height: height * 0.13, width, justifyContent: "flex-start", marginLeft: "5%"}}>
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
                                <ScrollView style={{position: "absolute", left: "11%", top: 0, width: "25%", minHeight: height * 0.01, maxHeight: height * 0.2, backgroundColor: "#E5E7EA", borderRadius: 5, zIndex: 100}}>
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
                    <TouchableOpacity activeOpacity={0.8} onPress={() => unactiveNmText()} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.2}}>
                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                    </TouchableOpacity>
                }
            </View>
            {textInputType === "" &&
                <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                    <TouchableOpacity onPress={addPage} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>다음</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}

export const OptionAddPage2 = ({ fnStopStep, sAnimated, fnPrevStep, fnNextStep, nData, iMaxNm }) => {
    const [errLoad, setErrLoad] = useState(false);
    const [errLoadText, setErrLoadText] = useState("");

    const [animated] = useState(new Animated.Value(sAnimated));

    const [sNm, setNm] = useState("");
    const [sPrice, setPrice] = useState("");
    const [sMaxNm, setMaxNm] = useState(1);

    const [errNmColor, setErrNmColor] = useState("#EFF0F6");
    const [errNmText, setErrNmText] = useState("");
    const [errPriceColor, setErrPriceColor] = useState("#EFF0F6");
    const [errPriceText, setErrPriceText] = useState("");

    const [textInputType, setTextInputType] = useState("");

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const [iData, setData] = useState([]);
    const sData = useRef([]);
    const sFocus = useRef(null);
    const iFocus = useRef(null);

    const onChangeNm = text => {
        setNm(text);
        setErrNmColor("#6490E7");
        setErrNmText("");
    };

    const onChangePrice = text => {
        const sTemp = text;
        const regex = /[0-9]+$/gi;
        if(sTemp === "" || sTemp === null){
            setPrice(text);
            setErrPriceColor("#6490E7");
            setErrPriceText("");
        } else {
            if (regex.test(sTemp)) {
                setPrice(text);
                setErrPriceColor("#6490E7");
                setErrPriceText("");
            } else {
                setErrPriceColor("#E32938");
                setErrPriceText("숫자만 입력가능합니다.");
            }
        }
    };

    const activeNmText = () => {
        iFocus.current.focus();
        setErrNmColor("#6490E7");
        setErrPriceColor("#EFF0F6");
        setTextInputType("sNm");
    };

    const unactiveNmText = () => {
        setErrNmColor("#EFF0F6");
        setErrPriceColor("#EFF0F6");
        setTextInputType("");
    };
    
    const activePriceText = () => {
        sFocus.current.focus();
        setErrNmColor("#EFF0F6");
        setErrPriceColor("#6490E7");
        setTextInputType("sPrice");
    };
    
    const unactivePriceText = () => {
        setErrNmColor("#EFF0F6");
        setErrPriceColor("#EFF0F6");
        setTextInputType("");
    };
    
    const nextInputSection = async (sIndex) => {
        if(sIndex === "sNm"){
            if(sPrice !== "" && sNm !== "") {
                insertOption();
            } else if(sPrice === ""){
                unactiveNmText();
                activePriceText();
            } else {
                unactiveNmText();
                Keyboard.dismiss();
            }
        } else {
            if(sPrice !== "" && sNm !== "") {
                insertOption();
            } else if(sNm === ""){
                unactivePriceText();
                activeNmText();
            } else {
                unactivePriceText();
                Keyboard.dismiss();
            }
        }
    };

    const animationStyles = {
        width: animated,
    };
    
    const stopStep = async () => {
        if(fnStopStep !== undefined && typeof fnStopStep === "function"){
            await fnStopStep();
        }
    }
    
    const prevStep = async () => {
        if(fnPrevStep !== undefined && typeof fnPrevStep === "function"){
            await fnPrevStep("step1",width * 0.66);
        }
    }

    const addPage = async () => {
        if(iData.length > 0){
            if(parseInt(iData.length) >= sMaxNm){
                if(fnNextStep !== undefined && typeof fnNextStep === "function"){
                    await fnNextStep("step3",width * 0.66,iData);
                }
            } else {
                setErrLoadText(`옵션을 ${sMaxNm}개 이상 등록해주세요`);
                setErrLoad(true);
            }
        } else {
            setErrLoadText("옵션을 추가해주세요");
            setErrLoad(true);
        }
    }

    const insertOption = () => {
        if(sNm !== "" && sPrice !== ""){
            const xData = {
                key : parseInt(sData.current.length) + 1,
                name : sNm,
                price : parseInt(sPrice)
            }
            setData([...sData.current, xData]);
            sData.current = [...sData.current, xData];
            unactiveNmText();
            unactivePriceText();
            setNm("");
            setPrice("");
            Keyboard.dismiss();
        }
    };

    const deleteOptionList = (key) => {
        let tempList = sData.current;
        sData.current = tempList.filter((item) => item.key !== parseInt(key));
        setData(tempList.filter((item) => item.key !== parseInt(key)));
    }

    Animated.timing(animated, {
        toValue: width * 0.66,
        duration: 1000,
        useNativeDriver: false,
    }).start();

    const onKeyboardDidShow = (e) => {
        setKeyboardHeight(e.endCoordinates.height);
    }

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    }, []);

    useEffect(() => {
        sData.current = nData;
        setData(nData);
        setMaxNm(iMaxNm);
    }, [nData]);

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: height * 0.1,
                width: width,
                height: height * 0.9, 
                backgroundColor: "#fff",
                borderTopLeftRadius: width * 0.04, 
                borderTopRightRadius: width * 0.04, 
            }}
        >
            {errLoad &&
                <View style={{position: "absolute", zIndex: 999, top: 0, height: "100%", width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: width * 0.04}}>
                    <View style={{height: height * 0.17, width: "80%", borderRadius: 10, backgroundColor: "#fff"}}>
                        <View style={{height: height * 0.09, width: "100%", justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#333D4B"}}>{errLoadText}</Text>
                        </View>
                        <View style={{height: height * 0.08, width: "100%", justifyContent: "center", alignItems: "center"}}>
                            <TouchableOpacity onPress={() => setErrLoad(false)} style={{height: height * 0.05, width: "80%", borderColor: "#E1E2E3", borderWidth: 1, borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontSize: RFPercentage(1.7), fontWeight: '800', color: "#4E5867"}}>확인</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            }
            <View style={{height: height * 0.04, width}} />
            <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", justifyContent: "flex-start"}}>
                <Text style={{fontSize: RFPercentage(2.5), fontWeight: '600', color: "#191F28"}}>새 옵션 그룹 추가</Text>
                <TouchableOpacity onPress={prevStep} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", left: 0}}>
                    <ComponentArrowLeft3 iHeight={height * 0.022} iWidth={width * 0.07} iColor={"#6B7583"}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={stopStep} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", right: 0}}>
                    <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                </TouchableOpacity>
            </View>
            <Animated.View style={[{height: height * 0.005, borderBottomColor: "#6490E7", borderBottomWidth: 2 },animationStyles]} />
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <View style={{height: height * 0.07, width, justifyContent: "center", marginLeft: "5%"}}>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>옵션</Text>
                </View>
                <FlatList
                    data={iData}
                    ListHeaderComponent={
                        <>
                        <View style={{height: height * 0.06, width, flexDirection: "row", marginLeft: "5%", alignItems: "center"}}>
                            <TextInput
                                ref={iFocus}
                                placeholder="예) ICE"
                                placeholderTextColor="#919AA7"
                                returnKeyType="next"
                                onChangeText={text => onChangeNm(text)}
                                onFocus={() => activeNmText()}
                                onBlur={() => unactiveNmText()}
                                onSubmitEditing={() => nextInputSection("sNm")}
                                value={sNm}
                                style={{
                                    width: "42%",
                                    marginRight: "3%",
                                    height: height * 0.06,
                                    borderColor: errNmColor,
                                    fontSize: RFPercentage(2),
                                    borderWidth: 1,
                                    fontWeight: '500',
                                    paddingLeft: "5%",
                                    backgroundColor: '#FAFAFB',
                                    borderRadius: 5,
                                    color: "#000"
                                }}
                                />
                            <TextInput
                                ref={sFocus}
                                placeholder="예) 500"
                                placeholderTextColor="#919AA7"
                                returnKeyType="done"
                                keyboardType="numeric"
                                onChangeText={text => onChangePrice(text)}
                                onFocus={() => activePriceText()}
                                onBlur={() => unactivePriceText()}
                                onSubmitEditing={() => nextInputSection("sPrice")}
                                value={sPrice}
                                style={{
                                    width: "25%",
                                    marginRight: "3%",
                                    height: height * 0.06,
                                    borderColor: errPriceColor,
                                    fontSize: RFPercentage(2),
                                    borderWidth: 1,
                                    fontWeight: '500',
                                    paddingLeft: "3%",
                                    backgroundColor: '#FAFAFB',
                                    borderRadius: 5,
                                    color: "#000"
                                }}
                            />
                            <View style={{position: "absolute", top: 0, right: "30%", width: height * 0.04, height: height * 0.06, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#919AA7"}}>원</Text>
                            </View>
                            <TouchableOpacity onPress={insertOption} style={{height: height * 0.06, width: "17%", backgroundColor: "#6490E7", borderRadius: 5, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#fff"}}>+ 추가</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{height: height * 0.03, width, flexDirection: "row", marginLeft: "5%"}}>
                            <View style={{height: height * 0.03, width: "25%", marginRight: "3%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{errNmText}</Text>
                            </View>
                            <View style={{height: height * 0.03, width: "40%", marginRight: "3%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{errPriceText}</Text>
                            </View>
                            <View style={{height: height * 0.03, width: "18%"}} />
                        </View>
                        <View style={{height: height * 0.09, width, justifyContent: "flex-start", marginLeft: "5%"}}>
                            <View style={{height: height * 0.06, width: "90%", alignItems: "flex-start", justifyContent: "center", backgroundColor: "#F2F3F5", borderRadius: 5, paddingLeft: "5%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.8), color: "#505866" }}>이 옵션 그룹에는 최소{sMaxNm}개 이상의 옵션이 필요합니다.</Text>
                            </View>
                        </View>
                        <View style={{ height: height * 0.01, borderBottomColor: "#F2F3F5", borderBottomWidth: 1, marginLeft: "5%", marginRight: "5%"}}/>
                        <View style={{ height: height * 0.03}}/>
                        </>
                    }
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(data, index) => "list-" + index + Math.random()}
                    renderItem={({ item, index }) => {
                        return (
                            <>
                            {textInputType === "" &&
                                <View style={{height: height * 0.08, width, flexDirection: "row", marginLeft: "5%"}}>
                                    <View style={{ width: "42%", marginRight: "3%", height: height * 0.06, borderColor: "#EFF0F6", borderWidth: 1, backgroundColor: '#FAFAFB', borderRadius: 5, justifyContent: "center", paddingLeft: "5%"}}>
                                        <Text style={{ fontSize: RFPercentage(2), fontWeight: '500', color: "#000"}}>{item.name}</Text>
                                    </View>
                                    <View style={{ width: "25%", marginRight: "3%", height: height * 0.06, borderColor: "#EFF0F6", borderWidth: 1, backgroundColor: '#FAFAFB', borderRadius: 5, justifyContent: "center", paddingLeft: "5%"}}>
                                        <Text style={{ fontSize: RFPercentage(2), fontWeight: '500', color: "#000"}}>{item.price}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => deleteOptionList(item.key)} style={{height: height * 0.06, width: "17%", borderColor: "#EF4452", borderWidth: 1, borderRadius: 5, justifyContent: "center", alignItems: "center"}}>
                                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#EF4452"}}>삭제</Text>
                                    </TouchableOpacity>
                                    <View  style={{position: "absolute", top: 0, right: "30%", width: height * 0.04, height: height * 0.06, justifyContent: "center", alignItems: "center"}}>
                                        <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#919AA7"}}>원</Text>
                                    </View>
                                </View>
                            }
                            </>
                        ) 
                    }}
                />
                {textInputType === "sNm" &&
                    <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.195}}>
                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                    </TouchableOpacity>
                }
                {textInputType === "sPrice" &&
                    <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.165}}>
                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                    </TouchableOpacity>
                }
            </View>
            {textInputType === "" &&
                <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                    <TouchableOpacity onPress={addPage} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>다음</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}

export const SubOptionAddPage2 = ({ fnStopStep, sAnimated, fnPrevStep, fnNextStep, nData, iMaxNm }) => {
    const [errLoad, setErrLoad] = useState(false);
    const [errLoadText, setErrLoadText] = useState("");

    const [animated] = useState(new Animated.Value(sAnimated));

    const [sNm, setNm] = useState("");
    const [sPrice, setPrice] = useState("");
    const [sMaxNm, setMaxNm] = useState(1);

    const [errNmColor, setErrNmColor] = useState("#EFF0F6");
    const [errNmText, setErrNmText] = useState("");
    const [errPriceColor, setErrPriceColor] = useState("#EFF0F6");
    const [errPriceText, setErrPriceText] = useState("");

    const [textInputType, setTextInputType] = useState("");

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const [iData, setData] = useState([]);
    const sData = useRef([]);
    const sFocus = useRef(null);
    const iFocus = useRef(null);

    const onChangeNm = text => {
        setNm(text);
        setErrNmColor("#6490E7");
        setErrNmText("");
    };

    const onChangePrice = text => {
        const sTemp = text;
        const regex = /[0-9]+$/gi;
        if(sTemp === "" || sTemp === null){
            setPrice(text);
            setErrPriceColor("#6490E7");
            setErrPriceText("");
        } else {
            if (regex.test(sTemp)) {
                setPrice(text);
                setErrPriceColor("#6490E7");
                setErrPriceText("");
            } else {
                setErrPriceColor("#E32938");
                setErrPriceText("숫자만 입력가능합니다.");
            }
        }
    };

    const activeNmText = () => {
        iFocus.current.focus();
        setErrNmColor("#6490E7");
        setErrPriceColor("#EFF0F6");
        setTextInputType("sNm");
    };

    const unactiveNmText = () => {
        setErrNmColor("#EFF0F6");
        setErrPriceColor("#EFF0F6");
        setTextInputType("");
    };
    
    const activePriceText = () => {
        sFocus.current.focus();
        setErrNmColor("#EFF0F6");
        setErrPriceColor("#6490E7");
        setTextInputType("sPrice");
    };
    
    const unactivePriceText = () => {
        setErrNmColor("#EFF0F6");
        setErrPriceColor("#EFF0F6");
        setTextInputType("");
    };
    
    const nextInputSection = async (sIndex) => {
        if(sIndex === "sNm"){
            if(sPrice !== "" && sNm !== "") {
                insertOption();
            } else if(sPrice === ""){
                unactiveNmText();
                activePriceText();
            } else {
                unactiveNmText();
                Keyboard.dismiss();
            }
        } else {
            if(sPrice !== "" && sNm !== "") {
                insertOption();
            } else if(sNm === ""){
                unactivePriceText();
                activeNmText();
            } else {
                unactivePriceText();
                Keyboard.dismiss();
            }
        }
    };

    const animationStyles = {
        width: animated,
    };
    
    const stopStep = async () => {
        if(fnStopStep !== undefined && typeof fnStopStep === "function"){
            await fnStopStep();
        }
    }
    
    const prevStep = async () => {
        if(fnPrevStep !== undefined && typeof fnPrevStep === "function"){
            await fnPrevStep("step1",width * 0.66);
        }
    }

    const addPage = async () => {
        if(iData.length > 0){
            if(parseInt(iData.length) >= sMaxNm){
                if(fnNextStep !== undefined && typeof fnNextStep === "function"){
                    await fnNextStep("step3",width * 0.66,iData);
                }
            } else {
                setErrLoadText(`옵션을 ${sMaxNm}개 이상 등록해주세요`);
                setErrLoad(true);
            }
        } else {
            setErrLoadText("옵션을 추가해주세요");
            setErrLoad(true);
        }
    }

    const insertOption = () => {
        if(sNm !== "" && sPrice !== ""){
            const xData = {
                key : parseInt(sData.current.length) + 1,
                name : sNm,
                price : parseInt(sPrice)
            }
            setData([...sData.current, xData]);
            sData.current = [...sData.current, xData];
            unactiveNmText();
            unactivePriceText();
            setNm("");
            setPrice("");
            Keyboard.dismiss();
        }
    };

    const deleteOptionList = (key) => {
        let tempList = sData.current;
        sData.current = tempList.filter((item) => item.key !== parseInt(key));
        setData(tempList.filter((item) => item.key !== parseInt(key)));
    }

    Animated.timing(animated, {
        toValue: width * 0.5,
        duration: 1000,
        useNativeDriver: false,
    }).start();

    const onKeyboardDidShow = (e) => {
        setKeyboardHeight(e.endCoordinates.height);
    }

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    }, []);

    useEffect(() => {
        sData.current = nData;
        setData(nData);
        setMaxNm(iMaxNm);
    }, [nData]);

    return (
        <View style={{ flex:1 }}>
            {errLoad &&
                <View style={{position: "absolute", zIndex: 999, top: 0, height: "100%", width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: width * 0.04}}>
                    <View style={{height: height * 0.17, width: "80%", borderRadius: 10, backgroundColor: "#fff"}}>
                        <View style={{height: height * 0.09, width: "100%", justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#333D4B"}}>{errLoadText}</Text>
                        </View>
                        <View style={{height: height * 0.08, width: "100%", justifyContent: "center", alignItems: "center"}}>
                            <TouchableOpacity onPress={() => setErrLoad(false)} style={{height: height * 0.05, width: "80%", borderColor: "#E1E2E3", borderWidth: 1, borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontSize: RFPercentage(1.7), fontWeight: '800', color: "#4E5867"}}>확인</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            }
            <View style={{height: height * 0.04, width}} />
            <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", justifyContent: "flex-start"}}>
                <Text style={{fontSize: RFPercentage(2.5), fontWeight: '600', color: "#191F28"}}>새 옵션 그룹 추가</Text>
                <TouchableOpacity onPress={prevStep} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", left: 0}}>
                    <ComponentArrowLeft3 iHeight={height * 0.022} iWidth={width * 0.07} iColor={"#6B7583"}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={stopStep} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", right: 0}}>
                    <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                </TouchableOpacity>
            </View>
            <Animated.View style={[{height: height * 0.005, borderBottomColor: "#6490E7", borderBottomWidth: 2 },animationStyles]} />
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <View style={{height: height * 0.07, width, justifyContent: "center", marginLeft: "5%"}}>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>옵션</Text>
                </View>
                <FlatList
                    data={iData}
                    ListHeaderComponent={
                        <>
                        <View style={{height: height * 0.06, width, flexDirection: "row", marginLeft: "5%", alignItems: "center"}}>
                            <TextInput
                                ref={iFocus}
                                placeholder="예) ICE"
                                placeholderTextColor="#919AA7"
                                returnKeyType="next"
                                onChangeText={text => onChangeNm(text)}
                                onFocus={() => activeNmText()}
                                onBlur={() => unactiveNmText()}
                                onSubmitEditing={() => nextInputSection("sNm")}
                                value={sNm}
                                style={{
                                    width: "42%",
                                    marginRight: "3%",
                                    height: height * 0.06,
                                    borderColor: errNmColor,
                                    fontSize: RFPercentage(2),
                                    borderWidth: 1,
                                    fontWeight: '500',
                                    paddingLeft: "5%",
                                    backgroundColor: '#FAFAFB',
                                    borderRadius: 5,
                                    color: "#000"
                                }}
                                />
                            <TextInput
                                ref={sFocus}
                                placeholder="예) 500"
                                placeholderTextColor="#919AA7"
                                returnKeyType="done"
                                keyboardType="numeric"
                                onChangeText={text => onChangePrice(text)}
                                onFocus={() => activePriceText()}
                                onBlur={() => unactivePriceText()}
                                onSubmitEditing={() => nextInputSection("sPrice")}
                                value={sPrice}
                                style={{
                                    width: "25%",
                                    marginRight: "3%",
                                    height: height * 0.06,
                                    borderColor: errPriceColor,
                                    fontSize: RFPercentage(2),
                                    borderWidth: 1,
                                    fontWeight: '500',
                                    paddingLeft: "5%",
                                    backgroundColor: '#FAFAFB',
                                    borderRadius: 5,
                                    color: "#000"
                                }}
                            />
                            <View style={{position: "absolute", top: 0, right: "30%", width: height * 0.04, height: height * 0.06, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#919AA7"}}>원</Text>
                            </View>
                            <TouchableOpacity onPress={insertOption} style={{height: height * 0.06, width: "17%", backgroundColor: "#6490E7", borderRadius: 5, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#fff"}}>+ 추가</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{height: height * 0.03, width, flexDirection: "row", marginLeft: "5%"}}>
                            <View style={{height: height * 0.03, width: "25%", marginRight: "3%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{errNmText}</Text>
                            </View>
                            <View style={{height: height * 0.03, width: "40%", marginRight: "3%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{errPriceText}</Text>
                            </View>
                            <View style={{height: height * 0.03, width: "18%"}} />
                        </View>
                        <View style={{height: height * 0.09, width, justifyContent: "flex-start", marginLeft: "5%"}}>
                            <View style={{height: height * 0.06, width: "90%", alignItems: "flex-start", justifyContent: "center", backgroundColor: "#F2F3F5", borderRadius: 5, paddingLeft: "5%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.8), color: "#505866" }}>이 옵션 그룹에는 최소{sMaxNm}개 이상의 옵션이 필요합니다.</Text>
                            </View>
                        </View>
                        <View style={{ height: height * 0.01, borderBottomColor: "#F2F3F5", borderBottomWidth: 1, marginLeft: "5%", marginRight: "5%"}}/>
                        <View style={{ height: height * 0.03}}/>
                        </>
                    }
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(data, index) => "list-" + index + Math.random()}
                    renderItem={({ item, index }) => {
                        return (
                            <>
                            {textInputType === "" &&
                                <View style={{height: height * 0.08, width, flexDirection: "row", marginLeft: "5%"}}>
                                    <View style={{ width: "42%", marginRight: "3%", height: height * 0.06, borderColor: "#EFF0F6", borderWidth: 1, backgroundColor: '#FAFAFB', borderRadius: 5, justifyContent: "center", paddingLeft: "5%"}}>
                                        <Text style={{ fontSize: RFPercentage(2), fontWeight: '500', color: "#000"}}>{item.name}</Text>
                                    </View>
                                    <View style={{ width: "25%", marginRight: "3%", height: height * 0.06, borderColor: "#EFF0F6", borderWidth: 1, backgroundColor: '#FAFAFB', borderRadius: 5, justifyContent: "center", paddingLeft: "5%"}}>
                                        <Text style={{ fontSize: RFPercentage(2), fontWeight: '500', color: "#000"}}>{item.price}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => deleteOptionList(item.key)} style={{height: height * 0.06, width: "17%", borderColor: "#EF4452", borderWidth: 1, borderRadius: 5, justifyContent: "center", alignItems: "center"}}>
                                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#EF4452"}}>삭제</Text>
                                    </TouchableOpacity>
                                    <View  style={{position: "absolute", top: 0, right: "30%", width: height * 0.04, height: height * 0.06, justifyContent: "center", alignItems: "center"}}>
                                        <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#919AA7"}}>원</Text>
                                    </View>
                                </View>
                            }
                            </>
                        ) 
                    }}
                />
                {textInputType === "sNm" &&
                    <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.195}}>
                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                    </TouchableOpacity>
                }
                {textInputType === "sPrice" &&
                    <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.165}}>
                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                    </TouchableOpacity>
                }
            </View>
            {textInputType === "" &&
                <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                    <TouchableOpacity onPress={addPage} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>다음</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}

export const OptionAddPage3 = ({ fnStopStep, sAnimated, fnPrevStep, fnNextStep, nData, iMaxNm, iMinNm, iMustItem }) => {
    const [errLoad, setErrLoad] = useState(false);

    const [minCount, setMinCount] = useState(false);
    const [maxCount, setMaxCount] = useState(false);

    const [animated] = useState(new Animated.Value(sAnimated));

    const [mustItem, setMustItem] = useState("radio");
    const [sMaxNm, setMaxNm] = useState(1);
    const [sMinNm, setMinNm] = useState(1);
    const [textMaxNm, setTextMaxNm] = useState("1 개");

    const animationStyles = {
        width: animated,
    };
    
    const onChangeType = async (sIndex) => {
        setMustItem(sIndex);
        setMinCount(false);
        setMaxCount(false);
        setMaxNm(1);
        setMinNm(1);
        setTextMaxNm("1개");
    }
    
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
    
    const stopStep = async () => {
        if(fnStopStep !== undefined && typeof fnStopStep === "function"){
            await fnStopStep();
        }
    }
    
    const prevStep = async () => {
        if(fnPrevStep !== undefined && typeof fnPrevStep === "function"){
            await fnPrevStep("step2",width * 0.75);
        }
    }

    const addPage = async () => {
        const oData = {
            mustItem,
            sMaxNm,
            sMinNm,
        }
        if(fnNextStep !== undefined && typeof fnNextStep === "function"){
            await fnNextStep("step4",width * 0.75,oData);
        }
    }

    const iMinList = [];
    for (let i = 1; i < (nData.length + 1) ; i++) {
        iMinList.push({
            key: i,
            value: i,
            name: `${i} 개`
        });
    };

    Animated.timing(animated, {
        toValue: width * 0.75,
        duration: 1000,
        useNativeDriver: false,
    }).start();

    useEffect(() => {
        if(iMustItem !== undefined && iMaxNm !== undefined && iMinNm !== undefined){
            setMustItem(iMustItem);
            setMaxNm(iMaxNm);
            setMinNm(iMinNm);
            setTextMaxNm(iMaxNm.toString() + "개");
        }
    }, [iMaxNm, iMinNm, iMustItem]);

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: height * 0.1,
                width: width,
                height: height * 0.9, 
                backgroundColor: "#fff",
                borderTopLeftRadius: width * 0.04, 
                borderTopRightRadius: width * 0.04, 
            }}
        >
            {errLoad &&
                <View style={{position: "absolute", zIndex: 999, top: 0, height: "100%", width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: width * 0.04}}>
                    <View style={{height: height * 0.43, width: "80%", borderRadius: 10, backgroundColor: "#fff"}}>
                        <View style={{height: height * 0.07, justifyContent: "center", marginLeft: "5%"}}>
                            <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>옵션 필수 여부</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Image source={optionImg} style={{ width: "80%", height: "100%", resizeMode: "contain"}}/>
                        </View>
                        <View style={{height: height * 0.12, width: "100%", justifyContent: "center", alignItems: "center"}}>
                            <TouchableOpacity onPress={() => setErrLoad(false)} style={{height: height * 0.07, borderWidth: 1, borderColor: "#E1E2E3", width: "90%", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>확인</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            }
            <View style={{height: height * 0.04, width}} />
            <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", justifyContent: "flex-start"}}>
                <Text style={{fontSize: RFPercentage(2.5), fontWeight: '600', color: "#191F28"}}>새 옵션 그룹 추가</Text>
                <TouchableOpacity onPress={prevStep} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", left: 0}}>
                    <ComponentArrowLeft3 iHeight={height * 0.022} iWidth={width * 0.07} iColor={"#6B7583"}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={stopStep} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", right: 0}}>
                    <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                </TouchableOpacity>
            </View>
            <Animated.View style={[{height: height * 0.005, borderBottomColor: "#6490E7", borderBottomWidth: 2 },animationStyles]} />
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <View style={{height: height * 0.21, borderBottomColor: "#F2F3F5", borderBottomWidth: 1}}>
                    <TouchableOpacity onPress={() => setErrLoad(true)} style={{height: height * 0.08, width, alignItems: "center", marginLeft: "5%", flexDirection: "row"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>필수 여부</Text>
                        <ComponentQuestionMark iHeight={height * 0.02} iWidth={width * 0.08} iColor={"#6B7583"}/>
                    </TouchableOpacity>
                    <View style={{height: height * 0.13, width, justifyContent: "flex-start", marginLeft: "5%"}}>
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
                <View style={{height: height * 0.42}}>
                    <View style={{height: height * 0.08, width, alignItems: "center", marginLeft: "5%", flexDirection: "row"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>선택 가능한 옵션 수</Text>
                    </View>
                    {mustItem === "radio" ?
                        <View style={{height: height * 0.1, width: "90%", flexDirection: "row", marginLeft: "5%"}}>
                            <View style={{height: "70%", width: "25%", justifyContent: "center"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#6B7583" }}>최소선택수</Text>
                            </View>
                            <TouchableOpacity onPress={onChangeMax} style={{height: "70%", width: "75%", backgroundColor: "#FAFAFB", borderRadius: 5, borderWidth: 1, borderColor: "#EFF0F6", alignItems: "center", justifyContent: "space-between", flexDirection: "row", paddingLeft: "5%", paddingRight: "5%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>{textMaxNm}</Text>
                                <ComponentArrowDown1 iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                            </TouchableOpacity>
                            {maxCount &&
                                <ScrollView style={{position: "absolute", left: "25%", top: 0, width: "75%", minHeight: height * 0.07, maxHeight: height * 0.3, backgroundColor: "#E5E7EA", borderRadius: 5, zIndex: 100}}>
                                    {iMinList.map((item,index) => {
                                        return (
                                            <TouchableOpacity key={index} onPress={() => onChangeMaxCount(item)} style={{ height: height * 0.07, width: "100%", alignItems: "center", justifyContent: "space-between", flexDirection: "row", paddingLeft: "5%", paddingRight: "5%", borderBottomColor: "#fff",  borderBottomWidth: 1}}>
                                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>{item.name}</Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </ScrollView>
                            }
                        </View>
                    :
                        <View style={{height: height * 0.1, width: "90%", flexDirection: "row", marginLeft: "5%"}}>
                            <View style={{height: "70%", width: "25%", justifyContent: "center"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#6B7583" }}>최대선택수</Text>
                            </View>
                            <TouchableOpacity onPress={onChangeMax} style={{height: "70%", width: "75%", backgroundColor: "#FAFAFB", borderRadius: 5, borderWidth: 1, borderColor: "#EFF0F6", alignItems: "center", justifyContent: "space-between", flexDirection: "row", paddingLeft: "5%", paddingRight: "5%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>{textMaxNm}</Text>
                                <ComponentArrowDown1 iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                            </TouchableOpacity>
                            {maxCount &&
                                <ScrollView style={{position: "absolute", left: "25%", top: 0, width: "75%", minHeight: height * 0.07, maxHeight: height * 0.3, backgroundColor: "#E5E7EA", borderRadius: 5, zIndex: 100}}>
                                    {iMinList.map((item,index) => {
                                        return (
                                            <TouchableOpacity key={index} onPress={() => onChangeMaxCount(item)} style={{ height: height * 0.07, width: "100%", alignItems: "center", justifyContent: "space-between", flexDirection: "row", paddingLeft: "5%", paddingRight: "5%", borderBottomColor: "#fff",  borderBottomWidth: 1}}>
                                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>{item.name}</Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </ScrollView>
                            }
                        </View>
                    }
                    {(!maxCount && !minCount) &&
                        <>
                            <View style={{height: height * 0.05, width, justifyContent: "flex-start", marginLeft: "5%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>의 옵션을 고객이 선택할 수 있어요.</Text>
                            </View>
                            <View style={{height: height * 0.08, width, justifyContent: "flex-start", marginLeft: "5%"}}>
                                <View style={{height: height * 0.06, width: "90%", alignItems: "flex-start", justifyContent: "center", backgroundColor: "#F2F3F5", borderRadius: 5, paddingLeft: "5%"}}>
                                    <Text style={{fontWeight: "500", fontSize: RFPercentage(1.8), color: "#505866" }}>이 옵션 그룹에는 옵션이 총 {nData.length}개 있습니다.</Text>
                                </View>
                            </View>
                        </>
                    }
                </View>
            </View>
            <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                <TouchableOpacity onPress={addPage} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>다음</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const SubOptionAddPage3 = ({ fnStopStep, sAnimated, fnPrevStep, fnNextStep, nData, iMaxNm, iMinNm, iMustItem }) => {
    const [errLoad, setErrLoad] = useState(false);

    const [minCount, setMinCount] = useState(false);
    const [maxCount, setMaxCount] = useState(false);

    const [animated] = useState(new Animated.Value(sAnimated));

    const [mustItem, setMustItem] = useState("radio");
    const [sMaxNm, setMaxNm] = useState(1);
    const [sMinNm, setMinNm] = useState(1);
    const [textMaxNm, setTextMaxNm] = useState("1 개");

    const animationStyles = {
        width: animated,
    };
    
    const onChangeType = async (sIndex) => {
        setMustItem(sIndex);
        setMinCount(false);
        setMaxCount(false);
        setMaxNm(1);
        setMinNm(1);
        setTextMaxNm("1개");
    }
    
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
    
    const stopStep = async () => {
        if(fnStopStep !== undefined && typeof fnStopStep === "function"){
            await fnStopStep();
        }
    }
    
    const prevStep = async () => {
        if(fnPrevStep !== undefined && typeof fnPrevStep === "function"){
            await fnPrevStep("step2",width * 0.75);
        }
    }

    const addPage = async () => {
        const oData = {
            mustItem,
            sMaxNm,
            sMinNm,
        }
        if(fnNextStep !== undefined && typeof fnNextStep === "function"){
            await fnNextStep("step4",width * 0.75,oData);
        }
    }

    const iMinList = [];
    for (let i = 1; i < (nData.length + 1) ; i++) {
        iMinList.push({
            key: i,
            value: i,
            name: `${i} 개`
        });
    };

    Animated.timing(animated, {
        toValue: width * 0.75,
        duration: 1000,
        useNativeDriver: false,
    }).start();

    useEffect(() => {
        if(iMustItem !== undefined && iMaxNm !== undefined && iMinNm !== undefined){
            setMustItem(iMustItem);
            setMaxNm(iMaxNm);
            setMinNm(iMinNm);
            setTextMaxNm(iMaxNm.toString() + "개");
        }
    }, [iMaxNm, iMinNm, iMustItem]);

    return (
        <View style={{ flex:1 }}>
            {errLoad &&
                <View style={{position: "absolute", zIndex: 999, top: 0, height: "100%", width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: width * 0.04}}>
                    <View style={{height: height * 0.43, width: "80%", borderRadius: 10, backgroundColor: "#fff"}}>
                        <View style={{height: height * 0.07, justifyContent: "center", marginLeft: "5%"}}>
                            <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>옵션 필수 여부</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Image source={optionImg} style={{ width: "80%", height: "100%", resizeMode: "contain"}}/>
                        </View>
                        <View style={{height: height * 0.12, width: "100%", justifyContent: "center", alignItems: "center"}}>
                            <TouchableOpacity onPress={() => setErrLoad(false)} style={{height: height * 0.07, borderWidth: 1, borderColor: "#E1E2E3", width: "90%", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>확인</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            }
            <View style={{height: height * 0.04, width}} />
            <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", justifyContent: "flex-start"}}>
                <Text style={{fontSize: RFPercentage(2.5), fontWeight: '600', color: "#191F28"}}>새 옵션 그룹 추가</Text>
                <TouchableOpacity onPress={prevStep} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", left: 0}}>
                    <ComponentArrowLeft3 iHeight={height * 0.022} iWidth={width * 0.07} iColor={"#6B7583"}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={stopStep} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", right: 0}}>
                    <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                </TouchableOpacity>
            </View>
            <Animated.View style={[{height: height * 0.005, borderBottomColor: "#6490E7", borderBottomWidth: 2 },animationStyles]} />
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <View style={{height: height * 0.21, borderBottomColor: "#F2F3F5", borderBottomWidth: 1}}>
                    <TouchableOpacity onPress={() => setErrLoad(true)} style={{height: height * 0.08, width, alignItems: "center", marginLeft: "5%", flexDirection: "row"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>필수 여부</Text>
                        <ComponentQuestionMark iHeight={height * 0.02} iWidth={width * 0.08} iColor={"#6B7583"}/>
                    </TouchableOpacity>
                    <View style={{height: height * 0.13, width, justifyContent: "flex-start", marginLeft: "5%"}}>
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
                <View style={{height: height * 0.42}}>
                    <TouchableOpacity onPress={() => setErrLoad(true)} style={{height: height * 0.08, width, alignItems: "center", marginLeft: "5%", flexDirection: "row"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>선택 가능한 옵션 수</Text>
                    </TouchableOpacity>
                    {mustItem === "radio" ?
                        <View style={{height: height * 0.1, width: "90%", flexDirection: "row", marginLeft: "5%"}}>
                            <View style={{height: "70%", width: "25%", justifyContent: "center"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#6B7583" }}>최소선택수</Text>
                            </View>
                            <TouchableOpacity onPress={onChangeMax} style={{height: "70%", width: "75%", backgroundColor: "#FAFAFB", borderRadius: 5, borderWidth: 1, borderColor: "#EFF0F6", alignItems: "center", justifyContent: "space-between", flexDirection: "row", paddingLeft: "5%", paddingRight: "5%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>{textMaxNm}</Text>
                                <ComponentArrowDown1 iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                            </TouchableOpacity>
                            {maxCount &&
                                <ScrollView style={{position: "absolute", left: "25%", top: 0, width: "75%", minHeight: height * 0.07, maxHeight: height * 0.3, backgroundColor: "#E5E7EA", borderRadius: 5, zIndex: 100}}>
                                    {iMinList.map((item,index) => {
                                        return (
                                            <TouchableOpacity key={index} onPress={() => onChangeMaxCount(item)} style={{ height: height * 0.07, width: "100%", alignItems: "center", justifyContent: "space-between", flexDirection: "row", paddingLeft: "5%", paddingRight: "5%", borderBottomColor: "#fff",  borderBottomWidth: 1}}>
                                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>{item.name}</Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </ScrollView>
                            }
                        </View>
                    :
                        <View style={{height: height * 0.1, width: "90%", flexDirection: "row", marginLeft: "5%"}}>
                            <View style={{height: "70%", width: "25%", justifyContent: "center"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#6B7583" }}>최대선택수</Text>
                            </View>
                            <TouchableOpacity onPress={onChangeMax} style={{height: "70%", width: "75%", backgroundColor: "#FAFAFB", borderRadius: 5, borderWidth: 1, borderColor: "#EFF0F6", alignItems: "center", justifyContent: "space-between", flexDirection: "row", paddingLeft: "5%", paddingRight: "5%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>{textMaxNm}</Text>
                                <ComponentArrowDown1 iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                            </TouchableOpacity>
                            {maxCount &&
                                <ScrollView style={{position: "absolute", left: "25%", top: 0, width: "75%", minHeight: height * 0.07, maxHeight: height * 0.3, backgroundColor: "#E5E7EA", borderRadius: 5, zIndex: 100}}>
                                    {iMinList.map((item,index) => {
                                        return (
                                            <TouchableOpacity key={index} onPress={() => onChangeMaxCount(item)} style={{ height: height * 0.07, width: "100%", alignItems: "center", justifyContent: "space-between", flexDirection: "row", paddingLeft: "5%", paddingRight: "5%", borderBottomColor: "#fff",  borderBottomWidth: 1}}>
                                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>{item.name}</Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </ScrollView>
                            }
                        </View>
                    }
                    {(!maxCount && !minCount) &&
                        <>
                            <View style={{height: height * 0.05, width, justifyContent: "flex-start", marginLeft: "5%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>의 옵션을 고객이 선택할 수 있어요.</Text>
                            </View>
                            <View style={{height: height * 0.08, width, justifyContent: "flex-start", marginLeft: "5%"}}>
                                <View style={{height: height * 0.06, width: "90%", alignItems: "flex-start", justifyContent: "center", backgroundColor: "#F2F3F5", borderRadius: 5, paddingLeft: "5%"}}>
                                    <Text style={{fontWeight: "500", fontSize: RFPercentage(1.8), color: "#505866" }}>이 옵션 그룹에는 옵션이 총 {nData.length}개 있습니다.</Text>
                                </View>
                            </View>
                        </>
                    }
                </View>
            </View>
            <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                <TouchableOpacity onPress={addPage} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>다음</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const OptionAddPage4 = ({ fnStopStep, sAnimated, fnPrevStep, fnNextStep, iNm, nData, iMustItem, iMaxNm, iMinNm }) => {
    const [animated] = useState(new Animated.Value(sAnimated));

    const animationStyles = {
        width: animated,
    };
    
    const stopStep = async () => {
        if(fnStopStep !== undefined && typeof fnStopStep === "function"){
            await fnStopStep();
        }
    }
    
    const prevStep = async () => {
        if(fnPrevStep !== undefined && typeof fnPrevStep === "function"){
            await fnPrevStep("step2",width);
        }
    }

    const addPage = async () => {
        if(fnNextStep !== undefined && typeof fnNextStep === "function"){
            await fnNextStep();
        }
    }

    Animated.timing(animated, {
        toValue: width,
        duration: 1000,
        useNativeDriver: false,
    }).start();

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: height * 0.1,
                width: width,
                height: height * 0.9, 
                backgroundColor: "#fff",
                borderTopLeftRadius: width * 0.04, 
                borderTopRightRadius: width * 0.04, 
            }}
        >
            <View style={{height: height * 0.04, width}} />
            <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", justifyContent: "flex-start"}}>
                <Text style={{fontSize: RFPercentage(2.5), fontWeight: '600', color: "#191F28"}}>새 옵션 그룹 추가</Text>
                <TouchableOpacity onPress={prevStep} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", left: 0}}>
                    <ComponentArrowLeft3 iHeight={height * 0.022} iWidth={width * 0.07} iColor={"#6B7583"}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={stopStep} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", right: 0}}>
                    <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                </TouchableOpacity>
            </View>
            <Animated.View style={[{height: height * 0.005, borderBottomColor: "#6490E7", borderBottomWidth: 2 },animationStyles]} />
            <View style={{ flex:1 }}>
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
                                        <Text style={{fontSize: RFPercentage(2.1), fontWeight: '600', color: "#333D4B"}}>최소 1개 최대 {iMaxNm}개</Text>
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
            <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                <TouchableOpacity onPress={addPage} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>완료</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const SubOptionAddPage4 = ({ fnStopStep, sAnimated, fnPrevStep, fnNextStep, iNm, nData, iMustItem, iMaxNm, iMinNm }) => {
    const [animated] = useState(new Animated.Value(sAnimated));

    const animationStyles = {
        width: animated,
    };
    
    const stopStep = async () => {
        if(fnStopStep !== undefined && typeof fnStopStep === "function"){
            await fnStopStep();
        }
    }
    
    const prevStep = async () => {
        if(fnPrevStep !== undefined && typeof fnPrevStep === "function"){
            await fnPrevStep("step3",width);
        }
    }

    const addPage = async () => {
        if(fnNextStep !== undefined && typeof fnNextStep === "function"){
            await fnNextStep();
        }
    }

    Animated.timing(animated, {
        toValue: width,
        duration: 1000,
        useNativeDriver: false,
    }).start();

    return (
        <View style={{ flex:1 }}>
            <View style={{height: height * 0.04, width}} />
            <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", justifyContent: "flex-start"}}>
                <Text style={{fontSize: RFPercentage(2.5), fontWeight: '600', color: "#191F28"}}>새 옵션 그룹 추가</Text>
                <TouchableOpacity onPress={prevStep} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", left: 0}}>
                    <ComponentArrowLeft3 iHeight={height * 0.022} iWidth={width * 0.07} iColor={"#6B7583"}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={stopStep} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", right: 0}}>
                    <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                </TouchableOpacity>
            </View>
            <Animated.View style={[{height: height * 0.005, borderBottomColor: "#6490E7", borderBottomWidth: 2 },animationStyles]} />
            <View style={{ flex:1 }}>
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
                                        <Text style={{fontSize: RFPercentage(2.1), fontWeight: '600', color: "#333D4B"}}>최소 1개 최대 {iMaxNm}개</Text>
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
            <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                <TouchableOpacity onPress={addPage} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>완료</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const OptionListPage = ({ fnSelected, fnAddPage, fnSelectedList, fnStopOption, iOptionList }) => {
    const checkValue = async (sIndex,aIndex,xIndex,zIndex) => {
        if(fnSelected !== undefined && typeof fnSelected === "function"){
            await fnSelected(sIndex,aIndex,xIndex,zIndex);
        }
    }

    const addPage = async () => {
        if(fnAddPage !== undefined && typeof fnAddPage === "function"){
            await fnAddPage();
        }
    }

    const stopOption = async () => {
        if(fnStopOption !== undefined && typeof fnStopOption === "function"){
            await fnStopOption();
        }
    }
    
    const selectedList = async () => {
        if(fnSelectedList !== undefined && typeof fnSelectedList === "function"){
            await fnSelectedList();
        }
    }
    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: height * 0.1,
                width: width,
                height: height * 0.9, 
                backgroundColor: "#fff",
                borderTopLeftRadius: width * 0.04, 
                borderTopRightRadius: width * 0.04, 
            }}
        >
            <View style={{height: height * 0.04, width}} />
            <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", justifyContent: "flex-start"}}>
                <Text style={{fontSize: RFPercentage(2.5), fontWeight: '600', color: "#191F28"}}>옵션 그룹 추가</Text>
                <TouchableOpacity onPress={stopOption} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", right: 0}}>
                    <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                </TouchableOpacity>
            </View>
            <View style={{height: 66, backgroundColor: "#F2F3F5", marginLeft: "5%", marginRight: "5%", borderRadius: 5, justifyContent: "center", paddingLeft: "8%", paddingRight: "8%"}}>
                <Text style={{fontSize: RFPercentage(1.7), fontWeight: '600', color: "#505866"}}>
                    새로운 옵션그룹이 필요하신 경우 
                    <Text style={{fontSize: RFPercentage(1.7), fontWeight: '600', color: "#6490E7"}}> 새 옵션그룹 추가</Text>
                    를 눌러주세요.
                </Text>
            </View>
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <FlatList
                    data={iOptionList}
                    ListFooterComponent={<View style={{ height: height * 0.05, backgroundColor: "#fff" }} />}
                    ListHeaderComponent={<View style={{ height: height * 0.03, backgroundColor: "#fff" }} />}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(data, index) => "list-" + index + Math.random()}
                    renderItem={({ item, index }) => {
                        return (
                            <OptionGroupItem 
                                sData={item}
                                fnCheck={(sIndex,aIndex,xIndex,zIndex) => checkValue(sIndex,aIndex,xIndex,zIndex)}
                            />
                        ) 
                    }}
                />
            </View>
            <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                {iOptionList.length > 0 ?
                    <>
                        <TouchableOpacity onPress={addPage} style={{height: height * 0.07, width: "43%", backgroundColor: "#fff", borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: "4%"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#6490E7"}}>새 옵션그룹 추가</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={selectedList} style={{height: height * 0.07, width: "43%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>적용</Text>
                        </TouchableOpacity>
                    </>
                :
                    <TouchableOpacity onPress={addPage} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>새 옵션그룹 추가</Text>
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

export const SubOptionListPage = ({ fnSelected, fnAddPage, fnSelectedList, fnStopOption, iOptionList }) => {
    const checkValue = async (sIndex,aIndex,xIndex,zIndex) => {
        if(fnSelected !== undefined && typeof fnSelected === "function"){
            await fnSelected(sIndex,aIndex,xIndex,zIndex);
        }
    }

    const addPage = async () => {
        if(fnAddPage !== undefined && typeof fnAddPage === "function"){
            await fnAddPage();
        }
    }

    const stopOption = async () => {
        if(fnStopOption !== undefined && typeof fnStopOption === "function"){
            await fnStopOption();
        }
    }
    
    const selectedList = async () => {
        if(fnSelectedList !== undefined && typeof fnSelectedList === "function"){
            await fnSelectedList();
        }
    }
    return (
        <View style={{flex:1}}>
            <View style={{height: height * 0.04, width}} />
            <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", justifyContent: "flex-start"}}>
                <Text style={{fontSize: RFPercentage(2.5), fontWeight: '600', color: "#191F28"}}>옵션 그룹 추가</Text>
                <TouchableOpacity onPress={stopOption} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", right: 0}}>
                    <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                </TouchableOpacity>
            </View>
            <View style={{height: 66, backgroundColor: "#F2F3F5", marginLeft: "5%", marginRight: "5%", borderRadius: 5, justifyContent: "center", paddingLeft: "8%", paddingRight: "8%"}}>
                <Text style={{fontSize: RFPercentage(1.7), fontWeight: '600', color: "#505866"}}>
                    새로운 옵션그룹이 필요하신 경우 
                    <Text style={{fontSize: RFPercentage(1.7), fontWeight: '600', color: "#6490E7"}}> 새 옵션그룹 추가</Text>
                    를 눌러주세요.
                </Text>
            </View>
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <FlatList
                    data={iOptionList}
                    ListFooterComponent={<View style={{ height: height * 0.05, backgroundColor: "#fff" }} />}
                    ListHeaderComponent={<View style={{ height: height * 0.03, backgroundColor: "#fff" }} />}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={{height: height * 0.03, backgroundColor: "#fff"}}/>
                        )
                    }}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(data, index) => "list-" + index + Math.random()}
                    renderItem={({ item, index }) => {
                        return (
                            <OptionGroupItem 
                                sData={item}
                                fnCheck={(sIndex,aIndex,xIndex,zIndex) => checkValue(sIndex,aIndex,xIndex,zIndex)}
                            />
                        ) 
                    }}
                />
            </View>
            <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                {iOptionList.length > 0 ?
                    <>
                        <TouchableOpacity onPress={addPage} style={{height: height * 0.07, width: "43%", backgroundColor: "#fff", borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: "4%"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#6490E7"}}>새 옵션그룹 추가</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={selectedList} style={{height: height * 0.07, width: "43%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>적용</Text>
                        </TouchableOpacity>
                    </>
                :
                    <TouchableOpacity onPress={addPage} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>새 옵션그룹 추가</Text>
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}


export const ModalLastOption = ({fnReturnPrev,fnInsertDone}) => {
    const [sNm, setNm] = useState("");
    const [sPrice, setPrice] = useState(null);

    const [iData, setData] = useState([]);
    const sData = useRef([]);

    const returnPrev = async () => {
        if(fnReturnPrev !== undefined && typeof fnReturnPrev === "function"){
            await fnReturnPrev();
        }
    };
    
    const insertDone = async () => {
        if(sData.current.length > 0){
            if(fnInsertDone !== undefined && typeof fnInsertDone === "function"){
                await fnInsertDone(sData.current);
            }
        }
    };

    const insertOption = () => {
        if(sNm !== ""){
            const xData = {
                key : parseInt(sData.current.length) + 1,
                name : sNm,
                price : parseInt(sPrice)
            }
            setData([...sData.current, xData]);
            sData.current = [...sData.current, xData];
        }
    };

    const onChangeNm = text => {
        setNm(text);
    };
    
    const onChangePrice = text => {
        const sTemp = text;
        const regex = /[0-9]+$/gi;
        if(sTemp === "" || sTemp === null){
            setPrice(text);
        } else {
            if (regex.test(sTemp)) {
                setPrice(text);
            }
        }
    };

    const deleteList = (key) => {
        let tempList = sData.current;
        sData.current = tempList.filter((item) => item.key !== parseInt(key));
        setData(tempList.filter((item) => item.key !== parseInt(key)));
    }

    return (
        <>
            <View style={{flex: 1, paddingTop: "7%"}}>
                <View style={{height: height * 0.05, justifyContent: "center", alignItems: "center", borderBottomWidth: 1, marginLeft: "5%", marginRight: "5%", borderBottomColor: "#bbb"}}>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#000" }}>옵션 그룹 추가</Text>
                </View>
                <View style={{height: height * 0.1, justifyContent: "center", alignItems: "center"}}>
                    <TextInput
                        placeholder="옵션명"
                        placeholderTextColor="#A1A1A1"
                        onChangeText={text => onChangeNm(text)}
                        value={sNm}
                        style={{
                            width: "90%",
                            height: "60%",
                            fontSize: RFPercentage(2),
                            borderColor: "#F45552",
                            fontWeight: '600',
                            backgroundColor: '#F1F3F7',
                            textAlign: 'center',
                            borderRadius: 10,
                            color: "#000"
                        }}
                    />
                </View>
                <View style={{height: height * 0.08, justifyContent: "center", alignItems: "center"}}>
                    <TextInput
                        placeholder="옵션가격"
                        placeholderTextColor="#A1A1A1"
                        onChangeText={text => onChangePrice(text)}
                        value={sPrice}
                        style={{
                            width: "90%",
                            height: "80%",
                            fontSize: RFPercentage(2),
                            borderColor: "#F45552",
                            fontWeight: '600',
                            backgroundColor: '#F1F3F7',
                            textAlign: 'center',
                            borderRadius: 10,
                            color: "#000"
                        }}
                    />
                </View>
                <View style={{flex:1, marginTop: "5%", backgroundColor: "#fff"}}>
                    <FlatList
                        data={iData}
                        ListFooterComponent={<View style={{ height: height * 0.05 }} />}
                        ListHeaderComponent={<View style={{ height: height * 0.05, borderTopColor: "#dfdfdf", borderTopWidth: 1, marginLeft: "5%", marginRight: "5%" }} />}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(data, index) => "list-" + index + Math.random()}
                        ItemSeparatorComponent={() => {
                            return (
                                <View style={{height: height * 0.03}}/>
                            )
                        }}
                        ListEmptyComponent={
                            <View style={{height: height * 0.1, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontWeight: "400", fontSize: RFPercentage(1.7), color: "#bbb"}}>옵션명, 옵션가격을 입력하고 옵션추가를 눌러주세요</Text>
                            </View>
                        }
                        renderItem={({ item, index }) => {
                            return (
                                <View 
                                style={{
                                    height: height * 0.07, backgroundColor: "#f0f6fc", marginLeft: "5%", marginRight: "5%", borderRadius: 10,
                                    shadowColor: "#dfdfdf",
                                    shadowOpacity: 0.5,
                                    shadowRadius: 5,
                                    shadowOffset: {
                                        height: 3,
                                        width: 1
                                    },
                                    flexDirection: "row"
                                }}
                                >
                                    <View style={{width: "60%", justifyContent: "center", paddingLeft: "5%", alignItems: "flex-start"}}>
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#000"}}>{item.name}</Text>
                                    </View>
                                    <View style={{width: "20%", justifyContent: "center", alignItems: "flex-end"}}>
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#000"}}>{item.price} 원</Text>
                                    </View>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => deleteList(item.key)} style={{width: "20%", justifyContent: "center", alignItems: "center"}}>
                                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.7), color: "#F45552"}}>삭제</Text>
                                    </TouchableOpacity>
                                    
                                </View>
                            ) 
                        }}
                    />
                </View>
            </View>
            <View style={{height : height * 0.22, justifyContent: "center", alignItems: "center"}}>
                {sData.current.length > 0 ?
                    <>
                        <View style={{width: "85%", height: "30%", flexDirection: "row", marginBottom: "3%", marginTop: "3%"}}>
                            <TouchableOpacity activeOpacity={0.8} onPress={returnPrev} style={{width: "47.5%", height: "100%", borderColor: "#F45552", marginRight: "5%", borderWidth: 1, borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#F45552" }}>이전</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} onPress={insertOption} style={{width: "47.5%", height: "100%", borderColor: "#6490E8",borderWidth: 1, borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#6490E8" }}>옵션 추가</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity activeOpacity={0.8} onPress={insertDone} style={{width: "85%", height: "30%", backgroundColor: "#6490E8", borderRadius: 10, justifyContent: "center", alignItems: "center", marginBottom: "5%"}}>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>완료</Text>
                        </TouchableOpacity>
                    </>
                    :
                    <>
                        <TouchableOpacity activeOpacity={0.8} onPress={returnPrev} style={{width: "85%", height: "30%", borderColor: "#6490E8",borderWidth: 1, borderRadius: 10, justifyContent: "center", alignItems: "center", marginBottom: "3%", marginTop: "3%"}}>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#6490E8" }}>이전</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} onPress={insertOption} style={{width: "85%", height: "30%", backgroundColor: "#6490E8", borderRadius: 10, justifyContent: "center", alignItems: "center", marginBottom: "5%"}}>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>옵션 추가</Text>
                        </TouchableOpacity>
                    </>
                }
            </View>
        </>
    )
}


export const ModalAddOption = ({ fnCancel, fnNextLevel, iNm, iCount, iMustItem, iSelectBoxText }) => {
    const [sNm, setNm] = useState("");
    const [sCount, setCount] = useState(1);
    const [selectBoxText, setSelectBoxText] = useState("최소선택수");
    const [mustItem, setMustItem] = useState("radio");
    const [textNm, setTextNm] = useState("1개");
    
    const [classNm, setClassNm] = useState(false);

    const onChangeNm = text => {
        setNm(text);
        setClassNm(false);
    };

    const cancelAdd = async () => {
        if(fnCancel !== undefined && typeof fnCancel === "function"){
            await fnCancel();
        }
    };
    
    const nextLevel = async () => {
        if(sNm !== ""){
            if(fnNextLevel !== undefined && typeof fnNextLevel === "function"){
                await fnNextLevel(sNm,sCount,selectBoxText,mustItem);
            }
        } else {
            setClassNm(true);
        }
    };

    useEffect(() => {
        setNm(iNm);
        setCount(iCount);
        setSelectBoxText(iSelectBoxText);
        setTextNm(iCount.toString() + "개");
        setMustItem(iMustItem);
    }, [iNm,iCount,iMustItem,iSelectBoxText]);

    return (
        <>
            <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={{flex: 1, paddingTop: "7%"}}>
                <View style={{height: height * 0.05, justifyContent: "center", alignItems: "center", borderBottomWidth: 1, marginLeft: "5%", marginRight: "5%", borderBottomColor: "#bbb"}}>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#000" }}>옵션 그룹 추가</Text>
                </View>
                <View style={{height: height * 0.1, justifyContent: "center", alignItems: "center"}}>
                    <TextInput
                        placeholder="옵션그룹명"
                        placeholderTextColor="#A1A1A1"
                        onChangeText={text => onChangeNm(text)}
                        value={sNm}
                        style={{
                            width: "90%",
                            height: "60%",
                            fontSize: RFPercentage(2),
                            borderColor: "#F45552",
                            borderWidth: classNm ? 1 : 0,
                            fontWeight: '600',
                            backgroundColor: '#F1F3F7',
                            textAlign: 'center',
                            borderRadius: 10,
                            color: "#000"
                        }}
                    />
                </View>
                <View style={{height: height * 0.08, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                    <TouchableOpacity 
                        activeOpacity={0.8}
                        onPress={() => {
                            setSelectBoxText("최소선택수")
                            setMustItem("radio")
                        }}
                            
                        style={{
                            width: "43%",
                            marginRight: "3%",
                            height: "80%",
                            backgroundColor: mustItem === "radio" ? '#6490E8' : "#F1F3F7",
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: mustItem === "radio" ? '#fff' : "#bbb" }}>선택해야 주문가능</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        activeOpacity={0.8}
                        onPress={() => {
                            setSelectBoxText("최대선택수")
                            setMustItem("checkbox")
                        }}
                        style={{
                            width: "43%",
                            height: "80%",
                            backgroundColor: mustItem === "checkbox" ? '#6490E8' : "#F1F3F7",
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: mustItem === "checkbox"  ? '#fff' : "#bbb" }}>선택안해도 주문가능</Text>
                    </TouchableOpacity>
                </View>

                <View style={{height: height * 0.1, justifyContent: "center", alignItems: "center"}}>
                    <View style={{ width: "90%", height: "40%",justifyContent: "center"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#6b7684" }}>{selectBoxText}</Text>
                    </View>
                    <SelectDropdown
                        defaultButtonText={textNm}
                        buttonStyle={{
                            width: "90%",
                            height: "60%",
                            backgroundColor: "#F1F3F7",
                            borderRadius: 10,
                        }}
                        buttonTextStyle={{
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: RFPercentage(2),
                            fontWeight: '600',
                        }}
                        dropdownStyle={{
                            backgroundColor: "#fff",
                            borderRadius: 10,
                        }}
                        data={sMinList}
                        onSelect={(selectedItem, index) => {
                            setCount(index + 1);
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem
                        }}
                        rowTextForSelection={(item, index) => {
                            return item
                        }}
                    />
                </View>
            </TouchableOpacity>
            <View style={{height : height * 0.15, justifyContent: "center", alignItems: "center"}}>
                <View style={{width: "85%", height: "40%", flexDirection: "row", marginBottom: "3%"}}>
                    <TouchableOpacity activeOpacity={0.8} onPress={cancelAdd} style={{width: "47.5%", height: "100%", borderColor: "#F45552", marginRight: "5%", borderWidth: 1, borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#F45552" }}>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={nextLevel} style={{width: "47.5%", height: "100%", backgroundColor: "#6490E8", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>다음</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

export const ModalOptionList = ({iList,fnSelected,fnDone,fnChangeState}) => {
    const [sList, setList] = useState([]);

    const checkValue = async (sIndex,aIndex,xIndex) => {
        if(fnSelected !== undefined && typeof fnSelected === "function"){
            await fnSelected(sIndex,aIndex,xIndex);
        }
    }
    
    const selectValue = async () => {
        if(fnDone !== undefined && typeof fnDone === "function"){
            await fnDone();
        }
    }

    const changeState = async () => {
        if(fnChangeState !== undefined && typeof fnChangeState === "function"){
            await fnChangeState();
        }
    }
    
    useEffect(() => {
        setList(iList);
    }, [iList]);

    return (
        <>
            <View style={{flex: 1, paddingTop: "7%"}}>
                <View style={{height: height * 0.05, justifyContent: "center", alignItems: "center", borderBottomWidth: 1, marginLeft: "5%", marginRight: "5%", borderBottomColor: "#bbb"}}>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#000" }}>옵션 추가</Text>
                </View>
                
                <FlatList
                    data={sList}
                    ListFooterComponent={<View style={{ height: height * 0.01 }} />}
                    ListHeaderComponent={
                        <View style={{height: height * 0.1, backgroundColor: "#f0f6fc", justifyContent: "center", margin: "5%"}}>
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#6b7684", textAlign: "left", marginLeft: "5%" }}>
                                ※ 원하시는 옵션을 선택하고 
                                <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#6490E8", textAlign: "left", marginLeft: "5%" }}>
                                    '확인'
                                </Text>
                                버튼을 눌러주세요
                            </Text>
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#6b7684", textAlign: "left", marginLeft: "5%" }}>
                                ※ 옵션그룹을 추가시
                                <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#6490E8", textAlign: "left", marginLeft: "5%" }}>
                                    '새 옵션그룹 추가'
                                </Text>
                                를 선택하세요
                            </Text>
                        </View>
                    }
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(data, index) => "list-" + index + Math.random()}
                    renderItem={({ item, index }) => {
                        return (
                            <OptionGroup 
                                sKey={index}
                                sData={item}
                                fnCheck={(sIndex,aIndex,xIndex) => checkValue(sIndex,aIndex,xIndex)}
                            />
                        ) 
                    }}
                />
            </View>
            <View style={{height : height * 0.15, justifyContent: "center", alignItems: "center"}}>
                <View style={{width: "85%", height: "40%", flexDirection: "row", marginBottom: "3%"}}>
                    <TouchableOpacity activeOpacity={0.8} onPress={changeState} style={{width: "47.5%", height: "100%", borderColor: "#6490E8", marginRight: "5%", borderWidth: 1, borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#6490E8" }}>새 옵션그룹 추가</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={selectValue} style={{width: "47.5%", height: "100%", backgroundColor: "#6490E8", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

export const CompModalTimeListStep1 = ({ fnNextValue, sValue }) => {
    const [isLoading, setLoading] = useState(true);

    const [startHour, setStartHour] = useState('00');
    const [startHourNm, setStartHourNm] = useState('00시');
    const [startMin, setStartMin] = useState('00');
    const [startMinNm, setStartMinNm] = useState('00분');

    const [endHour, setEndHour] = useState("01");
    const [endHourNm, setEndHourNm] = useState("01시");
    const [endHourList, setEndHourList] = useState([]);

    const changeStartHourValue = async (sIndex) => {
        setLoading(true);

        const tempHour = parseInt(sIndex.value) + 1;
        const temp = sIndex.value;
        let tempList = [];
        if(parseInt(sIndex.value) === 23){
            tempList = [{
                key: 23,
                value: "23",
                name: "23시",
            }];
        } else {
            const reGenerater = await generaterAsync(tempHour,"arrange");
            tempList = reGenerater;
        }
        if(parseInt(endHour) <= parseInt(temp)){
            if(parseInt(temp) < 9){
                setEndHour("0" + (parseInt(temp) + 1).toString());
                setEndHourNm("0" + (parseInt(temp) + 1).toString() + "시");
            } else if(parseInt(temp) === 23){
                setEndHour(parseInt(temp).toString());
                setEndHourNm(parseInt(temp).toString() + "시");
            } else {
                setEndHour((parseInt(temp) + 1).toString());
                setEndHourNm((parseInt(temp) + 1).toString() + "시");
            }
        }
        
        setEndHourList(tempList);
        setStartHour(temp);
        setStartHourNm(sIndex.name);
        setLoading(false);
    }

    const selectMin = (sIndex) => {
        setLoading(true);
        setStartMin(sIndex.value);
        setStartMinNm(sIndex.name);
        setLoading(false);
    }

    const nextValue = async () => {
        if(fnNextValue !== undefined && typeof fnNextValue === "function"){
            await fnNextValue(startHour,startHourNm,startMin,startMinNm,endHour,endHourNm,endHourList);
        }
    }

    const setEndHoursList = async () => {
        const temp = await generaterAsync(1,"endlist");
        setEndHourList(temp);
    }

    useEffect(() => {
        setEndHoursList();
    }, []);

    useEffect(() => {
        setStartHour(sValue.startHour);
        setStartHourNm(sValue.startHourNm);
        setStartMin(sValue.startMin);
        setStartMinNm(sValue.startMinNm);
        setLoading(false);
    }, [sValue]);

    return (
        <View style={{flex:1, padding: "5%"}}>
            <View style={{height: height * 0.01, justifyContent: "center", alignItems: "center" }} />
            <View style={{flex:1,flexDirection: "row"}}>
                {isLoading ?
                    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                        <LottieView style={{width: width * 0.5, height: width * 0.5 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                    </View>
                :
                    <>
                    <View style={{width: width * 0.3}}>
                        <View style={{ height: width * 0.05 }} />
                        <View style={{height: height * 0.08, width: "100%", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{fontSize: RFPercentage(1.9), fontWeight: '600', color: "#000" }}>시작시간</Text>
                        </View>
                        <View style={{height: height * 0.08, width: "100%", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{fontSize: RFPercentage(1.9), fontWeight: '800', color: "#353538" }}>{startHourNm} ~ {startMinNm}</Text>
                        </View>
                    </View>
                    <FlatList
                        data={startHourList}
                        ListFooterComponent={<View style={{ height: width * 0.2 }} />}
                        ListHeaderComponent={<View style={{ height: width * 0.05 }} />}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(data, index) => "list-" + index + Math.random()}
                        ItemSeparatorComponent={() => {
                            return (
                                <View style={{height: height * 0.03}}/>
                            )
                        }}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{height: height * 0.08, width: "100%", justifyContent: "center", alignItems: "flex-end" }}>
                                    <TouchableOpacity onPress={() => changeStartHourValue(item)} style={{width: "40%", height: "70%", justifyContent: "center", backgroundColor: startHourNm === item.name ? "#C9CCD3" : "#fff", borderRadius: width * 0.02, alignItems: "center"}}>
                                        <Text style={{fontSize: RFPercentage(1.9), fontWeight: '600', color: "#000" }}>{item.name}</Text>
                                    </TouchableOpacity>
                                </View>
                            ) 
                        }}
                    />
                    <FlatList
                        data={minuteList}
                        ListFooterComponent={<View style={{ height: width * 0.2 }} />}
                        ListHeaderComponent={<View style={{ height: width * 0.05 }} />}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(data, index) => "list-" + index + Math.random()}
                        ItemSeparatorComponent={() => {
                            return (
                                <View style={{height: height * 0.03}}/>
                            )
                        }}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{height: height * 0.08, width: "100%", justifyContent: "center", alignItems: "center" }}>
                                    <TouchableOpacity onPress={() => selectMin(item)} style={{width: "40%", height: "70%", justifyContent: "center", backgroundColor: startMinNm === item.name ? "#C9CCD3" : "#fff", borderRadius: width * 0.02, alignItems: "center"}}>
                                        <Text style={{fontSize: RFPercentage(1.9), fontWeight: '600', color: "#000" }}>{item.name}</Text>
                                    </TouchableOpacity>
                                </View>
                            ) 
                        }}
                    />
                    </>
                }
            </View>
            <View style={{height: height * 0.05}} />
            <View style={{height : height * 0.1, justifyContent: "center", alignItems: "center"}}>
                <TouchableOpacity onPress={nextValue} activeOpacity={0.8} style={{width: "100%", height: "70%", marginBottom: "3%", backgroundColor: "#6490E8", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>다음</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}


export const CompModalTimeListStep2 = ({ fnNextValue, fnReturn, sEndHour, sEndHourNm, sEndHourList }) => {
    const [isLoading, setLoading] = useState(true);

    const [endHour, setEndHour] = useState("01");
    const [endHourNm, setEndHourNm] = useState("01시");
    const [endMin, setEndMin] = useState('00');
    const [endMinNm, setEndMinNm] = useState('00분');

    const [endHourList, setEndHourList] = useState([]);

    const selectHour = (sIndex) => {
        setEndHour(sIndex.value);
        setEndHourNm(sIndex.name);
    }

    const selectMin = (sIndex) => {

        setEndMin(sIndex.value);
        setEndMinNm(sIndex.name);
    }

    const nextValue = async () => {
        if(fnNextValue !== undefined && typeof fnNextValue === "function"){
            await fnNextValue(endHour,endHourNm,endMin,endMinNm);
        }
    }

    const returnPage = async () => {
        if(fnReturn !== undefined && typeof fnReturn === "function"){
            await fnReturn();
        }
    }

    useEffect(() => {
        setEndHour(sEndHour);
        setEndHourNm(sEndHourNm);
        setEndHourList(sEndHourList);
        setLoading(false);
    }, [sEndHour, sEndHourNm, sEndHourList]);

    return (
        <View style={{flex:1, padding: "5%"}}>
            <View style={{height: height * 0.01, justifyContent: "center", alignItems: "center" }} />
            <View style={{flex:1,flexDirection: "row"}}>
                {isLoading ?
                    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                        <LottieView style={{width: width * 0.5, height: width * 0.5 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                    </View>
                :
                <>
                    <View style={{width: width * 0.3}}>
                        <View style={{ height: width * 0.05 }} />
                        <View style={{height: height * 0.08, width: "100%", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{fontSize: RFPercentage(1.9), fontWeight: '600', color: "#000" }}>끝나는시간</Text>
                        </View>
                        <View style={{height: height * 0.08, width: "100%", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{fontSize: RFPercentage(1.9), fontWeight: '800', color: "#353538" }}>{endHourNm} ~ {endMinNm}</Text>
                        </View>
                    </View>
                    <FlatList
                        data={endHourList}
                        contentContainerStyle={{width: width * 0.35}}
                        ListFooterComponent={<View style={{ height: width * 0.2 }} />}
                        ListHeaderComponent={<View style={{ height: width * 0.05 }} />}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(data, index) => "list-" + index + Math.random()}
                        ItemSeparatorComponent={() => {
                            return (
                                <View style={{height: height * 0.03}}/>
                            )
                        }}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{height: height * 0.08, width: "85%", justifyContent: "center", alignItems: "flex-end" }}>
                                    <TouchableOpacity onPress={() => selectHour(item)} style={{width: "50%", height: "70%", justifyContent: "center", backgroundColor: endHourNm === item.name ? "#C9CCD3" : "#fff", borderRadius: width * 0.02, alignItems: "center"}}>
                                        <Text style={{fontSize: RFPercentage(1.9), fontWeight: '600', color: "#000" }}>{item.name}</Text>
                                    </TouchableOpacity>
                                </View>
                            ) 
                        }}
                    />
                    <FlatList
                        contentContainerStyle={{width: width * 0.35}}
                        data={minuteList}
                        ListFooterComponent={<View style={{ height: width * 0.2 }} />}
                        ListHeaderComponent={<View style={{ height: width * 0.05 }} />}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(data, index) => "list-" + index + Math.random()}
                        ItemSeparatorComponent={() => {
                            return (
                                <View style={{height: height * 0.03}}/>
                            )
                        }}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{height: height * 0.08, width: "95%", justifyContent: "center", alignItems: "center" }}>
                                    <TouchableOpacity onPress={() => selectMin(item)} style={{width: "40%", height: "70%", justifyContent: "center", backgroundColor: endMinNm === item.name ? "#C9CCD3" : "#fff", borderRadius: width * 0.02, alignItems: "center"}}>
                                        <Text style={{fontSize: RFPercentage(1.9), fontWeight: '600', color: "#000" }}>{item.name}</Text>
                                    </TouchableOpacity>
                                </View>
                            ) 
                        }}
                    />
                </>
                }
            </View>
            <View style={{height: height * 0.05}} />
            <View style={{height : height * 0.1, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                <TouchableOpacity onPress={returnPage} activeOpacity={0.8} style={{width: "45%", height: "70%", marginBottom: "3%", backgroundColor: "#F2F3F5", borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: "3%"}}>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#4E5867" }}>이전</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={nextValue} activeOpacity={0.8} style={{width: "45%", height: "70%", marginBottom: "3%", backgroundColor: "#6490E8", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>완료</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const MainTypeContent = ({ fnSelectValue, sMainType }) => {
    const [mainTypeNm, setMainTypeNm] = useState("");

    const selectValue = async (sIndex) => {
        if(fnSelectValue !== undefined && typeof fnSelectValue === "function"){
            setMainTypeNm(sIndex.name);
            await fnSelectValue(sIndex);
        }
    }

    useEffect(() => {
        if(sMainType !== undefined && sMainType.name !== undefined){
            setMainTypeNm(sMainType.name);
        }
    }, [sMainType]);

    return (
        <>
        <View style={{flex: 1, padding: "7%"}}>
            <View style={{height: height * 0.05, justifyContent: "center", alignItems: "center", borderBottomWidth: 1, marginLeft: "5%", marginRight: "5%", borderBottomColor: "#bbb"}}>
                <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#000" }}>주업종 선택</Text>
            </View>
            <FlatList
                data={typeList}
                ListHeaderComponent={<View style={{ height: height * 0.05 }} />}
                showsVerticalScrollIndicator={false}
                keyExtractor={(data, index) => "list-" + index + Math.random()}
                ItemSeparatorComponent={() => {
                    return (
                        <View style={{height: height * 0.03}}/>
                    )
                }}
                renderItem={({ item, index }) => {
                     return (
                        <TouchableOpacity onPress={() => selectValue(item)} style={{height: height * 0.08, backgroundColor: "#fff", width: "100%", borderRadius: 10, flexDirection: "row"}}>
                            <View style={{flex: 0.7, justifyContent: "center", paddingLeft: "5%"}}>
                                <Text style={{fontSize: RFPercentage(1.9), fontWeight: '600', color: "#000" }}>{item.name}</Text>
                            </View>
                            <View style={{flex: 0.3, justifyContent: "center", alignItems: "center", marginRight: "5%"}}>
                                <View style={{height: width * 0.07, width: width * 0.07,  justifyContent: "center", alignItems: "center"}}>
                                    {item.name === mainTypeNm ?
                                        <ComponentCheckCircle iHeight={height * 0.03} iWidth={width * 0.08} iColor={"#6490E8"}/>
                                        :
                                        <ComponentCircle iHeight={height * 0.03} iWidth={width * 0.08} iColor={"#6490E8"}/>
                                    }
                                </View>
                            </View>
                        </TouchableOpacity>
                    ) 
                }}
            />
        </View>
        </>
    )
}

export const MainTypePage = ({ sNext, sCancel }) => {
    const closeModal = async () => {
        if(sCancel !== undefined && typeof sCancel === "function"){
            await sCancel();
        }
    }

    const selectedValue = async (sIndex,aIndex) => {
        if(sNext !== undefined && typeof sNext === "function"){
            await sNext(sIndex,aIndex);
        }
    }

    return (
        <View style={{flex: 1, padding: "7%"}}>
            <View style={{height: height * 0.07, backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.4), color: "#191F28" }}>주업종을 선택하세요</Text>
                <TouchableOpacity onPress={closeModal} style={{height: height * 0.025, width: width * 0.05}}>
                    <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.05} iColor={"#646970"}/>
                </TouchableOpacity>
            </View>
            <View style={{flex:1, backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-between"}}>
                <TouchableOpacity onPress={() => selectedValue("음식점",1)} style={{height: width * 0.2, width: width * 0.26, backgroundColor: "#FAFAFB", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <ComponentResturant iHeight={height * 0.025} iWidth={height * 0.05} iColor={"#646970"}/>
                    <Text style={{fontSize: RFPercentage(1.7), fontWeight: '600', color: "#191F28", marginTop: "10%" }}>음식점</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectedValue("카페",2)} style={{height: width * 0.2, width: width * 0.26, backgroundColor: "#FAFAFB", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <ComponentCafe iHeight={height * 0.025} iWidth={height * 0.05} iColor={"#646970"}/>
                    <Text style={{fontSize: RFPercentage(1.7), fontWeight: '600', color: "#191F28", marginTop: "10%" }}>카페</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectedValue("샵",3)} style={{height: width * 0.2, width: width * 0.26, backgroundColor: "#FAFAFB", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <ComponentShop iHeight={height * 0.025} iWidth={height * 0.05} iColor={"#646970"}/>
                    <Text style={{fontSize: RFPercentage(1.7), fontWeight: '600', color: "#191F28", marginTop: "10%" }}>샵</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const SubTypePage = ({ sMainType, sCancel, sNext }) => {
    const [iMainType, setMainType] = useState(sMainType);

    const closeModal = async () => {
        if(sCancel !== undefined && typeof sCancel === "function"){
            await sCancel();
        }
    }

    const selectedValue = async (sIndex,aIndex) => {
        if(sNext !== undefined && typeof sNext === "function"){
            await sNext(sIndex,aIndex);
        }
    }

    return (
        <View style={{flex: 1, padding: "7%"}}>
            <View style={{height: height * 0.07, backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.4), color: "#191F28" }}>주업종을 선택하세요</Text>
                <TouchableOpacity onPress={closeModal} style={{height: height * 0.025, width: width * 0.05}}>
                    <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.05} iColor={"#646970"}/>
                </TouchableOpacity>
            </View>
            <View style={{flex:1, backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-between"}}>
                {iMainType.toString() !== "1" &&
                    <TouchableOpacity onPress={() => selectedValue("음식점",1)} style={{height: width * 0.2, width: width * 0.26, backgroundColor: "#FAFAFB", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                        <ComponentResturant iHeight={height * 0.025} iWidth={height * 0.05} iColor={"#646970"}/>
                        <Text style={{fontSize: RFPercentage(1.7), fontWeight: '600', color: "#191F28", marginTop: "10%" }}>음식점</Text>
                    </TouchableOpacity>
                }
                {iMainType.toString() !== "2" &&
                    <TouchableOpacity onPress={() => selectedValue("카페",2)} style={{height: width * 0.2, width: width * 0.26, backgroundColor: "#FAFAFB", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                        <ComponentCafe iHeight={height * 0.025} iWidth={height * 0.05} iColor={"#646970"}/>
                        <Text style={{fontSize: RFPercentage(1.7), fontWeight: '600', color: "#191F28", marginTop: "10%" }}>카페</Text>
                    </TouchableOpacity>
                }
                {iMainType.toString() !== "3" &&
                    <TouchableOpacity onPress={() => selectedValue("샵",3)} style={{height: width * 0.2, width: width * 0.26, backgroundColor: "#FAFAFB", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                        <ComponentShop iHeight={height * 0.025} iWidth={height * 0.05} iColor={"#646970"}/>
                        <Text style={{fontSize: RFPercentage(1.7), fontWeight: '600', color: "#191F28", marginTop: "10%" }}>샵</Text>
                    </TouchableOpacity>
                }
                {iMainType.toString() !== "4" &&
                    <TouchableOpacity onPress={() => selectedValue("선택안함",4)} style={{height: width * 0.2, width: width * 0.26, backgroundColor: "#FAFAFB", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                        <ComponentUnSelected iHeight={height * 0.025} iWidth={height * 0.05} iColor={"#646970"}/>
                        <Text style={{fontSize: RFPercentage(1.7), fontWeight: '600', color: "#191F28", marginTop: "10%" }}>선택안함</Text>
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

export const MainTypeSelectPage = ({ fnSelected, sCancel, iList, fnNextToSubType, iStep }) => {
    const closeModal = async () => {
        if(sCancel !== undefined && typeof sCancel === "function"){
            await sCancel();
        }
    }

    const nextToSubType = async () => {
        if(fnNextToSubType !== undefined && typeof fnNextToSubType === "function"){
            await fnNextToSubType();
        }
    }

    const checkValue = async (sIndex,aIndex,xIndex) => {
        if(fnSelected !== undefined && typeof fnSelected === "function"){
            await fnSelected(sIndex,aIndex,xIndex);
        }
    }

    return (
        <View style={{flex: 1, padding: "7%"}}>
            <View style={{height: height * 0.07, backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.4), color: "#191F28" }}>해당되는 업종을 모두 선택하세요</Text>
                <TouchableOpacity onPress={closeModal} style={{height: height * 0.025, width: width * 0.05}}>
                    <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.05} iColor={"#646970"}/>
                </TouchableOpacity>
            </View>
            <View style={{flex:1, backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-between"}}>
                <FlatList
                    data={iList}
                    numColumns={4}
                    ListFooterComponent={<View style={{ height: height * 0.03 }} />}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(data, index) => "list-" + index + Math.random()}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={{height: height * 0.015}}/>
                        )
                    }}
                    renderItem={({ item, index }) => {
                        return (
                            <>
                            {item.name !== undefined && item.name !== null && item.name !== "" &&
                                <TypeItems 
                                    sData={item}
                                    fnCheck={(sIndex,aIndex,xIndex) => checkValue(sIndex,aIndex,xIndex)}
                                />
                                
                            }
                            </>
                        ) 
                    }}
                />
            </View>
            <View style={{height: height * 0.12, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                <TouchableOpacity onPress={nextToSubType} style={{height: height * 0.07, backgroundColor: "#6490E7", width: "100%", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '600', color: "#fff"}}>{iStep !== "total" ? "완료" : "다음"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const MainTypeSelectedPage = ({ iList, iOptionBox, fnSelected, fnNextToSubType, sCancel }) => {
    const closeModal = async () => {
        if(sCancel !== undefined && typeof sCancel === "function"){
            await sCancel();
        }
    }

    const nextToSubType = async () => {
        if(fnNextToSubType !== undefined && typeof fnNextToSubType === "function"){
            await fnNextToSubType();
        }
    }

    const checkValue = async (sIndex,aIndex,xIndex) => {
        if(fnSelected !== undefined && typeof fnSelected === "function"){
            await fnSelected(sIndex,aIndex,xIndex);
        }
    }

    return (
        <View style={{flex: 1, padding: "7%"}}>
            <View style={{height: height * 0.07, backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.4), color: "#191F28" }}>해당되는 업종을 모두 선택하세요</Text>
                <TouchableOpacity onPress={closeModal} style={{height: height * 0.025, width: width * 0.05}}>
                    <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.05} iColor={"#646970"}/>
                </TouchableOpacity>
            </View>
            <View style={{flex:1, backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-between"}}>
                <FlatList
                    data={iList}
                    numColumns={4}
                    ListFooterComponent={<View style={{ height: height * 0.03 }} />}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(data, index) => "list-" + index + Math.random()}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={{height: height * 0.015}}/>
                        )
                    }}
                    renderItem={({ item, index }) => {
                        return (
                            <>
                            {item.name !== undefined && item.name !== null && item.name !== "" &&
                                <TypeSelectedItems 
                                    sData={item}
                                    iData={iOptionBox}
                                    fnCheck={(sIndex,aIndex,xIndex) => checkValue(sIndex,aIndex,xIndex)}
                                />
                                
                            }
                            </>
                        ) 
                    }}
                />
            </View>
            <View style={{height: height * 0.12, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                <TouchableOpacity onPress={nextToSubType} style={{height: height * 0.07, backgroundColor: "#6490E7", width: "100%", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '600', color: "#fff"}}>완료</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const SubTypeSelectPage = ({ fnSelected, sCancel, iList, fnNextToSubType }) => {
    const closeModal = async () => {
        if(sCancel !== undefined && typeof sCancel === "function"){
            await sCancel();
        }
    }

    const nextToSubType = async () => {
        if(fnNextToSubType !== undefined && typeof fnNextToSubType === "function"){
            await fnNextToSubType();
        }
    }

    const checkValue = async (sIndex,aIndex,xIndex) => {
        if(fnSelected !== undefined && typeof fnSelected === "function"){
            await fnSelected(sIndex,aIndex,xIndex);
        }
    }

    return (
        <View style={{flex: 1, padding: "7%"}}>
            <View style={{height: height * 0.07, backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.4), color: "#191F28" }}>해당되는 업종을 모두 선택하세요</Text>
                <TouchableOpacity onPress={closeModal} style={{height: height * 0.025, width: width * 0.05}}>
                    <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.05} iColor={"#646970"}/>
                </TouchableOpacity>
            </View>
            <View style={{flex:1, backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-between"}}>
                <FlatList
                    data={iList}
                    numColumns={4}
                    ListFooterComponent={<View style={{ height: height * 0.03 }} />}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(data, index) => "list-" + index + Math.random()}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={{height: height * 0.015}}/>
                        )
                    }}
                    renderItem={({ item, index }) => {
                        return (
                            <>
                            {item.name !== undefined && item.name !== null && item.name !== "" &&
                                <TypeItems 
                                    sData={item}
                                    fnCheck={(sIndex,aIndex,xIndex) => checkValue(sIndex,aIndex,xIndex)}
                                />
                                
                            }
                            </>
                        ) 
                    }}
                />
            </View>
            <View style={{height: height * 0.12, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                <TouchableOpacity onPress={nextToSubType} style={{height: height * 0.07, backgroundColor: "#6490E7", width: "100%", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '600', color: "#fff"}}>완료</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const MainTypeList = ({ fnChangeState, fnDone, fnSelected, iList }) => {

    const checkValue = async (sIndex,aIndex,xIndex) => {
        if(fnSelected !== undefined && typeof fnSelected === "function"){
            await fnSelected(sIndex,aIndex,xIndex);
        }
    }

    const selectValue = async () => {
        if(fnDone !== undefined && typeof fnDone === "function"){
            await fnDone();
        }
    }

    const changeState = async () => {
        if(fnChangeState !== undefined && typeof fnChangeState === "function"){
            await fnChangeState();
        }
    }

    return (
        <>
        <View style={{flex: 1, padding: "7%"}}>
            <View style={{height: height * 0.05, justifyContent: "center", alignItems: "center", borderBottomWidth: 1, marginLeft: "5%", marginRight: "5%", borderBottomColor: "#bbb"}}>
                <Text style={{fontWeight: "700", fontSize: RFPercentage(1.6), color: "#000" }}>해당하는 업종에 따라 한개 또는 여러개 선택이 가능합니다</Text>
            </View>
            <FlatList
                data={iList}
                numColumns={2}
                ListFooterComponent={<View style={{ height: height * 0.05 }} />}
                showsVerticalScrollIndicator={false}
                keyExtractor={(data, index) => "list-" + index + Math.random()}
                ItemSeparatorComponent={() => {
                    return (
                        <View style={{height: height * 0.03}}/>
                    )
                }}
                renderItem={({ item, index }) => {
                    if(parseInt(iList.length) === parseInt(index) + 1){
                        return (
                            <View style={{flex:1, backgroundColor: "#f0f6fc", flexDirection: "row", margin: "5%", height: "90%", borderRadius: 10, width: "50%"}} />
                        )

                    } else {
                        return (
                            <TypeItems 
                                sData={item}
                                fnCheck={(sIndex,aIndex,xIndex) => checkValue(sIndex,aIndex,xIndex)}
                            />
                            
                        ) 
                    }
                }}
            />
        </View>
        <View style={{height : height * 0.1, justifyContent: "center", alignItems: "center"}}>
            <View style={{width: "85%", height: "60%", flexDirection: "row", marginBottom: "3%"}}>
                <TouchableOpacity activeOpacity={0.8} onPress={changeState} style={{width: "47.5%", height: "100%", borderColor: "#6490E8", marginRight: "5%", borderWidth: 1, borderRadius: 10, justifyContent: "center", alignItems: "center", backgroundColor: "#fff"}}>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#6490E8" }}>이전으로</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onPress={selectValue} style={{width: "47.5%", height: "100%", backgroundColor: "#6490E8", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>다음</Text>
                </TouchableOpacity>
            </View>
        </View>
        </>
    )
}

export const SubTypeContent = ({ sMainType, fnSelectValue, iSubType }) => {
    const [subTypeNm, setSubTypeNm] = useState("");
    const [sList, setList] = useState([]);

    const selectValue = async (sIndex) => {
        if(fnSelectValue !== undefined && typeof fnSelectValue === "function"){
            setSubTypeNm(sIndex.name);
            await fnSelectValue(sIndex);
        }
    }

    useEffect(() => {
        if(sMainType !== undefined && sMainType.key !== undefined){
            if(sMainType.key === 1){
                setList(subTypeList1);
            } else if (sMainType.key === 2){
                setList(subTypeList2);
            } else if (sMainType.key === 3){
                setList(subTypeList3);
            }
        }
    }, [sMainType]);

    useEffect(() => {
        if(iSubType !== undefined && iSubType.name !== undefined){
            setSubTypeNm(iSubType.name);
        }
    }, [iSubType]);

    return (
        <>
        <View style={{flex: 1, padding: "7%"}}>
            <View style={{height: height * 0.05, justifyContent: "center", alignItems: "center", borderBottomWidth: 1, marginLeft: "5%", marginRight: "5%", borderBottomColor: "#bbb"}}>
                <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#000" }}>부업종 선택</Text>
            </View>
            <FlatList
                data={sList}
                ListHeaderComponent={<View style={{ height: height * 0.05 }} />}
                showsVerticalScrollIndicator={false}
                keyExtractor={(data, index) => "list-" + index + Math.random()}
                ItemSeparatorComponent={() => {
                    return (
                        <View style={{height: height * 0.03}}/>
                    )
                }}
                renderItem={({ item, index }) => {
                     return (
                        <TouchableOpacity onPress={() => selectValue(item)} style={{height: height * 0.08, backgroundColor: "#fff", width: "100%", borderRadius: 10, flexDirection: "row"}}>
                            <View style={{flex: 0.7, justifyContent: "center", paddingLeft: "5%"}}>
                                <Text style={{fontSize: RFPercentage(1.9), fontWeight: '600', color: "#000" }}>{item.name}</Text>
                            </View>
                            <View style={{flex: 0.3, justifyContent: "center", alignItems: "center", marginRight: "5%"}}>
                                <View style={{height: width * 0.07, width: width * 0.07,  justifyContent: "center", alignItems: "center"}}>
                                    {item.name === subTypeNm ?
                                        <ComponentCheckCircle iHeight={height * 0.03} iWidth={width * 0.08} iColor={"#6490E8"}/>
                                        :
                                        <ComponentCircle iHeight={height * 0.03} iWidth={width * 0.08} iColor={"#6490E8"}/>
                                    }
                                </View>
                            </View>
                        </TouchableOpacity>
                    ) 
                }}
            />
        </View>
        </>
    )
}


export const SubTypeList = ({ fnChangeState, fnDone, fnSelected, iList }) => {

    const checkValue = async (sIndex,aIndex,xIndex) => {
        if(fnSelected !== undefined && typeof fnSelected === "function"){
            await fnSelected(sIndex,aIndex,xIndex);
        }
    }

    const selectValue = async () => {
        if(fnDone !== undefined && typeof fnDone === "function"){
            await fnDone();
        }
    }

    const changeState = async () => {
        if(fnChangeState !== undefined && typeof fnChangeState === "function"){
            await fnChangeState();
        }
    }

    return (
        <>
        <View style={{flex: 1, padding: "7%"}}>
            <View style={{height: height * 0.05, justifyContent: "center", alignItems: "center", borderBottomWidth: 1, marginLeft: "5%", marginRight: "5%", borderBottomColor: "#bbb"}}>
                <Text style={{fontWeight: "700", fontSize: RFPercentage(1.6), color: "#000" }}>해당하는 업종에 따라 한개 또는 여러개 선택이 가능합니다</Text>
            </View>
            <FlatList
                data={iList}
                numColumns={2}
                ListFooterComponent={<View style={{ height: height * 0.05 }} />}
                showsVerticalScrollIndicator={false}
                keyExtractor={(data, index) => "list-" + index + Math.random()}
                ItemSeparatorComponent={() => {
                    return (
                        <View style={{height: height * 0.03}}/>
                    )
                }}
                renderItem={({ item, index }) => {
                    if(parseInt(iList.length) === parseInt(index) + 1){
                        return (
                            <View style={{flex:1, backgroundColor: "#f0f6fc", flexDirection: "row", margin: "5%", height: "90%", borderRadius: 10, width: "50%"}} />
                        )

                    } else {
                        return (
                            <TypeItems 
                                sData={item}
                                fnCheck={(sIndex,aIndex,xIndex) => checkValue(sIndex,aIndex,xIndex)}
                            />
                            
                        ) 
                    }
                }}
            />
        </View>
        <View style={{height : height * 0.1, justifyContent: "center", alignItems: "center"}}>
            <View style={{width: "85%", height: "60%", flexDirection: "row", marginBottom: "3%"}}>
                <TouchableOpacity activeOpacity={0.8} onPress={changeState} style={{width: "47.5%", height: "100%", borderColor: "#6490E8", marginRight: "5%", borderWidth: 1, borderRadius: 10, justifyContent: "center", alignItems: "center", backgroundColor: "#fff"}}>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#6490E8" }}>이전으로</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onPress={selectValue} style={{width: "47.5%", height: "100%", backgroundColor: "#6490E8", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>완료</Text>
                </TouchableOpacity>
            </View>
        </View>
        </>
    )
}

export const PersonalTerms = () => {
    return (
        <View>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            판매자 개인정보 수집 및 이용 동의
            </Text>      
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}> 
            스루 서비스 운영사 인비저블아이디어 주식회사(이하 '스루'라고 함)는 최소한의 정보만을 필요한 시점에 수집하며, 수집하는 정보는 고지한 범위 내에서만 사용되며, 사전 동의 없이 그 범위를 초과하여 이용하거나 외부에 공개하지 않습니다.
            </Text>     
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}> 
            1. 수집하는 개인정보 항목
            </Text>    
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}> 
            1) 아이디, 비밀번호, 업체정보(대표자명, 대표번호, 대표이메일, 사업장주소), 사업자번호, 사업의 종류(업태, 업종), 담당자정보(담당자명, 전화번호, 휴대폰번호, 이메일)
            </Text>    
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}> 
            2) 정산정보(계좌정보, 예금주명, 통장사본)
            </Text>    
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}> 
            * 단, 서비스 특성에 따라 추가 구비서류가 요청될 수 있습니다.
            </Text>    
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}> 
            2. 수집 및 이용목적
            </Text>    
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}> 
            1) 입점 신청/문의 및 상담, 입점 업체 관리, 서비스 이용
            </Text>    
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}> 
            2) Open API이용을 위한 Key 발급 제휴를 위한 의사소통 경로의 확보, 고지사항 전달
            </Text>    
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}> 
            3) 서비스 이용에 따르는 민원사항 처리, 중복가입 확인
            </Text>    
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}> 
            4) 새로운 서비스 및 이벤트 정보 등 최신 정보 안내, 인구통계학적 분석
            </Text>    
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}> 
            5) 부정이용확인 및 방지
            </Text>    
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}> 
            6) 세금계산서 발행, 대금결제서비스 제공
            </Text>    
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}> 
            7) 보안, 프라이버시, 안전 측면에서 이용자가 안심하고 이용할 수 있는 서비스 이용환경 구축
            </Text>    
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}> 
            3. 보유 및 이용기간, 파기
            </Text>    
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}> 
            이용계약 종료시까지. 단, 관계법령에 따라 또는 회사 정책에 따른 정보보유사유가 발생하여 보존할 필요가 있는 경우에는 필요한 기간 동안 해당 판매자정보를 보관합니다
            전자상거래 등에서의 소비자 보호에 관한 법률, 전자금융거래법, 통신비밀보호법 등 법령에서 일정기간 정보의 보관을 규정하는 경우, 이 기간 동안 법령의 규정에 따라 개인정보를 보관하며, 다른 목적으로는 절대 이용하지 않습니다.
            - 전자상거래 등에서의 소비자보호에 관한 법률 : 대금결제 및 재화 등의 공급에 관한 기록(5년), 계약 또는 청약철회 등에 관한 기록(5년), 표시·광고에 관한 기록(6개월)
            - 통신비밀보호법 : 웹사이트 방문 기록 (3개월)
            </Text>    
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}> 
            4. 동의를 거부할 권리 및 거부 경우의 불이익
            </Text>    
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}> 
            귀하는 회사의 정보수집에 대해 동의하지 않거나 거부할 수 있습니다. 다만, 이때 원활한 입점 및 서비스 이용 등이 제한될 수 있습니다.
            </Text>    
        </View>
    )
}

export const AgreeTerms = () => {
    return (
        <View>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 1 조 (목적)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            이 약관은 제이티넷 주식회사(이하 '회사'라 합니다)가 제공하는 전자지급결제대행서비스 및 결제대금예치서비스를 이용자가 이용함에 있어 회사와 이용자 사이의 전자금융거래에 관한 기본적인 사항을
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            정함을 목적으로 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 2 조 (용어의 정의)
            </Text>

            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            이 약관에서 정하는 용어의 정의는 다음과 같습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ① '전자금융거래'라 함은 회사가 전자적 장치를 통하여 전자지급결제대행서비스 및 결제대금예치서비스(이하 '전자금융거래 서비스'라고 합니다)를 제공하고, 이용자가 회사의 종사자와 직접 대면하거나 의사소통을 하지 아니하고 자동화된 방식으로 이를 이용하는 거래를 말합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② '전자지급결제대행서비스'라 함은 전자적 방법으로 재화의 구입 또는 용역의 이용에 있어서 지급결제정보를 송신하거나 수신하는 것 또는 그 대가의 정산을 대행하거나 매개하는 서비스를 말합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ③ '결제대금예치서비스'라 함은 이용자가 재화의 구입 또는 용역의 이용에 있어서 그 대가(이하 '결제대금'이라 한다)의 전부 또는 일부를 재화 또는 용역(이하 '재화 등'이라 합니다)을 공급받기 전에 미리 지급하는 경우, 회사가 이용자의 물품수령 또는 서비스 이용 확인 시점까지 결제대금을 예치하는 서비스를 말합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ④ '회원사'라 함은 '회사'와 '전자지급결제대행서비스' 이용 계약을 맺고 이용자에게 재화 또는 용역을 제공하는 자를 말합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑤ '이용자'라 함은 이 약관에 동의하고 회사가 제공하는 전자금융거래 서비스를 이용하는 자를 말합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑥ '접근매체'라 함은 전자금융거래에 있어서 거래지시를 하거나 이용자 및 거래내용의 진실성과 정확성을 확보하기 위하여 사용되는 수단 또는 정보로서 전자식 카드 및 이에 준하는 전자적 정보(신용카드번호를 포함한다), '전자서명법'상의 인증서, 회사에 등록된 이용자번호, 이용자의 생체정보, 이상의 수단이나 정보를 사용하는데 필요한 비밀번호 등 전자금융거래법 제2조 제10호에서 정하고 있는 것을 말합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑦ '거래지시'라 함은 이용자가 본 약관에 의하여 체결되는 전자금융거래계약에 따라 회사에 대하여 전자금융거래의 처리를 지시하는 것을 말합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑧ '오류'라 함은 이용자의 고의 또는 과실 없이 전자금융거래가 전자금융거래계약 또는 이용자의 거래지시에 따라 이행되지 아니한 경우를 말합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 3 조 (약관의 명시 및 변경)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ① 회사는 이용자가 전자금융거래 서비스를 이용하기 전에 이 약관을 게시하고 이용자가 이 약관의 중요한 내용을 확인할 수 있도록 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 회사는 이용자의 요청이 있는 경우 전자문서의 전송방식에 의하여 본 약관의 사본을 이용자에게 교부합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ③ 회사가 약관을 변경하는 때에는 그 시행일 1월 전에 변경되는 약관을 회사가 제공하는 전자금융거래 서비스 이용 초기화면 및 회사의 홈페이지에 게시함으로써 이용자에게 공지합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 4 조 (전자지급결제대행서비스의 종류)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            회사가 제공하는 전자지급결제대행서비스는 지급결제수단에 따라 다음과 같이 구별됩니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ① 신용카드결제대행서비스: 이용자가 결제대금의 지급을 위하여 제공한 지급결제수단이 신용카드인 경우로서, 회사가 전자결제시스템을 통하여 신용카드 지불정보를 송,수신하고 결제대금의 정산을 대행하거나 매개하는 서비스를 말합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 계좌이체대행서비스: 이용자가 결제대금을 회사의 전자결제시스템을 통하여 금융기관에 등록한 자신의 계좌에서 출금하여 원하는 계좌로 이체할 수 있는 실시간 송금 서비스를 말합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ③ 가상계좌서비스: 이용자가 결제대금을 현금으로 결제하고자 경우 회사의 전자결제시스템을 통하여 자동으로 이용자만의 고유한 일회용 계좌의 발급을 통하여 결제대금의 지급이 이루어지는 서비스를 말합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ④ 기타: 회사가 제공하는 서비스로서 지급결제수단의 종류에 따라 '휴대폰 결제대행서비스', 'ARS결제대행서비스', '상품권결제대행서비스', '포인트결제대행서비스' 등이 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 5 조 (결제대금예치서비스의 내용)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ① 이용자(이용자의 동의가 있는 경우에는 재화 등을 공급받을 자를 포함합니다. 이하 본조에서 같습니다)는 재화 등을 공급받은 사실을 재화 등을 공급받은 날부터 3영업일 이내에 회사에 통보하여야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 회사는 이용자로부터 재화 등을 공급받은 사실을 통보 받은 후 회사와 통신판매업자간 사이에서 정한 기일 내에 통신판매업자에게 결제대금을 지급합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ③ 회사는 이용자가 재화 등을 공급받은 날부터 3영업일이 지나도록 정당한 사유의 제시 없이 그 공급받은 사실을 회사에 통보하지 아니하는 경우에는 이용자의 동의 없이 통신판매업자에게 결제대금을 지급할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ④ 회사는 통신판매업자에게 결제대금을 지급하기 전에 이용자에게 결제대금을 환급 받을 사유가 발생한 경우에는 그 결제대금을 소비자에게 환급합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑤ 회사는 이용자와의 결제대금예치서비스 이용과 관련된 구체적인 권리, 의무를 정하기 위하여 본 약관과는 별도로 결제대금예치서비스이용약관을 제정할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 6 조 (이용시간)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ① 회사는 이용자에게 연중무휴 1일 24시간 전자금융거래 서비스를 제공함을 원칙으로 합니다. 단, 금융기관 기타 결제수단 발행업자의 사정에 따라 달리 정할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 회사는 정보통신설비의 보수, 점검 기타 기술상의 필요나 금융기관 기타 결제수단 발행업자의 사정에 의하여 서비스 중단이 불가피한 경우, 서비스 중단 3일 전까지 게시 가능한 전자적 수단을 통하여 서비스 중단 사실을 게시한 후 서비스를 일시 중단할 수 있습니다. 다만, 시스템 장애복구, 긴급한 프로그램 보수, 외부요인 등 불가피한 경우에는 사전 게시 없이 서비스를 중단할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 7 조 (접근매체의 선정과 사용 및 관리)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ① 회사는 전자금융거래 서비스 제공 시 접근매체를 선정하여 이용자의 신원, 권한 및 거래지시의 내용 등을 확인할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 이용자는 접근매체를 제3자에게 대여하거나 사용을 위임하거나 양도 또는 담보 목적으로 제공할 수 없습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ③ 이용자는 자신의 접근매체를 제3자에게 누설 또는 노출하거나 방치하여서는 안되며, 접근매체의 도용이나 위조 또는 변조를 방지하기 위하여 충분한 주의를 기울여야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ④ 회사는 이용자로부터 접근매체의 분실이나 도난 등의 통지를 받은 때에는 그 때부터 제3자가 그 접근매체를 사용함으로 인하여 이용자에게 발생한 손해를 배상할 책임이 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 8 조 (거래내용의 확인)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ① 회사는 이용자와 미리 약정한 전자적 방법을 통하여 이용자의 거래내용(이용자의 '오류정정 요구사실 및 처리결과에 관한 사항'을 포함합니다.)을 확인할 수 있도록 하며, 이용자의 요청이 있는 경우에는 요청을 받은 날로부터 2주 이내에 모사전송 등의 방법으로 거래내용에 관한 서면을 교부합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 회사가 이용자에게 제공하는 거래내용 중 거래계좌의 명칭 또는 번호, 거래의 종류 및 금액, 거래상대방을 나타내는 정보, 거래일자, 전자적 장치의 종류 및 전자적 장치를 식별할 수 있는 정보와 해당 전자금융거래와 관련한 전자적 장치의 접속기록은 5년간, 건당 거래금액이 1만원 이하인 소액 전자금융거래에 관한 기록, 전자지급수단 이용시 거래승인에 관한 기록, 이용자의 오류정정 요구사실 및 처리결과에 관한 사항은 1년간의 기간을 대상으로 한다. 단, 회사가 전자지급결제대행서비스 제공의 대가로 수취한 수수료에 대한 사항은 제공하는 거래내역에서 제외됩니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ③ 이용자가 제1항에서 정한 서면교부를 요청하고자 할 경우 다음의 주소 및 전화번호로 요청할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            주소: 서울특별시 구로구 디지털로 30길 28, 마리오타워 9층 주식회사 제이티넷
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            전화번호: 02-801-7850
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            전자우편주소: pgcs@jtnet.co.kr
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 9 조 (오류의 정정 등)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ① 이용자는 전자금융거래 서비스를 이용함에 있어 오류가 있음을 안 때에는 회사에 대하여 그 정정을 요구할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 회사는 전항의 규정에 따른 오류의 정정요구를 받은 때에는 이를 즉시 조사하여 처리한 후 정정요구를 받은 날부터 2주 이내에 그 결과를 이용자에게 알려 드립니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 10 조 (회사의 책임)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 회사가 접근매체의 발급주체가 아닌 경우에는 접근매체의 위조나 변조로 발생한 사고로 인하여 이용자에게 발생한 손해에 대하여 배상책임이 없습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 회사가 접근매체의 발급주체이거나 사용, 관리주체인 경우에는 접근매체의 위조나 변조로 발생한 사고로 인하여 이용자에게 발생한 손해에 대하여 배상책임이 있습니다. 다만 이용자가 제6조 제2항에 위반하거나 제3자가 권한없이 이용자의 접근매체를 이용하여 전자금융거래를 할 수 있음을 알았거나 알 수 있었음에도 불구하고 이용자가 자신의 접근매체를 누설 또는 노출하거나 방치한 경우에는 그러하지 아니합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ③ 회사는 계약체결 또는 거래지시의 전자적 전송이나 처리과정에서 발생한 사고로 인하여 이용자에게 그 손해가 발생한 경우에는 그 손해를 배상할 책임이 있습니다. 다만 본조 제2항 단서에 해당하거나 법인('중소기업기본법' 제2조 제2항에 의한 소기업을 제외합니다)인 이용자에게 손해가 발생한 경우로서 회사가 사고를 방지하기 위하여 보안절차를 수립하고 이를 철저히 준수하는 등 합리적으로 요구되는 충분한 주의의무를 다한 경우에는 그러하지 아니합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ④ 회사는 이용자로부터의 거래지시가 있음에도 불구하고 천재지변, 회사의 귀책사유가 없는 정전, 화재, 통신장애 기타의 불가항력적인 사유로 처리 불가능하거나 지연된 경우로서 이용자에게 처리 불가능 또는 지연사유를 통지한 경우(금융기관 또는 결제수단 발행업체나 통신판매업자가 통지한 경우를 포함합니다)에는 이용자에 대하여 이로 인한 책임을 지지 아니합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 11 조 (전자지급거래계약의 효력)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 회사는 이용자의 거래지시가 전자지급거래에 관한 경우 그 지급절차를 대행하며, 전자지급거래에 관한 거래지시의 내용을 전송하여 지급이 이루어지도록 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 회사는 이용자의 전자지급거래에 관한 거래지시에 따라 지급거래가 이루어지지 않은 경우 수령한 자금을 이용자에게 반환하여야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 12 조 (거래지시의 철회)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 이용자는 전자지급거래에 관한 거래지시의 경우 지급의 효력이 발생하기 전까지 거래지시를 철회할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 전항의 지급의 효력이 발생 시점이란 (i) 전자자금이체의 경우에는 거래지시된 금액의 정보에 대하여 수취인의 계좌가 개설되어 있는 금융기관의 계좌 원장에 입금기록이 끝난 때 (ii) 그 밖의 전자지급수단으로 지급하는 경우에는 거래지시된 금액의 정보가 수취인의 계좌가 개설되어 있는 금융기관의 전자적 장치에 입력이 끝난 때를 말합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ③ 이용자는 지급의 효력이 발생한 경우에는 전자상거래 등에서의 소비자보호에 관한 법률 등 관련 법령상 청약의 철회의 방법 또는 본 약관 제5조에서 정한 바에 따라 결제대금을 반환 받을 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 13 조 (전자지급결제대행 서비스 이용 기록의 생성 및 보존)

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ① 회사는 이용자가 전자금융거래의 내용을 추적, 검색하거나 그 내용에 오류가 발생한 경우에 이를 확인하거나 정정할 수 있는 기록을 생성하여 보존합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 전항의 규정에 따라 회사가 보존하여야 하는 기록의 종류 및 보존방법은 제8조 제2항에서 정한 바에 따릅니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 14 조 (전자금융거래정보의 제공금지)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 회사는 전자금융거래 서비스를 제공함에 있어서 취득한 이용자의 인적사항, 이용자의 계좌, 접근매체 및 전자금융거래의 내용과 실적에 관한 정보 또는 자료를 이용자의 동의를 얻지 아니하고 제3자에게 제공,누설하거나 업무상 목적 외에 사용하지 아니합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 15 조 (분쟁처리 및 분쟁조정)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 이용자는 다음의 분쟁처리 책임자 및 담당자에 대하여 전자금융거래 서비스 이용과 관련한 의견 및 불만의 제기, 손해배상의 청구 등의 분쟁처리를 요구할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            담당자: PG영업팀
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            연락처: 02-801-7850
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            전자우편주소: pgcs@jtnet.co.kr
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 이용자가 회사에 대하여 분쟁처리를 신청한 경우에는 회사는 15일 이내에 이에 대한 조사 또는 처리 결과를 이용자에게 안내합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ③ 이용자는 '금융감독기구의 설치 등에 관한 법률' 제51조의 규정에 따른 금융감독원의 금융분쟁조정위원회나 '소비자보호법' 제31조 제1항의 규정에 따른 소비자보호원에 회사의 전자금융거래 서비스의 이용과 관련한 분쟁조정을 신청할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 16 조 (회사의 안정성 확보 의무)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 회사는 전자금융거래의 안전성과 신뢰성을 확보할 수 있도록 전자금융거래의 종류별로 전자적 전송이나 처리를 위한 인력, 시설, 전자적 장치 등의 정보기술부문 및 전자금융업무에 관하여 금융감독위원회가 정하는 기준을 준수합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 17 조 (약관외 준칙 및 관할)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ① 이 약관에서 정하지 아니한 사항에 대하여는 전자금융거래법, 전자상거래 등에서의 소비자 보호에 관한 법률, 통신판매에 관한 법률, 여신전문금융업법 등 소비자보호 관련 법령에서 정한 바에 따릅니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 회사와 이용자간에 발생한 분쟁에 관한 관할은 민사소송법에서 정한 바에 따릅니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            [부칙] 이 약관은 2015년 4월 1일부터 적용합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            1. 수집항목
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            - 고유식별정보: 주민등록표에 기재된 성명 다만, 재외국민의 경우에는 여권에 기재된 성명 및 여권번호(여권이 발급되지 아니한 재외국민은 "재외국민등록법"에 의한 등록부에 기재된 성명 및 등록번호)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>


            2. 고유식별정보의 수집 및 이용목적
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            당사는 다음과 같은 목적 하에 "서비스"와 관련한 고유식별정보를 수집합니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 서비스 제공 계약의 성립, 유지, 종료를 위한 본인 식별 및 실명확인, 각종 회원관리
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 서비스 제공 과정 중 본인 식별, 인증, 실명확인 및 회원에 대한 각종 안내/고지
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 대금 환불, 상품배송 등 전자상거래 관련 서비스 제공
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 서비스 제공 및 관련 업무처리에 필요한 동의 또는 철회 등 의사확인
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            3. 고유식별정보의 보유 및 이용기간
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            - 건당 거래 금액 1만원 초과의 경우: 5년간
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 건당 거래 금액 1만원 이하의 경우: 1년간
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            4. 이용자는 고유식별정보의 수집 및 이용에 동의하지 않더라도 회사의 서비스 이용에 불이익이 없음을 알려드립니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            단, 해당 고유식별번호가 반드시 필요한 서비스에 한하여 이용이 제한될 수 있습니다
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            1. ㈜제이티넷(이하"회사")은 이용자의 개인정보를 본 개인정보취급방침에서 고지한 범위 내에서 사용하며, 이용자의 사전 동의 없이 동 범위를 초과하여
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            이용하거나 이용자의 개인 정보를 제3자에게 제공하지 않습니다. 다만, 관련 법령에 의하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관 등에 개인정보를 제공하여야 하는 경우는
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            예외로 합니다. 회사의 서비스 이행을 위하여 개인정보를 제3자에게 제공하고 있는 경우는 다음과 같습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제공목적
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            개인정보를 제공받는 자
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제공 정보
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            보유 및 이용기간
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            신용카드 결제
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 국민, 비씨, 롯데, 삼성, NH농협, 현대, 신한, 하나- 시중은행:신한, SC제일, 씨티, 하나- 특수은행:농협, 기업, 국민, 저축, 수협, 신협, 우체국,
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            새마을금고- 지방은행:대구, 부산, 경남, 광주, 전북, 조흥, 제주- 전업카드사:우리- VAN사:브이피㈜
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            거래정보
            </Text> 
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}> 
            (비씨카드:IP포함)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            건당 1만원 초과 : 5년
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            건당 1만원 이하 : 1년 
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            계좌이체 결제
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 금융결제원
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 경남/광주/국민/기업/농협/대구/부산/산업/새마을금고/수협/신한/신협/외환/우리/우체국/전북/제주/하나/씨티/SC제일은행/산림조합-
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            유안타/현대/미래에셋/한투/우리투자/하이투자/HMC투자/SK/대신/하나대투/신한금융/동부/유진투자/메리츠/신영/삼성/한화/대우증권
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            거래정보
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            가상계좌 결제
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - (주)세틀뱅크, 케이아이비넷
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 국민/농협/우리/신한/하나/기업/우체국/외환/부산/경남/대구/수협/씨티/삼성증권/SC/광주/전북
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            거래정보
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            휴대폰 결제
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - ㈜다날
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - ㈜SKT, ㈜KT, ㈜LGU+, MVNO사업자
            </Text> 
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            거래정보(모빌리언스, 다날 IP 포함)
            </Text> 
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}> 
            휴대폰번호
            </Text> 
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}> 
            고유식별 정보 
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            현금영수증 발행
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            국세청 
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            거래정보
            </Text> 
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}> 
            휴대폰번호
            </Text> 
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}> 
            고유식별 정보
            </Text> 
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}> 
            카드번호 
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            본인 확인 인증
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 나이스신용평가정보, 한국신용평가정보㈜, 한국신용정보
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - SKT, KT, LGU+, ㈜다날
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - (주)코밴, KIS정보통신, NICE정보통신, 브이피㈜,
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            한국신용카드결제(주), 퍼스트 데이터 코리아, ㈜케이에스넷
            </Text> 
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}> 
            - 국민/비씨/롯데/삼성/NH농협/현대/외환/신한
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            경남/광주/국민/기업/농협/대구/부산/산업/새마을금고/수협/신한/신협/외환/우리/우체국/전북/제주/하나/씨티/SC제일
            </Text> 
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 고유식별 정보
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 본인확인 정보 
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            회사는 개인정보 위탁처리 기관 및 위탁업무에 대한 내용은 아래와 같습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            향후 추가 위탁업체가 생길 경우, 위탁 대상자와 위탁 업무 내용에 대해 고객님에게 통지하고 필요한 경우 사전 동의를 받도록 하겠습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            수탁업체
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            위탁업무 내용
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            개인정보의 보유 및 이용기간
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            씨에스플러스
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            운영모니터링
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            위탁업체 계약종료 시점까지
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            윌앤비전
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            고객상담
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            위탁업체 계약종료 시점까지
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            2. 제3자에게 제공 위탁된 개인정보의 보유, 이용 기간이 만료된 개인정보는 아래와 같은 방법으로 파기합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            </Text>
            3. 개인정보의 제3자 제공 및 위탁 거부
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            </Text>
            이용자는 개인정보의 제3자 제공 및 위탁 동의를 거부할 권리가 있습니다. 단, 동의를 거부하는 경우 본 서비스 결제가 정상적으로 이루어질 수 없음을
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            알려드립니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            1. ㈜제이티넷(이하'회사')은 고객의 개인정보를 무엇보다 중요하게 생각하고, 이용자가 안심하고 이용할 수 있도록 개인정보처리에 최선을 다하고 있습니다. 또한 개인정보보호법 등 서비스
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제공자가 준수해야 할 개인정보 보호규정을 준용하여, 관련 법령에 의거한 개인정보처리방침을 정하여 이용자 권익보호에 최선을 다하고 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            2. 개인정보 수집 및 이용동의는 개인정보의 수집 및 이용목적, 수집항목 및 수집방법 개인정보의 보유 및 이용기간으로 별도 구분하여
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            표시됩니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            3. 개인정보의 수집 및 이용목적
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            1) 전자금융거래서비스 제공에 관한 결제 정보 등 개인정보 수집
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ① 이용자가 구매한 재화나 용역의 대금 결제
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 결제 과정 중 본인 식별, 인증, 실명확인 및 이용자가 결제한 거래의 내역을 요청하는 경우 응대 및 확인
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ③ 이용자가 결제한 거래의 취소 또는 환불, 상품 배송 등 전자상거래 관련 서비스 제공
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ④ 이용자가 결제한 대금의 청구 및 수납
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑤ 전자금융거래 및 통신과금 서비스 이용 불가능한 이용자(미성년자 등)와 불량, 불법 이용자의 부정 이용 방지
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑥ 서비스 제공 및 관련 업무 처리에 필요한 동의 또는 철회 등 의사확인
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑦ 회사가 제공하는 결제알림메일 발송
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑧ 고객 불만 및 민원처리
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            2) 신규 서비스 개발 및 마케팅 광고에의 활용
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 이용 빈도 파악 및 마케팅 특성에 따른 서비스 제공 및 CRM 용도
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 신규 서비스 개발 및 맞춤 서비스 제공, 통계학적 특성에 따른 서비스 제공 및 광고 게재, 서비스의 유효성 확인, 이벤트, 광고성 정보
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제공(결제알림메일 내) 및 참여기회 제공, 접속빈도 파악, 회원의 서비스이용에 대한 통계
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            4. 수집항목 및 수집방법
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            1) 수집항목
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            가. 전자금융거래서비스 이행과 관련 수집 정보

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ① 이용자의 고유식별번호
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 이용자의 신용카드 정보 또는 지불하고자 하는 금융기관 계좌 일부정보
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ③ 이용자의 휴대폰 또는 유선 전화 번호 및 가입 통신사
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ④ 이용자의 상품권 번호 및 상품권 회원 아이디, 비밀번호 등
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑤ 이용자의 결제하고자 하는 포인트 카드 정보
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑥ 이용자의 전자지갑 이용자번호 등 결제 정보
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑦ 이용자의 접속 IP
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑧ 이용자의 이메일
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑨ 이용자의 상품 또는 용역 거래 정보
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            나. 회원가입과 관련한 수집 정보
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 성명, 성별, 아이디, 비밀번호, 연락처(메일주소, 휴대폰 번호), 가입인증정보
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 만 14세 미만은 법정대리인 정보, 가입인증정보
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ③ 외국인의 경우 외국인등록번호
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            다. '서비스' 이용 또는 처리 과정에서 자동 혹은 수동으로 생성되어 수집되는 정보
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 이용자 IP Address, 쿠키, 서비스 접속 일시, 서비스 이용기록, 불량 혹은 비정상 이용기록, 결제기록
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            2) 수집방법
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            가. 회사가 운영하는 웹사이트 혹은 회사가 제공하는 결제창에 이용자가 직접 입력
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            나. 회사가 제공하는 정보통신서비스의 이용 혹은 처리 과정에서 쿠키, 서비스 접속 log등이 자동으로 생성 및 수집되는 경우


            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            5. 개인정보의 보유 및 이용 기간
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            개인정보의 수집 및 이용목적
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            수집항목 및 수집방법
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            개인정보의 보유 및 이용 기간
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            1) 전자금융거래서비스 제공에 관한 결제 정보 등 개인정보 수집
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 이용자가 구매한 재화나 용역의 대금 결제
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            -
            결제 과정 중 본인 식별, 인증, 실명확인 및 이용자가 결제한 거래의 내역을 요청하는 경우 응대 및 확인
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 이용자가 결제한 거래의 취소 또는 환불, 상품 배송
            등
            전자상거래 관련 서비스 제공
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 이용자가 결제한 대금의 청구 및 수납
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 전자금융거래 및 통신과금 서비스 이용 불가능한 이용자(미성년자 등)와 불량, 불법
            이용자의 부정 이용 방지
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 서비스 제공 및 관련 업무 처리에 필요한 동의 또는 철회 등 의사확인
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 회사가 제공하는 결제알림메일 발송
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 고객 불만
            및
            민원처리
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            2) 신규 서비스 개발 및 마케팅 광고에의 활용
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 이용 빈도 파악 및 마케팅 특성에 따른 서비스 제공 및 CRM 용도
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 신규 서비스
            개발
            및 맞춤 서비스 제공, 통계학적 특성에 따른 서비스 제공 및 광고 게재, 서비스의 유효성 확인, 이벤트, 광고성 정보 제공(결제알림메일 내) 및 참여기회 제공,
            접속빈도
            파악, 회원의 서비스이용에 대한 통계
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            1) 수집항목
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            가. 전자금융거래서비스 이행과 관련 수집 정보
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 이용자의 고유식별번호
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 이용자의 신용카드
            정보 또는 지불하고자 하는 금융기관 계좌 일부정보
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 이용자의 휴대폰 또는 유선 전화 번호 및 가입 통신사
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 이용자의 상품권 번호 및 상품권 회원 아이디,
            비밀번호 등
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 이용자의 결제하고자 하는 포인트 카드 정보
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 이용자의 전자지갑 이용자번호 등 결제 정보
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 이용자의 접속 IP
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 이용자의
            이메일
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 이용자의 상품 또는 용역 거래 정보
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            나. 회원가입과 관련한 수집 정보
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 성명, 성별, 아이디, 비밀번호, 연락처(메일주소, 휴대폰
            번호), 가입인증정보
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 만 14세 미만은 법정대리인 정보, 가입인증정보
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 외국인의 경우 외국인등록번호
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            다. '서비스' 이용 또는 처리
            과정에서
            자동 혹은 수동으로 생성되어 수집되는 정보
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 이용자 IP Address, 쿠키, 서비스 접속 일시, 서비스 이용기록, 불량 혹은 비정상 이용기록,
            결제기록
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            2) 수집방법
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            가. 회사가 운영하는 웹사이트 혹은 회사가 제공하는 결제창에 이용자가 직접 입력
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            나. 회사가 제공하는 정보통신서비스의
            이용
            혹은 처리 과정에서 쿠키, 서비스 접속 log등이 자동으로 생성 및 수집되는 경우
            이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기 합니다. 단, 전자금융거래법,
            전자상거래 등에서의 소비자 보호에 관한 법률 등 관련 법령에 의하여 보존할 필요가 있는 경우 관련 법령에서 정한 일정한 기간 동안 개인정보를 보존합니다. 이 경우
            회사는
            보관하는 정보를 그 보관의 목적으로만 이용하며 보존기간은 아래와 같습니다.
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 건당 1만원 초과 전자금융거래에 관한 기록
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            보존이유:
            전자금융거래법
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            보존기간:
            5년
            </Text> 
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}> 
            - 건당 1만원 이하 전자금융거래에 관한 기록
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            보존이유: 전자금융거래법
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            보존기간: 1년
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 계약 또는 청약 철회 등에 관한
            기록
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            보존이유:
            전자상거래 등에서의 소비자보호에 관한 법률
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            보존기간: 5년
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 대금결제 및 재화 등의 공급에 관한 기록
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            보존이유: 전자상거래 등에서의 소비자보호에 관한
            법률
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            보존기간: 5년
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            - 소비자의 불만 또는 분쟁 처리에 관한 기록
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            보존이유: 전자상거래 등에서의 소비자보호에 관한 법률
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            보존기간: 3년
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            -
            본인확인에 관한 기록
            </Text>
             <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            보존이유: 개인정보보호법
                 보존기간: 2년
            </Text>
        </View>
    )
}

export const BasicTerms = () => {
    return (
        <View>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 1 조 (목적)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            본 스루 서비스 이용 약관(이하 “본 약관”)은 인비저블아이디어 주식회사(계열회사, 임직원 및 계약관계에 따른 이해당사자를 포함하여, 이하 총칭하여 “회사”)가 제공하는 스루 사업자의 사이트의 이용과 관련하여 회사와 판매자의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 2 조 (정의)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            본 약관에서 사용하는 용어의 의미는 다음과 같습니다. 본 약관에서 정의되지 않은 용어는 일반 거래 관행에 따라 정의된 의미를 가집니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            1. “스루”란 판매자가 회사의 스루 서비스를 이용할 수 있도록 정보통신 시설/장비/네트워크를 통해 회사가 제공하는 서비스 플랫폼을 의미합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            2. “스루 서비스”(또는 “서비스”)란 판매자가 매장에 대한 정보를 노출하고, 스루를 이용해서 고객으로부터 주문을 받고 간편결제를 통해 결제할 수 있도록 회사가 제공하는 인터넷 기반의 중개 서비스를 의미하며, 회사에 의해 변경될 수 있는 스루 광고 서비스를 포함합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            3. “상품”이란 판매자가 스루 이용 고객에게 판매하는 식음료를 포함한 농산품 및 공산품등 이외 모든 상품을 의미합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            4. “판매자”란 회사의 스루에 접속하여 본 약관에 따라 회사와 이용계약을 체결하고, 회사가 제공하는 스루 서비스를 통하여 고객에게 상품을 판매하는 자를 의미합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            5. “임점대행사”란 회사의 위탁을 받아 매장의 입점 업무를 대행하는 협력사를 의미합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            6. “고객”이란 스루를 이용하여 상품을 열람하거나 판매자로부터 상품을 구매하는 소비자를 의미합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            7. “이용정책”이란 스루, 판매자 전용 시스템 등에 게시된 서비스에 대한 이용정책, 이용 약관, 규칙 및 지침 및 서비스 이용과 관련하여 회사가 설정한 기타 정책(향후 회사가 개정하는 내용 포함)을 의미합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            8. “스루 POS”이란 회사가 스루 서비스 제공을 위해 필요한 정보를 판매자와 상호 교환하기 위해 판매자에게 제공하는 툴을 의미합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            9. “소프트웨어 사용료”란 판매자가 '스루 POS' 사용을 대가로 회사에 지불하는 요금을 의미합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            10. “수수료”란 판매자가 스루 서비스 이용을 위해 회사에 지불하는 금원을 의미합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            11. “스루페이”란 고객이 스루 이용 시 선택하는 지불방법으로, 회사와의 계약에 따라 정한 PG사가 제공하는 모든 전자적 결제수단을 의미합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            12. “게시물”이란 스루 및 스루 POS 등에 등록한 문자, 음성, 음향, 화상, 동영상 등의 정보 형태의 글, 사진, 동영상 및 각종 파일과 링크 등(형태, 형식 불문)을 의미합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            13. “할인쿠폰 등”이란 거래 시 해당 거래대금에서 표시된 금액 또는 비율 상당의 금액만큼을 할인 받을 수 있는 회사가 발행한 쿠폰 기타 회사가 프로모션 행사 등을 통해 제공하는 혜택을 의미합니다. 구체적인 내용(사용대상∙방법∙기한 및 제한 사항 등)은 서비스 관련 웹페이지 등에 개별적으로 표시되고, 할인쿠폰 등의 종류 및 내용은 회사정책에 따라 달라질 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 3 조 (본 약관의 게시, 유효성 및 개정)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ① 회사는 판매자가 쉽게 알 수 있도록 본 약관을 스루 판매자 관리페이지 또는 스루POS에 게시하여야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 회사는 판매자의 스루 서비스 이용과 관련하여 별도의 이용정책 등을 운영할 수 있으며, 해당 이용정책 등은 본 이용약관의 일부를 구성합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ③ 회사는 “약관의 규제에 관한 법률”, “정보통신망 이용촉진 및 정보보호 등에 관한 법률(이하 “정보통신망법”)”, “전자금융거래법” 등 관계 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ④ 회사가 본 약관(이용정책을 포함하며, 이하 본 조에서 동일함)을 개정하는 경우, 모든 개정 조항은 본 약관의 현재 버전 및 개정안의 발효일, 개정이유와 함께 발효일 7일 전부터(단, 수정 내용이 판매자에게 불리한 경우에는 30일) 발효일 직전일까지 스루, 스루 사장님 창구, 스루POS 등에 게시되거나 이메일 또는 기타 수단을 통하여 통지되어야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑤ 회사가 전항에 따라 본 약관의 개정안을 공개하거나 통지하면서 판매자에게 7일(판매자에게 불리한 개정안의 경우에는 30일) 이내에 의사표시를 하지 않으면 의사표시를 한 것으로 본다는 뜻을 명확하게 알리거나 통지하였음에도 불구하고, 판매자가 거부 의사를 명시적으로 의사표시 하지 않는 경우 판매자는 본 약관의 개정안에 동의한 것으로 봅니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑥ 판매자가 개정 약관의 적용에 동의하지 않는 경우 회사는 개정 약관의 내용을 적용할 수 없으며, 이 경우 판매자는 이용계약을 해지할 수 있습니다. 단, 회사는 기존 약관을 적용할 수 없는 특별한 사정이 있는 경우 본 약관을 해지할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑦ 본 약관에 동의하는 이용자는 회사 또는 PG사가 제공하는 전자지급결제대행서비스(PG), 에스크로 및 선불전자지급수단의 발행, 관리 서비스 사용에 동의한 것으로 간주됩니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑧ 회사가 영업양도 등의 방법으로 이 약관의 내용 중 스루페이를 이용한 업무의 처리 및 회사의 전자금융거래이용약관에 따른 계약관계(관련 권리 및 의무 포함)를 관련 법률에서 정한 절차에 따라 포괄적으로 이전하고자 하는 경우, 그 사실을 이용자에게 공지 또는 개별적으로 통지하고 이용자가 이에 대하여 30일간 동의 또는 승낙을 거부하는 의사표시를 하지 아니하는 경우 이에 대하여 동의 또는 승낙한 것으로 봅니다. 이용자가 본 항에 동의하지 않는 경우 또는 본 항에 따른 동의 또는 승낙을 거부하는 경우 언제라도 이 약관 및 회사의 전자금융거래이용약관에 따른 서비스 이용계약을 해지할 수 있습니다. 단, 이 경우에도 제11조 제1항 단서 규정에 따라 회사의 이용자에 대한 지급채무 등 기본적인 권리의무에는 영향을 미치지 않습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑨ 판매자는 고객이 스루페이로 거래를 요청할 경우 특별한 사정이 없는 한 그에 응하여야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 4 조 (판매자에 대한 통지)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ① 회사는 이메일이나 기타 서면 등의 방법으로 판매자에게 통지할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 회사가 불특정 다수 판매자 또는 모든 판매자들에게 통지해야 하는 경우에는 1주일 이상 스루 또는 스루POS, 스루 사장님창구 웹페이지 등에 해당 통지내용을 게시함으로써 개별 통지에 갈음할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 5 조 (판매자 등록)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ① 스루 서비스를 이용하기 위해 판매자 등록을 신청하고자 하는 자(이하 “등록신청자”)는 본 약관에 동의하고, 회사가 제공하는 등록 신청서 양식에 필요한 정보 등을 등록해야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 등록신청자는 신원정보, 매장정보와 상품 정보 등을 회사에 제공해야 하고, 회사는 스루 서비스를 제공하기 위하여 관련 법령에 따라 판매자로부터 제공받은 위 정보를 수집할 수 있습니다. 이 경우, 회사는 등록신청자에게 추가적인 정보의 제공을 요청할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ③ 회사는 등록신청자에게 신원 확인 절차를 요구할 수 있으며, 그러한 절차가 불가능할 경우에는 회사는 신원 확인을 위한 관련 자료를 제출하도록 등록 신청자에게 요구할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ④ 등록신청자는 사업자등록증 등 회사가 요청하는 필수서류를 제출하여야 하고, 필수서류를 제출하지 않거나 제공한 서류가 부정확 또는 허위의 사실인 경우 회사는 가입을 승인을 거절하거나 보류할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑤ 만 19세 이상의 사업자(자연인 또는 법인 불문)는 상기 제1항의 등록 신청 자격이 있습니다. 등록 신청자는 실명으로 등록 신청을 해야 합니다(법인인 경우, 법인의 이름으로 하여야 하며, 이하 본 조에서 동일하게 적용됩니다). 실명이 아닌 이름을 사용하거나 다른 사람의 정보를 도용하는 등록신청자는 서비스 이용이 제한되거나 관련 법률 및 규정에 따라 처벌받을 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑥ 본 약관은 회사가 전항에 따른 등록 신청을 수락하면 효력이 발생됩니다. 이 경우, 회사는 제4조에 의한 방법으로 명시된 수락 의사를 통보하거나 공개할 것이며, 본 약관은 수락 의사가 등록신청자에게 전달되거나 공개된 시점에 양 당사자에 대해 유효하게 효력이 발생됩니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑦ 회사는 서비스 관련 설비의 여유가 없거나, 기술상 또는 업무상 문제가 있어 정상적인 서비스의 제공이 어렵다고 판단되는 경우에는 승낙을 유보할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑧ 회사는 다음 각 호의 경우에는 등록 신청을 거부할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            1. 등록신청자가 회사와의 거래관계에서 계약 조건 및 관련 법률, 규정 등을 위반한 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            2. 등록신청자가 제공한 정보에 허위 정보, 정보 누락, 오타 등이 포함되어 있는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            3. 등록신청자가 본인의 매장을 영업하기 위한 목적이 아니거나 타인 명의로 가입을 신청하는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            4. 등록신청자가 미성년자인 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            5. 등록신청자가 실명으로 등록 신청을 하지 않는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            6. 성명, 주민등록번호, 사업자등록번호, 법인등록번호 및 기타 주요 등록 정보가 이미 등록된 다른 판매자와 동일한 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            7. 본 약관의 해지/취소로부터 2개월 이내에 재등록 신청서가 제출된 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            8. 약관 및 이용정책 위반으로 해지된 이력이 있는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            9. 약관 및 이용정책 위반으로 이용 정지된 상태에서 탈퇴한 이력이 있는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            10. 약관 및 이용정책을 중대하게 위반한 후 탈퇴한 이력이 있는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            11. 가입 신청자가 입력한 정보에 허위 또는 오류가 있거나 회사가 요청하는 증빙서류 등을 제출하지 아니하는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            12. 기타 이에 준하는 사유로서 회사가 가입승인을 하지 않는 것이 적절하다고 판단하는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑨ 판매자는 판매자(판매자를 대신하는 제3자 등을 포함)가 회사에 부정확한 정보 또는 관련 자료를 제공함으로써 회사가 입은 손해에 대해 책임을 져야 하며, 그러한 손해에 대해 회사에게 배상하고 회사를 면책 시켜야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 6 조 (판매자 등록정보 변경 및 유효성 확인 관련)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ① 상호, 대표자, 소재지 연락처, 업종 등 등록정보에 변경 사항(가맹본부와의 가맹점계약 해지, 폐업 등을 포함)이 있는 경우, 판매자는 즉시 등록정보를 회사가 정한 방식으로 변경하거나 해당 변경 사실을 회사에 통지하여야 합니다. 다만, 서비스 관리를 위해 필요한 실명, 아이디, 사업자등록번호 등은 수정할 수 없습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 판매자는 회사에 정보를 제공하거나 등록정보를 변경할 때, 허위 정보를 제공해서는 아니 되며, 관련 자료를 즉시 제공하여야 합니다
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ③ 변경을 신청한 정보가 법령, 정책, 약관, 이용정책, 검수기준, 이용안내 등에 부합하지 않는 경우 회사는 해당 정보의 변경을 제한할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ④ 사업자등록번호를 기재하여 가입한 판매자는 휴업 또는 폐업 상태가 되었을 경우 회사가 정하는 절차에 따라 회사에 정보 수정을 요청하여야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑤ 변경사항을 회사에 알리지 않아 발생한 불이익에 대하여 회사는 회사의 고의 또는 중대한 과실이 없는 이상 책임지지 않습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 7 조 (관련자료의 제출 등)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ① 제5조에 따라 판매자가 제공 또는 등록한 정보의 정확성을 확인하기 위하여, 회사는 관련 법령 및 규정이 허용하는 한도 내에서 판매자에게 관련 자료의 제공을 요구할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 판매자가 정당한 사유 없이 정보 및 관련 자료를 제공하지 않는 경우, 회사는 본 약관의 해지/취소, 서비스 사용 제한 또는 결제 금액의 지급 보류를 포함하여 필요한 조치를 취할 수 있습니다. 이 경우, 판매자는 모든 관련 위험 및 책임을 부담하여야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 8 조 ( 이용제한 등)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 회사는 판매자가 본 약관 및 법령상의 의무를 위반하거나 스루 서비스의 정상적인 운영을 방해한 경우 경고, 일시정지, 영구이용정지 등의 방법으로 서비스 이용을 제한할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ② 회사는 주민등록법을 위반한 명의도용 및 결제도용 등과 같이 관련법을 위반한 경우에는 즉시 영구이용정지를 할 수 있습니다. 본 항에 따른 영구이용정지 시 서비스 이용을 통해 획득한 기타 혜택 등도 모두 소멸되며, 회사는 회사의 고의 또는 중대한 과실이 없는 한 이에 대해 별도로 보상하지 않습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ③ 회사는 다음 각 호가 발생하는 경우 판매자정보의 보호 및 운영의 효율성을 위해 일시적으로 이용을 제한할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            1. 회사와 제휴된 금융기관 등의 전산 마감 시간 등에 따라 서비스 오류 발생 가능성이 높은 시간의 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            2. 컴퓨터 등 정보통신 설비의 보수, 업그레이드, 점검, 교체, 해킹 등으로 정상적인 서비스 제공이 어려운 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            3. 천재지변, 전쟁, 폭동, 테러 등 불가항력적 사유로 서비스 운영이 불가능한 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            4. 판매자가 계속해서 1년 이상 로그인하지 않거나 1년 이상 서비스 거래가 없는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ④ 회사는 판매자가 다음 각 호의 어느 하나에 해당하는 사유가 발생한 경우 주의, 경고, 광고중단, 계약 해지 등 필요한 조치를 할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            1. 판매자가 스루 서비스를 이용하는 고객에게 회사가 제공하는 스루페이를 통하지 아니하고 직접 상품을 판매하거나 판매하려 시도한 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            2. 회사의 직원(스루 서비스 상담 직원, 담당자 등 회사와 관련된 업무를 수행하는 수행자를 모두 포함)에게 욕설, 모욕, 폭언, 성희롱, 성추행, 위협, 폭력 등의 행위를 한 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            3. 판매자가 회사로부터 전달받은 고객의 정보를 본 약관 상의 의무 이행을 위한 목적 외 다른 목적으로 사용한 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            4. 판매자가 위법 부당한 방법으로 고객이 작성한 리뷰의 변경(추가, 삭제 등 포함)을 요청하기 위하여 고객의 휴대전화(일반전화, SNS 포함)로 연락하거나, 고객의 주소지(배달지 등 포함)에 직접 방문하는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            5. 판매자의 상품이나 고객서비스의 품질에 대한 고객의 평가(리뷰 작성, 별점 평가, 상담 민원 등의 방법을 모두 포함)가 현저히 낮다고 회사가 판단하는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            6. 판매자가 스루 서비스와 관련하여 얻게 된 정보를 판매자의 영업을 위한 마케팅에 활용하는 등 무단으로 사용하는 일체의 행위를 한 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            7. 판매자 신청 서류의 기재사항을 허위로 작성한 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            8. 판매자의 고의 또는 과실로 회사 또는 고객에게 상당한 손해가 발생한 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            9. 거래한 고객으로부터 민원이 빈발하여 판매자로 부적당하다고 인정되는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            10. 판매자가 본 약관 및 이용정책 기타 회사의 가이드라인을 위반한 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            11. 판매자가 회사의 스루 서비스를 부정한 목적으로 사용한 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            12. 회사 및 기타 제 3 자의 저작권 등 지적재산권을 침해하는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            13. 회사, 고객 및 기타 제 3 자의 명예를 손상시키거나 업무를 방해하는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            14. 외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 에 공개 또는 게시하는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            15. 법령 위반, 공서양속 위반 등 기타 객관적으로 회사가 이용제한 등을 할 필요가 있다고 인정되는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            18. 기타 이용정책에서 나열하고 있는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑤ 본 조의 이용제한 범위 내에서 제한의 조건 및 세부내용은 이용정책에서 정하는 바에 의합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑥ 본 조에 따라 서비스 이용을 제한하거나 계약을 해지하는 경우에는 회사는 판매자에 대한 통지 절차에 따라 통지합니다. 다만, 계약 해지의 경우를 제외하고 회사가 긴급하게 이용제한 등이 필요하다고 인정한 경우에는 사후 통지할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑦ 회사는 회사의 고의 또는 중대한 과실에 의하지 않는 이용제한 등에 대해서는 어떠한 책임도 지지 않습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 9 조 (본 약관의 해지)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 회사는 제8조 제4항 각 호의 어느 하나에 해당하는 사유가 발생한 경우에는 제4조 제1항에 의한 방법으로 판매자에게 통지함으로써 본 약관 내지 관련 계약을 해지하거나 스루 서비스를 중단할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ② 회사가 일부 지역에서 서비스를 더 이상 제공하지 않기로 결정한 경우나, 전부 또는 일부 판매자에 대한 서비스 제공을 중단하는 것으로 사업상 결정한 경우, 회사는 제 4 조 제 1항에 의한 방법으로 판매자에게 해지 예정일 30 일 이전에 통지함으로써 본 약관 내지 관련 계약을 해지하거나 스루 서비스를 중단할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ③ 판매자는 언제든지 회사가 정한 방식으로 통지하여 본 약관을 해지할 수 있습니다. 이 경우, 해지 의사를 통지하기 전에, 판매자는 서비스 이용을 중단해야 하며, 판매자가 서비스를 이용하여 거래를 이행한 경우, 판매자는 해당 거래를 완료하고 해당 고객과 회사에게 지급할 금액을 지급해야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ④ 판매자는 전항에 따라 해지를 하는 경우, 고객을 보호하기 위하여 해지일 현재 아직 처리되지 않은 주문에 관한 배달, 교환, 환불, 수리 등 필요한 조치를 취하여야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑤ 본조 제2항과 제3항에 따라 판매자가 본 약관의 해지 의사를 회사에 통지하였으나, 본 약관에 따른 해지를 위해 판매자가 이행하여야 할 의무가 완료되지 않은 경우에는 그 의무를 이행하는 것을 조건으로 본 약관이 해지되는 것으로 간주됩니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑥ 본 약관이 해지되는 경우, 회사는 판매자에게 부여된 모든 혜택을 철회할 수 있으며, 해지 사유 및 해당 사유의 해소 여부를 고려하여 판매자의 재등록 신청을 거부할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑦ 본 약관이 해지되는 경우, 회사는 동일한 계정 정보(사업자등록번호, 아이디 등)의 재가입을 제한할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑧ 회사는 안정적인 서비스 운영 및 검색 고객의 보호를 위해 판매자의 탈퇴 또는 직권 해지일로부터 6개월간 재가입을 제한할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑨ 판매자가 약관을 해지할 경우, 관계 법령 및 개인정보처리방침에 따라 보유하는 정보를 제외하고는, 판매자의 게시물, 서비스 이용 정보 등 모든 데이터가 삭제됩니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑩ 판매자가 판매한 상품으로 인해 발생하는 판매자의 의무 및 책임에 관한 본 약관 상의 조항은 본 조항에 따라 본 약관이 해지된 이후에도 유효하게 존속됩니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 10 조 (수수료)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 회사는 스루 서비스 및 스루페이를 유형별로 정의하고, 각 유형의 서비스에 대한 수수료(이하 “서비스 수수료”)를 결정할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ② 회사는 서비스 수수료를 영세가맹점, 중소가맹점, 일반가맹점에 따라 차등하여 적용할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ③ 회사는 이용정책상 서비스 수수료의 종류, 요율, 청구 방법 및 지급 방법, 세금 계산서 발행 등에 관한 특정 조건을 명시하고, 스루POS, 스루사장님창구 웹페이지 등을 통해 동일 내용을 통지하여야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ④ 회사는 필요에 따라 서비스 수수료를 신규로 설정 또는 변경할 수 있으며, 서비스 유형별로 서비스 수수료의 계산 및 지급 방법 등을 달리 정할 수 있습니다. 이 경우 회사는 상기 제2항의 방식에 따라 신규 설립된 서비스 수수료 및 변경된 서비스 수수료의 세부 사항을 통지하여야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑤ 고객이 할인쿠폰 등을 사용하는 경우, 해당 판매자는 할인쿠폰 등에 명시된 대로 고객의 거래가격에 대한 할인을 제공합니다. 이러한 경우, 서비스 수수료는 할인쿠폰 등이 적용되기 전의 거래가격에 적용되는 서비스 수수료에서 할인 금액에 대한 회사의 기여분에 상응하는 금액을 직접 공제하여 계산한 금액으로 합니다. 단, 전술한 내용은 사전에 회사와 상의 없이 판매자가 거래가격에 대해 제공한 할인에 대해서는 적용되지 않습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑥ 회사는 상기 5항에 명시된 할인쿠폰 등의 세부사항을 이용정책에 따라 정하고, 스루 POS 및 서비스 관련 웹페이지 등을 통해 이를 통지하여야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 11 조 (대금 정산 및 유예)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 회사는 본 약관에 따른 내용 중 전자지급결제대행, 결제대금예치, 선불전자지급수단의 발행 및 관리 등 전자금융서비스에 관한 제반업무를 전자금융거래법상 적법한 라이선스를 보유하고 있는 스루페이를 이용하여 처리할 수 있습니다. 단, 해당 업무의 처리와 관련한 내용 이 외에 회사의 이용자에 대한 정산대금 지급채무 등 기본적인 권리의무에 영향을 미치지 않습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ② 회사는 판매자 별 서비스 유형 별로 결제일, 결제방법, 구매 안전 서비스 운영(결제 금액의 에스크로) 등의 조건을 이용정책에 명시하며, 스루사장님 창구, 스루 POS 등을 통해 해당 내용을 통지합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ③ 회사는 계산된 결제 금액에서 서비스 수수료 및 기타 판매자가 회사에 지불해야 하는 상계 가능 금액을 차감하여 잔액을 판매자에게 지급하고, 관련 세부 내역(예를 들면, 상품 판매 대금, 공제 금액, 지급 금액 등)을 판매자 스루사장님 창구, 스루 POS 등을 통해 통지합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ④ 판매자의 행위, 계약 이행 등이 거래 취소, 청구, 분쟁 또는 본 약관, 이용정책 등의 위반을 야기한 것으로 판단되는 경우 또는 회사, 고객 또는 제3자에게 위험을 초래한 것으로 판단되는 경우에는, 회사는 판매자에게 그에 대한 금전적 보장 등의 제공을 요구할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑤ 회사는 다음 각 호의 어느 하나에 해당하는 경우, 판매자에게 결제 금액의 지급을 보류할 수 있습니다. 이와 관련하여, 해당 판매자가 판매한 상품이 관련된 경우, 회사는 관련 상품의 판매 중지 등의 조치를 취할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            1. 고객이 상품을 신용카드로 구매한 경우, 회사는 여신전문금융업법의 관련 조항에 따라 신용카드의 부당 사용으로 인한 잘못된 거래로 판단되는지 여부를 확인하기 위해 최대 10영업일 동안 관련 결제 금액의 지급을 보류할 수 있습니다. 이 경우 회사는 당해 판매자에게 거래의 유효성 확인을 위한 자료를 제출하도록 요구할 수 있으며, 거래의 유효성을 확인한 후 결제 금액을 판매자에게 지급할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            2. 자격을 갖춘 제3자가 가압류, 압류, 추심 등의 법원 명령에 따른 정당한 권리를 기반으로 회사에 대해 판매자에 대한 결제금액의 지급 보류를 요청하는 경우, 회사는 지급 보류에 대한 해당 요청이 철회되거나 정당한 채권자에게 채무가 제공될 때까지 제3자에게 지급할 금액에 상당하는 결제금액의 일부를 지급 보류할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            3. 금융 기관이 지급 불능 거래정지, 회생, 파산에 관한 절차를 시작하거나 또는 이에 상응하는 기타 상당한 우려가 있는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            4. 판매자가 관련 법률 및 규정, 본 약관 또는 이용정책을 위반한 경우.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            5. 다른 사람의 권리에 대한 판매자의 침해로 인해, 정부 기관 또는 제3자가 행정 행위를 취하거나, 조사를 시작하거나 민원을 제기하는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            6. 상기 제4항에 따라 판매자가 판매에 적합하지 않은 상품을 판매한 것이 밝혀지거나 또는 구매자 또는 제3자가 제기한 이의제기 또는 분쟁으로 인해 환불, 교환, 청구, 신고 등의 위험이 있는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            7. 그 밖의 다른 합리적인 사유가 있는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑥ 회사는 상기 제5항의 규정에 따라 조치를 취하고자 하는 경우에는, 그 취지 및 그 사유를 판매자에게 통지하여야 하며, 판매자는 통지 후 2일 이내에 회사에 관련 설명 자료를 제출하여야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑦ 판매자가 제6항의 통지로부터 2일 이내에 설명 자료를 제출하지 아니하거나 제출한 설명자료의 내용이 판매자의 합법성을 뒷받침하기에 충분하지 않은 경우에는, 회사는 해당 원인이 소멸될 때까지 상기 제5항에 따른 조치를 계속할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 12 조 (광고정보 게재)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 판매자는 매장정보와 상품정보(이하, 광고 또는 해당 광고의 대상이 된 정보를 통칭하여 “광고정보”)를 구체적으로 입력하여 고객에게 정확한 정보를 표시하여야 하며, 회사는 판매자가 등록한 정보가 부족하다고 판단하는 경우 판매자에게 정보의 보완 또는 추가 입력을 요청할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ② 매장정보에는 매장명, 매장 주소, 매장 전화번호, 매장 운영시간, 매장상세설명이 표시되어야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ③ 영업정보는 메뉴, 가격, 원산지, 상품 준비 시간등의 정보를 포함합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ④ 회사는 판매자가 게재를 신청한 광고정보를 검수기준에 따라 심사하고, 신청한 정보가 광고정보 내에서 확인되는 경우 원칙적으로 광고 게재를 승낙하며 이를 판매자에게 통지합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑤ 회사가 판매자의 광고정보 게재 신청을 승낙한 것이 광고정보가 위법하지 않거나 약관, 검수기준, 이용안내 등에 적합함을 최종적으로 보증하거나 보장하는 것은 아닙니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑥ 판매자가 게재하는 광고정보는 스루 서비스 및 관련 프로모션 등에 노출될 수 있으며, 해당 노출을 위해 필요한 범위 내에서는 일부 수정, 복제, 편집되어 게시될 수 있습니다. 이 경우, 회사는 저작권법 규정을 준수하며, 판매자는 언제든지 고객센터 또는 서비스 내 관리기능을 통해 해당 게시물에 대해 삭제, 비공개 등의 조치를 취할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 13 조 (판매자의 광고정보 관리의무)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ① 판매자의 광고정보는 등록이 완료되는 때 노출되며, 판매자는 스루사장님 창구, 스루 관리페이지, 스루 POS 등에서 광고정보를 직접 등록하고 관리해야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 판매자는 광고정보를 변경하고자 하는 경우에는 스루에 접속하여 직접 수정하거나 스루 고객센터 또는 영업 담당자(상기 임점대행사 담당자)를 통하여 변경할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ③ 판매자가 스루에서 광고정보를 추가ㆍ삭제ㆍ변경 등 수정한 경우 실시간으로 수정된 정보가 고객에게 노출되고, 이 경우 표시ㆍ광고의 공정화에 관한 법률, 전자상거래 등에서의 소비자보호에 관한 법률, 상표법, 저작권법 등 관련 법령의 적용을 받으며 그에 대한 책임을 부담합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ④ 판매자가 회사의 스루를 이용하지 않고, 외부업체의 사이트(프로그램 등)을 이용하여 광고정보를 등록하는 경우, 이로 인해 발생하는 법적ㆍ기술적 문제에 대한 모든 책임을 부담하여야 하고, 회사는 이에 대한 아무런 책임을 부담하지 않습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑤ 판매자는 회사가 제공하는 양식에 광고정보를 등록하여야 하며, 양식을 준수하지 않거나 허위등록 하는 경우 회사는 해당 상품의 노출을 즉시 중단할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 14 조 (광고정보 수정요청 및 재게재)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 판매자가 실제 매장정보 또는 영업정보와 다르거나 관련 법령, 약관, 검수기준 등을 위반한 것으로 확인되는 경우, 회사는 판매자에게 일정한 기간을 정하여 해당 정보의 삭제 또는 수정을 요청할 수 있습니다.
            </Text>

            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 전항에 따라 수정 요청을 받은 판매자는 정해진 기간까지 게재된 광고정보가 관련 법령 또는 약관, 검수기준 등을 위반하지 않도록 수정해야 하며, 이를 이행하지 않아 발생하는 불이익은 판매자가 부담합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ③ 판매자가 본 조 제1항의 요청을 받았음에도 불구하고, 해당 정보를 수정하지 않는 경우 회사는 판매자의 광고정보 게재 중단, 스루 서비스 이용정지 등의 조치를 취할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ④ 관련 법령 또는 약관, 검수기준 등을 위반하는 사유를 해소한 판매자는 고객센터 또는 영업 담당자를 통해 광고 재 게재 신청을 할 수 있고, 회사는 해당 광고의 게재 여부에 대해 광고주에게 통지합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 15 조 (광고정보 게재 제한)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 광고정보가 다음 각 호의 어느 하나에 해당하는 경우, 회사는 해당 광고정보의 게재를 제한할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            1. 광고정보 노출 기간 중 매장이 폐업한 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            2. 광고정보 등록 시 제출된 서류가 허위/위조로 확인된 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            3. 회사 및 스루 서비스의 명예 · 평판 · 신용이나 신뢰도를 훼손하거나 훼손할 우려가 있는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            4. 서비스의 품질을 저하시키거나 저하시킬 우려가 있는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            5. 등록된 주소정보, 전화번호가 허위이거나 사실여부가 증명되지 않는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            6. 스루 픽업존  설정이 불명확한 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            7. 광고정보에 게재된 가격과 매장 가격이 다른 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            8. 고객에게 추가 수수료를 요구하거나 정당한 사유 없이 고객의 주문을 거부하는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            9. 회사가 정당하고 합리적인 이유를 근거로 광고 게재 제한 등을 요청하는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            10. 판매자가 스루 서비스 내에서 부정행위(서비스 어뷰징) 한 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ② 회사는 광고정보의 게재를 제한하는 경우 원칙적으로 조치를 취하기 전에 그 사유 및 조치할 내용을 판매자에게 통지합니다. 다만, 해당 광고정보가 법령을 위반한 경우 게재 제한 등의 조치를 취한 후에 판매자에게 통지할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ③ 회사는 광고정보의 게재를 제한하는 등의 경우 본 약관 또는 이용정책에서 정하는 방법에 따라 판매자에게 통지합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 16 조 (원산지 표시)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 판매자는 원산지에 대한 정보를 표시하여야 하며, 원산지 정보를 누락하거나 오 표시하는 경우 스루 서비스 이용이 제한될 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ② 판매자는 관련 법령에 따라 원산지 대한 정보를 입력, 표시해야 하고, 회사는 원산지 표시를 하였는지 여부만을 확인하며 원산지 정보의 진정성 등에 대해 어떠한 책임도 부담하지 않습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            제 17 조 (주류광고 등록 및 주류 판매)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 판매자가 주류를 판매하고자 하는 경우 식품위생법 등 법령에 따라 영업허가를 받은 장소에서 주류 판매업을 하는 자에 해당하여야 하며, 주세법 규정에 따라 주류판매업면허 또는 의제주류판매업면허를 취득하여 주류를 판매할 수 있는 권원을 확보해야 합니다. 이를 위반하는 경우 조세범처벌법에 의거 법적 책임을 부담합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ② 판매자는 고객에게 음식과 함께 주류를 판매ㆍ배달하는 경우 판매자는 고객의 성인인지 여부를 확인하여야 하며, 미성년자임을 알게 된 경우 주류를 판매해서는 안 됩니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ③ 판매자가 전항을 위반하여 미성년자에게 주류를 판매한 때에는 청소년보호법 및 식품위생법 등 관련 규정에 따라 법적 책임(형사처벌 및 영업정지 등)을 부담합니다. 또한 회사는 판매자의 성인여부 미확인 및 청소년에게 주류를 판매한 행위에 대해 어떠한 법적 책임도 부담하지 않으며, 판매자는 해당 분쟁과 관련하여 회사를 면책시켜야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ④ 판매자는 본 조 제1항에 따라 관련 법령을 위반하여 법적책임을 부담할 경우 해당 사실 및 그 결과를 회사에 통지하여야 하며, 회사는 법률 위반행위 판매자를 대상으로 광고정보 게재 중단 및 보류, 약관 해지를 할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑤ 판매자가 상품 전달 과정에서 고객이 미성년자임을 알게 되어 주류를 회수한 경우 회수한 주류에 대해서는 고객에게 이용정책에 따라 환불절차를 진행하도록 해야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 18 조 (판매자의 서비스 제공)

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ① 판매자는 고객이 스루의 모바일 주문 과 차량내 상품 수령을 할 수 있도록 서비스를 제공하여야 하고, 품질관리 및 고객서비스 등의 서비스 제공에 따른 책임을 전적으로 부담합니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 판매자는 고객에게 판매자의 일반 고객에게 판매하는 상품과 동일한 상품을 판매하여야 하고, 스루에 명시된 이용조건 이외의 사항으로 고객을 판매자의 일반 고객과 차별하여 취급하여서는 안 됩니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ③ 고객은 회사가 제공하는 스루페이를 통하여만 결제할 수 있으며, 판매자는 계약이행의 과정에서 현금 구매 유도 행위, 구매 취소 요구 또는 유도하는 일체의 행위 등 부당한 방법으로 스루이츠 외의 다른 판매처로 고객을 유인하는 행위를 하여서는 안 됩니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ④ 판매자는 스루 서비스를 대행하는 행위를 하여서는 안 됩니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑤ 판매자는 스루 서비스의 거래 매출 정보를 위조 또는 변조하여서는 안 됩니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑥ 판매자는 판매자 대표자 명의의 전자지급수단으로 물품의 판매 또는 용역의 제공을 가장한 자기매출거래를 하여서는 안 되며, 자기 매출에 의한 거래는 승인이 거절될 수 있습니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑦ 판매자는 정당한 사유 없이 다른 업체와 스루와 동일 또는 유사한 서비스의 계약을 체결하여 고객이 서비스를 이용하는데 불편을 초래해서는 안 됩니다. 단 서비스의 특성상 다른 업체와 서비스 이용계약을 체결하여도 서비스의 품질이 저하되지 않는 경우에는 예외로 합니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑧ 판매자는 본 계약이 해지된 후에도, 고객을 보호하기 위하여 해지일 현재 아직 처리되지 않은 주문에 관한 필요한 조치를 취하여야 합니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑨ 판매자의 사정으로 결제한 상품을 구매 또는 조리할 수 없거나 그 사용에 불편을 초래한 경우(미공지 휴무, 재고부족, 시스템 오류, 폐업, 상품누락, 이물질 발생 등) 또는 상품을 구매할 당시의 계약사항 및 이용조건과 실제 서비스 내용이 상이한 경우(상품 내용 변경 및 오표기 등 계약내용의 임의적 변경, 일반고객과의 차별 등) 회사는 임의로 고객에게 환불 처리하고, 환불에 소요되는 비용과 책임은 판매자가 부담합니다. 이 경우 판매자는 상품 판매대금의 10%(천원 이하인 경우 최소 금액은 천원으로 함)를 고객보상금으로 회사에 지급하여야 합니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑩ 본 약관에 따른 환불은 회사의 환불정책에 따릅니다. 다만, 서비스의 성격상 판매자 환불정책의 적용이 필요한 경우 관련 법령에 위반되지 않는 범위 내에서 판매자의 환불정책에 따를 수 있고, 판매자의 환불정책이 소비자분쟁해결기준, 관련 법령 등에 위반되는 경우 회사는 이의 시정을 요청할 수 있으며, 판매자는 즉시 이를 관계법령에 부합하도록 시정하여야 합니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 19 조 (스루 픽업 서비스)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ① 판매자는 고객이 차량내에서 상품을 수령할 수 있도록 서비스를 제공해야합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 판매자는 상품이 훼손되지 않도록 안전하게 포장해야 하며, 주문 상품에 상품과 일치하는 정확한 영수증 또는 주문표(포스를 사용하지 않는 등 영수증이나 주문표를 출력하기 어려운 매장의 경우, 주문번호나 상품의 종류 등을 적어 상품을 쉽게 확인할 수 있도록 한 쪽지 등으로 대체할 수 있음, 이하, ‘영수증 등’이라고 함)을 부착하여야 합니다. 영수증 등을 정확하게 부착하지 않아 주문 상품과 다른 상품을 픽업 및 배달하게 된 경우 판매자의 귀책사유로 인하여 오픽업, 오배달이 발생한 것으로 봅니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ③ 판매자가 상품을 고객에게 전달하는 과정에서 상품이 누락된 경우 판매자가 상품 누락에 대한 책임을 부담합니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ④ 판매자의 귀책사유로 파트너가 주문 상품과 다른 상품을 수령하게 된 경우 회사는 고객에게 환불 처리하고, 환불에 소요되는 비용은 판매자가 부담하여야 합니다. 
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 20 조 (사용처리)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 판매자는 판매한 내역을 스루의 전산시스템 등에 실시간으로 등록 또는 사용처리를 하여야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ② 판매자의 사유로 판매 등록 또는 사용처리를 하지 않음으로 인하여 발생되는 손해 및 그 정산에 관한 책임은 판매자가 부담합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            제 21 조 (리뷰 관리 및 이용제한)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① “리뷰”란 스루를 이용한 고객이 자신의 경험을 텍스트, 사진, 기타부호를 이용하여 작성ㆍ등록하는 컨텐츠를 의미합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ② 고객 또는 판매자가 명시적인 의사를 표시하지 않는 한 원칙적으로 리뷰를 공개하며, 공개되는 정보에는 리뷰 내용 이외에 아이디 또는 닉네임이 포함될 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ③ 리뷰가 다음 각 호의 사유 중 어느 하나에 해당하는 경우, 부적합 리뷰로 판단하여 사전통지 없이 삭제 또는 임시조치(블라인드) 할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            1. 정확하지 않은 정보를 제공하거나 운영자 등을 사칭하면서 다른 고객에게 피해를 줄 수 있는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            2. 범죄적 행위와 결부된다고 인정되는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            3. 자신의 매장을 홍보할 목적으로 직접 또는 제3자(리뷰대행업체 등)을 통하여 위법 부당한 방법으로 허위 또는 과장된 리뷰를 게재하는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            4. 허위주문 또는 주문취소 등 위법 부당한 방법으로 리뷰권한을 획득하여 고객 또는 제3자의 계정(명의도용)으로 리뷰를 게재하는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            5. 고객의 개인정보(성명, 주소, 전화번호 등)를 게시글에 무단 노출하는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            6. 회사의 법적, 사회적 명예나 평판을 훼손할 수 있는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            7. 기타 스루 운영에 부정적인 영향을 미칠 수 있는 경우
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ④ 판매자가 작성한 리뷰가 위법하여 민∙형사상 책임을 부담한 경우 회사는 스루에 판매자의 위법한 행위 사실 및 사업자정보를 공표 또는 게재하여 노출할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑤ 회사가 부적합한 리뷰로 판단하여 리뷰를 삭제하거나 블라인드 처리한 경우 처리결과 및 그 사유를 해당 리뷰 게시판에 게시할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑥ 내부방침에 적합하지 않은 단어 및 문구 등을 사용할 경우, 리뷰가 등록되지 않을 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑦ 리뷰정보 관리에 대한 상세한 기준은 관련 법령 및 스루 리뷰관리정책에 따릅니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 21 조의 2 (게시중단요청)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ① 고객의 게시물이 정보통신망법, 개인정보 보호법, 저작권법 등 관련 법령에 위반되는 내용을 포함하는 경우, 판매자는 관련 법령이 정한 절차에 따라 해당 게시물의 게시중단 및 삭제 등을 요청할 수 있으며, 회사는 관련 법령에 따라 조치를 취하여야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 회사는 전항에 따른 판매자의 요청이 없는 경우라도 권리침해가 인정될 만한 사유가 있거나 기타 회사 정책 및 관련 법령에 위반되는 경우에는 관련 법령에 따라 해당 게시물에 대해 임시조치 등을 취할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ③ 본 조에 따른 세부절차는 정보통신망법, 개인정보 보호법, 저작권법 등 관련 법령이 규정한 범위 내에서 회사가 정한 게시중단요청서비스에 따릅니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            게시중단요청서비스 : partners@ivid.kr
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 22 조 (회사 및 판매자 간 관계)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 회사와 판매자는 서로 독립적이며, 본 약관은 회사와 판매자 간의 파트너쉽, 합작투자, 판매업자, 프랜차이즈, 대리인, 고용 또는 독점 관계를 구성하지 않습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ② 판매자는 회사의 사전 동의 없이 회사의 명칭, 상표, 로고 등을 자신의 재량으로 사용할 수 없으며, 회사와 판매자 간의 관계를 표시, 홍보 또는 과장할 수 없습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ③ 본 약관은 회사와 판매자 간의 관계에서만 유효하며, 제3자는 본 약관과 관련하여 어떠한 권리, 청구 등을 주장할 수 없습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 23 조 (정보의 제공 및 광고의 게재)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 회사는 스루 서비스의 운영과 관련하여 서비스 화면, 홈페이지, 전자우편 등에 광고를 게재할 수 있습니다. 광고가 게재된 전사우편을 수신한 판매자는 수신거절의 의사표시를 할 수 있습니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 판매자는 회사가 제공하는 서비스와 관련하여 게시물 또는 기타 정보를 변경, 수정, 제한하는 등의 조치를 취하지 않습니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            제 24 조 (권리의 귀속)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 스루 서비스의 제공과 관련하여 발생한 저작물 등 일체의 유ㆍ무형 결과물에 대한 저작권 등 지식재산권은 회사에 귀속됩니다. 단, 판매자의 게시물 및 제휴계약에 따라 제공된 저작물 등은 제외합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ② 판매자는 회사가 스루사장님 창구, 스루 POS , 스루 또는 판매자 전용 시스템을 통해 판매자에게 제공하는 통계자료 및 서비스 등에 대한 일체의 내용을 제3자에게 제공하거나 외부에 유출할 수 없으며, 수정, 편집, 가공할 수 없습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            제 25 조 (지식재산권 등)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 회사에 등록 또는 제공되는 모든 정보, 자료 등이 항상 정확하고 완전하며 유효하다는 것을 보장하기 위해, 판매자는 필요한 경우 최신 정보, 자료 등을 즉시 제공하거나 등록해야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ② 판매자는 회사에게 판매자의 상호, 상표, 사진, 문구, 컨텐츠 등(이하 ‘자료’라 함)을 서비스를 홍보∙판매를 위한 용도로 사용∙복제∙전시∙유포∙전송 등을 할 수 있는 권한을 부여하며, 회사는 이러한 목적으로만 판매자의 자료를 사용하여야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ③ 판매자는 스루 및 판매자 전용 시스템에 게시한 게시물에 대한 저작권 등 지식재산권을 합법적으로 소유하고 있으며, 회사의 서비스 판매 및 판매자의 업체홍보에 있어서 지식재산권과 관련된 법령 등에 대한 위반이 없음을 보증합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ④ 회사가 제작한 자료에 관한 지식재산권은 회사에 있으며, 판매자가 이를 동의 없이 사용하거나 사용 허락된 목적 범위 외에 잘못 사용한 경우 민∙형사상 모든 법적 책임을 부담합니다. 단, 판매자의 매장 내에서 회사가 제작한 자료를 사용하고자 하는 경우, 판매자는 별도로 회사와 그에 관한 약정을 체결하여야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑤ 제3자가 게시물이 자신의 권리를 침해한다며 분쟁을 제기하는 경우 판매자는 본인의 책임과 비용으로 해당 분쟁을 해결하며 회사를 면책하여야 합니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑥ 회사는 권리 침해를 주장하는 제3자가 판매자의 정보 공개를 요청하는 경우 판매자에 대한 정보를 공개를 할 수 있습니다. 이와 관련하여 회사가 제3자에게 손해배상책임을 부담하는 경우 판매자는 회사의 손해배상액 및 그 배상과 관련된 부대비용(이자 및 변호사 보수 등의 방어비용 포함) 등을 부담합니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑦ 판매자는 본 약관에서 정한 업무와 관련하여 회사가 사전에 허용한 각종 표지물 등의 양식만을 사용하여야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑧ 판매자는 본 약관이 해지되거나 종료된 경우에는 대여 받은 각종 표지물 등을 원상태로 반환하고 스루 거래와 관련된 모든 광고물 및 표지물을 즉시 제거하여야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑨ 본 조에 따른 의무는 본 약관이 종료된 후에도 회사 및 판매자에 대하여 유효하게 존속됩니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 26 조 (판매자의 보증)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 판매자는 스루에 명시된 서비스에 대하여 관련 법령에 따라 사업자등록 및 인ㆍ허가 등을 구비하고 적법하게 서비스를 제공할 수 있음을 보증하며, 해당 서비스의 판매에 따른 세금을 납부할 의무가 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ② 판매자는 자신이 제공하는 서비스가 관련 법령상 스루를 통해 대중에게 소개되는 것이 제한되거나 금지된 상품이 아님을 보장하고, 회사의 고의 또는 중과실로 인한 경우를 제외하고 회사가 판매자의 서비스를 회사의 웹사이트에 소개하는 행위로 인해 발생할 수 있는 모든 책임으로부터 회사를 면책시키고, 그로 인한 손해를 배상해야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ③ 본 조항에 따른 의무는 본 약관의 종료 후에도 회사와 판매자에 대하여 유효하게 존속됩니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 27 조 (권리보호)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 회사는 상표권/서비스표권의 존재 여부 및 효력범위에 관하여 임의로 판단하지 않으며, 상표권/서비스표권을 사전에 보호하거나 대신 행사하지 않습니다. 단, 타인의 상표권/서비스표권을 침해하거나 침해할 우려가 있다는 법원의 판결/결정/명령문, 기타 관련 국가기관의 유권해석 등이 제출되는 경우, 지체 없이 해당 광고정보의 게재를 중단할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ② 상표권/서비스표권을 보유한 자는 자신의 권리가 침해되었을 경우 먼저 침해한 자를 상대로 광고정보 게재 중지요청, 권리침해에 해당하는 기재의 삭제요청 등의 권리행사를 해야 합니다. 회사는 자신의 상표권/서비스표권이 침해되었음을 주장하면서 일정한 광고정보의 게재중단을 요청해 오는 자(이하 “요청인”)가 있는 경우, 해당 요청인에게 상표권/서비스표권의 존재를 소명할 수 있는 서류 등의 제출을 요청할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ③ 회사는 요청인의 권리를 침해하고 있다고 지적된 판매자가 해당 광고정보의 게재 또는 해당 기재가 적법한 권리 또는 권한에 의해 행하여진 것임을 소명하지 못했을 경우 해당 광고정보의 게재를 즉시 중단할 수 있으며, 만약 소명하였을 경우라면 지체 없이 요청인에게 이러한 사정을 통지합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ④ 회사는 부정경쟁방지 및 영업비밀의 보호에 관한 법률 상의 부정경쟁행위의 존재 여부 및 그 범위에 관하여 임의로 판단하지 않으며, 부정경쟁행위로부터 광고주 등을 사전에 보호하거나 동 행위의 중단을 요청하지 않습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 28 조 (개인정보보호)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 판매자는 스루 서비스를 통해 알게 된 고객의 개인정보를 상품 전달 등 본 약관에 따른 스루 서비스를 이용하기 위한 목적을 포함하여 회사가 고객으로부터 받은 개인정보 수집·이용 및 제3자 제공 동의서상의 제3자 제공 목적 이외의 용도로 사용할 수 없습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ② 회사는 개인정보보호를 위하여 상품전달 등의 목적으로 판매자에게 제공된 고객의 개인정보를 상당 기간이 지난 후 비공개 조치할 수 있습니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ③ 판매자가 고객의 개인정보를 유출하거나 유용한 경우 회사는 일체의 책임을 지지 아니하며, 판매자가 그에 대한 모든 책임을 부담합니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ④ 판매자는 회사로부터 제공받은 고객의 개인정보를 제공받은 목적(배달, CS 등)의 용도로 법령 또는 회사가 정한 기간 동안 보유할 수 있으며 해당 목적을 달성하거나 그 기간이 종료될 경우 즉시 파기해야 합니다. 또한 제공받은 고객의 개인정보의 주체로부터 직접 파기 요청을 받은 경우 즉시 이에 응해야 합니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ⑤ 판매자는 관련 법령 및 방송통신위원회 고시에 따라 회사로부터 제공받은 고객의 개인정보를 보호하기 위하여 기술적∙관리적 보호조치를 취해야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 29 조 (비밀유지)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ① 판매자는 스루 서비스 사용 중 알게 된 회사 또는 스루 서비스에 관한 모든 정보(서비스 이용 정보, 직접 또는 간접적으로 취득한 기술 및 사업 정보, 고객 정보 및 문서, 전자 파일 등과 같은 형식을 취하는 기타 그 밖의 정보, 본 약관에서 명시된 당사자들의 권리 의무에 관한 세부사항 등을 포함하나 이에 제한되지 않음, 이하 “기밀정보”)를 본 약관의 이행, 스루 서비스의 사용, 스루 서비스를 통한 고객과의 거래 수행 등 본 약관에서 정한 목적 이외의 목적으로 사용해서는 안 됩니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 판매자는 모든 기밀정보가 회사 소유이며 자산 가치를 지니고 있음을 인정하고, 본 약관에서 달리 명시되지 아니하는 한 기밀정보 보호를 위해 합리적인 조치를 취해야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ③ 판매자는 회사의 사전 서면 동의 없이 기밀정보를 복사, 복제 또는 가공하거나 제3자에게 제공, 판매, 홍보 또는 공개할 수 없으며, 고의 또는 과실로 인한 제3자에 대한 기밀 정보 유출에 대하여 모든 책임을 부담합니다(제3자에 대한 손해 및 복구를 포함하나 이에 제한되지 않음).
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ④ 본 조에 따른 의무는 본 약관 및 개별 서비스의 종료 후에도 회사와 판매자에 대하여 유효하게 존속됩니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 30 조 (ID 및 비밀번호 관리)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ① ID 및 비밀번호는 서비스를 이용하기 위해 판매자 전용 시스템(또는 회사가 제공하는 다른 툴)에 접속하기 위한 기간 동안에만 사용될 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 판매자는 회사의 귀책 사유가 아닌 사유로 인하여 발생한 ID 또는 비밀번호의 유출, 양도 또는 대여로 인해 발생하는 모든 손실 및 손해에 대하여 책임을 부담합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ③ 판매자가 자신의 ID나 비밀번호가 도난당하거나 권한 없는 제3자에 의해 사용되었다는 것을 인지한 경우, 판매자는 즉시 이를 회사에 통지하여야 합니다. 이 경우, 회사는 신속하게 해당 문제를 해결하기 위해 최선을 다합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 31 조 (판매자 개인정보 보호)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ① 회사는 판매자가 동의한 서비스 운영 이외의 목적으로 판매자가 서비스 이용을 위해 제공한 개인정보를 이용하지 않습니다. 회사가 그러한 정보를 새로운 목적으로 사용하거나 제3자에게 제공하고자 하는 경우에는 그러한 사용 또는 제공의 목적 등을 판매자에게 통지하고, 해당 사용 또는 제공 시점에 판매자로부터 별도의 동의를 얻어야 합니다. 단, 관련 법령 및 규정에서 달리 정하고 있는 경우에는 그러하지 아니합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 회사는 판매자가 개인정보의 수집, 이용 및 제공에 대한 동의를 거부할 경우 이용이 제한되는 서비스를 미리 특정하여야 하며, 서비스 운영에 필수적이지 않은 개인정보의 수집, 이용 및 제공에 대한 동의를 거부한 판매자에 대해서 서비스 이용 약관을 제한하거나 거부해서는 안됩니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ③ 판매자의 개인정보를 제3자에게 제공할 필요가 있는 경우, 판매자의 개인정보를 보호하기 위하여 회사는 관련 법령이 정하는 바에 따라 판매자의 동의를 얻어야 하며, 회사가 판매자의 개인정보 처리를 제3자에게 위탁하는 경우, 회사는 “판매자 개인정보보호 정책(필요한 경우, 본 정책은 서비스 유형에 따라 다를 수 있음)”을 통해 위탁 관련 세부 사항을 공개해야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ④ 기타 판매자 개인정보의 보호 및 사용에 관한 사항에 대해서는 관련법 및 회사의 개인정보취급방침이 적용됩니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 32 조 (양도의 금지 등)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 판매자는 회사의 사전 서면 동의 없이 본 약관에 따른 권리 및 의무를 제3자에게 양도할 수 없습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ② 본 약관은 회사의 동의를 받은 판매자 및 판매자의 승계인 및 양수인에 대하여 법적으로 구속력을 가집니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ③ 회사는 판매자에 대한 서면통지(전자메일을 포함함)로써 본 약관상의 권리, 의무를 회사의 계열회사(독점규제 및 공정거래에 관한 법률상의 정의를 따름)에 양도할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 33 조 (윤리규정 준수)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 회사와 판매자는 공정하고 투명한 윤리경영을 추진하여 상호간의 신뢰를 구축하고 지속 가능한 발전을 위해 다음의 의무사항을 준수해야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            1. 회사는 판매자 및 관계자 혹은 제3자와 거래 시 어떠한 경우에도 금품, 선물, 향응, 편의 또는 접대를 요구하거나 받는 등의 행위를 하지 않습니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            2. 판매자는 회사와의 계약 이행과정에서 불공정행위를 하거나 금품, 선물, 향응, 편의 또는 접대 등을 요구하거나 제공하지 않습니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            3. 판매자는 회사의 임직원 및 관계자 혹은 제3자가 대가를 요구하면서 고의적으로 업무를 지연하거나 불이익을 제공하는 등 부도덕한 행위를 하는 경우에는 회사의 담당부서(partnerss@ivid.kr)로 즉시 신고하여야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ② 회사와 판매자는 본 약관, 회사와 판매자 간의 제반 약정사항 및 법령을 준수하며, 판매자는 회사의 임직원, 기타 관련자 및 이해관계자와 부정한 목적으로 본 약관에 따른 서비스를 악용하지 않을 책임을 부담합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ③ 회사 및 판매자가 본 조에 따른 의무를 위반한 경우 위반 당사자는 상대방 당사자에 대하여 위반내용에 따른 거래 중지, 계약 해지 등의 책임을 부과합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ④ 제3항에 의하여 거래중지, 계약해지 등의 거래제한 조치를 받은 당사자는 거래 제한 조치를 취한 당사자에 대하여 손해배상청구 및 기타 민ㆍ형사상의 책임, 행정상의 책임의 일체의 이의를 제기하지 않습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 34 조 (손해배상)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 회사 또는 판매자가 본 약관에서 정한 사항을 위반함으로써 상대방에게 손해가 발생한 경우 귀책사유 있는 일방은 상대방에게 발생한 모든 손해(변호사 보수 등의 방어비용 포함)를 배상하여야 합니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 판매자의 귀책사유로 인해 회사에 손해가 발생한 경우 회사는 판매자에게 지급할 대금에서 손해액을 공제할 수 있으며, 판매자의 회사에 대한 채무는 회사가 판매자에게 지급할 대금에서 즉시 상계 처리할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 35 조 (회사의 권한)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 회사는 스루 및 서비스의 내용, 외관, 디자인, 기능 및 기타 양상을 결정할 수 있습니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ② 회사는 본 약관에서 명시된 제한된 목적을 위해 필요한 경우가 아니면 판매자 및 고객의 대리인으로 행동하지 않습니다.

            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            ③ 스루 서비스와 관련하여 사용 가능하거나 제공된 모든 컨텐츠, 소프트웨어, 기능, 자료 및 정보를 포함하여, 스루는 “현상 그대로” 제공됩니다. 스루 서비스의 판매자로서 판매자는 스루 및 판매자 전용 시스템을 자신의 책임 하에 사용합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 36 조 (회사의 면책)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 회사는 판매자가 서비스와 관련하여 게재한 정보, 자료, 사실의 신뢰도, 정확성 등의 내용에 관하여는 고의 또는 중과실이 없는 한 책임을 지지 않습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ② 회사는 판매자에게 스루 서비스를 제공하며, 판매자가 등록한 상품, 서비스 등의 정보 또는 고객과의 거래와 관련하여 분쟁이 발생하는 경우 판매자가 해당 분쟁의 결과에 대해 온전히 책임을 부담합니다. 단, 회사는 어려움 없이 분쟁을 합리적으로 중재하기 위하여 회사가 설립 및 운영하는 고객센터를 통하여 예외적으로 분쟁에 관여할 수 있으며, 판매자는 분쟁 조정 센터가 정한 결정을 가능한 한 최대로 성실히 존중하여야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ③ 회사는 판매자에 대한 정보를 열람할 수 있는 방법을 고객에게 제공할 수 있으며, 판매자는 해당 정보를 입력하지 못하거나 허위 정보를 입력함으로 인하여 발생하는 법적 문제에 대한 모든 책임을 부담해야 합니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ④ 회사는 본 조 제1항 및 제2항과 관련하여 제3자에게 손해를 배상하여 주거나 기타 비용을 지출한 경우에는 판매자에 대해 구상권을 행사할 수 있습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑤ 정당한 권한을 위임 받은 자의 요청이 있는 경우, 회사는 해당 판매자의 상품 판매 등의 행위를 제한 또는 정지할 수 있고, 판매자는 회사의 고의 또는 중과실이 없는 한 이로 인하여 발생하는 손해와 관련하여 회사에 대해 손해배상을 청구할 수 없습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑥ 컴퓨터를 포함한 IT장비와 관련된 수리, 검사, 교환, 고장, 통신두절 등을 포함한 천재지변 또는 이에 준하는 불가항력적인 상황이 발생한 경우, 회사는 스루 서비스의 제공을 일시적으로 중단할 수 있고, 해당 상황이 회사의 고의 또는 중대한 과실에 기인하지 않는 한, 그에 대한 책임을 부담하지 않습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑦ 회사는 판매자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 고의 또는 중과실이 없는 한 책임을 지지 않습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑧ 회사는 판매자의 주의의무 위반으로 발생되는 사고, 분쟁 등에 대하여 고의 또는 중과실이 없는 한 책임을 지지 않습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑨ 회사는 판매자의 자기 정보 또는 고객 정보의 제3자 제공 또는 유출과 관련하여 회사의 귀책사유가 없는 한 판매자, 고객 또는 제3자에 대하여 책임을 지지 않습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑩ 판매자가 관련 법령 및 규정의 제∙개정안, 이용정책, 판매자에게 통지된 사항 등과 관련하여 주의의무를 다하여야 하며, 판매자의 과실로 인해 판매자에게 발생한 손해에 대해서 회사는 책임지지 않습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑪ 회사는 관련 법령이 허용하는 한도 내에서 본 약관 및 스루 서비스로 인해 발생하는 투자 손실, 이익 손실, 사업 기회 손실 등에 대해 어떠한 보증도 제공하지 않으며, 회사는 고의 또는 중과실이 없는 한 이에 대해 책임을 지지 않습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ⑫ 회사는 무료로 제공되는 서비스 이용과 관련하여 관계 법령에 특별한 규정이 없는 한 책임을 지지 않습니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 37 조 (준거법 및 관할)
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ① 본 약관에 대한 회사와 판매자 간의 해석 차이로 인하여 발생하는 모든 분쟁은 대한민국 법에 따라 규율됩니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>

            ② 본 약관 및 스루 서비스 이용으로 인하여 회사 및 판매자 간에 발생하는 분쟁에 관한 소송은 민사소송법 상 관할에 따릅니다.
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            [부칙]
            </Text>
            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#111" }}>
            제 1 조 (시행일) 본 약관은 서비스 이용약관을 읽고 서비스 가입 및 ID생성을 한 날로부터 즉시 시행됩니다. (별도 표시 생략)
            </Text>
        </View>
    )
}