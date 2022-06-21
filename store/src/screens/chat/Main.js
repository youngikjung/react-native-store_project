import React, { useState, useRef, useEffect } from 'react';
import { View, Dimensions, Text, TouchableOpacity, TextInput, StatusBar, Keyboard, FlatList } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';
import { WebView } from "react-native-webview";
import PushNotification, { Importance } from 'react-native-push-notification';

import CONSTANTS from '../../config/constants';

import { AppRoute } from '../../routes/AppRoutes';

import { ComponentDelete} from '../../assets/svg/delete';

const { width, height } = Dimensions.get('window');

const ChatPage = oProps => {
    const [state, setstate] = useState(false);
    const [isLoad, setLoad] = useState(true);

    const sUri = useRef(null);

    const goBack = () => {
        oProps.appManager.navGoTo('reset', AppRoute.ORDER)
    }

    const getList = async () => {
        let oUserConfig = {};
        oUserConfig['APPROUTE'] = AppRoute.CHAT;
        await oProps.reduxSetUserConfig(oUserConfig);
    }

    useEffect(() => {
        if(oProps.initialProps !== undefined && oProps.initialProps !== null){
            if(oProps.initialProps.route !== undefined && oProps.initialProps.route !== null){
                if(oProps.initialProps.route.params !== undefined && oProps.initialProps.route.params !== null){
                    const initital = oProps.initialProps.route.params;
                    sUri.current = CONSTANTS.APP_CHAT_URL + initital.sOrderId.toString() + "&store_id=" + initital.iStoreId.toString() + "&user_id=" + initital.sUserId.toString();
                    setstate(true);
                }
            }
        }
    },[]);

    useEffect(() => {
        PushNotification.removeAllDeliveredNotifications();
        getList();
    },[]);

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            <View style={{height: height * 0.08 }}>
                <View style={{flex:1, alignItems: "flex-start", justifyContent: "center", paddingLeft: width * 0.07, marginTop: "3%" }}>
                    <Text style={{fontWeight: "700", fontSize: RFPercentage(2.1), color: "#191F28" }}>채팅 연결</Text>
                </View>
                <TouchableOpacity onPress={goBack} style={{ position: "absolute", top: height * 0.02, right: width * 0.05, height: height * 0.05, width: height * 0.05, justifyContent: "center", alignItems: "center"}}>
                    <ComponentDelete iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
                </TouchableOpacity>
            </View>
            <View style={{flex:1, backgroundColor: "#fff"}}>
                {state &&
                    <>
                    {isLoad &&
                        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                            <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                        </View>
                    }
                    <WebView
                        originWhitelist={['*']}
                        cacheEnabled={false}
                        source={{ uri: sUri.current}}
                        onLoadEnd={() => setLoad(false)}
                    />
                    </>
                }
            </View>
            <View style={{height: height * 0.05, backgroundColor: "#fff"}} />
        </View>
    )
}

export default ChatPage;