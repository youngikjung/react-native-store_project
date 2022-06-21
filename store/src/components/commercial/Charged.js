import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard, Image, FlatList, Platform, Linking, ScrollView } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';
import { WebView } from "react-native-webview";
import SendIntentAndroid from "react-native-send-intent";

import { ComponentArrowLeft3 } from '../../assets/svg/arrowLeft3';
import { ComponentWon } from '../../assets/svg/won';
import { ComponentWon1 } from '../../assets/svg/won1';
import { ComponentZap} from '../../assets/svg/zap';
import { ComponentSelectedCircle } from '../../assets/svg/selectedCircle';
import { ComponentUnSelectedCircle } from '../../assets/svg/unselectedCircle';

import { CompModalContent } from '../../components/modal/ModalContents';

import CONSTANTS from '../../config/constants';

const { width, height } = Dimensions.get('window');

const Charged = ({ sProps, fnReturn, cAmount, fnCompleteCharged, iMyPointChargedWon }) => {
    const [loading, setLoading] = useState("select");

    const [remainAmount, setRemainAmount] = useState(0);
    const [remainAmountWon, setRemainAmountWon] = useState("0");
    const [paymentAmount, setPaymentAmount] = useState(10000);
    const [paymentAmountWon, setPaymentAmountWon] = useState("10,000");
    const [sumAmountWon, setSumAmountWon] = useState("");

    const sUri = useRef("");
    const iOrderId = useRef(0);

    const backToInfomation = async () => {
        if(fnReturn !== undefined && typeof fnReturn === "function"){
            await fnReturn();
        }
    }

    const openModalContent = (sIndex) => {
        sProps.appManager.showModal(
            true,
            <CompModalContent sText={sIndex}/>, 
            "custom",
            2500
        );
    };

    const onChangePaymentAmount = async (sIndex,aIndex) => {
        let temp = parseInt(remainAmount) + sIndex + (sIndex * 10 / 100);
        temp = await priceToString(temp);
        setPaymentAmount(sIndex);
        setPaymentAmountWon(aIndex);
        setSumAmountWon(temp);
    }

    const priceToString = async (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    const chargedPointFirstStep = async () => {
        let oResult = {
            orderId: null,
            key: "9999",
        };

        const oData = {
            store_id: sProps.UserConfigReducer.StoreID,
            osInfo: "os:" + Platform.OS + "," + Platform.Version + ",mobile:throoCeoApp",
            iPrice: paymentAmount,
        }
        const oResponse = await sProps.appManager.accessAxios("/store/commercial/chargedPoint/firstStep", "post", "login", oData);
        if(oResponse !== undefined){
            if(oResponse.resultCd === "0000"){
                oResult.orderId = oResponse.orderId;
                oResult.key = "0000";
            }
        }
        return oResult;
    }

    const chargedPointLastStep = async () => {
        const oData = {
            store_id: sProps.UserConfigReducer.StoreID,
            orderId: iOrderId.current,
        }
        const oResponse = await sProps.appManager.accessAxios("/store/commercial/chargedPoint/lastStep", "post", "login", oData);
        if(oResponse !== undefined){
            if(oResponse.resultCd !== "0000"){
                setLoading("select");
                openModalContent("에러가 발생했습니다 관리자에 문의 바랍니다.");
            } else {
                openModalContent("충전이 완료되었습니다.");
                if(fnCompleteCharged !== undefined && typeof fnCompleteCharged === "function"){
                    await fnCompleteCharged();
                }
            }
        }
    }

    const chargedPoint = async () => {
        setLoading("loading");
        const result = await chargedPointFirstStep();
        if(result.key === "0000"){
            iOrderId.current = result.orderId;
            sUri.current = CONSTANTS.PAYMENT_API_URL + parseFloat(result.orderId);
            setLoading("payment");
        } else {
            setLoading("select");
        }
    }


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

    const handleOnMessage = async ({ nativeEvent: { data } }) => {
        let temp = JSON.parse(data);
        if(temp.resultCd !== undefined && temp.resultCd !== null && temp.resultCd === "3001"){
            await chargedPointLastStep();
        } else if (temp.order_action !== undefined && temp.order_action !== null && temp.order_action === "cancel_order"){
            setLoading("select");
            openModalContent("결제를 취소했습니다.");
        } else {
            openModalContent(temp.resultMsg);
        }
    };
    const calculateBasic = async () => {
        let tempSum = parseInt(cAmount) + 11000;
        tempSum = await priceToString(tempSum);
        setRemainAmountWon(iMyPointChargedWon);
        setRemainAmount(cAmount);
        setSumAmountWon(tempSum);
    }

    useEffect(() => {
        calculateBasic();
    }, [cAmount]);

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            {loading === "loading" &&
                <View style={{position: "absolute", top: 0, height, width, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8}}>
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
                        <TouchableOpacity onPress={backToInfomation} style={{ position: "absolute", top: height * 0.02, left: width * 0.05, height: height * 0.05, width: height * 0.05, justifyContent: "center", alignItems: "center"}}>
                            <ComponentArrowLeft3 iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={{flex:1, backgroundColor: "#fff"}}>
                        <View style={{height: height * 0.12, width, justifyContent: "center", paddingLeft: "5%" }}>
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(2.3), color: "#000"}}>
                                포인트 
                                <Text style={{fontWeight: "900", fontSize: RFPercentage(2.5), color: "#6490E7"}}> 충전 </Text>
                                하고
                            </Text>
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(2.3), color: "#000"}}>
                                광고
                                <Text style={{fontWeight: "900", fontSize: RFPercentage(2.5), color: "#6490E7"}}> 시작 </Text>
                                하세요 
                            </Text>
                        </View>
                        <View style={{height: height * 0.05, width: width * 0.9, justifyContent: "center", backgroundColor: "#F2F3F5", marginLeft: "5%", alignItems: "center", borderRadius: width * 0.03 }}>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#6490E7"}}>포인트를 충전하시면 충전금액의 10%를 더 충전해드려요!</Text>
                        </View>
                        <View style={{flex:1, margin: "5%"}}>
                            <View style={{height: height * 0.15, backgroundColor: "#FAFAFB", borderRadius: width * 0.03}}>
                                <View style={{height: height * 0.05, alignItems: "center", flexDirection: "row", justifyContent: "space-around" }}>
                                    <View style={{width: "40%", height: height * 0.05, alignItems: "center", flexDirection: "row", justifyContent: "flex-start"}}>
                                        <ComponentWon1 iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#3B3B46", marginLeft : "5%"}}>유상 포인트</Text>
                                    </View>
                                    <View style={{width: "40%", height: height * 0.05, justifyContent: "center", alignItems: "flex-end"}}>
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(2.3), color: "#3B3B46"}}>{remainAmountWon} 원</Text>
                                    </View>
                                </View>
                                <View style={{height: height * 0.05, alignItems: "center", flexDirection: "row", justifyContent: "space-around" }}>
                                    <View style={{width: "40%", height: height * 0.05, alignItems: "center", flexDirection: "row", justifyContent: "flex-start"}}>
                                        <ComponentZap iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#ffd500"}/>
                                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#000", marginLeft : "5%"}}>충전 금액</Text>
                                    </View>
                                    <View style={{width: "40%", height: height * 0.05, justifyContent: "center", alignItems: "flex-end"}}>
                                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2.3), color: "#6490E7"}}>{paymentAmountWon} 원</Text>
                                    </View>
                                </View>
                                <View style={{height: height * 0.05, alignItems: "center", flexDirection: "row", justifyContent: "space-around" }}>
                                    <View style={{width: "40%", height: height * 0.05, alignItems: "center", flexDirection: "row", justifyContent: "flex-start"}}>
                                        <ComponentWon iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
                                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#000", marginLeft : "5%"}}>충전 후 유상포인트</Text>
                                    </View>
                                    <View style={{width: "40%", height: height * 0.05, justifyContent: "center", alignItems: "flex-end"}}>
                                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2.3), color: "#001E62"}}>{sumAmountWon} 원</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{height: height * 0.06, width, justifyContent: "flex-end" }}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.3), color: "#000"}}>충전금액 선택</Text>
                            </View>
                            <View style={{ height: height * 0.1, justifyContent: "flex-end" }}>
                                <TouchableOpacity onPress={() => onChangePaymentAmount(10000,"10,000")} style={{ height: height * 0.07, flexDirection: "row", backgroundColor: paymentAmount.toString() === "10000" ? "#E8EFFC" : "#F2F3F5", alignItems: "center", borderRadius: width * 0.01}}>
                                    <View style={{ height: height * 0.1, width: "30%", justifyContent: "center", alignItems: "center"}}>
                                        {paymentAmount.toString() === "10000" ?
                                            <ComponentSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                        :
                                            <ComponentUnSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                        }
                                    </View>
                                    <View style={{ height: height * 0.1, width: "50%", justifyContent: "center", alignItems: "flex-end"}}>
                                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2.3), color: paymentAmount.toString() === "10000" ? "#6490E7" : "#505866"}}>10,000 원</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: height * 0.1, justifyContent: "flex-end" }}>
                                <TouchableOpacity onPress={() => onChangePaymentAmount(30000,"30,000")} style={{ height: height * 0.07, flexDirection: "row", backgroundColor: paymentAmount.toString() === "30000" ? "#E8EFFC" : "#F2F3F5", alignItems: "center", borderRadius: width * 0.01}}>
                                    <View style={{ height: height * 0.1, width: "30%", justifyContent: "center", alignItems: "center"}}>
                                        {paymentAmount.toString() === "30000" ?
                                            <ComponentSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                        :
                                            <ComponentUnSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                        }
                                    </View>
                                    <View style={{ height: height * 0.1, width: "50%", justifyContent: "center", alignItems: "flex-end"}}>
                                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2.3), color: paymentAmount.toString() === "30000" ? "#6490E7" : "#505866"}}>30,000 원</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: height * 0.1, justifyContent: "flex-end" }}>
                                <TouchableOpacity onPress={() => onChangePaymentAmount(50000,"50,000")} style={{ height: height * 0.07, flexDirection: "row", backgroundColor: paymentAmount.toString() === "50000" ? "#E8EFFC" : "#F2F3F5", alignItems: "center", borderRadius: width * 0.01}}>
                                    <View style={{ height: height * 0.1, width: "30%", justifyContent: "center", alignItems: "center"}}>
                                        {paymentAmount.toString() === "50000" ?
                                            <ComponentSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                        :
                                            <ComponentUnSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                        }
                                    </View>
                                    <View style={{ height: height * 0.1, width: "50%", justifyContent: "center", alignItems: "flex-end"}}>
                                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2.3), color: paymentAmount.toString() === "50000" ? "#6490E7" : "#505866"}}>50,000 원</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: height * 0.1, justifyContent: "flex-end" }}>
                                <TouchableOpacity onPress={() => onChangePaymentAmount(100000,"100,000")} style={{ height: height * 0.07, flexDirection: "row", backgroundColor: paymentAmount.toString() === "100000" ? "#E8EFFC" : "#F2F3F5", alignItems: "center", borderRadius: width * 0.01}}>
                                    <View style={{ height: height * 0.1, width: "30%", justifyContent: "center", alignItems: "center"}}>
                                        {paymentAmount.toString() === "100000" ?
                                            <ComponentSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                        :
                                            <ComponentUnSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                        }
                                    </View>
                                    <View style={{ height: height * 0.1, width: "50%", justifyContent: "center", alignItems: "flex-end"}}>
                                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2.3), color: paymentAmount.toString() === "100000" ? "#6490E7" : "#505866"}}>100,000 원</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                    <View style={{height: height / 6 , backgroundColor: "#fff", justifyContent: "center"}}>
                        <TouchableOpacity
                            onPress={chargedPoint}
                            style={{
                                height: height / 14,
                                backgroundColor: '#6490E7',
                                marginLeft: '5%',
                                marginRight: '5%',
                                borderRadius: width * 0.03,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ fontSize: RFPercentage(2.3), fontWeight: '800', color: '#fff' }}>{paymentAmountWon} 원 충전하기</Text>
                        </TouchableOpacity>
                    </View>
                </>
            }
        </View>
    )
}

export default Charged;