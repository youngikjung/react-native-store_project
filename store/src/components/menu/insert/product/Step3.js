import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard, ScrollView, Animated } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';

import { CompModalMenuDetail } from '../../../modal/ModalContents';

import { ComponentDelete } from '../../../../assets/svg/delete';
import { ComponentArrowLeft3 } from '../../../../assets/svg/arrowLeft3';
import { ComponentQuestionMark } from '../../../../assets/svg/question_mark';

const { width, height } = Dimensions.get('window');

const Step3 = ({ oProps, fnBackGroupList, fnNextStep, fnDelete, sAnimated, iDetail }) => {
    const [animated] = useState(new Animated.Value(sAnimated));

    const [sDetail, setDetail] = useState("");

    const [errNmColor, setErrNmColor] = useState("#EFF0F6");
    const [errNmText, setErrNmText] = useState("");

    const [textInputType, setTextInputType] = useState("");

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const onChangeDetail = text => {
        setDetail(text);
        setErrNmColor("#6490E7");
        setErrNmText("");
    };

    const activeDetailText = () => {
        setErrNmColor("#6490E7");
        setTextInputType("nm")
    };
    
    const unactiveDetailText = () => {
        setErrNmColor("#EFF0F6");
        setTextInputType("")
        Keyboard.dismiss();
    };

    const done = async () => {
        if(fnNextStep !== undefined && typeof fnNextStep === "function"){
            await fnNextStep(sDetail);
        }
    }

    const backStep = async () => {
        if(fnBackGroupList !== undefined && typeof fnBackGroupList === "function"){
            await fnBackGroupList("step2",width * 0.6);
        }
    }

    const openModalMenuDetail = async () => {
        oProps.appManager.showModal(
            true,
            <CompModalMenuDetail fnClose={() => oProps.appManager.hideModal()}/>, 
            "custom",
        );
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
        toValue: width * 0.6,
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
        setDetail(iDetail);
    }, [iDetail]);

    return (
        <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={{flex:1, backgroundColor: "#fff"}}>
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
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <View style={{flex: 0.37, alignItems: "center"}}>
                    <View style={{height: height * 0.07, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                        <TouchableOpacity onPress={openModalMenuDetail} style={{flex:1, alignItems: "center", flexDirection: "row"}}>
                            <Text style={{fontSize: RFPercentage(1.9), fontWeight: '600', color: "#3B3B46"}}>
                                메뉴 설명
                                <Text style={{fontSize: RFPercentage(1.9), fontWeight: '600', color: "#B0B8C3"}}>
                                    (선택)
                                </Text>
                            </Text>
                            <ComponentQuestionMark iHeight={height * 0.02} iWidth={height * 0.03} iColor={"#3B3B46"}/>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        multiline={true}
                        placeholder="예) 한우 패티에 치즈 듬뿍 신선한 야채 가득 버거에 프렌치프라이와 음료"
                        placeholderTextColor="#919AA7"
                        returnKeyType="done"
                        onChangeText={text => onChangeDetail(text)}
                        onFocus={() => activeDetailText()}
                        onBlur={() => unactiveDetailText()}
                        onSubmitEditing={() => done()}
                        value={sDetail}
                        style={{
                            width: "90%",
                            height: height * 0.2,
                            fontSize: RFPercentage(2),
                            borderColor: errNmColor,
                            borderWidth: 1,
                            fontWeight: '500',
                            paddingTop: "5%",
                            paddingBottom: "5%",
                            paddingLeft: "5%",
                            paddingRight: "5%",
                            backgroundColor: '#FAFAFB',
                            borderRadius: 5,
                            color: "#000"
                        }}
                    />
                    {errNmText !== "" &&
                        <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{errNmText}</Text>
                        </View>
                    }
                </View>
            </View>
            {textInputType === "nm" &&
                <TouchableOpacity activeOpacity={0.8} onPress={() => done()} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.42}}>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>다음</Text>
                </TouchableOpacity>
            }
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
        height: height * 0.005, 
        borderBottomColor: "#6490E7", 
        borderBottomWidth: 2
    },
}

export default Step3;