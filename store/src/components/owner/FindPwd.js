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

const FindPwdPage = ({ fnReturn, oProps }) => {
    const [loading, setLoading] = useState(false);

    const [sIdErrColor, setIdErrColor] = useState("#F2F3F5");
    const [sPhoneErrColor, setPhoneErrColor] = useState("#F2F3F5");
    const [sCheckErrColor, setCheckErrColor] = useState("#F2F3F5");
    const [sPwdCheckErrColor, setPwdCheckErrColor] = useState("#F2F3F5");
    const [sPwdErrColor, setPwdErrColor] = useState("#F2F3F5");
    
    const [sId, setId] = useState("");
    const [sPhone, setPhone] = useState("");
    const [sPhoneCheck, setPhoneCheck] = useState("");
    const [userPwd, setUserPwd] = useState("");
    const [userCheckPwd, setUserCheckPwd] = useState("");
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
        } else {
            const oData = {
                sId,
                sPhone,
            }
            const oResponse = await oProps.appManager.accessAxios("/app/ceo/authenticate/check/checkPwd/v2", "post", null, oData);
            if(oResponse !== undefined && oResponse !== null){
                if(oResponse.resultCd === "0000"){
                    let token = randomToken(32);
                    setToken(token);
                    await sendSMS(token);
                } else {
                    openModalContent(oResponse.resultMsg);
                }
            } 
        }
    }

    const changePwd = async () => {
        if(userPwd === ""){
            setPwdErrColor("#E32938");
        } else if (userCheckPwd === ""){
            setPwdCheckErrColor("#E32938");
        } else if (userPwd !== userCheckPwd){
            setPwdErrColor("#E32938");
            setPwdCheckErrColor("#E32938");
            openModalContent("비밀번호를 다시 확인해주세요.");
        } else {
            const oData = {
                sId,
                sPhone,
                userPwd,
                userCheckPwd,
            }
            const oResponse = await oProps.appManager.accessAxios("/app/ceo/authenticate/change/checkPwd/v2", "post", null, oData);
            if(oResponse !== undefined && oResponse !== null){
                if(oResponse.resultCd === "0000"){
                    let oUserConfig = {};
                    oUserConfig['LoginPw'] = userPwd;
                    await oProps.reduxSetUserConfig(oUserConfig);
                    if(fnReturn !== undefined && typeof fnReturn === "function"){
                        await fnReturn();
                    }
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
                userId: sId,
                sCount: sPhoneCheck,
                smsToken: sToken
            }
            const oResponse = await oProps.appManager.accessAxios("/register/verifySms/v2", "post", null, oData);
            if(oResponse !== undefined && oResponse !== null){
                if(oResponse.resultCd){
                    await stopCounter();
                    
                    setClear(true);
                } else {
                    setCheckErrColor("#E32938");
                    openModalContent(oResponse.resultMsg);
                }
            }
        }
    }

    const sendSMS = async (aIndex) => {
        setSecondsLimit(59);
        setMinLimit(4);
        setPhoneCheck("");
        await stopCounter();

        const oData = {
            token: aIndex,
            userPhone: sPhone,
            userId: sId,
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

    const onChangePwd = text => {
        setUserPwd(text);
        setPwdErrColor("#6490E7");
    };

    const onChangeCheckPwd = text => {
        setUserCheckPwd(text);
        setPwdCheckErrColor("#6490E7");
    };

    const onChangeId = async (text) => {
        setId(text);
        setIdErrColor("#6490E7");
    };

    const nextInputSection = (sIndex) => {
        if(sIndex === "id"){
            unactiveIdText();
        } else if(sIndex === "phone") {
            unactivePhoneText();
        } else if(sIndex === "check") {
            unactiveCheckText();
        } else if(sIndex === "pwd") {
            unactivePwd();
        } else if(sIndex === "pwdCheck") {
            unactivePwdCheck();
        }
    }

    const activeIdText = () => {
        setIdErrColor("#6490E7");
        setCheckErrColor("#F2F3F5");
        setPhoneErrColor("#F2F3F5");
        setPwdCheckErrColor("#F2F3F5");
        setPwdErrColor("#F2F3F5");
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
        setPwdCheckErrColor("#F2F3F5");
        setPwdErrColor("#F2F3F5");
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
        setPwdCheckErrColor("#F2F3F5");
        setPwdErrColor("#F2F3F5");
        setTextInputType("check");
    }
    
    const unactiveCheckText = () => {
        setCheckErrColor("#F2F3F5");
        setTextInputType("");
        Keyboard.dismiss();
    }

    const activePwd = () => {
        setIdErrColor("#F2F3F5");
        setCheckErrColor("#F2F3F5");
        setPhoneErrColor("#F2F3F5");
        setPwdCheckErrColor("#F2F3F5");
        setPwdErrColor("#6490E7");
        setTextInputType("pwd");
    }
    
    const unactivePwd = () => {
        setPwdErrColor("#F2F3F5");
        setTextInputType("");
        Keyboard.dismiss();
    }

    const activePwdCheck = () => {
        setIdErrColor("#F2F3F5");
        setCheckErrColor("#F2F3F5");
        setPhoneErrColor("#F2F3F5");
        setPwdCheckErrColor("#6490E7");
        setPwdErrColor("#F2F3F5");
        setTextInputType("pwdCheck");
    }
    
    const unactivePwdCheck = () => {
        setPwdCheckErrColor("#F2F3F5");
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
                    <View style={{ height: height * 0.2, backgroundColor: "#fff", justifyContent: "flex-end", alignItems: "center" }}>
                        <TouchableOpacity onPress={backStep} style={{height: height * 0.05, width: "90%", justifyContent: "center", alignItems: "flex-start"}}>
                            <ComponentArrowLeft3 iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#000"}/>
                        </TouchableOpacity>
                        <View style={{ height: height * 0.07, width: "90%", justifyContent: "center", alignItems: "flex-start" }}>
                            <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#191F28", lineHeight: RFPercentage(3.5)}}>비밀번호 찾기</Text>
                        </View>
                    </View>
                    <View style={{flex:1, backgroundColor: "#fff"}}>
                        {!isClear ?
                            <>
                                {!isCheck ?
                                    <>
                                        {(textInputType === "" || textInputType === "id") &&
                                            <View style={{height: height * 0.15, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                                                <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                                    <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>아이디</Text>
                                                </View>
                                                <TextInput
                                                    placeholder="아이디"
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
                                                <TouchableOpacity activeOpacity={0.8} onPress={() => sendSMS(sToken)} style={{height: 28, backgroundColor: "#F2F3F5", width: 96, justifyContent: "center", alignItems: "center", borderRadius: 5}}>
                                                    <Text style={{fontWeight: "500", fontSize: RFPercentage(1.5), color: "#8B94A1" }}>인증번호 재전송</Text>
                                                </TouchableOpacity>
                                            </View>
                                        }
                                    </>
                                }
                            </>
                        :
                            <>
                                {(textInputType === "" || textInputType === "pwd") &&
                                    <View style={{height: height * 0.15, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                                        <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>새로운 비밀번호</Text>
                                        </View>
                                        <TextInput
                                            placeholder="새로운 비밀번호"
                                            placeholderTextColor="#B0B7C1"
                                            returnKeyType="next"
                                            secureTextEntry={true}
                                            onChangeText={text => onChangePwd(text)}
                                            onFocus={() => activePwd()}
                                            onBlur={() => unactivePwd()}
                                            onSubmitEditing={() => nextInputSection(textInputType)}
                                            value={userPwd}
                                            style={{
                                                width: "90%",
                                                height: height * 0.07,
                                                fontSize: RFPercentage(2.3),
                                                borderBottomColor: sPwdErrColor,
                                                borderBottomWidth: 1,
                                                fontWeight: '500',
                                                backgroundColor: '#fff',
                                                color: "#000"
                                            }}
                                        />
                                    </View>
                                }
                                {(textInputType === "" || textInputType === "pwdCheck") &&
                                    <View style={{height: height * 0.15, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                                        <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>비밀번호 재입력</Text>
                                        </View>
                                        <TextInput
                                            placeholder="비밀번호 재입력"
                                            placeholderTextColor="#B0B7C1"
                                            returnKeyType="done"
                                            secureTextEntry={true}
                                            onChangeText={text => onChangeCheckPwd(text)}
                                            onFocus={() => activePwdCheck()}
                                            onBlur={() => unactivePwdCheck()}
                                            onSubmitEditing={() => nextInputSection(textInputType)}
                                            value={userCheckPwd}
                                            style={{
                                                width: "90%",
                                                height: height * 0.07,
                                                fontSize: RFPercentage(2.3),
                                                borderBottomColor: sPwdCheckErrColor,
                                                borderBottomWidth: 1,
                                                fontWeight: '500',
                                                backgroundColor: '#fff',
                                                color: "#000"
                                            }}
                                        />
                                    </View>
                                }
                            </>
                        }
                    </View>
                    {(textInputType === "id" || textInputType === "pwd" || textInputType === "pwdCheck") &&
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
                            {!isClear ?
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
                            :
                                <View style={{height: height / 6 , backgroundColor: "#fff", justifyContent: "center"}}>
                                    <TouchableOpacity
                                        onPress={changePwd}
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
                                    <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>변경</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </>
                    }
                </>
            }
        </TouchableOpacity>
    )
}

export default FindPwdPage;