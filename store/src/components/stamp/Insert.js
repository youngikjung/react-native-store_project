import React, {useState,useEffect,useRef} from 'react';
import { View, Dimensions, Text, TouchableOpacity, Image, FlatList, ScrollView, TextInput, Keyboard, StatusBar, Platform } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import LottieView from 'lottie-react-native';
import moment from 'moment-timezone';
import 'moment/locale/ko';

import { ComSelectionData, ComConfirmStamp } from '../../components/modal/AppModalContent';

import { ComponentSelectedCircle } from '../../assets/svg/selectedCircle';
import { ComponentUnSelectedCircle } from '../../assets/svg/unselectedCircle';
import { ComponentDelete } from '../../assets/svg/delete';
import { ComponentQuestionMark } from '../../assets/svg/question_mark';
import { ComponentArrowDown1 } from '../../assets/svg/arrow_down1';
import { ComponentMore } from '../../assets/svg/more';
import CouponImg from '../../assets/img/coupon.png';

const { width, height } = Dimensions.get('window');

const List = ({ fnGoBack, sProps }) => {
    const [loading, setLoading] = useState(false);
    
    const [itemList] = useState([
        { id: 6, name: "발행일로부터 6개월" },
        { id: 12, name: "발행일로부터 12개월" },
        { id: 24, name: "발행일로부터 24개월" },
        { id: 0, name: "제한없음" },
    ]);

    const [targetList] = useState([
        { id: 6, name: "총 6개" },
        { id: 7, name: "총 7개" },
        { id: 8, name: "총 8개" },
        { id: 9, name: "총 9개" },
        { id: 10, name: "총 10개" },
        { id: 11, name: "총 11개" },
        { id: 12, name: "총 12개" },
    ]);
    
    const [cNm, setNm] = useState("");
    const [cMinAmount, setMinAmount] = useState("");
    const [cPeriod, setPeriod] = useState(6);
    const [cPeriodNm, setPeriodNm] = useState("발행일로부터 6개월");
    const [cTarget, setTarget] = useState(6);
    const [cTargetdNm, setTargetNm] = useState("총 6개");
    const [couponAmount, setCouponAmount] = useState("");
    
    const [sNmErrColor, setNmErrColor] = useState("#F2F3F5");
    const [sMinAmountErrColor, setMinAmountErrColor] = useState("#F2F3F5");
    const [sCouponAmountErrColor, setCouponAmountErrColor] = useState("#F2F3F5");
    
    const [textInputType, setTextInputType] = useState("");

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const onKeyboardDidShow = (e) => {
        setKeyboardHeight(e.endCoordinates.height);
    }

    const goBack = async () => {
        if(fnGoBack !== undefined && typeof fnGoBack === "function"){
            await fnGoBack();
        }
    }

    const onChangeNm = text => {
        setNm(text);
        setNmErrColor("#6490E7");
    };

    const onChangeMinAmount = text => {
        const sUserId = text;
        const regex = /[0-9]+$/gi;
        if(sUserId === "" || sUserId === null){
            setMinAmount(text);
            setMinAmountErrColor("#6490E7");
        } else {
            if (regex.test(sUserId)) {
                setMinAmount(text);
                setMinAmountErrColor("#6490E7");
            } else {
                setMinAmountErrColor("#EF4452");
            }
        }
    };

    const onChangeCoupon = text => {
        const sUserId = text;
        const regex = /[0-9]+$/gi;
        if(sUserId === "" || sUserId === null){
            setCouponAmount(text);
            setCouponAmountErrColor("#6490E7");
        } else {
            if (regex.test(sUserId)) {
                setCouponAmount(text);
                setCouponAmountErrColor("#6490E7");
            } else {
                setCouponAmountErrColor("#EF4452");
            }
        }
    };

    const activeNmText = () => {
        setNmErrColor("#6490E7");
        setTextInputType("cNm");
    }
    
    const unactiveNmText = () => {
        setNmErrColor("#F2F3F5");
        setTextInputType("");
        Keyboard.dismiss();
    }

    const activeMinAmountText = () => {
        setMinAmountErrColor("#6490E7");
        setTextInputType("cMin");
    }
    
    const unactiveMinAmountText = () => {
        setMinAmountErrColor("#F2F3F5");
        setTextInputType("");
        Keyboard.dismiss();
    }

    const activeCouponAmountText = () => {
        setCouponAmountErrColor("#6490E7");
        setTextInputType("coupon");
    }
    
    const unactiveCouponAmountText = () => {
        setCouponAmountErrColor("#F2F3F5");
        setTextInputType("");
        Keyboard.dismiss();
    }

    const onChangePercent = (sIndex) => {
        sProps.appManager.hideModal();
        setPeriod(sIndex.id);
        setPeriodNm(sIndex.name);
    };

    const onChangeTarget = (sIndex) => {
        sProps.appManager.hideModal();
        setTarget(sIndex.id);
        setTargetNm(sIndex.name);
    };

    const textSelection = async () => {
        sProps.appManager.showModal(
            true,
            <ComSelectionData
                sList={itemList}
                fnSelectValue={(sIndex) => onChangePercent(sIndex)}
            />, 
            "custom"
        );
    }

    const targetSelection = async () => {
        sProps.appManager.showModal(
            true,
            <ComSelectionData
                sList={targetList}
                fnSelectValue={(sIndex) => onChangeTarget(sIndex)}
            />, 
            "custom"
        );
    }

    const nextInputSection = (sIndex) => {
        if(sIndex === "cNm"){
            unactiveNmText();
        } else if (sIndex === "coupon") {
            unactiveCouponAmountText();
        } else if (sIndex === "cMin") {
            unactiveMinAmountText();
        } else {
            Keyboard.dismiss();
            unactiveNmText();
            unactiveCouponAmountText();
            unactiveMinAmountText();
        }
    }

    const checkNotice = () => {
        let process1 = false;
        let process2 = false;
        let process3 = false;

        if(cNm === ""){
            setNmErrColor("#EF4452");
        } else {
            process1 = true;
        }

        if(cMinAmount === ""){
            setMinAmountErrColor("#EF4452");
        } else {
            process2 = true;
        }

        if(couponAmount === ""){
            setCouponAmountErrColor("#EF4452");
        } else {
            process3 = true;
        }

        if(process1 && process2 && process3){
            const oData = {
                store_id: sProps.UserConfigReducer.StoreID,
                nm: cNm,
                minAmount: cMinAmount,
                targetValue: cTarget,
                partnerDiscount: couponAmount,
                period: cPeriod,
                periodNm: cPeriodNm,
                description: "스루스토어에서 생성"
            };

            sProps.appManager.showModal(
                true,
                <ComConfirmStamp 
                    sData={oData}
                    sTitle={"insert"}
                    iProps={sProps}
                    fnInsert={() => completePage()}
                    fnClose={() => sProps.appManager.hideModal()}
                />, 
                "custom",
            );
        }
    }

    const completePage = async () => {
        await sProps.appManager.hideModal();
        if(fnGoBack !== undefined && typeof fnGoBack === "function"){
            await fnGoBack();
        }
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
                            <Text style={{fontWeight: "700", fontSize: RFPercentage(2.1), color: "#191F28", marginTop: "3%"}}>스템프 정보를 입력해주세요</Text>
                        </View>
                        <TouchableOpacity onPress={goBack} style={{ position: "absolute", top: height * 0.02, right: width * 0.05, height: height * 0.05, width: height * 0.05, justifyContent: "center", alignItems: "center"}}>
                            <ComponentDelete iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={{flex:1, backgroundColor: "#fff"}}>
                        {(textInputType === "" || textInputType === "cNm") &&
                            <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                                <View style={{height: height * 0.05, backgroundColor: "#fff", width, justifyContent: "flex-end", marginLeft: "10%"}}>
                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>스탬프 이름을 입력해주세요</Text>
                                </View>
                                <TextInput
                                    placeholder="예) 스탬프 10개를 모으면 1,000원 할인!"
                                    placeholderTextColor="#B0B7C1"
                                    returnKeyType="done"
                                    onChangeText={text => onChangeNm(text)}
                                    onFocus={() => activeNmText()}
                                    onBlur={() => unactiveNmText()}
                                    onSubmitEditing={() => nextInputSection("cNm")}
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
                        {(textInputType === "" || textInputType === "cMin") &&
                            <View style={{height: height * 0.23, backgroundColor: "#fff", alignItems: "center" }}>
                                <View style={{height: height * 0.05, backgroundColor: "#fff", width, alignItems: "flex-end", marginLeft: "10%", flexDirection: "row"}}>
                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>스탬프 부여기준을 정해주세요</Text>
                                </View>
                                <TextInput
                                    placeholder="기준금액을 입력바랍니다."
                                    placeholderTextColor="#B0B7C1"
                                    keyboardType="numeric"
                                    returnKeyType="done"
                                    onChangeText={text => onChangeMinAmount(text)}
                                    onFocus={() => activeMinAmountText()}
                                    onBlur={() => unactiveMinAmountText()}
                                    onSubmitEditing={() => nextInputSection("cMin")}
                                    value={cMinAmount}
                                    style={{
                                        width: "90%",
                                        height: height * 0.07,
                                        fontSize: RFPercentage(2.3),
                                        borderBottomColor: sMinAmountErrColor,
                                        borderBottomWidth: 1,
                                        fontWeight: '500',
                                        backgroundColor: '#fff',
                                        color: "#000"
                                    }}
                                />
                                <View style={{position: "absolute", zIndex: 1, top: "35%", right: "10%"}}>
                                    <Text style={{fontWeight: "600", fontSize: RFPercentage(1.5), color: "#000"}}>원을 기준으로 스탬프 1개 발행</Text>
                                </View>
                                <View style={{position: "absolute", zIndex: 99, bottom: 0, left: "5%", height: height * 0.09, width: width * 0.9, backgroundColor: "#E8EFFC", borderRadius: width * 0.02, justifyContent: "center", paddingLeft: "5%"}}>
                                    <Text style={{fontSize: RFPercentage(1.5), fontWeight: '600', color: "#6490E7"}}>스탬프 발행은 할인금액을 제외한 결제금액 기준으로 발행됩니다.</Text>
                                    <Text style={{fontSize: RFPercentage(1.5), fontWeight: '600', color: "#6490E7", marginTop: "1%"}}>입력하신 금액기준으로 스탬프가 발행됩니다.</Text>
                                    <Text style={{fontSize: RFPercentage(1.5), fontWeight: '600', color: "#6490E7", marginTop: "1%"}}>예) 결제금액 59,000원 기준금액 10,000원 스탬프 5개발행</Text>
                                </View>
                                <View style={{position: "absolute", zIndex: 9, bottom: height * 0.073, left: "10%", height: height * 0.025, width: height * 0.025, backgroundColor: "#E8EFFC", transform: [{ rotateZ: '0.785398rad' }]}} />
                            </View>
                        }
                        {textInputType === "" &&
                            <View style={{height: height * 0.2, backgroundColor: "#fff", alignItems: "center"}}>
                                <View style={{height: height * 0.05, backgroundColor: "#fff", width, alignItems: "flex-end", marginLeft: "10%", flexDirection: "row"}}>
                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>스탬프 이벤트 기간</Text>
                                </View>
                                <TouchableOpacity onPress={() => textSelection()} style={{height: height * 0.07, width, justifyContent: "center", marginLeft: "10%", backgroundColor: "#fff"}}>
                                    <View style={{width: "60%", height: height * 0.07, borderBottomColor: "#F2F3F5", borderBottomWidth: 1, backgroundColor: "#fff", justifyContent: "center"}}>
                                        <Text style={{color: "#000", fontWeight: "500", fontSize: RFPercentage(2.3)}}>{cPeriodNm}</Text>
                                        <View style={{position: "absolute", bottom: "20%", backgroundColor: "#fff",height: height * 0.04, width: width * 0.1, right: "5%", justifyContent: "center", alignItems: "center"}}>
                                            <ComponentArrowDown1 iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View style={{position: "absolute", zIndex: 99, bottom: 0, left: "5%", height: height * 0.06, width: width * 0.9, backgroundColor: "#E8EFFC", borderRadius: width * 0.02, justifyContent: "center", paddingLeft: "5%"}}>
                                    <Text style={{fontSize: RFPercentage(1.5), fontWeight: '600', color: "#6490E7"}}>기간은 스탬프이벤트가 진행되는 날짜를 의미합니다</Text>
                                    <Text style={{fontSize: RFPercentage(1.5), fontWeight: '600', color: "#6490E7", marginTop: "1%"}}>보상으로 발급되는 선불권의 이용기간은 발급후 6개월으로 발행됩니다</Text>
                                </View>
                                <View style={{position: "absolute", zIndex: 9, bottom: height * 0.043, left: "10%", height: height * 0.025, width: height * 0.025, backgroundColor: "#E8EFFC", transform: [{ rotateZ: '0.785398rad' }]}} />
                            </View>
                        }

                        {textInputType === "" &&
                            <View style={{height: height * 0.18, backgroundColor: "#fff", alignItems: "center" }}>
                                <View style={{height: height * 0.05, backgroundColor: "#fff", width, alignItems: "flex-end", marginLeft: "10%", flexDirection: "row"}}>
                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>스탬프 목표 갯수</Text>
                                </View>
                                <TouchableOpacity onPress={() => targetSelection()} style={{height: height * 0.07, width, justifyContent: "center", marginLeft: "10%", backgroundColor: "#fff"}}>
                                    <View style={{width: "60%", height: height * 0.07, borderBottomColor: "#F2F3F5", borderBottomWidth: 1, backgroundColor: "#fff", justifyContent: "center"}}>
                                        <Text style={{color: "#000", fontWeight: "500", fontSize: RFPercentage(2.3)}}>{cTargetdNm}</Text>
                                        <View style={{position: "absolute", bottom: "20%", backgroundColor: "#fff",height: height * 0.04, width: width * 0.1, right: "5%", justifyContent: "center", alignItems: "center"}}>
                                            <ComponentArrowDown1 iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View style={{position: "absolute", zIndex: 99, bottom: 0, left: "5%", height: height * 0.04, width: width * 0.9, backgroundColor: "#E8EFFC", borderRadius: width * 0.02, justifyContent: "center", paddingLeft: "5%"}}>
                                    <Text style={{fontSize: RFPercentage(1.5), fontWeight: '600', color: "#6490E7"}}>보상을 받기위해 모아야하는 총갯수를 의미합니다.</Text>
                                </View>
                                <View style={{position: "absolute", zIndex: 9, bottom: height * 0.023, left: "10%", height: height * 0.025, width: height * 0.025, backgroundColor: "#E8EFFC", transform: [{ rotateZ: '0.785398rad' }]}} />
                            </View>
                        }

                        {(textInputType === "" || textInputType === "coupon") &&
                            <View style={{height: height * 0.23, backgroundColor: "#fff", alignItems: "center" }}>
                                <View style={{height: height * 0.05, backgroundColor: "#fff", width, alignItems: "flex-end", marginLeft: "10%", flexDirection: "row"}}>
                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>목표 달성시 주어지는 선불권 금액을 입력해주세요</Text>
                                </View>
                                <TextInput
                                    placeholder="선불권금액을 입력바랍니다."
                                    placeholderTextColor="#B0B7C1"
                                    keyboardType="numeric"
                                    returnKeyType="done"
                                    onChangeText={text => onChangeCoupon(text)}
                                    onFocus={() => activeCouponAmountText()}
                                    onBlur={() => unactiveCouponAmountText()}
                                    onSubmitEditing={() => nextInputSection("coupon")}
                                    value={couponAmount}
                                    style={{
                                        width: "90%",
                                        height: height * 0.07,
                                        fontSize: RFPercentage(2.3),
                                        borderBottomColor: sCouponAmountErrColor,
                                        borderBottomWidth: 1,
                                        fontWeight: '500',
                                        backgroundColor: '#fff',
                                        color: "#000"
                                    }}
                                />
                                <View style={{position: "absolute", zIndex: 1, top: "35%", right: "10%"}}>
                                    <Text style={{fontWeight: "600", fontSize: RFPercentage(1.5), color: "#000"}}>원 선불권 지급</Text>
                                </View>
                                <View style={{position: "absolute", zIndex: 99, bottom: 0, left: "5%", height: height * 0.09, width: width * 0.9, backgroundColor: "#E8EFFC", borderRadius: width * 0.02, justifyContent: "center", paddingLeft: "5%"}}>
                                    <Text style={{fontSize: RFPercentage(1.5), fontWeight: '600', color: "#6490E7"}}>보상금액은 선불권으로 고객에게 발행됩니다.</Text>
                                    <Text style={{fontSize: RFPercentage(1.5), fontWeight: '600', color: "#6490E7", marginTop: "1%"}}>발급된 선불권은 금액 제한이 없습니다</Text>
                                    <Text style={{fontSize: RFPercentage(1.5), fontWeight: '600', color: "#6490E7", marginTop: "1%"}}>발급된 선불권의 유효기간은 발급후 6개월입니다.</Text>
                                </View>
                                <View style={{position: "absolute", zIndex: 9, bottom: height * 0.073, left: "10%", height: height * 0.025, width: height * 0.025, backgroundColor: "#E8EFFC", transform: [{ rotateZ: '0.785398rad' }]}} />
                            </View>
                        }
                    </ScrollView>
                    {textInputType === "cNm" &&
                        <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.42}}>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                        </TouchableOpacity>
                    }
                    {(textInputType === "coupon" || textInputType === "cMin") &&
                        <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.36}}>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                        </TouchableOpacity>
                    }
                    {textInputType === "" &&
                        <View style={{height: height / 6 , backgroundColor: "#fff", justifyContent: "center"}}>
                            <TouchableOpacity
                                onPress={() => checkNotice()}
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
                                <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>스템프 등록하기</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </>
            }
        </View>
    )
}

export default List;