import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    Keyboard,
    Dimensions,
} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';

import { CompModalContent } from '../modal/AppModalContent';

const {width, height} = Dimensions.get('window');

const SignIn = ({ fnMove, oProps, fnSignUp, fnFindId, fnFindPwd }) => {
    const [sEmail, setEmail] = useState("");
    const [sEmailColor, setEmailColor] = useState("#E5E7EA");
    const [sEmailBgColor, setEmailBgColor] = useState("#fff");
    const [sPassword, setPassword] = useState("");
    const [sPasswordColor, setPasswordColor] = useState("#E5E7EA");
    const [sPasswordBgColor, setPasswordBgColor] = useState("#fff");

    const [idFocus, setIdFocus] = useState(false);
    const [pwFocus, setPwFocus] = useState(false);

    const [passwordSecure, setPasswordSecure] = useState(true);

    const [sErrText1, setErrText1] = useState("");
    const [sErrText2, setErrText2] = useState("");

    const refInput = useRef(null);

    const loginEmailCheck = text => {
        setEmail(text);
        setEmailColor("#6490E7");
        setEmailBgColor("#fff");
        setErrText1("");
    };

    const loginPassCheck = text => {
        setPassword(text);
        setPasswordColor("#6490E7");
        setPasswordBgColor("#fff");
        setErrText2("");
    };

    const activeIdText = () => {
        setIdFocus(true);
        setPwFocus(false);
        setEmailColor("#6490E7");
        setEmailBgColor("#fff");
        setErrText1("");
    }
    
    const unactiveIdText = () => {
        refInput.current?.focus();
        setIdFocus(false);
        setPwFocus(false);
        setEmailColor("#E5E7EA");
        setErrText1("");
    }

    const activePwText = () => {
        setPwFocus(true);
        setIdFocus(false);
        setPasswordColor("#6490E7");
        setPasswordBgColor("#fff");
        setErrText2("");
    }
    
    const unactivePwText = () => {
        setIdFocus(false);
        setPwFocus(false);
        setPasswordColor("#E5E7EA");
        setErrText2("");
    }

    const getLogin = async () => {
        const sCheck = accessDenied();
        if(sCheck !== undefined && sCheck === "0"){
            let randomDeviceId = (Math.random() * (10 - 1)) + 1;
            let uniqueId = DeviceInfo.getUniqueId();
            let initToken = "";
    
            if(oProps.UserConfigReducer.AppPushStatus){
                const authorizationStatus = await messaging().requestPermission();
                if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
                    await messaging().registerDeviceForRemoteMessages();
                    initToken = await messaging().getToken();
                }
            }
            const oData = {
                id: sEmail,
                password: sPassword,
                deviceuuid: randomDeviceId.toString(),
                token: initToken,
                uniqueId,
                appType : "prd-store",
                platform : Platform.OS === "android" ? "THROO_STORE_APP_VERSION(ANDROID)" : "THROO_STORE_APP_VERSION(IOS)"
            }
            const oResponse = await oProps.appManager.accessAxios("/app/ceo/authenticate/v2", "post", null, oData);
            if (oResponse !== undefined && oResponse !== null) {
                if (oResponse.resultId === "0000") {
                    if(fnMove !== undefined && typeof fnMove === "function"){
                        await fnMove(oResponse,oData.token,oData.id,uniqueId);
                    }
                } else if (oResponse.resultId === "3333") {
                    setEmailColor("#E32938");
                    setEmailBgColor("#FFEEEF");
                    setErrText1(oResponse.resultMsg);
                } else if (oResponse.resultId === "4444") {
                    setPasswordColor("#E32938");
                    setPasswordBgColor("#FFEEEF");
                    setErrText2(oResponse.resultMsg);
                }
            } else {
                openModal("네트워크 에러입니다 나중에 다시 시도바랍니다.");
            }
        }
    }

    const openModal = (sIndex) => {
        oProps.appManager.showModal(
            true,
            <CompModalContent 
                sText={sIndex}
            />, 
            "custom",
            2500
        );
    };
      
    const accessDenied = () => {
        let temp = "0";

        if(sEmail === ""){
            temp = "1";
            setEmailColor("#E32938");
            setEmailBgColor("#FFEEEF");
            setErrText1("이메일을 입력해주세요");
        } else if (sPassword === "") {
            temp = "2";
            setPasswordColor("#E32938");
            setPasswordBgColor("#FFEEEF");
            setErrText2("비밀번호를 입력해주세요");
        }
        return temp;
    }

    const moveToSignUp = async () => {
        if(fnSignUp !== undefined && typeof fnSignUp === "function"){
            await fnSignUp();
        }
    }

    const moveToFindId = async () => {
        if(fnFindId !== undefined && typeof fnFindId === "function"){
            await fnFindId();
        }
    }

    const moveToFindPwd = async () => {
        if(fnFindPwd !== undefined && typeof fnFindPwd === "function"){
            await fnFindPwd();
        }
    }

    useEffect(() => {
        if(oProps.UserConfigReducer.LoginId !== undefined && oProps.UserConfigReducer.LoginId !== null && oProps.UserConfigReducer.LoginId !== ""){
            setEmail(oProps.UserConfigReducer.LoginId);
        }
        if(oProps.UserConfigReducer.LoginPw !== undefined && oProps.UserConfigReducer.LoginPw !== null && oProps.UserConfigReducer.LoginPw !== ""){
            setPassword(oProps.UserConfigReducer.LoginPw);
        }
    }, []);

    return (
        <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={{flex:1, backgroundColor: "#fff"}}>
            <View style={{ height: height * 0.2, backgroundColor: "#fff", justifyContent: "flex-end", alignItems: "center" }}>
                <View style={{ height: height * 0.07, width: "90%", justifyContent: "center", alignItems: "flex-start" }}>
                    <Text style={{fontSize: RFPercentage(2.8), fontWeight: '600', color: "#191F28", lineHeight: RFPercentage(4)}}>안녕하세요</Text>
                    <Text style={{fontSize: RFPercentage(2.8), fontWeight: '600', color: "#191F28", lineHeight: RFPercentage(4)}}>사장님!</Text>
                </View>
            </View>
            <View style={{height: height * 0.05, backgroundColor: "#fff"}} />
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <TextInput
                    placeholder="아이디"
                    placeholderTextColor="#95959E"
                    returnKeyType="next"
                    autoFocus={idFocus}
                    onChangeText={text => loginEmailCheck(text)}
                    onFocus={() => activeIdText()}
                    onBlur={() => unactiveIdText()}
                    onSubmitEditing={() => activePwText()}
                    value={sEmail}
                    style={{
                        fontSize: RFPercentage(2),
                        fontWeight: '600',
                        height: height / 14,
                        borderColor: sEmailColor,
                        borderWidth: 1,
                        backgroundColor: sEmailBgColor,
                        marginLeft: '5%',
                        marginRight: '5%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 8,
                        paddingLeft: "5%",
                        textAlign: 'left',
                        color: "#000"
                    }}
                />
                <View style={{height: sErrText1 === "" ? height * 0.015 : height * 0.04, backgroundColor: "#fff", marginLeft: "6%"}}>
                    <Text style={{fontSize: RFPercentage(1.5), fontWeight: '500', color: "#E32938", lineHeight: RFPercentage(4)}}>{sErrText1}</Text>
                </View>
                <TextInput
                    ref={refInput}
                    placeholder="비밀번호"
                    placeholderTextColor="#95959E"
                    returnKeyType="done"
                    secureTextEntry={passwordSecure}
                    autoFocus={pwFocus}
                    onChangeText={text => loginPassCheck(text)}
                    onFocus={() => activePwText() }
                    onBlur={() => unactivePwText() }
                    onSubmitEditing={() => getLogin()}
                    value={sPassword}
                    style={{
                        fontSize: RFPercentage(2),
                        fontWeight: '600',
                        height: height / 14,
                        borderColor: sPasswordColor,
                        borderWidth: 1,
                        backgroundColor: sPasswordBgColor,
                        marginLeft: '5%',
                        marginRight: '5%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 8,
                        paddingLeft: "5%",
                        textAlign: 'left',
                        color: "#000"
                    }}
                />
                <View style={{height: sErrText2 === "" ? height * 0.015 : height * 0.04, backgroundColor: "#fff", marginLeft: "6%"}}>
                    <Text style={{fontSize: RFPercentage(1.5), fontWeight: '500', color: "#E32938", lineHeight: RFPercentage(4)}}>{sErrText2}</Text>
                </View>
                <TouchableOpacity
                    onPress={getLogin}
                    style={{
                        height: height / 14,
                        backgroundColor: '#6490E7',
                        marginLeft: '5%',
                        marginRight: '5%',
                        marginTop: '2%',
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>로그인</Text>
                </TouchableOpacity>
                <View style={{ height: height * 0.13, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                    <TouchableOpacity onPress={moveToSignUp} style={{height: height * 0.02, width: "30%", borderRightWidth: 1, borderRightWidth: 1, justifyContent: "center", alignItems: "center", borderRightColor: "#B3B3BC"}}>
                        <Text style={{fontSize: RFPercentage(1.8), fontWeight: '600', color: "#6490E7"}}>
                            매장 등록하기
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={moveToFindId} style={{height: height * 0.02, width: "30%", borderRightWidth: 1, borderRightWidth: 1, justifyContent: "center", alignItems: "center", borderRightColor: "#B3B3BC"}}>
                        <Text style={{fontSize: RFPercentage(1.7), fontWeight: '600', color: "#6B7583"}}>
                            아이디 찾기
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={moveToFindPwd} style={{height: height * 0.02, width: "30%", justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontSize: RFPercentage(1.7), fontWeight: '600', color: "#6B7583"}}>
                            비밀번호 찾기
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default SignIn;


                    <Text style={{fontSize: RFPercentage(1.8), fontWeight: '500', color: "#6B7583", marginRight: "3%"}}>
                        아직 계정이 없으신가요?
                        <Text style={{fontSize: RFPercentage(1.8), fontWeight: '600', color: "#6490E7"}}>
                            입점신청하기 {">"}
                        </Text>
                    </Text>