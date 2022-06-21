import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';

import { CompModalContent } from '../modal/ModalContents';

import { ComponentArrowLeft3 } from '../../assets/svg/arrowLeft3';

let idCheckTime;
const { width, height } = Dimensions.get('window');

const LastStep = ({ sProps, fnStepPrev, fnInsert, iSmsToken, iSmsData }) => {
    const [loading, setLoading] = useState(false);

    const [sEditable, setEditable] = useState(true);

    const [nmFocus, setNmFocus] = useState(true);

    const [sNm, setNm] = useState("");

    const [sErrColor, setErrColor] = useState("#F2F3F5");
    const [sErrText, setErrText] = useState("");

    const [textInputType, setTextInputType] = useState("");

    const [minLimit, setMinLimit] = useState(4);
    const [secondsLimit, setSecondsLimit] = useState(59);

    const minutes = useRef(4);
    const seconds = useRef(59);
    const intervalId = useRef(null);

    const stopCounter = () => {
        clearInterval(intervalId.current);
    };

    const getConfirm = async (sIndex) => {
        setLoading(true);
        if(iSmsData !== undefined && iSmsData !== null){
            if(iSmsData.userPhone !== undefined && iSmsData.userPhone !== null){
                const oData = {
                    userPhone: iSmsData.userPhone,
                    userId: iSmsData.userId,
                    sCount: sIndex,
                    smsToken: iSmsToken
                }
                const oResponse = await sProps.appManager.accessAxios("/register/verifySms/v2", "post", null, oData);
                if(oResponse !== undefined && oResponse !== null){
                    if(oResponse.resultCd){
                        if(fnInsert !== undefined && typeof fnInsert === "function"){
                            await stopCounter();
                            await fnInsert(sIndex);
                        }
                    } else {
                        setEditable(true);
                        setNm("");
                        setErrColor("#E32938");
                        setErrText(oResponse.resultMsg);
                    }
                }
            }
        }
        setLoading(false);
    }

    const stepPrev = async () => {
        stopCounter();
        if(fnStepPrev !== undefined && typeof fnStepPrev === "function"){
            await fnStepPrev();
        }
    }

    const onChangeNm = async (text) => {
        const iNm = text;
        setNm(iNm);
        setErrColor("#6490E7");
        setErrText("");
        if(iNm.length === 6){
            setEditable(false);

            if(idCheckTime) clearTimeout(idCheckTime);
            idCheckTime = setTimeout(async () => {
                await getConfirm(iNm);
            }, 300);
        }
    };

    const openModalContent = (sIndex) => {
        sProps.appManager.showModal(
            true,
            <CompModalContent 
                sText={sIndex}
            />, 
            "custom",
            2500
        );
    };

    const sendSMS = async () => {
        if(iSmsData !== undefined && iSmsData !== null){
            if(iSmsData.userPhone !== undefined && iSmsData.userPhone !== null){
                const token = iSmsData.token;
                const userPhone = iSmsData.userPhone;
                const userId = iSmsData.userId;
                const oData = {
                    token,
                    userPhone,
                    userId
                }
                const oResponse = await sProps.appManager.accessAxios("/register/sendSMS/v2", "post", null, oData);
                if(oResponse !== undefined && oResponse !== null){
                    if(oResponse.resultCd === "0000"){
                        setEditable(true);
                        clearInterval(intervalId.current);
                        startCounter();
                    } else {
                        openModalContent(oResponse.resultMsg);
                    }
                }
            }
        }
    }

    const activeNmText = () => {
        setNmFocus(true);
        setErrColor("#6490E7");
        setTextInputType("nm");
    }
    
    const unactiveNmText = () => {
        setNmFocus(false);
        setErrColor("#F2F3F5");
        setTextInputType("");
    }

    const startCounter = () => {
        minutes.current = 4;
        seconds.current = 59;

        intervalId.current = setInterval( async () => {
            seconds.current -= 1;
                
            let tempMinute = parseInt(minutes.current);
            let tempSeconds = parseInt(seconds.current);
            if(tempSeconds < 0){
                if(tempMinute === 0){
                    minutes.current = 0;
                    seconds.current = 0;

                    tempMinute = 0;
                    tempSeconds = "00";

                    stopCounter();
                } else {
                    minutes.current -= 1;
                    seconds.current = 59;

                    tempMinute = minutes.current;
                    tempSeconds = 59;
                }

            } else if (tempSeconds < 10){
                tempSeconds = "0" + tempSeconds.toString();
            }

            setSecondsLimit(tempSeconds);
            setMinLimit(tempMinute);

            if(tempMinute < 1 && tempSeconds < 1){
                setNmFocus(false);
                setErrColor("#E32938");
                setSecondsLimit(59);
                setMinLimit(4);
                setErrText("유효기간이 초과되었습니다 다시 시도해주세요");
            }
        },1000);
    };

    useEffect(() => {
        const start = startCounter();
        return start;
    }, []);

    return (
        <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={{flex:1, backgroundColor: "#fff"}}>
            <View style={{height: height * 0.15, backgroundColor: "#fff", justifyContent: "flex-end", marginLeft: "5%"}}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => stepPrev()} style={{ height: "50%", width: "10%", justifyContent: "center", alignItems: "flex-start"}}>
                    <ComponentArrowLeft3 iHeight={height * 0.025} iWidth={width * 0.05} iColor={"#646970"}/>
                </TouchableOpacity>
            </View>
            <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>문자로 전송된</Text>
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>인증번호 6자리를 입력해주세요.</Text>
            </View>
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                    <TextInput
                        placeholder="6자리 숫자"
                        placeholderTextColor="#B0B7C1"
                        returnKeyType="done"
                        autoFocus={nmFocus}
                        editable={sEditable}
                        maxLength={6}
                        onChangeText={text => onChangeNm(text)}
                        onFocus={() => activeNmText()}
                        onBlur={() => unactiveNmText()}
                        value={sNm}
                        keyboardType="numeric"
                        style={{
                            width: "90%",
                            height: height * 0.07,
                            fontSize: RFPercentage(2.3),
                            borderBottomColor: sErrColor,
                            borderBottomWidth: 1,
                            fontWeight: '500',
                            backgroundColor: '#fff',
                            color: "#000"
                        }}
                    />
                    <View style={{position: "absolute", bottom: "25%", backgroundColor: "#fff", height: height * 0.04, width: width * 0.15, right: "5%", justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.7), color: "#6B7583" }}>{minLimit}:{secondsLimit}</Text>
                    </View>
                    {sErrText !== "" &&
                        <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{sErrText}</Text>
                        </View>
                    }
                </View>
                {textInputType === "" &&
                    <View style={{height: 60, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "5%"}}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => sendSMS()} style={{height: 28, backgroundColor: "#F2F3F5", width: 96, justifyContent: "center", alignItems: "center", borderRadius: 5}}>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.5), color: "#8B94A1" }}>인증번호 재전송</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
            <View style={{height: height / 7 , backgroundColor: "#fff", justifyContent: "center"}}>
                <TouchableOpacity
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
            {loading &&
                <View style={{position: "absolute", top: 0, height, width, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.7}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
        </TouchableOpacity>
    )
}

export default LastStep;