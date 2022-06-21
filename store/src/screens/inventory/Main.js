import React, {useState,useEffect,useRef} from 'react';
import { View, Dimensions, Text, FlatList, Platform, Image, TouchableOpacity, AppState } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import PushNotification, { Importance } from 'react-native-push-notification';
import LottieView from 'lottie-react-native';

import { AppRoute } from '../../routes/AppRoutes';

import Footer from '../../components/footer/Footer';
import Item from '../../components/inventory/Item';

import { CompModalInventory, ComSelectionData } from '../../components/modal/AppModalContent';

import {ComponentArrowDown1} from '../../assets/svg/arrow_down1';

const { width, height } = Dimensions.get('window');

const QuickManage = oProps => {
    const [loading, setLoading] = useState(false);

    const [orderCount, setOrderCount] = useState("");

    const [sProductList, setProductList] = useState([]);
    const [sCategoryList, setCategoryList] = useState([]);

    const [categoryId, setCategoryId] = useState("");
    const [textNm, setTextNm] = useState("");

    const appState = useRef(AppState.currentState);

    const openInventory = (xIndex) => {
        oProps.appManager.showModal(
            true,
            <CompModalInventory
                iProps={oProps}
                sData={xIndex}
                fnComplete={(sIndex,aIndex,xIndex) => onChangeItemValue(sIndex,aIndex,xIndex)}
                fnCancel={() => oProps.appManager.hideModal()}
            />, 
            "custom"
        );
    };

    const rowTextSelection = async () => {
        oProps.appManager.showModal(
            true,
            <ComSelectionData
                sList={sCategoryList}
                fnSelectValue={(sIndex) => onChangeCategory(sIndex)}
            />, 
            "custom"
        );
    }

    const onChangeItemValue = async () => {
        await oProps.appManager.hideModal();
        getMenuList(parseInt(categoryId));
    }

    const onChangeCategory = async (sIndex) => {
        await oProps.appManager.hideModal();
        setTextNm(sIndex.name);
        setCategoryId(parseInt(sIndex.id))
        getMenuList(parseInt(sIndex.id));
    }

    const getMenuList = async (sIndex) => {
        setLoading(true);
        const category_id = sIndex;
        const oResponse = await oProps.appManager.accessAxios("/app/ceo/store/menuList-" + category_id, "get", "text", null);
        if(oResponse !== undefined){
            setProductList(oResponse);
        }
        setLoading(false);
    }

    const getList = async () => {
        let oUserConfig = {};
        oUserConfig['APPROUTE'] = AppRoute.INVENTORY;
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
    
    const getCategory = async () => {
        setLoading(true);

        const store_id = oProps.UserConfigReducer.StoreID;
        const oResponse = await oProps.appManager.accessAxios("/app/ceo/store/detailMenuList-" + store_id, "get", "text", null);
        if(oResponse !== undefined){
            if(oResponse.sResult.length > 0){
                setCategoryList(oResponse.sResult);
                setTextNm(oResponse.sResult[0].name);
                setCategoryId(parseInt(oResponse.sResult[0].id))
                getMenuList(parseInt(oResponse.sResult[0].id));
            }
        }

        setLoading(false);
    }

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
    
    useEffect(() => {
        getList();
        getCategory();
    }, []);

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
                            <Text style={{fontWeight: "700", fontSize: RFPercentage(2.1), color: "#191F28" }}>재고 관리</Text>
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
                        <View style={{height: height * 0.02}}/>
                        <FlatList
                            data={sProductList}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(data, index) => "list-" + index + Math.random()}
                            ListEmptyComponent={
                                <View style={{height: height * 0.2, justifyContent: "center", alignItems: "center"}}>
                                    <Text style={{fontWeight: "400", fontSize: RFPercentage(1.7), color: "#bbb"}}>등록된 상품이 없습니다.</Text>
                                </View>
                            }
                            renderItem={({ item, index }) => {
                                return (
                                    <Item 
                                        sItem={item}
                                        iProps={oProps}
                                        fnOpen={(sIndex) => openInventory(sIndex)}
                                    />
                                ) 
                            }}
                        />
                        <View style={{height: height * 0.18}} />
                    </View>
                    <Footer 
                        oProps={oProps}
                        sOrder={orderCount}
                        sLocation={"manage"}
                    />
                </>
            }
        </View>
    )
}

export default QuickManage;