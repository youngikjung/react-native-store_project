import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, PermissionsAndroid, Keyboard, Image, Linking } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';
import ImagePicker from 'react-native-image-picker';
import FormData from 'form-data';
import mime from "mime";

import Common from '../../utils/common';

import { CompModalContent, CompModalSettingPage } from '../../components/modal/ModalContents';

import { ComponentDelete } from '../../assets/svg/delete';
import { ComponentArrowLeft3 } from '../../assets/svg/arrowLeft3';
import { ComponentImageUpload } from '../../assets/svg/imageUpload';
import { ComponentDeleteImage } from '../../assets/svg/delete_image';

import { AppRoute } from '../../routes/AppRoutes';

const { width, height } = Dimensions.get('window');

const StoreLogo = oProps => {
    const [loading, setLoading] = useState(false);
    const [sLocation, setLocation] = useState("");

    const [logoImg, setLogoImg] = useState(null);
    const [imgActiveUri, setImageActiveuri1] = useState("");

    const [imgUri1, setImageuri1] = useState("");
    const [imgUri2, setImageuri2] = useState("");
    const [imgUri3, setImageuri3] = useState("");

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
        oProps.appManager.navGoTo('reset', AppRoute.STOREORIGINNOTICE);
    }

    const settingModalCancel = () => {
        oProps.appManager.hideModal();
    }

    const settingModalMove = () => {
        Linking.openSettings();
        oProps.appManager.hideModal();
    }

    const openModal = (sIndex) => {
        oProps.appManager.showModal(
            true,
            <CompModalContent sText={sIndex}/>, 
            "custom",
            2500
        );
    };

    const openModalPage = () => {
        oProps.appManager.showModal(
            true,
            <CompModalSettingPage 
                fnCancel={() => settingModalCancel()} 
                fnMove={() => settingModalMove()} 
            />, 
            "custom"
        );
    };

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
                                setLogoImg(res);
                                setImageActiveuri1(res.uri);
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

    const deleteImg = () => {
        setLogoImg(null);
        setImageActiveuri1("");
    }

    const asyncData = async () => {
        setLoading(true);
        const store_id = oProps.UserConfigReducer.StoreID;
        const oResponse = await oProps.appManager.accessAxios("/app/sales/store/getStoreImage/v2-" + store_id, "get", "text", null);
        if(oResponse !== undefined && oResponse !== null){
            setImageActiveuri1(oResponse.url_path_logo);
            setImageuri1(oResponse.url_path_first);
            setImageuri2(oResponse.url_path_second);
            setImageuri3(oResponse.url_path_third);
        }
        setLoading(false);
    }

    const uploadImageData = async (sIndex, sNm) => {
        let temp = {};
        const oData = await createFormData(sIndex, sNm);
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

    const access = async () => {
        let tempProcess = true;
        let image1 = "";
        
        setLoading(true);
        if (logoImg !== null) {
            const result = await uploadImageData(logoImg, "nonTitle");
            if(result !== undefined){
                image1 = result;
            } else {
                tempProcess = false;
            }
        } else {
            image1 = imgActiveUri;
        }
        
        if(tempProcess){
            const oData = {
                store_id: oProps.UserConfigReducer.StoreID,
                imgData1 : image1,
                imgData2 : imgUri1,
                imgData3 : imgUri2,
                imgData4 : imgUri3,
            }
            const oResponse = await oProps.appManager.accessAxios("/app/sales/store/register/registerImage/v2", "post", null, oData);
            if(oResponse !== undefined){
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
    
                    oUserConfig['STORELOGO'] = false;
                    oUserConfig['STOREIMAGES'] = true;
    
                    await oProps.reduxSetUserConfig(oUserConfig);
                    oProps.appManager.navGoTo('reset', AppRoute.STOREIMAGES);
                }
            }
        }
        setLoading(false);
    }

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
        <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={{flex:1, backgroundColor: "#fff"}}>
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
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>브랜드 로고가 있다면 이미지를</Text>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>첨부해 주세요</Text>
                </View>

            :
                <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", marginLeft: "5%"}}>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>브랜드 로고가 있다면 이미지를</Text>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>
                    첨부해 주세요
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#919AA7", lineHeight: RFPercentage(3.5) }}>
                           (선택)
                        </Text>
                    </Text>
                </View>
            }
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <View style={{height: height * 0.3, backgroundColor: "#fff", alignItems: "center"}}>
                    <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>이미지</Text>
                    </View>
                    {imgActiveUri !== "" ?
                        <View style={{height:  height * 0.12, width, backgroundColor: "#fff", marginLeft: "10%", justifyContent: "flex-start", marginTop: "2%"}}>
                            <View 
                                style={{
                                    height: height * 0.1, 
                                    width: height * 0.13, 
                                    backgroundColor: "#fff", 
                                }}
                            >
                                <Image source={{uri: imgActiveUri}} style={{height: height * 0.1, width: height * 0.13, borderRadius: 10}}/>
                                <TouchableOpacity onPress={deleteImg} style={{position: "absolute", top: "5%", right: "5%", height: height * 0.03, width: height * 0.03 }}>
                                    <ComponentDeleteImage iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        :
                        <View style={{height:  height * 0.12, width, backgroundColor: "#fff", marginLeft: "10%", justifyContent: "flex-start", marginTop: "2%"}}>
                            <TouchableOpacity 
                                onPress={selectImage}
                                style={{
                                    height: height * 0.1, 
                                    width: height * 0.13, 
                                    backgroundColor: "#fff", 
                                    borderWidth: 1, 
                                    borderColor: "#D0D5DC", 
                                    borderRadius: 10,
                                    borderStyle: 'dashed',
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <ComponentImageUpload iHeight={height * 0.05} iWidth={width * 0.06} iColor={"#646970"}/>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.5), color: "#333D4B" }}>첨부</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
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
        </TouchableOpacity>
    )
}

export default StoreLogo;