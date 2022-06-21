import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

import { ComponentArrowLeft3 } from '../../assets/svg/arrowLeft3';
import { ComponentEyes } from '../../assets/svg/eyes';
import { ComponentCloseEyes } from '../../assets/svg/closeEyes';

let idCheckTime;

const { width, height } = Dimensions.get('window');

const StepOne = ({sProps,fnStepNext,nId,nPassword,fnStepPrev,iStep1,nPwCheck}) => {
    const [init, setInit] = useState(false);
    const [sDone, setDone] = useState(false);

    const [idFocus, setIdFocus] = useState(iStep1);
    const [pwFocus, setPwFocus] = useState(false);
    const [pwCheckFocus, setPwCheckFocus] = useState(false);

    const [sId, setId] = useState("");
    const [sPassword, setPassword] = useState("");
    const [sPwCheck, setPasswordCheck] = useState("");
    const [passwordSecure, setPasswordSecure] = useState(true);
    const [passwordCheckSecure, setPasswordCheckSecure] = useState(true);

    const [idValidate, setIdValidate] = useState(false);
    const [sIdErrColor, setIdErrColor] = useState("#F2F3F5");
    const [sIdErrText, setIdErrText] = useState("");
    const [sPwErrColor, setPwErrColor] = useState("#F2F3F5");
    const [sPwErrText, setPwErrText] = useState("");
    const [sPwCheckErrColor, setPwCheckErrColor] = useState("#F2F3F5");
    const [sPwCheckErrText, setPwCheckErrText] = useState("");

    const [textInputType, setTextInputType] = useState("");

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const stepPrev = async () => {
        if (textInputType === "pw") {
            activeIdText();
        } else {
            if(fnStepPrev !== undefined && typeof fnStepPrev === "function"){
                await fnStepPrev();
            }
        }
    }

    const nextInputSection = (sIndex) => {
        if(!init){
            if(sIndex === "id"){
                activePwText();
            } else if(sIndex === "pw") {
                activePwCheckText();
            } else {
                nextStep();
            }
        } else {
            Keyboard.dismiss()
        }
    }
    
    const activeIdText = () => {
        setIdFocus(true);
        setPwFocus(false);
        setPwCheckFocus(false);
        setIdErrColor("#6490E7");
        setPwErrColor("#F2F3F5");
        setPwCheckErrColor("#F2F3F5");
        setTextInputType("id");
    }
    
    const unactiveIdText = () => {
        setIdFocus(false);
        setPwFocus(false);
        setPwCheckFocus(false);
        setIdErrColor("#F2F3F5");
        setTextInputType("");
    }

    const activePwText = () => {
        setIdFocus(false);
        setPwFocus(true);
        setPwCheckFocus(false);
        setIdErrColor("#F2F3F5");
        setPwErrColor("#6490E7");
        setPwCheckErrColor("#F2F3F5");
        setTextInputType("pw");
    }
    
    const unactivePwText = () => {
        setIdFocus(false);
        setPwFocus(false);
        setPwCheckFocus(false);
        setPwErrColor("#F2F3F5");
        setTextInputType("");
    }

    const activePwCheckText = () => {
        setIdFocus(false);
        setPwFocus(false);
        setPwCheckFocus(true);
        setIdErrColor("#F2F3F5");
        setPwErrColor("#F2F3F5");
        setPwCheckErrColor("#6490E7");
        setTextInputType("check");
    }
    
    const unactivePwCheckText = () => {
        setIdFocus(false);
        setPwFocus(false);
        setPwCheckFocus(false);
        setPwCheckErrColor("#F2F3F5");
        setTextInputType("");
    }

    const checkId = async sIndex => {
        let hasId = true;
        const oResponse = await sProps.appManager.accessAxios("/register/findId-" + sIndex, "get", "text", null);
        if(oResponse !== undefined && oResponse !== null){
            hasId = oResponse;
        }
        return hasId;
    }

    const onChangeId = async text => {
        const sUserId = text;
        const regex = /[a-z0-9]+$/gi;
        if(sUserId === "" || sUserId === null){
            setId(text);
            setIdErrColor("#6490E7");
            setIdErrText("");
        } else {
            if (regex.test(sUserId)) {
                setId(text);
                if(idCheckTime) clearTimeout(idCheckTime);
                idCheckTime = setTimeout(async () => {
                    const result = await checkId(sUserId);
                    if(!result){
                        setIdErrColor("#6490E7");
                        setIdErrText("");
                        setIdValidate(false);
                        if(sUserId !== "" && sPassword !== "" && sPwCheck !== ""){
                            setDone(true);
                        }
                    } else {
                        setIdValidate(true);
                        setIdErrColor("#E32938");
                        setIdErrText("이미 사용 중인 아이디입니다");
                    }
                }, 300);

            } else {
                setIdValidate(true);
                setIdErrColor("#E32938");
                setIdErrText("영어나 숫자로만 입력이 가능합니다");
            }
        }
    };

    const onChangePassword = async (text) => {
        setPassword(text);
        setPwErrColor("#6490E7");
        setPwErrText("");
        if(sId !== "" && sPassword !== "" && sPwCheck !== ""){
            setDone(true);
        }
    };

    const onChangePasswordCheck = async (text) => {
        setPasswordCheck(text);
        setPwCheckErrColor("#6490E7");
        setPwCheckErrText("");
        if(sId !== "" && sPassword !== "" && sPwCheck !== ""){
            setDone(true);
        }
    };

    const nextStep = async () => {
        if(sDone){
            const sCheck = accessDenied();
            if(sCheck === "0"){
                if(sPassword === sPwCheck){
                    if(fnStepNext !== undefined && typeof fnStepNext === "function"){
                        if(sId !== "" && sPassword !== "" && sPwCheck !== ""){
                            fnStepNext(sId,sPassword,sPwCheck,idFocus);
                        }
                    }
                } else {
                    setTextInputType("");
                    setIdFocus(false);
                    setPwFocus(false);
                    setPwCheckFocus(false);
                    setPwErrText("비밀번호와 비밀번호확인란을 확인해주세요");
                    setPwCheckErrText("비밀번호와 비밀번호확인란을 확인해주세요");
                    Keyboard.dismiss()
                }
            }
        } else {
            accessDenied();
        }
        setInit(true);
    }

    const onKeyboardDidShow = (e) => {
        setKeyboardHeight(e.endCoordinates.height);
    }

    const accessDenied = () => {
        let temp = "0";

        if(sId === ""){
            temp = "1";
            setIdErrColor("#E32938");
            setIdErrText("아이디를 입력해주세요");
            Keyboard.dismiss();
            setTextInputType("");
        } else if (sPassword === "") {
            temp = "2";
            setPwErrColor("#E32938");
            setPwErrText("비밀번호를 입력해주세요");
            Keyboard.dismiss();
            setTextInputType("");
        } else if (sPwCheck === "") {
            temp = "3";
            setPwCheckErrColor("#E32938");
            setPwCheckErrText("비밀번호 한번 더 입력해주세요");
            Keyboard.dismiss();
            setTextInputType("");
        } else if (idValidate) {
            temp = "4";
            setIdErrColor("#E32938");
            setIdErrText("이미 사용 중인 아이디입니다");
            Keyboard.dismiss();
            setTextInputType("");
        }

        return temp;
    }

    useEffect(() => {
        if(nId !== undefined && nId !== "" && nPassword !== undefined && nPassword !== "" && nPassword !== undefined && nPassword !== ""){
            Keyboard.dismiss();
            setTextInputType("");
            setId(nId);
            setPassword(nPassword);
            setPasswordCheck(nPassword);
            setIdFocus(false);
            setDone(true);
            setInit(true);
        } else {
            setIdFocus(true);
        }
    }, [nId,nPassword]);
    
    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    }, []);

    return (
        <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={{flex:1, backgroundColor: "#fff"}}>
            <View style={{height: height * 0.15, backgroundColor: "#fff", justifyContent: "flex-end", marginLeft: "5%"}}>
                <TouchableOpacity activeOpacity={0.8} onPress={stepPrev} style={{ height: "50%", width: "10%", justifyContent: "center", alignItems: "flex-start"}}>
                    <ComponentArrowLeft3 iHeight={height * 0.025} iWidth={width * 0.05} iColor={"#646970"}/>
                </TouchableOpacity>
            </View>
            {textInputType === "" &&
                <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", marginLeft: "5%"}}>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>사용하실 계정 정보를</Text>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>입력해 주세요.</Text>
                </View>
            }
            {textInputType === "id" &&
                <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", marginLeft: "5%"}}>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>아아디를 입력해주세요</Text>
                </View>
            }
            {textInputType === "pw" &&
                <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", marginLeft: "5%"}}>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>비밀번호를 입력해주세요</Text>
                </View>
            }
            {textInputType === "check" &&
                <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", marginLeft: "5%"}}>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>비밀번호를 한번 더 입력해주세요</Text>
                </View>
            }
            <View style={{flex:1, backgroundColor: "#fff"}}>
                {(textInputType === "" || textInputType === "id") &&
                    <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                        {sId !== "" &&
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>아이디</Text>
                            </View>
                        }
                        <TextInput
                            placeholder="아이디"
                            placeholderTextColor="#B0B7C1"
                            returnKeyType="next"
                            autoFocus={idFocus}
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
                        {sIdErrText !== "" &&
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{sIdErrText}</Text>
                            </View>
                        }
                    </View>
                }
                {(textInputType === "" || textInputType === "pw") &&
                    <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                        {sPassword !== "" &&
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>비밀번호</Text>
                            </View>
                        }
                        <TextInput
                            placeholder="비밀번호"
                            placeholderTextColor="#B0B7C1"
                            returnKeyType="done"
                            secureTextEntry={passwordSecure}
                            keyboardType="numeric"
                            autoFocus={pwFocus}
                            onChangeText={text => onChangePassword(text)}
                            onFocus={() => activePwText() }
                            onBlur={() => unactivePwText() }
                            onSubmitEditing={() => nextStep()}
                            value={sPassword}
                            style={{
                                width: "90%",
                                height: height * 0.07,
                                fontSize: RFPercentage(2.3),
                                borderBottomColor: sPwErrColor,
                                borderBottomWidth: 1,
                                fontWeight: '500',
                                backgroundColor: '#fff',
                                color: "#000"
                            }}
                        />
                        <TouchableOpacity onPress={() => setPasswordSecure(!passwordSecure)} style={{position: "absolute", bottom: "25%", backgroundColor: "#fff", height: height * 0.04, width: width * 0.1, right: "10%", justifyContent: "center", alignItems: "center"}}>
                            {!passwordSecure &&
                                <ComponentEyes iHeight={height * 0.05} iWidth={height * 0.035} iColor={"#646970"}/>
                            }
                            {passwordSecure &&
                                <ComponentCloseEyes iHeight={height * 0.05} iWidth={height * 0.035} iColor={"#646970"}/>
                            }
                        </TouchableOpacity>
                        {sPwErrText !== "" &&
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{sPwErrText}</Text>
                            </View>
                        }
                    </View>
                }
                {(textInputType === "" || textInputType === "check") &&
                    <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                        {sPwCheck !== "" &&
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>비밀번호확인</Text>
                            </View>
                        }
                        <TextInput
                            placeholder="비밀번호확인"
                            placeholderTextColor="#B0B7C1"
                            returnKeyType="done"
                            secureTextEntry={passwordCheckSecure}
                            keyboardType="numeric"
                            autoFocus={pwCheckFocus}
                            onChangeText={text => onChangePasswordCheck(text)}
                            onFocus={() => activePwCheckText() }
                            onBlur={() => unactivePwCheckText() }
                            onSubmitEditing={() => nextStep()}
                            value={sPwCheck}
                            style={{
                                width: "90%",
                                height: height * 0.07,
                                fontSize: RFPercentage(2.3),
                                borderBottomColor: sPwCheckErrColor,
                                borderBottomWidth: 1,
                                fontWeight: '500',
                                backgroundColor: '#fff',
                                color: "#000"
                            }}
                        />
                        <TouchableOpacity onPress={() => setPasswordCheckSecure(!passwordCheckSecure)} style={{position: "absolute", bottom: "25%", backgroundColor: "#fff", height: height * 0.04, width: width * 0.1, right: "10%", justifyContent: "center", alignItems: "center"}}>
                            {!passwordCheckSecure &&
                                <ComponentEyes iHeight={height * 0.05} iWidth={height * 0.035} iColor={"#646970"}/>
                            }
                            {passwordCheckSecure &&
                                <ComponentCloseEyes iHeight={height * 0.05} iWidth={height * 0.035} iColor={"#646970"}/>
                            }
                        </TouchableOpacity>
                        {sPwCheckErrText !== "" &&
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{sPwCheckErrText}</Text>
                            </View>
                        }
                    </View>
                }
            </View>
            {textInputType === "id" &&
                <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 9,width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.42}}>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>{textInputType !== "pw" ? "다음" : "확인" }</Text>
                </TouchableOpacity>
            }
            {(textInputType === "pw" || textInputType === "check") &&
                <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 9,width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.36}}>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>{textInputType !== "pw" ? "다음" : "확인" }</Text>
                </TouchableOpacity>
            }
            {textInputType === "" &&
                <View style={{height: height / 7 , backgroundColor: "#fff", justifyContent: "center"}}>
                    <TouchableOpacity
                        onPress={nextStep}
                        style={{
                            height: height / 14,
                            backgroundColor: sDone ? '#6490E7' : "#C5D5F4",
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
            }
        </TouchableOpacity>
    )
}

export default StepOne;