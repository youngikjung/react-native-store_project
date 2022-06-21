import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard, ScrollView, FlatList } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';
import FormData from 'form-data';
import mime from "mime";

import Common from '../../../utils/common';

import Step1 from './product/Step1';
import Step2 from './product/Step2';
import Step3 from './product/Step3';
import Step4 from './product/Step4';
import Step5 from './product/Step5';

import { CompModalContent, CompModalSettingPage } from '../../modal/ModalContents';

const { width, height } = Dimensions.get('window');

const MenuInsert = ({ sProps, fnBackGroupList, sCategoryId, npath, apath }) => {
    const [sNm, setNm] = useState("");
    const [sPrice, setPrice] = useState("");
    const [sOriginPrice, setOriginPrice] = useState("");
    const [iStock, setStock] = useState("");
    const [productType, setProductType] = useState(false);
    const [discountNm, setDiscountNm] = useState("");
    const [logoImg, setLogoImg] = useState(null);
    const [imgUri, setImageuri] = useState("");
    const [sDetail, setDetail] = useState("");
    const [sList, setList] = useState([]);

    const [menuData, setMenuData] = useState({});

    const [loading, setLoading] = useState(false);
    const [state, setstate] = useState("step1");

    const [animated, setAnimated] = useState(width * 0);

    const backGroupList = async () => {
        if(fnBackGroupList !== undefined && typeof fnBackGroupList === "function"){
            await fnBackGroupList();
        }
    }

    const goToStep2 = async (sIndex) => {
        if(sIndex !== undefined){
            setNm(sIndex.sNm);
            setPrice(sIndex.sPrice);
            setOriginPrice(sIndex.sOriginPrice);
            setStock(sIndex.iStock);
            setProductType(sIndex.productType);
            setDiscountNm(sIndex.discountNm);
            setAnimated(width * 0.2);
            setstate("step2");
        }
    }
    
    const goToStep3 = async (sIndex,aIndex) => {
        setLogoImg(sIndex);
        setImageuri(aIndex);
        setAnimated(width * 0.4);
        setstate("step3");
    }
    
    const goToStep4 = async (sIndex) => {
        setDetail(sIndex);
        setAnimated(width * 0.6);
        setstate("step4");
    }
    
    const goToStep5 = async (sIndex) => {
        const oData = {
            sNm,
            sPrice,
            sOriginPrice,
            iStock,
            productType,
            discountNm,
            logoImg,
            imgUri,
            sDetail,
            sList: sIndex,
        }
        setMenuData(oData);
        setList(sIndex);
        setAnimated(width * 0.8);
        setstate("step5");
    }
    
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

    const openModal = (sIndex) => {
        sProps.appManager.showModal(
            true,
            <CompModalContent sText={sIndex}/>, 
            "custom",
            2500
        );
    };

    const uploadImageData = async () => {
        let temp = "";
        const oData = await createFormData(logoImg);
        const oResponse = await sProps.appManager.accessAxios('/store/register/filesLogo', "post", "multipart", oData);
        if (oResponse !== undefined) {
            if (oResponse.url_path !== undefined && oResponse.url_path !== null && oResponse.url_path !== "") {
                temp = oResponse.url_path;
                return temp;
            } else {
                openModal("문제가 발생했습니다 관리자에 연락바랍니다.");
            }
        }
    }

    const convertImageData = async () => {
        let temp = "";
        if(imgUri !== ""){
            const result = await uploadImageData();
            if(result !== ""){
                temp = result;
            }
        }
        return temp;
    }

    const lastStep = async () => {
        setLoading(true);
        const sImage = await convertImageData();
        const oData = {
            sCategory: parseInt(sCategoryId),
            sTitle: sNm,
            dPrice: sPrice,
            iPrice: sOriginPrice,
            sDesc: sDetail,
            sFileList: sImage,
            option: sList,
            iStock,
            productType: productType ? "only" : "normal",
            store_id: sProps.UserConfigReducer.StoreID
        }
        const oResponse = await sProps.appManager.accessAxios("/app/sales/store/register/product/v3", "post", null, oData);
        if(oResponse !== undefined){
            if(oResponse.resultCd === "0000"){
                openModal("등록되었습니다");
                backGroupList();
            } else {
                openModal(oResponse.resultMsg);
            }
        }
        setLoading(false);
    }
    
    const backStep = async (sIndex,aIndex) => {
        setAnimated(aIndex);
        setstate(sIndex);
    }
    
    return (
        <>
            {state === "step1" &&
                <Step1 
                    sAnimated={animated}
                    iNm={sNm}
                    iPrice={sPrice}
                    iOriginPrice={sOriginPrice}
                    sStock={iStock}
                    iProductType={productType}
                    iDiscountNm={discountNm}
                    oProps={sProps}
                    fnNextStep={(sIndex) => goToStep2(sIndex)}
                    fnDelete={() => backGroupList()}
                />
                }
            {state === "step2" &&
                <Step2 
                    sAnimated={animated}
                    oProps={sProps}
                    iLogoImg={logoImg}
                    sImgUri={imgUri}
                    fnNextStep={(sIndex,aIndex) => goToStep3(sIndex,aIndex)}
                    fnBackGroupList={(sIndex,aIndex) => backStep(sIndex,aIndex)}
                    fnDelete={() => backGroupList()}
                />
            }
            {state === "step3" &&
                <Step3
                    sAnimated={animated} 
                    iDetail={sDetail} 
                    oProps={sProps}
                    fnNextStep={(sIndex) => goToStep4(sIndex)}
                    fnBackGroupList={(sIndex,aIndex) => backStep(sIndex,aIndex)}
                    fnDelete={() => backGroupList()}
                />
            }
            {state === "step4" &&
                <Step4
                    sAnimated={animated} 
                    oProps={sProps}
                    iList={sList}
                    fnNextStep={(sIndex) => goToStep5(sIndex)}
                    fnBackGroupList={(sIndex,aIndex) => backStep(sIndex,aIndex)}
                    fnDelete={() => backGroupList()}
                    />
                }
            {state === "step5" &&
                <Step5 
                    sAnimated={animated} 
                    iMenuData={menuData} 
                    oProps={sProps}
                    fnNextStep={() => lastStep()}
                    fnBackGroupList={(sIndex,aIndex) => backStep(sIndex,aIndex)}
                    fnDelete={() => backGroupList()}
                />
            }
            {loading &&
                <View style={{position: "absolute", top: 0, height, width, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
        </>
    )
}

export default MenuInsert;