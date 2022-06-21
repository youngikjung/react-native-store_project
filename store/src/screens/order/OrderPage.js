import React, { useState, useEffect, useRef } from 'react';
import { View, Dimensions, Text, StatusBar, AppState } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PushNotification, { Importance } from 'react-native-push-notification';
import LottieView from 'lottie-react-native';
import moment from 'moment-timezone';
import 'moment/locale/ko';

import {AppRoute} from '../../routes/AppRoutes';

import { CompModalOrderCancelContent, CompModalCustomerArrived, CompModalCustomerClosed } from '../../components/modal/AppModalContent';

import WebSocketClient from '../../lib/WebSocketClient';

import Footer from '../../components/footer/Footer';

import Reception from '../../components/order/Reception';
import OrderTabPage from '../../components/order/OrderTabPage';

import {ComponentNoOrder} from '../../assets/svg/no_order';

const TabNavigator = createMaterialTopTabNavigator();
const { width, height } = Dimensions.get('window');

const OrderPage = oProps => {
    const [loading, setLoading] = useState(true);

    const [orderList, setOrderList] = useState([]);

    const [ready, setReady] = useState("0");
    const [prepare, setPrepare] = useState("0");
    const [complete, setComplete] = useState("0");

    const appState = useRef(AppState.currentState);

    const changeOrderStatus = async (oData, sCurrentState, sColor ) => {
        let sPrinter = oProps.UserConfigReducer.PRINTERTYPE;

        if(oData.order_id !== undefined && oData.order_id !== null){
            setLoading(true);
            const oPostData = {
                order_id: parseInt(oData.order_id),
                current_state: sCurrentState
            }
            await oProps.appManager.setStopSound('new-order');
            await oProps.appManager.setStopSound('customer-arrived');
            await oProps.appManager.setStopSound('customer-nearby');
            await oProps.appManager.accessAxios("/order/changestate", "post", "login", oPostData, "pos");
            if(sPrinter !== ""){
                if(sCurrentState === "confirm"){
                    await oProps.appManager.setPrinterBill(oData);
                }
            } 
            asyncData();
            setLoading(false);
        }
    }

    const checkOrderCancel = (cIndex) => {
        oProps.appManager.showModal(
            true,
            <CompModalOrderCancelContent
                iProps={oProps} 
                sOrderId={parseInt(cIndex.order_id)}
                sItem={cIndex}
                fnHide={() => oProps.appManager.hideModal()}
                fnCancel={(sIndex,aIndex,itemLable) => cancelOrderStatus(sIndex,aIndex,itemLable)}
            />, 
            "custom"
        );
    }

    const fnCustomerClosed = async (tempOrderId,tempType) => {
        if(tempOrderId !== undefined && tempOrderId !== null && tempType !== undefined && tempType !== null){
            setLoading(true);
            const oPostData = {
                orderId: tempOrderId, 
                noti_type: tempType
            }
            await oProps.appManager.accessAxios("/screens/order/changeNotiType", "post", "login", oPostData, "pos");
            oProps.appManager.hideModal();
            setLoading(false);
        }
    }

    const customerClosedAlert = (cIndex) => {
        oProps.appManager.showModal(
            true,
            <CompModalCustomerClosed
                fnClose={() => fnCustomerClosed(cIndex,9)}
            />, 
            "custom"
        );
    }

    const customerArrivedAlert = (cIndex) => {
        oProps.appManager.showModal(
            true,
            <CompModalCustomerArrived
                fnClose={() => fnCustomerClosed(cIndex,10)}
            />, 
            "custom"
        );
    }

    const cancelOrderStatus = async (sIndex,sText,itemLable) => {
        let temp = oProps.UserConfigReducer.PRINTERTYPE;
        if(sIndex !== undefined && sIndex !== null){
            setLoading(true);
            await oProps.appManager.hideModal();
            const oPostData = {
                orderId: parseInt(sIndex),
                cancel_description: sText !== undefined && sText !== null && sText !== "" ? sText: null
            }
            await oProps.appManager.accessAxios("/screens/order/cancellation", "post", "login", oPostData, "pos");
            if(temp !== ""){
                await oProps.appManager.setCancelPrinterBill(itemLable);
            }
            asyncData();
            setLoading(false);
        }
    }

    const asyncData = async () => {
        setLoading(true);

        await oProps.appManager.setStopSound('new-order');
        await oProps.appManager.setStopSound('customer-arrived');
        await oProps.appManager.setStopSound('customer-nearby');

        let sReady = 0;
        let sPrepare = 0;
        let sComplete = 0;
        let nOrderId = 0;
        let nUserCarNm = "";
        let isNewOrder = "0";
        let sArriveCount = "0";
        let sCloseCount = "0";
        let sPrintInfo = {};
        let fnSound = oProps.UserConfigReducer.QUITSOUND;
        let sPrinter = oProps.UserConfigReducer.PRINTERTYPE;

        const oResponse = await oProps.appManager.accessAxios("/store/order/getall", "get", "login", null);
        if(oResponse !== undefined){
            if(oResponse.isOrder){
                sReady = oResponse.iReady;
                sPrepare = oResponse.iPrepare;
                sComplete = oResponse.iComplete;
                isNewOrder = oResponse.isNewOrder.toString();
                sArriveCount = oResponse.sArriveCount.toString();
                sCloseCount = oResponse.sCloseCount.toString();
                nOrderId = oResponse.nOrderId;
                nUserCarNm = oResponse.nUserCarNm;
                sPrintInfo = oResponse.sPrintInfo;
                setOrderList(oResponse.orderList);
            } else {
                setOrderList([]);
            }
        } else {
            setOrderList([]);
        }
        if (isNewOrder.toString() !== "0") {
            if(sPrinter !== ""){
                await oProps.appManager.setPrinter("neworder");
            }
            if(!fnSound){
                await oProps.appManager.setPlaySound('new-order');
            }
        } else if (sArriveCount.toString() !== "0"){
            if(!fnSound){
                await oProps.appManager.setPlaySound('customer-arrived');
            }
            customerArrivedAlert(nOrderId);
        } else if (sCloseCount.toString() !== "0"){
            if(!fnSound){
                await oProps.appManager.setPlaySound('customer-nearby');
            }
            customerClosedAlert(nOrderId);
        }
        
        setReady(sReady);
        setPrepare(sPrepare);
        setComplete(sComplete);
        setLoading(false);
    }

    const setRoute = async () => {
        let oUserConfig = {};
        oUserConfig['APPROUTE'] = AppRoute.ORDER;
        await oProps.reduxSetUserConfig(oUserConfig);
    }

    WebSocketClient.on('message', async function (oData) {
        if (oData.data !== undefined) {
            let oMsg = JSON.parse(oData.data);

            if (oMsg.action != undefined && oMsg.action == 'REFRESHED_TOKEN') {
                if(oProps.UserConfigReducer !== undefined && oProps.UserConfigReducer !== null){
                    let asyncData = await AsyncStorage.getItem('token_info');
                    asyncData = await JSON.parse(asyncData);
                    asyncData.Token = oMsg.token;
                    await AsyncStorage.setItem('token_info', JSON.stringify(asyncData));
                } else {
                    let oUserConfig = {};
                    oUserConfig['Token'] = oMsg.token;
                    await oProps.reduxSetUserConfig(oUserConfig);
                }
            }

            if (oMsg.action != undefined && oMsg.action == 'REFRESH_ORDER') {
                asyncData();
            }
        }
    });

    useEffect(() => {
        PushNotification.removeAllDeliveredNotifications();
        asyncData();
        setRoute();
    }, []);

    useEffect(() => {
        const subscription = AppState.addEventListener("change", nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === "active") {
                PushNotification.removeAllDeliveredNotifications();
                asyncData();
            }
            appState.current = nextAppState;
        });
        
        return () => {
            subscription.remove();
        };
    },[]);

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            {loading ?
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            :
                <>
                    <View style={{height: height * 0.05, flexDirection: "row", backgroundColor: "#fff"}}>
                        <View style={{flex: 1, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                            <View style={{height: 14, width: 14, backgroundColor: "#F45552", borderRadius: 5}} />
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#000", marginLeft: "5%"}}>접수전({ready}건)</Text>
                        </View>
                        <View style={{flex: 1, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                            <View style={{height: 14, width: 14, backgroundColor: "#40C1BB", borderRadius: 5}} />
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#000", marginLeft: "5%"}}>준비중({prepare}건)</Text>
                        </View>
                        <View style={{flex: 1, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                            <View style={{height: 14, width: 14, backgroundColor: "#2389F7", borderRadius: 5}} />
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#000", marginLeft: "5%"}}>준비완료({complete}건)</Text>
                        </View>
                    </View>
                    {orderList.length > 0 ?
                        <View style={{flex:1, backgroundColor: "#fff"}}>
                            <TabNavigator.Navigator
                                swipeEnabled={true}
                                initialRouteName={"list" + orderList.length.toString()}
                                tabBar={props =>
                                    <OrderTabPage iProps={props} sList={orderList}/>
                                }
                            >
                                {orderList.map((item,index) => {
                                    return (
                                        <TabNavigator.Screen name={"list" + index.toString()} key={"list" + index.toString()}>
                                            {props => 
                                                <Reception 
                                                    iProps={oProps} 
                                                    sList={item} 
                                                    fnCancelOrderStatus={(cIndex) => checkOrderCancel(cIndex)} 
                                                    fnChangeOrderStatus={(oIndex,eIndex) => changeOrderStatus(oIndex,eIndex)} 
                                                />
                                            }
                                        </TabNavigator.Screen>
                                    )
                                })}
                            </TabNavigator.Navigator>
                            <View style={{height: height * 0.15}}/>
                        </View>
                        :
                        <View style={{flex:1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                            <ComponentNoOrder iHeight={height * 0.1} iWidth={width * 0.4}/>
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#a1a1a1"}}>진행중인 주문이 없습니다.</Text>
                        </View>
                    }
                    <Footer 
                        oProps={oProps}
                        sOrder={(parseInt(ready) + parseInt(prepare) + parseInt(complete))}
                        sLocation={"order"}
                    />
                </>
            }
        </View>
    )
}

export default OrderPage;