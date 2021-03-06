import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Animated, ScrollView, Easing, FlatList, Image, TextInput, Keyboard, Linking, PermissionsAndroid } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import { WebView } from "react-native-webview";
import { ifIphoneX } from 'react-native-iphone-x-helper';
import LottieView from 'lottie-react-native';
import ImagePicker from 'react-native-image-picker';
import FormData from 'form-data';
import mime from "mime";
import moment from 'moment-timezone';
import 'moment/locale/ko';

import { ComponentDelete } from '../../assets/svg/delete';
import {ComponentCircle} from '../../assets/svg/circle';
import {ComponentCheckCircle} from '../../assets/svg/check_circle';
import { ComponentSelectedCircle } from '../../assets/svg/selectedCircle';
import { ComponentUnSelectedCircle } from '../../assets/svg/unselectedCircle';
import { ComponentDeliveryBox } from '../../assets/svg/delivery_box';
import { ComponentDeliveryClipBoard } from '../../assets/svg/delivery_clipboard';
import { ComponentDeliveryTruck } from '../../assets/svg/delivery_truck';

import stampEventImg from '../../assets/img/eventdetail.png';
import couponEventImg from '../../assets/img/appcoupon.png';
import tempImg from '../../assets/img/banner_temp.png';

import Common from '../../utils/common';

let checkTime;
let idCheckTime;
let bannerWarningTime;

const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.throo_ceo";
const APP_STORE = "https://apps.apple.com/us/app/id1594134264";

const { width, height } = Dimensions.get('window');

export const CompModalVersionNotiPage = ({fnClose}) => {
    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "0%",
                marginTop: width * 0.1,
                width: width * 0.9,
                height: height * 0.25, 
                backgroundColor: "#fff",
                borderRadius: width * 0.02, 
            }}
        >
            <View style={{height: height * 0.02, justifyContent: "center", alignItems: "center"}} />
            <View style={{height: height * 0.06, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>?????? ?????? ??????</Text>
            </View>
            <View style={{height: height * 0.07, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(1.7), fontWeight: '500', color: "#4E5867"}}>?????? ????????? ?????? ????????? ????????????,</Text>
                <Text style={{fontSize: RFPercentage(1.7), fontWeight: '500', color: "#4E5867"}}>???????????? ???????????????????</Text>
            </View>
            <View style={{height: height * 0.1, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                <TouchableOpacity onPress={() => Linking.openURL(Platform.OS === "ios" ? APP_STORE : PLAY_STORE)} style={{height: "65%", width: "42%", justifyContent: "center", alignItems: "center", backgroundColor: "#6490E7", marginRight: "5%", borderRadius: 10}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#fff"}}>???????????? ??????</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={close} style={{height: "65%", width: "42%", justifyContent: "center", alignItems: "center", backgroundColor: "#F2F3F5", borderRadius: 10}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>??????</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const StoreStatusToggle = ({ onToggle, isOn }) => {
    const [aniValue] = useState(new Animated.Value(0));
    const color = !isOn ? "#617BE3" : "#F45552";

    const moveSwitchToggle = aniValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width * 0.07],
    });

    Animated.timing(aniValue, {
        toValue: !isOn ? 1 : 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
    }).start();

    return (
        <View style={{flexDirection: "row", alignItems: "center"}}>
            <TouchableOpacity onPress={onToggle}>
                <View style={{ width: width * 0.1, height: height * 0.015, paddingLeft: 2, borderRadius: 15, justifyContent: "center",backgroundColor: color }}>
                    <Animated.View 
                        style={{ 
                            transform: [{ translateX: moveSwitchToggle }],
                            width: width * 0.04,
                            height: width * 0.04,
                            backgroundColor: "#fff",
                            borderRadius: width,
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.2,
                            shadowRadius: 2.5,
                            elevation: 1.5
                        }}
                    />
                </View>
            </TouchableOpacity>
        </View>
    )
}

export const VolumeSwitchToggle = ({ onToggle, isOn }) => {
    const [aniValue] = useState(new Animated.Value(0));
    const color = !isOn ? "#617BE3" : "#F45552";

    const moveSwitchToggle = aniValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width * 0.11],
    });

    Animated.timing(aniValue, {
        toValue: !isOn ? 1 : 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
    }).start();

    return (
        <View style={{flexDirection: "row", alignItems: "center"}}>
            <TouchableOpacity onPress={onToggle}>
                <View style={{ width: width * 0.17, height: height * 0.02, paddingLeft: 2, borderRadius: 15, justifyContent: "center",backgroundColor: color }}>
                    <Animated.View 
                        style={{ 
                            transform: [{ translateX: moveSwitchToggle }],
                            width: width * 0.05,
                            height: width * 0.05,
                            backgroundColor: "#fff",
                            borderRadius: width,
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.2,
                            shadowRadius: 2.5,
                            elevation: 1.5
                        }}
                    />
                </View>
            </TouchableOpacity>
        </View>
    )
}

export const SwitchToggle = ({ onToggle, isOn }) => {
    const [aniValue] = useState(new Animated.Value(0));
    const color = isOn ? "#617BE3" : "#F45552";

    const moveSwitchToggle = aniValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width * 0.11],
    });

    Animated.timing(aniValue, {
        toValue: isOn ? 1 : 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
    }).start();

    return (
        <View style={{flexDirection: "row", alignItems: "center"}}>
            <TouchableOpacity onPress={onToggle}>
                <View style={{ width: width * 0.17, height: height * 0.02, paddingLeft: 2, borderRadius: 15, justifyContent: "center",backgroundColor: color }}>
                    <Animated.View 
                        style={{ 
                            transform: [{ translateX: moveSwitchToggle }],
                            width: width * 0.05,
                            height: width * 0.05,
                            backgroundColor: "#fff",
                            borderRadius: width,
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.2,
                            shadowRadius: 2.5,
                            elevation: 1.5
                        }}
                    />
                </View>
            </TouchableOpacity>
        </View>
    )
}

export const InventorySwitchToggle = ({ onToggle, isOn }) => {
    const [aniValue] = useState(new Animated.Value(0));
    const color = isOn ? "#617BE3" : "#F45552";

    const moveSwitchToggle = aniValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width * 0.07],
    });

    Animated.timing(aniValue, {
        toValue: isOn ? 1 : 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
    }).start();

    return (
        <View style={{flexDirection: "row", alignItems: "center"}}>
            <TouchableOpacity onPress={onToggle}>
                <View style={{ width: width * 0.1, height: height * 0.015, paddingLeft: 2, borderRadius: 15, justifyContent: "center",backgroundColor: color }}>
                    <Animated.View 
                        style={{ 
                            transform: [{ translateX: moveSwitchToggle }],
                            width: width * 0.05,
                            height: width * 0.05,
                            backgroundColor: "#fff",
                            borderRadius: width,
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.2,
                            shadowRadius: 2.5,
                            elevation: 1.5
                        }}
                    />
                </View>
            </TouchableOpacity>
        </View>
    )
}

export const CompModalContent = ({sText}) => {

    return (
        <View 
            style={{
                marginHorizontal: "5%",
                marginTop: width * 0.1,
                width: width * 0.8,
                height: width * 0.35, 
                backgroundColor: "#fff",
                borderRadius: width * 0.02, 
            }}
        >
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", margin: "10%"}}>
                <Text style={{fontSize: RFPercentage(1.8), fontWeight: '800', color: "#6490E8"}}>{sText}</Text>
            </View>
        </View>
    )
}

export const CompCheckPage = ({ fnAgree, fnCancel }) => {

    const agree = async () => {
        if(fnAgree !== undefined && typeof fnAgree === "function"){
            await fnAgree();
        }
    }

    const cancel = async () => {
        if(fnCancel !== undefined && typeof fnCancel === "function"){
            await fnCancel();
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "0%",
                marginTop: width * 0.1,
                width: width * 0.9,
                height: height * 0.22, 
                backgroundColor: "#fff",
                borderRadius: width * 0.02, 
            }}
        >
            <View style={{height: height * 0.02, justifyContent: "center", alignItems: "center"}} />
            <View style={{height: height * 0.05, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>????????????</Text>
            </View>
            <View style={{height: height * 0.05, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(1.7), fontWeight: '500', color: "#4E5867"}}>????????? ???????????? ???????????????????</Text>
            </View>
            <View style={{height: height * 0.1, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                <TouchableOpacity onPress={cancel} style={{height: "65%", width: "42%", justifyContent: "center", alignItems: "center", backgroundColor: "#F2F3F5", marginRight: "5%", borderRadius: 10}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>??????</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={agree} style={{height: "65%", width: "42%", justifyContent: "center", alignItems: "center", backgroundColor: "#EF4452", borderRadius: 10}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#fff"}}>????????????</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const ComConfirmDeleteCoupon = ({ fnDeleteCoupon, fnClose }) => {

    const agree = async () => {
        if(fnDeleteCoupon !== undefined && typeof fnDeleteCoupon === "function"){
            await fnDeleteCoupon();
        }
    }

    const cancel = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "0%",
                marginTop: width * 0.1,
                width: width * 0.9,
                height: height * 0.27, 
                backgroundColor: "#fff",
                borderRadius: width * 0.02, 
            }}
        >
            <View style={{height: height * 0.02, justifyContent: "center", alignItems: "center"}} />
            <View style={{height: height * 0.05, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>????????????</Text>
            </View>
            <View style={{height: height * 0.1, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#4E5867"}}>??????????????? ?????? ?????? ????????? </Text>
                <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#4E5867", marginTop: "1%"}}>???????????? ????????? ???????????? ???????????? </Text>
                <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#4E5867", marginTop: "1%"}}>????????????????????????? </Text>
            </View>
            <View style={{height: height * 0.1, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                <TouchableOpacity onPress={cancel} style={{height: "65%", width: "42%", justifyContent: "center", alignItems: "center", backgroundColor: "#F2F3F5", marginRight: "5%", borderRadius: 10}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>??????</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={agree} style={{height: "65%", width: "42%", justifyContent: "center", alignItems: "center", backgroundColor: "#EF4452", borderRadius: 10}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#fff"}}>??????</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const ComConfirmDetailCoupon = ({ sData, fnClose }) => {

    const cancel = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: height * 0.7,
                width: width,
                height: height * 0.3, 
                backgroundColor: "#fff",
                borderRadius: width * 0.05, 
            }}
        >
            <View style={{height: height * 0.02, justifyContent: "center", alignItems: "center"}} />
            <TouchableOpacity onPress={cancel} style={{height: height * 0.05, alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginLeft: "5%", marginRight: "5%"}}>
                <Text style={{fontSize: RFPercentage(2.3), fontWeight: '800', color: "#000"}}>{sData.name}</Text>
                <ComponentDelete iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
            </TouchableOpacity>
            <View style={{height: height * 0.2, justifyContent: "center", marginLeft: "5%"}}>
                {sData.type === "amount" ?
                    <Text style={{fontSize: RFPercentage(1.8), fontWeight: '600', color: "#4E5867"}}>????????????: {sData.amount}???</Text>
                :
                    <>
                        <Text style={{fontSize: RFPercentage(1.8), fontWeight: '600', color: "#4E5867", }}>?????????: {sData.percent} %</Text>
                        <Text style={{fontSize: RFPercentage(1.8), fontWeight: '600', color: "#4E5867", marginTop: "2%"}}>??????????????????: {sData.maxlimitAmount} ???</Text>
                    </>
                }
                <Text style={{fontSize: RFPercentage(1.8), fontWeight: '600', color: "#4E5867", marginTop: "2%"}}>??????????????????: {sData.limitAmount} ???</Text>
                <Text style={{fontSize: RFPercentage(1.8), fontWeight: '600', color: "#4E5867", marginTop: "2%"}}>???????????? ?????????: {sData.userCount} ???</Text>
                <Text style={{fontSize: RFPercentage(1.8), fontWeight: '600', color: "#4E5867", marginTop: "2%"}}>???????????????: {sData.couponCount} ???</Text>
                <Text style={{fontSize: RFPercentage(1.8), fontWeight: '600', color: "#4E5867", marginTop: "2%"}}>????????????: {sData.fromDate} ~ {sData.toDate}</Text>
            </View>
        </View>
    )
}

export const ComConfirmDetailStamp = ({ sData, fnClose }) => {

    const cancel = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: height * 0.7,
                width: width,
                height: height * 0.3, 
                backgroundColor: "#fff",
                borderRadius: width * 0.05, 
            }}
        >
            <View style={{height: height * 0.02, justifyContent: "center", alignItems: "center"}} />
            <TouchableOpacity onPress={cancel} style={{height: height * 0.05, alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginLeft: "5%", marginRight: "5%"}}>
                <Text style={{fontSize: RFPercentage(2.3), fontWeight: '800', color: "#000"}}>{sData.name}</Text>
                <ComponentDelete iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
            </TouchableOpacity>
            <View style={{height: height * 0.2, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(1.8), fontWeight: '600', color: "#4E5867", marginTop: "2%"}}>????????? ?????? ??????: {sData.couponCount} ???</Text>
                <Text style={{fontSize: RFPercentage(1.8), fontWeight: '600', color: "#4E5867", marginTop: "2%"}}>????????? ????????? ?????????: {sData.userCount} ???</Text>
                <Text style={{fontSize: RFPercentage(1.8), fontWeight: '600', color: "#4E5867", marginTop: "2%"}}>???????????? ????????? ?????????: {sData.userEvent} ???</Text>
                <Text style={{fontSize: RFPercentage(1.8), fontWeight: '600', color: "#4E5867", marginTop: "2%"}}>????????????: {sData.amount} ???</Text>
                <Text style={{fontSize: RFPercentage(1.8), fontWeight: '600', color: "#4E5867", marginTop: "2%"}}>????????????: {sData.fromDate} ~ {sData.toDate}</Text>
            </View>
        </View>
    )
}

export const CompModalNoticeContent = ({sItem, fnCancel}) => {

    const cancel = async () => {
        if(fnCancel !== undefined && typeof fnCancel === "function"){
            await fnCancel();
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "0%",
                marginTop: width * 0.1,
                width: width * 0.9,
                height: height * 0.8,
                backgroundColor: "#fff",
                borderRadius: width * 0.05, 
            }}
        >
            <View style={{height: height * 0.15, flexDirection: "row" }}>
                <View style={{flex: 0.8, justifyContent: "flex-start", paddingTop: "10%", paddingLeft: "5%"}}>
                    <Text style={{fontSize: RFPercentage(2.2), fontWeight: '800', color: "#000"}}>{sItem.title}</Text>
                    <Text style={{fontSize: RFPercentage(1.8), fontWeight: '500', color: "#4E5867", marginTop: "3%"}}>{sItem.date}</Text>
                </View>
                <TouchableOpacity onPress={cancel} style={{flex: 0.2, justifyContent: "flex-start", alignItems: "flex-end", paddingTop: "10%", paddingRight: "5%"}}>
                    <ComponentDelete iHeight={height * 0.05} iWidth={height * 0.03} iColor={"#000"}/>
                </TouchableOpacity>
            </View>
            <View style={{flex:1, margin: "5%"}}>
                <ScrollView>
                    <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#333D4B"}}>{sItem.content}</Text>
                </ScrollView>
            </View>
        </View>
    )
}

export const ComSelectionData = ({ sList, fnSelectValue }) => {
    const selectValue = async (sIndex) => {
        if(fnSelectValue !== undefined && typeof fnSelectValue === "function"){
            await fnSelectValue(sIndex);
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: height * 0.5,
                width: width,
                height: height * 0.5, 
                backgroundColor: "#fff",
                borderTopLeftRadius: width * 0.02, 
                borderTopRightRadius: width * 0.02, 
            }}
        >
            <View style={{padding: "7%"}}>
                <FlatList
                    data={sList}
                    ListFooterComponent={<View style={{ height: width * 0.1 }} />}
                    ListHeaderComponent={<View style={{ height: height * 0.01 }} />}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(data, index) => "list-" + index + Math.random()}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={{height: height * 0.03}}/>
                        )
                    }}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity onPress={() => selectValue(item)} style={{height: height * 0.08, backgroundColor: "#fff", width: "100%",  flexDirection: "row"}}>
                                <View style={{flex: 0.7, justifyContent: "center", paddingLeft: "5%"}}>
                                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '600', color: "#000" }}>{item.name}</Text>
                                </View>
                                <View style={{flex: 0.3, justifyContent: "center", alignItems: "center", marginRight: "5%"}}>
                                    <View style={{height: width * 0.07, width: width * 0.07,  justifyContent: "center", alignItems: "center"}}>
                                        <ComponentCircle iHeight={height * 0.03} iWidth={width * 0.08} iColor={"#6490E8"}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ) 
                    }}
                />
            </View>
        </View>
    )
}

export const ComCommercialChartPage = ({ iTitle, iUri, fnClose }) => {
    const [loading, setLoading] = useState(true);
    const [iLoad, setILoad] = useState(false);

    const [sTitle, setTitle] = useState("");

    const sUri = useRef("");

    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    const asyncData = async () => {
        setLoading(true);
        setTitle(iTitle);
        sUri.current = iUri;
        setLoading(false);
    }

    useEffect(() => {
        asyncData();
    }, [iUri]);

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: height * 0.4,
                width: width,
                height: height * 0.6, 
                backgroundColor: "#fff",
                borderTopLeftRadius: width * 0.02, 
                borderTopRightRadius: width * 0.02, 
            }}
        >
            <View style={{padding: "7%"}}>
                <TouchableOpacity onPress={close} style={{height: height * 0.05, justifyContent: "space-between", flexDirection: "row", alignItems: "center"}}>
                    <Text style={{fontWeight: "900", fontSize: RFPercentage(1.8), color: "#000"}}>{sTitle} ??????</Text>
                    <ComponentDelete iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
                </TouchableOpacity>
                {loading ?
                    <View style={{ height: height * 0.55, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                        <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                    </View>
                :
                    <View style={{ height: height * 0.5, width: width * 0.9, justifyContent: "center", alignItems: "center"}}>
                        <View 
                            style={{ 
                                height: height * 0.5, width,
                                flexDirection: "row",
                                backgroundColor: "#fff", padding: "5%",
                                justifyContent: "center", alignItems: "center",
                            }}
                        >
                            {iLoad &&
                                <View style={{ flex:1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                                </View>
                            }
                            <WebView
                                originWhitelist={['*']}
                                cacheEnabled={false}
                                source={{ uri: sUri.current}}
                                onLoadEnd={() => setILoad(false)}
                            />
                        </View>
                    </View>
                }
            </View>
        </View>
    )
}

export const ComCommercialThrooProductPage = ({ sProps, iParam, fnClose, fnRefresh }) => {
    const refresh = async () => {
        if(fnRefresh !== undefined && typeof fnRefresh === "function"){
            await fnRefresh();
        }
    }

    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    return (
            <View 
                style={{
                    marginHorizontal: "-5%",
                    marginTop: height * 0.2,
                    width: width,
                    height: height * 0.77, 
                    backgroundColor: "#fff",
                    borderTopLeftRadius: width * 0.04, 
                    borderTopRightRadius: width * 0.04, 
                }}
            >
                <TouchableOpacity onPress={close} style={{height: height * 0.1, justifyContent: "space-between", flexDirection: "row", alignItems: "center", marginLeft: "5%", marginRight: "5%"}}>
                    <Text style={{fontWeight: "700", fontSize: RFPercentage(2), color: "#000"}}>{iParam.name} ?????? ??????</Text>
                    <ComponentDelete iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
                </TouchableOpacity>
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <View style={{ width: width * 0.9, height: height * 0.3, justifyContent: "space-between"}}>
                        <View style={{ width: width * 0.9, height: height * 0.07, flexDirection: "row"}}>
                            <View style={{ width: height * 0.06, height: height * 0.06, backgroundColor: iParam.param.toString() !== "0" ? "#dfdfdf" : "#6490E7", borderRadius: width * 0.02, justifyContent: "center", alignItems: "center"}}>
                                <ComponentDeliveryClipBoard iHeight={height * 0.03} iWidth={height * 0.025} iColor={"#fff"}/>
                            </View>
                            <View style={{ width: width * 0.7, height: height * 0.07, alignItems: "center", flexDirection: "row", paddingLeft: "5%" }}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: iParam.param.toString() !== "0" ? "#dfdfdf" : "#000" }}>?????? ?????????</Text>
                                {iParam.createdAt !== "Invalid date" &&
                                    <Text style={{fontWeight: "500", fontSize: RFPercentage(1.7), color: "#666666", paddingLeft: "5%" }}>{iParam.createdAt}</Text>
                                }
                            </View>
                        </View>
                        <View style={{ width: width * 0.9, height: height * 0.07, flexDirection: "row"}}>
                            <View style={{ width: height * 0.06, height: height * 0.06, backgroundColor: iParam.param.toString() !== "1" ? "#dfdfdf" : "#6490E7", borderRadius: width * 0.02, justifyContent: "center", alignItems: "center"}}>
                                <ComponentCheckCircle iHeight={height * 0.03} iWidth={height * 0.025} iColor={"#fff"}/>
                            </View>
                            <View style={{ width: width * 0.7, height: height * 0.07, alignItems: "center", flexDirection: "row", paddingLeft: "5%" }}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: iParam.param.toString() !== "1" ? "#dfdfdf" : "#000" }}>?????? ??????</Text>
                                {iParam.confirmAt !== "Invalid date" &&
                                    <Text style={{fontWeight: "500", fontSize: RFPercentage(1.7), color: "#666666", paddingLeft: "5%" }}>{iParam.confirmAt}</Text>
                                }
                            </View>
                        </View>
                        <View style={{ width: width * 0.9, height: height * 0.07, flexDirection: "row"}}>
                            <View style={{ width: height * 0.06, height: height * 0.06, backgroundColor: iParam.param.toString() !== "2" ? "#dfdfdf" : "#6490E7", borderRadius: width * 0.02, justifyContent: "center", alignItems: "center"}}>
                                <ComponentDeliveryTruck iHeight={height * 0.03} iWidth={height * 0.025} iColor={"#fff"}/>
                            </View>
                            <View style={{ width: width * 0.7, height: height * 0.07, alignItems: "center", flexDirection: "row", paddingLeft: "5%" }}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: iParam.param.toString() !== "2" ? "#dfdfdf" : "#000" }}>?????? ???</Text>
                                {iParam.deliverdAt !== "Invalid date" &&
                                    <Text style={{fontWeight: "500", fontSize: RFPercentage(1.7), color: "#666666", paddingLeft: "5%" }}>{iParam.deliverdAt}</Text>
                                }
                            </View>
                        </View>
                        <View style={{ width: width * 0.9, height: height * 0.07, flexDirection: "row"}}>
                            <View style={{ width: height * 0.06, height: height * 0.06, backgroundColor: iParam.param.toString() !== "3" ? "#dfdfdf" : "#6490E7", borderRadius: width * 0.02, justifyContent: "center", alignItems: "center"}}>
                                <ComponentDeliveryBox iHeight={height * 0.03} iWidth={height * 0.025} iColor={"#fff"}/>
                            </View>
                            <View style={{ width: width * 0.7, height: height * 0.07, alignItems: "center", flexDirection: "row", paddingLeft: "5%" }}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: iParam.param.toString() !== "3" ? "#dfdfdf" : "#000" }}>?????? ??????</Text>
                                {iParam.completeAt !== "Invalid date" &&
                                    <Text style={{fontWeight: "500", fontSize: RFPercentage(1.7), color: "#666666", paddingLeft: "5%" }}>{iParam.completeAt}</Text>
                                }
                            </View>
                        </View>
                    </View>
                    <View style={{ height: height * 0.21, width: width * 0.9, borderBottomColor: "#F2F3F5", borderBottomWidth: 1 }}>
                        <View style={{ height: height * 0.20, width: "100%", flexDirection: "row"}}>
                            <View style={{height: height * 0.20, width: width * 0.35, justifyContent: "center" }}>
                                <Image source={{ uri :iParam.img }} style={{width: width * 0.3, height : height * 0.20, borderRadius: width * 0.03, resizeMode: "center"}}/>
                            </View>
                            <View style={{height: height * 0.20, width: width * 0.55, justifyContent: "center", alignItems: "center"}}>
                                <View style={{height: height * 0.15, width: width * 0.55}}>
                                    <View style={{height: height * 0.03, justifyContent: "center"}}>
                                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2.3), color: "#000" }}>{iParam.name}</Text>
                                    </View>
                                    <View style={{height: height * 0.07, marginRight: "5%", justifyContent: "space-around"}}>
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#6B7583" }}>{iParam.detail1}</Text>
                                    </View>
                                    <View style={{height: height * 0.05, marginRight: "5%", justifyContent: "center"}}>
                                        <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#000" }}>{iParam.priceCasting}???</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: width * 0.9, height: height * 0.16 }}>
                        <View style={{ height: height * 0.07, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.6), color: "#666" }}>????????????:</Text>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#000" }}>{iParam.deliveryParam}</Text>
                        </View>
                        <View style={{ height: height * 0.05, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.6), color: "#666" }}>????????????:</Text>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#000" }}>{iParam.deliveryCompany}</Text>
                        </View>
                    </View>
                </View>
            </View>
    )
}

export const ComCommercialBannerEditPage = ({ sProps, iParam, fnClose, fnRefresh }) => {
    const [loading, setLoading] = useState(true);

    const [sData, setData] = useState("");

    const [warn, setWarn] = useState("");
    const [linkWarn, setLinkWarn] = useState(false);

    const [bannerTitle, setBannerTitle] = useState("");
    const [bannerSubTitle, setBannerSubTitle] = useState("");
    const [bannerImg, setBannerImg] = useState("");
    const [bannerImgData, setBannerImgData] = useState(null);

    const [sNmErrColor, setNmErrColor] = useState("#F2F3F5");
    const [sSubNmErrColor, setSubNmErrColor] = useState("#F2F3F5");

    const [textInputType, setTextInputType] = useState("");

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const nextInputSection = (sIndex) => {
        if(sIndex === "nm"){
            unactiveNmText();
        } else if (sIndex === "sub") {
            unactiveSubNmText();
        } else {
            Keyboard.dismiss();
            unactiveNmText();
            unactiveSubNmText();
        }
    }

    const activeNmText = () => {
        setNmErrColor("#6490E7");
        setTextInputType("nm");
    }
    
    const unactiveNmText = () => {
        setNmErrColor("#F2F3F5");
        setTextInputType("");
        Keyboard.dismiss();
    }

    const activeSubNmText = () => {
        setSubNmErrColor("#6490E7");
        setTextInputType("sub");
    }
    
    const unactiveSubNmText = () => {
        setSubNmErrColor("#F2F3F5");
        setTextInputType("");
        Keyboard.dismiss();
    }

    const onChangeNm = text => {
        setBannerTitle(text);
        setNmErrColor("#6490E7");
    };

    const onChangeSubNm = text => {
        setBannerSubTitle(text);
        setSubNmErrColor("#6490E7");
    };
    
    const selectImage = async () => {
        const oOpt = {
            noData: true, 
            mediaType: 'photo',
            title: '?????? ??????',
            cancelButtonTitle: '??????',
            takePhotoButtonTitle: '?????? ??????...',
            chooseFromLibraryButtonTitle: '???????????? ????????????...',
            waitUntilSaved: true
        };
        try {
            let process = false;
            let granted = "";
            if (Platform.OS === 'android') {
                granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    process = true;
                }
            } else {
                process = true;
            }
            if (process) {
                ImagePicker.showImagePicker(oOpt, async (res) => {
                    if (res.uri != null && res.uri != undefined && res.uri != '') {
                        const typeCheck = Common.isValidFileType(res.type);
                        if (typeCheck) {
                            if (res.fileSize <= 10000000) {
                                setBannerImg(res.uri);
                                setBannerImgData(res);
                            } else {
                                setWarn("????????? ????????? 10MB????????? ???????????????");
                                if(bannerWarningTime) clearTimeout(bannerWarningTime);
                                bannerWarningTime = setTimeout(async () => {
                                    setWarn("");
                                }, 2500);
                            }
                        } else {
                            setWarn("PNG ???????????? JPG ????????? ???????????????.");
                            if(bannerWarningTime) clearTimeout(bannerWarningTime);
                            bannerWarningTime = setTimeout(async () => {
                                setWarn("");
                            }, 2500);
                        }
                    } else if (res.error) {
                        if(res.error.toString() === "Camera permissions not granted"){
                            setWarn("????????? ?????? ????????? ???????????????.");
                            if(bannerWarningTime) clearTimeout(bannerWarningTime);
                            bannerWarningTime = setTimeout(async () => {
                                setWarn("");
                            }, 2500);
                        } else {
                            setWarn("???????????? ????????? ??????????????????, ?????? ??????????????????.");
                            if(bannerWarningTime) clearTimeout(bannerWarningTime);
                            bannerWarningTime = setTimeout(async () => {
                                setWarn("");
                            }, 2500);
                        }
                    }
                });
            } else {
                setLinkWarn(true);
                //openModalPage();
            }
        } catch (error) {
            setWarn("???????????? ????????? ??????????????????, ?????? ??????????????????.");
            if(bannerWarningTime) clearTimeout(bannerWarningTime);
            bannerWarningTime = setTimeout(async () => {
                setWarn("");
            }, 2500);
        }
    }
    
    const refresh = async () => {
        if(fnRefresh !== undefined && typeof fnRefresh === "function"){
            await fnRefresh();
        }
    }

    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    const settingModalMove = () => {
        Linking.openSettings();
        setLinkWarn(false);
    }
    
    
    const settingModalCancel = () => {
        setLinkWarn(false);
    }

    const onKeyboardDidShow = (e) => {
        setKeyboardHeight(e.endCoordinates.height);
    }

    const createFormData = (photo, sNm) => {
        const formData = new FormData();

        let sFileUri = photo.uri.replace('file://', '');
        if (Platform.OS === 'android') {
            sFileUri = "file://" + photo.path;
        }

        formData.append('photo', {
            uri: sFileUri,
            type: mime.getType(sFileUri),
            name: sNm
        });

        return formData;
    };

    const uploadImageData = async (sIndex, sNm) => {
        let temp = {};
        const oData = await createFormData(sIndex, sNm);
        const oResponse = await sProps.appManager.accessAxios('/store/register/filesLogo', "post", "multipart", oData);
        if (oResponse !== undefined) {
            if (oResponse.url_path !== undefined && oResponse.url_path !== null && oResponse.url_path !== "") {
                temp = oResponse.url_path;
                return temp;

            } else {
                setWarn("????????? ?????????????????? ???????????? ??????????????????.");
                if(bannerWarningTime) clearTimeout(bannerWarningTime);
                bannerWarningTime = setTimeout(async () => {
                    setWarn("");
                }, 2500);
            }
        }
    }

    const editBannerImg = async () => {
        setLoading(true);

        if(bannerTitle === ""){
            setWarn("???????????? ????????? ??????????????????.");
            if(bannerWarningTime) clearTimeout(bannerWarningTime);
            bannerWarningTime = setTimeout(async () => {
                setWarn("");
            }, 2500);
        } else if (bannerSubTitle === "") {
            setWarn("???????????? ???????????? ??????????????????.");
            if(bannerWarningTime) clearTimeout(bannerWarningTime);
            bannerWarningTime = setTimeout(async () => {
                setWarn("");
            }, 2500);
        } else if (bannerImg === "") {
            setWarn("???????????? ????????? ??????????????????.");
            if(bannerWarningTime) clearTimeout(bannerWarningTime);
            bannerWarningTime = setTimeout(async () => {
                setWarn("");
            }, 2500);
        } else {
            let image1 = "";
            let progress1 = false;
            
            if(sData.img === bannerImg){
                progress1 = true;
                image1 = bannerImg
            } else {
                const result = await uploadImageData(bannerImgData, "nonTitle");
                if(result !== undefined){
                    progress1 = true;
                    image1 = result;
                }
            }
            
            if(progress1){
                const oData = {
                    store_id: sProps.UserConfigReducer.StoreID,
                    img_url : image1,
                    title : bannerTitle,
                    subTitle : bannerSubTitle,
                    eventId : sData.eventId,
                    commercialId : sData.id,
                }
                const oResponse = await sProps.appManager.accessAxios("/store/commercial/editBannerCommercial", "post", "login", oData);
                if (oResponse !== undefined && oResponse) {
                    refresh();
                } else {
                    setWarn("????????? ?????????????????? ???????????? ??????????????????.");
                    if(bannerWarningTime) clearTimeout(bannerWarningTime);
                    bannerWarningTime = setTimeout(async () => {
                        setWarn("");
                    }, 2500);
                }
            } else {
                setWarn("?????? ???????????? ????????????????????? ?????? ?????? ????????????.");
                if(bannerWarningTime) clearTimeout(bannerWarningTime);
                bannerWarningTime = setTimeout(async () => {
                    setWarn("");
                }, 2500);
            }
        }
        setLoading(false);
    }

    const asyncData = async () => {
        setLoading(true);
        setData(iParam);
        setBannerTitle(iParam.title);
        setBannerSubTitle(iParam.subTitle);
        setBannerImg(iParam.img);
        setLoading(false);
    }

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
        asyncData();
    }, []);

    return (
        <>
            {(warn === "" && !linkWarn) &&
                <View 
                    style={{
                        marginHorizontal: "-5%",
                        marginTop: height * 0.05,
                        width: width,
                        height: height * 0.95, 
                        backgroundColor: "#fff",
                        borderTopLeftRadius: width * 0.04, 
                        borderTopRightRadius: width * 0.04, 
                    }}
                >
                    {loading ?
                        <View style={{ height: height * 0.55, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                            <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                        </View>
                    :
                        <>
                            <View style={{flex: 1}}>
                                <TouchableOpacity onPress={close} style={{height: textInputType !== "" ? height * 0.2 : height * 0.08 , justifyContent: "space-between", flexDirection: "row", alignItems: "center", marginLeft: "5%", marginRight: "5%"}}>
                                    <Text style={{fontWeight: "700", fontSize: RFPercentage(2), color: "#000"}}>?????? ?????? ??????</Text>
                                    <ComponentDelete iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
                                </TouchableOpacity>
                                <View style={{height: height * 0.23, width, alignItems: "center", justifyContent: "space-around" }}>
                                    <Text style={{fontWeight: "400", fontSize: RFPercentage(1.6), color: "#666666"}}>-??????-</Text>
                                    <View style={{height: height * 0.2, width: width * 0.8, alignItems: "center", justifyContent: "center", backgroundColor: "#F1F3F7", borderRadius: width * 0.03 }}>
                                        <View style={{position: "absolute", top: height * 0.03, left: width * 0.05, backgroundColor: "#fff", height: height * 0.025, minWidth: width * 0.2, borderRadius: width * 0.05, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#B3B3BC"}}>
                                            <Text style={{fontWeight: "400", fontSize: RFPercentage(1.4), color: "#111111"}}>{sProps.UserConfigReducer.StoreName}</Text>
                                        </View>
                                        <View style={{position: "absolute", top: height * 0.06, left: width * 0.05, height: height * 0.03, width: width * 0.3, justifyContent: "flex-end"}}>
                                            <Text style={{fontWeight: "400", fontSize: RFPercentage(1.8), color: "#111111"}}>{bannerSubTitle !== "" ? bannerSubTitle : "4??? ?????????" }</Text>
                                        </View>
                                        <View style={{position: "absolute", top: height * 0.1, left: width * 0.05, height: height * 0.08, width: width * 0.35, justifyContent: "flex-start"}}>
                                            <Text style={{fontWeight: "600", fontSize: RFPercentage(2.3), color: "#111111"}}>{bannerTitle !== "" ? bannerTitle : "?????????! 14,400??? (300g)" }</Text>
                                        </View>
                                        <View style={{position: "absolute", top: height * 0.03, right: width * 0.05, height: height * 0.14, width: height * 0.14, justifyContent: "center", alignItems: "center"}}>
                                            {bannerImg !== "" ?
                                                <Image source={{uri: bannerImg}} style={{width: "100%", height : "100%", borderRadius: width * 0.03, resizeMode: "stretch"}}/>
                                            :
                                                <Image source={tempImg} style={{width: "100%", height : "100%", resizeMode: "contain"}}/>
                                            }
                                        </View>
                                    </View>
                                </View>
                                {(textInputType === "" || textInputType === "nm") &&
                                    <View style={{height: height * 0.15, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                                        <View style={{height: height * 0.05, backgroundColor: "#fff", width, justifyContent: "flex-end", marginLeft: "10%"}}>
                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>???????????? ??????</Text>
                                        </View>
                                        <TextInput
                                            placeholder="???) ?????????! 14,400??? (300g)"
                                            placeholderTextColor="#B0B7C1"
                                            returnKeyType="next"
                                            maxLength={20}
                                            onChangeText={text => onChangeNm(text)}
                                            onFocus={() => activeNmText()}
                                            onBlur={() => unactiveNmText()}
                                            onSubmitEditing={() => nextInputSection("nm")}
                                            value={bannerTitle}
                                            style={{
                                                width: "90%",
                                                height: height * 0.07,
                                                fontSize: RFPercentage(2.3),
                                                borderBottomColor: sNmErrColor,
                                                borderBottomWidth: 1,
                                                fontWeight: '500',
                                                backgroundColor: '#fff',
                                                color: "#000"
                                            }}
                                        />
                                    </View>
                                }
                                {(textInputType === "" || textInputType === "sub") &&
                                    <View style={{height: height * 0.15, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                                        <View style={{height: height * 0.05, backgroundColor: "#fff", width, justifyContent: "flex-end", marginLeft: "10%"}}>
                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>???????????? ?????????</Text>
                                        </View>
                                        <TextInput
                                            placeholder="???) 4??? ?????????"
                                            placeholderTextColor="#B0B7C1"
                                            returnKeyType="next"
                                            maxLength={8}
                                            onChangeText={text => onChangeSubNm(text)}
                                            onFocus={() => activeSubNmText()}
                                            onBlur={() => unactiveSubNmText()}
                                            onSubmitEditing={() => nextInputSection("sub")}
                                            value={bannerSubTitle}
                                            style={{
                                                width: "90%",
                                                height: height * 0.07,
                                                fontSize: RFPercentage(2.3),
                                                borderBottomColor: sSubNmErrColor,
                                                borderBottomWidth: 1,
                                                fontWeight: '500',
                                                backgroundColor: '#fff',
                                                color: "#000"
                                            }}
                                        />
                                    </View>
                                }
                                {textInputType === "" &&
                                    <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center"}}>
                                        <View style={{height: height * 0.07, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>???????????? ??????</Text>
                                        </View>
                                        <TouchableOpacity onPress={selectImage} style={{height: height * 0.06, width: width * 0.9, backgroundColor: "#FAFAFB", justifyContent: "center", paddingLeft: "5%", borderRadius: width * 0.02}}>
                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#2F2F2F" }}>
                                                + 
                                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#4E5867" }}>
                                                    ?????? ????????????
                                                </Text>
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>
                            {(textInputType === "nm" || textInputType === "sub") &&
                                <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.2}}>
                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>??????</Text>
                                </TouchableOpacity>
                            }
                            {textInputType === "" &&
                                <View style={{height: height / 6 , backgroundColor: "#fff", justifyContent: "center"}}>
                                    <TouchableOpacity
                                        onPress={editBannerImg}
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
                                        <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>??????</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </>
                    }
                </View>
            }
            {warn !== "" &&
                <View style={{ position: "absolute", top: height * 0.4, right: width * 0.05, height: height * 0.1, width: width * 0.8, backgroundColor: "#fff", borderRadius: width * 0.03, justifyContent: "center", alignItems: "center"}}>
                    <View style={{flex: 1, justifyContent: "center", alignItems: "center", margin: "5%"}}>
                        <Text style={{fontSize: RFPercentage(1.7), fontWeight: '800', color: "#EF4452"}}>{warn}</Text>
                    </View>
                </View>
            }
            {linkWarn &&
                <View style={{ position: "absolute", top: height * 0.4, right: width * 0.05, height: height * 0.31, width: width * 0.8, backgroundColor: "#fff", borderRadius: width * 0.03, justifyContent: "center", alignItems: "center"}}>
                    <View style={{height: height * 0.03, width}} />
                    <View style={{height: height * 0.04, marginLeft: "5%", justifyContent: "center"}}>
                        <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>?????? ?????? ????????? ??????????????????</Text>
                    </View>
                    <View style={{height: height * 0.15, marginLeft: "5%", justifyContent: "center"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>?????? ???????????? ?????????????????????????</Text>
                    </View>
                    <View style={{height: height * 0.09, flexDirection: "row", justifyContent: "center"}}>
                        <TouchableOpacity onPress={settingModalCancel} style={{height: "70%", width: "42%", backgroundColor: "#EF4452", marginRight: "5%", borderRadius: 5, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#fff"}}>??????</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={settingModalMove} style={{height: "70%", width: "42%", backgroundColor: "#6490E7", borderRadius: 5, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#fff"}}>??????</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
        </>
    )
}

export const StampSwitchToggle = ({ onToggle, isOn }) => {
    const [aniValue] = useState(new Animated.Value(0));
    const color = isOn ? "#617BE3" : "#F45552";

    const moveSwitchToggle = aniValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width * 0.1],
    });

    Animated.timing(aniValue, {
        toValue: isOn ? 1 : 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
    }).start();

    return (
        <View style={{flexDirection: "row", alignItems: "center"}}>
            <TouchableOpacity onPress={onToggle}>
                <View style={{ width: width * 0.15, height: height * 0.015, paddingLeft: 2, borderRadius: 15, justifyContent: "center",backgroundColor: color }}>
                    <Animated.View 
                        style={{ 
                            transform: [{ translateX: moveSwitchToggle }],
                            width: width * 0.05,
                            height: width * 0.05,
                            backgroundColor: "#fff",
                            borderRadius: width,
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.2,
                            shadowRadius: 2.5,
                            elevation: 1.5
                        }}
                    />
                </View>
            </TouchableOpacity>
        </View>
    )
}

export const ComEditWarnningStamp = ({ fnClose }) => {

    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "0%",
                marginTop: width * 0.1,
                width: width * 0.9,
                height: height * 0.26, 
                backgroundColor: "#fff",
                borderRadius: width * 0.02, 
            }}
        >
            <View style={{height: height * 0.02, justifyContent: "center", alignItems: "center"}} />
            <View style={{height: height * 0.07, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>????????? ?????? ??????</Text>
            </View>
            <View style={{height: height * 0.08, justifyContent: "flex-start", alignItems: "center", marginLeft: "5%", marginRight: "5%"}}>
                <Text style={{fontSize: RFPercentage(1.7), fontWeight: '600', color: "#4E5867"}}>
                ?????? ???????????? ????????? ?????????????????? ?????? ?????? ?????? ????????? ???????????????.
                </Text>
            </View>
            <View style={{height: height * 0.09, justifyContent: "flex-start", alignItems: "center" }}>
                <TouchableOpacity onPress={close} style={{height: "70%", width: "90%", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#E1E2E3", borderRadius: 10}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>??????</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const ComDeleteStamp = ({fnClose,fnDeleteStamp}) => {

    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    const confirm = async () => {
        if(fnDeleteStamp !== undefined && typeof fnDeleteStamp === "function"){
            await fnDeleteStamp();
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "0%",
                marginTop: width * 0.1,
                width: width * 0.9,
                height: height * 0.25, 
                backgroundColor: "#fff",
                borderRadius: width * 0.02, 
            }}
        >
            <View style={{height: height * 0.02, justifyContent: "center", alignItems: "center"}} />
            <View style={{height: height * 0.05, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>?????? ?????? ??????</Text>
            </View>
            <View style={{height: height * 0.08, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(1.7), fontWeight: '600', color: "#4E5867"}}>?????? ?????? ?????? ????????? ????????? ???????????????</Text>
                <Text style={{fontSize: RFPercentage(1.7), fontWeight: '600', color: "#4E5867", marginTop: "1%"}}>???????????? ????????? ?????? ?????? ???????????? ???????????????.</Text>
                <Text style={{fontSize: RFPercentage(1.7), fontWeight: '600', color: "#4E5867", marginTop: "1%"}}>??????????????? ??????????????? ?????????????????????????</Text>
            </View>
            <View style={{height: height * 0.1, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                <TouchableOpacity onPress={confirm} style={{height: "65%", width: "42%", justifyContent: "center", alignItems: "center", backgroundColor: "#F2F3F5", marginRight: "5%", borderRadius: 10}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>???</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={close} style={{height: "65%", width: "42%", justifyContent: "center", alignItems: "center", backgroundColor: "#EF4452", borderRadius: 10}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#fff"}}>?????????</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const CompModalInventory = ({ fnComplete, fnCancel, sData, iProps }) => {
    const [loading, setLoading] = useState(false);

    const [status, setStatus] = useState("limit");
    const [sEditable, setEditable] = useState(true);
    const [sNm, setNm] = useState("");
    const [errText, setErrText] = useState("#F1F3F7");

    const [textInputType, setTextInputType] = useState("");

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const onKeyboardDidShow = (e) => {
        setKeyboardHeight(e.endCoordinates.height);
    }

    const onChangeNm = text => {
        const sTemp = text;
        const regex = /[0-9]+$/gi;
        if(sTemp === "" || sTemp === null){
            setNm(text);
            setErrText("#F1F3F7");
        } else {
            if (regex.test(sTemp)) {
                setNm(text);
                setErrText("#F1F3F7");
            } else {
                setErrText("#EF4452");
            }
        }
    };
    
    const activeNmText = () => {
        setErrText("#F1F3F7");
        setTextInputType("nm");
    }
    
    const unactiveNmText = () => {
        setTextInputType("");
        Keyboard.dismiss();
    }

    const onChangeStatus = (sIndex) => {
        if(sIndex === "limit"){
            setNm("");
            setEditable(true);
            setStatus(sIndex);
        } else {
            setNm("?????????");
            setEditable(false);
            setStatus(sIndex);
        }
    };

    const complete = async () => {
        setLoading(true);
        
        if(sNm !== ""){
            let iParam = "";
            if(status === "limit"){
                iParam = parseInt(sNm);
            } else {
                iParam = status;
            }
            const oData = {
                sParam : iParam,
                product_id : parseInt(sData.id),
            }
            const oResponse = await iProps.appManager.accessAxios("/app/ceo/store/inventory/edit", "post", null, oData);
            if(oResponse !== undefined){
                if(oResponse){
                    if(fnComplete !== undefined && typeof fnComplete === "function"){
                        await fnComplete();
                    }
                }
            }
        } else {
            setErrText("#EF4452");
        }

        setLoading(false);
    }

    const cancel = async () => {
        if(fnCancel !== undefined && typeof fnCancel === "function"){
            await fnCancel();
        }
    }

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    }, []);

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: height * 0.2,
                width: width,
                height: height * 0.8, 
                backgroundColor: "#fff",
                borderRadius: width * 0.03, 
            }}
        >
            {loading ?
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
                :
                <>
                    <View style={{flex:1}}>
                        <View style={{height: height * 0.02, justifyContent: "center", alignItems: "center"}} />
                        <View style={{height: height * 0.05, justifyContent: "center", marginLeft: "5%"}}>
                            <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>????????????</Text>
                        </View>
                        <View style={{height: height * 0.13, width, justifyContent: "center", marginLeft: "5%"}}>
                            <TouchableOpacity onPress={() => onChangeStatus("limit")} style={{height: height * 0.05, width, alignItems: "center", flexDirection: "row"}}>
                                {status === "limit" ?
                                    <ComponentSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                :
                                    <ComponentUnSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                }
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#333D4B", marginLeft: "2%" }}> ????????????</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onChangeStatus("unlimit")} style={{height: height * 0.05, width, alignItems: "center", flexDirection: "row"}}>
                                {status === "limit" ?
                                    <ComponentUnSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                :
                                    <ComponentSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                }
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#333D4B", marginLeft: "2%" }}> ?????????</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{height : height * 0.08, justifyContent: "center", alignItems: "center"}}>
                            <TextInput
                                placeholder="??????????????? ??????????????????"
                                placeholderTextColor="#A1A1A1"
                                returnKeyType="done"
                                keyboardType="numeric"
                                editable={sEditable}
                                onChangeText={text => onChangeNm(text)}
                                onFocus={() => activeNmText()}
                                onBlur={() => unactiveNmText()}
                                onSubmitEditing={() => unactiveNmText()}
                                value={sNm}
                                style={{
                                    width: "90%",
                                    height: height * 0.06,
                                    fontSize: RFPercentage(2),
                                    fontWeight: '600',
                                    backgroundColor: '#F1F3F7',
                                    paddingLeft: "5%",
                                    borderColor: errText,
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    color: "#000"
                                }}
                            />
                            <View style={{height: height* 0.07, width: height* 0.1, position: "absolute", bottom: height * 0.005, right: width * 0.07, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#333D4B" }}>???</Text>
                            </View>
                        </View>
                    </View>
                    {textInputType === "nm" &&
                        <TouchableOpacity activeOpacity={0.8} onPress={() => unactiveNmText()} style={{ width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.165, zIndex: 90}}>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>??????</Text>
                        </TouchableOpacity>
                    }
                    {textInputType === "" &&
                        <View style={{height: height * 0.2, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                            <TouchableOpacity onPress={complete} style={{height: height * 0.07, width: "42%", justifyContent: "center", alignItems: "center", backgroundColor: "#F2F3F5", marginRight: "5%", borderRadius: 10}}>
                                <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>????????????</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={cancel} style={{height: height * 0.07, width: "42%", justifyContent: "center", alignItems: "center", backgroundColor: "#EF4452", borderRadius: 10}}>
                                <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#fff"}}>??????</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </>
            }
        </View>
    )
}

export const ComConfirmStamp = ({ fnClose, fnInsert, sData, iProps, sTitle}) => {
    const [loading, setLoading] = useState(false);

    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    const insert = async () => {
        setLoading(true);

        const oData = sData;

        if(sTitle === "edit"){
            const oResponse = await iProps.appManager.accessAxios("/app/ceo/stamp/edit", "post", null, oData);
            if(oResponse !== undefined){
                if(oResponse.resultCd === "0000"){
                    if(fnInsert !== undefined && typeof fnInsert === "function"){
                        await fnInsert();
                    }
                }
            }
        } else {
            const oResponse = await iProps.appManager.accessAxios("/app/ceo/stamp/insert", "post", null, oData);
            if(oResponse !== undefined){
                if(oResponse.resultCd === "0000"){
                    if(fnInsert !== undefined && typeof fnInsert === "function"){
                        await fnInsert();
                    }
                }
            }
        }
        setLoading(false);
    }

    return (
        <View 
            style={{
                marginHorizontal: "0%",
                marginTop: width * 0.1,
                width: width * 0.9,
                height: height * 0.5, 
                backgroundColor: "#fff",
                borderRadius: width * 0.02, 
            }}
        >
            {loading ?
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            :
                <>
                    <View style={{height: height * 0.1, justifyContent: "center", marginLeft: "5%"}}>
                        <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>{ sTitle === "edit" ? "????????? ??????" : "????????? ??????" }</Text>
                    </View>
                    <View style={{height: height * 0.03, justifyContent: "center", marginLeft: "5%"}}>
                        <Text style={{fontSize: RFPercentage(1.8), fontWeight: '800', color: "#000"}}>????????? ?????? : {sData.nm}</Text>
                    </View>
                    <View style={{height: height * 0.03, justifyContent: "center", marginLeft: "5%"}}>
                        <Text style={{fontSize: RFPercentage(1.8), fontWeight: '800', color: "#000"}}>????????? ????????? : {sData.targetValue} ???</Text>
                    </View>
                    <View style={{height: height * 0.03, justifyContent: "center", marginLeft: "5%"}}>
                        <Text style={{fontSize: RFPercentage(1.8), fontWeight: '800', color: "#000"}}>????????? ???????????? : {sData.minAmount} ???</Text>
                    </View>
                    <View style={{height: height * 0.03, justifyContent: "center", marginLeft: "5%"}}>
                        <Text style={{fontSize: RFPercentage(1.8), fontWeight: '800', color: "#000"}}>????????? ???????????? ????????? ?????? : {sData.partnerDiscount} ???</Text>
                    </View>
                    <View style={{height: height * 0.03, justifyContent: "center", marginLeft: "5%"}}>
                        <Text style={{fontSize: RFPercentage(1.8), fontWeight: '800', color: "#000"}}>????????? ????????? ?????? : {sData.periodNm}</Text>
                    </View>
                    <View style={{height: height * 0.14, justifyContent: "center", marginLeft: "5%", marginRight: "5%"}}>
                        <Text style={{fontSize: RFPercentage(1.8), fontWeight: '800', color: "#F45552"}}>??? ?????? ????????? ?????? ?????? ??????????????????.</Text>
                        <Text style={{fontSize: RFPercentage(1.8), fontWeight: '800', color: "#F45552"}}>???????????? ?????? ???????????? ?????? ????????? ?????? ??? ??????????????? ?????? ???????????????.(?????? ?????? ????????? ???????????? ??????)</Text>
                    </View>
                    <View style={{height: height * 0.1, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                        <TouchableOpacity onPress={insert} style={{height: "65%", width: "42%", justifyContent: "center", alignItems: "center", backgroundColor: "#F2F3F5", marginRight: "5%", borderRadius: 10}}>
                            <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>???</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={close} style={{height: "65%", width: "42%", justifyContent: "center", alignItems: "center", backgroundColor: "#EF4452", borderRadius: 10}}>
                            <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#fff"}}>?????????</Text>
                        </TouchableOpacity>
                    </View>
                </>
            }

        </View>
    )
}

export const CompModalEventStampDetail = ({fnClose}) => {

    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "0%",
                width: width * 0.9,
                height: height * 0.65, 
                backgroundColor: "#fff",
                borderRadius: width * 0.03, 
            }}
        >
            <View style={{height: height * 0.02 }}/>
            <View style={{height: height * 0.07, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>????????? ??????</Text>
            </View>
            <View style={{flex:1}}>
                <Image source={stampEventImg} style={{ width: "100%", height: "90%", resizeMode: "contain"}}/>
            </View>
            <View style={{height: height * 0.1, width: "100%", justifyContent: "flex-start", alignItems: "center"}}>
                <TouchableOpacity onPress={close} style={{height: height * 0.07, borderWidth: 1, borderColor: "#E1E2E3", width: "90%", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>??????</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const CompModalEventCouponDetail = ({fnClose}) => {

    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "0%",
                width: width * 0.9,
                height: height * 0.65, 
                backgroundColor: "#fff",
                borderRadius: width * 0.03, 
            }}
        >
            <View style={{height: height * 0.02 }}/>
            <View style={{height: height * 0.07, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>?????? ??????</Text>
            </View>
            <View style={{flex:1}}>
                <Image source={couponEventImg} style={{ width: "100%", height: "90%", resizeMode: "contain"}}/>
            </View>
            <View style={{height: height * 0.1, width: "100%", justifyContent: "flex-start", alignItems: "center"}}>
                <TouchableOpacity onPress={close} style={{height: height * 0.07, borderWidth: 1, borderColor: "#E1E2E3", width: "90%", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>??????</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const CompModalCustomerClosed = ({fnClose}) => {

    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "0%",
                width: width * 0.9,
                height: height * 0.3, 
                backgroundColor: "#fff",
                borderRadius: width * 0.03, 
            }}
        >
            <View style={{height: height * 0.1, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(2.3), fontWeight: '800', color: "#000"}}>???????????? ????????? ???????????????!</Text>
            </View>
            <View style={{height: height * 0.08, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(1.8), fontWeight: '600', color: "#000", marginBottom: "2%"}}>?????? ??? ????????????</Text>
                <Text style={{fontSize: RFPercentage(1.8), fontWeight: '600', color: "#000"}}>????????? ???????????????!</Text>
            </View>
            <View style={{height: height * 0.1, width: "100%", justifyContent: "center", alignItems: "center"}}>
                <TouchableOpacity onPress={close} style={{height: height * 0.06, borderWidth: 1, borderColor: "#E1E2E3", width: "90%", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>??????</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const CompModalCustomerArrived = ({fnClose}) => {

    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "0%",
                width: width * 0.9,
                height: height * 0.3, 
                backgroundColor: "#fff",
                borderRadius: width * 0.03, 
            }}
        >
            <View style={{height: height * 0.1, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(2.3), fontWeight: '800', color: "#000"}}>???????????? ????????? ??????????????????!</Text>
            </View>
            <View style={{height: height * 0.08, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(1.8), fontWeight: '600', color: "#000", marginBottom: "2%"}}>???????????? ?????????</Text>
                <Text style={{fontSize: RFPercentage(1.8), fontWeight: '600', color: "#000"}}>?????????????????? ????????? ??????????????????.</Text>
            </View>
            <View style={{height: height * 0.1, width: "100%", justifyContent: "center", alignItems: "center"}}>
                <TouchableOpacity onPress={close} style={{height: height * 0.06, borderWidth: 1, borderColor: "#E1E2E3", width: "90%", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>??????</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const CompModalOrderCancelContent = ({ fnHide, fnCancel, sOrderId, iProps, sItem }) => {
    const [state, setState] = useState("0");

    const [selectId, setSetselectIdNm] = useState("none");

    const [cNm, setNm] = useState("");

    const onChangeNm = text => {
        setNm(text);
    };

    const activeNmText = () => {
        setSetselectIdNm("null");
    }
    
    const unactiveNmText = () => {
        Keyboard.dismiss();
    }

    const onChange = async () => {
        if(fnHide !== undefined && typeof fnHide === "function"){
            await fnHide();
        }
    }

    const cancelOrderStatus = async (sItext) => {
        if(fnCancel !== undefined && typeof fnCancel === "function"){
            await fnCancel(sOrderId,sItext,sItem);
        }
    }

    const cancelOrder = async () => {
        let temp = "";
        let process1 = false;
        if(selectId === "none"){
            process1 = true;
            temp = "????????? ???????????? ????????? ????????? ????????????.";
        } else if (selectId === "eplode") {
            process1 = true;
            temp = "??????????????? ????????? ?????? ????????? ???????????????.";
        } else if (selectId === "cancel") {
            process1 = true;
            temp = "?????? ????????? ????????? ?????????????????????.";
        } else if (selectId === "null") {
            if(cNm === ""){
                process1 = false;
            } else {
                process1 = true;
                temp = cNm;
            }
        }

        if(process1){
            unactiveNmText();
            cancelOrderStatus(temp);
        }
    }

    return (
        <>
            {state === "1" ?
                <View 
                    style={{
                        marginHorizontal: "0%",
                        width: width * 0.9,
                        height: height * 0.47, 
                        backgroundColor: "#fff",
                        borderRadius: width * 0.02, 
                    }}
                >
                    <View style={{height: height * 0.1, justifyContent: "center", marginLeft: "5%"}}>
                        <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>??????????????? ??????????????????</Text>
                    </View>
                    <View style={{height: height * 0.23, justifyContent: "space-between", alignItems: "center"}}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setSetselectIdNm("none")} style={{ height: height * 0.05, width: "90%", alignItems: "center", flexDirection: "row", paddingLeft: "1%"}}>
                            {selectId === "none" ?
                                <ComponentSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                            :
                                <ComponentUnSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                            }
                            <Text style={{fontSize: RFPercentage(1.8), fontWeight: '500', color: "#000", marginLeft: "5%"}}>????????? ????????? ????????? ????????????.</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setSetselectIdNm("eplode")} style={{ height: height * 0.05, width: "90%", alignItems: "center", flexDirection: "row", paddingLeft: "1%"}}>
                            {selectId === "eplode" ?
                                <ComponentSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                            :
                                <ComponentUnSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                            }
                            <Text style={{fontSize: RFPercentage(1.8), fontWeight: '500', color: "#000", marginLeft: "5%"}}>??????????????? ????????? ?????? ????????? ???????????????.</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setSetselectIdNm("cancel")} style={{ height: height * 0.05, width: "90%", alignItems: "center", flexDirection: "row", paddingLeft: "1%"}}>
                            {selectId === "cancel" ?
                                <ComponentSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                            :
                                <ComponentUnSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                            }
                            <Text style={{fontSize: RFPercentage(1.8), fontWeight: '500', color: "#000", marginLeft: "5%"}}>?????? ????????? ????????? ?????????????????????.</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setSetselectIdNm("null")} style={{ height: height * 0.05, width: "90%", alignItems: "center", flexDirection: "row", paddingLeft: "1%"}}>
                            {selectId === "null" ?
                                <ComponentSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                            :
                                <ComponentUnSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                            }
                            <TextInput
                                placeholder="????????????"
                                placeholderTextColor="#000"
                                returnKeyType="done"
                                onChangeText={text => onChangeNm(text)}
                                onFocus={() => activeNmText()}
                                onBlur={() => unactiveNmText()}
                                onSubmitEditing={() => cancelOrder()}
                                value={cNm}
                                style={{
                                    height: "100%", width: "80%", borderBottomColor: "#DFDFE3", marginLeft: "5%", borderBottomWidth: 1
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: height * 0.12, justifyContent: "flex-end"}}>
                        <TouchableOpacity
                            onPress={() => cancelOrder()}
                            style={{
                                height: height / 18,
                                backgroundColor: '#6490E7',
                                marginLeft: '7%',
                                marginRight: '7%',
                                borderRadius: 8,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>????????????</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            :
                <View 
                    style={{
                        marginHorizontal: "0%",
                        marginTop: width * 0.1,
                        width: width * 0.9,
                        height: height * 0.32, 
                        backgroundColor: "#fff",
                        borderRadius: width * 0.02, 
                    }}
                >
                    <View style={{height: height * 0.1, justifyContent: "center", marginLeft: "5%"}}>
                        <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>????????????</Text>
                    </View>
                    <View style={{height: height * 0.08, justifyContent: "center", marginLeft: "5%"}}>
                        <Text style={{  fontSize: RFPercentage(1.8), color: "#000", fontWeight: '600', marginBottom: "2%" }}>
                            <Text style={{  fontSize: RFPercentage(1.8), color: "#EF4452", fontWeight: '600'}}>
                                ?????? ??????
                            </Text>
                            ??? ??????????????? ????????? ????????? ????????????, 
                        </Text>
                        <Text style={{  fontSize: RFPercentage(1.8), color: "#000", fontWeight: '600', marginBottom: "2%" }}>
                            <Text style={{  fontSize: RFPercentage(1.8), color: "#EF4452", fontWeight: '600' }}>
                                ???????????? ????????????
                            </Text>
                            ??? ???????????? ????????? ??? ????????????. ??????
                        </Text>
                        <Text style={{  fontSize: RFPercentage(1.8), color: "#000", fontWeight: '600', marginBottom: "2%" }}>
                            <Text style={{  fontSize: RFPercentage(1.8), color: "#EF4452", fontWeight: '600' }}>
                                ??????
                            </Text>
                            ??????????????????? 
                        </Text>
                    </View>
                    <View style={{height: height * 0.12, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setState("1")} style={{height: "50%", width: "42%", justifyContent: "center", alignItems: "center", backgroundColor: "#F2F3F5", marginRight: "5%", borderRadius: 10}}>
                            <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>???</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onChange} style={{height: "50%", width: "42%", justifyContent: "center", alignItems: "center", backgroundColor: "#EF4452", borderRadius: 10}}>
                            <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#fff"}}>?????????</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
        </>
    )
}

export const CompModalCheckPickUp = ({ fnAgree, fnCancel }) => {

    const agree = async () => {
        if(fnAgree !== undefined && typeof fnAgree === "function"){
            await fnAgree();
        }
    }

    const cancel = async () => {
        if(fnCancel !== undefined && typeof fnCancel === "function"){
            await fnCancel();
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "0%",
                marginTop: width * 0.1,
                width: width * 0.9,
                height: height * 0.3, 
                backgroundColor: "#fff",
                borderRadius: width * 0.02, 
            }}
        >
            <View style={{height: height * 0.1, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>?????? ??????????????????!</Text>
            </View>
            <View style={{height: height * 0.08, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{  fontSize: RFPercentage(1.8), color: "#000", fontWeight: '600', marginBottom: "2%" }}>
                    ???????????? ????????? ???????????????????
                </Text>
                <Text style={{  fontSize: RFPercentage(1.8), color: "#000", fontWeight: '600', marginBottom: "2%" }}>
                    ?????????????????? ?????? ????????????????????? ??? ??? ????????????. 
                </Text>
            </View>
            <View style={{height: height * 0.12, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                <TouchableOpacity activeOpacity={0.8} onPress={cancel} style={{height: "50%", width: "42%", justifyContent: "center", alignItems: "center", backgroundColor: "#F2F3F5", marginRight: "5%", borderRadius: 10}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>?????????</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={agree} style={{height: "50%", width: "42%", justifyContent: "center", alignItems: "center", backgroundColor: "#EF4452", borderRadius: 10}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#fff"}}>???</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}