import React, {useState,useEffect,useRef} from 'react';
import { View, Dimensions, Text, TouchableOpacity, Image, FlatList, ScrollView, TextInput, Keyboard, StatusBar, Platform } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';
import { WebView } from "react-native-webview";

import { ComponentThrooOnly } from '../../../assets/svg/throoonly';
import { ComponentCoupon } from '../../../assets/svg/coupon';
import { ComponentPhoneIcon } from '../../../assets/svg/phoneicon';
import { ComponentHotMenu } from '../../../assets/svg/hotmenu';
import { ComponentStoreManage } from '../../../assets/svg/storeManage';

const { width, height } = Dimensions.get('window');

let checkTime;

const CommercialUserList = ({ iProps }) => {
    const [loading, setLoading] = useState(true);
    const [chartLoading, setChartLoading] = useState(true);
    const [iLoad, setILoad] = useState(false);
    
    const [sTitle, setTitle] = useState("");
    const [commercialList, setCommercialList] = useState([]);

    const sUri = useRef("");

    const commercialChartPage = (sIndex,aIndex) => {
        setChartLoading(true);
        sUri.current = aIndex;
        setTitle(sIndex);
        if(checkTime) clearTimeout(checkTime);
        checkTime = setTimeout(() => {
            setChartLoading(false);
        }, 300);
    };

    const asyncData = async () => {
        setLoading(true);
        const store_id = iProps.UserConfigReducer.StoreID;
        const oResponse = await iProps.appManager.accessAxios("/store/commercial/chart/getCommercial/-" + store_id, "get", "login", null);
        if(oResponse !== undefined){
            setChartLoading(true);
            sUri.current = oResponse[0].uri
            setTitle(oResponse[0].name);
            setCommercialList(oResponse);
            setChartLoading(false);
        }
        setLoading(false);
    }

    useEffect(() => {
        asyncData();
    }, []);

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            {loading ?
                <View style={{ flex:1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            :
                <ScrollView style={{ flex:1 }}>
                    {chartLoading ?
                        <View style={{ height: height * 0.37, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                            <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../../assets/lottie/throo_splash.json')} autoPlay loop/>
                        </View>
                    :
                        <>
                            <View style={{height: height * 0.05, justifyContent: "flex-end", marginLeft: "5%"}}>
                                <Text style={{fontWeight: "900", fontSize: RFPercentage(1.8), color: "#000"}}>{sTitle} 차트</Text>
                            </View>
                            <View style={{height: height * 0.32, width, justifyContent: "center", alignItems: "center"}}>
                                <View 
                                    style={{ 
                                        height: height * 0.3, width: width * 0.95,
                                        flexDirection: "row",
                                        backgroundColor: "#fff", padding: "3%",
                                        justifyContent: "center", alignItems: "center",
                                    }}
                                >
                                    {iLoad &&
                                        <View style={{ flex:1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                                            <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../../assets/lottie/throo_splash.json')} autoPlay loop/>
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
                        </>
                    }
                    <View style={{height: height * 0.07, justifyContent: "center", marginLeft: "5%"}}>
                        <Text style={{fontWeight: "900", fontSize: RFPercentage(1.8), color: "#000"}}>진행중인 광고상품</Text>
                    </View>
                    {commercialList.map((item,index) => {
                        return (
                            <View key={index} style={{ height: height * 0.1, width, justifyContent: "center", alignItems: "center" }}>
                                <View style={{ height: height * 0.08, width, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                                    <View style={{height: height * 0.08, width: "20%", justifyContent: "center", alignItems: "center"}}>
                                        {item.key === "wm_adver_product_throo_only" &&
                                            <ComponentThrooOnly iHeight={height * 0.04} iWidth={height * 0.05} iColor={"#fff"}/>
                                        }
                                        {item.key === "wm_adver_coupon" &&
                                            <View style={{height: height * 0.05, width: height * 0.05, backgroundColor: "#AEEFD5", justifyContent: "center", alignItems: "center", borderRadius: width * 0.03}}>
                                                <ComponentCoupon iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#fff"}/>
                                            </View>
                                        }
                                        {item.key === "wm_adver_store" &&
                                            <View style={{height: height * 0.05, width: height * 0.05, backgroundColor: "#FFE69B", justifyContent: "center", alignItems: "center", borderRadius: width * 0.03}}>
                                                <ComponentStoreManage iHeight={height * 0.05} iWidth={height * 0.05} iColor={"#fff"}/>
                                            </View>
                                        }
                                        {item.key === "wm_adver_product_popular" &&
                                            <View style={{height: height * 0.05, width: height * 0.05, backgroundColor: "#F2F4F6", justifyContent: "center", alignItems: "center", borderRadius: width * 0.03}}>
                                                <ComponentHotMenu iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#fff"}/>
                                            </View>
                                        }
                                        {item.key === "wm_adver_event" &&
                                            <ComponentPhoneIcon iHeight={height * 0.05} iWidth={height * 0.05} iColor={"#fff"}/>
                                        }
                                    </View>
                                    <View style={{height: height * 0.08, width: "60%", justifyContent: "center"}}>
                                        <Text style={{fontWeight: "800", fontSize: RFPercentage(1.9), color: "#191F28"}}>{item.name}</Text> 
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#6B7583"}}>{item.date}</Text> 
                                    </View>
                                    <View style={{height: height * 0.08, width: "20%", justifyContent: "center", alignItems: "flex-start"}}>
                                        <TouchableOpacity onPress={() => commercialChartPage(item.name,item.uri)} style={{height: height * 0.05, width: height * 0.07, backgroundColor: "#E8EFFC", justifyContent: "center", alignItems: "center", borderRadius: width * 0.03}}>
                                            <Text style={{fontWeight: "700", fontSize: RFPercentage(1.7), color: "#6490E7"}}>차트</Text> 
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )
                    })}
                </ScrollView>
            }
        </View>
    )
}

export default CommercialUserList;
