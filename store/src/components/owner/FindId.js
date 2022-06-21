import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    Keyboard,
    Dimensions,
} from 'react-native';
import randomToken from 'random-token';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';

import { ComponentDelete } from '../../assets/svg/delete';
import { ComponentActivation } from '../../assets/svg/activation';
import { ComponentArrowLeft3 } from '../../assets/svg/arrowLeft3';
import { ComponentEyes } from '../../assets/svg/eyes';
import { ComponentCloseEyes } from '../../assets/svg/closeEyes';

import { CompModalContent } from '../../components/modal/ModalContents';

const {width, height} = Dimensions.get('window');

const FindIdPage = ({ fnReturn, oProps }) => {
    const [loading, setLoading] = useState(false);

    const [sIdErrColor, setIdErrColor] = useState("#F2F3F5");
    const [sPhoneErrColor, setPhoneErrColor] = useState("#F2F3F5");
    const [sCheckErrColor, setCheckErrColor] = useState("#F2F3F5");
    const [sOwnerErrColor, setOwnerErrColor] = useState("#F2F3F5");
    
    const [sId, setId] = useState("");
    const [sPhone, setPhone] = useState("");
    const [sOwner, setOwner] = useState("");
    const [sPhoneCheck, setPhoneCheck] = useState("");
    const [userId, setUserId] = useState("");
    const [sToken, setToken] = useState("");

    const [minLimit, setMinLimit] = useState(4);
    const [secondsLimit, setSecondsLimit] = useState(59);

    const [isClear, setClear] = useState(false);
    const [isCheck, setCheck] = useState(false);

    const [textInputType, setTextInputType] = useState("");

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const minutes = useRef(4);
    const seconds = useRef(59);
    const intervalId = useRef(null);

    const stepPrev = async () => {
        if(fnReturn !== undefined && typeof fnReturn === "function"){
            await fnReturn();
        }
    }

    const openModalContent = (sIndex) => {
        oProps.appManager.showModal(
            true,
            <CompModalContent sText={sIndex}/>, 
            "custom",
            2500
        );
    };

    const stopCounter = async () => {
        await clearInterval(intervalId.current);
    };

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
                setCheckErrColor("#E32938");
                setSecondsLimit(59);
                setMinLimit(4);
            }
        },1000);
    };

    const backStep = async () => {
        if(isCheck){
            await stopCounter();
            Keyboard.dismiss();
            minutes.current = 4;
            seconds.current = 59;
            setMinLimit(4);
            setSecondsLimit(59);
            setTextInputType("");
            setPhoneCheck("");
            setClear(false);
            setCheck(false);
        } else {
            if(fnReturn !== undefined && typeof fnReturn === "function"){
                await fnReturn();
            }
        }
    }

    const checkOwnerInfo = async () => {
        if(sId === ""){
            setIdErrColor("#E32938");
        } else if (sPhone === ""){
            setPhoneErrColor("#E32938");
        } else if (sOwner === ""){
            setOwnerErrColor("#E32938");
        } else {
            const oData = {
                sId,
                sPhone,
                sOwner,
            }
            const oResponse = await oProps.appManager.accessAxios("/app/ceo/authenticate/check/checkId/v2", "post", null, oData);
            if(oResponse !== undefined && oResponse !== null){
                if(oResponse.resultCd === "0000"){
                    let token = randomToken(32);
                    setToken(token);
                    setUserId(oResponse.id);
                    await sendSMS(token,oResponse.id);
                } else {
                    openModalContent(oResponse.resultMsg);
                }
            } 
        }
    }

    const confirmOwnerInfo = async () => {
        if(sPhoneCheck === ""){
            setCheckErrColor("#E32938");
        } else {
            const oData = {
                userPhone: sPhone,
                userId,
                sCount: sPhoneCheck,
                smsToken: sToken
            }
            const oResponse = await oProps.appManager.accessAxios("/register/verifySms/v2", "post", null, oData);
            if(oResponse !== undefined && oResponse !== null){
                if(oResponse.resultCd){
                    await stopCounter();
                    let oUserConfig = {};
                    oUserConfig['LoginId'] = userId;
                    await oProps.reduxSetUserConfig(oUserConfig);
                    setClear(true);
                } else {
                    setCheckErrColor("#E32938");
                    openModalContent(oResponse.resultMsg);
                }
            }
        }
    }

    const sendSMS = async (aIndex,sIndex) => {
        setSecondsLimit(59);
        setMinLimit(4);
        setPhoneCheck("");
        await stopCounter();

        const oData = {
            token: aIndex,
            userPhone: sPhone,
            userId: sIndex,
        }
        const oResponse = await oProps.appManager.accessAxios("/app/ceo/authenticate/check/sms", "post", null, oData);
        if(oResponse !== undefined && oResponse !== null){
            if(oResponse.resultCd === "0000"){
                await startCounter();
                setCheck(true);
            } else {
                openModalContent(oResponse.resultMsg);
            }
        }
    }

    const onChangePhone = text => {
        const sTemp = text;
        const regex = /[0-9]+$/gi;
        if(sTemp === "" || sTemp === null){
            setPhone(text);
            setPhoneErrColor("#6490E7");
        } else {
            if (regex.test(sTemp)) {
                setPhone(text);
                setPhoneErrColor("#6490E7");
            } else {
                setPhoneErrColor("#E32938");
            }
        }
    };

    const onChangeCheck = text => {
        const sTemp = text;
        const regex = /[0-9]+$/gi;
        if(sTemp === "" || sTemp === null){
            setPhoneCheck(text);
            setCheckErrColor("#6490E7");
        } else {
            if (regex.test(sTemp)) {
                setPhoneCheck(text);
                setCheckErrColor("#6490E7");
            } else {
                setCheckErrColor("#E32938");
            }
        }
    };

    const onChangeId = async (text) => {
        setId(text);
        setIdErrColor("#6490E7");
    };

    const onChangeOwner = async (text) => {
        setOwner(text);
        setOwnerErrColor("#6490E7");
    };

    const nextInputSection = (sIndex) => {
        if(sIndex === "id"){
            unactiveIdText();
        } else if(sIndex === "phone") {
            unactivePhoneText();
        } else if(sIndex === "owner") {
            unactiveOwnerText();
        } else if(sIndex === "check") {
            unactiveCheckText();
        }
    }

    const activeIdText = () => {
        setIdErrColor("#6490E7");
        setCheckErrColor("#F2F3F5");
        setPhoneErrColor("#F2F3F5");
        setOwnerErrColor("#F2F3F5");
        setTextInputType("id");
    }
    
    const unactiveIdText = () => {
        setIdErrColor("#F2F3F5");
        setTextInputType("");
        Keyboard.dismiss();
    }

    const activePhoneText = () => {
        setIdErrColor("#F2F3F5");
        setCheckErrColor("#F2F3F5");
        setPhoneErrColor("#6490E7");
        setOwnerErrColor("#F2F3F5");
        setTextInputType("phone");
    }
    
    const unactivePhoneText = () => {
        setPhoneErrColor("#F2F3F5");
        setTextInputType("");
        Keyboard.dismiss();
    }

    const activeCheckText = () => {
        setIdErrColor("#F2F3F5");
        setCheckErrColor("#6490E7");
        setPhoneErrColor("#F2F3F5");
        setOwnerErrColor("#F2F3F5");
        setTextInputType("check");
    }
    
    const unactiveCheckText = () => {
        setCheckErrColor("#F2F3F5");
        setTextInputType("");
        Keyboard.dismiss();
    }

    const activeOwnerText = () => {
        setIdErrColor("#F2F3F5");
        setCheckErrColor("#F2F3F5");
        setPhoneErrColor("#F2F3F5");
        setOwnerErrColor("#6490E7");
        setTextInputType("owner");
    }
    
    const unactiveOwnerText = () => {
        setOwnerErrColor("#F2F3F5");
        setTextInputType("");
        Keyboard.dismiss();
    }

    const onKeyboardDidShow = (e) => {
        setKeyboardHeight(e.endCoordinates.height);
    }

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    }, []);

    return (
        <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={{flex: 1, backgroundColor: "#fff"}}>
            {loading ?
                <View style={{flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
                :
                <>
                    {isClear ?
                        <>
                            <View style={{height: height * 0.1, backgroundColor: "#fff", justifyContent: "flex-end", marginLeft: "5%"}} />
                            <View style={{flex:1, backgroundColor: "#fff"}}>
                                <View style={{height: height * 0.1}} />
                                <View style={{height: height * 0.05, justifyContent: "center", alignItems: "center"}}>
                                    <ComponentActivation iHeight={height * 0.045} iWidth={height * 0.05} iColor={"#646970"}/>
                                </View>
                                <View style={{height: height * 0.1, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ fontSize: RFPercentage(2), fontWeight: '600', color: '#191F28' }}>매장 아이디</Text>
                                </View>
                                <View style={{height: height * 0.05, alignItems: "center", justifyContent: "space-between" }}>
                                    <Text style={{ fontSize: RFPercentage(3), fontWeight: '800', color: '#333D4B' }}>{userId}</Text>
                                </View>
                            </View>
                            <View style={{height: height / 8 , backgroundColor: "#fff", justifyContent: "center"}}>
                                <TouchableOpacity
                                    onPress={stepPrev}
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
                                    <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>로그인하기</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    :
                    <>
                        <View style={{ height: height * 0.2, backgroundColor: "#fff", justifyContent: "flex-end", alignItems: "center" }}>
                            <TouchableOpacity onPress={backStep} style={{height: height * 0.05, width: "90%", justifyContent: "center", alignItems: "flex-start"}}>
                                <ComponentArrowLeft3 iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#000"}/>
                            </TouchableOpacity>
                            <View style={{ height: height * 0.07, width: "90%", justifyContent: "center", alignItems: "flex-start" }}>
                                <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#191F28", lineHeight: RFPercentage(3.5)}}>아이디 찾기</Text>
                            </View>
                        </View>
                        <View style={{flex:1, backgroundColor: "#fff"}}>
                            {!isCheck ?
                                <>
                                    {(textInputType === "" || textInputType === "id") &&
                                        <View style={{height: height * 0.15, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>매장명</Text>
                                            </View>
                                            <TextInput
                                                placeholder="매장명"
                                                placeholderTextColor="#B0B7C1"
                                                returnKeyType="next"
                                                onChangeText={text => onChangeId(text)}
                                                onFocus={() => activeIdText()}
                                                onBlur={() => unactiveIdText()}
                                                onSubmitEditing={() => nextInputSection(textInputType)}
                                                value={sId}
                                                style={{
                                                    width: "90%",
                                                    height: height * 0.07,
                                                    fontSize: RFPercentage(2.3),
                                                    borderBottomColor: sIdErrColor,
                                                    borderBottomWidth: 1,
                                                    fontWeight: '500',
                                                    backgroundColor: '#fff',
                                                    color: "#000"
                                                }}
                                            />
                                        </View>
                                    }
                                    {(textInputType === "" || textInputType === "owner") &&
                                        <View style={{height: height * 0.15, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>대표자명</Text>
                                            </View>
                                            <TextInput
                                                placeholder="대표자명"
                                                placeholderTextColor="#B0B7C1"
                                                returnKeyType="next"
                                                onChangeText={text => onChangeOwner(text)}
                                                onFocus={() => activeOwnerText()}
                                                onBlur={() => unactiveOwnerText()}
                                                onSubmitEditing={() => nextInputSection(textInputType)}
                                                value={sOwner}
                                                style={{
                                                    width: "90%",
                                                    height: height * 0.07,
                                                    fontSize: RFPercentage(2.3),
                                                    borderBottomColor: sOwnerErrColor,
                                                    borderBottomWidth: 1,
                                                    fontWeight: '500',
                                                    backgroundColor: '#fff',
                                                    color: "#000"
                                                }}
                                            />
                                        </View>
                                    }
                                    {(textInputType === "" || textInputType === "phone") &&
                                        <View style={{height: height * 0.15, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>전화번호</Text>
                                            </View>
                                            <TextInput
                                                placeholder="입점시 등록한 사장님 전화번호"
                                                placeholderTextColor="#B0B7C1"
                                                returnKeyType="next"
                                                keyboardType="numeric"
                                                onChangeText={text => onChangePhone(text)}
                                                onFocus={() => activePhoneText()}
                                                onBlur={() => unactivePhoneText()}
                                                onSubmitEditing={() => nextInputSection(textInputType)}
                                                value={sPhone}
                                                style={{
                                                    width: "90%",
                                                    height: height * 0.07,
                                                    fontSize: RFPercentage(2.3),
                                                    borderBottomColor: sPhoneErrColor,
                                                    borderBottomWidth: 1,
                                                    fontWeight: '500',
                                                    backgroundColor: '#fff',
                                                    color: "#000"
                                                }}
                                            />
                                        </View>
                                    }
                                    
                                </>
                                :
                                <>
                                    {(textInputType === "" || textInputType === "check") &&
                                        <View style={{height: height * 0.15, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>인증번호</Text>
                                            </View>
                                            <TextInput
                                                placeholder="인증번호를 입력하세요"
                                                placeholderTextColor="#B0B7C1"
                                                returnKeyType="next"
                                                keyboardType="numeric"
                                                maxLength={6}
                                                onChangeText={text => onChangeCheck(text)}
                                                onFocus={() => activeCheckText()}
                                                onBlur={() => unactiveCheckText()}
                                                onSubmitEditing={() => nextInputSection(textInputType)}
                                                value={sPhoneCheck}
                                                style={{
                                                    width: "90%",
                                                    height: height * 0.07,
                                                    fontSize: RFPercentage(2.3),
                                                    borderBottomColor: sCheckErrColor,
                                                    borderBottomWidth: 1,
                                                    fontWeight: '500',
                                                    backgroundColor: '#fff',
                                                    color: "#000"
                                                }}
                                            />
                                            <View style={{position: "absolute", bottom: "25%", backgroundColor: "#fff", height: height * 0.04, width: width * 0.15, right: "5%", justifyContent: "center", alignItems: "center"}}>
                                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.7), color: "#6B7583" }}>{minLimit}:{secondsLimit}</Text>
                                            </View>
                                        </View>
                                    }
                                    {textInputType === "" &&
                                        <View style={{height: 60, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "5%"}}>
                                            <TouchableOpacity activeOpacity={0.8} onPress={() => sendSMS(sToken,userId)} style={{height: 28, backgroundColor: "#F2F3F5", width: 96, justifyContent: "center", alignItems: "center", borderRadius: 5}}>
                                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.5), color: "#8B94A1" }}>인증번호 재전송</Text>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                </>
                            }
                        </View>
                        {(textInputType === "id" || textInputType === "owner") &&
                            <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 9,width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.42}}>
                                <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                            </TouchableOpacity>
                        }
                        {(textInputType === "phone" || textInputType === "check") &&
                            <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 9,width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.36}}>
                                <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                            </TouchableOpacity>
                        }
                        {textInputType === "" &&
                            <>
                                {!isCheck ?
                                    <View style={{height: height / 6 , backgroundColor: "#fff", justifyContent: "center"}}>
                                        <TouchableOpacity
                                            onPress={checkOwnerInfo}
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
                                        <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>찾기</Text>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <View style={{height: height / 6 , backgroundColor: "#fff", justifyContent: "center"}}>
                                        <TouchableOpacity
                                            onPress={confirmOwnerInfo}
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
                                        <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>완료</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </>
                        }
                    </>
                    }
                </>
            }
        </TouchableOpacity>
    )
}

export default FindIdPage;