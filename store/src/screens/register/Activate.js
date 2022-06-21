import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';
import messaging from '@react-native-firebase/messaging';
import { checkNotifications } from 'react-native-permissions';

import WebSocketClient from '../../lib/WebSocketClient';
import constants from '../../config/constants';

import { CompModalContent } from '../../components/modal/ModalContents';

import { ComponentDelete } from '../../assets/svg/delete';
import { ComponentArrowLeft3 } from '../../assets/svg/arrowLeft3';
import { ComponentActivation } from '../../assets/svg/activation';

import { AppRoute } from '../../routes/AppRoutes';

const { width, height } = Dimensions.get('window');

const Activate = oProps => {
    const [loading, setLoading] = useState(false);
    const [sLocation, setLocation] = useState("");

    const findUrl = () => {
        let temp = AppRoute.MAIN;
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
        oProps.appManager.navGoTo('reset', AppRoute.MENU);
    }

    const openModalContent = (sIndex) => {
        oProps.appManager.showModal(
            true,
            <CompModalContent sText={sIndex}/>, 
            "custom",
            2500
        );
    };

    const operation = async () => {
        setLoading(true);
        let sToken = "";
        const authorizationStatus = await messaging().requestPermission();
        if(authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED){
            let process = false;
            if(Platform.OS === "android"){
                await checkNotifications().then(async ({ status, settings }) => {
                    if (status === "granted") {
                        process = true;
                    } else {
                        process = false;
                    }
                });
            } else {
                process = true;
            }

            if(process){
                await messaging().registerDeviceForRemoteMessages();
                sToken = await messaging().getToken();
                if(sToken === oProps.UserConfigReducer.UserPushToken){
                    sToken = oProps.UserConfigReducer.UserPushToken;
                }
            }
        }

        const oData = {
            sParam: oProps.UserConfigReducer.StoreID,
            uniqueId: oProps.UserConfigReducer.uniqueId,
            token: oProps.UserConfigReducer.Token,
            refreshToken: oProps.UserConfigReducer.RefreshToken,
            pushToken: sToken
        }
        const oResponse = await oProps.appManager.accessAxios("/app/ceo/store/operationStore", "post", null, oData);
        if(oResponse !== undefined && oResponse !== null) {
            if(oResponse.resultCd !== "0000"){
                openModalContent(oResponse.resultMsg);
            } else {
                let oUserConfig = {};
                oUserConfig['ACTIVATION'] = false;
                oUserConfig['UserPushToken'] = sToken;
                await oProps.reduxSetUserConfig(oUserConfig);
                await WebSocketClient.disconnect();
                await WebSocketClient.connect(constants.WEBSOCKET_URL, oProps.UserConfigReducer.Token, oProps.UserConfigReducer.RefreshToken);
                openModalContent(`축하합니다 ${oProps.UserConfigReducer.StoreName}도 이제 드라이브 스루 매장입니다`);
                oProps.appManager.navGoTo('reset', AppRoute.MAIN);
            }
        }
        setLoading(false);
    }  

    useEffect(() => {
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
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <View style={{height: height * 0.1}} />
                <View style={{height: height * 0.05, justifyContent: "center", alignItems: "center"}}>
                    <ComponentActivation iHeight={height * 0.045} iWidth={height * 0.05} iColor={"#646970"}/>
                </View>
                <View style={{height: height * 0.1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: RFPercentage(2.5), fontWeight: '600', color: '#191F28' }}>입점 완료</Text>
                </View>
                <View style={{height: height * 0.05, alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: RFPercentage(2), fontWeight: '600', color: '#333D4B' }}>지금 바로 영업을 시작해 보세요!</Text>
                    <Text style={{ fontSize: RFPercentage(2), fontWeight: '600', color: '#333D4B' }}>포스와 프린트 안내사항은 메일을 확인해 주세요.</Text>
                </View>
            </View>
            <View style={{height: height / 8 , backgroundColor: "#fff", justifyContent: "center"}}>
                <TouchableOpacity
                    onPress={operation}
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
                    <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>영업 시작하러 가기</Text>
                </TouchableOpacity>
            </View>
            {loading &&
                <View style={{position: "absolute", top: 0, height, width, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
        </TouchableOpacity>
    )
}

export default Activate;