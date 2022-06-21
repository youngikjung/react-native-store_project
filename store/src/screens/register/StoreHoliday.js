import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, FlatList, ScrollView } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment-timezone';
import 'moment/locale/ko';

import { CompModalTemperaryContent, CompModalRegularContent, CompModalContent, CompWeekModal } from '../../components/modal/ModalContents';

import { ComponentDelete } from '../../assets/svg/delete';
import { ComponentArrowLeft3 } from '../../assets/svg/arrowLeft3';
import { ComponentArrowDown1 } from '../../assets/svg/arrow_down1';
import { ComponentCalender2 } from '../../assets/svg/calender_2';

import { AppRoute } from '../../routes/AppRoutes';

const { width, height } = Dimensions.get('window');
const stringList = [
    { id: 1, value : "1", name : "매주"},
    { id: 1, value : "2", name : "매달 첫주"},
    { id: 1, value : "3", name : "매달 둘째주"},
    { id: 1, value : "4", name : "매달 셋째주"},
    { id: 1, value : "5", name : "매달 넷째주"},
    { id: 1, value : "6", name : "매달 다섯째주"},
    { id: 1, value : "7", name : "매달 마지막주"},
];
const dayList = [
    { id: 1, value : "1", name : "월요일"},
    { id: 1, value : "2", name : "화요일"},
    { id: 1, value : "3", name : "수요일"},
    { id: 1, value : "4", name : "목요일"},
    { id: 1, value : "5", name : "금요일"},
    { id: 1, value : "6", name : "토요일"},
    { id: 1, value : "0", name : "일요일"},
];

const StoreHoliday = oProps => {
    const [loading, setLoading] = useState(false);
    const [sLocation, setLocation] = useState("");

    const [fDatePickerVisible, setFDatePickerVisibility] = useState(false);
    const [tDatePickerVisible, setTDatePickerVisibility] = useState(false);

    const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
    const [fromNmDate, setFromNmDate] = useState(moment().format("YY.MM.DD"));
    const [toDate, setToDate] = useState(moment().add("days", 1).format("YYYY-MM-DD"));
    const [toNmDate, setToNmDate] = useState(moment().add("days", 1).format("YY.MM.DD"));

    const [regularDayList, setRegularDayList] = useState([]);

    const [temperaryHoliday, setTemperaryHoliday] = useState(false);

    const [iCount, setCount] = useState(0);

    const findUrl = () => {
        let temp = AppRoute.HOME;
        if (sLocation === "order"){
            temp = AppRoute.ORDER;
        } else if (sLocation === "manage"){
            temp = AppRoute.QUICKMANAGE;
        } else if (sLocation === "list"){
            temp = AppRoute.ORDERLIST;
        } else if (sLocation === "product"){
            temp = AppRoute.QUICKINSERT;
        }
        oProps.appManager.navGoTo('reset', temp);
    }

    const backToInfomation = () => {
        oProps.appManager.navGoTo('reset', AppRoute.STOREIMAGES);
    }

    const asyncData = async () => {
        setLoading(true);
        const store_id = oProps.UserConfigReducer.StoreID;
        const oResponse = await oProps.appManager.accessAxios("/app/sales/store/getStoreHoliday-" + store_id, "get", "text", null);
        if(oResponse !== undefined && oResponse !== null){
            setFromNmDate(moment(oResponse.holiday_from).format("YY.MM.DD"));
            setToNmDate(moment(oResponse.holiday_to).format("YY.MM.DD"));
            setFromDate(oResponse.holiday_from);
            setToDate(oResponse.holiday_to);
            setRegularDayList(oResponse.official);
            setCount(oResponse.oKey);
            setTemperaryHoliday(oResponse.tCheck);
        }
        setLoading(false);
    }

    const openModal = (sIndex) => {
        oProps.appManager.showModal(
            true,
            <CompModalContent sText={sIndex}/>, 
            "custom",
            2500
        );
    };

    const checkDeleteTemperaryState = () => {
        setTemperaryHoliday(false);
        oProps.appManager.hideModal();
    }

    const openTemperaryModal = () => {
        oProps.appManager.showModal(
            true,
            <CompModalTemperaryContent
                fnClose={() => oProps.appManager.hideModal()}
                fnConfirm={() => checkDeleteTemperaryState()}
            />, 
            "custom"
        );
    };

    const openRegularModal = (key) => {
        oProps.appManager.showModal(
            true,
            <CompModalRegularContent
                sKey={key}
                fnClose={() => oProps.appManager.hideModal()}
                fnConfirm={(sIndex) => deleteList(sIndex)}
            />, 
            "custom"
        );
    };

    const access = async () => {
        setLoading(true);

        const oData = {
            iList: regularDayList,
            fromDate : moment(fromDate).format("YYYY-MM-DD"),
            toDate : moment(toDate).format("YYYY-MM-DD"),
            temperaryHoliday,
            storeId: oProps.UserConfigReducer.StoreID
        }
        const oResponse = await oProps.appManager.accessAxios("/app/sales/store/register/editStoreHoliday", "post", null, oData);
        if(oResponse !== undefined){
            if(!oResponse){
                openModal("문제가 발생했습니다 관리자에 연락바랍니다.");
            } else {
                if(sLocation !== ""){
                    let temp = AppRoute.HOME;
                    if (sLocation === "order"){
                        temp = AppRoute.ORDER;
                    } else if (sLocation === "manage"){
                        temp = AppRoute.QUICKMANAGE;
                    } else if (sLocation === "list"){
                        temp = AppRoute.ORDERLIST;
                    } else if (sLocation === "product"){
                        temp = AppRoute.QUICKINSERT;
                    }
                    oProps.appManager.navGoTo('reset', temp);
                } else {
                    let oUserConfig = {};
    
                    oUserConfig['STOREHOLIDAY'] = false;
                    oUserConfig['STOREPICKUPZONE'] = true;
    
                    await oProps.reduxSetUserConfig(oUserConfig);
                    oProps.appManager.navGoTo('reset', AppRoute.STOREPICKUPZONE);
                }
            }
        }
        setLoading(false);
    }

    const handleFromConfirm = (date) => {
        setFromDate(moment(date).format("YYYY-MM-DD"));
        setFromNmDate(moment(date).format("YY.MM.DD"));
        hideFromDatePicker();
    };

    const hideToDatePicker = () => {
        setTDatePickerVisibility(false);
    };

    const handleToConfirm = (date) => {
        setToDate(moment(date).format("YYYY-MM-DD"));
        setToNmDate(moment(date).format("YY.MM.DD"));
        hideToDatePicker();
    };

    const hideFromDatePicker = () => {
        setFDatePickerVisibility(false);
    };

    const sItemSave = (sKey, sIndex, kIndex) => {
        let sList = regularDayList;
        const index = sList.findIndex((data) => sKey === data.key);
        const item = {
            key: sKey,
            sMethodValue : sIndex,
            sDayValue : kIndex,
        }
        sList.splice(index, 1, item);
        setRegularDayList(sList);
    }

    const deleteList = (key) => {
        let tempList = regularDayList;
        setRegularDayList(tempList.filter((item) => item.key !== parseInt(key)));
        oProps.appManager.hideModal();
    }

    const insertHoliday = () => {
        if(regularDayList.length < 5){
            const newData = {
                key: iCount + 1,
                sMethodValue : "1",
                sDayValue : "1",
            };
            setRegularDayList([...regularDayList, newData]);
            setCount(iCount + 1);
        }
    };

    useEffect(() => {
        oProps.appManager.hideModal();
        oProps.appManager.hideDrawer();
        if(oProps.initialProps !== undefined && oProps.initialProps !== null){
            if(oProps.initialProps.route !== undefined && oProps.initialProps.route !== null){
                if(oProps.initialProps.route.params !== undefined && oProps.initialProps.route.params !== null){
                    const initital = oProps.initialProps.route.params;
                    setLocation(initital.sParam);
                }
            }
        }
        asyncData();
    }, []);

    return (
        <View activeOpacity={1} style={{flex:1, backgroundColor: "#fff"}}>
            <View style={{height: height * 0.1, backgroundColor: "#fff", justifyContent: "flex-end", marginLeft: "5%"}}>
                {sLocation !== "" ?
                    <TouchableOpacity activeOpacity={0.8} onPress={findUrl} style={{ height: "50%", width: "10%", justifyContent: "center", alignItems: "flex-start"}}>
                        <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.05} iColor={"#646970"}/>
                    </TouchableOpacity>
                :
                    <TouchableOpacity activeOpacity={0.8} onPress={backToInfomation} style={{ height: "50%", width: "10%", justifyContent: "center", alignItems: "flex-start"}}>
                        <ComponentArrowLeft3 iHeight={height * 0.025} iWidth={width * 0.05} iColor={"#646970"}/>
                    </TouchableOpacity>
                }
            </View>
            {sLocation !== "" ?
                <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", marginLeft: "5%"}}>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>휴무일을 설정해주세요.</Text>
                </View>

            :
                <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", marginLeft: "5%"}}>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>
                        휴무일을 설정해주세요
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#919AA7", lineHeight: RFPercentage(3.5) }}>
                           (선택)
                        </Text>
                    </Text>
                </View>
            }
            <View style={{flex: 1}}>
                <ScrollView style={{flex:1}}>
                    <View style={{minHeight: height * 0.15, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", borderBottomColor: "#F2F3F5", borderBottomWidth: 1}}>
                        <View style={{height: height * 0.05, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>정기휴무</Text>
                        </View>
                        {regularDayList.length > 0 &&
                            <>
                                {regularDayList.map((item,index) => {
                                    return (
                                        <ItemBox
                                            key={index}
                                            sItem={item}
                                            sProps={oProps}
                                            fnDeleteList={(sIndex) => openRegularModal(sIndex)}
                                            fnItemSave={(sKey, sIndex, kIndex) => sItemSave(sKey, sIndex, kIndex)}
                                        />
                                    )
                                })}
                            </>
                        }
                        {regularDayList.length < 5 && 
                            <TouchableOpacity activeOpacity={0.8} onPress={insertHoliday} style={{height: height * 0.1, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#6490E7" }}>+ 정기휴무 추가</Text>
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={{minHeight: height * 0.19, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                        <View style={{height: height * 0.06, backgroundColor: "#fff", width, justifyContent: "flex-end", marginLeft: "10%"}}>
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>임시휴무</Text>
                        </View>
                        {temperaryHoliday ?
                            <View style={{height: height * 0.1, backgroundColor: "#fff", width: "100%", alignItems: "center", marginLeft: "10%", flexDirection: "row"}}>
                                <DateTimePickerModal
                                    isVisible={fDatePickerVisible}
                                    mode="date"
                                    locale="ko-Kore_KR"
                                    confirmTextIOS="확인"
                                    cancelTextIOS="취소"
                                    onConfirm={handleFromConfirm}
                                    onCancel={hideFromDatePicker}
                                />
                                <DateTimePickerModal
                                    isVisible={tDatePickerVisible}
                                    mode="date"
                                    locale="ko-Kore_KR"
                                    confirmTextIOS="확인"
                                    cancelTextIOS="취소"
                                    onConfirm={handleToConfirm}
                                    onCancel={hideToDatePicker}
                                />
                                <TouchableOpacity activeOpacity={0.8} onPress={() => setFDatePickerVisibility(true)} style={{height: height * 0.07, backgroundColor: "#FAFAFB", width: width * 0.3, justifyContent: "center", marginRight: "5%", borderRadius: 5, borderWidth: 1, borderColor: "#EFF0F6"}}>
                                    <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#3B3B46", marginLeft: "10%" }}>{fromNmDate}</Text>
                                    <View style={{position: "absolute", bottom: "20%", backgroundColor: "#FAFAFB",height: height * 0.04, width: width * 0.1, right: "0%", justifyContent: "center", alignItems: "center"}}>
                                        <ComponentCalender2 iHeight={height * 0.02} iWidth={height * 0.02} iColor={"#646970"}/>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => setTDatePickerVisibility(true)} style={{height: height * 0.07, backgroundColor: "#FAFAFB", width: width * 0.3, justifyContent: "center", marginRight: "5%", borderRadius: 5, borderWidth: 1, borderColor: "#EFF0F6"}}>
                                    <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#3B3B46", marginLeft: "10%" }}>{toNmDate}</Text>
                                    <View style={{position: "absolute", bottom: "20%", backgroundColor: "#FAFAFB",height: height * 0.04, width: width * 0.1, right: "0%", justifyContent: "center", alignItems: "center"}}>
                                        <ComponentCalender2 iHeight={height * 0.02} iWidth={height * 0.02} iColor={"#646970"}/>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => openTemperaryModal()} style={{height: height * 0.07, backgroundColor: "#fff", borderWidth: 1, borderColor: "#EF4452", width: width * 0.17, justifyContent: "center", alignItems: "center",borderRadius: 5}}>
                                    <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#EF4452" }}>삭제</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <TouchableOpacity activeOpacity={0.8} onPress={() => setTemperaryHoliday(true)} style={{height: height * 0.13, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#6490E7" }}>+ 임시휴무 추가</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </ScrollView>
            </View>
            <View style={{height: height / 8 , backgroundColor: "#fff", justifyContent: "center"}}>
                <TouchableOpacity
                    onPress={access}
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
                    <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>{sLocation !== "" ? "적용" : "다음"}</Text>
                </TouchableOpacity>
            </View>
            {loading &&
                <View style={{position: "absolute", top: 0, height, width, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
        </View>
    )
}

const ItemBox = ({ sItem, fnDeleteList, fnItemSave, sProps }) => {
    const [sMethodName, setMethodName] = useState("주기");
    const [sMethodValue, setMethodValue] = useState("");
    const [sDayName, setDayName] = useState("요일");
    const [sDayValue, setDayValue] = useState("");

    const deleteList = async (key) => {
        if(fnDeleteList !== undefined && typeof fnDeleteList === "function"){
            await fnDeleteList(key);
        }
    }

    const sItemSave = async (sIndex,aIndex,zIndex) => {
        if(fnItemSave !== undefined && typeof fnItemSave === "function"){
            await fnItemSave(sIndex,aIndex,zIndex);
        }
    }

    const changeMethodValue = async (sIndex) => {
        setMethodName(sIndex.name);
        setMethodValue(sIndex.value);
        sItemSave(sItem.key, sIndex.value, sDayValue);
        await sProps.appManager.hideModal();
    }

    const changeDayValue = async (sIndex) => {
        setDayName(sIndex.name);
        setDayValue(sIndex.value);
        sItemSave(sItem.key, sMethodValue, sIndex.value);
        await sProps.appManager.hideModal();
    }

    const openWeekModal = (sIndex,aIndex) => {
        sProps.appManager.showModal(
            true,
            <CompWeekModal
                sType={aIndex} 
                sList={sIndex}
                fnChangeMethodValue={(sIndex) => changeMethodValue(sIndex)}
                fnChangeDayValue={(sIndex) => changeDayValue(sIndex)}
            />, 
            "custom"
        );
    }

    const checkUpDate = () => {
        if(sItem.sMethodValue.toString() === "1"){
            setMethodName("매주");
            setMethodValue("1");
        } else if (sItem.sMethodValue.toString() === "2"){
            setMethodName("매달 첫주");
            setMethodValue("2");
        } else if (sItem.sMethodValue.toString() === "3"){
            setMethodName("매달 둘째주");
            setMethodValue("3");
        } else if (sItem.sMethodValue.toString() === "4"){
            setMethodName("매달 셋째주");
            setMethodValue("4");
        } else if (sItem.sMethodValue.toString() === "5"){
            setMethodName("매달 넷째주");
            setMethodValue("5");
        } else if (sItem.sMethodValue.toString() === "6"){
            setMethodName("매달 다섯째주");
            setMethodValue("6");
        } else if (sItem.sMethodValue.toString() === "7"){
            setMethodName("매달 마지막주");
            setMethodValue("7");
        }
    }
    const checkUpWeek = () => {
        if(sItem.sDayValue.toString() === "1"){
            setDayName("월요일");
            setDayValue("1");
        } else if (sItem.sDayValue.toString() === "2"){
            setDayName("화요일");
            setDayValue("2");
        } else if (sItem.sDayValue.toString() === "3"){
            setDayName("수요일");
            setDayValue("3");
        } else if (sItem.sDayValue.toString() === "4"){
            setDayName("목요일");
            setDayValue("4");
        } else if (sItem.sDayValue.toString() === "5"){
            setDayName("금요일");
            setDayValue("5");
        } else if (sItem.sDayValue.toString() === "6"){
            setDayName("토요일");
            setDayValue("6");
        } else if (sItem.sDayValue.toString() === "0"){
            setDayName("일요일");
            setDayValue("0");
        }
    }

    useEffect(() => {
        checkUpDate();
        checkUpWeek();
    }, [sItem]);

    return (
        <View key={sItem.key} style={{height: height * 0.1, backgroundColor: "#fff", width: "100%", alignItems: "center", marginLeft: "10%", flexDirection: "row"}}>
            <TouchableOpacity onPress={() => openWeekModal(stringList,"week")} style={{height: height * 0.07, backgroundColor: "#FAFAFB", width: width * 0.33, justifyContent: "center", marginRight: "5%", borderRadius: 5, borderWidth: 1, borderColor: "#EFF0F6"}}>
                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#3B3B46", marginLeft: "10%" }}>{sMethodName}</Text>
                <View style={{position: "absolute", bottom: "20%", backgroundColor: "#FAFAFB",height: height * 0.04, width: width * 0.1, right: "0%", justifyContent: "center", alignItems: "center"}}>
                    <ComponentArrowDown1 iHeight={height * 0.025} iWidth={height * 0.025} iColor={"#646970"}/>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openWeekModal(dayList,"date")} style={{height: height * 0.07, backgroundColor: "#FAFAFB", width: width * 0.27, justifyContent: "center", marginRight: "5%", borderRadius: 5, borderWidth: 1, borderColor: "#EFF0F6"}}>
                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#3B3B46", marginLeft: "10%" }}>{sDayName}</Text>
                <View style={{position: "absolute", bottom: "20%", backgroundColor: "#FAFAFB",height: height * 0.04, width: width * 0.1, right: "0%", justifyContent: "center", alignItems: "center"}}>
                    <ComponentArrowDown1 iHeight={height * 0.025} iWidth={height * 0.025} iColor={"#646970"}/>
                </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={() => deleteList(sItem.key)} style={{height: height * 0.07, backgroundColor: "#fff", borderWidth: 1, borderColor: "#EF4452", width: width * 0.17, justifyContent: "center", alignItems: "center",borderRadius: 5}}>
                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#EF4452" }}>삭제</Text>
            </TouchableOpacity>
        </View>
    )
}

export default StoreHoliday;