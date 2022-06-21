import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, View, Dimensions, Text, Platform, Animated, Image, FlatList, Linking } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';
import { WebView } from "react-native-webview";
import SendIntentAndroid from "react-native-send-intent";

import { ComponentArrowLeft3 } from '../../assets/svg/arrowLeft3';
import { ComponentArrowDown1 } from '../../assets/svg/arrow_down1';
import { ComponentArrowUp } from '../../assets/svg/arrow_up';

import { CompModalContent, CompCartAllDelete } from '../modal/ModalContents';

import {ComponentDelete} from '../../assets/svg/delete';

import CONSTANTS from '../../config/constants';

let checkTime;
let animatedTime1;
let animatedTime2;

const { width, height } = Dimensions.get('window');

const Cart = ({ iProps, iMyPoint, iMyPointWon, aPoint, aPointWon, iCartList, fnBack, fnComplete, fnCartAllDelete, fnDeleteCartItem }) => {
    const [loading, setLoading] = useState("select");

    const [sHeight, setHeight] = useState(true);

    const [myPointAmountWon, setMyPointAmountWon] = useState("0");
    const [myPointChargedAmountWon, setMyPointChargedAmountWon] = useState("0");
    const [productAmountWon, setProductAmountWon] = useState("0");
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [paymentAmountWon, setPaymentAmountWon] = useState("0");

    const sUri = useRef("");
    const iOrderId = useRef(0);
    const commercialList = useRef([]);
    const animated = useRef(new Animated.Value(height * 0.32));

    const priceToString = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    const backToInit = async () => {
        if(fnBack !== undefined && typeof fnBack === "function"){
            await fnBack();
        }
    }

    const cartAllDelete = async () => {
        if(fnCartAllDelete !== undefined && typeof fnCartAllDelete === "function"){
            await iProps.appManager.hideModal()
            await fnCartAllDelete();
        }
    }

    const openModalContent = (sIndex) => {
        iProps.appManager.showModal(
            true,
            <CompModalContent sText={sIndex}/>, 
            "custom",
            2500
        );
    };

    const openCartAllDelete = () => {
        iProps.appManager.showModal(
            true,
            <CompCartAllDelete fnClose={() => iProps.appManager.hideModal()} fnInsert={() => cartAllDelete()}/>, 
            "custom",
        );
    };

    const handleOnMessage = async ({ nativeEvent: { data } }) => {
        let jsonData = JSON.parse(data);
        if(jsonData.resultCd !== undefined && jsonData.resultCd !== null && jsonData.resultCd === "3001"){
            await payLastStep();
        } else if (jsonData.order_action !== undefined && jsonData.order_action !== null && jsonData.order_action === "cancel_order"){
            setLoading("select");
            openModalContent("결제를 취소했습니다.");
        } else {
            setLoading("select");
            openModalContent(jsonData.resultMsg);
        }
    };

    const onShouldStartLoadWithRequest = (request) => {
        const { url } = request;
        let sAndroidUrl = url;

        if (url.indexOf('tpay/cancel') != -1) {
            return true;
        }

        if (Platform.OS === 'android') {
            if (sAndroidUrl.startsWith('http://mobile.vpay.co.kr/jsp/MISP/andown')) {
                Linking.openURL(sAndroidUrl).catch(err => {});
                return true;
            }

            if (sAndroidUrl.startsWith('http://') || sAndroidUrl.startsWith('https://') || sAndroidUrl.startsWith('about:blank')) {
                return false;
            }

            if (sAndroidUrl.startsWith('ispmobile://')) {
                let aParts = sAndroidUrl.split('://');
                if (aParts.length > 0) {
                    let sNewIntentUrl = 'intent://' + aParts[1] + '#Intent;scheme=ispmobile;package=kvp.jjy.MispAndroid320;end;';
                    sAndroidUrl = sNewIntentUrl;
                }
            }

            SendIntentAndroid.openAppWithUri(sAndroidUrl).then(isOpened => {
                if (!isOpened) {
                    openModalContent("실행에 실패했습니다 관리자에 문의 바랍니다.");
                    return true;
                } else {
                    return false;
                }
            }).catch(err => {
                return false;
            });
        }

        return false;
    }


    const payLastStep = async (aIndex) => {
        const oData = {
            store_id: iProps.UserConfigReducer.StoreID,
            orderId: iOrderId.current,
        }
        const oResponse = await iProps.appManager.accessAxios("/store/commercial/payCommercial/step2", "post", "login", oData);
        if(oResponse !== undefined){
            if(oResponse.resultCd === "0000"){
                setLoading("select");
                openModalContent("결제가 완료되었습니다.");
                if(fnComplete !== undefined && typeof fnComplete === "function"){
                    await fnComplete();
                }
            } else {
                setLoading("select");
                openModalContent(oResponse.resultMsg);
            }
        }
    }

    const paymentCommercial = async () => {
        const oData = {
            store_id: iProps.UserConfigReducer.StoreID,
            cartList : commercialList.current,
            paymentAmount,
            osInfo: "os:" + Platform.OS + "," + Platform.Version + ",mobile:throoCeoApp",
        }
        const oResponse = await iProps.appManager.accessAxios("/store/commercial/payCommercial/step1", "post", "login", oData);
        if(oResponse !== undefined){
            if(oResponse.resultCd === "0000"){
                openModalContent(oResponse.resultMsg);
                if(fnComplete !== undefined && typeof fnComplete === "function"){
                    await fnComplete();
                }
            } else if (oResponse.resultCd === "0101") {
                iOrderId.current = oResponse.orderId;
                sUri.current = CONSTANTS.PAYMENT_API_URL + parseFloat(oResponse.orderId);
                setLoading("payment");
            } else {
                setLoading("select");
                openModalContent("문제가 발생했습니다 관리자에 연락바랍니다.");
            }
        } else {
            setLoading("select");
        }
    }

    const paymentComercial = async () => {
        setLoading("loading");
        if(commercialList.current.length > 0){
            await paymentCommercial();
        } else {
            setLoading("select");
        }
    }

    const deleteItemList = async (sIndex) => {
        setLoading("loading");
        if(fnDeleteCartItem !== undefined && typeof fnDeleteCartItem === "function"){
            let tempList = commercialList.current;
            commercialList.current = await tempList.filter((item) => item.param !== sIndex);
            await fnDeleteCartItem(commercialList.current);
            calculateAmount(commercialList.current);
        }
        setLoading("select");
    }

    const calculateAmount = async (sIndex) => {
        let temp = 0;
        let tempPoint = 0;
        let tempPointWon = 0;
        let tempPointCharged = 0;
        let tempPointWonCharged = 0;
        let tempCartWon = 0;
        let tempPay = 0;
        let tempPayWon = 0;
        let tempPicket = false;

        if(sIndex.length > 0){
            for await (const iterator of sIndex) {
                if(iterator.param === "picket"){
                    tempPicket = true;
                }
                temp += parseInt(iterator.price);
            }
        }

        if(tempPicket){
            if((parseInt(iMyPoint) + parseInt(aPoint)) >= parseInt(temp)){
                const pResult = await pointSumCheck(temp,iMyPoint,aPoint);
                tempPoint = pResult.tempPoint;
                tempPointCharged = pResult.tempPointCharged;
                tempPay = pResult.tempPay;
            } else if(parseInt(iMyPoint) >= parseInt(temp)){
                const pResult = await pointCheck(temp,iMyPoint);
                tempPoint = pResult.tempPoint;
                tempPointCharged = pResult.tempPointCharged;
                tempPay = pResult.tempPay;
            } else if(parseInt(aPoint) >= parseInt(temp)){
                tempPointCharged = parseInt(temp);
            } else {
                const pResult = await calcaulateCheck(temp,iMyPoint,aPoint);
                tempPoint = pResult.tempPoint;
                tempPointCharged = pResult.tempPointCharged;
                tempPay = pResult.tempPay;
            }
        } else {
            if(parseInt(iMyPoint) >= parseInt(temp)){
                tempPoint = parseInt(temp);
            } else if(parseInt(aPoint) >= parseInt(temp)){
                tempPointCharged = parseInt(temp);
            } else if((parseInt(iMyPoint) + parseInt(aPoint)) >= parseInt(temp)){
                tempPoint = parseInt(iMyPoint);
                tempPointCharged = parseInt(temp) - parseInt(iMyPoint);
            } else {
                tempPoint = parseInt(iMyPoint);
                tempPointCharged = parseInt(aPoint);
                tempPay = parseInt(temp) - parseInt(iMyPoint) - parseInt(aPoint);
            }
        }

        if(tempPoint < 0){
            tempPoint = 0;
        }
        if(tempPointCharged < 0){
            tempPointCharged = 0;
        }
        if(tempPay < 0){
            tempPay = 0;
        }

        tempPointWon = await priceToString(tempPoint);
        tempPointWonCharged = await priceToString(tempPointCharged);
        tempCartWon = await priceToString(temp);
        tempPayWon = await priceToString(tempPay);

        setMyPointAmountWon(tempPointWon);
        setMyPointChargedAmountWon(tempPointWonCharged);
        setProductAmountWon(tempCartWon);
        setPaymentAmount(tempPay);
        setPaymentAmountWon(tempPayWon);
    };

    const changeDetail = async () => {
        if(sHeight){
            Animated.timing(animated.current, {
                toValue: height * 0.14,
                duration: 400,
                useNativeDriver: false,
            }).start();
            if(animatedTime1) clearTimeout(animatedTime1);
            animatedTime1 = setTimeout(() => {
                Animated.timing(animated.current, {
                    toValue: height * 0.14,
                    duration: 400,
                    useNativeDriver: false,
                }).stop();
                animated.current = new Animated.Value(height * 0.14);
                setHeight(false);
            }, 200);
        } else {
            Animated.timing(animated.current, {
                toValue: height * 0.32,
                duration: 400,
                useNativeDriver: false,
            }).start();
            if(animatedTime2) clearTimeout(animatedTime2);
            animatedTime2 = setTimeout(() => {
                Animated.timing(animated.current, {
                    toValue: height * 0.32,
                    duration: 400,
                    useNativeDriver: false,
                }).stop();
                animated.current = new Animated.Value(height * 0.32);
                setHeight(true);
            }, 400);
        }
    }

    const asyncData = async () => {
        setLoading("loading");
        calculateAmount(iCartList);
        commercialList.current = iCartList;
        if(checkTime) clearTimeout(checkTime);
        checkTime = setTimeout(() => {
            setLoading("select");
        }, 300);
    }

    useEffect(() => {
        asyncData();
    }, [iCartList.length]);

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            {loading === "loading" &&
                <View style={{ flex:1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
            {loading === "payment" &&
                <>
                    <WebView
                        onMessage={handleOnMessage}
                        originWhitelist={['*']}
                        cacheEnabled={false}
                        source={{ uri: sUri.current}}
                        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                    />
                </>
            }
            {loading === "select" &&
                <>
                    <View style={{height: height * 0.08 }}>
                        <View style={{flex:1, alignItems: "center", justifyContent: "center" }}>
                            <Text style={{fontWeight: "700", fontSize: RFPercentage(2.1), color: "#191F28", marginTop: "3%"}}>장바구니</Text>
                        </View>
                        <TouchableOpacity onPress={backToInit} style={{ position: "absolute", top: height * 0.02, left: width * 0.05, height: height * 0.05, width: height * 0.05, justifyContent: "center", alignItems: "center"}}>
                            <ComponentArrowLeft3 iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: height * 0.001, backgroundColor: "#EEEFF4"}} />
                    <View style={{ height: height * 0.05, backgroundColor: "#fff", justifyContent: "space-between", alignItems: "center", flexDirection: "row"}}>
                        <View style={{ height: height * 0.03, alignItems: "center", justifyContent: "center", width: width * 0.15, borderRadius: width * 0.02, marginLeft: "5%"}}>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#333D4B"}}>총 {commercialList.current.length}개</Text>
                        </View>
                        <TouchableOpacity onPress={openCartAllDelete} style={{ height: height * 0.03, backgroundColor: "#EFF0F6", alignItems: "center", justifyContent: "center", width: width * 0.15, borderRadius: width * 0.02, marginRight: "5%"}}>
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.6), color: "#333D4B"}}>전체삭제</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: height * 0.002, backgroundColor: "#EEEFF4"}} />
                    <View style={{flex: 1, backgroundColor: "#F8F9FA"}}>
                        <FlatList
                            data={commercialList.current}
                            ListFooterComponent={<View style={{ height: height * 0.2 }} />}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(data, index) => "list-" + index + Math.random()}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{ height: height * 0.26, width, justifyContent: "center", alignItems: "center"}}>
                                        <View 
                                            style={{ 
                                                height: height * 0.2, width: width * 0.9,
                                                backgroundColor: "#fff",
                                                borderRadius: width * 0.03,
                                                ...Platform.select({
                                                    ios: {
                                                        shadowColor: "#191F28",
                                                        shadowOpacity: 0.1,
                                                        shadowRadius: 5,
                                                        shadowOffset: {
                                                            height: 0,
                                                            width: 0,
                                                        },
                                                    },
                                                    android: {
                                                        shadowColor: "#191F28",
                                                        elevation: 5,
                                                    },
                                                })
                                            }}
                                        >
                                            <View style={{height: height * 0.02 }}/>
                                            <View style={{ height: height * 0.18, width: "100%", flexDirection: "row"}}>
                                                <View style={{height: height * 0.18, width: width * 0.4, alignItems: "center" }}>
                                                    <Image source={{uri: item.img}} style={{width: width * 0.3, height : height * 0.16, borderRadius: width * 0.03, resizeMode: "center"}}/>
                                                </View>
                                                <View style={{height: height * 0.18, width: width * 0.6, justifyContent: "center", alignItems: "center"}}>
                                                    <View style={{height: height * 0.12, width: width * 0.6}}>
                                                        <View style={{height: height * 0.04, justifyContent: "center"}}>
                                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2.1), color: "#000" }}>{item.title}</Text>
                                                        </View>
                                                        <View style={{height: height * 0.05, alignItems: "center", flexDirection: "row" }}>
                                                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#333D4B", marginRight: "2%" }}>{item.fromDate}</Text>
                                                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#333D4B", marginRight: "2%" }}>부터</Text>
                                                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#333D4B"}}>
                                                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#6490E7"}}>
                                                                    30일
                                                                </Text>
                                                                동안
                                                            </Text>
                                                        </View>
                                                        <View style={{height: height * 0.03, marginRight: "10%", justifyContent: "center"}}>
                                                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#000" }}>{item.priceCasting}원</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            <TouchableOpacity onPress={() => deleteItemList(item.param)} style={{height: height * 0.05, position: "absolute", width: height * 0.03, top: 0, right: width * 0.05, justifyContent: "center", alignItems: "center"}}>
                                                <ComponentDelete iHeight={height * 0.03} iWidth={height * 0.025} iColor={"#6B7583"}/>
                                            </TouchableOpacity>
                                            {item.param === "picket" &&
                                                <>
                                                    <View style={{ position: "absolute", top: - height * 0.03, left: 0, height: height * 0.05, width: width * 0.8, backgroundColor: "#E8EFFC", borderRadius: width * 0.03, zIndex: 999999, flexDirection: "row"}}>
                                                        <View style={{ height: height * 0.05, width: "100%", justifyContent: "center", alignItems: "center"}}>
                                                            <Text style={{fontWeight: "700", fontSize: RFPercentage(1.6), color: "#6490E7"}}>야외광고배너는 무상포인트 15,000p까지 사용가능합니다.</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ position: "absolute", top: - height * 0.005, left: width * 0.15, height: height * 0.03, width: height * 0.03, backgroundColor: "#E8EFFC", zIndex: 1, transform: [{ rotateZ: '0.785398rad' }]}} />
                                                </>
                                            }
                                        </View>
                                    </View>
                                ) 
                            }}
                        />
                    </View>
                    
                    <Animated.View 
                        style={[
                            {
                                position: "absolute",
                                zIndex: 1,
                                bottom: height * 0.01,
                                right: width * 0.025,
                                height: animated.current,
                                backgroundColor: "#fff",
                                width: width * 0.95,
                                borderRadius: height * 0.02,
                                ...Platform.select({
                                    ios: {
                                        shadowColor: "#001E62",
                                        shadowOpacity: 0.3,
                                        shadowRadius: 5,
                                        shadowOffset: {
                                        height: 5,
                                        width: 1,
                                        },
                                    },
                                    android: {
                                        elevation: 5,
                                    },
                                })
                            }
                        ]}
                    >
                        <View style={{flex:1, alignItems: "center"}}>
                            <TouchableOpacity onPress={() => changeDetail(!sHeight)} style={{flex:1, flexDirection: "row"}}>
                                <View style={{flex:0.4, justifyContent: "center", paddingLeft: "5%"}}>
                                    {!sHeight ?
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#111"}}>결제예정금액 :</Text>
                                    :
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#111"}}>결제예정금액</Text>
                                    }
                                </View>
                                <View style={{flex:0.4, justifyContent: "center"}}>
                                    {!sHeight &&
                                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2.2), color: "#000"}}>{paymentAmountWon}원</Text>
                                    }
                                </View>
                                <View style={{flex:0.2, justifyContent: "center", alignItems: "center"}}>
                                    {sHeight ?
                                        <ComponentArrowDown1 iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
                                    :
                                        <ComponentArrowUp iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
                                    }
                                </View>
                            </TouchableOpacity>
                            {sHeight &&
                                <>
                                    <View style={{flex:1, flexDirection: "row"}}>
                                        <View style={{flex:0.4, justifyContent: "center", paddingLeft: "5%"}}>
                                            <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#111"}}>총 상품금액 :</Text>
                                        </View>
                                        <View style={{flex:0.6, justifyContent: "center", alignItems: "flex-end", paddingRight: "5%"}}>
                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2.2), color: "#000"}}>{productAmountWon}원</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:1, flexDirection: "row"}}>
                                        <View style={{flex:0.4, justifyContent: "center", paddingLeft: "5%"}}>
                                            <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#111"}}>유상 포인트 사용 :</Text>
                                        </View>
                                        <View style={{flex:0.6, justifyContent: "center", alignItems: "flex-end", paddingRight: "5%"}}>
                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2.2), color: "#E32938"}}>- {myPointChargedAmountWon}원</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:1, flexDirection: "row"}}>
                                        <View style={{flex:0.4, alignItems: "center", paddingLeft: "5%", flexDirection: "row"}}>
                                            <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#111"}}>무상 포인트 사용 :</Text>
                                        </View>
                                        <View style={{flex:0.6, justifyContent: "center", alignItems: "flex-end", paddingRight: "5%"}}>
                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2.2), color: "#E32938"}}>- {myPointAmountWon}원</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:1, flexDirection: "row"}}>
                                        <View style={{flex:0.4, justifyContent: "center", paddingLeft: "5%"}}>
                                            <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#111"}}>결제금액 :</Text>
                                        </View>
                                        <View style={{flex:0.6, justifyContent: "center", alignItems: "flex-end", paddingRight: "5%"}}>
                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2.2), color: "#6490E7"}}>{paymentAmountWon}원</Text>
                                        </View>
                                    </View>
                                </>
                            }
                            <TouchableOpacity onPress={() => paymentComercial()} style={{height: height * 0.07, width: width * 0.95, backgroundColor: "#6490E7", borderBottomRightRadius: height * 0.02, borderBottomLeftRadius: height * 0.02, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontWeight: "800", fontSize: RFPercentage(2.3), color: "#fff"}}>{parseInt(paymentAmount) > 0 ? "결제하기" : "광고 사용하기" }</Text>
                            </TouchableOpacity>
                        </View>
                        
                    </Animated.View>
                    
                </>
            }
        </View>
    )
}


const calcaulateCheck = async (sIndex,iMyPoint,aPoint) => {
    let totalPay = parseInt(sIndex);
    let result = {
        tempPoint: 0,
        tempPointCharged: 0,
        tempPay: 0
    }
    if((parseInt(iMyPoint) + 15000) >= totalPay){
        result.tempPoint = parseInt(totalPay) - 15000;
        result.tempPointCharged = parseInt(aPoint);
        result.tempPay = totalPay - ((parseInt(totalPay) - 15000) + parseInt(aPoint));
    } else {
        result.tempPoint = parseInt(iMyPoint);
        result.tempPointCharged = parseInt(aPoint);
        result.tempPay = totalPay - (parseInt(iMyPoint) + parseInt(aPoint));
    }

    return result;
}

const pointCheck = async (sIndex,iMyPoint) => {
    let result = {
        tempPoint: parseInt(sIndex) - 15000,
        tempPointCharged: 0,
        tempPay: 15000
    }
    
    if((parseInt(iMyPoint) - 15000) < parseInt(sIndex)){
        result.tempPay = parseInt(sIndex) - (parseInt(sIndex) - 15000);
    }

    return result;
}

const pointSumCheck = async (sIndex,iMyPoint,aPoint) => {
    let totalPay = parseInt(sIndex);
    let result = {
        tempPoint: 0,
        tempPointCharged: 0,
        tempPay: 0
    }

    if(parseInt(iMyPoint) >= 15000){
        if(totalPay >= (parseInt(iMyPoint) + 15000)){
            result.tempPoint = parseInt(iMyPoint);
            result.tempPointCharged = totalPay - parseInt(iMyPoint);
            result.tempPay = totalPay - (parseInt(iMyPoint) + (totalPay - parseInt(iMyPoint)));
        } else {
            if(parseInt(aPoint) >= (totalPay - 15000)){
                result.tempPoint = 15000;
                result.tempPointCharged = totalPay - 15000;
                result.tempPay = totalPay - (15000 + (totalPay - 15000));
            } else {
                if(parseInt(iMyPoint) >= parseInt(totalPay)){
                    const pResult = await pointCheck(totalPay,iMyPoint);
                    result.tempPoint = pResult.tempPoint;
                    result.tempPointCharged = pResult.tempPointCharged;
                    result.tempPay = pResult.tempPay;
                } else {
                    result.tempPoint = parseInt(iMyPoint) - 15000;
                    if(parseInt(aPoint) >= (totalPay - (parseInt(iMyPoint) - 15000))){
                        result.tempPointCharged = totalPay - (parseInt(iMyPoint) - 15000);
                        result.tempPay = totalPay - ((parseInt(iMyPoint) - 15000) + (totalPay - (parseInt(iMyPoint) - 15000)));
                    } else {
                        result.tempPointCharged = parseInt(aPoint);
                        result.tempPay = totalPay - (parseInt(aPoint) + (parseInt(iMyPoint) - 15000));
                    }
                }
            }
        }
    } else {
        result.tempPoint = parseInt(iMyPoint);
        result.tempPointCharged = totalPay - parseInt(iMyPoint);
        result.tempPay = totalPay - (parseInt(iMyPoint) + (totalPay - parseInt(iMyPoint)));
    }
    return result;
}

const objectStyles = {
    object: {
        height: height * 0.03, 
        borderBottomColor: "#6490E7", 
        borderBottomWidth: 2
    },
}

export default Cart;