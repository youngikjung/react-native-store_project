import React, {useState,useEffect,useRef} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard, FlatList, Animated } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

import { ComponentDelete } from '../../../../assets/svg/delete';
import { ComponentArrowLeft3 } from '../../../../assets/svg/arrowLeft3';

const { width, height } = Dimensions.get('window');

const Step2 = ({ fnBackGroupList, fnNextStep, fnDelete, sAnimated, nData, iMaxNm }) => {
    const [errLoad, setErrLoad] = useState(false);
    const [errLoadText, setErrLoadText] = useState("");

    const [animated] = useState(new Animated.Value(sAnimated));

    const [sNm, setNm] = useState("");
    const [sPrice, setPrice] = useState("");
    const [sMaxNm, setMaxNm] = useState(1);

    const [errNmColor, setErrNmColor] = useState("#EFF0F6");
    const [errNmText, setErrNmText] = useState("");
    const [errPriceColor, setErrPriceColor] = useState("#EFF0F6");
    const [errPriceText, setErrPriceText] = useState("");

    const [textInputType, setTextInputType] = useState("");

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const [iData, setData] = useState([]);
    const sData = useRef([]);
    const sFocus = useRef(null);
    const iFocus = useRef(null);

    const onChangeNm = text => {
        setNm(text);
        setErrNmColor("#6490E7");
        setErrNmText("");
    };

    const onChangePrice = text => {
        const sTemp = text;
        const regex = /[0-9]+$/gi;
        if(sTemp === "" || sTemp === null){
            setPrice(text);
            setErrPriceColor("#6490E7");
            setErrPriceText("");
        } else {
            if (regex.test(sTemp)) {
                setPrice(text);
                setErrPriceColor("#6490E7");
                setErrPriceText("");
            } else {
                setErrPriceColor("#E32938");
                setErrPriceText("숫자만 입력가능합니다.");
            }
        }
    };

    const activeNmText = () => {
        iFocus.current.focus();
        setErrNmColor("#6490E7");
        setErrPriceColor("#EFF0F6");
        setTextInputType("sNm");
    };

    const unactiveNmText = () => {
        setErrNmColor("#EFF0F6");
        setErrPriceColor("#EFF0F6");
        setTextInputType("");
    };
    
    const activePriceText = () => {
        sFocus.current.focus();
        setErrNmColor("#EFF0F6");
        setErrPriceColor("#6490E7");
        setTextInputType("sPrice");
    };
    
    const unactivePriceText = () => {
        setErrNmColor("#EFF0F6");
        setErrPriceColor("#EFF0F6");
        setTextInputType("");
    };

    const nextInputSection = async (sIndex) => {
        if(sIndex === "sNm"){
            if(sPrice !== "" && sNm !== "") {
                insertOption();
            } else if(sPrice === ""){
                unactiveNmText();
                activePriceText();
            } else {
                unactiveNmText();
                Keyboard.dismiss();
            }
        } else {
            if(sPrice !== "" && sNm !== "") {
                insertOption();
            } else if(sNm === ""){
                unactivePriceText();
                activeNmText();
            } else {
                unactivePriceText();
                Keyboard.dismiss();
            }
        }
    };

    const deleteOptionList = (key) => {
        let tempList = sData.current;
        sData.current = tempList.filter((item) => item.key !== parseInt(key));
        setData(tempList.filter((item) => item.key !== parseInt(key)));
    }

    const insertOption = () => {
        if(sNm !== "" && sPrice !== ""){
            const xData = {
                key : parseInt(sData.current.length) + 1,
                name : sNm,
                price : parseInt(sPrice)
            }
            setData([...sData.current, xData]);
            sData.current = [...sData.current, xData];
            unactiveNmText();
            unactivePriceText();
            setNm("");
            setPrice("");
            Keyboard.dismiss();
        }
    };

    const done = async () => {
        if(iData.length > 0){
            if(parseInt(iData.length) >= sMaxNm){
                if(fnNextStep !== undefined && typeof fnNextStep === "function"){
                    await fnNextStep(iData);
                }
            } else {
                setErrLoadText(`옵션을 ${sMaxNm}개 이상 등록해주세요`);
                setErrLoad(true);
            }
        } else {
            setErrLoadText("옵션을 추가해주세요");
            setErrLoad(true);
        }
    }
    
    const backStep = async () => {
        if(fnBackGroupList !== undefined && typeof fnBackGroupList === "function"){
            await fnBackGroupList("step1",width * 0.66);
        }
    }

    const onKeyboardDidShow = (e) => {
        setKeyboardHeight(e.endCoordinates.height);
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

    useEffect(() => {
        sData.current = nData;
        setData(nData);
        setMaxNm(iMaxNm);
    }, [nData]);

    Animated.timing(animated, {
        toValue: width * 0.66,
        duration: 1000,
        useNativeDriver: false,
    }).start();

    return (
        <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={{flex:1, backgroundColor: "#fff"}}>
            {errLoad &&
                <View style={{position: "absolute", zIndex: 999, top: 0, height: "100%", width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: width * 0.04}}>
                    <View style={{height: height * 0.19, width: "80%", borderRadius: 10, backgroundColor: "#fff"}}>
                        <View style={{height: height * 0.09, width: "100%", justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#333D4B"}}>{errLoadText}</Text>
                        </View>
                        <View style={{height: height * 0.1, width: "100%", justifyContent: "center", alignItems: "center"}}>
                            <TouchableOpacity onPress={() => setErrLoad(false)} style={{height: height * 0.06, width: "80%", borderColor: "#E1E2E3", borderWidth: 1, borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontSize: RFPercentage(1.7), fontWeight: '800', color: "#4E5867"}}>확인</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            }
            <View style={{height: height * 0.1, backgroundColor: "#fff", justifyContent: "flex-end", alignItems: "center"}}>
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#333D4B" }}>새 옵션 그룹 추가</Text>
                <TouchableOpacity onPress={quitStep} style={{position: "absolute", bottom: 0, right: "5%", height: height * 0.05, width: height * 0.05, justifyContent: "flex-end", alignItems: "center"}}>
                    <ComponentDelete iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={backStep} style={{position: "absolute", bottom: 0, left: "5%", height: height * 0.03, width: height * 0.03, justifyContent: "flex-end", alignItems: "center"}}>
                    <ComponentArrowLeft3 iHeight={height * 0.025} iWidth={height * 0.025} iColor={"#646970"}/>
                </TouchableOpacity>
            </View>
            <Animated.View style={[objectStyles.object, animationStyles]}/>
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <View style={{height: height * 0.1, width, justifyContent: "center", marginLeft: "5%"}}>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>옵션</Text>
                </View>
                <FlatList
                    data={iData}
                    ListHeaderComponent={
                        <>
                        <View style={{height: height * 0.06, width, flexDirection: "row", marginLeft: "5%", alignItems: "center"}}>
                            <TextInput
                                ref={iFocus}
                                placeholder="예) ICE"
                                placeholderTextColor="#919AA7"
                                returnKeyType="next"
                                onChangeText={text => onChangeNm(text)}
                                onFocus={() => activeNmText()}
                                onBlur={() => unactiveNmText()}
                                onSubmitEditing={() => nextInputSection("sNm")}
                                value={sNm}
                                style={{
                                    width: "42%",
                                    marginRight: "3%",
                                    height: height * 0.06,
                                    borderColor: errNmColor,
                                    fontSize: RFPercentage(2),
                                    borderWidth: 1,
                                    fontWeight: '500',
                                    paddingLeft: "5%",
                                    backgroundColor: '#FAFAFB',
                                    borderRadius: 5,
                                    color: "#000"
                                }}
                                />
                            <TextInput
                                ref={sFocus}
                                placeholder="예) 500"
                                placeholderTextColor="#919AA7"
                                returnKeyType="done"
                                keyboardType="numeric"
                                onChangeText={text => onChangePrice(text)}
                                onFocus={() => activePriceText()}
                                onBlur={() => unactivePriceText()}
                                onSubmitEditing={() => nextInputSection("sPrice")}
                                value={sPrice}
                                style={{
                                    width: "25%",
                                    marginRight: "3%",
                                    height: height * 0.06,
                                    borderColor: errPriceColor,
                                    fontSize: RFPercentage(2),
                                    borderWidth: 1,
                                    fontWeight: '500',
                                    paddingLeft: "5%",
                                    backgroundColor: '#FAFAFB',
                                    borderRadius: 5,
                                    color: "#000"
                                }}
                            />
                            <View style={{position: "absolute", top: 0, right: "30%", width: height * 0.04, height: height * 0.06, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#919AA7"}}>원</Text>
                            </View>
                            <TouchableOpacity onPress={insertOption} style={{height: height * 0.06, width: "17%", backgroundColor: "#6490E7", borderRadius: 5, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#fff"}}>+ 추가</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{height: height * 0.03, width, flexDirection: "row", marginLeft: "5%"}}>
                            <View style={{height: height * 0.03, width: "25%", marginRight: "3%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{errNmText}</Text>
                            </View>
                            <View style={{height: height * 0.03, width: "40%", marginRight: "3%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{errPriceText}</Text>
                            </View>
                            <View style={{height: height * 0.03, width: "18%"}} />
                        </View>
                        <View style={{height: height * 0.09, width, justifyContent: "flex-start", marginLeft: "5%"}}>
                            <View style={{height: height * 0.06, width: "90%", alignItems: "flex-start", justifyContent: "center", backgroundColor: "#F2F3F5", borderRadius: 5, paddingLeft: "5%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.8), color: "#505866" }}>이 옵션 그룹에는 최소{sMaxNm}개 이상의 옵션이 필요합니다.</Text>
                            </View>
                        </View>
                        <View style={{ height: height * 0.01, borderBottomColor: "#F2F3F5", borderBottomWidth: 1, marginLeft: "5%", marginRight: "5%"}}/>
                        <View style={{ height: height * 0.03}}/>
                        </>
                    }
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(data, index) => "list-" + index + Math.random()}
                    renderItem={({ item, index }) => {
                        return (
                            <>
                            {textInputType === "" &&
                                <View style={{height: height * 0.08, width, flexDirection: "row", marginLeft: "5%"}}>
                                    <View style={{ width: "42%", marginRight: "3%", height: height * 0.05, borderRadius: 5, justifyContent: "center", paddingLeft: "5%"}}>
                                        <Text style={{ fontSize: RFPercentage(2), fontWeight: '500', color: "#000"}}>{item.name}</Text>
                                    </View>
                                    <View style={{ width: "25%", marginRight: "3%", height: height * 0.05, borderRadius: 5, justifyContent: "center", paddingLeft: "5%"}}>
                                        <Text style={{ fontSize: RFPercentage(2), fontWeight: '500', color: "#000"}}>{item.price}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => deleteOptionList(item.key)} style={{height: height * 0.05, width: "17%", borderColor: "#EF4452", borderWidth: 1, borderRadius: 5, justifyContent: "center", alignItems: "center"}}>
                                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#EF4452"}}>삭제</Text>
                                    </TouchableOpacity>
                                    <View  style={{position: "absolute", top: 0, right: "30%", width: height * 0.04, height: height * 0.05, justifyContent: "center", alignItems: "center"}}>
                                        <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#919AA7"}}>원</Text>
                                    </View>
                                </View>
                            }
                            </>
                        ) 
                    }}
                />
                {textInputType === "sNm" &&
                    <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.42}}>
                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                    </TouchableOpacity>
                }
                {textInputType === "sPrice" &&
                    <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.36}}>
                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                    </TouchableOpacity>
                }
            </View>
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
        height: height * 0.03, 
        borderBottomColor: "#6490E7", 
        borderBottomWidth: 2
    },
}

export default Step2;