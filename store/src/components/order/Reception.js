import React, { useState,useEffect } from 'react';
import { View, Dimensions, Text, ScrollView, Linking, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import * as Animatable from 'react-native-animatable';
import CountDown from 'react-native-countdown-component';
import { WebView } from "react-native-webview";
import LinearGradient from 'react-native-linear-gradient';

import {ComponentIcChat} from '../../assets/svg/ic_chat';
import {ComponentIcCall} from '../../assets/svg/ic_call';
import {ComponentLocation} from '../../assets/svg/location';
import {ComponentIcInfo} from '../../assets/svg/ic_info';
import {ComponentCar} from '../../assets/svg/car';
import {ComponentDelete} from '../../assets/svg/delete';
import {ComponentWalkThroo} from '../../assets/svg/walkthroo';

import { AppRoute } from '../../routes/AppRoutes';

import { CompModalLocation, CompModalContent, CompModalCheckPickUp } from '../../components/modal/AppModalContent';

const { width, height } = Dimensions.get('window');

const Reception = ({ iProps, sList, fnChangeOrderStatus, fnCancelOrderStatus }) => {
    const [state, setstate] = useState({});
    const [sColor, setColor] = useState("");
    const [isRun, setIsRun] = useState(true);
    const [isMap, setIsMap] = useState(false);
    const [sUri, setUri] = useState("");

    const changeOrderStatus = async (eIndex) => {
        let temp = sColor;
        if(fnChangeOrderStatus !== undefined && typeof fnChangeOrderStatus === "function"){
            iProps.appManager.hideModal();
            await fnChangeOrderStatus(sList,eIndex,temp);
        }
    }

    const completePickUp = async () => {
        if (parseInt(sList.noti_type) < 10) {
            iProps.appManager.showModal(
                true,
                <CompModalCheckPickUp
                    fnAgree={() => changeOrderStatus("pickup-complete")}
                    fnCancel={() => iProps.appManager.hideModal()}
                />, 
                "custom",
            );
                
        } else {
            changeOrderStatus("pickup-complete")
        }
    }

    const cancelOrderStatus = async () => {
        if(fnCancelOrderStatus !== undefined && typeof fnCancelOrderStatus === "function"){
            await fnCancelOrderStatus(sList);
        }
    }

    const openModalContent = (cIndex) => {
        iProps.appManager.showModal(
            true,
            <CompModalContent 
                sText={cIndex}
            />, 
            "custom",
            2500
        );
    }

    const callNumber = phone => {
        let phoneNumber = phone;
        if(phone !== undefined && phone !== null && phone !== ""){
            if (Platform.OS !== 'android') {
                phoneNumber = `telprompt:${phone}`;
            } else  {
                phoneNumber = `tel:${phone}`;
            }
            Linking.canOpenURL(phoneNumber).then(supported => {
                if (!supported) {
                    openModalContent("해당기기에서 전화가 불가능합니다.");
                } else {
                    return Linking.openURL(phoneNumber);
                }
            }).catch(err => {
                //todo
            });
        }
    };

    const openChatting = () => {
        iProps.appManager.navGoTo('push', AppRoute.CHAT, {
            sOrderId : sList.order_id,
            sUserId : sList.user_id,
            iStoreId : sList.store_id,
        })
    }

    const checkedConfirm = async (sIndex) => {
        let oUserConfig = {};
        if(sIndex === "confirm"){
            oUserConfig['confirmButton'] = false;
        } else if(sIndex === "prepare"){
            oUserConfig['prepareButton'] = false;
        } else if(sIndex === "pickup"){
            oUserConfig['pickupCompleteButton'] = false;
        }
        await iProps.reduxSetUserConfig(oUserConfig);
    }

    
    useEffect(() => {
        return () => {
            setIsRun(false);
        };
    }, []);

    useEffect(() => {
        setUri("https://ceo.throo.co.kr/selfmanage/pos/user/location?@" + parseInt(sList.store_id) + "?@=" + parseInt(sList.order_id));
        setColor(sList.state_color);
        setstate(sList);
        console.log("sList",sList);
    }, [sList]);

    return (
        <>
            {state.pickup_type !== undefined && state.pickup_type !== null &&
                <View style={{flex:1, backgroundColor: "#fff"}}>
                    {isMap ?
                        <View style={{flex: 1, backgroundColor: "#fff", marginLeft: "5%", marginRight: "5%", marginTop: "2%", marginBottom: "3%"}}>
                            <WebView
                                originWhitelist={['*']}
                                cacheEnabled={false}
                                source={{ uri: sUri}}
                            />
                            <TouchableOpacity onPress={() => setIsMap(false)} style={{ height: height * 0.04, width: height * 0.04, backgroundColor: "#fff", position: "absolute", zIndex: 1, borderRadius: width, top: "5%", right: width * 0.05, justifyContent: "center", alignItems: "center" }}>
                                <ComponentDelete iHeight={height * 0.03} iWidth={width * 0.06} iColor={"#000"}/>
                            </TouchableOpacity>
                        </View>
                        :
                        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: "#fff", marginLeft: "3%", marginRight: "3%", marginTop: "2%", marginBottom: "1%"}}>
                            <View style={{height: height * 0.1, flexDirection: "row"}}>
                                <View style={{height: height * 0.1, width: "55%", justifyContent: "center", alignItems: "center", paddingLeft: "5%"}}>
                                    {state.pickup_type.toString() === "1" ?
                                        <>
                                            <View style={{width: "100%", height: "60%", alignItems: "center", flexDirection: "row"}}>
                                                <ComponentCar iHeight={height * 0.04} iWidth={width * 0.07} iColor={"#FAE300"}/>
                                                <Text style={{fontWeight: "800", fontSize: RFPercentage(3), color: "#6490E8", marginLeft: "5%"}}>{state.car_nr}</Text>
                                            </View>
                                            <View style={{width: "100%", height: "40%", justifyContent: "flex-start"}}>
                                                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.5), color: "#000"}}>{state.car_style !== "" ? state.car_style : state.car_nr + "차량"}</Text>
                                            </View>
                                        </>
                                    :
                                        <>
                                            <View style={{width: "100%", height: "60%", alignItems: "center", flexDirection: "row"}}>
                                                <ComponentWalkThroo iHeight={height * 0.04} iWidth={width * 0.07} iColor={"#5991FF"}/>
                                                {state.user_phone_number !== undefined && state.user_phone_number !== null && state.user_phone_number !== "" &&
                                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2.3), color: "#C370E0", marginLeft: "5%"}}>{state.user_phone_number.substring((state.user_phone_number.length - 4), state.user_phone_number.length)} 님</Text>
                                                }
                                            </View>
                                            <View style={{width: "100%", height: "40%", justifyContent: "flex-start"}}>
                                                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.5), color: "#000"}}>걸어서 도착합니다.</Text>
                                            </View>
                                        </>
                                    }
                                </View>
                                <View style={{height: height * 0.1, width: "45%", justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                                    <TouchableOpacity onPress={() => callNumber(state.user_phone_number)} style={{height: height * 0.07, width: height * 0.08, justifyContent: "center", alignItems: "center", backgroundColor: "#E8EFFC", borderRadius: width * 0.03, marginRight: "5%"}}>
                                        <ComponentIcCall iHeight={height * 0.035} iWidth={width * 0.06} iColor={"#001E62"}/>
                                        <Text style={{fontWeight: "900", fontSize: RFPercentage(1.8), color: "#001E62"}}>전화</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setIsMap(true)} style={{height: height * 0.07, width: height * 0.08, justifyContent: "center", alignItems: "center", backgroundColor: "#AEEFD5", borderRadius: width * 0.03}}>
                                        <ComponentLocation iHeight={height * 0.035} iWidth={width * 0.06} iColor={"#fff"}/>
                                        <Text style={{fontWeight: "900", fontSize: RFPercentage(1.8), color: "#000"}}>위치</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{height: height * 0.08, flexDirection: "row"}}>
                                <View style={{height: height * 0.08, width: "50%", justifyContent: "center", alignItems: "center"}}>
                                    <View style={{width: "95%", height: "90%", borderColor: "#dfdfdf", justifyContent: "space-evenly", alignItems: "center", borderRightWidth: 1 }}>
                                        <CountDown
                                            until={parseInt(sList.arrival_in_seconds)}
                                            style={{paddingRight: "0%"}}
                                            digitStyle={{backgroundColor: "#fff"}}
                                            digitTxtStyle={{color: '#F45552'}}
                                            timeToShow={['M', 'S']}
                                            timeLabels={{m: null, s: null}}
                                            size={20}
                                            showSeparator
                                            running={isRun}
                                        />
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.8), color: "#666666"}}>후 도착</Text>
                                    </View>
                                </View>
                                <View style={{height: height * 0.08, width: "50%", justifyContent: "center", alignItems: "center"}}>
                                    <View style={{width: "95%", height: "90%", borderColor: "#dfdfdf", justifyContent: "space-evenly", alignItems: "center" }}>
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.8), color: "#666666"}}>남은 거리</Text>
                                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2.3), color: "#000"}}>{state.dist_remaining_nrm}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{height: height * 0.05, justifyContent: "center", paddingLeft: "5%", borderTopWidth: 1, marginLeft: "4%", marginRight: "4%", marginTop: "2%", marginBottom: "1%"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.1), color: "#000"}}>주문내역</Text>
                            </View>
                            <View style={{height: height * 0.06, alignItems: "center", backgroundColor: "#fff", borderTopWidth: 2, borderTopColor: "#B3B3BC", borderBottomWidth: 1, borderBottomColor: "#B3B3BC", marginLeft: "4%", marginRight: "4%", flexDirection: "row"}}>
                                <View style={{flex: 0.6, justifyContent: "center", alignItems: "flex-start"}}>
                                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#666"}}>메뉴</Text>
                                </View>
                                <View style={{flex: 0.1, justifyContent: "center", alignItems: "center"}}>
                                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#666"}}>수량</Text>
                                </View>
                                <View style={{flex: 0.3, justifyContent: "center", alignItems: "center"}}>
                                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#666"}}>금액</Text>
                                </View>
                            </View>
                            {(state.optionList !== undefined && state.optionList !== null && state.optionList.length > 0) &&
                                <>
                                {state.optionList.map((item,index) => {
                                    return (
                                        <View key={index} style={{minHeight: height * 0.1, alignItems: "center", backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#B3B3BC", marginLeft: "4%", marginRight: "4%"}}>
                                            <View style={{minHeight: height * 0.1, alignItems: "center", flexDirection: "row"}}>
                                                <View style={{flex: 0.6, justifyContent: "center", alignItems: "flex-start"}}>
                                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#000"}}>{item.prd_name}</Text>
                                                </View>
                                                <View style={{flex: 0.1, justifyContent: "center", alignItems: "center"}}>
                                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#F45552"}}>{item.prd_quantity}개</Text>
                                                </View>
                                                <View style={{flex: 0.3, justifyContent: "center", alignItems: "center"}}>
                                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#000"}}>{item.prd_total_price_show}원</Text>
                                                </View>
                                            </View>
                                            {(item.options !== undefined && item.options !== null && item.options.length > 0) &&
                                                <>
                                                    {item.options.map((sItem,qIndex) => {
                                                        return (
                                                            <View key={qIndex} style={{minHeight: height * 0.07, alignItems: "center", flexDirection: "row"}}>
                                                                <View style={{flex: 0.7, justifyContent: "center", alignItems: "flex-start", paddingLeft: "5%"}}>
                                                                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#666"}}>+ {sItem.option_name}</Text>
                                                                </View>
                                                                <View style={{flex: 0.3, justifyContent: "center", alignItems: "center"}}>
                                                                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#666"}}>{sItem.option_price_show}원</Text>
                                                                </View>
                                                            </View>
                                                        )
                                                    })}
                                                </>
                                            }
                                        </View>
                                    )
                                })}
                                </>
                            }
                            <View style={{height: height * 0.05, backgroundColor: "#fff"}}/>
                        </ScrollView>
                    }
                    <View style={{height: height * 0.06, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                        <TouchableOpacity onPress={openChatting} style={{height: "90%", width: "90%" , backgroundColor: "#2459C1", flexDirection: "row", borderRadius: 10}}>
                            <View style={{flex:0.25, alignItems: "center", flexDirection: "row", justifyContent: "flex-end"}}>
                                <ComponentIcChat iHeight={height * 0.03} iWidth={width * 0.08} iColor={"#fff"}/>
                                <View style={{position: "absolute", zIndex: 1, top: 0, left: "25%"}}>
                                    <ComponentIcInfo iHeight={height * 0.03} iWidth={width * 0.08} iColor={"#dfdfdf"}/>
                                </View>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.6), color: "#fff"}}>채팅연결 {">"}</Text>
                            </View>
                            <View style={{flex:0.75, paddingLeft: "2%", justifyContent: "center"}}>
                                <Text style={{fontWeight: "400", fontSize: RFPercentage(1.8), color: "#fff"}}>{state.inquiry}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{height: height * 0.06, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                        <View style={{height: "90%", width: "90%" , backgroundColor: "#fff", flexDirection: "row", borderRadius: 10}}>
                            <View style={{flex:0.4, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.2), color: "#000"}}>총합 {state.order_total_quantity}건</Text>
                            </View>
                            <View style={{flex:0.6, justifyContent: "center", alignItems: "flex-end", paddingRight: "5%"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.2), color: "#000", }}>{state.order_total_amount_org_show} 원</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{height: height * 0.08, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                        <View style={{height: height * 0.072, width: width * 0.9 , backgroundColor: "#f0f6fc", flexDirection: "row"}}>
                            {sColor === "standby" &&
                                <Animatable.View animation="flash" easing="ease-out" iterationCount="infinite" iterationDelay={500} useNativeDriver={true} style={{height: "100%", width: "70%", backgroundColor: "#F45552", justifyContent: "center", alignItems: "center", borderRadius: 10, marginRight: "2%"}}>
                                    <TouchableOpacity onPress={() => changeOrderStatus("confirm")} style={{height: "100%", width: "100%", justifyContent: "center", alignItems: "center"}}>
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(3), color: "#fff"}}>주문접수</Text>
                                    </TouchableOpacity>
                                </Animatable.View>
                            }
                            {sColor === "confirmed" &&
                                <TouchableOpacity onPress={() => changeOrderStatus("prepare")} style={{height: "100%", width: "70%", backgroundColor: "#40C1BB", justifyContent: "center", alignItems: "center", borderRadius: 10, marginRight: "2%"}}>
                                    <Text style={{fontWeight: "600", fontSize: RFPercentage(3), color: "#fff"}}>상품 준비완료</Text>
                                </TouchableOpacity>
                            }
                            {sColor === "prepared" &&
                                <TouchableOpacity onPress={() => completePickUp("pickup-complete")} style={{height: "100%", width: "70%", backgroundColor: "#2389F7", justifyContent: "center", alignItems: "center", borderRadius: 10, marginRight: "2%"}}>
                                    <Text style={{fontWeight: "600", fontSize: RFPercentage(3), color: "#fff"}}>전달완료</Text>
                                </TouchableOpacity>
                            }
                            <TouchableOpacity onPress={cancelOrderStatus} style={{height: "100%", width: "28%", backgroundColor: "#2F2F2F", justifyContent: "center", alignItems: "center", borderRadius: 10}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.5), color: "#A1A1A1"}}>접수불가</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{height : height * 0.01}} />
                    {(!iProps.UserConfigReducer.homeButton && !iProps.UserConfigReducer.orderButton && !iProps.UserConfigReducer.inventoryButton && !iProps.UserConfigReducer.quickButton && !iProps.UserConfigReducer.orderlistButton) &&
                        <>
                            {(iProps.UserConfigReducer.confirmButton && sColor === "standby") ?
                                <>
                                    <LinearGradient
                                        start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                        colors={['#f1948a', '#ec7063','#ec7063','#ec7063','#cb4335','#cb4335','#943126']} 
                                        style={{
                                            position: "absolute",
                                            zIndex: 11,
                                            bottom: height * 0.11,
                                            left: width * 0.1,
                                            height: height * 0.08,
                                            width: width * 0.85,
                                            borderRadius: width * 0.05,
                                        }}
                                    >
                                        <TouchableOpacity onPress={() => checkedConfirm("confirm")} style={{flex:1,justifyContent: "space-between", flexDirection: "row", alignItems: "center", paddingLeft: "10%", paddingRight: "5%"}}>
                                            <View>
                                                <Text style={{fontSize: RFPercentage(2), fontWeight: '700', color: "#fff"}}>새로운 주문이 들어왔습니다! </Text>
                                                <Text style={{fontSize: RFPercentage(2), fontWeight: '700', color: "#fff"}}>하단에 주문접수를 눌러주세요</Text>
                                            </View>
                                            <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.08} iColor={"#fff"}/>
                                        </TouchableOpacity>
                                    </LinearGradient>
                                    <View style={{position: "absolute", zIndex: 10, bottom: height * 0.1, left: "25%", height: height * 0.025, width: height * 0.025, backgroundColor: "#ec7063", transform: [{ rotateZ: '0.785398rad' }]}} />
                                </>
                            :
                                <>
                                {(iProps.UserConfigReducer.prepareButton && sColor === "confirmed") ?
                                    <>
                                        <LinearGradient
                                            start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                            colors={['#6eb5c0', '#006c84','#006c84','#006c84','#003b46','#003b46','#003b46']} 
                                            style={{
                                                position: "absolute",
                                                zIndex: 11,
                                                bottom: height * 0.11,
                                                left: width * 0.1,
                                                height: height * 0.08,
                                                width: width * 0.85,
                                                borderRadius: width * 0.05,
                                            }}
                                        >
                                            <TouchableOpacity onPress={() => checkedConfirm("prepare")} style={{flex:1,justifyContent: "space-between", flexDirection: "row", alignItems: "center", paddingLeft: "10%", paddingRight: "5%"}}>
                                                <View>
                                                    <Text style={{fontSize: RFPercentage(2), fontWeight: '700', color: "#fff"}}>주문받은 상품이 준비완료되었다면 </Text>
                                                    <Text style={{fontSize: RFPercentage(2), fontWeight: '700', color: "#fff"}}>하단에 상품 준비완료를 눌러주세요!</Text>
                                                </View>
                                                <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.08} iColor={"#fff"}/>
                                            </TouchableOpacity>
                                        </LinearGradient>
                                        <View style={{position: "absolute", zIndex: 10, bottom: height * 0.1, left: "25%", height: height * 0.025, width: height * 0.025, backgroundColor: "#006c84", transform: [{ rotateZ: '0.785398rad' }]}} />
                                    </>
                                :
                                    <>
                                    {(iProps.UserConfigReducer.pickupCompleteButton && sColor === "prepared") &&
                                        <>
                                            <LinearGradient
                                                start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                                colors={['#607d8b', '#455a64','#546e7a','#546e7a','#37474f','#263238','#263238']} 
                                                style={{
                                                    position: "absolute",
                                                    zIndex: 11,
                                                    bottom: height * 0.11,
                                                    left: width * 0.1,
                                                    height: height * 0.08,
                                                    width: width * 0.85,
                                                    borderRadius: width * 0.05,
                                                }}
                                            >
                                                <TouchableOpacity onPress={() => checkedConfirm("pickup")} style={{flex:1,justifyContent: "space-between", flexDirection: "row", alignItems: "center", paddingLeft: "10%", paddingRight: "5%"}}>
                                                    <View>
                                                        <Text style={{fontSize: RFPercentage(2), fontWeight: '700', color: "#fff"}}>고객님께 상품을 전달 후</Text>
                                                        <Text style={{fontSize: RFPercentage(2), fontWeight: '700', color: "#fff"}}>하단에 전달완료룰 눌러주세요!</Text>
                                                    </View>
                                                    <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.08} iColor={"#fff"}/>
                                                </TouchableOpacity>
                                            </LinearGradient>
                                            <View style={{position: "absolute", zIndex: 10, bottom: height * 0.1, left: "25%", height: height * 0.025, width: height * 0.025, backgroundColor: "#455a64", transform: [{ rotateZ: '0.785398rad' }]}} />
                                        </>
                                    }
                                    </>
                                }
                                </>
                            }
                        </>
                    }
                </View>
            }
        </>
    )
}

export default Reception;