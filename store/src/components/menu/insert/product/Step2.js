import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, Image, PermissionsAndroid, Linking, Animated } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import ImagePicker from 'react-native-image-picker';
import FormData from 'form-data';
import mime from "mime";

import Common from '../../../../utils/common';

import { CompModalContent, CompModalSettingPage } from '../../../modal/ModalContents';

import { ComponentDelete } from '../../../../assets/svg/delete';
import { ComponentArrowLeft3 } from '../../../../assets/svg/arrowLeft3';
import { ComponentCamera } from '../../../../assets/svg/camera';
import { ComponentImageUpload } from '../../../../assets/svg/imageUpload';
import { ComponentDeleteImage } from '../../../../assets/svg/delete_image';

const { width, height } = Dimensions.get('window');

const Step2 = ({ oProps, fnBackGroupList, fnNextStep, fnDelete, iLogoImg, sImgUri, sAnimated }) => {
    const [animated] = useState(new Animated.Value(sAnimated));

    const [logoImg, setLogoImg] = useState(null);
    const [imgUri, setImageuri] = useState("");

    const done = async () => {
        if(fnNextStep !== undefined && typeof fnNextStep === "function"){
            await fnNextStep(logoImg,imgUri);
        }
    }

    const backStep = async () => {
        if(fnBackGroupList !== undefined && typeof fnBackGroupList === "function"){
            await fnBackGroupList("step1",width * 0.4);
        }
    }

    const quitStep = async () => {
        if(fnDelete !== undefined && typeof fnDelete === "function"){
            await fnDelete();
        }
    }

    const openModal = (sIndex) => {
        oProps.appManager.showModal(
            true,
            <CompModalContent sText={sIndex}/>, 
            "custom",
            2500
        );
    };

    const settingModalCancel = () => {
        oProps.appManager.hideModal();
    }

    const settingModalMove = () => {
        Linking.openSettings();
        oProps.appManager.hideModal();
    }

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

    const deleteImg = () => {
        setLogoImg(null);
        setImageuri("");
    }

    const animationStyles = {
        width: animated,
    };

    Animated.timing(animated, {
        toValue: width * 0.4,
        duration: 1000,
        useNativeDriver: false,
    }).start();

    useEffect(() => {
        setLogoImg(iLogoImg);
        setImageuri(sImgUri);
    }, [iLogoImg,sImgUri]);

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            <View style={{height: height * 0.06, backgroundColor: "#fff", justifyContent: "flex-end", alignItems: "center"}}>
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#333D4B" }}>메뉴 추가</Text>
                <TouchableOpacity onPress={quitStep} style={{position: "absolute", bottom: 0, right: "5%", height: height * 0.05, width: height * 0.05, justifyContent: "flex-end", alignItems: "center"}}>
                    <ComponentDelete iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={backStep} style={{position: "absolute", bottom: 0, left: "5%", height: height * 0.03, width: height * 0.03, justifyContent: "flex-end", alignItems: "center"}}>
                    <ComponentArrowLeft3 iHeight={height * 0.025} iWidth={height * 0.025} iColor={"#646970"}/>
                </TouchableOpacity>
            </View>
            <View style={{ height: height * 0.03}}/>
            <Animated.View style={[objectStyles.object, animationStyles]}/>
            <View style={{flex:1}}>
                <View style={{height: height * 0.18}}>
                    <View style={{flex: 1, justifyContent: "center", marginLeft: "5%"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#333D4B"}}>
                            메뉴 이미지
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#B0B8C3"}}>
                                (선택)
                            </Text>
                        </Text>
                    </View>
                    <View style={{flex: 1, justifyContent: "flex-start", marginLeft: "5%"}}>
                        <Text style={{fontSize: RFPercentage(1.6), fontWeight: '500', color: "#95959E"}}>
                        이미지는 1080 x 1080 크기 이상의 10MB 이하, 
                        </Text>
                        <Text style={{fontSize: RFPercentage(1.6), fontWeight: '500', color: "#95959E"}}>
                        JPG/PNG 파일을 올릴 수 있어요. (최대1장)
                        </Text>
                    </View>
                </View>
                {imgUri !== "" ?
                    <View style={{height: height * 0.09, width: width * 0.25, marginLeft: "5%", borderRadius: 5}}>
                        <Image source={{uri: imgUri}} style={{height: height * 0.09, width: width * 0.25, borderRadius: 5}}/>
                        <TouchableOpacity onPress={() => deleteImg()} style={{position: "absolute", top: "5%", right: "5%", height: height * 0.03, width: height * 0.03 }}>
                            <ComponentDeleteImage iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                        </TouchableOpacity>
                    </View>
                :
                    <TouchableOpacity onPress={selectImage} style={{height: height * 0.09, width: width * 0.25, marginLeft: "5%", borderStyle: "dashed", borderWidth: 1, borderColor: "#D0D5DC", justifyContent: "center", alignItems: "center", borderRadius: 5}}>
                        <ComponentCamera iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#6490E7"}/>
                        <Text style={{fontSize: RFPercentage(1.6), fontWeight: '500', color: "#333D4B", marginTop: "5%"}}>첨부</Text>
                    </TouchableOpacity>
                }
            </View>
            <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center"}}>
                <TouchableOpacity onPress={done} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>다음</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const objectStyles = {
    object: {
        height: height * 0.005, 
        borderBottomColor: "#6490E7", 
        borderBottomWidth: 2
    },
}

export default Step2;