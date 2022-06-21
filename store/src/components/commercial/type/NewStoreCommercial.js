
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Dimensions, Text, Image, FlatList } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import LottieView from 'lottie-react-native';
import moment from 'moment-timezone';
import 'moment/locale/ko';

import appBanner04 from '../../../assets/img/appBanner04.png';

import { ComponentArrowLeft3 } from '../../../assets/svg/arrowLeft3';
import { ComponentCommercialPark } from '../../../assets/svg/commercial_park';
import { ComponentCommercialTime } from '../../../assets/svg/commercial_time';

import { CompCommercialSelect } from '../../modal/ModalContents';

const { width, height } = Dimensions.get('window');

const Detail = ({ sProps, fnInitReturn, iDetailData, fnInsertCart, sParam }) => {
    const [loading, setLoading] = useState(false);

    const [preList,setPreList] = useState([]);

    const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
    const [fDatePickerVisible, setFDatePickerVisibility] = useState(false);

    const backToInfomation = async () => {
        if(fnInitReturn !== undefined && typeof fnInitReturn === "function"){
            await fnInitReturn();
        }
    }

    const handleFromConfirm = (date) => {
        setFromDate(moment(date).format("YYYY-MM-DD"));
        hideFromDatePicker();
    };

    const hideFromDatePicker = () => {
        setFDatePickerVisibility(false);
    };

    const withoutData = async (sIndex) => {
        if(fnInsertCart !== undefined && typeof fnInsertCart === "function"){
            await sProps.appManager.hideModal();
            await fnInsertCart(sIndex,"go");
        }
    }

    const getList = async () => {
        const store_id = sProps.UserConfigReducer.StoreID;
        const oResponse = await sProps.appManager.accessAxios("/store/commercial/newStore/getStoreDetailList-" + store_id, "get", "login", null);
        if(oResponse !== undefined){
            setPreList(oResponse);
        }
    }

    const openCommercialSelect = (sIndex) => {
        sProps.appManager.showModal(
            true,
            <CompCommercialSelect nIndex={sIndex} fnClose={() => sProps.appManager.hideModal()} fnInsert={(qIndex) => withoutData(qIndex)}/>, 
            "custom",
        );
    };

    const insertCouponCommercial = async () => {
        setLoading(true);

        let progress1 = true;
        for await (const iterator of sParam) {
            if(iterator.param === "new"){
                progress1 = false;
            }
        }
        const oData = {
            key: iDetailData.key,
            name: iDetailData.param,
            img: iDetailData.img,
            title: iDetailData.name,
            priceCasting: iDetailData.priceCasting,
            price: iDetailData.price,
            param: iDetailData.param,
            storeId: sProps.UserConfigReducer.StoreID,
            fromDate,
        }
        if(progress1){
            if(fnInsertCart !== undefined && typeof fnInsertCart === "function"){
                await fnInsertCart(oData,"no");
            }
        } else {
            openCommercialSelect(oData);
        }
        setLoading(false);
    }

    useEffect(() => {
        getList();
    }, []);

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            {loading ?
                <View style={{position: "absolute", top: 0, height, width, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            :
            <>
                <View style={{height: height * 0.08 }}>
                    <TouchableOpacity onPress={backToInfomation} style={{ position: "absolute", top: height * 0.02, left: width * 0.05, height: height * 0.05, width: height * 0.05, justifyContent: "center", alignItems: "center"}}>
                        <ComponentArrowLeft3 iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1, backgroundColor: "#fff"}}>
                    <View style={{height: height * 0.05, width, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{fontWeight: "900", fontSize: RFPercentage(2.5), color: "#000"}}>{iDetailData.name}</Text>
                    </View>
                    <View style={{height: height * 0.1, width: "80%", justifyContent: "flex-start", alignItems: "center", marginLeft: "10%", marginRight: "10%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.8), color: "#6B7583"}}>{iDetailData.detail2}</Text>
                    </View>
                    <View style={{height: height * 0.23, width, alignItems: "center", justifyContent: "space-around" }}>
                        <Text style={{fontWeight: "400", fontSize: RFPercentage(1.6), color: "#666666"}}>-예시-</Text>
                        <View style={{height: height * 0.2, width: width * 0.9, alignItems: "center", justifyContent: "center" }}>
                            <View style={{position: "absolute", top: height * 0.01, left: width * 0.05, height: height * 0.02, width: width * 0.6, alignItems: "center", flexDirection: "row"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#111111"}}>새로 입점했어요!</Text>
                            </View>
                            <View style={{position: "absolute", bottom: 0, left: 0, height: height * 0.16, width: width * 0.8}}>
                                <FlatList
                                    data={preList}
                                    horizontal
                                    contentContainerStyle={{paddingHorizontal: width * 0.05, alignItems: "center" }}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(data, index) => "list-" + index + Math.random()}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View 
                                                style={{
                                                    height: height * 0.15,
                                                    width: width * 0.25,
                                                    borderRadius: width * 0.03,
                                                    marginRight: width * 0.03,
                                                }}
                                            >
                                                <View style={{ height: height * 0.1, width: height * 0.12, justifyContent: "center", alignItems: "center"}}>
                                                    <Image source={{uri: item.image}} style={{height: height * 0.1, width: height * 0.12, borderRadius: width * 0.005, resizeMode: "stretch"}}/>
                                                </View>
                                                <View style={{ height: height * 0.05, width: height * 0.12, justifyContent: "space-evenly", alignItems: "flex-start"}}>
                                                    <View style={{ height: height * 0.02, width: height * 0.12, alignItems: "center",flexDirection: "row"}}>
                                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.5), color: "#111111", marginLeft: "5%"}}>{item.name}</Text>
                                                    </View>
                                                    <View style={{ height: height * 0.02, width: height * 0.12, alignItems: "center", flexDirection: "row"}}>
                                                        <ComponentCommercialTime iHeight={height * 0.025} iWidth={height * 0.025} iColor={"#000"}/>
                                                        <Text style={{fontWeight: "400", fontSize: RFPercentage(1.6), color: "#111111", marginRight: "5%"}}>{item.order}분</Text>
                                                        <ComponentCommercialPark iHeight={height * 0.025} iWidth={height * 0.025} iColor={"#000"}/>
                                                        <Text style={{fontWeight: "400", fontSize: RFPercentage(1.6), color: "#111111"}}>{item.parking}분</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        ) 
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{height: height * 0.16, alignItems: "center" }}>
                        <View style={{height: height * 0.05, backgroundColor: "#fff", width, justifyContent: "flex-end", marginLeft: "10%"}}>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>광고 사용기간을 입력해주세요</Text>
                        </View>
                        <View style={{height: height * 0.11, width: width * 0.9, alignItems: "center", flexDirection: "row", marginLeft: "5%", marginRight: "5%" }}>
                            <DateTimePickerModal
                                isVisible={fDatePickerVisible}
                                mode="date"
                                confirmTextIOS="확인"
                                cancelTextIOS="취소"
                                onConfirm={handleFromConfirm}
                                onCancel={hideFromDatePicker}
                            />
                            <TouchableOpacity onPress={() => setFDatePickerVisibility(true)} style={{height: height * 0.06, width: "43%", backgroundColor: "#FAFAFB", borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: "4%"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#333D4B"}}>{fromDate}</Text>
                            </TouchableOpacity>
                            <View style={{height: "100%", width: "10%", marginRight: "5%", justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontWeight: "800", fontSize: RFPercentage(1.9), color: "#333D4B" }}>부터</Text>
                            </View>
                            <View style={{height: height * 0.06, width: "25%", borderRadius: 10, alignItems: "center", justifyContent: "center"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#333D4B"}}>
                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(1.9), color: "#6490E7"}}>
                                        30일
                                    </Text>
                                    동안
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{height: height / 6 , backgroundColor: "#fff", justifyContent: "center"}}>
                    <TouchableOpacity
                        onPress={insertCouponCommercial}
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
                        <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>장바구니에 담기</Text>
                    </TouchableOpacity>
                </View>
            </>
            }
        </View>
    )
}

export default Detail;