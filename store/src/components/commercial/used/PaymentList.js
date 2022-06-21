import React, {useState,useEffect,useRef} from 'react';
import { View, Dimensions, Text, TouchableOpacity, Image, FlatList, ScrollView, TextInput, Keyboard, StatusBar, Platform } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import LottieView from 'lottie-react-native';
import moment from 'moment-timezone';
import 'moment/locale/ko';

import { ComponentSearch } from '../../../assets/svg/search';

const { width, height } = Dimensions.get('window');
const defaultFormat = "YYYY/MM/DD";

const CommercialUserList = ({ iProps }) => {
    const [loading, setLoading] = useState(false);

    const [list, setList] = useState([]);

    const [fDatePickerVisible, setFDatePickerVisibility] = useState(false);
    const [tDatePickerVisible, setTDatePickerVisibility] = useState(false);

    const [fromDate, setFromDate] = useState(moment().add(-30, 'days').format(defaultFormat));
    const [toDate, setToDate] = useState(moment().add("days", 1).format(defaultFormat));

    const handleFromConfirm = (date) => {
        setFromDate(moment(date).format(defaultFormat));
        hideFromDatePicker();
    };

    const hideToDatePicker = () => {
        setTDatePickerVisibility(false);
    };

    const handleToConfirm = (date) => {
        setToDate(moment(date).format(defaultFormat));
        hideToDatePicker();
    };

    const hideFromDatePicker = () => {
        setFDatePickerVisibility(false);
    };

    const asyncData = async () => {
        setLoading(true);
        const oData = {
            store_id: iProps.UserConfigReducer.StoreID,
            fromData: fromDate,
            toData: toDate
        }
        const oResponse = await iProps.appManager.accessAxios("/store/commercial/paymentList", "post", "login", oData);
        if(oResponse !== undefined){
            if(oResponse){
                setList(oResponse);
            }
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
            <>
                <View style={{height: height * 0.14, alignItems: "center" }}>
                    <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "flex-end", marginLeft: "10%"}}>
                        <Text style={{fontWeight: "900", fontSize: RFPercentage(1.9), color: "#4E5867" }}>광고 결제내역</Text>
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
                        <DateTimePickerModal
                            isVisible={tDatePickerVisible}
                            mode="date"
                            confirmTextIOS="확인"
                            cancelTextIOS="취소"
                            onConfirm={handleToConfirm}
                            onCancel={hideToDatePicker}
                        />
                        <TouchableOpacity onPress={() => setFDatePickerVisibility(true)} style={{height: height * 0.06, width: "32%", backgroundColor: "#FAFAFB", borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: "4%"}}>
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#333D4B"}}>{fromDate}</Text>
                        </TouchableOpacity>
                        <View style={{height: "100%", width: "5%", marginRight: "5%", justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.9), color: "#333D4B" }}>~</Text>
                        </View>
                        <TouchableOpacity onPress={() => setTDatePickerVisibility(true)} style={{height: height * 0.06, width: "32%", backgroundColor: "#FAFAFB", borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: "7%"}}>
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#333D4B"}}>{toDate}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => asyncData()} style={{height: height * 0.06, width: height * 0.06, backgroundColor: "#E8EFFC", borderRadius: width, alignItems: "center", justifyContent: "center"}}>
                            <ComponentSearch iHeight={height * 0.025} iWidth={height * 0.025} iColor={"#6490E7"}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex:1, justifyContent: "center", alignItems: "center"}}>
                    <View style={{ height: height * 0.45, width: width * 0.9}}>
                        <FlatList
                            data={list}
                            ListFooterComponent={<View style={{ height: height * 0.03 }} />}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(data, index) => "list-" + index + Math.random()}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{height: height * 0.34, justifyContent: "center", alignItems: "center", borderBottomColor: "#DFE1E6", borderBottomWidth: 2}}>
                                        <View style={{ height: height * 0.05, width: width * 0.9, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingLeft: "5%", paddingRight: "5%"}}>
                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#191F28"}}>날짜</Text>
                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#191F28"}}>{item.date}</Text>
                                        </View>
                                        <View style={{ height: height * 0.05, width: width * 0.9, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingLeft: "5%", paddingRight: "5%"}}>
                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#191F28"}}>무상 포인트</Text>
                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#191F28"}}>{item.freeAmount}P</Text>
                                        </View>
                                        <View style={{ height: height * 0.05, width: width * 0.9, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingLeft: "5%", paddingRight: "5%"}}>
                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#191F28"}}>유상 포인트</Text>
                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#191F28"}}>{item.chargedAmount}P</Text>
                                        </View>
                                        <View style={{ height: height * 0.05, width: width * 0.9, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingLeft: "5%", paddingRight: "5%"}}>
                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#191F28"}}>광고금액</Text>
                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#191F28"}}>{item.cartAmount}</Text>
                                        </View>
                                        <View style={{ height: height * 0.05, width: width * 0.9, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingLeft: "5%", paddingRight: "5%"}}>
                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#191F28"}}>결제금액</Text>
                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#191F28"}}>{item.payment}</Text>
                                        </View>
                                        <View style={{ height: height * 0.05, width: width * 0.9, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingLeft: "5%", paddingRight: "5%"}}>
                                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#191F28"}}>내용</Text>
                                            <Text style={{fontWeight: "900", fontSize: RFPercentage(1.8), color: "#6490E7"}}>{item.type}</Text>
                                        </View>
                                    </View>
                                ) 
                            }}
                        />
                    </View>
                </View>
            </>
            }
        </View>
    )
}

export default CommercialUserList;