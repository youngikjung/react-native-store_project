import React, { useState, useRef, useEffect } from 'react';
import { 
    View, 
    Text, 
    Dimensions, 
    TouchableOpacity, 
    Platform,
    Animated,
    StatusBar,
    AppState,
    Linking,
    ScrollView,
} from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import Svg, { Polygon } from 'react-native-svg';
import {RFPercentage} from 'react-native-responsive-fontsize';
import VersionCheck from "react-native-version-check";
import { checkNotifications } from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';

import { ComponentDelete } from '../../assets/svg/delete';
import { ComponentBookMark } from '../../assets/svg/bookmark';
import { ComponentCreditCard } from '../../assets/svg/creditCard';
import { ComponentFile } from '../../assets/svg/file';
import { ComponentSetting } from '../../assets/svg/setting';
import { ComponentSidebar } from '../../assets/svg/sidebar';
import { ComponentHome } from '../../assets/svg/home';
import { ComponentPrinter } from '../../assets/svg/printer';

import { SwitchToggle, VolumeSwitchToggle, CompCheckPage } from '../../components/modal/AppModalContent';

import { AppRoute } from '../../routes/AppRoutes';

const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);
const STATUS_BAR_HEIGHT = StatusBar.currentHeight;
const { width, height } = Dimensions.get('window');

const Home = ({sProps, fnAimation, fnAnimateMove, sFromCoords}) => {
    const [togle, setTogle] = useState(true);
    const [sVolume, setVolume] = useState(true);

    const appState = useRef(AppState.currentState);
    const polygonRef = useRef();
    
    const opacity = fnAimation.x.interpolate({
        inputRange: [0, width],
        outputRange: [0, 1],
    });

    const translateX = fnAimation.x.interpolate({
        inputRange: [0, width],
        outputRange: [-50, 0],
    });

    const animateMove = async () => {
        if(fnAnimateMove !== undefined && typeof fnAnimateMove === "function"){
            await fnAnimateMove();
        }
    }

    const handleToggle = async () => {
        let oData = {
            uniqueId: sProps.UserConfigReducer.uniqueId,
            storeId: sProps.UserConfigReducer.StoreID,
        }
        let sToken = "";

        if(!togle){
            const authorizationStatus = await messaging().requestPermission();
            if(authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED){
                let process = false;
                if(Platform.OS === "android"){
                    await checkNotifications().then(async ({ status, settings }) => {
                        if (status === "granted") {
                            process = true;
                        } else {
                            process = false;
                        }
                    });
                } else {
                    process = true;
                }

                if(process){
                    let oUserConfig = {};
                    oUserConfig['AppPushStatus'] = true;
                    await messaging().registerDeviceForRemoteMessages();
                    sToken = await messaging().getToken();
                    if(sToken === sProps.UserConfigReducer.UserPushToken){
                        sToken = sProps.UserConfigReducer.UserPushToken;
                    }

                    oData = {
                        uniqueId: sProps.UserConfigReducer.uniqueId,
                        token : sToken,
                        storeId: sProps.UserConfigReducer.StoreID,
                    }
                    const res = await sProps.appManager.accessAxios("/app/ceo/insertPushToken/v2", "post", null, oData);
                    if(res !== undefined && res !== null){
                        if(res){
                            await sProps.reduxSetUserConfig(oUserConfig);
                            setTogle(true);
                        }
                    }
                } else {
                    Linking.openSettings();
                }
            } else {
                Linking.openSettings();
            }
        } else {
            let oUserConfig = {};
            oUserConfig['AppPushStatus'] = false;
            const res = await sProps.appManager.accessAxios("/app/ceo/deletePushToken/v2", "post", null, oData);
            if(res !== undefined && res !== null){
                if(res){
                    await sProps.reduxSetUserConfig(oUserConfig);
                    setTogle(false);
                }
            }
        }
    }

    const handleLogout = async () => {
        const oData = {
            uniqueId: sProps.UserConfigReducer.uniqueId,
            storeId: sProps.UserConfigReducer.StoreID,
        }
        await sProps.appManager.setLogOut();
        await sProps.appManager.accessAxios("/app/ceo/deletePushToken/v2", "post", null, oData);
        await sProps.appManager.hideModal();
        sProps.appManager.navGoTo('reset', AppRoute.MAIN);
    };

    const handleVolume = async () => {
        setVolume(!sVolume);
        let oUserConfig = {};
        oUserConfig['QUITSOUND'] = !sVolume;
        await sProps.reduxSetUserConfig(oUserConfig);
    }

    const componentLogout = () => {
        sProps.appManager.showModal(
            true,
            <CompCheckPage 
                fnAgree={() => handleLogout()}
                fnCancel={() => sProps.appManager.hideModal()}
            />, 
            "custom"
        );
    };

    const moveRegisterRoute = async (aIndex,sIndex) => {
        if(sIndex === "메뉴그룹 설정하기"){
            sProps.appManager.navGoTo('push', aIndex, {  sParam: "home", iParam: "category" } );
        } else if (sIndex === "메뉴 설정하기"){
            sProps.appManager.navGoTo('push', aIndex, {  sParam: "home", iParam: "menu" } );
        } else if (sIndex === "옵션 설정하기"){
            sProps.appManager.navGoTo('push', aIndex, {  sParam: "home", iParam: "option" } );
        } else if (sIndex === "대표메뉴 설정하기"){
            sProps.appManager.navGoTo('push', aIndex, {  sParam: "home", iParam: "main" } );
        } else {
            sProps.appManager.navGoTo('push', aIndex, {  sParam: "home" } );
        }
    }

    const onChangeMenu = async (sIndex,aIndex,kIndex) => {
        let process = true;
        let oText = sProps.UserConfigReducer.BOOKMARKONE;
        let tText = sProps.UserConfigReducer.BOOKMARKTWO;
        let lText = sProps.UserConfigReducer.BOOKMARKTHREE;
        let oCount = sProps.UserConfigReducer.BOOKMARKCOUNTONE;
        let tCount = sProps.UserConfigReducer.BOOKMARKCOUNTTWO;
        let lCount = sProps.UserConfigReducer.BOOKMARKCOUNTTHREE;
        let oRoute = sProps.UserConfigReducer.BOOKMARKROUTEONE;
        let tRoute = sProps.UserConfigReducer.BOOKMARKROUTETWO;
        let lRoute = sProps.UserConfigReducer.BOOKMARKROUTETHREE;
        if (sProps.UserConfigReducer.BOOKMARKONE === "") {
            oText = sIndex;
            oRoute = aIndex;
            oCount = oCount + 1;
        } else if (sProps.UserConfigReducer.BOOKMARKTWO === "") {
            tText = sIndex;
            tRoute = aIndex;
            tCount = tCount + 1;
        } else if (sProps.UserConfigReducer.BOOKMARKTHREE === "") {
            lText = sIndex;
            lRoute = aIndex;
            lCount = lCount + 1;
        } else {
            if (parseInt(sProps.UserConfigReducer.BOOKMARKCOUNTONE) > parseInt(sProps.UserConfigReducer.BOOKMARKCOUNTTWO)) {
                tText = sIndex;
                tRoute = aIndex;
                tCount = tCount + 1;
            } else if (parseInt(sProps.UserConfigReducer.BOOKMARKCOUNTTWO) >  parseInt(sProps.UserConfigReducer.BOOKMARKCOUNTTHREE)) {
                lText = sIndex;
                lRoute = aIndex;
                lCount = lCount + 1;
            } else {
                oText = sIndex;
                oRoute = aIndex;
                oCount = oCount + 1;
            }
            
            if(sProps.UserConfigReducer.BOOKMARKONE === sIndex){
                process = false;
            } else if (sProps.UserConfigReducer.BOOKMARKTWO === sIndex) {
                process = false;
            } else if (sProps.UserConfigReducer.BOOKMARKTHREE === sIndex) {
                process = false;
            } else {
                process = true;
            }
        }

        if(process){
            let oUserConfig = {};
            oUserConfig['BOOKMARKONE'] = oText;
            oUserConfig['BOOKMARKTWO'] = tText;
            oUserConfig['BOOKMARKTHREE'] = lText;
            oUserConfig['BOOKMARKCOUNTONE'] = oCount;
            oUserConfig['BOOKMARKCOUNTTWO'] = tCount;
            oUserConfig['BOOKMARKCOUNTTHREE'] = lCount;
            oUserConfig['BOOKMARKROUTEONE'] = oRoute;
            oUserConfig['BOOKMARKROUTETWO'] = tRoute;
            oUserConfig['BOOKMARKROUTETHREE'] = lRoute;
            await sProps.reduxSetUserConfig(oUserConfig);
        }

        if(kIndex !== undefined && kIndex !== null){
            sProps.appManager.navGoTo('push', aIndex, { sParam: "home", iParam: kIndex } );
        } else {
            sProps.appManager.navGoTo('push', aIndex, { sParam: "home" } );
        }
    }

    const appPushToken = async (sIndex) => {
        let oData = {
            uniqueId: sProps.UserConfigReducer.uniqueId,
            store_id : sProps.UserConfigReducer.StoreID
        }
        const res = await sProps.appManager.accessAxios("/app/ceo/checkupPushToken/v2", "post", null, oData);
        if(res !== undefined && res !== null){
            if(res){
                oData = {
                    uniqueId: sProps.UserConfigReducer.uniqueId,
                    token : sIndex,
                }
                const oResponse = await sProps.appManager.accessAxios("/app/ceo/updatePushToken/v2", "post", null, oData);
                if (oResponse !== undefined && oResponse !== null) {
                    if (oResponse) {
                        let oUserConfig = {};
                        oUserConfig['UserPushToken'] = sIndex;
                        oUserConfig['AppPushStatus'] = true;
                        await sProps.reduxSetUserConfig(oUserConfig);
                        setTogle(true);
                    }
                }
            } else {
                setTogle(false);
            }
        }
    }

    const checkMessagePermission = async () => {
        if(sProps.UserConfigReducer.AppPushStatus){
            const authorizationStatus = await messaging().requestPermission();
            if(authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED){
                let process = false;
                if(Platform.OS === "android"){
                    await checkNotifications().then(async ({ status, settings }) => {
                        if (status === "granted") {
                            process = true;
                        } else {
                            process = false;
                        }
                    });
                } else {
                    process = true;
                }
    
                if(process){
                    await messaging().registerDeviceForRemoteMessages();
                    let sToken = await messaging().getToken();
                    if(sToken === sProps.UserConfigReducer.UserPushToken){
                        sToken = sProps.UserConfigReducer.UserPushToken;
                    }
                    appPushToken(sToken);
                } else {
                    setTogle(false);
                }
            } else {
                setTogle(false);
            }
        } else {
            setTogle(false);
        }
        setVolume(sProps.UserConfigReducer.QUITSOUND);
    }

    useEffect(() => {
        const listener = fnAimation.addListener((v) => {
            if (polygonRef?.current) {
                polygonRef.current.setNativeProps({
                    points: `0,0 ${v.x}, ${v.y} ${width}, ${height} 0, ${height}`,
                });
            }
        });

        return () => {
            fnAimation.removeListener(listener);
        };
    });

    useEffect(() => {
        checkMessagePermission();
    }, []);

    useEffect(() => {
        const subscription = AppState.addEventListener("change", nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === "active") {
                animateMove();
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <MaskedView
            style={{flex: 1, backgroundColor: "#fff"}}
            maskElement={
                <Svg
                    width={width}
                    height={height}
                    viewBox={`0 0 ${width} ${height}`}
                    style={{ backgroundColor: 'transparent' }}
                >
                    <AnimatedPolygon ref={polygonRef} points={`0,0 ${sFromCoords.x}, ${sFromCoords.y} ${width}, ${height} 0, ${height}`} fill='blue' />
                </Svg>
            }
        >
            <Animated.View style={{ flex:1, opacity, transform: [{ translateX }]}}>
                <View style={{height: height * 0.08, flexDirection: "row"}}>
                    <View style={{flex: 0.8, justifyContent: "center", alignItems: "flex-end", flexDirection: "row"}} />
                    <View style={{flex: 0.2, justifyContent: "flex-end", alignItems: "center"}}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => animateMove()}  style={{height: height * 0.045, width: height * 0.045, justifyContent: "center", alignItems: "center" }}>
                            <ComponentDelete iHeight={height * 0.03} iWidth={height * 0.06} />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView 
                    style={{flex: 1, marginBottom: "5%", marginTop: "5%"}}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    
                    <View style={{height: height * 0.02}} />

                    <View style={{height: height * 0.071, width, justifyContent: "center", alignItems: "center"}}>
                        <View style={{height: height * 0.05, width: width * 0.9,  alignItems: "center", flexDirection: "row"}}>
                            <ComponentBookMark iHeight={height * 0.025} iWidth={height * 0.06} />
                            <Text style={{fontWeight: "700", fontSize: RFPercentage(2), color: "#191F28"}}>자주 찾는 메뉴</Text>
                        </View>
                        <View style={{ height: height * 0.001, width: width * 0.9, backgroundColor: "#191F28"}}/>
                        <View style={{ height: height * 0.02}}/>
                    </View>
                    {sProps.UserConfigReducer.BOOKMARKONE !== "" &&
                        <View style={{height: height * 0.06, width, justifyContent: "center", alignItems: "center"}}>
                            <TouchableOpacity onPress={() => moveRegisterRoute(sProps.UserConfigReducer.BOOKMARKROUTEONE,sProps.UserConfigReducer.BOOKMARKONE)} style={{height: height * 0.05, width: width * 0.9, borderRadius: 10, justifyContent: "center", paddingLeft: "5%"}}>
                                <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>{sProps.UserConfigReducer.BOOKMARKONE}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {sProps.UserConfigReducer.BOOKMARKTWO !== "" &&
                        <View style={{height: height * 0.06, width, justifyContent: "center", alignItems: "center"}}>
                            <TouchableOpacity onPress={() => moveRegisterRoute(sProps.UserConfigReducer.BOOKMARKROUTETWO,sProps.UserConfigReducer.BOOKMARKTWO)} style={{height: height * 0.05, width: width * 0.9, borderRadius: 10, justifyContent: "center", paddingLeft: "5%"}}>
                                <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>{sProps.UserConfigReducer.BOOKMARKTWO}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {sProps.UserConfigReducer.BOOKMARKTHREE !== "" &&
                        <View style={{height: height * 0.06, width, justifyContent: "center", alignItems: "center"}}>
                            <TouchableOpacity onPress={() => moveRegisterRoute(sProps.UserConfigReducer.BOOKMARKROUTETHREE,sProps.UserConfigReducer.BOOKMARKTHREE)} style={{height: height * 0.05, width: width * 0.9, borderRadius: 10, justifyContent: "center", paddingLeft: "5%"}}>
                                <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>{sProps.UserConfigReducer.BOOKMARKTHREE}</Text>
                            </TouchableOpacity>
                        </View>
                    }

                    <View style={{height: height * 0.04}} />

                    <View style={{height: height * 0.071, width, justifyContent: "center", alignItems: "center"}}>
                        <View style={{height: height * 0.05, width: width * 0.9,  alignItems: "center", flexDirection: "row"}}>
                            <ComponentCreditCard iHeight={height * 0.025} iWidth={height * 0.06} />
                            <Text style={{fontWeight: "700", fontSize: RFPercentage(2), color: "#191F28"}}>사업자 정보 메뉴</Text>
                        </View>
                        <View style={{ height: height * 0.001, width: width * 0.9, backgroundColor: "#191F28"}}/>
                        <View style={{ height: height * 0.02}}/>
                    </View>
                    <TouchableOpacity onPress={() => onChangeMenu("정산 정보 설정하기",AppRoute.OWNERACCOUNT)} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>정산 정보 설정하기</Text>
                    </TouchableOpacity>

                    <View style={{height: height * 0.04}} />

                    <View style={{height: height * 0.071, width, justifyContent: "center", alignItems: "center"}}>
                        <View style={{height: height * 0.05, width: width * 0.9,  alignItems: "center", flexDirection: "row"}}>
                            <ComponentFile iHeight={height * 0.025} iWidth={height * 0.06} />
                            <Text style={{fontWeight: "700", fontSize: RFPercentage(2), color: "#191F28"}}>상품 관리 메뉴</Text>
                        </View>
                        <View style={{ height: height * 0.001, width: width * 0.9, backgroundColor: "#191F28"}}/>
                        <View style={{ height: height * 0.02}}/>
                    </View>
                    <TouchableOpacity onPress={() => onChangeMenu("메뉴그룹 설정하기",AppRoute.MENU,"category")} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>메뉴그룹 설정하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeMenu("메뉴 설정하기",AppRoute.MENU,"menu")} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>메뉴 설정하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeMenu("옵션 설정하기",AppRoute.MENU,"option")} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>옵션 설정하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeMenu("대표메뉴 설정하기",AppRoute.MENU,"main")} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>대표메뉴 설정하기</Text>
                    </TouchableOpacity>

                    <View style={{height: height * 0.04}} />

                    <View style={{height: height * 0.071, width, justifyContent: "center", alignItems: "center"}}>
                        <View style={{height: height * 0.05, width: width * 0.9,  alignItems: "center", flexDirection: "row"}}>
                            <ComponentSidebar iHeight={height * 0.025} iWidth={height * 0.06} />
                            <Text style={{fontWeight: "700", fontSize: RFPercentage(2), color: "#191F28"}}>매장 관리 메뉴</Text>
                        </View>
                        <View style={{ height: height * 0.001, width: width * 0.9, backgroundColor: "#191F28"}}/>
                        <View style={{ height: height * 0.02}}/>
                    </View>
                    <TouchableOpacity onPress={() => onChangeMenu("매장 정보 설정하기",AppRoute.STOREINFOMATION)} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>매장 정보 설정하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeMenu("매장 업종 설정하기",AppRoute.STORETYPE)} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>매장 업종 설정하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeMenu("매장 소개글 설정하기",AppRoute.STORENOTICE)} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>매장 소개글 설정하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeMenu("매장 공지사항 설정하기",AppRoute.STOREALERT)} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>매장 공지사항 설정하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeMenu("매장 상품 원산지 설정하기",AppRoute.STOREORIGINNOTICE)} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>매장 상품 원산지 설정하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeMenu("메뉴 준비시간 설정하기",AppRoute.STOREORDERTIME)} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>메뉴 준비시간 설정하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeMenu("매장 로고 설정하기",AppRoute.STORELOGO)} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>매장 로고 설정하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeMenu("매장 이미지 설정하기",AppRoute.STOREIMAGES)} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>매장 이미지 설정하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeMenu("매장 휴무일 설정하기",AppRoute.STOREHOLIDAY)} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>매장 휴무일 설정하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeMenu("매장 영업시간 설정하기",AppRoute.STOREOPERATIONTIME)} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>매장 영업시간 설정하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeMenu("픽업존 설정하기",AppRoute.STOREPICKUPZONE)} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>픽업존 설정하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeMenu("픽업존 이미지 설정하기",AppRoute.STOREPICKUPIMAGE)} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>픽업존 이미지 설정하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeMenu("픽업존 추가 기능 설정하기",AppRoute.STOREPICKUPZONEDETAIL)} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>픽업존 추가 기능 설정하기</Text>
                    </TouchableOpacity>

                    <View style={{height: height * 0.04}} />

                    <View style={{height: height * 0.071, width, justifyContent: "center", alignItems: "center"}}>
                        <View style={{height: height * 0.05, width: width * 0.9,  alignItems: "center", flexDirection: "row"}}>
                            <ComponentHome iHeight={height * 0.025} iWidth={height * 0.06} />
                            <Text style={{fontWeight: "700", fontSize: RFPercentage(2), color: "#191F28"}}>주문 관리 메뉴</Text>
                        </View>
                        <View style={{ height: height * 0.001, width: width * 0.9, backgroundColor: "#191F28"}}/>
                        <View style={{ height: height * 0.02}}/>
                    </View>
                    <TouchableOpacity onPress={() => onChangeMenu("주문 접수",AppRoute.ORDER)} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>주문 접수</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeMenu("재고 관리",AppRoute.INVENTORY)} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>재고 관리</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeMenu("퀵 상품 등록",AppRoute.QUICKINSERT)} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>퀵 상품 등록</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeMenu("판매 내역",AppRoute.ORDERLIST)} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>판매 내역</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeMenu("광고 관리",AppRoute.COMMERCIAL)} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>광고 관리</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeMenu("쿠폰 관리",AppRoute.COUPON)} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>쿠폰 관리</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeMenu("스템프 관리",AppRoute.STAMP)} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>스템프 관리</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeMenu("공지사항",AppRoute.NOTICE)} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>공지사항</Text>
                    </TouchableOpacity>

                    <View style={{height: height * 0.04}} />

                    <View style={{height: height * 0.071, width, justifyContent: "center", alignItems: "center"}}>
                        <View style={{height: height * 0.05, width: width * 0.9,  alignItems: "center", flexDirection: "row"}}>
                            <ComponentSetting iHeight={height * 0.025} iWidth={height * 0.06} />
                            <Text style={{fontWeight: "700", fontSize: RFPercentage(2), color: "#191F28"}}>앱 설정</Text>
                        </View>
                        <View style={{ height: height * 0.001, width: width * 0.9, backgroundColor: "#191F28"}}/>
                        <View style={{ height: height * 0.02}}/>
                    </View>
                    <TouchableOpacity onPress={() => sProps.appManager.navGoTo('push', AppRoute.PRINTER )} style={{height: height * 0.06, alignItems: "center", marginLeft: width * 0.1, flexDirection: "row"}}>
                        <View style={{flex:1}}>
                            <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>프린터 설정</Text>
                        </View>
                        <View style={{flex:1, alignItems: "flex-end", marginRight: "8%"}}>
                            <ComponentPrinter iHeight={height/ 11} iWidth={width / 18} iColor={"#000"}/>
                        </View>
                    </TouchableOpacity>
                    <View style={{height: height * 0.06, alignItems: "center", marginLeft: width * 0.1, flexDirection: "row"}}>
                        <View style={{flex:1}}>
                            <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>주문 알림</Text>
                        </View>
                        <View style={{flex:1, alignItems: "flex-end", marginRight: "8%"}}>
                            <SwitchToggle isOn={togle} onToggle={handleToggle}/>
                        </View>
                    </View>
                    <View style={{height: height * 0.06, alignItems: "center", marginLeft: width * 0.1, flexDirection: "row"}}>
                        <View style={{flex:1}}>
                            <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>주문 알림음</Text>
                        </View>
                        <View style={{flex:1, alignItems: "flex-end", marginRight: "8%"}}>
                            <VolumeSwitchToggle isOn={sVolume} onToggle={handleVolume}/>
                        </View>
                    </View>
                    <View style={{height: height * 0.06, alignItems: "center", marginLeft: width * 0.1, flexDirection: "row"}}>
                        <View style={{flex:1}}>
                            <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>앱 버전</Text>
                        </View>
                        <View style={{flex:1, alignItems: "flex-end", marginRight: "10%"}}>
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.8), color: "#6490E7" }}>{VersionCheck.getCurrentVersion()}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => componentLogout()} style={{height: height * 0.06, justifyContent: "center", marginLeft: width * 0.1}}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#3B3B46"}}>로그아웃</Text>
                    </TouchableOpacity>

                    <View style={{height: height * 0.1}} />

                </ScrollView>
            </Animated.View>
        </MaskedView>
    )
}

export default Home;