
import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard, Image, PermissionsAndroid, Linking, ScrollView } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ImagePicker from 'react-native-image-picker';
import LottieView from 'lottie-react-native';
import FormData from 'form-data';
import mime from "mime";
import moment from 'moment-timezone';
import 'moment/locale/ko';

import Common from '../../../utils/common';

import { ComponentArrowLeft3 } from '../../../assets/svg/arrowLeft3';

import { CompModalContent, CompModalSettingPage, CompCommercialSelect } from '../../modal/ModalContents';

import appBanner01 from '../../../assets/img/appBanner01.jpeg';
import tempImg from '../../../assets/img/banner_temp.png';

const { width, height } = Dimensions.get('window');

const Detail = ({ sProps, fnInitReturn, iDetailData, fnInsertCart, sParam }) => {
    const [loading, setLoading] = useState(false);

    const [bannerTitle, setBannerTitle] = useState("");
    const [bannerSubTitle, setBannerSubTitle] = useState("");
    const [bannerImg, setBannerImg] = useState("");
    const [bannerImgData, setBannerImgData] = useState(null);

    const [sNmErrColor, setNmErrColor] = useState("#F2F3F5");
    const [sSubNmErrColor, setSubNmErrColor] = useState("#F2F3F5");

    const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
    const [fDatePickerVisible, setFDatePickerVisibility] = useState(false);

    const [textInputType, setTextInputType] = useState("");

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const backToInfomation = async () => {
        if(fnInitReturn !== undefined && typeof fnInitReturn === "function"){
            await fnInitReturn();
        }
    }

    const settingModalCancel = () => {
        sProps.appManager.hideModal();
    }

    const withoutData = async (sIndex) => {
        if(fnInsertCart !== undefined && typeof fnInsertCart === "function"){
            await sProps.appManager.hideModal();
            await fnInsertCart(sIndex,"go");
        }
    }
    
    const settingModalMove = () => {
        Linking.openSettings();
        sProps.appManager.hideModal();
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

    const openModalPage = () => {
        sProps.appManager.showModal(
            true,
            <CompModalSettingPage 
                fnCancel={() => settingModalCancel()} 
                fnMove={() => settingModalMove()} 
            />, 
            "custom"
        );
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
                                setBannerImg(res.uri);
                                setBannerImgData(res);
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

    const onChangeNm = text => {
        setBannerTitle(text);
        setNmErrColor("#6490E7");
    };

    const onChangeSubNm = text => {
        setBannerSubTitle(text);
        setSubNmErrColor("#6490E7");
    };

    const handleFromConfirm = (date) => {
        setFromDate(moment(date).format("YYYY-MM-DD"));
        hideFromDatePicker();
    };

    const hideFromDatePicker = () => {
        setFDatePickerVisibility(false);
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

    const activeSubNmText = () => {
        setSubNmErrColor("#6490E7");
        setTextInputType("sub");
    }
    
    const unactiveSubNmText = () => {
        setSubNmErrColor("#F2F3F5");
        setTextInputType("");
        Keyboard.dismiss();
    }

    const nextInputSection = (sIndex) => {
        if(sIndex === "nm"){
            unactiveNmText();
        } else if (sIndex === "sub") {
            unactiveSubNmText();
        } else {
            Keyboard.dismiss();
            unactiveNmText();
            unactiveSubNmText();
        }
    }

    const createFormData = (photo, sNm) => {
        const formData = new FormData();

        let sFileUri = photo.uri.replace('file://', '');
        if (Platform.OS === 'android') {
            sFileUri = "file://" + photo.path;
        }

        formData.append('photo', {
            uri: sFileUri,
            type: mime.getType(sFileUri),
            name: sNm
        });

        return formData;
    };
    
    const uploadImageData = async (sIndex, sNm) => {
        let temp = {};
        const oData = await createFormData(sIndex, sNm);
        const oResponse = await sProps.appManager.accessAxios('/store/register/filesLogo', "post", "multipart", oData);
        if (oResponse !== undefined) {
            if (oResponse.url_path !== undefined && oResponse.url_path !== null && oResponse.url_path !== "") {
                temp = oResponse;
                return temp;

            } else {
                openModal("문제가 발생했습니다 관리자에 연락바랍니다.");
            }
        }
    }

    const insertBannerImg = async () => {
        setLoading(true);

        if(bannerTitle === ""){
            openModal("배너광고 제목을 입력해주세요.");
        } else if (bannerSubTitle === "") {
            openModal("배너광고 부제목을 입력해주세요.");
        } else if (bannerImg === "") {
            openModal("배너광고 사진을 선택해주세요.");
        } else if (bannerImgData === null) {
            openModal("배너광고 사진을 선택해주세요.");
        } else {
            let image1 = "";
            let progress1 = false;
            let progress2 = true;
            for await (const iterator of sParam) {
                if(iterator.param === "banner"){
                    progress2 = false;
                }
            }
            
            const result = await uploadImageData(bannerImgData, "nonTitle");
            if(result !== undefined){
                progress1 = true;
                image1 = result;
            }
            
            if(progress1){
                const oData = {
                    key: iDetailData.key,
                    name: iDetailData.param,
                    img: iDetailData.img,
                    title: iDetailData.name,
                    priceCasting: iDetailData.priceCasting,
                    price: iDetailData.price,
                    param: iDetailData.param,
                    bannerTitle,
                    bannerSubTitle,
                    bannerImgData,
                    bannerImgUrl: image1.url_path,
                    fromDate,
                }
                if(progress2){
                    if(fnInsertCart !== undefined && typeof fnInsertCart === "function"){
                        await fnInsertCart(oData,"no");
                    }
                } else {
                    openCommercialSelect(oData);
                }
            } else {
                openModal("사진 업로드에 실패하였습니다 다시 시도 바랍니다.");
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
                    {textInputType === "" &&
                        <View style={{height: height * 0.05, width, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{fontWeight: "900", fontSize: RFPercentage(2.5), color: "#000"}}>{iDetailData.name}</Text>
                        </View>
                    }
                    {textInputType === "" &&
                        <View style={{height: height * 0.1, width: "80%", justifyContent: "flex-start", alignItems: "center", marginLeft: "10%", marginRight: "10%"}}>
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.8), color: "#6B7583"}}>{iDetailData.detail2}</Text>
                        </View>
                    }
                    <View style={{height: height * 0.23, width, alignItems: "center", justifyContent: "space-around" }}>
                        <Text style={{fontWeight: "400", fontSize: RFPercentage(1.6), color: "#666666"}}>-예시-</Text>
                        <View style={{height: height * 0.2, width: width * 0.8, alignItems: "center", justifyContent: "center", backgroundColor: "#F1F3F7", borderRadius: width * 0.03 }}>
                            <View style={{position: "absolute", top: height * 0.03, left: width * 0.05, backgroundColor: "#fff", height: height * 0.025, minWidth: width * 0.2, borderRadius: width * 0.05, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#B3B3BC"}}>
                                <Text style={{fontWeight: "400", fontSize: RFPercentage(1.4), color: "#111111"}}>{sProps.UserConfigReducer.StoreName}</Text>
                            </View>
                            <View style={{position: "absolute", top: height * 0.06, left: width * 0.05, height: height * 0.03, width: width * 0.3, justifyContent: "flex-end"}}>
                                <Text style={{fontWeight: "400", fontSize: RFPercentage(1.8), color: "#111111"}}>{bannerSubTitle !== "" ? bannerSubTitle : "4월 이벤트" }</Text>
                            </View>
                            <View style={{position: "absolute", top: height * 0.1, left: width * 0.05, height: height * 0.08, width: width * 0.35, justifyContent: "flex-start"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.3), color: "#111111"}}>{bannerTitle !== "" ? bannerTitle : "딱한달! 14,400원 (300g)" }</Text>
                            </View>
                            <View style={{position: "absolute", top: height * 0.03, right: width * 0.05, height: height * 0.14, width: height * 0.14, justifyContent: "center", alignItems: "center"}}>
                                {bannerImg !== "" ?
                                    <Image source={{uri: bannerImg}} style={{width: "100%", height : "100%", borderRadius: width * 0.03, resizeMode: "stretch"}}/>
                                :
                                    <Image source={tempImg} style={{width: "100%", height : "100%", resizeMode: "contain"}}/>
                                }
                            </View>
                        </View>
                    </View>
                    {(textInputType === "" || textInputType === "nm") &&
                        <View style={{height: height * 0.15, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                            <View style={{height: height * 0.05, backgroundColor: "#fff", width, justifyContent: "flex-end", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>배너광고 제목</Text>
                            </View>
                            <TextInput
                                placeholder="예) 딱한달! 14,400원 (300g)"
                                placeholderTextColor="#B0B7C1"
                                returnKeyType="next"
                                maxLength={20}
                                onChangeText={text => onChangeNm(text)}
                                onFocus={() => activeNmText()}
                                onBlur={() => unactiveNmText()}
                                onSubmitEditing={() => nextInputSection("nm")}
                                value={bannerTitle}
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
                    {(textInputType === "" || textInputType === "sub") &&
                        <View style={{height: height * 0.15, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                            <View style={{height: height * 0.05, backgroundColor: "#fff", width, justifyContent: "flex-end", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>배너광고 부제목</Text>
                            </View>
                            <TextInput
                                placeholder="예) 4월 이벤트"
                                placeholderTextColor="#B0B7C1"
                                returnKeyType="next"
                                maxLength={8}
                                onChangeText={text => onChangeSubNm(text)}
                                onFocus={() => activeSubNmText()}
                                onBlur={() => unactiveSubNmText()}
                                onSubmitEditing={() => nextInputSection("sub")}
                                value={bannerSubTitle}
                                style={{
                                    width: "90%",
                                    height: height * 0.07,
                                    fontSize: RFPercentage(2.3),
                                    borderBottomColor: sSubNmErrColor,
                                    borderBottomWidth: 1,
                                    fontWeight: '500',
                                    backgroundColor: '#fff',
                                    color: "#000"
                                }}
                            />
                        </View>
                    }
                    {textInputType === "" &&
                        <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center"}}>
                            <View style={{height: height * 0.07, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>배너광고 사진</Text>
                            </View>
                            <TouchableOpacity onPress={selectImage} style={{height: height * 0.06, width: width * 0.9, backgroundColor: "#FAFAFB", justifyContent: "center", paddingLeft: "5%", borderRadius: width * 0.02}}>
                                <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#2F2F2F" }}>
                                    + 
                                    <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#4E5867" }}>
                                        파일 첨부하기
                                    </Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {textInputType === "" &&
                        <View style={{height: height * 0.16, alignItems: "center" }}>
                            <View style={{height: height * 0.05, backgroundColor: "#fff", width, justifyContent: "flex-end", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>광고 사용기간을 입력해주세요</Text>
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
                                <TouchableOpacity onPress={() => setFDatePickerVisibility(true)} style={{height: height * 0.06, width: "43%", backgroundColor: "#FAFAFB", borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: "4%"}}>
                                    <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#333D4B"}}>{fromDate}</Text>
                                </TouchableOpacity>
                                <View style={{height: "100%", width: "10%", marginRight: "5%", justifyContent: "center", alignItems: "center"}}>
                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(1.9), color: "#333D4B" }}>부터</Text>
                                </View>
                                <View style={{height: height * 0.06, width: "25%", borderRadius: 10, alignItems: "center", justifyContent: "center"}}>
                                    <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#333D4B"}}>
                                        <Text style={{fontWeight: "800", fontSize: RFPercentage(1.9), color: "#6490E7"}}>
                                            30일
                                        </Text>
                                        동안
                                    </Text>
                                </View>
                            </View>
                        </View>
                    }
                </ScrollView>
                {(textInputType === "nm" || textInputType === "sub") &&
                    <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.42}}>
                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                    </TouchableOpacity>
                }
                {textInputType === "" &&
                    <View style={{height: height / 6 , backgroundColor: "#fff", justifyContent: "center"}}>
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