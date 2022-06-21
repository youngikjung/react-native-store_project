import React, {useState,useEffect,useRef} from 'react';
import { View, Dimensions, Text, TouchableOpacity, ScrollView, AppState, Linking, TextInput, PermissionsAndroid, StatusBar, Keyboard, Image, Platform } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import ImagePicker from 'react-native-image-picker';
import PushNotification, { Importance } from 'react-native-push-notification';
import FormData from 'form-data';
import mime from "mime";
import LottieView from 'lottie-react-native';

import { CompModalContent, CompModalSettingPage, ComSelectionData } from '../../components/modal/AppModalContent';

import Footer from '../../components/footer/Footer';

import Common from '../../utils/common';

import { AppRoute } from '../../routes/AppRoutes';

import { ComponentIcImg} from '../../assets/svg/ic_img';
import {ComponentArrowDown1} from '../../assets/svg/arrow_down1';

let discountCheckTime;

const { width, height } = Dimensions.get('window');

const QuickInsert = oProps => {
    const [loading, setLoading] = useState(false);

    const [orderCount, setOrderCount] = useState("");

    const [sCategoryList, setCategoryList] = useState([]);
    const [categoryId, setCategoryId] = useState("");
    const [textNm, setTextNm] = useState("");

    const [sNm, setNm] = useState("");
    const [discountNm, setDiscountNm] = useState("");
    const [logoImg, setLogoImg] = useState(null);
    const [imgUri, setImageuri] = useState("");
    const [sOriginPrice, setOriginPrice] = useState("");
    const [sPrice, setPrice] = useState("");
    const [iStock, setStock] = useState("");

    const [errNmColor, setErrNmColor] = useState("#fff");
    const [errOriginPriceColor, setErrOriginPriceColor] = useState("#fff");
    const [errPriceColor, setErrsPriceColor] = useState("#fff");
    const [errStockColor, setErrStockColor] = useState("#fff");

    const [textInputType, setTextInputType] = useState("");

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const appState = useRef(AppState.currentState);

    const onChangeNm = text => {
        setNm(text);
        setErrNmColor("#6490E7");
    };

    const onChangeStock = text => {
        const value = text;
        const reg = /^-?\d*(\.\d*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === "" || value === "-") {
            setStock(value);
        }
    };

    const onChangeOrignPrice = text => {
        const value = text;
        const reg = /^-?\d*(\.\d*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === "" || value === "-") {
            setErrOriginPriceColor("#6490E7");
            setOriginPrice(value);
        }
    };

    const onChangePrice = text => {
        const value = text;
        const reg = /^-?\d*(\.\d*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === "" || value === "-") {
            setPrice(value);
        }

        if(discountCheckTime) clearTimeout(discountCheckTime);
        discountCheckTime = setTimeout(() => {
            let temp = 0;
            if(value.toString().trim() === "" || sOriginPrice.toString().trim() === ""){
                temp = 0;
            } else  {
                temp = Math.round(parseFloat(100 - (value / sOriginPrice * 100)));
            }
            setDiscountNm(temp);
        }, 300);
    };

    const selectImage = async () => {
        const oOpt = {
            noData: true, 
            mediaType: 'photo',
            title: '사진 선택',
            cancelButtonTitle: '취소',
            takePhotoButtonTitle: '사진 찍기...',
            chooseFromLibraryButtonTitle: '앨범에서 사진선택...',
            waitUntilSaved: true
        };
        try {
            let process = false;
            let granted = "";
            if (Platform.OS === 'android') {
                granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    process = true;
                }
            } else {
                process = true;
            }
            if (process) {
                ImagePicker.showImagePicker(oOpt, async (res) => {
                    if (res.uri != null && res.uri != undefined && res.uri != '') {
                        const typeCheck = Common.isValidFileType(res.type);
                        if (typeCheck) {
                            if (res.fileSize <= 10000000) {
                                setImageuri(res.uri);
                                setLogoImg(res);
                            } else {
                                openModal("파일의 용량은 10MB이하만 가능합니다");
                            }
                        } else {
                            openModal("PNG 파일이나 JPG 파일만 가능합니다.");
                        }
                    } else if (res.error) {
                        if(res.error.toString() === "Camera permissions not granted"){
                            openModal("카메라 접근 권한이 필요합니다.");
                        } else {
                            openModal("일시적인 에러가 발생했습니다, 다시 시도해주세요.");
                        }
                    }
                });
            } else {
                openModalPage();
            }
        } catch (error) {
            openModal("일시적인 에러가 발생했습니다, 다시 시도해주세요.");
        }

    }

    const openModalPage = () => {
        oProps.appManager.showModal(
            true,
            <CompModalSettingPage 
                fnCancel={() => oProps.appManager.hideModal()} 
                fnMove={() => settingModalMove()} 
            />, 
            "custom"
        );
    };

    const settingModalMove = () => {
        Linking.openSettings();
        oProps.appManager.hideModal();
    }

    const openModal = (sIndex) => {
        oProps.appManager.showModal(
            true,
            <CompModalContent 
                sText={sIndex}
            />, 
            "custom",
            2500
        );
    };

    const rowTextSelection = async () => {
        oProps.appManager.showModal(
            true,
            <ComSelectionData
                sList={sCategoryList}
                fnSelectValue={(sIndex) => onChangeCategory(sIndex)}
            />, 
            "custom"
        );
    }

    const onChangeCategory = async (sIndex) => {
        await oProps.appManager.hideModal();
        setTextNm(sIndex.name);
        setCategoryId(parseInt(sIndex.id))
    }

    const nextInputSection = (sIndex) => {
        if(sIndex === "sNm"){
            unactiveNmText();
        } else if (sIndex === "sOriginPrice") {
            unactiveOriginPriceText();
        } else if (sIndex === "sPrice") {
            unactiveDiscountPriceText();
        } else if (sIndex === "iStock") {
            unactiveStockText();
        }
    }

    const activeNmText = () => {
        setErrNmColor("#6490E7");
        setTextInputType("sNm");
    };

    const unactiveNmText = () => {
        setErrNmColor("#fff");
        setTextInputType("");
        Keyboard.dismiss();
    };

    const activeOriginPriceText = () => {
        setErrOriginPriceColor("#6490E7");
        setTextInputType("sOriginPrice");
    };

    const unactiveOriginPriceText = () => {
        setErrOriginPriceColor("#fff");
        setTextInputType("");
        Keyboard.dismiss();
    };

    const activeDiscountPriceText = () => {
        setErrsPriceColor("#6490E7");
        setTextInputType("sPrice");
    };

    const unactiveDiscountPriceText = () => {
        setErrsPriceColor("#fff");
        setTextInputType("");
        Keyboard.dismiss();
    };

    const activeStockText = () => {
        setErrStockColor("#6490E7");
        setTextInputType("iStock");
    };

    const unactiveStockText = () => {
        setErrStockColor("#fff");
        setTextInputType("");
        Keyboard.dismiss();
    };

    const createFormData = (photo) => {
        const formData = new FormData();

        let sFileUri = photo.uri.replace('file://', '');
        if (Platform.OS === 'android') {
            sFileUri = "file://" + photo.path;
        }

        formData.append('photo', {
            uri: sFileUri,
            type: mime.getType(sFileUri),
            name: "nonTitle"
        });

        return formData;
    };

    const uploadImageData = async () => {
        let temp = "";
        const oData = await createFormData(logoImg);
        const oResponse = await oProps.appManager.accessAxios('/store/register/filesLogo', "post", "multipart", oData);
        if (oResponse !== undefined) {
            if (oResponse.url_path !== undefined && oResponse.url_path !== null && oResponse.url_path !== "") {
                temp = oResponse.url_path;
                return temp;
            } else {
                openModal("문제가 발생했습니다 관리자에 연락바랍니다.");
            }
        }
    }

    const insertProduct = async () => {
        setLoading(true);

        let pictureData = {};
        let process = false;
        if(sNm === ""){
            setErrNmColor("#EF4452");
        } else if (sOriginPrice === ""){
            setErrOriginPriceColor("#EF4452");
        } else if (imgUri === ""){
            openModal("사진을 등록바랍니다.");
        } else {
            const result = await uploadImageData();
            if(result !== ""){
                process = true;
                pictureData = result;
            } else {
                openModal("사진을 등록바랍니다.");
            }
        }

        if(process){
            const oData = {
                sNm,
                sOriginPrice,
                sPrice,
                iStock,
                categoryId,
                pictureData,
                store_id: oProps.UserConfigReducer.StoreID
            }
            const oResponse = await oProps.appManager.accessAxios("/app/ceo/store/quick/product", "post", null, oData);
            if(oResponse !== undefined){
                if(oResponse.resultCd === "0000"){
                    openModal("등록되었습니다");
                    setNm("");
                    setOriginPrice("");
                    setPrice("");
                    setLogoImg(null);
                    setImageuri("");
                    setStock("");
                    setDiscountNm("");
                } else {
                    openModal(oResponse.resultMsg);
                }
            }
        }

        setLoading(false);
    }

    const getList = async () => {
        let oUserConfig = {};
        oUserConfig['APPROUTE'] = AppRoute.QUICKINSERT;
        await oProps.reduxSetUserConfig(oUserConfig);

        const oResponse = await oProps.appManager.accessAxios("/store/order/getall", "get", "login", null);
        if(oResponse !== undefined){
            if(oResponse.isOrder){
                if(parseInt(oResponse.iReady) > 0){
                    oProps.appManager.navGoTo('reset', AppRoute.ORDER)
                } else {
                    if((parseInt(oResponse.iReady) + parseInt(oResponse.iPrepare) + parseInt(oResponse.iComplete)) > 0){
                        setOrderCount(parseInt(oResponse.iReady) + parseInt(oResponse.iPrepare) + parseInt(oResponse.iComplete));
                    } else {
                        setOrderCount(0);
                    }
                }
            } else {
                setOrderCount(0);
            }
        } else {
            setOrderCount(0);
        }
    }

    const getCategory = async () => {
        setLoading(true);

        const store_id = oProps.UserConfigReducer.StoreID;
        const oResponse = await oProps.appManager.accessAxios("/app/ceo/store/detailMenuList-" + store_id, "get", "text", null);
        if(oResponse !== undefined){
            if(oResponse.sResult.length > 0){
                setCategoryList(oResponse.sResult);
                setTextNm(oResponse.sResult[0].name);
                setCategoryId(parseInt(oResponse.sResult[0].id))
            }
        }
        setLoading(false);
    }

    const onKeyboardDidShow = (e) => {
        setKeyboardHeight(e.endCoordinates.height);
    }
    
    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
        getList();
        getCategory();
    }, []);

    useEffect(() => {
        const subscription = AppState.addEventListener("change", nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === "active") {
                PushNotification.removeAllDeliveredNotifications();
                getList();
            }
            appState.current = nextAppState;
        });
        PushNotification.removeAllDeliveredNotifications();

        return () => {
            subscription.remove();
        };
    },[]);

    return (
        <View style={{flex:1, backgroundColor: "#fff" }}>
            {loading ?
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
                :
                <>
                    <View style={{height: height * 0.1, flexDirection: "row" }}>
                        <View style={{flex: 0.3, justifyContent: "center", paddingLeft: width * 0.07, marginTop: "5%" }}>
                            <Text style={{fontWeight: "700", fontSize: RFPercentage(2.1), color: "#191F28" }}>퀵 상품등록</Text>
                        </View>
                    </View>
                    <ScrollView style={{flex:1}}>
                        {textInputType === "" &&
                            <View style={{height: height * 0.19, alignItems: "center"}}>
                                <View style={{height: height * 0.07, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>
                                        메뉴사진
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#4E7BD3"}}> (필수)</Text>
                                    </Text>
                                </View>
                                <View style={{height: height * 0.12, width: "90%", alignItems: "center", backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-evenly"}}>
                                    <View style={{width: "50%", height: "100%", justifyContent: "center"}}>
                                        {logoImg !== null ?
                                            <Image source={{uri: imgUri}} style={{width: height * 0.1, height : height * 0.1, borderRadius: 5, resizeMode: "stretch"}}/>
                                        :
                                            <View style={{width: height * 0.1, height : height * 0.1, justifyContent: "center", alignItems: "center", backgroundColor: "#F2F3F5", borderRadius: 10, borderWidth: 1, borderColor: "#fff"}}>
                                                <ComponentIcImg iHeight={width * 0.08} iWidth={width * 0.05} iColor={"#000"}/>
                                            </View>
                                        }
                                    </View>
                                    <View style={{width: "50%", height: "100%", justifyContent: "center", alignItems: "center"}}>
                                        <TouchableOpacity onPress={() => selectImage()} style={{backgroundColor: "#6490E7", width: width * 0.25, height: height * 0.06, borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.8), color: "#fff"}}>{logoImg !== null ? "사진변경" : "사진등록"}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        }
                        {textInputType === "" &&
                            <View style={{height: height * 0.13, width}}>
                                <View style={{height: height * 0.06, marginLeft: "5%", justifyContent: "center"}}>
                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>
                                        메뉴그룹
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#4E7BD3"}}> (필수)</Text>
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => rowTextSelection()} style={{width: "90%", height: height * 0.06, justifyContent: "center", marginLeft: "5%", backgroundColor: "#F2F3F5", borderRadius: width * 0.02, borderWidth: 1, borderColor: "#fff"}}>
                                    <View style={{width: "90%", height: height * 0.06, justifyContent: "center", paddingLeft: "5%"}}>
                                        <Text style={{color: "#000", fontWeight: "500", fontSize: RFPercentage(2.3)}}>{textNm}</Text>
                                        <View style={{position: "absolute", bottom: "20%", height: height * 0.04, width: width * 0.04, right: 0, justifyContent: "center", alignItems: "center"}}>
                                            <ComponentArrowDown1 iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }
                        {(textInputType === "" || textInputType === "sNm") &&
                            <View style={{height: height * 0.13, alignItems: "center"}}>
                                <View style={{height: height * 0.07, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>
                                        메뉴명
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#4E7BD3"}}> (필수)</Text>
                                    </Text>
                                </View>
                                <TextInput
                                    placeholder="예) 클래식 치즈버거 세트"
                                    placeholderTextColor="#919AA7"
                                    returnKeyType="done"
                                    onChangeText={text => onChangeNm(text)}
                                    onFocus={() => activeNmText()}
                                    onBlur={() => unactiveNmText()}
                                    onSubmitEditing={() => nextInputSection("sNm")}
                                    value={sNm}
                                    style={{
                                        width: "90%",
                                        height: height * 0.06,
                                        fontSize: RFPercentage(2),
                                        borderColor: errNmColor,
                                        borderWidth: 1,
                                        fontWeight: '500',
                                        paddingLeft: "5%",
                                        backgroundColor: '#F2F3F5',
                                        borderRadius: 5,
                                        color: "#000"
                                    }}
                                />
                            </View>
                        }
                        {(textInputType === "" || textInputType === "sOriginPrice") &&
                            <View style={{height: height * 0.13, alignItems: "center" }}>
                                <View style={{height: height * 0.07, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>
                                        가격
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#4E7BD3"}}> (필수)</Text>
                                    </Text>
                                </View>
                                <TextInput
                                    returnKeyType="done"
                                    keyboardType="numeric"
                                    onChangeText={text => onChangeOrignPrice(text)}
                                    onFocus={() => activeOriginPriceText()}
                                    onBlur={() => unactiveOriginPriceText()}
                                    onSubmitEditing={() => nextInputSection("sOriginPrice")}
                                    value={sOriginPrice}
                                    style={{
                                        width: "90%",
                                        height: height * 0.06,
                                        fontSize: RFPercentage(2),
                                        borderColor: errOriginPriceColor,
                                        borderWidth: 1,
                                        fontWeight: '500',
                                        paddingLeft: "5%",
                                        backgroundColor: '#F2F3F5',
                                        borderRadius: 5,
                                        color: "#000"
                                    }}
                                />
                                <View style={{height: height * 0.06, width: height * 0.06, top: height * 0.07, right: "5%", position: "absolute", justifyContent: "center", alignItems: "center"}}>
                                    <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#919AA7" }}>원</Text>
                                </View>
                            </View>
                        }
                        {(textInputType === "" || textInputType === "sPrice") &&
                            <View style={{height: height * 0.13, alignItems: "center"}}>
                                <View style={{height: height * 0.07, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>
                                        할인가
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#919AA7"}}> (선택)</Text>
                                    </Text>
                                </View>
                                <View style={{width: "90%", height: height * 0.06, flexDirection: "row", justifyContent: "space-between" }}>
                                    <TextInput
                                        returnKeyType="done"
                                        keyboardType="numeric"
                                        onChangeText={text => onChangePrice(text)}
                                        onFocus={() => activeDiscountPriceText()}
                                        onBlur={() => unactiveDiscountPriceText()}
                                        onSubmitEditing={() => nextInputSection("sPrice")}
                                        value={sPrice}
                                        style={{
                                            width: "65%",
                                            height: height * 0.06,
                                            fontSize: RFPercentage(2),
                                            borderColor: errPriceColor,
                                            borderWidth: 1,
                                            fontWeight: '500',
                                            paddingLeft: "5%",
                                            backgroundColor: '#F2F3F5',
                                            borderRadius: 5,
                                            color: "#000"
                                        }}
                                    />
                                    <View style={{width: "30%", height: height * 0.06, backgroundColor: "#919AA7", justifyContent: "center", alignItems: "center", borderRadius: 5}}>
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#fff" }}>할인율 {discountNm}%</Text>
                                    </View>
                                    <View style={{height: height * 0.06, width: height * 0.06, bottom: 0, left: "50%", position: "absolute", justifyContent: "center", alignItems: "center"}}>
                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#919AA7" }}>원</Text>
                                    </View>
                                </View>
                            </View>
                        }
                        {(textInputType === "" || textInputType === "iStock") &&
                            <View style={{height: height * 0.13, alignItems: "center"}}>
                                <View style={{height: height * 0.07, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>
                                        재고
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#919AA7"}}> (선택)</Text>
                                    </Text>
                                </View>
                                    <TextInput
                                        returnKeyType="done"
                                        keyboardType="numeric"
                                        onChangeText={text => onChangeStock(text)}
                                        onFocus={() => activeStockText()}
                                        onBlur={() => unactiveStockText()}
                                        onSubmitEditing={() => nextInputSection("iStock")}
                                        value={iStock}
                                        style={{
                                            width: "90%",
                                            height: height * 0.06,
                                            fontSize: RFPercentage(2),
                                            borderColor: errStockColor,
                                            borderWidth: 1,
                                            fontWeight: '500',
                                            paddingLeft: "5%",
                                            backgroundColor: '#F2F3F5',
                                            borderRadius: 5,
                                            color: "#000"
                                        }}
                                    />
                                    <View style={{height: height * 0.06, width: height * 0.06, bottom: 0, right: "5%", position: "absolute", justifyContent: "center", alignItems: "center"}}>
                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#919AA7" }}>개</Text>
                                    </View>
                            </View>
                        }
                        <View style={{height: height * 0.018}}/>
                    </ScrollView>
                    {(textInputType === "sOriginPrice" || textInputType === "sPrice" || textInputType === "iStock") &&
                        <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.36}}>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                        </TouchableOpacity>
                    }
                    {textInputType === "sNm" &&
                        <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.42}}>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                        </TouchableOpacity>
                    }
                    {textInputType === "" &&
                        <>
                            <View style={{height : height * 0.1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                                <TouchableOpacity onPress={insertProduct} style={{height : "80%", width: "90%", backgroundColor: "#2459C1", justifyContent: "center", alignItems: "center", borderRadius: width * 0.03}}>
                                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2.3), color: "#fff"}}>상품 등록하기</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{height: height * 0.12, backgroundColor: "#fff"}} />
                            <Footer 
                                oProps={oProps}
                                sOrder={orderCount}
                                sLocation={"product"}
                            />
                        </>
                    }
                </>
            }
        </View>
    )
}
export default QuickInsert;