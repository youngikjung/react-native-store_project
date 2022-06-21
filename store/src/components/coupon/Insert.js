import React, {useState,useEffect,useRef} from 'react';
import { View, Dimensions, Text, TouchableOpacity, Image, FlatList, ScrollView, TextInput, Keyboard, StatusBar, Platform } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import LottieView from 'lottie-react-native';
import moment from 'moment-timezone';
import 'moment/locale/ko';

import { ComSelectionData, CompModalContent } from '../../components/modal/AppModalContent';

import { AppRoute } from '../../routes/AppRoutes';

import { ComponentSelectedCircle } from '../../assets/svg/selectedCircle';
import { ComponentUnSelectedCircle } from '../../assets/svg/unselectedCircle';
import { ComponentDelete } from '../../assets/svg/delete';
import { ComponentArrowDown1 } from '../../assets/svg/arrow_down1';
import { ComponentMore } from '../../assets/svg/more';
import CouponImg from '../../assets/img/coupon.png';

const { width, height } = Dimensions.get('window');

const List = ({ fnGoBack, sProps, iLocation, paramData, initData }) => {
    const [loading, setLoading] = useState(false);
    
    const [percentList] = useState([
        { id: 5, name: "5% 할인 쿠폰" },
        { id: 10, name: "10% 할인 쿠폰" },
        { id: 15, name: "15% 할인 쿠폰" },
        { id: 20, name: "20% 할인 쿠폰" },
        { id: 30, name: "30% 할인 쿠폰" },
        { id: 40, name: "40% 할인 쿠폰" },
        { id: 50, name: "50% 할인 쿠폰" },
        { id: 60, name: "60% 할인 쿠폰" },
        { id: 70, name: "70% 할인 쿠폰" },
        { id: 80, name: "80% 할인 쿠폰" },
        { id: 90, name: "90% 할인 쿠폰" }
    ]);

    const [cNm, setNm] = useState("");
    const [countType, setCountType] = useState("unlimit");
    const [couponCount, setCouponCount] = useState("");
    const [couponType, setCouponType] = useState("amount");
    const [cAmount, setAmount] = useState("");
    const [cPercent, setPercent] = useState("5% 할인 쿠폰");
    const [sPercent, setSPercent] = useState(5);
    const [sMaxAmount, setMaxAmount] = useState("");
    const [sLimitAmount, setSLimitAmount] = useState("");
    const [limitAmount, setLimitAmount] = useState(false);
    const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
    const [toDate, setToDate] = useState(moment().add("days", 1).format("YYYY-MM-DD"));

    const [sNmErrColor, setNmErrColor] = useState("#F2F3F5");
    const [sAmountErrColor, setAmountErrColor] = useState("#F2F3F5");
    const [sCouponCountErrColor, setCouponCountErrColor] = useState("#F2F3F5");
    const [sMaxAmountErrColor, setMaxAmountErrColor] = useState("#F2F3F5");
    const [sLimitAmountErrColor, setLimitAmountErrColor] = useState("#F2F3F5");

    const [fDatePickerVisible, setFDatePickerVisibility] = useState(false);
    const [tDatePickerVisible, setTDatePickerVisibility] = useState(false);

    const [textInputType, setTextInputType] = useState("");

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const goBack = async () => {
        if(fnGoBack !== undefined && typeof fnGoBack === "function"){
            await fnGoBack();
        }
    }
    
    const changeState = async () => {
        let process1 = false;
        let process2 = false;
        let process3 = false;
        let process4 = false;

        setLoading(true);
        
        if(cNm === ""){
            setNmErrColor("#EF4452");
        } else {
            process1 = true;
        }
        
        if(countType !== "unlimit"){
            if(couponCount === ""){
                setCouponCountErrColor("#EF4452");
            } else {
                process2 = true;
            }
        } else {
            process2 = true;
        }
        
        if(couponType === "amount"){
            if(cAmount === ""){
                setAmountErrColor("#EF4452");
            } else {
                process3 = true;
            }
        } else {
            if(sPercent === "" || parseInt(sPercent) <= 0){
            } else {
                if(sMaxAmount === "" || parseInt(sMaxAmount) <= 0){
                    setMaxAmountErrColor("#EF4452");
                } else {
                    process3 = true;
                }
            }
        }

        if(limitAmount){
            if(sLimitAmount === ""){
                setLimitAmountErrColor("#EF4452");
            } else {
                process4 = true;
            }
        } else {
            process4 = true;
        }

        if(process1 && process2 && process3 && process4){
            const oData = {
                cNm,
                couponCount,
                countType,
                sPercent,
                cAmount,
                couponType,
                limitAmount,
                sLimitAmount,
                sMaxAmount,
                store_id: sProps.UserConfigReducer.StoreID,
                startDate: fromDate,
                endDate: toDate,
                description: "스루스토어에서 생성"
            }
            const oResponse = await sProps.appManager.accessAxios("/app/ceo/coupon/insertV2", "post", null, oData);
            if(oResponse !== undefined){
                if(oResponse.resultCd === "0000"){
                    if(iLocation !== undefined && paramData !== undefined && iLocation !== ""){
                        sProps.appManager.navGoTo('reset', AppRoute.COMMERCIAL, { sParam: paramData, iParam: initData } )
                    } else {
                        if(fnGoBack !== undefined && typeof fnGoBack === "function"){
                            await fnGoBack();
                        }
                    }
                } else {
                    openModal(oResponse.resultMsg);
                }
            }
        }

        setLoading(false);
    }

    const openModal = (sIndex) => {
        sProps.appManager.showModal(
            true,
            <CompModalContent 
                sText={sIndex}
            />, 
            "custom",
            2500
        );
    };

    const onChangeType = async (sIndex) => {
        setCountType(sIndex);
    }

    const onChangeTherometer = (text) => {
        setCouponType(text);
    };

    const onChangeSet = (text) => {
        setLimitAmount(text);
    };

    const onChangeLimit = text => {
        const sUserId = text;
        const regex = /[0-9]+$/gi;
        if(sUserId === "" || sUserId === null){
            setSLimitAmount(text);
            setLimitAmountErrColor("#6490E7");
        } else {
            if (regex.test(sUserId)) {
                setSLimitAmount(text);
                setLimitAmountErrColor("#6490E7");
            } else {
                setLimitAmountErrColor("#EF4452");
            }
        }
    };

    const onChangeCount = text => {
        const sUserId = text;
        const regex = /[0-9]+$/gi;
        if(sUserId === "" || sUserId === null){
            setCouponCount(text);
            setCouponCountErrColor("#6490E7");
        } else {
            if (regex.test(sUserId)) {
                setCouponCount(text);
                setCouponCountErrColor("#6490E7");
            } else {
                setCouponCountErrColor("#EF4452");
            }
        }
    };

    const onChangeMaxAmount = text => {
        const sUserId = text;
        const regex = /[0-9]+$/gi;
        if(sUserId === "" || sUserId === null){
            setMaxAmount(text);
            setMaxAmountErrColor("#6490E7");
        } else {
            if (regex.test(sUserId)) {
                setMaxAmount(text);
                setMaxAmountErrColor("#6490E7");
            } else {
                setMaxAmountErrColor("#EF4452");
            }
        }
    };

    const onChangeAmount = text => {
        const sUserId = text;
        const regex = /[0-9]+$/gi;
        if(sUserId === "" || sUserId === null){
            setAmount(text);
            setAmountErrColor("#6490E7");
        } else {
            if (regex.test(sUserId)) {
                setAmount(text);
                setAmountErrColor("#6490E7");
            } else {
                setAmountErrColor("#EF4452");
            }
        }
    };

    const onChangeNm = text => {
        setNm(text);
        setNmErrColor("#6490E7");
    };

    const activeNmText = () => {
        setNmErrColor("#6490E7");
        setTextInputType("nm");
    }
    
    const unactiveNmText = () => {
        setNmErrColor("#F2F3F5");
        setTextInputType("");
        Keyboard.dismiss();
    }

    const activeCouponCountText = () => {
        setCouponCountErrColor("#6490E7");
        setTextInputType("count");
    }
    
    const unactiveCouponCountText = () => {
        setCouponCountErrColor("#F2F3F5");
        setTextInputType("");
        Keyboard.dismiss();
    }

    const activeAmountText = () => {
        setAmountErrColor("#6490E7");
        setTextInputType("amount");
    }
    
    const unactiveAmountText = () => {
        setAmountErrColor("#F2F3F5");
        setTextInputType("");
        Keyboard.dismiss();
    }

    const activeMaxAmountText = () => {
        setMaxAmountErrColor("#6490E7");
        setTextInputType("sMaxAmount");
    }
    
    const unactiveMaxAmountText = () => {
        setMaxAmountErrColor("#F2F3F5");
        setTextInputType("");
        Keyboard.dismiss();
    }

    const activeLimitAmountText = () => {
        setLimitAmountErrColor("#6490E7");
        setTextInputType("sLimitAmount");
    }
    
    const unactiveLimitAmountText = () => {
        setLimitAmountErrColor("#F2F3F5");
        setTextInputType("");
        Keyboard.dismiss();
    }

    const nextInputSection = (sIndex) => {
        if(sIndex === "nm"){
            unactiveNmText();
        } else if (sIndex === "amount") {
            unactiveAmountText();
        } else if (sIndex === "sMaxAmount") {
            unactiveMaxAmountText();
        } else if (sIndex === "sLimitAmount") {
            unactiveLimitAmountText();
        } else if (sIndex === "count") {
            unactiveCouponCountText();
        } else {
            Keyboard.dismiss();
            unactiveNmText();
            unactiveAmountText();
            unactiveMaxAmountText();
            unactiveLimitAmountText();
            unactiveCouponCountText();
        }
    }

    const handleFromConfirm = (date) => {
        setFromDate(moment(date).format("YYYY-MM-DD"));
        hideFromDatePicker();
    };

    const hideToDatePicker = () => {
        setTDatePickerVisibility(false);
    };

    const handleToConfirm = (date) => {
        setToDate(moment(date).format("YYYY-MM-DD"));
        hideToDatePicker();
    };

    const hideFromDatePicker = () => {
        setFDatePickerVisibility(false);
    };

    const onChangePercent = (sIndex) => {
        sProps.appManager.hideModal();
        setPercent(sIndex.name);
        setSPercent(sIndex.id);
    };

    const textSelection = async () => {
        sProps.appManager.showModal(
            true,
            <ComSelectionData
                sList={percentList}
                fnSelectValue={(sIndex) => onChangePercent(sIndex)}
            />, 
            "custom"
        );
    }

    const onKeyboardDidShow = (e) => {
        setKeyboardHeight(e.endCoordinates.height);
    }

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
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
                        <View style={{flex:1, alignItems: "flex-start", justifyContent: "center", paddingLeft: width * 0.07 }}>
                            <Text style={{fontWeight: "700", fontSize: RFPercentage(2.1), color: "#191F28", marginTop: "3%"}}>쿠폰 정보를 입력해주세요</Text>
                        </View>
                        <TouchableOpacity onPress={goBack} style={{ position: "absolute", top: height * 0.02, right: width * 0.05, height: height * 0.05, width: height * 0.05, justifyContent: "center", alignItems: "center"}}>
                            <ComponentDelete iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={{flex:1, backgroundColor: "#fff"}}>
                        {(textInputType === "" || textInputType === "couponCount" || textInputType === "couponCount" || textInputType === "couponCount" || textInputType === "couponCount" || textInputType === "couponCount") &&
                            <View style={{height: height * 0.05, justifyContent: "flex-end", paddingLeft: "5%"}}>
                                <Text style={{fontWeight: "700", fontSize: RFPercentage(2.3), color: "#000" }}>쿠폰 기본정보</Text>
                            </View>
                        }
                        {(textInputType === "" || textInputType === "nm") &&
                            <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                                <View style={{height: height * 0.05, backgroundColor: "#fff", width, justifyContent: "flex-end", marginLeft: "10%"}}>
                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>쿠폰이름</Text>
                                </View>
                                <TextInput
                                    placeholder="예) 쿨썸머 할인 쿠폰"
                                    placeholderTextColor="#B0B7C1"
                                    returnKeyType="done"
                                    onChangeText={text => onChangeNm(text)}
                                    onFocus={() => activeNmText()}
                                    onBlur={() => unactiveNmText()}
                                    onSubmitEditing={() => nextInputSection("nm")}
                                    value={cNm}
                                    style={{
                                        width: "90%",
                                        height: height * 0.07,
                                        fontSize: RFPercentage(2.3),
                                        borderBottomColor: sNmErrColor,
                                        borderBottomWidth: 1,
                                        fontWeight: '500',
                                        backgroundColor: '#fff',
                                        color: "#000"
                                    }}
                                />
                            </View>
                        }
                        {(textInputType === "" || textInputType === "amount") &&
                            <View style={{height: height * 0.18, alignItems: "center" }}>
                                <View style={{height: height * 0.05, backgroundColor: "#fff", width, justifyContent: "flex-end", marginLeft: "10%"}}>
                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>어떤 방식의 할인을 원하시나요?</Text>
                                </View>
                                <View style={{height: height * 0.12, width, justifyContent: "center", marginLeft: "10%" }}>
                                    <TouchableOpacity onPress={() => onChangeTherometer("amount")} style={{height: height * 0.05, width, alignItems: "center", flexDirection: "row"}}>
                                        {couponType === "amount" ?
                                            <ComponentSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                        :
                                            <ComponentUnSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                        }
                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#333D4B", marginLeft: "2%" }}> 정액할인</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => onChangeTherometer("percent")} style={{height: height * 0.05, width, alignItems: "center", flexDirection: "row"}}>
                                        {couponType === "amount" ?
                                            <ComponentUnSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                        :
                                            <ComponentSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                        }
                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#333D4B", marginLeft: "2%" }}> 정률할인</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                        {(textInputType === "" || textInputType === "amount") &&
                            <>
                                {couponType === "amount" ?
                                    <View style={{height: height * 0.07, alignItems: "center" }}>
                                        <TextInput
                                            placeholder="할인금액을 입력하세요."
                                            placeholderTextColor="#B0B7C1"
                                            returnKeyType="done"
                                            keyboardType="numeric"
                                            onChangeText={text => onChangeAmount(text)}
                                            onFocus={() => activeAmountText()}
                                            onBlur={() => unactiveAmountText()}
                                            onSubmitEditing={() => nextInputSection("amount")}
                                            value={cAmount}
                                            style={{
                                                width: "90%",
                                                height: height * 0.07,
                                                fontSize: RFPercentage(2.3),
                                                borderBottomColor: sAmountErrColor,
                                                borderBottomWidth: 1,
                                                fontWeight: '500',
                                                backgroundColor: '#fff',
                                                color: "#000"
                                            }}
                                        />
                                        <View style={{height: height* 0.07, width: height* 0.1, position: "absolute", bottom: 0,right: width * 0.07, justifyContent: "center", alignItems: "center"}}>
                                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#333D4B" }}>원</Text>
                                        </View>
                                    </View>
                                :
                                    <TouchableOpacity onPress={() => textSelection()} style={{height: height * 0.07, justifyContent: "center", marginLeft: "5%", backgroundColor: "#fff"}}>
                                        <View style={{width: "50%", height: height * 0.07, borderBottomColor: sNmErrColor, borderBottomWidth: 1, backgroundColor: "#fff", justifyContent: "center"}}>
                                            <Text style={{color: "#000", fontWeight: "500", fontSize: RFPercentage(2.3)}}>{cPercent}</Text>
                                            <View style={{position: "absolute", bottom: "20%", backgroundColor: "#fff",height: height * 0.04, width: width * 0.1, right: "5%", justifyContent: "center", alignItems: "center"}}>
                                                <ComponentArrowDown1 iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                }
                            </>
                        }
                        {(textInputType === "" || textInputType === "sMaxAmount") &&
                        <>
                            {couponType !== "amount" &&
                                <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                                    <View style={{height: height * 0.05, backgroundColor: "#fff", width, justifyContent: "flex-end", marginLeft: "10%"}}>
                                        <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>할인이 가능한 최대금액을 입력해주세요</Text>
                                    </View>
                                    <TextInput
                                        placeholder="최대금액"
                                        placeholderTextColor="#B0B7C1"
                                        returnKeyType="done"
                                        keyboardType="numeric"
                                        onChangeText={text => onChangeMaxAmount(text)}
                                        onFocus={() => activeMaxAmountText()}
                                        onBlur={() => unactiveMaxAmountText()}
                                        onSubmitEditing={() => nextInputSection("sMaxAmount")}
                                        value={sMaxAmount}
                                        style={{
                                            width: "90%",
                                            height: height * 0.07,
                                            fontSize: RFPercentage(2.3),
                                            borderBottomColor: sMaxAmountErrColor,
                                            borderBottomWidth: 1,
                                            fontWeight: '500',
                                            backgroundColor: '#fff',
                                            color: "#000"
                                        }}
                                    />
                                    <View style={{height: height* 0.07, width: height* 0.1, position: "absolute", bottom: height * 0.005,right: width * 0.07, justifyContent: "center", alignItems: "center"}}>
                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#333D4B" }}>원</Text>
                                    </View>
                                </View>
                            }
                        </>
                        }
                        {textInputType === "" &&
                            <View style={{height: height * 0.16, alignItems: "center" }}>
                                <View style={{height: height * 0.05, backgroundColor: "#fff", width, justifyContent: "flex-end", marginLeft: "10%"}}>
                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>쿠폰의 사용기간을 입력해주세요</Text>
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
                                    <TouchableOpacity onPress={() => setFDatePickerVisibility(true)} style={{height: height * 0.06, width: "43%", backgroundColor: "#FAFAFB", borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: "4%"}}>
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#333D4B"}}>{fromDate}</Text>
                                    </TouchableOpacity>
                                    <View style={{height: "100%", width: "5%", marginRight: "5%", justifyContent: "center", alignItems: "center"}}>
                                        <Text style={{fontWeight: "800", fontSize: RFPercentage(1.9), color: "#333D4B" }}>~</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => setTDatePickerVisibility(true)} style={{height: height * 0.06, width: "43%", backgroundColor: "#FAFAFB", borderRadius: 10, alignItems: "center", justifyContent: "center"}}>
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#333D4B"}}>{toDate}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                        {(textInputType === "" || textInputType === "sLimitAmount"  || textInputType === "count") &&
                            <View style={{height: height * 0.05, justifyContent: "flex-end", paddingLeft: "5%"}}>
                                <Text style={{fontWeight: "700", fontSize: RFPercentage(2.3), color: "#000" }}>쿠폰 추가정보</Text>
                            </View>
                        }
                        {(textInputType === "" || textInputType === "sLimitAmount") &&
                            <View style={{height: height * 0.18, alignItems: "center" }}>
                                <View style={{height: height * 0.05, backgroundColor: "#fff", width, justifyContent: "flex-end", marginLeft: "10%"}}>
                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>쿠폰 사용시 최소주문금액이 있나요?</Text>
                                </View>
                                <View style={{height: height * 0.12, width, justifyContent: "center", marginLeft: "10%" }}>
                                    <TouchableOpacity onPress={() => onChangeSet(true)} style={{height: height * 0.05, width, alignItems: "center", flexDirection: "row"}}>
                                        {limitAmount ?
                                            <ComponentSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                        :
                                            <ComponentUnSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                        }
                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#333D4B", marginLeft: "2%" }}> 최소금액이 있습니다.</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => onChangeSet(false)} style={{height: height * 0.05, width, alignItems: "center", flexDirection: "row"}}>
                                        {!limitAmount ?
                                            <ComponentSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                        :
                                            <ComponentUnSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                        }
                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#333D4B", marginLeft: "2%" }}> 최소금액 필요없어요.</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                        {(textInputType === "" || textInputType === "sLimitAmount") &&
                            <>
                                {limitAmount &&
                                    <View style={{height: height * 0.08, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                                        <TextInput
                                            placeholder="최소주문금액을 입력하세요."
                                            placeholderTextColor="#B0B7C1"
                                            returnKeyType="done"
                                            keyboardType="numeric"
                                            onChangeText={text => onChangeLimit(text)}
                                            onFocus={() => activeLimitAmountText()}
                                            onBlur={() => unactiveLimitAmountText()}
                                            onSubmitEditing={() => nextInputSection("sLimitAmount")}
                                            value={sLimitAmount}
                                            style={{
                                                width: "90%",
                                                height: height * 0.07,
                                                fontSize: RFPercentage(2.3),
                                                borderBottomColor: sLimitAmountErrColor,
                                                borderBottomWidth: 1,
                                                fontWeight: '500',
                                                backgroundColor: '#fff',
                                                color: "#000"
                                            }}
                                        />
                                        <View style={{height: height* 0.07, width: height* 0.1, position: "absolute", bottom: height * 0.01, right: width * 0.07, justifyContent: "center", alignItems: "center"}}>
                                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#333D4B" }}>원</Text>
                                        </View>
                                    </View>
                                }
                            </>
                        }
                        {(textInputType === "" || textInputType === "count") &&
                            <View style={{height: height * 0.26, alignItems: "center" }}>
                                <View style={{height: height * 0.05, backgroundColor: "#fff", width, justifyContent: "flex-end", marginLeft: "10%"}}>
                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>쿠폰수량을 입력해주세요</Text>
                                </View>
                                <View style={{height: height * 0.12, width, justifyContent: "center", marginLeft: "10%" }}>
                                    <TouchableOpacity onPress={() => onChangeType("limit")} style={{height: height * 0.05, width, alignItems: "center", flexDirection: "row"}}>
                                        {countType === "limit" ?
                                            <ComponentSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                        :
                                            <ComponentUnSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                        }
                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#333D4B", marginLeft: "2%" }}> 정해진 수량</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => onChangeType("unlimit")} style={{height: height * 0.05, width, alignItems: "center", flexDirection: "row"}}>
                                        {countType === "limit" ?
                                            <ComponentUnSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                        :
                                            <ComponentSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                        }
                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#333D4B", marginLeft: "2%" }}> 무제한</Text>
                                    </TouchableOpacity>
                                </View>
                                {countType === "limit" &&
                                    <>
                                        <TextInput
                                            placeholder="수량을 입력하세요."
                                            placeholderTextColor="#B0B7C1"
                                            returnKeyType="done"
                                            keyboardType="numeric"
                                            onChangeText={text => onChangeCount(text)}
                                            onFocus={() => activeCouponCountText()}
                                            onBlur={() => unactiveCouponCountText()}
                                            onSubmitEditing={() => nextInputSection("count")}
                                            value={couponCount}
                                            style={{
                                                width: "90%",
                                                height: height * 0.07,
                                                fontSize: RFPercentage(2.3),
                                                borderBottomColor: sCouponCountErrColor,
                                                borderBottomWidth: 1,
                                                fontWeight: '500',
                                                backgroundColor: '#fff',
                                                color: "#000"
                                            }}
                                        />
                                        <View style={{height: height* 0.07, width: height* 0.1, position: "absolute", bottom: height * 0.02, right: width * 0.07, justifyContent: "center", alignItems: "center"}}>
                                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#333D4B" }}>개의 쿠폰</Text>
                                        </View>
                                    </>
                                }
                            </View>
                        }
                    </ScrollView>
                    {textInputType === "nm" &&
                        <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.42}}>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                        </TouchableOpacity>
                    }
                    {(textInputType === "amount" || textInputType === "sMaxAmount" || textInputType === "sLimitAmount" || textInputType === "count") &&
                        <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.36}}>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                        </TouchableOpacity>
                    }
                    {textInputType === "" &&
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
                                <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>쿠폰 등록하기</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </>
            }
        </View>
    )
}

export default List;