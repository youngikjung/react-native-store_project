import React, {useState,useEffect,useRef} from 'react';
import { View, Dimensions, Text, TouchableOpacity, StatusBar, FlatList, AppState } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import PushNotification, { Importance } from 'react-native-push-notification';
import LottieView from 'lottie-react-native';
import moment from 'moment-timezone';
import 'moment/locale/ko';

import { ComSelectionData } from '../../components/modal/AppModalContent';

import {AppRoute} from '../../routes/AppRoutes';

import Footer from '../../components/footer/Footer';

import {ComponentArrowDown1} from '../../assets/svg/arrow_down1';

import {ComponentMoon} from '../../assets/svg/moon';

const { width, height } = Dimensions.get('window');

const OrderList = oProps => {
    const [loading, setLoading] = useState(false);

    const [itemList] = useState([
        { key: 1, name :"오늘" },
        { key: 2, name :"어제" },
        { key: 3, name :"1주일" },
        { key: 4, name :"이번달" },
    ]);

    const [sList, setList] = useState([]);
    const [textNm, setTextNm] = useState("오늘");
    const [textDate, setTextDate] = useState(moment().format("YYYY-MM-DD"));

    const [totalOrderCount, setTotalOrderCount] = useState("0");
    const [totalOrderAmount, setTotalOrderAmount] = useState("0");

    const [orderCount, setOrderCount] = useState("");

    const appState = useRef(AppState.currentState);

    const rowTextSelection = async () => {
        oProps.appManager.showModal(
            true,
            <ComSelectionData
                sList={itemList}
                fnSelectValue={(sIndex) => onChangeCategory(sIndex)}
            />, 
            "custom"
        );
    }

    const onChangeCategory = async (sIndex) => {
        setLoading(true);

        let fromDate = moment().format("YYYY-MM-DD");
        let toDate = "";

        if(sIndex.key.toString() === "1"){
            setTextDate(fromDate);
        } else if (sIndex.key.toString() === "2"){
            fromDate = moment().add(-1,"days").format('YYYY-MM-DD');
            setTextDate(fromDate);

        } else if (sIndex.key.toString() === "3"){
            fromDate = moment().add(-7,"days").format('YYYY-MM-DD');
            toDate = moment().format('YYYY-MM-DD');
            setTextDate(fromDate + "~" + toDate);

        } else if (sIndex.key.toString() === "4"){
            fromDate = moment().startOf("month").format('YYYY-MM-DD');
            toDate = moment().endOf("month").format('YYYY-MM-DD');
            setTextDate(fromDate + "~" + toDate);
        }

        oProps.appManager.hideModal();
        setTextNm(sIndex.name);
        getOrderList(sIndex.key);
        setLoading(false);
    }

    const getOrderList = async (sIndex) => {
        setLoading(true);

        const oData = {
            store_id: oProps.UserConfigReducer.StoreID,
            sParam: sIndex
        }
        const oResponse = await oProps.appManager.accessAxios("/app/ceo/orderList", "post", null, oData);
        if(oResponse !== undefined){
            if(oResponse.sResult.length > 0){
                setTotalOrderCount(oResponse.count);
                setTotalOrderAmount(oResponse.amount);
            }
            setList(oResponse.sResult);
        }
        setLoading(false);
    }

    const getList = async () => {
        let oUserConfig = {};
        oUserConfig['APPROUTE'] = AppRoute.ORDERLIST;
        await oProps.reduxSetUserConfig(oUserConfig);

        const oResponse = await oProps.appManager.accessAxios("/store/order/getall", "get", "login", null);
        if(oResponse !== undefined){
            if(oResponse.isOrder){
                if(parseInt(oResponse.iReady) > 0){
                    oProps.appManager.navGoTo('reset', AppRoute.ORDER)
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
        getList();
        getOrderList(1);
    }, []);

    useEffect(() => {
        const subscription = AppState.addEventListener("change", nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === "active") {
                PushNotification.removeAllDeliveredNotifications();
                getList();
            }
            appState.current = nextAppState;
        });
        PushNotification.removeAllDeliveredNotifications();

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
                    <View style={{height: height * 0.1, flexDirection: "row" }}>
                        <View style={{flex: 0.3, justifyContent: "center", paddingLeft: width * 0.07, marginTop: "5%" }}>
                            <Text style={{fontWeight: "700", fontSize: RFPercentage(2.1), color: "#191F28" }}>판매내역</Text>
                        </View>
                        <TouchableOpacity onPress={() => rowTextSelection()} style={{flex: 0.7, alignItems: "center", justifyContent: "center", marginTop: "5%" }}>
                            <View style={{ height: "70%", width: "90%", justifyContent: "center", backgroundColor: "#F2F3F5", borderRadius: width * 0.02, paddingLeft: "5%" }}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.8), color: "#333D4B" }}>{textNm}</Text>
                            </View>
                            <View style={{position: "absolute", top: height * 0.015, right: "5%", height: height * 0.04, width: height * 0.04, justifyContent: "center", alignItems: "center"}}>
                                <ComponentArrowDown1 iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1}}>
                        <View style={{height: height * 0.07, flexDirection: "row", backgroundColor: "#fff"}}>
                            <View style={{flex: 1, justifyContent: "center", alignItems: "flex-start", paddingLeft: "5%"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.6), color: "#000"}}>{textDate}</Text>
                            </View>
                            <View style={{flex: 1, justifyContent: "center", alignItems: "flex-end", paddingRight: "5%"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.8), color: "#000"}}>총 {sList.length}건</Text>
                            </View>
                        </View>
                        <View style={{height: height * 0.02}}/>
                        <FlatList
                            data={sList}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(data, index) => "list-" + index.toString()}
                            ListEmptyComponent={
                                <View style={{height: height * 0.2, justifyContent: "center", alignItems: "center"}}>
                                    <Text style={{fontWeight: "400", fontSize: RFPercentage(1.7), color: "#bbb"}}>판매내역이 없습니다.</Text>
                                </View>
                            }
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{minHeight: height * 0.3, width: "100%"}}>
                                        <View 
                                            style={{
                                                flex:1, backgroundColor: "#fff", marginLeft: "5%", marginBottom: "5%", marginRight: "5%", borderRadius: 10,
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
                                                        elevation: 0.5,
                                                    },
                                                })
                                            }}
                                        >
                                            <View style={{height: height * 0.1, flexDirection: "row"}}>
                                                <View style={{flex:0.7, justifyContent: "center", paddingLeft: "5%", alignItems: "flex-start"}}>
                                                    <View style={{height: "60%", width: "100%", backgroundColor: "#ffff", borderRadius: 10, justifyContent: "center", alignItems: "flex-start"}}>
                                                        <View style={{flex:1, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
                                                            <Text style={{fontWeight: "400", fontSize: RFPercentage(1.6), color: "#6B7583"}}>차량번호: </Text>
                                                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.6), color: "#191F28"}}>{item.license_number}</Text>
                                                        </View>
                                                        <View style={{flex:1, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
                                                            <Text style={{fontWeight: "400", fontSize: RFPercentage(1.6), color: "#6B7583"}}>전화번호: </Text>
                                                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.6), color: "#191F28"}}>{item.phone_number}</Text>
                                                        </View>
                                                        <View style={{flex:1, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
                                                            <Text style={{fontWeight: "400", fontSize: RFPercentage(1.6), color: "#6B7583"}}>날짜: </Text>
                                                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.6), color: "#191F28"}}>{item.createdAt}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{flex:0.3, justifyContent: "center", paddingLeft: "5%"}}>
                                                    {item.isCancel ? 
                                                        <View style={{height: "50%", width: "80%", backgroundColor: "#F45552", borderRadius: 10, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                                                            <ComponentMoon iHeight={height * 0.025} iWidth={width * 0.025} iColor={"#fff"}/>
                                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.6), color: "#fff"}}> 주문취소</Text>
                                                        </View>
                                                        :
                                                        <View style={{height: "50%", width: "80%", backgroundColor: "#001E62", borderRadius: 10, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                                                            <ComponentMoon iHeight={height * 0.025} iWidth={width * 0.025} iColor={"#fff"}/>
                                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.6), color: "#fff"}}> 정상처리</Text>
                                                        </View>
                                                    }
                                                </View>
                                            </View>
                                            <View style={{flex: 1}}>
                                                {(item.content !== undefined && item.content !== null && item.content.length > 0) && 
                                                    item.content.map((sItem, sIndex) => {
                                                        return (
                                                            <View key={sIndex}>
                                                                <View style={{height: height * 0.08, justifyContent: "center", paddingLeft: "7%", paddingRight: "5%", flexDirection: "row"}}>
                                                                    <View style={{flex:1, justifyContent: "center", alignItems: "flex-start"}}>
                                                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.5), color: "#111"}}>{sItem.productNm}</Text>
                                                                    </View>
                                                                    <View style={{flex:1, justifyContent: "center", alignItems: "flex-end"}}>
                                                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.5), color: "#111"}}>{sItem.origin_price} 원</Text>
                                                                    </View>
                                                                </View>
                                                                {(sItem.option !== undefined && sItem.option !== null && sItem.option.length > 0) && 
                                                                    sItem.option.map((iItem, iIndex) => {
                                                                        return (
                                                                            <View key={iIndex} style={{height: height * 0.03, justifyContent: "center", paddingLeft: "11%", paddingRight: "5%", flexDirection: "row"}}>
                                                                                <View style={{flex:1, justifyContent: "center", alignItems: "flex-start"}}>
                                                                                    <Text style={{fontWeight: "400", fontSize: RFPercentage(1.3), color: "#666"}}>- {iItem.name}</Text>
                                                                                </View>
                                                                                <View style={{flex:1, justifyContent: "center", alignItems: "flex-end"}}>
                                                                                    <Text style={{fontWeight: "400", fontSize: RFPercentage(1.3), color: "#666"}}>{iItem.price} 원</Text>
                                                                                </View>
                                                                            </View>
                                                                        )
                                                                    })
                                                                }
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                            <View style={{height: height * 0.1, flexDirection: "row"}}>
                                                <View style={{flex:1, justifyContent: "center", paddingRight: "2%", alignItems: "flex-end", paddingLeft: "2%"}}>
                                                    <View style={{height: "60%", width: "100%", backgroundColor: "#f9f9f9", borderRadius: 10, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                                                        <View style={{flex:1, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
                                                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.3), color: "#666"}}>할인금액: </Text>
                                                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.4), color: "#000"}}>{item.discount} 원</Text>
                                                        </View>
                                                        <View style={{flex:1, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
                                                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.4), color: "#666"}}>결재금액: </Text>
                                                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.6), color: "#000"}}>{item.paymentAmount} 원</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )
                            }}
                        />
                        <View style={{height: height * 0.018}}/>
                    </View>
                    <View style={{height: height * 0.1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                        <View style={{height: "80%", width: "90%" , backgroundColor: "#2459C1", flexDirection: "row", borderRadius: width * 0.03}}>
                            <View style={{flex:0.4, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.2), color: "#fff"}}>총 합 {totalOrderCount}건</Text>
                            </View>
                            <View style={{flex:0.6, justifyContent: "center", alignItems: "flex-end", paddingRight: "5%"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.2), color: "#fff", }}>{totalOrderAmount} 원</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{height: height * 0.12, backgroundColor: "#fff"}} />
                    <Footer 
                        oProps={oProps}
                        sOrder={orderCount}
                        sLocation={"orderList"}
                    />
                </>
            }
        </View>
    )
}

export default OrderList;