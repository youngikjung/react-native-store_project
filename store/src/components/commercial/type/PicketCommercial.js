import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard, Image, PermissionsAndroid, Linking, ScrollView } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';
import moment from 'moment-timezone';
import 'moment/locale/ko';

import { ComponentArrowLeft3 } from '../../../assets/svg/arrowLeft3';
import { ComponentArrowDown1 } from '../../../assets/svg/arrow_down1';

import { CompModalContent, CompModalAddress, CompCommercialSelect } from '../../modal/ModalContents';

import tempImg from '../../../assets/img/kitBanner.png';

const { width, height } = Dimensions.get('window');

const Detail = ({ sProps, fnInitReturn, iDetailData, fnInsertCart, sParam }) => {
    const [loading, setLoading] = useState(false);

    const [sAddress, setAddress] = useState("");
    const [sExtraAddress, setExtraAddress] = useState("");
    const [sPhoneNm, setPhoneNm] = useState("");
    const [sNm, setNm] = useState("");

    const [fromDate] = useState(moment().format("YYYY-MM-DD"));

    const [sNmErrColor, setNmErrColor] = useState("#F2F3F5");
    const [sPhoneErrColor, setPhoneErrColor] = useState("#F2F3F5");
    const [sAddressErrColor, setAddressErrColor] = useState("#F2F3F5");

    const [textInputType, setTextInputType] = useState("");

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const onChangeNm = text => {
        setNm(text);
        setNmErrColor("#6490E7");
    };

    const onChangeExtra = text => {
        setExtraAddress(text);
    };

    const onChangePhone = text => {
        const sUserId = text;
        const regex = /[0-9]+$/gi;
        if(sUserId === "" || sUserId === null){
            setPhoneNm(text);
            setPhoneErrColor("#6490E7");
        } else {
            if (regex.test(sUserId)) {
                setPhoneNm(text);
                setPhoneErrColor("#6490E7");
            } else {
                setPhoneErrColor("#EF4452");
            }
        }
    };

    const onChangAddress =  async (text) => {
        setAddress(text);
        setAddressErrColor("#6490E7");
        setTextInputType("");
        Keyboard.dismiss();
        await sProps.appManager.hideModal();
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

    const activePhoneText = () => {
        setPhoneErrColor("#6490E7");
        setTextInputType("phone");
    }
    
    const unactivePhoneText = () => {
        setPhoneErrColor("#F2F3F5");
        setTextInputType("");
        Keyboard.dismiss();
    }

    const activeExtraText = () => {
        setAddressErrColor("#6490E7");
        setTextInputType("extra");
    }
    
    const unactiveExtraText = () => {
        setAddressErrColor("#F2F3F5");
        setTextInputType("");
        Keyboard.dismiss();
    }

    const addressSetting = () => {
        sProps.appManager.showModal(
            true,
            <CompModalAddress 
                fnAddress={(sIndex) => onChangAddress(sIndex)}
            />, 
            "custom"
        );
    }

    const backToInfomation = async () => {
        if(fnInitReturn !== undefined && typeof fnInitReturn === "function"){
            await fnInitReturn();
        }
    }

    const withoutData = async (sIndex) => {
        if(fnInsertCart !== undefined && typeof fnInsertCart === "function"){
            await sProps.appManager.hideModal();
            await fnInsertCart(sIndex,"go");
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

    const openCommercialSelect = (sIndex) => {
        sProps.appManager.showModal(
            true,
            <CompCommercialSelect nIndex={sIndex} fnClose={() => sProps.appManager.hideModal()} fnInsert={(qIndex) => withoutData(qIndex)}/>, 
            "custom",
        );
    };

    const nextInputSection = (sIndex) => {
        if(sIndex === "nm"){
            unactiveNmText();
        } else if (sIndex === "extra") {
            unactiveExtraText();
        } else if (sIndex === "phone") {
            unactivePhoneText();
        } else if (sIndex === "address") {
            setTextInputType("");
        } else {
            Keyboard.dismiss();
        }
    }

    const insertBannerImg = async () => {
        setLoading(true);

        if(sAddress === ""){
            openModal("상품을 받을 주소를 입력해주세요.");
        } else if (sPhoneNm === "") {
            openModal("전화번호를 입력해주세요.");
        } else if (sNm === "") {
            openModal("성명을 입력해주세요.");
        } else {
            let progress1 = true;
            for await (const iterator of sParam) {
                if(iterator.param === "picket"){
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
                store_id : sProps.UserConfigReducer.StoreID,
                fromDate,
                sAddress,
                sExtraAddress,
                sPhoneNm,
                sNm,
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

    const onKeyboardDidShow = (e) => {
        setKeyboardHeight(e.endCoordinates.height);
    }

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
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
                    <View style={{height: height * 0.1, width: "80%", justifyContent: "flex-start",  marginLeft: "20%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.8), color: "#6B7583"}}>구성: 
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.8), color: "#000"}}> 배너, 물통, 폴대4개, 메인파이프</Text>
                        </Text>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.8), color: "#6B7583"}}>재질:
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.8), color: "#000"}}> 페트 210μ</Text>
                        </Text>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.8), color: "#6B7583"}}>사이즈:
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.8), color: "#000"}}> 1800 x 600mm</Text>
                        </Text>
                    </View>
                    {textInputType === "" &&
                        <View style={{height: height * 0.28, width, alignItems: "center", justifyContent: "space-around" }}>
                            <Text style={{fontWeight: "400", fontSize: RFPercentage(1.6), color: "#666666"}}>-예시-</Text>
                            <View style={{height: height * 0.25, width: width * 0.8, alignItems: "center", justifyContent: "center" }}>
                                <Image source={tempImg} style={{width: "100%", height : "100%", borderRadius: width * 0.03, resizeMode: "stretch"}}/>
                            </View>
                        </View>
                    }
                    {(textInputType === "" || textInputType === "nm") &&
                        <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center"}}>
                            <View style={{height: height * 0.05, width, justifyContent: "flex-end", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>수령인</Text>
                            </View>
                            <TextInput
                                returnKeyType="next"
                                onChangeText={text => onChangeNm(text)}
                                onFocus={() => activeNmText()}
                                onBlur={() => unactiveNmText()}
                                onSubmitEditing={() => nextInputSection("nm")}
                                value={sNm}
                                style={{
                                    width: "90%",
                                    height: height * 0.07,
                                    fontSize: RFPercentage(2.3),
                                    borderBottomColor: sNmErrColor,
                                    borderBottomWidth: 1,
                                    fontWeight: '500',
                                    color: "#000"
                                }}
                            />
                        </View>
                    }
                    {(textInputType === "" || textInputType === "phone") &&
                        <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center"}}>
                            <View style={{height: height * 0.05, width, justifyContent: "flex-end", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>휴대폰번호</Text>
                            </View>
                            <TextInput
                                returnKeyType="next"
                                keyboardType="numeric"
                                onChangeText={text => onChangePhone(text)}
                                onFocus={() => activePhoneText()}
                                onBlur={() => unactivePhoneText()}
                                onSubmitEditing={() => nextInputSection("phone")}
                                value={sPhoneNm}
                                style={{
                                    width: "90%",
                                    height: height * 0.07,
                                    fontSize: RFPercentage(2.3),
                                    borderBottomColor: sPhoneErrColor,
                                    borderBottomWidth: 1,
                                    fontWeight: '500',
                                    color: "#000"
                                }}
                            />
                        </View>
                    }
                    {(textInputType === "" || textInputType === "address") &&
                        <TouchableOpacity onPress={addressSetting} style={{height: height * 0.15, justifyContent: "center", alignItems: "center"}}>
                            <View style={{height: height * 0.05, width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>매장 주소</Text>
                            </View>
                            <View style={{width: "90%", height: height * 0.07, borderBottomColor: sAddressErrColor, borderBottomWidth: 1, justifyContent: "center"}}>
                                <Text style={{color: "#000", fontWeight: "500", fontSize: RFPercentage(2.3)}}>{sAddress}</Text>
                                <View style={{position: "absolute", bottom: "20%", height: height * 0.04, width: width * 0.1, right: "0%", justifyContent: "center", alignItems: "center"}}>
                                    <ComponentArrowDown1 iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                    {(textInputType === "" || textInputType === "extra") &&
                        <View style={{height: textInputType === "extra" ? height * 0.15 : height * 0.1, justifyContent: "center", alignItems: "center"}}>
                            {textInputType === "extra" &&
                                <View style={{height: height * 0.05, width, justifyContent: "center", marginLeft: "10%"}}>
                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>나머지 주소</Text>
                                </View>
                            }
                            <TextInput
                                returnKeyType="next"
                                onChangeText={text => onChangeExtra(text)}
                                onFocus={() => activeExtraText()}
                                onBlur={() => unactiveExtraText()}
                                onSubmitEditing={() => nextInputSection("extra")}
                                value={sExtraAddress}
                                style={{
                                    width: "90%",
                                    height: height * 0.07,
                                    fontSize: RFPercentage(2.3),
                                    borderBottomColor: sAddressErrColor,
                                    borderBottomWidth: 1,
                                    fontWeight: '500',
                                    color: "#000"
                                }}
                            />
                        </View>
                    }
                </ScrollView>
                {(textInputType === "nm" || textInputType === "address" || textInputType === "extra") &&
                    <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.42}}>
                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                    </TouchableOpacity>
                }
                {textInputType === "phone" &&
                    <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 90,width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.36}}>
                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                    </TouchableOpacity>
                }
                {textInputType === "" &&
                    <View style={{height: height / 6 , justifyContent: "center"}}>
                        <TouchableOpacity
                            onPress={insertBannerImg}
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
                }
            </>
            }
        </View>
    )
}

export default Detail;