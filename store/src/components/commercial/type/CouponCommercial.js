
import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, FlatList, Image, ScrollView } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import LottieView from 'lottie-react-native';
import moment from 'moment-timezone';
import 'moment/locale/ko';

import { AppRoute } from '../../../routes/AppRoutes';

import CouponImg from '../../../assets/img/coupon.png';
import appBanner02 from '../../../assets/img/appBanner02.png';

import { ComponentArrowLeft3 } from '../../../assets/svg/arrowLeft3';
import { ComponentMore } from '../../../assets/svg/more';
import { ComponentSelectedCircle } from '../../../assets/svg/selected_circle';

import { ComConfirmDetailCoupon } from '../../modal/AppModalContent';
import { CompModalContent, CompCommercialSelect } from '../../modal/ModalContents';

const { width, height } = Dimensions.get('window');

const Detail = ({ sProps, fnInitReturn, iDetailData, fnInsertCart, sParam, iParam }) => {
    const [loading, setLoading] = useState(false);

    const [couponList, setCouponList] = useState([]);
    const [preList, setPreList] = useState([{ name: "스루 피자", amount: "5,000", color: "#18BAB2" },{ name: "스루 중국집", amount: "6,000", color: "#2389F7" },{ name: "스루 카페", amount: "3,000", color: "#EF4643" }]);

    const [couponId, setCouponId] = useState("");

    const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
    const [fDatePickerVisible, setFDatePickerVisibility] = useState(false);

    const backToInfomation = async () => {
        if(fnInitReturn !== undefined && typeof fnInitReturn === "function"){
            await fnInitReturn();
        }
    }

    const openModal = (sIndex) => {
        sProps.appManager.showModal(
            true,
            <CompModalContent sText={sIndex}/>, 
            "custom",
            2500
        );
    };
    
    const insertCommercial = (sIndex) => {
        let temp = [
            sIndex,{ name: "스루 피자", amount: "5,000", color: "#18BAB2" },{ name: "스루 중국집", amount: "6,000", color: "#2389F7" },{ name: "스루 카페", amount: "3,000", color: "#EF4643" },
        ] ;
        setCouponId(sIndex.id);
        setPreList(temp);
    };

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
    
    const openCommercialSelect = (sIndex) => {
        sProps.appManager.showModal(
            true,
            <CompCommercialSelect nIndex={sIndex} fnClose={() => sProps.appManager.hideModal()} fnInsert={(qIndex) => withoutData(qIndex)}/>, 
            "custom",
        );
    };

    const confirmDetail = async (sIndex) => {
        sProps.appManager.showModal(
            true,
            <ComConfirmDetailCoupon
                sData={sIndex}
                fnClose={() => sProps.appManager.hideModal()}
            />, 
            "custom"
        );
    }

    const insertCouponCommercial = async () => {
        setLoading(true);
        if(couponId === ""){
            openModal("쿠폰을 선택해주세요.");
        } else {
            let progress1 = true;
            for await (const iterator of sParam) {
                if(iterator.param === "coupon"){
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
                couponId,
                fromDate,
            }
            if(progress1){
                if(fnInsertCart !== undefined && typeof fnInsertCart === "function"){
                    await fnInsertCart(oData,"no");
                }
            } else {
                openCommercialSelect(oData);
            }
        }
        setLoading(false);
    }

    const getList = async () => {
        const store_id = sProps.UserConfigReducer.StoreID;
        const oResponse = await sProps.appManager.accessAxios("/store/commercial/coupon/getCouponList-" + store_id, "get", "login", null);
        if(oResponse !== undefined){
            setCouponList(oResponse);
        }
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
                <ScrollView style={{flex:1, backgroundColor: "#fff"}}>
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
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#111111"}}>내 주변의 쿠폰!</Text>
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
                                                <View style={{ height: height * 0.14, width: height * 0.12, justifyContent: "center", alignItems: "center", backgroundColor: item.color !== undefined && item.color !== null ? item.color : "#666666", borderRadius: width * 0.02 }}>
                                                    <View style={{ height: height * 0.04, width: "100%", alignItems: "flex-end", justifyContent: "center", marginRight: "10%"}}>
                                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.4), color: "#fff"}}>{item.name !== undefined && item.name !== null ? item.name : sProps.UserConfigReducer.StoreName }</Text>
                                                    </View>
                                                    <View style={{ height: height * 0.08, width: "100%", justifyContent: "flex-end", alignItems: "flex-end", marginRight: "10%"}}>
                                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.8), color: "#fff"}}>{item.amount}원</Text>
                                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.8), color: "#fff"}}>최대할인</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        ) 
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    {couponList.length > 0 &&
                    <>
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
                        <View style={{height: height * 0.06, alignItems: "center" }}>
                            <View style={{height: height * 0.05, backgroundColor: "#fff", width, justifyContent: "flex-end", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>광고에 사용하실 쿠폰을 선택해주세요</Text>
                            </View>
                        </View>
                        <View style={{flex:1}}>
                            {couponList.map((item, index) => {
                                return (
                                    <View key={index} style={{height: height * 0.23, justifyContent: "center", alignItems: "center"}}>
                                        <View 
                                            style={{
                                                height: height * 0.2,
                                                width: "90%",
                                                borderRadius: width * 0.03,
                                                flexDirection: "row",
                                                backgroundColor: couponId !== item.id ? "#FBFBFD" : "#DFDFE3"
                                            }}
                                        >
                                            <View style={{flex:0.7}}>
                                                <View style={{flex:1, justifyContent: "center", paddingLeft: "10%"}}>
                                                    <Image source={CouponImg} style={{height: height * 0.06, width: height * 0.1, borderRadius: 5}}/>
                                                </View>
                                                <View style={{flex:1, justifyContent: "center", paddingLeft: "10%"}}>
                                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#000" }}>{item.name}</Text>
                                                    {item.type === "amount" ?
                                                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.8), color: "#6B7583", marginTop: "5%"}}>{item.amount}원 할인쿠폰</Text>
                                                        :
                                                        <Text style={{fontWeight: "700", fontSize: RFPercentage(1.8), color: "#6B7583", marginTop: "5%"}}>{item.percent}% 할인쿠폰</Text>
                                                    }
                                                </View>
                                            </View>
                                            <View style={{flex:0.3}}>
                                                <TouchableOpacity onPress={() => insertCommercial(item)} style={{flex:1, justifyContent: "center", alignItems: "center"}}>
                                                    {couponId !== item.id ?
                                                        <View style={{ height: height * 0.04, width: width * 0.14, backgroundColor: "#E8EFFC", borderRadius: width * 0.02, justifyContent: "center", alignItems: "center"}}>
                                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#6490E7" }}>선택</Text>
                                                        </View>
                                                    :
                                                        <ComponentSelectedCircle iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
                                                    }
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => confirmDetail(item)} style={{flex:1, justifyContent: "center", alignItems: "center"}}>
                                                    <ComponentMore iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#001E62"}/>
                                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#001E62", marginTop: "8%" }}>더보기</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                    </>
                    }
                </ScrollView>
                <View style={{height: height / 6 , backgroundColor: "#fff", justifyContent: "center"}}>
                    {couponList.length > 0 ?
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
                        :
                        <TouchableOpacity
                            onPress={() => sProps.appManager.navGoTo('reset', AppRoute.COUPON, { sParam: "commercial", iParam: iDetailData, aParam: iParam } )}
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
                            <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>우리 매장 쿠폰 만들기</Text>
                        </TouchableOpacity>
                    }
                </View>
            </>
            }
        </View>
    )
}

export default Detail;