import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Dimensions, TouchableOpacity, StatusBar, ScrollView, Text, AppState, Platform, FlatList, Alert, Animated } from 'react-native';
import PushNotification, { Importance } from 'react-native-push-notification';
import LottieView from 'lottie-react-native';

import { AppRoute } from '../../routes/AppRoutes';

import Main from './MainScreen';
import MyPageScreen from './MyPageScreen';

let sCheckTime;

const { width, height } = Dimensions.get('window');
const fromCoords = { x: 0, y: height };
const toCoords = { x: width, y: 0 };

const Home = oProps => {
    const [loading, setLoading] = useState(false);
    const [iState, setState] = useState("none");

    const [sData, setData] = useState({});
    const [isPause, setPause] = useState(false);
    const [orderCount, setOrderCount] = useState(0);

    const animation = useRef(new Animated.ValueXY(fromCoords)).current;
    const appState = useRef(AppState.currentState);

    const animate = (toValue) => {
        return Animated.spring(animation, {
            toValue: toValue === 1 ? toCoords : fromCoords,
            useNativeDriver: true,
            bounciness: 5,
            speed: 5,
        });
    };

    const onCloseDrawer = useCallback(async () => {
        animate(0).start();
        sCheckTime = setTimeout(() => {
            setState("none");
            clearTimeout(sCheckTime);
        }, 300);
    }, []);

    const onOpenDrawer = useCallback(async () => {
        animate(1).start();
        setState("nav");
    }, []);


    const getList = async () => {
        let oUserConfig = {};
        oUserConfig['APPROUTE'] = AppRoute.HOME;
        await oProps.reduxSetUserConfig(oUserConfig);

        const oResponse = await oProps.appManager.accessAxios("/store/order/getall", "get", "login", null);
        if(oResponse !== undefined){
            if(oResponse.isOrder){
                if(parseInt(oResponse.iReady) > 0){
                    oProps.appManager.navGoTo('reset', AppRoute.ORDER);
                } else {
                    if((parseInt(oResponse.iReady) + parseInt(oResponse.iPrepare) + parseInt(oResponse.iComplete)) > 0){
                        setOrderCount(parseInt(oResponse.iReady) + parseInt(oResponse.iPrepare) + parseInt(oResponse.iComplete));
                    } else {
                        setOrderCount(0);
                    }
                }
            } else {
                setOrderCount(0);
            }
        } else {
            setOrderCount(0);
        }
    }

    useEffect(() => {
        const subscription = AppState.addEventListener("change", nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === "active") {
                PushNotification.removeAllDeliveredNotifications();
                getList();
            }
            appState.current = nextAppState;
        });
        return () => {
            subscription.remove();
        };
    },[]);

    useEffect(() => {
        PushNotification.removeAllDeliveredNotifications();
        getList();
    }, []);

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            {loading ?
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
                :
                <>
                    {iState === "nav" ?
                        <MyPageScreen 
                            sProps={oProps}
                            fnAimation={animation}
                            sFromCoords={fromCoords}
                            fnAnimateMove={() => onCloseDrawer()}
                        />
                    :
                        <Main 
                            sProps={oProps}
                            iPause={isPause}
                            iOrderCount={orderCount}
                            fnAnimateMove={() => onOpenDrawer()}
                        />
                    }
                </>
            }
        </View>
    )
}

export default Home;