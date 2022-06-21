import React, {useState,useEffect} from 'react';
import { View, Dimensions, TouchableOpacity, Text, Platform } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';

import { AppRoute } from '../../routes/AppRoutes';

import { ComponentHomeLogo } from '../../assets/svg/home_logo';
import { ComponentHomeOrder } from '../../assets/svg/home_order';
import { ComponentFolderPlus } from '../../assets/svg/folder_plus';
import { ComponentHomeList } from '../../assets/svg/home_list';
import { ComponentDatabase } from '../../assets/svg/database';
import { ComponentDelete } from '../../assets/svg/delete';

const { width, height } = Dimensions.get('window');

const Footer = ({ oProps, sLocation, sOrder }) => {
    const [isShow, setShow] = useState(true);

    const [sTitle, setTitle] = useState("");
    const [activate, setAct] = useState("");

    const asyncData = () => {
        if(sLocation !== undefined && sLocation !== null && sLocation !== ""){
            setTitle(sLocation);
        }
       
    }

    const changeState = async (sIndex) => {
        let oUserConfig = {};

        if(sIndex === "homeButton"){
            oUserConfig['homeButton'] = false;
        } else if (sIndex === "orderButton") {
            oUserConfig['orderButton'] = false;
        } else if (sIndex === "inventoryButton") {
            oUserConfig['inventoryButton'] = false;
        } else if (sIndex === "quickButton") {
            oUserConfig['quickButton'] = false;
        } else if (sIndex === "orderlistButton") {
            oUserConfig['orderlistButton'] = false;
        }
        await oProps.reduxSetUserConfig(oUserConfig);
    };

    useEffect(() => {
        asyncData();
    }, []);

    useEffect(() => {
        if(sOrder !== undefined && sOrder !== null && parseInt(sOrder) > 0){
            setAct(sOrder.toString());
        } else {
            setAct("");
        }
    }, [sOrder]);

    return (
        <>
            {(sTitle !== "order" && parseInt(activate) > 0 && isShow) ?
                <>
                    <LinearGradient
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                        colors={['#2E7BD3', '#0E7BD3','#001E62']} 
                        style={{
                            position: "absolute",
                            zIndex: 3,
                            bottom: height * 0.14,
                            left: width * 0.1,
                            right: 0,
                            height: height * 0.06,
                            width: width * 0.85,
                            borderRadius: width * 0.05,
                        }}
                    >
                        <TouchableOpacity onPress={() => setShow(false)} style={{flex:1,justifyContent: "space-between", flexDirection: "row", alignItems: "center", paddingLeft: "10%", paddingRight: "5%"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '700', color: "#fff"}}>현재 진행중인 주문이 {activate}건 있어요!</Text>
                            <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.08} iColor={"#fff"}/>
                        </TouchableOpacity>
                    </LinearGradient>
                    <View style={{position: "absolute", zIndex: 2, bottom: height * 0.13, left: "28%", height: height * 0.025, width: height * 0.025, backgroundColor: "#0E7BD3", transform: [{ rotateZ: '0.785398rad' }]}} />
                </>
                :
                <>
                    {oProps.UserConfigReducer.homeButton ?
                        <>
                            <LinearGradient
                                start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                colors={['#2E7BD3', '#0E7BD3','#001E62']} 
                                style={{
                                    position: "absolute",
                                    zIndex: 3,
                                    bottom: height * 0.14,
                                    left: width * 0.02,
                                    right: 0,
                                    height: height * 0.08,
                                    width: width * 0.85,
                                    borderRadius: width * 0.05,
                                }}
                            >
                                <TouchableOpacity onPress={() => changeState("homeButton")} style={{flex:1,justifyContent: "space-between", flexDirection: "row", alignItems: "center", paddingLeft: "10%", paddingRight: "5%"}}>
                                    <View>
                                        <Text style={{fontSize: RFPercentage(2), fontWeight: '700', color: "#fff"}}>홈화면에서 간편하게 매장정보를 </Text>
                                        <Text style={{fontSize: RFPercentage(2), fontWeight: '700', color: "#fff"}}>확인 및 수정이 가능해요!</Text>
                                    </View>
                                    <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.08} iColor={"#fff"}/>
                                </TouchableOpacity>
                            </LinearGradient>
                            <View style={{position: "absolute", zIndex: 2, bottom: height * 0.13, left: "10%", height: height * 0.025, width: height * 0.025, backgroundColor: "#0E7BD3", transform: [{ rotateZ: '0.785398rad' }]}} />
                        </>
                    :
                    <>
                            {oProps.UserConfigReducer.orderButton ?
                                <>
                                    <LinearGradient
                                        start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                        colors={['#2E7BD3', '#0E7BD3','#001E62']} 
                                        style={{
                                            position: "absolute",
                                            zIndex: 3,
                                            bottom: height * 0.14,
                                            left: width * 0.1,
                                            right: 0,
                                            height: height * 0.06,
                                            width: width * 0.85,
                                            borderRadius: width * 0.05,
                                        }}
                                    >
                                        <TouchableOpacity onPress={() => changeState("orderButton")} style={{flex:1,justifyContent: "space-between", flexDirection: "row", alignItems: "center", paddingLeft: "10%", paddingRight: "5%"}}>
                                            <Text style={{fontSize: RFPercentage(2), fontWeight: '700', color: "#fff"}}>주문 수락 및 주문정보를 확인 가능해요!</Text>
                                            <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.08} iColor={"#fff"}/>
                                        </TouchableOpacity>
                                    </LinearGradient>
                                    <View style={{position: "absolute", zIndex: 2, bottom: height * 0.13, left: "28%", height: height * 0.025, width: height * 0.025, backgroundColor: "#0E7BD3", transform: [{ rotateZ: '0.785398rad' }]}} />
                                </>
                            :
                            <>
                                    {oProps.UserConfigReducer.inventoryButton ?
                                        <>
                                            <LinearGradient
                                                start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                                colors={['#2E7BD3', '#0E7BD3','#001E62']} 
                                                style={{
                                                    position: "absolute",
                                                    zIndex: 3,
                                                    bottom: height * 0.14,
                                                    left: width * 0.05,
                                                    right: 0,
                                                    height: height * 0.06,
                                                    width: width * 0.9,
                                                    borderRadius: width * 0.05,
                                                }}
                                            >
                                                <TouchableOpacity onPress={() => changeState("inventoryButton")} style={{flex:1,justifyContent: "space-between", flexDirection: "row", alignItems: "center", paddingLeft: "5%", paddingRight: "5%"}}>
                                                    <Text style={{fontSize: RFPercentage(2), fontWeight: '700', color: "#fff"}}>등록하신 상품의 재고 및 품절처리가 가능해요!</Text>
                                                    <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.08} iColor={"#fff"}/>
                                                </TouchableOpacity>
                                            </LinearGradient>
                                            <View style={{position: "absolute", zIndex: 2, bottom: height * 0.13, left: "48%", height: height * 0.025, width: height * 0.025, backgroundColor: "#0E7BD3", transform: [{ rotateZ: '0.785398rad' }]}} />
                                        </>
                                    :
                                    <>
                                            {oProps.UserConfigReducer.quickButton ?
                                                <>
                                                    <LinearGradient
                                                        start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                                        colors={['#2E7BD3', '#0E7BD3','#001E62']} 
                                                        style={{
                                                            position: "absolute",
                                                            zIndex: 3,
                                                            bottom: height * 0.14,
                                                            left: width * 0.1,
                                                            right: 0,
                                                            height: height * 0.06,
                                                            width: width * 0.85,
                                                            borderRadius: width * 0.05,
                                                        }}
                                                    >
                                                        <TouchableOpacity onPress={() => changeState("quickButton")} style={{flex:1,justifyContent: "space-between", flexDirection: "row", alignItems: "center", paddingLeft: "10%", paddingRight: "5%"}}>
                                                            <Text style={{fontSize: RFPercentage(2), fontWeight: '700', color: "#fff"}}>빠르게 상품 등록이 가능해요!</Text>
                                                            <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.08} iColor={"#fff"}/>
                                                        </TouchableOpacity>
                                                    </LinearGradient>
                                                    <View style={{position: "absolute", zIndex: 2, bottom: height * 0.13, left: "67%", height: height * 0.025, width: height * 0.025, backgroundColor: "#005BD3", transform: [{ rotateZ: '0.785398rad' }]}} />
                                                </>
                                            :
                                                <>
                                                    {oProps.UserConfigReducer.orderlistButton &&
                                                        <>
                                                            <LinearGradient
                                                                start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                                                colors={['#2E7BD3', '#0E7BD3','#001E62']} 
                                                                style={{
                                                                    position: "absolute",
                                                                    zIndex: 3,
                                                                    bottom: height * 0.14,
                                                                    left: width * 0.1,
                                                                    right: 0,
                                                                    height: height * 0.06,
                                                                    width: width * 0.88,
                                                                    borderRadius: width * 0.05,
                                                                }}
                                                            >
                                                                <TouchableOpacity onPress={() => changeState("orderlistButton")} style={{flex:1,justifyContent: "space-between", flexDirection: "row", alignItems: "center", paddingLeft: "10%", paddingRight: "5%"}}>
                                                                    <Text style={{fontSize: RFPercentage(2), fontWeight: '700', color: "#fff"}}>주문내역 확인이 가능해요!</Text>
                                                                    <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.08} iColor={"#fff"}/>
                                                                </TouchableOpacity>
                                                            </LinearGradient>
                                                            <View style={{position: "absolute", zIndex: 2, bottom: height * 0.13, left: "85%", height: height * 0.025, width: height * 0.025, backgroundColor: "#003E62", transform: [{ rotateZ: '0.785398rad' }]}} />
                                                        </>
                                                    }
                                                </>
                                            }
                                        </>
                                    }
                                </>
                            }
                        </>
                    }
                </>
            }
            <View 
                style={{
                    position: "absolute",
                    zIndex: 1,
                    bottom: height * 0.03,
                    right: width * 0.025,
                    height: height * 0.09, flexDirection: "row", backgroundColor: "#fff",
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
                }}
            >
                <TouchableOpacity activeOpacity={0.4} onPress={() => oProps.appManager.navGoTo('reset', AppRoute.HOME)} style={{flex:1, justifyContent: "center", alignItems: "center"}}>
                    <View style={{height: height * 0.08, width: height * 0.07 , borderRadius: width * 0.05}}>
                        <View style={{height: "60%", width: "100%", justifyContent: "center", alignItems: "center"}}>
                            <ComponentHomeLogo iHeight={height * 0.03} iWidth={width * 0.01} iColor={sTitle === "home" ? "#001E62" : "#919AA7"}/>
                        </View>
                        <View style={{height: "40%", width: "100%", justifyContent: "flex-start", alignItems: "center"}}>
                            <Text style={{fontWeight: sTitle === "home" ? "800" : "400", fontSize: sTitle === "home" ? RFPercentage(1.6) : RFPercentage(1.4), color: sTitle === "home" ? "#001E62" : "#919AA7" }}>홈화면</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.4} onPress={() => oProps.appManager.navGoTo('reset', AppRoute.ORDER)} style={{flex:1, justifyContent: "center", alignItems: "center"}}>
                    {(sTitle !== "order" && parseInt(activate) > 0) ?
                        <Animatable.View animation="bounce" easing="ease-out" iterationCount="infinite" iterationDelay={500} useNativeDriver={true} style={{height: height * 0.08, width: height * 0.08 , borderRadius: width}}>
                            <View style={{height: "60%", width: "100%", justifyContent: "center", alignItems: "center"}}>
                                <ComponentHomeOrder iHeight={height * 0.03} iWidth={width * 0.07} iColor={sTitle === "order" ? "#001E62" : "#919AA7"}/>
                            </View>
                            <View style={{height: "40%", width: "100%", justifyContent: "flex-start", alignItems: "center"}}>
                                <Text style={{fontWeight: sTitle === "order" ? "800" : "400", fontSize: sTitle === "order" ? RFPercentage(1.6) : RFPercentage(1.4), color: sTitle === "order" ? "#001E62" : "#919AA7" }}>주문접수</Text>
                            </View>
                        </Animatable.View>
                        :
                        <View style={{height: height * 0.08, width: height * 0.08 , borderRadius: width}}>
                            <View style={{height: "60%", width: "100%", justifyContent: "center", alignItems: "center"}}>
                                <ComponentHomeOrder iHeight={height * 0.03} iWidth={width * 0.07} iColor={sTitle === "order" ? "#001E62" : "#919AA7"}/>
                            </View>
                            <View style={{height: "40%", width: "100%", justifyContent: "flex-start", alignItems: "center"}}>
                                <Text style={{fontWeight: sTitle === "order" ? "800" : "400", fontSize: sTitle === "order" ? RFPercentage(1.6) : RFPercentage(1.4), color: sTitle === "order" ? "#001E62" : "#919AA7" }}>주문접수</Text>
                            </View>
                        </View>
                    }
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.4} onPress={() => oProps.appManager.navGoTo('reset', AppRoute.INVENTORY)} style={{flex:1, justifyContent: "center", alignItems: "center"}}>
                    <View style={{height: height * 0.08, width: height * 0.07 , borderRadius: width * 0.05}}>
                        <View style={{height: "60%", width: "100%", justifyContent: "center", alignItems: "center"}}>
                            <ComponentDatabase iHeight={height * 0.03} iWidth={width * 0.06} iColor={sTitle === "manage" ? "#001E62" : "#919AA7"}/>
                        </View>
                        <View style={{height: "40%", width: "100%", justifyContent: "flex-start", alignItems: "center"}}>
                            <Text style={{fontWeight: sTitle === "manage" ? "800" : "400", fontSize: sTitle === "manage" ? RFPercentage(1.6) : RFPercentage(1.4), color: sTitle === "manage" ? "#001E62" : "#919AA7" }}>재고관리</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.4} onPress={() => oProps.appManager.navGoTo('reset', AppRoute.QUICKINSERT)} style={{flex:1, justifyContent: "center", alignItems: "center"}}>
                    <View style={{height: height * 0.08, width: height * 0.07 , borderRadius: width * 0.05}}>
                        <View style={{height: "60%", width: "100%", justifyContent: "center", alignItems: "center"}}>
                            <ComponentFolderPlus iHeight={height * 0.03} iWidth={width * 0.08} iColor={sTitle === "product" ? "#001E62" : "#919AA7"}/>
                        </View>
                        <View style={{height: "40%", width: "100%", justifyContent: "flex-start", alignItems: "center"}}>
                            <Text style={{fontWeight: sTitle === "product" ? "800" : "400", fontSize: sTitle === "product" ? RFPercentage(1.6) : RFPercentage(1.4), color: sTitle === "product" ? "#001E62" : "#919AA7" }}>퀵상품등록</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.4} onPress={() => oProps.appManager.navGoTo('reset', AppRoute.ORDERLIST)} style={{flex:1, justifyContent: "center", alignItems: "center"}}>
                    <View style={{height: height * 0.08, width: height * 0.07 , borderRadius: width * 0.05}}>
                        <View style={{height: "60%", width: "100%", justifyContent: "center", alignItems: "center"}}>
                            <ComponentHomeList iHeight={height * 0.03} iWidth={width * 0.08} iColor={sTitle === "orderList" ? "#001E62" : "#919AA7"}/>
                        </View>
                        <View style={{height: "40%", width: "100%", justifyContent: "flex-start", alignItems: "center"}}>
                            <Text style={{fontWeight: sTitle === "orderList" ? "800" : "400", fontSize: sTitle === "orderList" ? RFPercentage(1.6) : RFPercentage(1.4), color: sTitle === "orderList" ? "#001E62" : "#919AA7" }}>판매내역</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default Footer;