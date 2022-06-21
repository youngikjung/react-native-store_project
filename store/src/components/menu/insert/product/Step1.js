import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard, ScrollView, Animated } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';

import { ThrooOnlySwitchToggle, CompModalThrooOnlyDetail, CompModalDiscountDetail } from '../../../modal/ModalContents';

import { ComponentDelete } from '../../../../assets/svg/delete';
import { ComponentQuestionMark } from '../../../../assets/svg/question_mark';

let discountCheckTime;

const { width, height } = Dimensions.get('window');

const Step1 = ({ oProps, fnNextStep, fnDelete, iNm, iPrice, iOriginPrice, sStock, iProductType, iDiscountNm, sAnimated }) => {
    const [sNm, setNm] = useState("");
    const [sPrice, setPrice] = useState("");
    const [sOriginPrice, setOriginPrice] = useState("");
    const [iStock, setStock] = useState("");
    const [productType, setProductType] = useState(false);
    const [discountNm, setDiscountNm] = useState("");

    const [errNmColor, setErrNmColor] = useState("#EFF0F6");
    const [errNmText, setErrNmText] = useState("");
    const [errOriginPriceColor, setErrOriginPriceColor] = useState("#EFF0F6");
    const [errOriginPriceText, setErrOriginPriceText] = useState("");
    const [errDiscountPriceColor, setErrDiscountPriceColor] = useState("#EFF0F6");
    const [errDiscountPriceText, setErrDiscountPriceText] = useState("");
    const [errStockColor, setErrStockColor] = useState("#EFF0F6");
    const [errStockText, setErrStockText] = useState("");

    const [textInputType, setTextInputType] = useState("");

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const [animated] = useState(new Animated.Value(sAnimated));

    const done = async () => {
        if(sNm === ""){
            setErrNmColor("#EF4452");
            setErrNmText("메뉴명을 입력해주세요");
        } else if (sOriginPrice === ""){
            setErrOriginPriceColor("#EF4452");
            setErrOriginPriceText("가격을 입력해주세요");
        } else {
            const oData = {
                sNm,
                sPrice,
                sOriginPrice,
                iStock,
                productType,
                discountNm,
                animated
            }
            if(fnNextStep !== undefined && typeof fnNextStep === "function"){
                await fnNextStep(oData);
            }
        }
    }
    
    const nextInputSection = (sIndex) => {
        if(sIndex === "nm"){
            unactiveNmText();
        } else if (sIndex === "origin") {
            unactiveOriginPriceText();
        } else if (sIndex === "discount") {
            unactiveDiscountPriceText();
        } else if (sIndex === "stock") {
            unactiveStockText();
        }
    }

    const onKeyboardDidShow = (e) => {
        setKeyboardHeight(e.endCoordinates.height);
    }

    const onChangeNm = text => {
        setNm(text);
        setErrNmColor("#6490E7");
        setErrNmText("");
    };
    
    const onChangeOriginPrice = text => {
        const sTemp = text;
        const regex = /[0-9]+$/gi;
        if(sTemp === "" || sTemp === null){
            setOriginPrice(text);
            setErrOriginPriceColor("#6490E7");
            setErrOriginPriceText("");
        } else {
            if (regex.test(sTemp)) {
                setOriginPrice(text);
                setErrOriginPriceColor("#6490E7");
                setErrOriginPriceText("");
            } else {
                setErrOriginPriceColor("#E32938");
                setErrOriginPriceText("숫자만 입력가능합니다.");
            }
        }
    };
    
    const onChangePrice = text => {
        const sTemp = text;
        const regex = /[0-9]+$/gi;
        if(sTemp === "" || sTemp === null){
            setPrice(text);
            setErrStockColor("#6490E7");
            setErrDiscountPriceText("");
        } else {
            if (regex.test(sTemp)) {
                setPrice(text);
                setErrStockColor("#6490E7");
                setErrDiscountPriceText("");
            } else {
                setErrStockColor("#E32938");
                setErrDiscountPriceText("숫자만 입력가능합니다.");
            }
        }

        if(discountCheckTime) clearTimeout(discountCheckTime);
        discountCheckTime = setTimeout(() => {
            let temp = 0;
            if(sTemp.toString().trim() === "" || sOriginPrice.toString().trim() === ""){
                temp = 0;
            } else  {
                temp = Math.round(parseFloat(100 - (sTemp / sOriginPrice * 100)));
            }
            setDiscountNm(temp);
        }, 300);
    };

    const onChangeStock = text => {
        const sTemp = text;
        const regex = /[0-9]+$/gi;
        if(sTemp === "" || sTemp === null){
            setStock(text);
            setErrDiscountPriceColor("#6490E7");
            setErrStockText("");
        } else {
            if (regex.test(sTemp)) {
                setStock(text);
                setErrDiscountPriceColor("#6490E7");
                setErrStockText("");
            } else {
                setErrDiscountPriceColor("#E32938");
                setErrStockText("숫자만 입력가능합니다.");
            }
        }
    };

    const activeNmText = () => {
        setErrNmColor("#6490E7");
        setErrOriginPriceColor("#EFF0F6");
        setErrDiscountPriceColor("#EFF0F6");
        setErrStockColor("#EFF0F6");
        setTextInputType("nm");
    };

    const unactiveNmText = () => {
        setErrNmColor("#EFF0F6");
        setErrOriginPriceColor("#EFF0F6");
        setErrDiscountPriceColor("#EFF0F6");
        setErrStockColor("#EFF0F6");
        setTextInputType("");
        Keyboard.dismiss();
    };
    
    const activeOriginPriceText = () => {
        setErrNmColor("#EFF0F6");
        setErrOriginPriceColor("#6490E7");
        setErrDiscountPriceColor("#EFF0F6");
        setErrStockColor("#EFF0F6");
        setTextInputType("origin");
    };
    
    const unactiveOriginPriceText = () => {
        setErrNmColor("#EFF0F6");
        setErrOriginPriceColor("#EFF0F6");
        setErrDiscountPriceColor("#EFF0F6");
        setErrStockColor("#EFF0F6");
        setTextInputType("");
        Keyboard.dismiss();
    };

    const activeDiscountPriceText = () => {
        setErrNmColor("#EFF0F6");
        setErrOriginPriceColor("#EFF0F6");
        setErrDiscountPriceColor("#6490E7");
        setErrStockColor("#EFF0F6");
        setTextInputType("discount");
    };
    
    const unactiveDiscountPriceText = () => {
        setErrNmColor("#EFF0F6");
        setErrOriginPriceColor("#EFF0F6");
        setErrDiscountPriceColor("#EFF0F6");
        setErrStockColor("#EFF0F6");
        setTextInputType("");
        Keyboard.dismiss();
    };

    const activeStockText = () => {
        setErrNmColor("#EFF0F6");
        setErrOriginPriceColor("#EFF0F6");
        setErrDiscountPriceColor("#EFF0F6");
        setErrStockColor("#6490E7");
        setTextInputType("stock");
    };
    
    const unactiveStockText = () => {
        setErrNmColor("#EFF0F6");
        setErrOriginPriceColor("#EFF0F6");
        setErrDiscountPriceColor("#EFF0F6");
        setErrStockColor("#EFF0F6");
        setTextInputType("");
        Keyboard.dismiss();
    };

    const throoOnlySwitch = async () => {
        setProductType(!productType);
    }

    const openModalThrooOnlyDetail = async () => {
        oProps.appManager.showModal(
            true,
            <CompModalThrooOnlyDetail fnClose={() => oProps.appManager.hideModal()}/>, 
            "custom",
        );
    }

    const openModalDiscountDetail = async () => {
        oProps.appManager.showModal(
            true,
            <CompModalDiscountDetail fnClose={() => oProps.appManager.hideModal()}/>, 
            "custom",
        );
    }

    const quitStep = async () => {
        if(fnDelete !== undefined && typeof fnDelete === "function"){
            await fnDelete();
        }
    }

    const animationStyles = {
        width: animated,
    };


    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    }, []);

    Animated.timing(animated, {
        toValue: width * 0.2,
        duration: 1000,
        useNativeDriver: false,
    }).start();
    
    useEffect(() => {
        if(iNm !== ""){
            setNm(iNm);
        }
        if(iPrice !== ""){
            setPrice(iPrice);
        }
        if(iOriginPrice !== ""){
            setOriginPrice(iOriginPrice);
        }
        if(sStock !== ""){
            setStock(sStock);
        }
        if(iProductType !== ""){
            setProductType(iProductType);
        }
        if(iDiscountNm !== ""){
            setDiscountNm(iDiscountNm);
        }
    }, [iNm, iPrice, iOriginPrice, sStock, iProductType, iDiscountNm]);

    return (
        <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={{flex:1, backgroundColor: "#fff"}}>
            <View style={{height: height * 0.06, justifyContent: "flex-end", alignItems: "center"}}>
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#333D4B" }}>메뉴 추가</Text>
                <TouchableOpacity onPress={quitStep} style={{position: "absolute", bottom: 0, right: "5%", height: height * 0.06, width: height * 0.05, justifyContent: "flex-end", alignItems: "center"}}>
                    <ComponentDelete iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                </TouchableOpacity>
            </View>
            <View style={{ height: height * 0.03}}/>
            <Animated.View style={[objectStyles.object, animationStyles]}/>
            <View style={{flex:1, backgroundColor: "#fff"}}>
                {(textInputType === "" || textInputType === "nm") &&
                    <View style={{flex: 0.23, borderBottomColor: "#F2F3F5", borderBottomWidth: 1, alignItems: "center"}}>
                        <View style={{height: height * 0.07, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>메뉴명</Text>
                        </View>
                        <TextInput
                            placeholder="예) 클래식 치즈버거 세트"
                            placeholderTextColor="#919AA7"
                            returnKeyType="done"
                            onChangeText={text => onChangeNm(text)}
                            onFocus={() => activeNmText()}
                            onBlur={() => unactiveNmText()}
                            onSubmitEditing={() => nextInputSection("nm")}
                            value={sNm}
                            style={{
                                width: "90%",
                                height: height * 0.06,
                                fontSize: RFPercentage(2),
                                borderColor: errNmColor,
                                borderWidth: 1,
                                fontWeight: '500',
                                paddingLeft: "5%",
                                backgroundColor: '#FAFAFB',
                                borderRadius: 5,
                                color: "#000"
                            }}
                        />
                        {errNmText !== "" &&
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{errNmText}</Text>
                            </View>
                        }
                    </View>
                }
                {(textInputType === "" || textInputType === "origin" || textInputType === "discount" || textInputType === "stock") &&
                    <View style={{flex: 0.67, borderBottomColor: "#F2F3F5", borderBottomWidth: 1, alignItems: "center"}}>
                        {(textInputType === "" || textInputType === "origin") &&
                            <>
                                <View style={{height: height * 0.07, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                    <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>가격</Text>
                                </View>
                                <TextInput
                                    returnKeyType="done"
                                    onChangeText={text => onChangeOriginPrice(text)}
                                    onFocus={() => activeOriginPriceText()}
                                    onBlur={() => unactiveOriginPriceText()}
                                    onSubmitEditing={() => nextInputSection("origin")}
                                    value={sOriginPrice}
                                    keyboardType="numeric"
                                    style={{
                                        width: "90%",
                                        height: height * 0.06,
                                        fontSize: RFPercentage(2),
                                        borderColor: errOriginPriceColor,
                                        borderWidth: 1,
                                        fontWeight: '500',
                                        paddingLeft: "5%",
                                        backgroundColor: '#FAFAFB',
                                        borderRadius: 5,
                                        color: "#000"
                                    }}
                                />
                                <View style={{height: height * 0.06, width: height * 0.06, top: height * 0.07, right: "5%", position: "absolute", justifyContent: "center", alignItems: "center"}}>
                                    <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#919AA7" }}>원</Text>
                                </View>
                                {errOriginPriceText !== "" &&
                                    <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{errOriginPriceText}</Text>
                                    </View>
                                }
                            </>
                        }
                        {(textInputType === "" || textInputType === "discount") &&
                            <>
                                <TouchableOpacity onPress={openModalDiscountDetail} style={{height: height * 0.07, backgroundColor: "#fff", width, alignItems: "center", marginLeft: "10%", flexDirection: "row"}}>
                                    <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>
                                        할인 판매 가격
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#919AA7" }}>
                                            (선택)
                                        </Text>
                                    </Text>
                                    <ComponentQuestionMark iHeight={height * 0.02} iWidth={height * 0.03} iColor={"#3B3B46"}/>
                                </TouchableOpacity>
                                <View style={{width: "90%", height: height * 0.06, flexDirection: "row", justifyContent: "space-between"}}>
                                    <TextInput
                                        returnKeyType="done"
                                        onChangeText={text => onChangePrice(text)}
                                        onFocus={() => activeDiscountPriceText()}
                                        onBlur={() => unactiveDiscountPriceText()}
                                        onSubmitEditing={() => nextInputSection("discount")}
                                        value={sPrice}
                                        keyboardType="numeric"
                                        style={{
                                            width: "65%",
                                            height: height * 0.06,
                                            fontSize: RFPercentage(2),
                                            borderColor: errDiscountPriceColor,
                                            borderWidth: 1,
                                            fontWeight: '500',
                                            paddingLeft: "5%",
                                            backgroundColor: '#FAFAFB',
                                            borderRadius: 5,
                                            color: "#000"
                                        }}
                                    />
                                    <View style={{width: "30%", height: height * 0.06, backgroundColor: "#919AA7", justifyContent: "center", alignItems: "center", borderRadius: 5}}>
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#fff" }}>할인율 {discountNm}%</Text>
                                    </View>
                                    <View style={{height: height * 0.06, width: "10%", bottom: 0, left: "55%", position: "absolute", justifyContent: "center", alignItems: "center"}}>
                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#919AA7" }}>원</Text>
                                    </View>
                                </View>
                                {errDiscountPriceText !== "" &&
                                    <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{errDiscountPriceText}</Text>
                                    </View>
                                }
                            </>
                        }
                        {(textInputType === "" || textInputType === "stock") &&
                            <>
                                <View style={{height: height * 0.07, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                    <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>
                                        재고
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#919AA7"}}>
                                            (선택)
                                        </Text>
                                    </Text>
                                </View>
                                <View style={{width: "90%", height: height * 0.06, flexDirection: "row", justifyContent: "space-between"}}>
                                    <TextInput
                                        returnKeyType="done"
                                        onChangeText={text => onChangeStock(text)}
                                        onFocus={() => activeStockText()}
                                        onBlur={() => unactiveStockText()}
                                        onSubmitEditing={() => nextInputSection("stock")}
                                        value={iStock}
                                        keyboardType="numeric"
                                        style={{
                                            width: "100%",
                                            height: height * 0.06,
                                            fontSize: RFPercentage(2),
                                            borderColor: errStockColor,
                                            borderWidth: 1,
                                            fontWeight: '500',
                                            paddingLeft: "5%",
                                            backgroundColor: '#FAFAFB',
                                            borderRadius: 5,
                                            color: "#000"
                                        }}
                                    />
                                    <View style={{height: height * 0.06, width: "10%", bottom: 0, right: "3%", position: "absolute", justifyContent: "center", alignItems: "center"}}>
                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#919AA7" }}>개</Text>
                                    </View>
                                </View>
                                {errStockText !== "" &&
                                    <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center"}}>
                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{errStockText}</Text>
                                    </View>
                                }
                            </>
                        }
                    </View>
                }
                {textInputType === "" &&
                    <View style={{flex: 0.1, flexDirection: "row", marginLeft: "5%", marginRight: "5%"}}>
                        <TouchableOpacity onPress={openModalThrooOnlyDetail} style={{flex:1, alignItems: "center", flexDirection: "row"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#3B3B46"}}>스루온리 메뉴</Text>
                            <ComponentQuestionMark iHeight={height * 0.02} iWidth={height * 0.03} iColor={"#3B3B46"}/>
                        </TouchableOpacity>
                        <View style={{flex:1, alignItems: "flex-end", justifyContent: "center"}}>
                            <ThrooOnlySwitchToggle isOn={productType} onToggle={() => throoOnlySwitch()}/>
                        </View>
                    </View>
                }
            </View>
            {textInputType === "nm" &&
                <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.42}}>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                </TouchableOpacity>
            }
            {(textInputType === "origin" || textInputType === "discount" || textInputType === "stock") &&
                <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.36}}>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                </TouchableOpacity>
            }
            {textInputType === "" &&
                <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center"}}>
                    <TouchableOpacity onPress={done} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>다음</Text>
                    </TouchableOpacity>
                </View>
            }
        </TouchableOpacity>
    )
}

const objectStyles = {
    object: {
        height: height * 0.005,
        borderBottomColor: "#6490E7", 
        borderBottomWidth: 2
    },
}

export default Step1;