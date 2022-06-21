import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';

import { ComponentDelete } from '../../assets/svg/delete';
import { ComponentArrowLeft3 } from '../../assets/svg/arrowLeft3';

import { AppRoute } from '../../routes/AppRoutes';

const { width, height } = Dimensions.get('window');

const StoreNotice = oProps => {
    const [loading, setLoading] = useState(false);
    const [sLocation, setLocation] = useState("");
    
    const [introduction, setIntroduction] = useState("");

    const [introductionFocus, setIntroductionFocus] = useState(true);

    const [sErrColor, setErrColor] = useState("#EFF0F6");
    const [sNmTextErr, setNmTextErr] = useState("");

    const [textInputType, setTextInputType] = useState("");

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const onChangeIntroduction = text => {
        setIntroduction(text);
        setErrColor("#6B7583");
        setNmTextErr("");
    };

    const activeText = () => {
        setIntroductionFocus(true);
        setErrColor("#6B7583");
        setNmTextErr("");
        setTextInputType("nm");
    }
    
    const unactiveText = () => {
        setIntroductionFocus(false);
        setErrColor("#EFF0F6");
        setTextInputType("");
        Keyboard.dismiss();
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
        oProps.appManager.navGoTo('reset', AppRoute.STORETYPE);
    }

    const asyncData = async () => {
        setLoading(true);
        const store_id = oProps.UserConfigReducer.StoreID;
        const oResponse = await oProps.appManager.accessAxios("/app/ceo/store/introduction-" + store_id, "get", "text", null);
        if(oResponse !== undefined && oResponse !== null){
            if(oResponse.intro !== ""){
                unactiveText();
            } else {
                activeText();
            }
            setIntroduction(oResponse.intro);
        }
        setLoading(false);
    }

    const access = async () => {
        if(introduction === ""){
            setErrColor("#E32938");
            setNmTextErr("매장 소개글은 필수입니다.");
        } else {
            setLoading(true);
            let oData = {
                storeId: oProps.UserConfigReducer.StoreID,
                introduction
            }
            const oResponse = await oProps.appManager.accessAxios("/app/ceo/store/introduction", "post", null, oData);
            if(oResponse !== undefined){
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
    
                    oUserConfig['STORENOTICE'] = false;
                    oUserConfig['STOREALERT'] = true;
    
                    await oProps.reduxSetUserConfig(oUserConfig);
                    oProps.appManager.navGoTo('reset', AppRoute.STOREALERT);
                }
            }
            setLoading(false);
        }
    }

    const onKeyboardDidShow = (e) => {
        setKeyboardHeight(e.endCoordinates.height);
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
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>매장을 소개해주세요.</Text>
            </View>
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <View style={{height: height * 0.23, backgroundColor: "#fff", justifyContent: "flex-start", alignItems: "center"}}>
                    <TextInput
                        multiline={true}
                        placeholder="우리 매장을 소개하는 글을 입력해 주세요."
                        autoFocus={introductionFocus}
                        placeholderTextColor="#919AA7"
                        onChangeText={text => onChangeIntroduction(text)}
                        onFocus={() => activeText()}
                        onBlur={() => unactiveText()}
                        onSubmitEditing={() => access()}
                        value={introduction}
                        style={{
                            padding: "5%",
                            width: "90%",
                            minHeight: height * 0.18,
                            borderRadius: 10,
                            fontSize: RFPercentage(2.3),
                            borderColor: sErrColor,
                            borderWidth: 1,
                            fontWeight: '500',
                            backgroundColor: '#FAFAFB',
                            color: "#3B3B46",
                        }}
                    />
                    {sNmTextErr !== "" &&
                        <View style={{height: height * 0.03, backgroundColor: "#fff", width, alignItems: "center", marginLeft: "10%", flexDirection: "row"}}>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938", marginLeft: "2%" }}>{sNmTextErr}</Text>
                        </View>
                    }
                </View>
                {textInputType === "nm" &&
                    <TouchableOpacity activeOpacity={0.8} onPress={() => access()} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.42}}>
                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>적용</Text>
                    </TouchableOpacity>
                }
            </View>
            {textInputType === "" &&
                <View style={{height: height / 8 , backgroundColor: "#fff", justifyContent: "center"}}>
                    <TouchableOpacity
                        onPress={access}
                        style={{
                            height: height / 14,
                            backgroundColor: introduction !== "" ? '#6490E7' : "#C5D5F4",
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

export default StoreNotice;