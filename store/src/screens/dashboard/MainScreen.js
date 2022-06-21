import React, { useState, useEffect, useRef } from 'react';
import { View, Dimensions, TouchableOpacity, StatusBar, ScrollView, Text, AppState, Platform, FlatList, Image, Linking } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import moment from 'moment-timezone';
import 'moment/locale/ko';

import { StoreStatusToggle, CompModalContent } from '../../components/modal/AppModalContent';
import { AppRoute } from '../../routes/AppRoutes';

import TimeSlider from '../../utils/slider/TimeSlider';

import { ComponentCloud } from '../../assets/svg/cloud';
import { ComponentCommercial } from '../../assets/svg/commercial';
import { ComponentCommercialAlarm } from '../../assets/svg/commercial_alarm';
import { ComponentTrendingUp } from '../../assets/svg/trendingUp';
import { ComponentTrendingDown } from '../../assets/svg/trending_down';
import { ComponentAward } from '../../assets/svg/award';
import { ComponentCloudOff } from '../../assets/svg/cloud_off';
import { ComponentFeather } from '../../assets/svg/feather';
import { ComponentArrowRight1} from '../../assets/svg/arrow_right1';
import { ComponentDrawer} from '../../assets/svg/drawer';

import CouponImg from '../../assets/img/coupon.png';
import CommercialImg from '../../assets/img/commercial.jpg';
import StampImg from '../../assets/img/stamp.png';
import AlertImg from '../../assets/img/notice.png';

import Footer from '../../components/footer/Footer';

const { width, height } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = StatusBar.currentHeight;

const Home = ({ sProps, fnAnimateMove, iOrderCount }) => {
    const [loading, setLoading] = useState(false);

    const [iData, setData] = useState({});
    const [bannerList, setBannerList] = useState([]);

    const [orderStatus, setOrderStatus] = useState("auto");
    const [isPause, setPause] = useState(false);
    const [customOrderTime, setCustomOrderTime] = useState("0");
    const [orderTime, setOrderTime] = useState("0");

    const appState = useRef(AppState.currentState);

    const animateMove = async () => {
        if(fnAnimateMove !== undefined && typeof fnAnimateMove === "function"){
            await fnAnimateMove();
        }
    }

    const openUrl = async (item) => {
        if(item.param !== undefined && item.param !== null && item.param !== ""){
            Linking.openURL("https://ceo.throo.co.kr" + item.move_path + "?" + item.param).catch(err => {});
        }
    }

    const asyncData = async () => {
        let oData = {
            prepareOrder: "-",
            acceptOrder: "-",
            acceptOrderTime: "-",
            acceptOrderTimeType: "분",
            prepareOrderHour: "-",
            prepareOrderHourType: "분",
            customOrderTime: "0",
            storeNoti: "",
            noticeList: [],
            orderStatus: "auto",
            orderTime: "auto",
        }
        setLoading(true);

        const store_id = sProps.UserConfigReducer.StoreID;
        const oResponse = await sProps.appManager.accessAxios("/app/ceo/home/dashboard-" + store_id, "get", "text", null);
        if(oResponse !== undefined){
            oData.noticeList = oResponse.sResult;
            oData.acceptOrder = oResponse.acceptOrder;
            oData.acceptOrderTime = oResponse.acceptOrderTime;
            oData.prepareOrder = oResponse.prepareOrder;
            oData.prepareOrderHour = oResponse.prepareOrderHour;
            oData.customOrderTime = oResponse.customOrderTime;
            oData.storeNoti = oResponse.originStoreNoti;
            setCustomOrderTime(oResponse.customOrderTime);
            
            setPause(oResponse.isPause);
            if(oResponse.acceptOrderTimeType !== "min"){
                oData.acceptOrderTimeType = "초";
            } else {
                oData.acceptOrderTimeType = "분";
            }
            if(oResponse.prepareOrderHourType !== "min"){
                oData.prepareOrderHourType = "초";
            } else {
                oData.prepareOrderHourType = "분";
            }
            if(parseInt(oResponse.customOrderTime) > 0){
                oData.orderStatus = "manual";
                setOrderStatus("manual");
            } else {
                oData.orderStatus = "auto";
                setOrderStatus("auto");
            }

            if(oResponse.forNowList !== undefined && oResponse.forNowList !== null){
                if(oResponse.forNowList.operation !== undefined && oResponse.forNowList.operation !== null && oResponse.forNowList.operation !== ""){
                    setOrderTime(oResponse.forNowList.min);
                } else {
                    setOrderTime(0);
                }
            }
        }

        const iResponse = await sProps.appManager.accessAxios("/home/bannerImgCEO", "get", "text", null);
        if (iResponse !== undefined) {
            if (iResponse.resultCd === "0000") {
                setBannerList(iResponse.mobileList);
            }
        }
        setData(oData);
        setLoading(false);
    }

    const selectOrderTime = async (sIndex) => {
        setLoading(true);
        if(!isPause){
            let temp = false;
            if(sIndex !== undefined && sIndex !== null && parseInt(sIndex) >= 60){
                temp = true;
            }
            
            const oData = {
                sIndex: sIndex,
                pause: temp,
                storeId: sProps.UserConfigReducer.StoreID
            };
            const oResponse = await sProps.appManager.accessAxios("/app/ceo/store/manualOrder", "post", null, oData);
            if (oResponse !== undefined && oResponse !== null) {
                if(oResponse){
                    setOrderStatus("manual")
                    setCustomOrderTime(sIndex.toString());
                    sProps.appManager.showModal(
                        true,
                        <CompModalContent 
                            sText={`앞으로 상품 준비 시간이 ${sIndex.toString()}분으로 고정됩니다.  원치 않으시면 '자동적용' 버튼을 눌러주세요.`}
                        />, 
                        "custom",
                        2500
                    );
                }
            }
        }
        setLoading(false);
    }

    const exChangeStoreStatus = async () => {
        setLoading(true);
        const oData = {
            storeId: sProps.UserConfigReducer.StoreID
        };
        const oResponse = await sProps.appManager.accessAxios("/app/ceo/store/exChangeStoreStatus", "post", null, oData);
        if (oResponse !== undefined && oResponse !== null) {
            if(oResponse){
                setOrderStatus("auto");
                sProps.appManager.showModal(
                    true,
                    <CompModalContent 
                        sText={"매장관리에서 미리 설정하신 상품준비시간이 자동으로 적용됩니다.  설정변경은 '매장관리-영업시간'에서 가능합니다."}
                    />, 
                    "custom",
                    2500
                );
            }
        }
        setLoading(false);
    }

    const customTempPauseStore = async (sIndex) => {
        let oData = {};

        setLoading(true);

        if(sIndex === "pause"){
            oData = {
                sIndex: 60,
                pause: true,
                storeId: sProps.UserConfigReducer.StoreID
            };
            const oResponse = await sProps.appManager.accessAxios("/app/ceo/store/manualOrder", "post", null, oData);
            if (oResponse !== undefined && oResponse !== null) {
                if(oResponse){
                    setPause(!isPause);
                }
            }
        } else {
            oData = {
                storeId: sProps.UserConfigReducer.StoreID
            };
            const oResponse = await sProps.appManager.accessAxios("/app/ceo/store/exChangeStoreStatus", "post", null, oData);
            if (oResponse !== undefined && oResponse !== null) {
                if(oResponse){
                    setPause(!isPause);
                }
            }
        }
        setLoading(false);
    }


    useEffect(() => {
        const subscription = AppState.addEventListener("change", nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === "active") {
                asyncData();
            }
            appState.current = nextAppState;
        });
        return () => {
            subscription.remove();
        };
    },[]);

    useEffect(() => {
        asyncData();
    }, []);

    return (
        <>
            {loading ?
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            :
                <>
                    <View style={{height: height * 0.09, flexDirection: "row", backgroundColor: "#fff"}}>
                        <View style={{flex: 0.8, alignItems: "center", justifyContent: "flex-end"}}>
                            <View style={{height: height * 0.08, width: "85%", justifyContent: "center"}}>
                                <View style={{height: height * 0.05, width:"100%", justifyContent: "flex-end"}}>
                                    <Text style={{ fontWeight: "800", fontSize: RFPercentage(2.2), color: "#191F28"}}>{sProps.UserConfigReducer.StoreName}</Text>
                                </View>
                                <View style={{height: height * 0.03, width:"100%", alignItems: "center", flexDirection: "row"}}>
                                    <View style={{flex:0.2 }}>
                                        <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: !isPause ? "#4E7BD3" : "#E32938", marginRight: "5%"}}>{!isPause ? "영업중": "일시정지"}</Text>
                                    </View>
                                    <View style={{flex:0.8 }}>
                                        <StoreStatusToggle isOn={isPause} onToggle={() => isPause ? customTempPauseStore("restart") : customTempPauseStore("pause")} />
                                    </View>
                                </View>
                            </View>
                            <View style={{height: height * 0.01, width: "100%"}}/>
                        </View>
                        <View style={{flex: 0.2, justifyContent: "flex-end", alignItems: "center"}}>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => animateMove()}  style={{height: height * 0.05, width: height * 0.05, justifyContent: "center", alignItems: "center", borderRadius: width * 0.05}}>
                                <ComponentDrawer iHeight={height * 0.06} iWidth={height * 0.06} />
                            </TouchableOpacity>
                            <View style={{height: height * 0.01}}/>
                        </View>
                    </View>

                    <ScrollView style={{flex:1, backgroundColor: "#fff"}}>
                        <LinearGradient 
                            colors={['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#D8EAEE']} 
                            style={{ flex:1 }}
                        >
                            <View style={{height: height * 0.19, justifyContent: "center", alignItems: "center"}}>
                                <View style={{ height: height * 0.14,  width: width * 0.9, flexDirection: "row" }}>
                                    <View style={{flex:1}}>
                                        <View style={{flex:0.7, justifyContent: "center", alignItems: "center"}}>
                                            <View style={{height: height * 0.05, width: height * 0.05, borderRadius: width, justifyContent: "center", alignItems: "center"}}>
                                                {parseInt(iData.prepareOrder) > 50 ? 
                                                    <ComponentCloud iHeight={height * 0.035} iWidth={height * 0.05} iColor={"#006c84"}/>
                                                :
                                                    <ComponentCloudOff iHeight={height * 0.035} iWidth={height * 0.05} iColor={"#633974"}/>
                                                }
                                            </View>
                                            <Text style={{fontWeight: "700", fontSize: RFPercentage(1.6), color: "#4E5867", marginTop: "10%"}}>주문 수락율</Text>
                                        </View>
                                        <View style={{flex:0.3, justifyContent: "flex-start", alignItems: "center", marginTop: "5%"}}>
                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#111"}}>{iData.acceptOrder} %</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:1}}>
                                        <View style={{flex:0.7, justifyContent: "center", alignItems: "center"}}>
                                            <View style={{height: height * 0.05, width: height * 0.05, borderRadius: width, justifyContent: "center", alignItems: "center"}}>
                                                <ComponentAward iHeight={height * 0.035} iWidth={height * 0.05} iColor={"#f9d423"}/>
                                            </View>
                                            <Text style={{fontWeight: "700", fontSize: RFPercentage(1.6), color: "#4E5867", marginTop: "10%"}}>주문 수락시간</Text>
                                        </View>
                                        <View style={{flex:0.3, justifyContent: "flex-start", alignItems: "center", marginTop: "5%"}}>
                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#111"}}>{iData.acceptOrderTime} {iData.acceptOrderTimeType}</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:1}}>
                                        <View style={{flex:0.7, justifyContent: "center", alignItems: "center"}}>
                                            <View style={{height: height * 0.05, width: height * 0.05, borderRadius: width, justifyContent: "center", alignItems: "center"}}>
                                                <ComponentFeather iHeight={height * 0.035} iWidth={height * 0.05} iColor={"#2f9599"}/>
                                            </View>
                                            <Text style={{fontWeight: "700", fontSize: RFPercentage(1.6), color: "#4E5867", marginTop: "10%"}}>상품준비 평균</Text>
                                        </View>
                                        <View style={{flex:0.3, justifyContent: "flex-start", alignItems: "center", marginTop: "5%"}}>
                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#111"}}>{iData.prepareOrderHour} {iData.prepareOrderHourType}</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:1}}>
                                        <View style={{flex:0.7, justifyContent: "center", alignItems: "center"}}>
                                            <View style={{height: height * 0.05, width: height * 0.05, borderRadius: width, justifyContent: "center", alignItems: "center"}}>
                                                {parseInt(iData.prepareOrder) > 50 ? 
                                                    <ComponentTrendingUp iHeight={height * 0.035} iWidth={height * 0.05} iColor={"#fc913a"}/>
                                                :
                                                    <ComponentTrendingDown iHeight={height * 0.035} iWidth={height * 0.05} iColor={"#f34a4a"}/>
                                                }
                                            </View>
                                            <Text style={{fontWeight: "700", fontSize: RFPercentage(1.6), color: "#4E5867", marginTop: "10%"}}>상품준비 정확도</Text>
                                        </View>
                                        <View style={{flex:0.3, justifyContent: "flex-start", alignItems: "center", marginTop: "5%"}}>
                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#111"}}>{iData.prepareOrder} %</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{height: height * 0.05, justifyContent: "flex-end", marginLeft: "5%"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.8), color: "#000"}}>우리매장 상품 준비시간</Text>
                            </View>
                            {!(sProps.UserConfigReducer.PickupType > 1 && sProps.UserConfigReducer.PickupType < 3) && 
                                <View style={{height: height * 0.17, justifyContent: "center", alignItems: "center"}}>
                                    <View 
                                        style={{
                                            height: height * 0.14,
                                            width: width * 0.9,
                                            borderRadius: width * 0.03,
                                            backgroundColor: "#fff",
                                            ...Platform.select({
                                                android: {
                                                    shadowColor: "#001E62",
                                                    elevation: 2,
                                                },
                                            })
                                        }}
                                    >
                                        <View style={{flex:0.4, flexDirection: "row", alignItems: "center", marginLeft: "5%"}}>
                                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.6), color: "#191F28"}}>
                                                현재 상품 준비시간:
                                                {isPause ?
                                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#EF4452"}}> 일시정지 </Text>
                                                :
                                                    <>
                                                        {orderStatus !== "auto" ?
                                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#6490E7"}}> {customOrderTime} </Text>
                                                            :
                                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#6490E7"}}> {orderTime} </Text>
                                                        }
                                                        분
                                                    </>
                                                }
                                            </Text>
                                        </View>
                                        <View style={{flex:0.6, justifyContent: "center"}}>
                                            {isPause ?
                                                <TimeSlider
                                                    sValue={true} 
                                                />
                                            :
                                                <TimeSlider
                                                    sValue={false} 
                                                    fnSelected={selectOrderTime}
                                                />
                                            }
                                        </View>
                                        {orderStatus !== "auto" &&
                                            <TouchableOpacity onPress={() => exChangeStoreStatus()} style={{position: "absolute", top: height * 0.015, left: width * 0.6, zIndex: 10, height: height * 0.035, width: width * 0.2, backgroundColor: "#6490E7", justifyContent: "center", alignItems: "center", borderRadius: width * 0.03}}>
                                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.8), color: "#fff"}}>자동적용</Text>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                            }
                            <View style={{height: height * 0.05, justifyContent: "flex-end", marginLeft: "5%"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.8), color: "#000"}}>공지사항</Text>
                            </View>
                            <View style={{height: height * 0.2, justifyContent: "center", alignItems: "center"}}>
                                <TouchableOpacity 
                                    onPress={() => sProps.appManager.navGoTo('reset', AppRoute.STOREALERT, { sParam: "home" })}
                                    style={{
                                        height: height * 0.16,
                                        width: width * 0.9,
                                        borderRadius: width * 0.03,
                                        backgroundColor: "#fff",
                                        ...Platform.select({
                                            android: {
                                                shadowColor: "#001E62",
                                                elevation: 2,
                                            },
                                        })
                                    }}
                                >
                                    {(iData.storeNoti !== undefined && iData.storeNoti !== null && iData.storeNoti !== "") ? 
                                        <>
                                            <View style={{flex:0.4, marginLeft: "5%", alignItems: "center", flexDirection: "row"}}>
                                                <Text style={{fontSize: RFPercentage(1.7), fontWeight: '700', color: "#191F28"}}>우리 단골에게 알려주세요</Text>
                                                <ComponentArrowRight1 iHeight={height * 0.025} iWidth={height * 0.04} iColor={"#6490E7"}/>
                                            </View>
                                            <View style={{ flex:0.6, flexDirection: "row", margin: "5%" }}>
                                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#4E5867"}}>iData.storeNoti</Text>
                                            </View>
                                        </>
                                    :
                                        <View style={{flex:1, flexDirection: "row"}}>
                                            <View style={{flex:0.4, marginLeft: "5%", alignItems: "flex-start", justifyContent: "center" }}>
                                                <Text style={{fontSize: RFPercentage(1.7), fontWeight: '700', color: "#191F28", marginBottom: "3%"}}>우리 단골에게</Text>
                                                <Text style={{fontSize: RFPercentage(1.7), fontWeight: '700', color: "#191F28", marginBottom: "7%"}}>알려주세요</Text>
                                                <ComponentArrowRight1 iHeight={height * 0.025} iWidth={height * 0.03} iColor={"#6490E7"}/>
                                            </View>
                                            <View style={{ flex:0.6, flexDirection: "row", margin: "5%" }}>
                                                <View style={{flex:0.4}} />
                                                <View style={{flex:0.6, justifyContent: "center", alignItems: "center"}}>
                                                    <Image source={AlertImg} style={{height: height * 0.07, width: height * 0.07, borderRadius: 5}}/>
                                                </View>
                                            </View>
                                        </View>
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={{height: height * 0.05, justifyContent: "flex-end", marginLeft: "5%"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.8), color: "#000"}}>매장 광고</Text>
                            </View>
                            <View style={{height: height * 0.2, justifyContent: "center", alignItems: "center"}}>
                                <TouchableOpacity 
                                    onPress={() => sProps.appManager.navGoTo('reset', AppRoute.COMMERCIAL)}
                                    style={{
                                        height: height * 0.16,
                                        width: width * 0.9,
                                        borderRadius: width * 0.03,
                                        backgroundColor: "#fff",
                                        ...Platform.select({
                                            android: {
                                                shadowColor: "#001E62",
                                                elevation: 2,
                                            },
                                        })
                                    }}
                                >
                                    <View style={{flex:1, flexDirection: "row"}}>
                                        <View style={{flex:0.4, marginLeft: "5%", alignItems: "flex-start", justifyContent: "center" }}>
                                            <Text style={{fontSize: RFPercentage(1.7), fontWeight: '700', color: "#191F28", marginBottom: "3%"}}>스루 광고 서비스</Text>
                                            <Text style={{fontSize: RFPercentage(1.7), fontWeight: '700', color: "#191F28", marginBottom: "7%"}}>사용하기</Text>
                                            <ComponentArrowRight1 iHeight={height * 0.025} iWidth={height * 0.03} iColor={"#FF8397"}/>
                                        </View>
                                        <View style={{ flex:0.6, flexDirection: "row", margin: "5%" }}>
                                            <View style={{flex:0.4}} />
                                            <View style={{flex:0.6, justifyContent: "center", alignItems: "center"}}>
                                                <View style={{height: height * 0.1, width: height * 0.1, backgroundColor: "#FFE69B", justifyContent: "center", alignItems: "center", borderRadius: 10}}>
                                                    <ComponentCommercial iHeight={height * 0.07} iWidth={height * 0.07} iColor={"#16C47E"}/>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{height: height * 0.05, justifyContent: "flex-end", marginLeft: "5%"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.8), color: "#000"}}>쿠폰</Text>
                            </View>
                            <View style={{height: height * 0.2, justifyContent: "center", alignItems: "center"}}>
                                <TouchableOpacity 
                                    onPress={() => sProps.appManager.navGoTo('reset', AppRoute.COUPON)}
                                    style={{
                                        height: height * 0.16,
                                        width: width * 0.9,
                                        borderRadius: width * 0.03,
                                        backgroundColor: "#fff",
                                        ...Platform.select({
                                            android: {
                                                shadowColor: "#001E62",
                                                elevation: 2,
                                            },
                                        })
                                    }}
                                >
                                    <View style={{flex:1, flexDirection: "row"}}>
                                        <View style={{flex:0.4, marginLeft: "5%", alignItems: "flex-start", justifyContent: "center" }}>
                                            <Text style={{fontSize: RFPercentage(1.7), fontWeight: '700', color: "#191F28", marginBottom: "3%"}}>나의 매장 쿠폰</Text>
                                            <Text style={{fontSize: RFPercentage(1.7), fontWeight: '700', color: "#191F28", marginBottom: "7%"}}>이용하기</Text>
                                            <ComponentArrowRight1 iHeight={height * 0.025} iWidth={height * 0.03} iColor={"#f6bd60"}/>
                                        </View>
                                        <View style={{ flex:0.6, flexDirection: "row", margin: "5%" }}>
                                            <View style={{flex:0.4}} />
                                            <View style={{flex:0.6, justifyContent: "center", alignItems: "center"}}>
                                                <Image source={CouponImg} style={{height: height * 0.1, width: height * 0.1, borderRadius: 5}}/>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{height: height * 0.05, justifyContent: "flex-end", marginLeft: "5%"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.8), color: "#000"}}>스템프</Text>
                            </View>
                            <View style={{height: height * 0.2, justifyContent: "center", alignItems: "center"}}>
                                <TouchableOpacity 
                                    onPress={() => sProps.appManager.navGoTo('reset', AppRoute.STAMP)}
                                    style={{
                                        height: height * 0.16,
                                        width: width * 0.9,
                                        borderRadius: width * 0.03,
                                        backgroundColor: "#fff",
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
                                                shadowColor: "#001E62",
                                                elevation: 2,
                                            },
                                        })
                                    }}
                                >
                                    <View style={{flex:1, flexDirection: "row"}}>
                                        <View style={{flex:0.4, marginLeft: "5%", alignItems: "flex-start", justifyContent: "center" }}>
                                            <Text style={{fontSize: RFPercentage(1.7), fontWeight: '700', color: "#191F28", marginBottom: "3%"}}>단골 고객 스템프</Text>
                                            <Text style={{fontSize: RFPercentage(1.7), fontWeight: '700', color: "#191F28", marginBottom: "7%"}}>만들기</Text>
                                            <ComponentArrowRight1 iHeight={height * 0.025} iWidth={height * 0.03} iColor={"#16C47E"}/>
                                        </View>
                                        <View style={{ flex:0.6, flexDirection: "row", margin: "5%" }}>
                                            <View style={{flex:0.4}} />
                                            <View style={{flex:0.6, justifyContent: "center", alignItems: "center"}}>
                                                <Image source={StampImg} style={{height: height * 0.1, width: height * 0.1, borderRadius: 5}}/>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{height: height * 0.05, justifyContent: "flex-end", marginLeft: "5%"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.8), color: "#000"}}>안내</Text>
                            </View>
                            <View style={{height: height * 0.23, justifyContent: "center", width}}>
                                <FlatList
                                    data={bannerList}
                                    horizontal
                                    contentContainerStyle={{paddingHorizontal: width * 0.05, alignItems: "center" }}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(data, index) => "list-" + index + Math.random()}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <>
                                                {item.param !== "mob_promotion" &&
                                                    <TouchableOpacity 
                                                        onPress={() => openUrl(item)}
                                                        style={{
                                                            height: height * 0.2,
                                                            width: height * 0.3,
                                                            borderRadius: width * 0.03,
                                                            backgroundColor: "#fff",
                                                            marginRight: width * 0.03,
                                                            ...Platform.select({
                                                                android: {
                                                                    shadowColor: "#001E62",
                                                                    elevation: 2,
                                                                },
                                                            })
                                                        }}
                                                    >
                                                        <Image source={{uri: item.url_path}} style={{height: height * 0.2, width: height * 0.3, borderRadius: 5, resizeMode: "stretch"}}/>
                                                    </TouchableOpacity>
                                                }
                                            </>
                                        ) 
                                    }}
                                />

                            </View>
                            <View style={{height: height * 0.05, justifyContent: "flex-end", marginLeft: "5%"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.8), color: "#000"}}>알림사항</Text>
                            </View>
                            <TouchableOpacity 
                                onPress={() => sProps.appManager.navGoTo('reset', AppRoute.NOTICE)}
                                style={{
                                    height: height * 0.3,
                                    width, justifyContent: "center", alignItems: "center"
                                }}
                            >
                                <View style={{ height: height * 0.02 }}/>
                                <View
                                    style={{
                                        height: height * 0.26,
                                        width: width * 0.9,
                                        borderRadius: width * 0.03,
                                        backgroundColor: "#fff",
                                        ...Platform.select({
                                            android: {
                                                shadowColor: "#001E62",
                                                elevation: 2,
                                            },
                                        })
                                    }}
                                >
                                    {iData.noticeList !== undefined &&
                                        <View style={{maxHeight: height * 0.2}}>
                                            {iData.noticeList.slice(0,4).map(( item, index ) => {
                                                return (
                                                    <View key={index} style={{height: height * 0.05, justifyContent: "center",marginRight: "5%", marginLeft: "5%", flexDirection: "row"}}>
                                                        <View style={{flex:0.8, alignItems: "center", justifyContent: "flex-start", flexDirection: "row"}}>
                                                            {!moment(moment(item.date).format("YYYY-MM-DD")).isBefore(moment().add( -7, "days").format("YYYY-MM-DD")) &&
                                                                <View style={{width : width * 0.03, backgroundColor: moment().format("YYYY-MM-DD") === item.date ? "#dd1212" : "#001E62", height: "50%", marginRight: "5%", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                                                                    <Text style={{fontWeight: "600", fontSize: RFPercentage(1), color: "#fff"}}>{moment().format("YYYY-MM-DD") === item.date ? "오늘" : "최근"}</Text>
                                                                </View>
                                                            }
                                                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.6), color: "#000"}}>{item.title}</Text>
                                                        </View>
                                                        <View style={{flex:0.2, justifyContent: "center", alignItems: "center"}}>
                                                            <Text style={{fontWeight: "400", fontSize: RFPercentage(1.5), color: "#000"}}>{moment(item.date).format("MM-DD")}</Text>
                                                        </View>
                                                    </View>
                                                ) 
                                            })}
                                        </View>
                                    }
                                    <View style={{height: height * 0.06, justifyContent: "center"}}>
                                        <Text style={{fontWeight: "400", fontSize: RFPercentage(1.5), color: "#6490E7", marginLeft: "5%"}}>알림사항 더보기</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={{ height: height * 0.2 }}/>
                        </LinearGradient>
                    </ScrollView>
                    <Footer 
                        oProps={sProps}
                        sOrder={iOrderCount}
                        sPause={isPause}
                        sLocation={"home"}
                    />
                </>
            }
        </>
    )
}

export default Home;