import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';

import { CompModalContent, CompModalBankList } from '../../components/modal/ModalContents';

import { ComponentDelete } from '../../assets/svg/delete';
import { ComponentArrowLeft3 } from '../../assets/svg/arrowLeft3';
import { ComponentNotice1 } from '../../assets/svg/notice1';
import { ComponentArrowDown1 } from '../../assets/svg/arrow_down1';

import { AppRoute } from '../../routes/AppRoutes';
import { ScrollView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const OwnerAccount = oProps => {
    const [loading, setLoading] = useState(false);
    const [sLocation, setLocation] = useState("");

    const [info] = useState(oProps.UserConfigReducer.OWNERACCOUNT);

    const [bankAccountFocus, setBankAccountFocus] = useState(false);
    const [businessNmFocus, setBusinessNmFocus] = useState(false);

    const [sBank, setBank] = useState("");
    const [sBankAccount, setBankAccount] = useState("");
    const [sBusinessNm, setBusinessNm] = useState("");
    const [sOwner, setOwner] = useState(oProps.UserConfigReducer.StoreOwner);

    const [sBankErrColor, setBankErrColor] = useState("#F2F3F5");
    const [sAccountNmTextErrColor, setAccountNmTextErrColor] = useState("#F2F3F5");
    const [sAccountTextErrColor, setAccountTextErrColor] = useState("#6B7583");
    const [sBankErrText, setBankErrText] = useState("대표자명과 예금주가 같아야해요");
    const [sBankAccountErrColor, setBankAccountErrColor] = useState("#F2F3F5");
    const [sBankAccountTextErrColor, setBankAccountTextErrColor] = useState("#6B7583");
    const [sBankAccountErrText, setBankAccountErrText] = useState("띄어쓰기 없이 숫자만 입력해 주세요.");
    const [sBusinessNmErrColor, setBusinessNmErrColor] = useState("#F2F3F5");
    const [sBusinessNmTextErrColor, setBusinessNmTextErrColor] = useState("#6B7583");
    const [sBusinessNmErrText, setBusinessNmErrText] = useState("띄어쓰기 없이 10자리 숫자만 입력해 주세요.");

    const [textInputType, setTextInputType] = useState("");

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const onChangeBankAccount = text => {
        const sTemp = text;
        const regex = /[0-9]+$/gi;
        if(sTemp === "" || sTemp === null){
            setBankAccount(text);
            setBankAccountErrColor("#6490E7");
            setBankAccountTextErrColor("#16C37F");
            setBankAccountErrText("띄어쓰기 없이 숫자만 입력해 주세요.");
        } else {
            if (regex.test(sTemp)) {
                setBankAccount(text);
                setBankAccountErrColor("#6490E7");
                setBankAccountTextErrColor("#16C37F");
                setBankAccountErrText("띄어쓰기 없이 숫자만 입력해 주세요.");
            } else {
                setBankAccountErrColor("#E32938");
                setBankAccountTextErrColor("#E32938");
                setBankAccountErrText("띄어쓰기 없이 숫자만 입력해 주세요.");
            }
        }
    };

    const onChangeBusinessNm = text => {
        const sTemp = text;
        const regex = /[0-9]+$/gi;
        if(sTemp === "" || sTemp === null){
            setBusinessNm(text);
            setBusinessNmErrColor("#6490E7");
            setBusinessNmTextErrColor("#16C37F");
            setBusinessNmErrText("띄어쓰기 없이 10자리 숫자만 입력해 주세요.");
        } else {
            if (regex.test(sTemp)) {
                setBusinessNm(text);
                setBusinessNmErrColor("#6490E7");
                setBusinessNmTextErrColor("#16C37F");
                setBusinessNmErrText("띄어쓰기 없이 10자리 숫자만 입력해 주세요.");
            } else {
                setBusinessNmErrColor("#E32938");
                setBusinessNmTextErrColor("#E32938");
                setBusinessNmErrText("띄어쓰기 없이 10자리 숫자만 입력해 주세요.");
            }
        }
    };

    const activeBankAccountText = () => {
        setBankAccountFocus(true);
        setBusinessNmFocus(false);
        setBankErrColor("#F2F3F5");
        setBankAccountErrColor("#6490E7");
        setBusinessNmErrColor("#F2F3F5");
        setTextInputType("bankaccount");
    }
    
    const unactiveBankAccountText = () => {
        setBankAccountFocus(false);
        setBusinessNmFocus(false);
        setBankAccountErrColor("#F2F3F5");
        setTextInputType("");
    }

    const activeBusinessNmText = () => {
        setBankAccountFocus(false);
        setBusinessNmFocus(true);
        setBankErrColor("#F2F3F5");
        setBankAccountErrColor("#F2F3F5");
        setBusinessNmErrColor("#6490E7");
        setTextInputType("business");
    }
    
    const unactiveBusinessNmText = () => {
        setBankAccountFocus(false);
        setBusinessNmFocus(false);
        setBusinessNmErrColor("#F2F3F5");
        setTextInputType("");
    }

    const findUrl = () => {
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
    }

    const backToInfomation = () => {
        oProps.appManager.navGoTo('reset', AppRoute.STOREINFOMATION);
    }

    const onKeyboardDidShow = (e) => {
        setKeyboardHeight(e.endCoordinates.height);
    }
    
    const openModal = (sIndex) => {
        oProps.appManager.showModal(
            true,
            <CompModalContent sText={sIndex}/>, 
            "custom",
            2500
        );
    };

    const onChangeBank = async (sIndex) => {
        setBank(sIndex);
        setBankErrColor("#F2F3F5");
        setAccountTextErrColor("#16C37F");
        if(oProps.UserConfigReducer.BusinessType === "corporate"){
            setBankErrText("법인명과 예금주가 같아야해요");
        } else {
            setBankErrText("대표자명과 예금주가 같아야해요");
        }
        Keyboard.dismiss();
        setTextInputType("");
        await oProps.appManager.hideModal();
    }

    const openBankList = () => {
        Keyboard.dismiss();
        oProps.appManager.showModal(
            true,
            <CompModalBankList 
                aBank={sBank}
                fnSelectValue={(sIndex) => onChangeBank(sIndex)}
            />,  
            "custom"
        );
    }

    const nextInputSection = (sIndex) => {
        if(sIndex === "business"){
            if(sBank !== "" && sBankAccount !== "" && sBusinessNm !== ""){
                Keyboard.dismiss();
                setTextInputType("");
            } else {
                unactiveBusinessNmText();
                if (sBankAccount === ""){
                    activeBankAccountText();
                } else if (sBank === ""){
                    openBankList();
                } else {
                    Keyboard.dismiss();
                }
            }
        } else if (sIndex === "bankaccount") {
            if(sBank !== "" && sBankAccount !== "" && sBusinessNm !== ""){
                Keyboard.dismiss();
                setTextInputType("");
            } else {
                unactiveBankAccountText();
                if(sBusinessNm === ""){
                    activeBusinessNmText();
                } else if (sBank === ""){
                    openBankList();
                } else {
                    Keyboard.dismiss();
                }
            }
        } else {
            if(sBank !== "" && sBankAccount !== "" && sBusinessNm !== ""){
                Keyboard.dismiss();
                setTextInputType("");
            } else {
                Keyboard.dismiss();
                unactiveBusinessNmText();
                unactiveBankAccountText();
            }
        }
    }

    const accessDenied = () => {
        let temp = "0";

        if(sBank === ""){
            temp = "1";
            setBankErrColor("#E32938");
            setAccountTextErrColor("#E32938");
            setBankErrText("은행을 선택해주세요");
            Keyboard.dismiss();
            setTextInputType("");
        } else if (sBankAccount === "") {
            temp = "2";
            setBankAccountErrColor("#E32938");
            setBankAccountTextErrColor("#E32938");
            setBankAccountErrText("계좌번호를 입력해주세요");
            Keyboard.dismiss();
            setTextInputType("");
        } else if (sBusinessNm === "") {
            temp = "3";
            setBusinessNmErrColor("#E32938");
            setBusinessNmTextErrColor("#E32938");
            setBusinessNmErrText("사업자번호를 입력해주세요");
            Keyboard.dismiss();
            setTextInputType("");
        }

        return temp;
    }

    const access = async () => {
        const sCheck = accessDenied();
        if(sCheck === "0"){
            insertData();
        }
    }

    const insertData = async () => {
        setLoading(true);
        let oData = {
            store_id: oProps.UserConfigReducer.StoreID,
            sBank,
            sBankAccount,
            sBusinessNm,
        }
        const oResponse = await oProps.appManager.accessAxios("/app/ceo/store/validationBusiness", "post", null, oData);
        if(oResponse !== undefined){
            if(oResponse.resultCd === "8888"){
                setBusinessNmErrColor("#E32938");
                setBusinessNmTextErrColor("#E32938");
                setBusinessNmErrText(oResponse.resultMsg);
            } else if (oResponse.resultCd === "7777"){
                setBankAccountErrColor("#E32938");
                setBankAccountTextErrColor("#E32938");
                setBankErrColor("#E32938");
                setAccountTextErrColor("#E32938");
                setAccountNmTextErrColor("#E32938");
                setBankAccountErrText(resultMsg);
                if(oProps.UserConfigReducer.BusinessType === "corporate"){
                    setBankErrText("법인명과 예금주가 같아야해요");
                } else {
                    setBankErrText("대표자명과 예금주가 같아야해요");
                }
            } else {
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
    
                    oUserConfig['OWNERACCOUNT'] = false;
                    oUserConfig['STORETYPE'] = true;
    
                    await oProps.reduxSetUserConfig(oUserConfig);
                    oProps.appManager.navGoTo('reset', AppRoute.STORETYPE);
                }
            }
        }
        setLoading(false);
    }

    const asyncData = async () => {
        setLoading(true);
        const store_id = oProps.UserConfigReducer.StoreID;
        const oResponse = await oProps.appManager.accessAxios("/app/ceo/store/ownerAccount-" + store_id, "get", "text", null);
        if(oResponse !== undefined && oResponse !== null){
            setBank(oResponse.sBank);
            setBankAccount(oResponse.sBankAccount);
            setBusinessNm(oResponse.sBusinessNm);
            setOwner(oResponse.sOwner);
        }
        setLoading(false);
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
        if(oProps.UserConfigReducer.BusinessType === "corporate"){
            setBankErrText("법인명과 예금주가 같아야해요");
        }
        asyncData();
    }, []);

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            <View style={{height: height * 0.1, backgroundColor: "#fff", justifyContent: "flex-end", marginLeft: "5%"}}>
                {sLocation !== "" ?
                    <TouchableOpacity activeOpacity={0.8} onPress={findUrl} style={{ height: "50%", width: "10%", justifyContent: "center", alignItems: "flex-start"}}>
                        <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.05} iColor={"#646970"}/>
                    </TouchableOpacity>
                :
                    <TouchableOpacity activeOpacity={0.8} onPress={backToInfomation} style={{ height: "50%", width: "10%", justifyContent: "center", alignItems: "flex-start"}}>
                        <ComponentArrowLeft3 iHeight={height * 0.025} iWidth={width * 0.05} iColor={"#646970"}/>
                    </TouchableOpacity>
                }
            </View>
            <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>정산에 필요한</Text>
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>정보를 입력해 주세요.</Text>
            </View>
            <ScrollView style={{flex:1, backgroundColor: "#fff"}}>
                {textInputType === "" &&
                    <>
                        <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>예금주</Text>
                            </View>
                            <TextInput
                                editable={false}
                                value={sOwner}
                                style={{
                                    width: "90%",
                                    height: height * 0.07,
                                    fontSize: RFPercentage(2.3),
                                    borderBottomColor: sAccountNmTextErrColor,
                                    borderBottomWidth: 1,
                                    fontWeight: '500',
                                    backgroundColor: '#fff',
                                    color: "#B0B7C1"
                                }}
                            />
                        </View>
                        {sBankErrText !== "" &&
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, alignItems: "flex-start", marginLeft: "5%", flexDirection: "row"}}>
                                <ComponentNotice1 iHeight={height * 0.017} iWidth={height * 0.017} iColor={sAccountTextErrColor}/>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: sAccountTextErrColor, marginLeft: "2%" }}>{sBankErrText}</Text>
                            </View>
                        }
                    </>
                }
                {(textInputType === "" || textInputType === "bank") &&
                    <TouchableOpacity onPress={openBankList} style={{height: height * 0.1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                        {sBank !== "" &&
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>은행 선택</Text>
                            </View>
                        }
                        <View style={{width: "90%", height: height * 0.07, borderBottomColor: sBankErrColor, borderBottomWidth: 1, backgroundColor: "#fff", justifyContent: "center"}}>
                            {sBank !== "" ?
                                <Text style={{color: "#000", fontWeight: "500", fontSize: RFPercentage(2.3)}}>{sBank}</Text>
                                :
                                <Text style={{color: "#B0B7C1", fontWeight: "500", fontSize: RFPercentage(2.3)}}>은행 선택</Text>
                            }
                            <View style={{position: "absolute", bottom: "20%", backgroundColor: "#fff",height: height * 0.04, width: width * 0.1, right: "0%", justifyContent: "center", alignItems: "center"}}>
                                <ComponentArrowDown1 iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                            </View>
                        </View>
                        
                    </TouchableOpacity>
                }
                {(textInputType === "" || textInputType === "bankaccount") &&
                    <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                        {sBankAccount !== "" &&
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "flex-end", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>계좌번호</Text>
                            </View>
                        }
                        <TextInput
                            placeholder="계좌번호를 입력해주세요"
                            placeholderTextColor="#B0B7C1"
                            returnKeyType="next"
                            autoFocus={bankAccountFocus}
                            keyboardType="numeric"
                            onChangeText={text => onChangeBankAccount(text)}
                            onFocus={() => activeBankAccountText()}
                            onBlur={() => unactiveBankAccountText()}
                            onSubmitEditing={() => nextInputSection("bankaccount")}
                            value={sBankAccount}
                            style={{
                                width: "90%",
                                height: height * 0.07,
                                fontSize: RFPercentage(2.3),
                                borderBottomColor: sBankAccountErrColor,
                                borderBottomWidth: 1,
                                fontWeight: '500',
                                backgroundColor: '#fff',
                                color: "#000"
                            }}
                        />
                        <View style={{height: height * 0.03, backgroundColor: "#fff", width, alignItems: "flex-start", marginLeft: "10%", flexDirection: "row"}}>
                            <ComponentNotice1 iHeight={height * 0.017} iWidth={height * 0.017} iColor={sBankAccountTextErrColor}/>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: sBankAccountTextErrColor, marginLeft: "2%" }}>{sBankAccountErrText}</Text>
                        </View>
                    </View>
                }
                {(textInputType === "" || textInputType === "business") &&
                    <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                        {sBusinessNm !== "" &&
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>사업자등록번호</Text>
                            </View>
                        }
                        <TextInput
                            placeholder="사업자등록번호를 입력해주세요"
                            placeholderTextColor="#B0B7C1"
                            returnKeyType="done"
                            maxLength={10}
                            autoFocus={businessNmFocus}
                            keyboardType="numeric"
                            onChangeText={text => onChangeBusinessNm(text)}
                            onFocus={() => activeBusinessNmText()}
                            onBlur={() => unactiveBusinessNmText()}
                            onSubmitEditing={() => nextInputSection("business")}
                            value={sBusinessNm}
                            style={{
                                width: "90%",
                                height: height * 0.07,
                                fontSize: RFPercentage(2.3),
                                borderBottomColor: sBusinessNmErrColor,
                                borderBottomWidth: 1,
                                fontWeight: '500',
                                backgroundColor: '#fff',
                                color: "#000"
                            }}
                        />
                        <View style={{height: height * 0.03, backgroundColor: "#fff", width, alignItems: "flex-start", marginLeft: "10%", flexDirection: "row"}}>
                            <ComponentNotice1 iHeight={height * 0.017} iWidth={height * 0.017} iColor={sBusinessNmTextErrColor}/>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: sBusinessNmTextErrColor, marginLeft: "2%" }}>{sBusinessNmErrText}</Text>
                        </View>
                    </View>
                }
            </ScrollView>
            {(textInputType === "business" || textInputType === "bankaccount") &&
                <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.36}}>
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
        </View>
    )
}

export default OwnerAccount;