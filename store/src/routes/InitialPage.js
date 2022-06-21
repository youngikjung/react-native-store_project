import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, Platform, View, SafeAreaView } from 'react-native';
import {connect} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import VersionCheck from "react-native-version-check";
import PushNotification, { Importance } from 'react-native-push-notification';

import constants from '../config/constants';
import {setUserConfig} from '../reducers/UserConfigReducer';
import WebSocketClient from '../lib/WebSocketClient';

import {AppRoute} from '../routes/AppRoutes';

import { CompModalContent, CompModalVersionNotiPage } from '../components/modal/AppModalContent';

import { ComponentAppIcon1 } from '../assets/svg/appIcon1';

import AppNotice from '../components/owner/AppNotice';
import HomeScreen from '../components/owner/Home';
import FindIdPage from '../components/owner/FindId';
import FindPwdPage from '../components/owner/FindPwd';
import SignIn from '../components/owner/SignIn';
import SignUpPage from '../components/owner/SignUp';

const { width, height } = Dimensions.get('window');

const initialRoute = oProps => {
    const [isLogin, setIsLogin] = useState("0");
    const [isCheck, setCheck] = useState(oProps.UserConfigReducer.inititalPage);
    const [pageLine, setPageLine] = useState("0");

    const confirm = async () => {
        let oUserConfig = {};
        oUserConfig['inititalPage'] = false;
        await oProps.reduxSetUserConfig(oUserConfig);
        setCheck(false);
    }

    const inititalize = async () => {
        let oUserConfig = {};
        oUserConfig['APPROUTE'] = AppRoute.MAIN;
        await oProps.reduxSetUserConfig(oUserConfig);
        await oProps.appManager.setStopSound('new-order');
        await oProps.appManager.setStopSound('customer-arrived');
        await oProps.appManager.setStopSound('customer-nearby');

        if(oProps.UserConfigReducer.AutoLogin){
            login();
        } else {
            setIsLogin("1");
        }
    };

    const startFunction = () => {
        setPageLine("2");
    };

    const signInFunction = () => {
        setPageLine("1");
    };
    
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

    const login = async () => {
        let randomDeviceId = (Math.random() * (10 - 1)) + 1;
        let uniqueId = DeviceInfo.getUniqueId();
        let fcmToken = "";

        if(oProps.UserConfigReducer.AppPushStatus){
            const authorizationStatus = await messaging().requestPermission();
            if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
                await messaging().registerDeviceForRemoteMessages();
                fcmToken = await messaging().getToken();
            }
        }
        const oData = {
            id: oProps.UserConfigReducer.LoginId,
            password: oProps.UserConfigReducer.LoginPw,
            deviceuuid: randomDeviceId.toString(),
            token: fcmToken,
            uniqueId,
            appType : "prd-store",
            platform : Platform.OS === "android" ? "THROO_STORE_APP_VERSION(ANDROID)" : "THROO_STORE_APP_VERSION(IOS)"
        }
        const oResponse = await oProps.appManager.accessAxios("/app/ceo/autoAuthenticate/v2", "post", null, oData);
        if (oResponse !== undefined && oResponse !== null) {
            if (oResponse.resultId === "0000") {
                asyncData(oResponse,oData.token,oData.id,uniqueId);
            } else {
                openModal(oResponse.resultMsg);
                setIsLogin("1");
            }
        } else {
            openModal("네트워크 에러입니다 나중에 다시 시도바랍니다.");
            setIsLogin("1");
        }
    }

    const asyncData = async (sIndex,aIndex,xIndex,zIndex) => {
        let oUserConfig = {};
        oUserConfig['activate'] = sIndex.isActivate;
        oUserConfig['AutoLogin'] = true;
        oUserConfig['LoginId'] = xIndex;
        oUserConfig['LoginPw'] = sIndex.loginPw;
        oUserConfig['Token'] = sIndex.token;
        oUserConfig['RefreshToken'] = sIndex.refresh_token;
        oUserConfig['UserPushToken'] = aIndex;
        oUserConfig['uniqueId'] = zIndex;

        oUserConfig['StoreID'] = sIndex.storeId;
        oUserConfig['StoreName'] = sIndex.storeName;
        oUserConfig['BusinessType'] = sIndex.businessType;
        oUserConfig['StoreOwner'] = sIndex.fullName;

        oUserConfig['PickupType'] = sIndex.pickup;
        
        oUserConfig['ORDERBASKET'] = [];

        await oProps.reduxSetUserConfig(oUserConfig);

        if(sIndex.isActivate){
            checkAppVersion(sIndex.token, sIndex.refresh_token, sIndex.currentNm);
        } else {
            searchingRoot();
        }
    }

    const searchingRoot = async () => {
        if(oProps.UserConfigReducer.STOREINFOMATION){
            oProps.appManager.navGoTo('reset', AppRoute.STOREINFOMATION);
        } else if (oProps.UserConfigReducer.OWNERACCOUNT){
            oProps.appManager.navGoTo('reset', AppRoute.OWNERACCOUNT);
        } else if (oProps.UserConfigReducer.STORETYPE){
            oProps.appManager.navGoTo('reset', AppRoute.STORETYPE);
        } else if (oProps.UserConfigReducer.STORENOTICE){
            oProps.appManager.navGoTo('reset', AppRoute.STORENOTICE);
        } else if (oProps.UserConfigReducer.STOREALERT){
            oProps.appManager.navGoTo('reset', AppRoute.STOREALERT);
        } else if (oProps.UserConfigReducer.STOREORIGINNOTICE){
            oProps.appManager.navGoTo('reset', AppRoute.STOREORIGINNOTICE);
        } else if (oProps.UserConfigReducer.STORELOGO){
            oProps.appManager.navGoTo('reset', AppRoute.STORELOGO);
        } else if (oProps.UserConfigReducer.STOREIMAGES){
            oProps.appManager.navGoTo('reset', AppRoute.STOREIMAGES);
        } else if (oProps.UserConfigReducer.STOREHOLIDAY){
            oProps.appManager.navGoTo('reset', AppRoute.STOREHOLIDAY);
        } else if (oProps.UserConfigReducer.STOREPICKUPZONE){
            oProps.appManager.navGoTo('reset', AppRoute.STOREPICKUPZONE);
        } else if (oProps.UserConfigReducer.STOREPICKUPIMAGE){
            oProps.appManager.navGoTo('reset', AppRoute.STOREPICKUPIMAGE);
        } else if (oProps.UserConfigReducer.STOREPICKUPZONEDETAIL){
            oProps.appManager.navGoTo('reset', AppRoute.STOREPICKUPZONEDETAIL);
        } else if (oProps.UserConfigReducer.STOREORDERTIME){
            oProps.appManager.navGoTo('reset', AppRoute.STOREORDERTIME);
        } else if (oProps.UserConfigReducer.STOREOPERATIONTIME){
            oProps.appManager.navGoTo('reset', AppRoute.STOREOPERATIONTIME);
        } else if (oProps.UserConfigReducer.MENU){
            oProps.appManager.navGoTo('reset', AppRoute.MENU);
        } else if (oProps.UserConfigReducer.ACTIVATION){
            oProps.appManager.navGoTo('reset', AppRoute.ACTIVATION);
        } else {
            let oUserConfig = {};
            oUserConfig['STOREINFOMATION'] = true;
            oUserConfig['OWNERACCOUNT'] = false;
            await oProps.reduxSetUserConfig(oUserConfig);

            oProps.appManager.navGoTo('reset', AppRoute.STOREINFOMATION);
        }
    }

    const checkAppVersion = async (aIndex,xIndex,nIndex) => {
        if(parseInt(nIndex) > parseInt(VersionCheck.getCurrentVersion())){
            openModalVersionNotiPage();
        }
        await WebSocketClient.connect(constants.WEBSOCKET_URL, aIndex, xIndex);
        getList();
    }

    const openModalVersionNotiPage  = () => {
        oProps.appManager.showModal(
            true,
            <CompModalVersionNotiPage fnClose={() => oProps.appManager.hideModal()} />, 
            "noti"
        );
    };

    const getList = async () => {
        const oResponse = await oProps.appManager.accessAxios("/store/order/getall", "get", "login", null);
        if(oResponse !== undefined){
            if(oResponse.isOrder){
                if(parseInt(oResponse.iReady) > 0){
                    oProps.appManager.navGoTo('reset', AppRoute.ORDER)
                } else {
                    oProps.appManager.navGoTo('reset', AppRoute.HOME);
                }
            } else {
                oProps.appManager.navGoTo('reset', AppRoute.HOME);
            }
        } else {
            oProps.appManager.navGoTo('reset', AppRoute.HOME);
        }
    }

    useEffect(() => {
        PushNotification.removeAllDeliveredNotifications();
        inititalize();
    }, []);

    return (
        <>
            {isLogin === "0" &&
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff"}}>
                    <ComponentAppIcon1 iHeight={height * 0.1} iWidth={height * 0.1} iColor={"#646970"}/>
                </View>
            }
            {isLogin === "1" &&
                <>
                    {isCheck ?
                        <AppNotice 
                            fnTermAgree={() => confirm()}
                        />
                    :
                        <>
                            {pageLine === "0" &&
                                <HomeScreen
                                    fnStart={() => startFunction()}
                                    fnSignIn={() => signInFunction()}
                                />
                            }
                            {pageLine === "1" &&
                                <SignIn 
                                    oProps={oProps}
                                    fnMove={(sIndex,aIndex,kIndex,nIndex) => asyncData(sIndex,aIndex,kIndex,nIndex)}
                                    fnSignUp={() => setPageLine("2")}
                                    fnFindId={() => setPageLine("3")}
                                    fnFindPwd={() => setPageLine("4")}
                                />
                            }
                            {pageLine === "2" &&
                                <SignUpPage 
                                    oProps={oProps}
                                    fnReturn={() =>setPageLine("0")}
                                />
                            }
                            {pageLine === "3" &&
                                <FindIdPage 
                                    oProps={oProps}
                                    fnReturn={() =>setPageLine("1")}
                                />
                            }
                            {pageLine === "4" &&
                                <FindPwdPage 
                                    oProps={oProps}
                                    fnReturn={() =>setPageLine("1")}
                                />
                            }
                        </>
                    }
                </>
            }
        </>
    )
}

const mapStateToProps = state => {
    return {
        AppConfigReducer: state.AppConfigReducer,
        UserConfigReducer: state.UserConfigReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        reduxSetAppConfigStatus: oData => dispatch(setAppConfigStatus(oData)),
        reduxSetUserConfig: oData => dispatch(setUserConfig(oData)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(initialRoute);