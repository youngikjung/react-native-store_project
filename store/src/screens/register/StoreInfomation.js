import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';

import { CompModalContent, CompModalAddress, CompModalOpenConfirm } from '../../components/modal/ModalContents';

import { ComponentDelete } from '../../assets/svg/delete';
import { ComponentArrowDown1 } from '../../assets/svg/arrow_down1';

import { AppRoute } from '../../routes/AppRoutes';

const { width, height } = Dimensions.get('window');

const StoreInfomation = oProps => {
    const [loading, setLoading] = useState(false);
    const [sLocation, setLocation] = useState("");

    const [nmFocus, setNmFocus] = useState(false);
    const [PhoneFocus, setPhoneFocus] = useState(false);
    const [extraFocus, setExtraFocus] = useState(false);

    const [sName, setName] = useState("");
    const [sAddress, setAddress] = useState("");
    const [sExtra, setExtra] = useState("");
    const [sPhone, setPhone] = useState("");

    const [sNmErrColor, setNmErrColor] = useState("#F2F3F5");
    const [sNmErrText, setNmErrText] = useState("");
    const [sAddressErrColor, setAddressErrColor] = useState("#F2F3F5");
    const [sAddressErrText, setAddressErrText] = useState("");
    const [sPhoneErrColor, setPhoneErrColor] = useState("#F2F3F5");
    const [sPhoneErrText, setPhoneErrText] = useState("");
    const [sExtraErrColor, setExtraErrColor] = useState("#F2F3F5");

    const [textInputType, setTextInputType] = useState("");

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const findUrl = () => {
        if(sLocation !== ""){
            let temp = AppRoute.HOME;
            if (sLocation === "order"){
                temp = AppRoute.ORDER;
            } else if (sLocation === "manage"){
                temp = AppRoute.QUICKMANAGE;
            } else if (sLocation === "list"){
                temp = AppRoute.ORDERLIST;
            } else if (sLocation === "product"){
                temp = AppRoute.QUICKINSERT;
            }
            oProps.appManager.navGoTo('reset', temp);

        } else {
            openConfirmModal();
        }
    }

    const getOut = async () => {
        let oUserConfig = {};
        oUserConfig['activate'] = false;
        oUserConfig['AutoLogin'] = false;
        oUserConfig['LoginId'] = "";
        oUserConfig['LoginPw'] = "";
        oUserConfig['Token'] = "";
        oUserConfig['RefreshToken'] = "";
        oUserConfig['uniqueId'] = "";

        oUserConfig['StoreID'] = 0;
        oUserConfig['StoreName'] = "";
        oUserConfig['StoreOwner'] = "";

        oUserConfig['ORDERBASKET'] = [];

        oUserConfig['STOREINFOMATION'] = false;
        oUserConfig['OWNERACCOUNT'] = false;

        await oProps.reduxSetUserConfig(oUserConfig);
        oProps.appManager.navGoTo('reset', AppRoute.MAIN);
        oProps.appManager.hideModal()
    }

    const openConfirmModal = () => {
        oProps.appManager.showModal(
            true,
            <CompModalOpenConfirm
                fnClose={() => oProps.appManager.hideModal()}
                fnMove={() => getOut()}
            />, 
            "custom"
        );
    }

    const onKeyboardDidShow = (e) => {
        setKeyboardHeight(e.endCoordinates.height);
    }

    const onChangeName = text => {
        setName(text);
        setNmErrColor("#6490E7");
        setNmErrText("");
    };

    const onChangExtra = text => {
        setExtra(text);
        setExtraErrColor("#6490E7");
    };

    const onChangePhone = text => {
        const sTemp = text;
        const regex = /[0-9]+$/gi;
        if(sTemp === "" || sTemp === null){
            setPhone(text);
            setPhoneErrColor("#6490E7");
            setPhoneErrText("");
        } else {
            if (regex.test(sTemp)) {
                setPhone(text);
                setPhoneErrColor("#6490E7");
                setPhoneErrText("");
            } else {
                setPhoneErrColor("#E32938");
                setPhoneErrText("숫자로만 입력이 가능합니다");
            }
        }
    };

    const nextInputSection = (sIndex) => {
        if(sIndex === "nm"){
            unactiveNmText();
            if (sPhone === ""){
                activePhoneText();
            } else if (sAddress === ""){
                addressSetting();
            } else {
                Keyboard.dismiss();
            }
        } else if (sIndex === "phone") {
            unactivePhoneText();
            if(sName === ""){
                activeNmText();
            } else if (sAddress === ""){
                addressSetting();
            } else {
                Keyboard.dismiss();
            }
        } else {
            Keyboard.dismiss();
            unactiveNmText();
            unactivePhoneText();
            unactiveExtraText();
        }
    }

    const activeNmText = () => {
        setNmFocus(true);
        setPhoneFocus(false);
        setExtraFocus(false);
        setNmErrColor("#6490E7");
        setPhoneErrColor("#F2F3F5");
        setExtraErrColor("#F2F3F5");
        setTextInputType("nm");
    }
    
    const unactiveNmText = () => {
        setNmFocus(false);
        setPhoneFocus(false);
        setExtraFocus(false);
        setNmErrColor("#F2F3F5");
        setTextInputType("");
    }

    const activePhoneText = () => {
        setNmFocus(false);
        setPhoneFocus(true);
        setExtraFocus(false);
        setNmErrColor("#F2F3F5");
        setPhoneErrColor("#6490E7");
        setExtraErrColor("#F2F3F5");
        setTextInputType("phone");
    }
    
    const unactivePhoneText = () => {
        setNmFocus(false);
        setPhoneFocus(false);
        setExtraFocus(false);
        setPhoneErrColor("#F2F3F5");
        setTextInputType("");
    }

    const activeExtraText = () => {
        setNmFocus(false);
        setPhoneFocus(false);
        setExtraFocus(true);
        setNmErrColor("#F2F3F5");
        setPhoneErrColor("#F2F3F5");
        setExtraErrColor("#6490E7");
        setTextInputType("extra");
    }
    
    const unactiveExtraText = () => {
        setNmFocus(false);
        setPhoneFocus(false);
        setExtraFocus(false);
        setExtraErrColor("#F2F3F5");
        setTextInputType("");
    }

    const addressSetting = () => {
        setTextInputType("address");
        oProps.appManager.showModal(
            true,
            <CompModalAddress 
                fnAddress={(sIndex) => onChangAddress(sIndex)}
            />, 
            "custom"
        );
    }

    const onChangAddress =  async (text) => {
        setAddress(text);
        setAddressErrColor("#F2F3F5");
        setAddressErrText("");
        await oProps.appManager.hideModal();
        nextInputSection("address");
    };

    const accessDenied = () => {
        let temp = "0";

        if(sName === ""){
            temp = "1";
            setNmErrColor("#E32938");
            setNmErrText("대표자명을 입력해주세요");
            Keyboard.dismiss();
            setTextInputType("");
        } else if (sAddress === "") {
            temp = "2";
            setAddressErrColor("#E32938");
            setAddressErrText("주소를 입력해주세요");
            Keyboard.dismiss();
            setTextInputType("");
        } else if (sPhone === "") {
            temp = "3";
            setPhoneErrColor("#E32938");
            setPhoneErrText("매장 전화번호를 입력해주세요");
            Keyboard.dismiss();
            setTextInputType("");
        }

        return temp;
    }

    const openModal = (sIndex) => {
        oProps.appManager.showModal(
            true,
            <CompModalContent sText={sIndex}/>, 
            "custom",
            2500
        );
    };

    const asyncData = async () => {
        setLoading(true);
        const store_id = oProps.UserConfigReducer.StoreID;
        const oResponse = await oProps.appManager.accessAxios("/app/ceo/store/information-" + store_id, "get", "text", null);
        if(oResponse !== undefined && oResponse !== null){
            setAddress(oResponse.address);
            setExtra(oResponse.extraAddress);
            setPhone(oResponse.Nm);
            setName(oResponse.storeNm);
        }
        setLoading(false);
    }

    const insertData = async () => {
        setLoading(true);

        let oData = {
            store_id: oProps.UserConfigReducer.StoreID,
            sName,
            sAddress,
            sPhone,
            sExtra,
        }
        const oResponse = await oProps.appManager.accessAxios("/app/ceo/store/information", "post", null, oData);
        if(oResponse !== undefined){
            if(oResponse){
                if(sLocation !== ""){
                    let temp = AppRoute.HOME;
                    if (sLocation === "order"){
                        temp = AppRoute.ORDER;
                    } else if (sLocation === "manage"){
                        temp = AppRoute.QUICKMANAGE;
                    } else if (sLocation === "list"){
                        temp = AppRoute.ORDERLIST;
                    } else if (sLocation === "product"){
                        temp = AppRoute.QUICKINSERT;
                    }
                    oProps.appManager.navGoTo('reset', temp);
                } else {
                    let oUserConfig = {};
    
                    oUserConfig['StoreName'] = sName;
                    oUserConfig['STOREINFOMATION'] = false;
                    oUserConfig['OWNERACCOUNT'] = true;
    
                    await oProps.reduxSetUserConfig(oUserConfig);
                    oProps.appManager.navGoTo('reset', AppRoute.OWNERACCOUNT);
                }
            } else {
                openModal("문제가 발생했습니다 관리자에 연락바랍니다.");
            }
        }
        setLoading(false);
    }

    const access = async () => {
        const sCheck = accessDenied();
        if(sCheck === "0"){
            insertData();
        }
    }

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
        oProps.appManager.hideModal();
        oProps.appManager.hideDrawer();
        if(oProps.initialProps !== undefined && oProps.initialProps !== null){
            if(oProps.initialProps.route !== undefined && oProps.initialProps.route !== null){
                if(oProps.initialProps.route.params !== undefined && oProps.initialProps.route.params !== null){
                    const initital = oProps.initialProps.route.params;
                    setLocation(initital.sParam);
                }
            }
        }
        asyncData();
    }, []);

    return (
        <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={{flex:1, backgroundColor: "#fff"}}>
            <View style={{height: height * 0.1, backgroundColor: "#fff", justifyContent: "flex-end", marginLeft: "5%"}}>
                <TouchableOpacity activeOpacity={0.8} onPress={findUrl} style={{ height: "50%", width: "10%", justifyContent: "center", alignItems: "flex-start"}}>
                    <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.05} iColor={"#646970"}/>
                </TouchableOpacity>
            </View>
            <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>매장 정보를</Text>
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>입력해 주세요.</Text>
            </View>
            <View style={{flex:1, backgroundColor: "#fff"}}>
                {(textInputType === "" || textInputType === "nm") &&
                    <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                        {sName !== "" &&
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>매장명</Text>
                            </View>
                        }
                        <TextInput
                            placeholder="매장명을 입력해주세요"
                            placeholderTextColor="#B0B7C1"
                            returnKeyType="next"
                            autoFocus={nmFocus}
                            onChangeText={text => onChangeName(text)}
                            onFocus={() => activeNmText()}
                            onBlur={() => unactiveNmText()}
                            onSubmitEditing={() => nextInputSection("nm")}
                            value={sName}
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
                {(textInputType === "" || textInputType === "phone") &&
                    <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                        {sPhone !== "" &&
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>매장 전화번호</Text>
                            </View>
                        }
                        <TextInput
                            placeholder="매장 전화번호( ' - ' 제외 )"
                            placeholderTextColor="#B0B7C1"
                            returnKeyType="next"
                            autoFocus={PhoneFocus}
                            keyboardType="numeric"
                            onChangeText={text => onChangePhone(text)}
                            onFocus={() => activePhoneText()}
                            onBlur={() => unactivePhoneText()}
                            onSubmitEditing={() => nextInputSection("phone")}
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

                {(textInputType === "" || textInputType === "address") &&
                    <TouchableOpacity onPress={addressSetting} style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                        {sAddress !== "" &&
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>매장 주소</Text>
                            </View>
                        }
                        <View style={{width: "90%", height: height * 0.07, borderBottomColor: sAddressErrColor, borderBottomWidth: 1, backgroundColor: "#fff", justifyContent: "center"}}>
                            {sAddress !== "" ?
                                <Text style={{color: "#000", fontWeight: "500", fontSize: RFPercentage(2.3)}}>{sAddress}</Text>
                                :
                                <Text style={{color: "#B0B7C1", fontWeight: "500", fontSize: RFPercentage(2.3)}}>매장 주소</Text>
                            }
                            <View style={{position: "absolute", bottom: "20%", backgroundColor: "#fff",height: height * 0.04, width: width * 0.1, right: "0%", justifyContent: "center", alignItems: "center"}}>
                                <ComponentArrowDown1 iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                            </View>
                        </View>
                        {sAddressErrText !== "" &&
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{sAddressErrText}</Text>
                            </View>
                        }
                    </TouchableOpacity>
                }
                {(textInputType === "" || textInputType === "extra") &&
                    <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                        {sExtra !== "" &&
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>상세 주소</Text>
                            </View>
                        }
                        <TextInput
                            placeholder="상세 주소(선택)"
                            placeholderTextColor="#B0B7C1"
                            returnKeyType="next"
                            autoFocus={extraFocus}
                            onChangeText={text => onChangExtra(text)}
                            onFocus={() => activeExtraText()}
                            onBlur={() => unactiveExtraText()}
                            onSubmitEditing={() => nextInputSection("extra")}
                            value={sExtra}
                            style={{
                                width: "90%",
                                height: height * 0.07,
                                fontSize: RFPercentage(2.3),
                                borderBottomColor: sExtraErrColor,
                                borderBottomWidth: 1,
                                fontWeight: '500',
                                backgroundColor: '#fff',
                                color: "#000"
                            }}
                        />
                    </View>
                }
            </View>
            {(textInputType === "nm" || textInputType === "extra") &&
                <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 90,width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.42}}>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                </TouchableOpacity>
            }
            {textInputType === "phone" &&
                <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 90,width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.36}}>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                </TouchableOpacity>
            }
            {textInputType === "" &&
                <View style={{height: height / 8 , backgroundColor: "#fff", justifyContent: "center"}}>
                    <TouchableOpacity
                        onPress={access}
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
                        <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>적용</Text>
                    </TouchableOpacity>
                </View>
            }
            {loading &&
                <View style={{position: "absolute", top: 0, height, width, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
        </TouchableOpacity>
    )
}

export default StoreInfomation;