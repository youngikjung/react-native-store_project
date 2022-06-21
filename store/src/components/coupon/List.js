import React, {useState,useEffect,useRef} from 'react';
import { View, Dimensions, Text, TouchableOpacity, Image, FlatList, KeyboardAvoidingView, TextInput, Keyboard, StatusBar, Platform } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import LottieView from 'lottie-react-native';
import moment from 'moment-timezone';
import 'moment/locale/ko';

import { AppRoute } from '../../routes/AppRoutes';

import { ComConfirmDeleteCoupon, ComConfirmDetailCoupon, CompModalEventCouponDetail } from '../../components/modal/AppModalContent';

import { ComponentDelete } from '../../assets/svg/delete';
import { ComponentArrowLeft3 } from '../../assets/svg/arrowLeft3';
import { ComponentMore } from '../../assets/svg/more';
import { ComponentQuestionMark } from '../../assets/svg/question_mark';

import CouponImg from '../../assets/img/coupon.png';

const { width, height } = Dimensions.get('window');

const List = ({ fnGoBack, sProps, fnInsert, iLocation, paramData, initData }) => {
    const [loading, setLoading] = useState(false);

    const [sList, setList] = useState([]);

    const goBack = async () => {
        if(fnGoBack !== undefined && typeof fnGoBack === "function"){
            await fnGoBack();
        }
    }

    const locationBack = async () => {
        if(iLocation !== undefined && paramData !== undefined && iLocation !== ""){
            sProps.appManager.navGoTo('reset', AppRoute.COMMERCIAL, { sParam: paramData, iParam: initData } )
        }
    }

    const confirmDelete = async (sIndex) => {
        sProps.appManager.showModal(
            true,
            <ComConfirmDeleteCoupon
                fnClose={() => sProps.appManager.hideModal()}
                fnDeleteCoupon={() => deleteCoupon(sIndex)}
            />, 
            "custom"
        );
    }

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

    const openStampEvent = async () => {
        sProps.appManager.showModal(
            true,
            <CompModalEventCouponDetail
                fnClose={() => sProps.appManager.hideModal()}
            />, 
            "custom"
        );
    }

    const changeState = async () => {
        if(fnInsert !== undefined && typeof fnInsert === "function"){
            await fnInsert();
        }
    }

    const deleteCoupon = async (sIndex) => {
        await sProps.appManager.hideModal()
        setLoading(true);
        
        const oData = {
            store_id: sProps.UserConfigReducer.StoreID,
            couponId: sIndex.id,
        }
        const oResponse = await sProps.appManager.accessAxios("/app/ceo/coupon/delete", "post", null, oData);
        if(oResponse !== undefined){
            getCouponList();
        }
        setLoading(false);
    }

    const getCouponList = async () => {
        setLoading(true);

        const store_id = sProps.UserConfigReducer.StoreID;
        const oResponse = await sProps.appManager.accessAxios("/app/ceo/coupon/list-" + store_id, "get", "text", null);
        if(oResponse !== undefined){
            setList(oResponse);
        }

        setLoading(false);
    }

    useEffect(() => {
        getCouponList();
    }, []);

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            {loading ?
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
                :
                <>
                    {iLocation !== "" ?
                    <View style={{height: height * 0.08 }}>
                        <TouchableOpacity onPress={locationBack} style={{ position: "absolute", top: height * 0.02, left: width * 0.05, height: height * 0.05, width: height * 0.05, justifyContent: "center", alignItems: "center"}}>
                            <ComponentArrowLeft3 iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
                        </TouchableOpacity>
                        <View style={{flex:1, alignItems: "flex-start", justifyContent: "center", paddingLeft: width * 0.07 + height * 0.05 }}>
                            <Text style={{fontWeight: "700", fontSize: RFPercentage(2.1), color: "#191F28", marginTop: "3%"}}>쿠폰 관리</Text>
                        </View>
                    </View>
                    :
                    <View style={{height: height * 0.08 }}>
                        <View style={{flex:1, alignItems: "flex-start", justifyContent: "center", paddingLeft: width * 0.07 }}>
                            <Text style={{fontWeight: "700", fontSize: RFPercentage(2.1), color: "#191F28", marginTop: "3%"}}>쿠폰 관리</Text>
                        </View>
                        <TouchableOpacity onPress={goBack} style={{ position: "absolute", top: height * 0.02, right: width * 0.05, height: height * 0.05, width: height * 0.05, justifyContent: "center", alignItems: "center"}}>
                            <ComponentDelete iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
                        </TouchableOpacity>
                    </View>
                    }
                    <View style={{flex:1, backgroundColor: "#fff"}}>
                        <View style={{height: height * 0.02}}/>
                        <FlatList
                            data={sList}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={() => {
                                return (
                                    <View style={{flex:1, backgroundColor: "#fff"}}>
                                        <View style={{height: height * 0.1}} />
                                        <View style={{height: height * 0.2, justifyContent: "center", alignItems: "center"}}>
                                            <Image source={CouponImg} style={{height: height * 0.1, width: height * 0.15, borderRadius: 5, resizeMode: "center"}}/>
                                        </View>
                                        <View style={{height: height * 0.1, justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ fontSize: RFPercentage(2.5), fontWeight: '600', color: '#191F28' }}>쿠폰 이벤트</Text>
                                        </View>
                                        <View style={{height: height * 0.03, alignItems: "center", justifyContent: "space-between" }}>
                                            <Text style={{ fontSize: RFPercentage(2), fontWeight: '600', color: '#333D4B' }}>지금 바로 고객에게 쿠폰을 제공해보세요!</Text>
                                        </View>
                                        <TouchableOpacity onPress={openStampEvent} style={{height: height * 0.03, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                                            <Text style={{ fontSize: RFPercentage(1.8), fontWeight: '400', color: '#6B7583' }}>고객님에게 보여지는 앱화면 확인하기</Text>
                                            <ComponentQuestionMark iHeight={height * 0.02} iWidth={height * 0.05} iColor={"#000"}/>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }}
                            ItemSeparatorComponent={() => {
                                return (
                                    <View style={{height: height * 0.03}}/>
                                )
                            }}
                            keyExtractor={(data, index) => "list-" + index.toString()}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{height: height * 0.2, justifyContent: "center", alignItems: "center"}}>
                                        <View 
                                            style={{
                                                height: height * 0.2,
                                                width: "90%",
                                                borderRadius: width * 0.03,
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
                                            <LinearGradient 
                                                start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                                colors={['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#ffcdd2']} 
                                                style={{ height: height * 0.2, width: "100%", borderRadius: width * 0.03, flexDirection: "row" }}
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
                                                    <TouchableOpacity onPress={() => confirmDelete(item)} style={{flex:1, justifyContent: "center", alignItems: "center"}}>
                                                        <View style={{ height: height * 0.04, width: width * 0.14, backgroundColor: "#EF4452", borderRadius: width * 0.02, justifyContent: "center", alignItems: "center"}}>
                                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#fff" }}>삭제</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => confirmDetail(item)} style={{flex:1, justifyContent: "center", alignItems: "center"}}>
                                                        <ComponentMore iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#001E62"}/>
                                                        <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#001E62", marginTop: "8%" }}>더보기</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </LinearGradient>
                                        </View>
                                    </View>
                                )
                            }}
                        />
                    </View>
                    <View style={{height: height / 6 , backgroundColor: "#fff", justifyContent: "center"}}>
                        <TouchableOpacity
                            onPress={changeState}
                            style={{
                                height: height / 14,
                                backgroundColor: '#6490E7',
                                marginLeft: '5%',
                                marginRight: '5%',
                                borderRadius: 8,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>쿠폰 만들기</Text>
                        </TouchableOpacity>
                    </View>
                </>
            }
        </View>
    )
}

export default List;