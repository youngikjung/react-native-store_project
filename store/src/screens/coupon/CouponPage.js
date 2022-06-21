import React, {useState,useEffect,useRef} from 'react';
import { View } from 'react-native';
import PushNotification, { Importance } from 'react-native-push-notification';

import {AppRoute} from '../../routes/AppRoutes';
import Insert from '../../components/coupon/Insert';
import List from '../../components/coupon/List';

const CouponPage = oProps => {
    const [state, setState] = useState("list");
    const [sLocation, setLocation] = useState("");
    const [couponParamData, setCouponParamData] = useState({});
    const [commercialInitParam, setCommercialInitParam] = useState("");

    const getList = async () => {
        let oUserConfig = {};
        oUserConfig['APPROUTE'] = AppRoute.COUPON;
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

    useEffect(() => {
        if(oProps.initialProps !== undefined && oProps.initialProps !== null){
            if(oProps.initialProps.route !== undefined && oProps.initialProps.route !== null){
                if(oProps.initialProps.route.params !== undefined && oProps.initialProps.route.params !== null){
                    const initital = oProps.initialProps.route.params;
                    if(initital.sParam !== "home"){
                        setLocation(initital.sParam);
                        setCouponParamData(initital.iParam);
                        setCommercialInitParam(initital.aParam);
                    }
                }
            }
        }
        PushNotification.removeAllDeliveredNotifications();
        getList();
    }, []);

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            {state === "list" ?
                <List
                    sProps={oProps}
                    iLocation={sLocation}
                    paramData={couponParamData}
                    initData={commercialInitParam}
                    fnGoBack={() => goBack()}
                    fnInsert={() => setState("insert")}
                />
                :
                <Insert
                    sProps={oProps}
                    iLocation={sLocation}
                    paramData={couponParamData}
                    initData={commercialInitParam}
                    fnGoBack={() => setState("list")}
                />
            }
        </View>
    )
}

export default CouponPage;