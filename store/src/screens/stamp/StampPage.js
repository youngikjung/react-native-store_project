import React, {useState,useEffect,useRef} from 'react';
import { View, Dimensions, Text, TouchableOpacity, ScrollView, FlatList, KeyboardAvoidingView, TextInput, Keyboard, StatusBar, Platform } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import PushNotification, { Importance } from 'react-native-push-notification';
import LottieView from 'lottie-react-native';
import moment from 'moment-timezone';
import 'moment/locale/ko';

import {AppRoute} from '../../routes/AppRoutes';

import List from '../../components/stamp/List';
import Insert from '../../components/stamp/Insert';
import Edit from '../../components/stamp/Edit';

const { width, height } = Dimensions.get('window');

const CouponPage = oProps => {
    const [state, setState] = useState("list");

    const sRef = useRef({});

    const getList = async () => {
        let oUserConfig = {};
        oUserConfig['APPROUTE'] = AppRoute.STAMP;
        await oProps.reduxSetUserConfig(oUserConfig);

        const oResponse = await oProps.appManager.accessAxios("/store/order/getall", "get", "login", null);
        if(oResponse !== undefined){
            if(oResponse.isOrder){
                if(parseInt(oResponse.iReady) > 0){
                    oProps.appManager.navGoTo('reset', AppRoute.ORDER)
                }
            }
        }
    }

    const goBack = () => {
        oProps.appManager.navGoTo('reset', AppRoute.HOME);
    }

    const editItem = (sIndex) => {
        sRef.current = sIndex;
        setState("edit");
    }

    useEffect(() => {
        PushNotification.removeAllDeliveredNotifications();
        getList();
    }, []);

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            {state === "list" &&
                <List
                    sProps={oProps}
                    fnGoBack={() => goBack()}
                    fnInsert={() => setState("insert")}
                    fnEdit={(sIndex) => editItem(sIndex)}
                />
            }
            {state === "insert" &&
                <Insert
                    sProps={oProps}
                    fnGoBack={() => setState("list")}
                    />
                }
            {state === "edit" &&
                <Edit
                    sProps={oProps}
                    iRef={sRef.current}
                    fnGoBack={() => setState("list")}
                />
            }
        </View>
    )
}

export default CouponPage;