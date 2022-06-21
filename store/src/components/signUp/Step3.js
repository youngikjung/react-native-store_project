import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

import { ComponentArrowLeft3 } from '../../assets/svg/arrowLeft3';

const { width, height } = Dimensions.get('window');

const StepTwo = ({ fnStepPrev, fnInsert, iEmail, iPhone, iNm, iStep2, iBusinessType }) => {
    const [init, setInit] = useState(false);
    const [sDone, setDone] = useState(false);
    
    const [bType, setBType] = useState("대표자명");

    const [nmFocus, setNmFocus] = useState(iStep2);
    const [emailFocus, setEmailFocus] = useState(false);
    const [phoneFocus, setPhoneFocus] = useState(false);

    const [sEmail, setEmail] = useState("");
    const [sPhone, setPhone] = useState("");
    const [sNm, setNm] = useState("");

    const [sNmErrColor, setNmErrColor] = useState("#F2F3F5");
    const [sNmErrText, setNmErrText] = useState("");
    const [sEmailErrColor, setEmailErrColor] = useState("#F2F3F5");
    const [sEmailErrText, setEmailErrText] = useState("");
    const [sPhoneErrColor, setPhoneErrColor] = useState("#F2F3F5");
    const [sPhoneErrText, setPhoneErrText] = useState("");

    const [textInputType, setTextInputType] = useState("");

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const stepPrev = async () => {
        if (textInputType === "email") {
            activeNmText();
        } else if (textInputType === "phone") {
            activeEmailText();
        } else {
            if(fnStepPrev !== undefined && typeof fnStepPrev === "function"){
                await fnStepPrev();
            }
        }
    }

    const onChangeEmail = text => {
        setEmail(text);
        setEmailErrColor("#6490E7");
        setEmailErrText("");
        if(sEmail !== "" && sPhone !== "" && sNm !== ""){
            setDone(true);
        }
    };

    const nextInputSection = (sIndex) => {
        if(!init){
            if(sIndex === "nm"){
                activeEmailText();
            } else if (sIndex === "email") {
                activePhoneText();
            } else {
                unactiveNmText();
                unactiveEmailText();
                unactivePhoneText();
                Keyboard.dismiss()
            }
        } else {
            Keyboard.dismiss()
        }
    }

    const activeNmText = () => {
        setNmFocus(true);
        setEmailFocus(false);
        setPhoneFocus(false);
        setNmErrColor("#6490E7");
        setEmailErrColor("#F2F3F5");
        setPhoneErrColor("#F2F3F5");
        setTextInputType("nm");
    }
    
    const unactiveNmText = () => {
        setNmFocus(false);
        setEmailFocus(false);
        setPhoneFocus(false);
        setNmErrColor("#F2F3F5");
        setTextInputType("");
    }

    const activeEmailText = () => {
        setNmFocus(false);
        setEmailFocus(true);
        setPhoneFocus(false);
        setNmErrColor("#F2F3F5");
        setEmailErrColor("#6490E7");
        setPhoneErrColor("#F2F3F5");
        setTextInputType("email");
    }
    
    const unactiveEmailText = () => {
        setNmFocus(false);
        setEmailFocus(false);
        setPhoneFocus(false);
        setEmailErrColor("#F2F3F5");
        setTextInputType("");
    }
    
    const activePhoneText = () => {
        setNmFocus(false);
        setEmailFocus(false);
        setPhoneFocus(true);
        setNmErrColor("#F2F3F5");
        setEmailErrColor("#F2F3F5");
        setPhoneErrColor("#6490E7");
        setTextInputType("phone");
    }
    
    const unactivePhoneText = () => {
        setNmFocus(false);
        setEmailFocus(false);
        setPhoneFocus(false);
        setPhoneErrColor("#F2F3F5");
        setTextInputType("");
    }

    const onChangeNm = text => {
        setNm(text);
        setNmErrColor("#6490E7");
        setNmErrText("");
        if(sEmail !== "" && sPhone !== "" && sNm !== ""){
            setDone(true);
        }
    };

    const accessDenied = () => {
        let temp = "0";

        if(sNm === ""){
            temp = "1";
            setNmErrColor("#E32938");
            setNmErrText("대표자명을 입력해주세요");
            Keyboard.dismiss();
            setTextInputType("");
        } else if (sEmail === "") {
            temp = "2";
            setEmailErrColor("#E32938");
            setEmailErrText("이메일을 입력해주세요");
            Keyboard.dismiss();
            setTextInputType("");
        } else if (sPhone === "") {
            temp = "3";
            setPhoneErrColor("#E32938");
            setPhoneErrText("전화번호를 입력해주세요");
            Keyboard.dismiss();
            setTextInputType("");
        }

        return temp;
    }
    
    const onChangePhone = text => {
        setPhone(text);
        setPhoneErrColor("#6490E7");
        setPhoneErrText("");
        if(sEmail !== "" && sPhone !== "" && sNm !== ""){
            setDone(true);
        }
    };

    const checkPhoneNm = async () => {
        let temp = "0";

        const regex = /[0-9]{2,3}[0-9]{3,4}[0-9]{4}/;
        if (!regex.test(sPhone)) {
            temp = "3";
            setPhoneErrColor("#E32938");
            setPhoneErrText("'-'을 제외한 숫자 및 올바른 번호가 필요합니다");
            Keyboard.dismiss();
            setTextInputType("");
        }
        
        return temp;
    }
    
    const onKeyboardDidShow = (e) => {
        setKeyboardHeight(e.endCoordinates.height);
    }
    
    const emailValidation = () => {
        let temp = "0";
        
        const regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        if(!regExp.test(sEmail)){
            temp = "2";
            setEmailErrColor("#E32938");
            setEmailErrText("이메일 형식에 맞지 않습니다");
            Keyboard.dismiss();
            setTextInputType("");
        }

        return temp;
    }

    const access = async () => {
        if(sDone){
            const sCheck = accessDenied();
            if(sCheck === "0"){
                const validate = emailValidation(); 
                if(validate === "0"){
                    const checkPhone = await checkPhoneNm(); 
                    if(checkPhone === "0"){
                        if(sEmail !== "" && sPhone !== "" && sNm !== ""){
                            if(fnInsert !== undefined && typeof fnInsert === "function"){
                                fnInsert(sEmail,sPhone,sNm,nmFocus);
                            }
                        }
                    }
                }
            }
        } else {
            accessDenied();
        }
        setInit(true);
    }

    useEffect(() => {
        if(iEmail !== undefined && iEmail !== "" && iPhone !== undefined && iPhone !== "" && iNm !== undefined && iNm !== ""){
            setEmail(iEmail);
            setPhone(iPhone);
            setNm(iNm);
            setNmFocus(false);
            setDone(true);
            setInit(true);
        } else {
            setNmFocus(true);
        }
    }, [iEmail,iPhone,iNm]);

    useEffect(() => {
        if(iBusinessType !== undefined && iBusinessType !== ""){
            if(iBusinessType === "personal"){
                setBType("대표자명");
            } else {
                setBType("법인명");
            }
        }
    }, [iBusinessType]);

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
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>본인확인을 위해</Text>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>인증을 진행해 주세요.</Text>
                </View>
            }
            {textInputType === "nm" &&
                <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", marginLeft: "5%"}}>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>{bType}을 입력해주세요.</Text>
                </View>
            }
            {textInputType === "email" &&
                <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", marginLeft: "5%"}}>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>이메일을 입력해주세요.</Text>
                </View>
            }
            {textInputType === "phone" &&
                <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", marginLeft: "5%"}}>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>휴대폰 번호를 입력해주세요.</Text>
                </View>
            }
            <View style={{flex:1, backgroundColor: "#fff"}}>
                {(textInputType === "" || textInputType === "nm") &&
                    <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                        {sNm !== "" &&
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>{bType}</Text>
                            </View>
                        }
                        <TextInput
                            placeholder={bType}
                            placeholderTextColor="#B0B7C1"
                            returnKeyType="next"
                            autoFocus={nmFocus}
                            onChangeText={text => onChangeNm(text)}
                            onFocus={() => activeNmText()}
                            onBlur={() => unactiveNmText()}
                            onSubmitEditing={() => nextInputSection(textInputType)}
                            value={sNm}
                            style={{
                                width: "90%",
                                height: height * 0.07,
                                fontSize: RFPercentage(2.3),
                                borderBottomColor: sNmErrColor,
                                borderBottomWidth: 1,
                                fontWeight: '500',
                                backgroundColor: '#fff',
                                color: "#000"
                            }}
                        />
                        {sNmErrText !== "" &&
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{sNmErrText}</Text>
                            </View>
                        }
                    </View>
                }
                {(textInputType === "" || textInputType === "email") &&
                    <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                        {sEmail !== "" &&
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>이메일</Text>
                            </View>
                        }
                        <TextInput
                            placeholder="이메일"
                            placeholderTextColor="#B0B7C1"
                            returnKeyType="next"
                            autoFocus={emailFocus}
                            onChangeText={text => onChangeEmail(text)}
                            onFocus={() => activeEmailText()}
                            onBlur={() => unactiveEmailText()}
                            onSubmitEditing={() => nextInputSection(textInputType)}
                            value={sEmail}
                            style={{
                                width: "90%",
                                height: height * 0.07,
                                fontSize: RFPercentage(2.3),
                                borderBottomColor: sEmailErrColor,
                                borderBottomWidth: 1,
                                fontWeight: '500',
                                backgroundColor: '#fff',
                                color: "#000"
                            }}
                        />
                        {sEmailErrText !== "" &&
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{sEmailErrText}</Text>
                            </View>
                        }
                    </View>
                }
                {(textInputType === "" || textInputType === "phone") &&
                    <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                        {sPhone !== "" &&
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>대표자전화번호</Text>
                            </View>
                        }
                        <TextInput
                            placeholder="대표자전화번호( ' - ' 제외 )"
                            placeholderTextColor="#B0B7C1"
                            returnKeyType="done"
                            autoFocus={phoneFocus}
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
                        {sPhoneErrText !== "" &&
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{sPhoneErrText}</Text>
                            </View>
                        }
                    </View>
                }
            </View>
            {(textInputType === "nm" || textInputType === "email") &&
                <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 9,width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.42}}>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>{textInputType !== "phone" ? "다음" : "확인" }</Text>
                </TouchableOpacity>
            }
            {textInputType === "phone" &&
                <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 9,width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.365}}>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>{textInputType !== "phone" ? "다음" : "확인" }</Text>
                </TouchableOpacity>
            }
            {textInputType === "" &&
                <View style={{height: height / 7 , backgroundColor: "#fff", justifyContent: "center"}}>
                    <TouchableOpacity
                        onPress={access}
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

export default StepTwo;