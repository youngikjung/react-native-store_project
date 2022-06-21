import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, ScrollView, Image, FlatList } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import { WebView } from "react-native-webview";
import LottieView from 'lottie-react-native';

import { ComponentThrooOnly } from '../../../assets/svg/throoonly';
import { ComponentCoupon } from '../../../assets/svg/coupon';
import { ComponentPhoneIcon } from '../../../assets/svg/phoneicon';
import { ComponentHotMenu } from '../../../assets/svg/hotmenu';
import { ComponentStoreManage } from '../../../assets/svg/storeManage';
import { ComponentGift2 } from '../../../assets/svg/gift2';

import { ComCommercialBannerEditPage, CompModalContent, ComCommercialThrooProductPage } from '../../modal/AppModalContent';

const { width, height } = Dimensions.get('window');

const Init = ({ iProps }) => {
    const [loading, setLoading] = useState(false);
    const [isLoad, setLoad] = useState(true);

    const [commercialList, setCommercialList] = useState([]);

    const sUri = useRef("");

    const commercialBannerEditPage = (sIndex) => {
        iProps.appManager.showModal(
            true,
            <ComCommercialBannerEditPage
                sProps={iProps}
                iParam={sIndex}
                fnClose={() => iProps.appManager.hideModal()}
                fnRefresh={() => refresh()}
            />, 
            "custom",
        );
    };

    const commercialThrooProductPage = (sIndex) => {
        iProps.appManager.showModal(
            true,
            <ComCommercialThrooProductPage
                sProps={iProps}
                iParam={sIndex}
                fnClose={() => iProps.appManager.hideModal()}
                fnRefresh={() => refresh()}
            />, 
            "custom",
        );
    };

    const openModalContent = (sIndex) => {
        iProps.appManager.showModal(
            true,
            <CompModalContent sText={sIndex}/>, 
            "custom",
            2500
        );
    };

    const refresh = async () => {
        iProps.appManager.hideModal();
        asyncData();
        openModalContent("수정되었습니다.");
    }

    const asyncData = async () => {
        setLoading(true);
        const store_id = iProps.UserConfigReducer.StoreID;
        const oResponse = await iProps.appManager.accessAxios("/store/commercial/used/getCommercial/-" + store_id, "get", "login", null);
        if(oResponse !== undefined){
            setCommercialList(oResponse.commercialList);
        }
        sUri.current = "https://ceo.throo.co.kr/selfmanage/commercial/app/ceo?=" + parseFloat(iProps.UserConfigReducer.StoreID) + "?@=" + "current";
        setLoading(false);
    }

    useEffect(() => {
        asyncData();
    }, []);

    return (
        <ScrollView style={{flex:1, backgroundColor: "#fff"}}>
            {loading ?
                <View style={{ flex:1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            :
            <>
                <View style={{height: height * 0.05, justifyContent: "flex-end", marginLeft: "5%"}}>
                    <Text style={{fontWeight: "900", fontSize: RFPercentage(1.8), color: "#000"}}>광고 진행 성과</Text>
                </View>
                <View style={{height: height * 0.38, justifyContent: "center", alignItems: "center"}}>
                    <View 
                        style={{ 
                            height: height * 0.35, width: width * 0.95,
                            flexDirection: "row",
                            backgroundColor: "#fff", borderRadius: width * 0.03, padding: "1%",
                            justifyContent: "center", alignItems: "center",
                        }}
                    >
                        {isLoad &&
                            <View style={{ flex:1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                                <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../../assets/lottie/throo_splash.json')} autoPlay loop/>
                            </View>
                        }
                        <WebView
                            originWhitelist={['*']}
                            cacheEnabled={false}
                            source={{ uri: sUri.current}}
                            onLoadEnd={() => setLoad(false)}
                        />
                    </View>
                </View>
                <View style={{height: height * 0.05, justifyContent: "flex-end", marginLeft: "5%"}}>
                    <Text style={{fontWeight: "900", fontSize: RFPercentage(1.8), color: "#000"}}>진행중인 광고상품</Text>
                </View>
                <View style={{height: height * 0.08, justifyContent: "flex-end", alignItems: "center"}}>
                    <View 
                        style={{
                            height: height * 0.06, width: width * 0.9, justifyContent: "center", paddingLeft: "5%", backgroundColor: "#F2F3F5", borderRadius: width * 0.02,
                        }}
                    >
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.8), color: "#000"}}>총 {commercialList.length}개</Text>
                    </View>
                </View>
                <FlatList
                    data={commercialList}
                    ListHeaderComponent={<View style={{ height: height * 0.01}} />}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(data, index) => "list-" + index + Math.random()}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{height: height * 0.25, justifyContent: "center", alignItems: "center"}}>
                                <View 
                                    style={{
                                        height: height * 0.25, width: width * 0.9, justifyContent: "center", alignItems: "center"
                                    }}
                                >
                                    <View style={{ height: height * 0.06, width: width * 0.9, flexDirection: "row", alignItems: "center", justifyContent: "flex-start", paddingLeft: "5%", paddingRight: "5%", borderRadius: width * 0.03 }}>
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
                                        {item.key === "kit" &&
                                            <ComponentGift2 iHeight={height * 0.05} iWidth={height * 0.05} iColor={"#fff"}/>
                                        }
                                        {item.key === "picket" &&
                                            <ComponentGift2 iHeight={height * 0.05} iWidth={height * 0.05} iColor={"#fff"}/>
                                        }
                                        <Text style={{fontWeight: "900", fontSize: RFPercentage(2), color: "#001E62", marginLeft: "5%"}}>{item.name}</Text>
                                        {item.key === "wm_adver_event" &&
                                            <TouchableOpacity onPress={() => commercialBannerEditPage(item)} style={{height: height * 0.04, width: height * 0.06, backgroundColor: "#E8EFFC", justifyContent: "center", alignItems: "center", borderRadius: width * 0.03, position: "absolute", right: width * 0.03, top: height * 0.01}}>
                                                <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#6490E7"}}>수정</Text>
                                            </TouchableOpacity>
                                        }
                                        {(item.key === "kit" || item.key === "picket") &&
                                            <TouchableOpacity onPress={() => commercialThrooProductPage(item)} style={{height: height * 0.04, width: height * 0.1, backgroundColor: "#E8EFFC", justifyContent: "center", alignItems: "center", borderRadius: width * 0.03, position: "absolute", right: width * 0.03, top: height * 0.01}}>
                                                <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#6490E7"}}>배송현황</Text>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                    <View style={{ height: height * 0.05, width: width * 0.9, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingLeft: "5%", paddingRight: "5%"}}>
                                        <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#191F28"}}>광고 집행상황</Text>
                                        <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#191F28"}}>{item.action}</Text>
                                    </View>
                                    {(item.key !== "kit" && item.key !== "picket") &&
                                        <>
                                            <View style={{ height: height * 0.03, width: width * 0.9, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingLeft: "5%", paddingRight: "5%"}}>
                                                <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#191F28"}}>남은기간</Text>
                                                <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#191F28"}}>{item.limit}</Text>
                                            </View>
                                            <View style={{ height: height * 0.03, width: width * 0.9, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingLeft: "5%", paddingRight: "5%"}}>
                                                <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#191F28"}}>노출수</Text>
                                                <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#6490E7"}}>{item.leak !== undefined && item.leak !== null ? item.leak : "0"}</Text>
                                            </View>
                                            <View style={{ height: height * 0.03, width: width * 0.9, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingLeft: "5%", paddingRight: "5%"}}>
                                                <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#191F28"}}>클릭수</Text>
                                                <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#6490E7"}}>{item.click !== undefined && item.click !== null ? item.click : "0"}</Text>
                                            </View>
                                        </>
                                    }
                                </View>
                            </View>
                        ) 
                    }}
                />
            </>
            }
        </ScrollView>
    )
}

export default Init;