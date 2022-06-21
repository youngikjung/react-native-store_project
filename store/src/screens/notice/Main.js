import React, {useState,useEffect} from 'react';
import { View, Dimensions, Text, TouchableOpacity, FlatList, Platform } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';
import moment from 'moment-timezone';
import 'moment/locale/ko';

import { AppRoute } from '../../routes/AppRoutes';

import { CompModalNoticeContent } from '../../components/modal/AppModalContent';

import { ComponentDelete } from '../../assets/svg/delete';

const { width, height } = Dimensions.get('window');
const OrderScreen = oProps => {
    const [loading, setLoading] = useState(false);
    const [noticeList, setNoticeList] = useState();

    const openNoticePage = (sIndex) => {
        oProps.appManager.showModal(
            true,
            <CompModalNoticeContent 
                sItem={sIndex}
                fnCancel={() => oProps.appManager.hideModal()}
            />, 
            "custom"
        );
    }

    const getList = async () => {
        let oUserConfig = {};
        oUserConfig['APPROUTE'] = AppRoute.NOTICE;
        await oProps.reduxSetUserConfig(oUserConfig);

        const oResponse = await oProps.appManager.accessAxios("/store/order/getall", "get", "login", null);
        if(oResponse !== undefined){
            if(oResponse.isOrder){
                if(parseInt(oResponse.iReady) > 0){
                    oProps.appManager.navGoTo('reset', AppRoute.ORDER)
                }
            }
        }
    }

    const GoBack = () => {
        oProps.appManager.navGoTo('reset', AppRoute.HOME);
    }

    const asyncData = async () => {
        setLoading(true);
        const oResponse = await oProps.appManager.accessAxios("/notice/noticeList/v2", "get", "text", null);
        if(oResponse !== undefined){
            if(oResponse.length > 0){
                setNoticeList(oResponse);
            }
        }
        setLoading(false);
    }

    useEffect(() => {
        getList();
        asyncData();
    }, []);

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            {loading ?
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            :
            <>
                <View style={{height: height * 0.08 }}>
                    <View style={{flex:1, alignItems: "flex-start", justifyContent: "center", paddingLeft: width * 0.07, marginTop: "3%" }}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(2.1), color: "#191F28" }}>공지사항</Text>
                    </View>
                    <TouchableOpacity onPress={GoBack} style={{ position: "absolute", top: height * 0.02, right: width * 0.05, height: height * 0.05, width: height * 0.05, justifyContent: "center", alignItems: "center"}}>
                        <ComponentDelete iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
                    </TouchableOpacity>
                </View>
                
                <View style={{flex:1, backgroundColor: "#fff"}}>
                    <FlatList
                        data={noticeList}
                        ListFooterComponent={<View style={{ height: height * 0.04 }} />}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(data, index) => "list-" + index + Math.random()}
                        ItemSeparatorComponent={() => {
                            return (
                                <View style={{height: height * 0.001, width: "90%", backgroundColor: "#DFDFDF", marginHorizontal: "5%"}}/>
                            )
                        }}
                        ListEmptyComponent={
                            <View style={{height: width * 0.3, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontWeight: "400", fontSize: RFPercentage(1.7), color: "#bbb"}}>메세지가 없습니다.</Text>
                            </View>
                        }
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity activeOpacity={0.8} onPress={() => openNoticePage(item)} style={{height: height * 0.1, justifyContent: "center"}}>
                                    <View style={{flex:0.6, alignItems: "flex-end", paddingLeft: "5%", flexDirection: "row", paddingBottom: "2%", paddingRight: "5%"}}>
                                        {!moment(item.date).isBefore(moment().add( -7, "days").format("YYYY-MM-DD")) &&
                                            <View style={{width : width * 0.08, backgroundColor: moment().format("YYYY-MM-DD") === item.date ? "#dd1212" : "#1A2FC6", height: "50%", marginRight: "5%", borderRadius: 5, justifyContent: "center", alignItems: "center"}}>
                                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.3), color: "#fff"}}>{moment().format("YYYY-MM-DD") === item.date ? "오늘" : "최근"}</Text>
                                            </View>
                                        }
                                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.9), color: "#000"}}>{item.title}</Text>
                                    </View>
                                    <View style={{flex:0.4, justifyContent: "flex-start", paddingLeft: "5%"}}>
                                        <Text style={{fontWeight: "400", fontSize: RFPercentage(1.6), color: "#000"}}>{item.date}</Text>
                                    </View>
                                </TouchableOpacity>
                            ) 
                        }}
                    />
                </View>
                <View style={{height: height * 0.05, backgroundColor: "#fff"}} />
            </>
            }
        </View>
    )
}

export default OrderScreen;