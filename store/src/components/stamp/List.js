import React, {useState,useEffect,useRef} from 'react';
import { View, Dimensions, Text, TouchableOpacity, Image, FlatList, KeyboardAvoidingView, TextInput, Keyboard, StatusBar, Platform } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import LottieView from 'lottie-react-native';
import moment from 'moment-timezone';
import 'moment/locale/ko';

import { StampSwitchToggle, ComConfirmDetailStamp, ComEditWarnningStamp, ComDeleteStamp, CompModalEventStampDetail } from '../../components/modal/AppModalContent';

import { ComponentDelete } from '../../assets/svg/delete';
import { ComponentMore } from '../../assets/svg/more';
import { ComponentStampIcon } from '../../assets/svg/stampIcon';
import { ComponentQuestionMark } from '../../assets/svg/question_mark';

import StampImg from '../../assets/img/stamp.png';

const { width, height } = Dimensions.get('window');

const List = ({ fnGoBack, sProps, fnInsert, fnEdit }) => {
    const [loading, setLoading] = useState(false);

    const [isLock, setIsLock] = useState(false);
    const [sList, setList] = useState([]);

    const goBack = async () => {
        if(fnGoBack !== undefined && typeof fnGoBack === "function"){
            await fnGoBack();
        }
    }

    const deleteStamp = async (sItem) => {
        let sIndex = sItem.validate;
        let aIndex = sItem.id;

        await sProps.appManager.hideModal()
        setLoading(true);
        
        const oData = {
            store_id: sProps.UserConfigReducer.StoreID,
            stampId: aIndex,
            status: sIndex,
        }
        const oResponse = await sProps.appManager.accessAxios("/app/ceo/stamp/changeState", "post", null, oData);
        if(oResponse !== undefined){
            getStampList();
        } else {
            setLoading(false);
        }

        setLoading(false);
    }

    const editEvent = async (sIndex) => {
        if(sIndex.expired || sIndex.edited || parseInt(sIndex.userEvent) > 0){
            sProps.appManager.showModal(
                true,
                <ComEditWarnningStamp
                    fnClose={() => sProps.appManager.hideModal()}
                />, 
                "custom"
            );
        } else {
            if(fnEdit !== undefined && typeof fnEdit === "function"){
                await fnEdit(sIndex);
            }
        }
    }

    const confirmDelete = async (sIndex) => {
        sProps.appManager.showModal(
            true,
            <ComDeleteStamp
                fnClose={() => sProps.appManager.hideModal()}
                fnDeleteStamp={() => deleteStamp(sIndex)}
            />, 
            "custom"
        );
    }

    const confirmDetail = async (sIndex) => {
        sProps.appManager.showModal(
            true,
            <ComConfirmDetailStamp
                sData={sIndex}
                fnClose={() => sProps.appManager.hideModal()}
            />, 
            "custom"
        );
    }

    const openStampEvent = async () => {
        sProps.appManager.showModal(
            true,
            <CompModalEventStampDetail
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

    const getStampList = async () => {
        setLoading(true);

        const store_id = sProps.UserConfigReducer.StoreID;
        const oResponse = await sProps.appManager.accessAxios("/app/ceo/stamp/list-" + store_id, "get", "text", null);
        if(oResponse !== undefined){
            setList(oResponse.sList);
            setIsLock(oResponse.isLock);
        }
        setLoading(false);
    }

    useEffect(() => {
        getStampList();
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
                            <Text style={{fontWeight: "700", fontSize: RFPercentage(2.1), color: "#191F28" }}>스템프 관리</Text>
                        </View>
                        <TouchableOpacity onPress={goBack} style={{ position: "absolute", top: height * 0.02, right: width * 0.05, height: height * 0.05, width: height * 0.05, justifyContent: "center", alignItems: "center"}}>
                            <ComponentDelete iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
                        </TouchableOpacity>
                    </View>
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
                                            <Image source={StampImg} style={{height: height * 0.1, width: height * 0.15, borderRadius: 5, resizeMode: "center"}}/>
                                        </View>
                                        <View style={{height: height * 0.1, justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ fontSize: RFPercentage(2.5), fontWeight: '600', color: '#191F28' }}>스템프 이벤트</Text>
                                        </View>
                                        <View style={{height: height * 0.03, alignItems: "center", justifyContent: "space-between" }}>
                                            <Text style={{ fontSize: RFPercentage(2), fontWeight: '600', color: '#333D4B' }}>지금 바로 단골 고객에게 스템프를 제공해보세요!</Text>
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
                                    <View style={{height: height * 0.25, justifyContent: "center", alignItems: "center"}}>
                                        <View 
                                            style={{
                                                height: height * 0.25,
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
                                                colors={['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#E7F2F8']} 
                                                style={{ height: height * 0.25, width: "100%", borderRadius: width * 0.03, flexDirection: "row" }}
                                            >
                                                <View style={{flex:0.7}}>
                                                    <View style={{flex:0.6, justifyContent: "center", paddingLeft: "10%"}}>
                                                        <Image source={StampImg} style={{height: height * 0.08, width: width * 0.3, borderRadius: 5}}/>
                                                    </View>
                                                    <View style={{flex:0.4, justifyContent: "center", paddingLeft: "10%"}}>
                                                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#000" }}>{item.name}</Text>
                                                    </View>
                                                </View>
                                                <View style={{flex:0.3}}>
                                                    <TouchableOpacity onPress={() => editEvent(item)} style={{flex:1, justifyContent: "center", alignItems: "center"}}>
                                                        <View style={{ height: height * 0.04, width: width * 0.2, backgroundColor: "#6490E7", borderRadius: width * 0.02, justifyContent: "center", alignItems: "center"}}>
                                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#fff" }}>수정하기</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    <View style={{flex:1, justifyContent: "center", alignItems: "center"}}>
                                                        <StampSwitchToggle isOn={item.validate} onToggle={() => !item.validate ? deleteStamp(item) : confirmDelete(item)}/>
                                                        {item.validate ?
                                                            <Text style={{fontWeight: "700", fontSize: RFPercentage(1.6), color: "#6490E7", marginTop: "15%"}}>신규발행중</Text>
                                                        :
                                                            <Text style={{fontWeight: "700", fontSize: RFPercentage(1.6), color: "#F45552", marginTop: "15%"}}>발행중지</Text>
                                                        }
                                                    </View>
                                                    <TouchableOpacity onPress={() => confirmDetail(item)} style={{flex:1, justifyContent: "center", alignItems: "center"}}>
                                                        <ComponentMore iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#001E62"}/>
                                                        <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#001E62", marginTop: "8%" }}>더보기</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </LinearGradient>
                                        </View>
                                        {item.edited &&
                                            <View style={{position: "absolute", height: height * 0.25, width: "90%", backgroundColor: "rgba(0, 0, 0, 0.5)", opacity: 1, borderRadius: width * 0.03, justifyContent: "center", alignItems: "center"}}>
                                                <ComponentStampIcon iHeight={height * 0.08} iWidth={height * 0.08} iColor={"#000"}/>
                                                <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#fff", marginRight: "5%"}}>수정된 스탬프</Text>
                                            </View>
                                        }
                                        {item.expired &&
                                            <View style={{position: "absolute", height: height * 0.25, width: "90%", backgroundColor: "rgba(0, 0, 0, 0.5)", opacity: 1, borderRadius: width * 0.03, justifyContent: "center", alignItems: "center"}}>
                                                <ComponentStampIcon iHeight={height * 0.08} iWidth={height * 0.08} iColor={"#000"}/>
                                                <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#fff", marginRight: "5%"}}>이용기간이 만료된 스탬프</Text>
                                            </View>
                                        }
                                    </View>
                                )
                            }}
                        />
                    </View>
                    {!isLock &&
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
                                <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>스템프 만들기</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </>
            }
        </View>
    )
}

export default List;