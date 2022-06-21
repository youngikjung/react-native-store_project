import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Dimensions, TouchableOpacity, FlatList, ScrollView, Image, Linking, TextInput, Keyboard, Easing, Animated, PermissionsAndroid, RefreshControl } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import Postcode from '@actbase/react-daum-postcode';
import { WebView } from "react-native-webview";
import { ifIphoneX } from 'react-native-iphone-x-helper'
import LottieView from 'lottie-react-native';
import DraggableFlatList, {
    ScaleDecorator,
} from "react-native-draggable-flatlist"; 
import ImagePicker from 'react-native-image-picker';
import FormData from 'form-data';
import mime from "mime";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment-timezone';
import 'moment/locale/ko';

import Common from '../../utils/common';

import {ComponentCircle} from '../../assets/svg/circle';
import {ComponentCheckCircle} from '../../assets/svg/check_circle';
import { ComponentSelectCircle } from '../../assets/svg/select_circle';
import { ComponentDelete } from '../../assets/svg/delete';
import { ComponentDeleteCircle } from '../../assets/svg/deleteCircle';
import { ComponentQuestionMark } from '../../assets/svg/question_mark';
import { ComponentGroupList } from '../../assets/svg/groupList';
import { ComponentCheckBoxNone } from '../../assets/svg/checkbox_none';
import { ComponentCheckBox } from '../../assets/svg/checkbox';
import { ComponentDeleteImage } from '../../assets/svg/delete_image';
import { ComponentCamera } from '../../assets/svg/camera';
import { ComponentSelectedCircle } from '../../assets/svg/selectedCircle';
import { ComponentUnSelectedCircle } from '../../assets/svg/unselectedCircle';
import { ComponentArrowDown1 } from '../../assets/svg/arrow_down1';
import { ComponentSearch1 } from '../../assets/svg/search1';

import optionselecctedImg from '../../assets/img/optionseleccted.jpeg';
import preNoticeImg from '../../assets/img/pre_notice.jpg';
import menuDetailImg from '../../assets/img/menuDetail.jpg';
import menuGroupNmImg from '../../assets/img/menugroupnm.jpeg';
import throoOnlyImg from '../../assets/img/throoonly.jpeg';
import discountImg from '../../assets/img/discount.jpg';
import dncprnrImg from '../../assets/img/dncprnr.png';
import dnflImg from '../../assets/img/dnfl.png';
import eornImg from '../../assets/img/eorn.png';
import gkskImg from '../../assets/img/gksk.png';
import kakaoImg from '../../assets/img/kakao.png';
import kbankImg from '../../assets/img/kbank.png';
import qntksImg from '../../assets/img/qntks.png';
import rhkdwnImg from '../../assets/img/rhkdwn.png';
import rldjqImg from '../../assets/img/rldjq.png';
import rnralsImg from '../../assets/img/rnrals.png';
import scImg from '../../assets/img/sc.png';
import shdguqImg from '../../assets/img/shdguq.png';
import tksdjqImg from '../../assets/img/tksdjq.png';
import tlsgksImg from '../../assets/img/tlsgks.png';
import tlsguqImg from '../../assets/img/tlsguq.png';
import tlxlImg from '../../assets/img/tlxl.png';
import tnguqImg from '../../assets/img/tnguq.png';
import toakdmfrmarhImg from '../../assets/img/toakdmfrmarh.png';
import tossImg from '../../assets/img/toss.png';

import DragSortableView from '../../utils/drag/DragSortableView';

import { 
    MainTypeContent, 
    MainTypeList, 
    SubTypeContent, 
    SubTypeList, 
    BasicTerms, 
    AgreeTerms, 
    PersonalTerms, 
    CompModalTimeListStep1,
    CompModalTimeListStep2,
    ModalOptionList,
    ModalAddOption,
    ModalLastOption,
    MainTypePage,
    MainTypeSelectPage,
    SubTypePage,
    SubTypeSelectPage,
    MainTypeSelectedPage,
    OptionListPage,
    OptionAddPage1,
    OptionAddPage2,
    OptionAddPage3,
    OptionAddPage4,
    SubOptionListPage,
    SubOptionAddPage1,
    SubOptionAddPage2,
    SubOptionAddPage3,
    SubOptionAddPage4,
    MenuItem
 } from './SubContent';

 LocaleConfig.locales['fr'] = {
    monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
    monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
    dayNames: ['일요일','월요일', '화요일','수요일','목요일','금요일','토요일'],
    dayNamesShort: ['일', '월','화','수','목','금','토'],
    today: 'Aujourd\'hui'
};
LocaleConfig.defaultLocale = 'fr';

const { width, height } = Dimensions.get('window');
const bankTypeList = [
    {name:"토스뱅크", image: tossImg },
    {name:"카카오뱅크", image: kakaoImg },
    {name:"신한은행", image: tlsgksImg },
    {name:"우리은행", image: dnflImg },
    {name:"KB국민은행", image: rnralsImg },
    {name:"기업은행", image: rldjqImg },
    {name:"NH농협은행", image: shdguqImg },
    {name:"하나은행", image: gkskImg },
    {name:"산업은행", image: tksdjqImg },
    {name:"수협은행", image: tnguqImg },
    {name:"SC제일은행", image: scImg },
    {name:"한국씨티은행", image: tlxlImg },
    {name:"대구은행", image: eornImg },
    {name:"부산은행", image: qntksImg },
    {name:"광주은행", image: rhkdwnImg },
    {name:"제주은행", image: tlsgksImg },
    {name:"전북은행", image: rhkdwnImg },
    {name:"경남은행", image: qntksImg },
    {name:"새마을금고", image: toakdmfrmarhImg },
    {name:"신협", image: tlsguqImg },
    {name:"케이뱅크", image: kbankImg },
    {name:"우체국", image: dncprnrImg },
];
const dayList = [
    { id: 1, value : 1, name : "월요일"},
    { id: 2, value : 2, name : "화요일"},
    { id: 3, value : 3, name : "수요일"},
    { id: 4, value : 4, name : "목요일"},
    { id: 5, value : 5, name : "금요일"},
    { id: 6, value : 6, name : "토요일"},
    { id: 0, value : 0, name : "일요일"},
];

const eachDayList = [
    { value : 7, name : "매일"},
    { value : 8, name : "평일"},
    { value : 9, name : "토요일"},
    { value : 10, name : "일요일"},
];
const congestionList = [
    { value : 0, name : "여유"},
    { value : 1, name : "보통"},
    { value : 2, name : "바쁨"},
];

let discountCheckTime;
let productCheckTime;

export const CompCommercialSelect = ({ fnClose, fnInsert, nIndex }) => {
    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    const insert = async () => {
        if(fnInsert !== undefined && typeof fnInsert === "function"){
            await fnInsert(nIndex);
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "0%",
                marginTop: height * 0.1,
                width: width * 0.9,
                height: height * 0.31, 
                backgroundColor: "#fff",
                borderRadius: width * 0.03, 
            }}
        >
            <View style={{height: height * 0.03, width}} />
            <View style={{height: height * 0.04, marginLeft: "5%", justifyContent: "center"}}>
                <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>장바구니 추가</Text>
            </View>
            <View style={{height: height * 0.15, marginLeft: "5%", justifyContent: "center"}}>
                <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>장바구니에 해당 광고상품이</Text>
                <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>이미 담겨있습니다 기존 광고를 삭제하고</Text>
                <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>해당 광고를 장바구니에 담을까요?</Text>
            </View>
            <View style={{height: height * 0.09, flexDirection: "row", justifyContent: "center"}}>
                <TouchableOpacity onPress={close} style={{height: "70%", width: "42%", backgroundColor: "#EF4452", marginRight: "5%", borderRadius: 5, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#fff"}}>아니오</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={insert} style={{height: "70%", width: "42%", backgroundColor: "#F2F3F5", borderRadius: 5, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>예</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const CompCartAllDelete = ({ fnClose, fnInsert }) => {
    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    const insert = async () => {
        if(fnInsert !== undefined && typeof fnInsert === "function"){
            await fnInsert();
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "0%",
                marginTop: height * 0.1,
                width: width * 0.9,
                height: height * 0.31, 
                backgroundColor: "#fff",
                borderRadius: width * 0.03, 
            }}
        >
            <View style={{height: height * 0.03, width}} />
            <View style={{height: height * 0.04, marginLeft: "5%", justifyContent: "center"}}>
                <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>전체삭제</Text>
            </View>
            <View style={{height: height * 0.15, marginLeft: "5%", justifyContent: "center"}}>
                <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>장바구니에 담긴 모든 상품을</Text>
                <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>삭제하시겠습니까?</Text>
            </View>
            <View style={{height: height * 0.09, flexDirection: "row", justifyContent: "center"}}>
                <TouchableOpacity onPress={close} style={{height: "70%", width: "42%", backgroundColor: "#EF4452", marginRight: "5%", borderRadius: 5, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#fff"}}>아니오</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={insert} style={{height: "70%", width: "42%", backgroundColor: "#F2F3F5", borderRadius: 5, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>예</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const CompModalContent = ({sText}) => {

    return (
        <View 
            style={{
                marginHorizontal: "0%",
                marginTop: width * 0.1,
                width: width * 0.9,
                height: width * 0.2, 
                backgroundColor: "#fff",
                borderRadius: width * 0.02, 
            }}
        >
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", margin: "5%"}}>
                <Text style={{fontSize: RFPercentage(1.7), fontWeight: '800', color: "#6490E8"}}>{sText}</Text>
            </View>
        </View>
    )
}

export const CompModalOptionControll = ({ sProps, fnCancel, fnSelectValue }) => {
    const [loading, setLoading] = useState(false);

    const [optionList, setOptionList] = useState([]);

    const [state, setstate] = useState("list");
    const [animated, setAnimated] = useState(0);

    const [sNm, setNm] = useState("");
    const [iData, setData] = useState([]);

    const [mustItem, setMustItem] = useState("radio");
    const [sMaxNm, setMaxNm] = useState(1);
    const [sMinNm, setMinNm] = useState(1);

    const optionBox = useRef([]);

    const close = async () => {
        if(fnCancel !== undefined && typeof fnCancel === "function"){
            await fnCancel();
        }
    }

    const checkValue = async (sIndex,aIndex,xIndex,nIndex) => {
        let tempList = optionBox.current;
        if(xIndex !== ""){
            let temp = {
                key: sIndex,
                name: aIndex,
                list: nIndex,
            }
            tempList.push(temp);
            optionBox.current = tempList;
        } else {
            optionBox.current = tempList.filter((item) => item.key !== sIndex);
        }
    }

    const addPage = async () => {
        setstate("step1");
    }

    const nextStep = async (sIndex,aIndex,dIndex) => {
        setLoading(true);
        if(sIndex === "step2"){
            setNm(dIndex.sNm);
            setMustItem(dIndex.mustItem);
            setMaxNm(dIndex.sMaxNm);
            setMinNm(dIndex.sMinNm);
        } else if (sIndex === "step3"){
            setData(dIndex);
        }
        setstate(sIndex);
        setAnimated(aIndex);
        setLoading(false);
    }
    
    const insertOption = async () => {
        setLoading(true);
        const store_id = sProps.UserConfigReducer.StoreID;
        let oData = {
            sGroupTitle : sNm,
            type : mustItem,
            sData : iData,
            maxCount : 1,
            minCount : 1,
            store_id,
        }
        if(mustItem === "checkbox"){
            oData = {
                sGroupTitle : sNm,
                type : mustItem,
                sData : iData,
                maxCount : sMaxNm,
                store_id,
            }
        } else {
            if(parseInt(sMaxNm) > 1){
                oData = {
                    sGroupTitle : sNm,
                    type : "radioDouble",
                    sData : iData,
                    maxCount : sMaxNm,
                    minCount : sMaxNm,
                    store_id,
                }
            }
        }
        const oResponse = await sProps.appManager.accessAxios("/app/sales/store/register/insertOption/v2", "post", null, oData);
        if(oResponse !== undefined){
            if(oResponse.resultCd === "0000"){
                setNm("");
                setData([]);
                setMustItem("radio");
                setMaxNm(1);
                setMinNm(1);
                setAnimated(0);
                await getList();
                setstate("list");
            }
        }
        setLoading(false);
    }

    const prevStep = async (sIndex,aIndex) => {
        setstate(sIndex);
        setAnimated(aIndex);
    }

    const stopStep = async () => {
        setAnimated(0);
        setstate("list");
    }
    
    const selectedList = async () => {
        if(fnSelectValue !== undefined && typeof fnSelectValue === "function"){
            await fnSelectValue(optionBox.current);
        }
    }

    const getList = async () => {
        setLoading(true);
        const store_id = sProps.UserConfigReducer.StoreID;
        const oResponse = await sProps.appManager.accessAxios('/modal/getOptionListModal-' + store_id, "get", "text", null);
        if(oResponse !== undefined){
            if(oResponse.resultCd === "0000"){
                setOptionList(oResponse.result);
            }
        }
        setLoading(false);
    }

    useEffect(() => {
        getList();
    }, []);

    return (
        <>
            {state === "list" &&
                <OptionListPage 
                    iOptionList={optionList}
                    fnStopOption={() => close()}
                    fnAddPage={() => addPage()}
                    fnSelected={(sIndex,aIndex,xIndex,zIndex) => checkValue(sIndex,aIndex,xIndex,zIndex)}
                    fnSelectedList={() => selectedList()}
                />
            }
            {state === "step1" &&
                <OptionAddPage1 
                    iNm={sNm}
                    sAnimated={animated}
                    iMustItem={mustItem}
                    iMaxNm={sMaxNm}
                    iMinNm={sMinNm}
                    fnStopStep={() => stopStep()}
                    fnNextStep={(sIndex,aIndex,dIndex) => nextStep(sIndex,aIndex,dIndex)}
                />
            }
            {state === "step2" &&
                <OptionAddPage2
                    nData={iData}
                    sAnimated={animated}
                    oProps={sProps}
                    iMustItem={mustItem}
                    iMaxNm={sMaxNm}
                    iMinNm={sMinNm}
                    fnStopStep={() => stopStep()}
                    fnPrevStep={(sIndex,aIndex) => prevStep(sIndex,aIndex)}
                    fnNextStep={(sIndex,aIndex,dIndex) => nextStep(sIndex,aIndex,dIndex)}
                />
            }
            {state === "step3" &&
                <OptionAddPage4
                    sAnimated={animated}
                    iNm={sNm}
                    nData={iData}
                    iMustItem={mustItem}
                    iMaxNm={sMaxNm}
                    iMinNm={sMinNm}
                    fnStopStep={() => stopStep()}
                    fnPrevStep={(sIndex,aIndex) => prevStep(sIndex,aIndex)}
                    fnNextStep={() => insertOption()}
                />
            }
            {loading &&
                <View style={{position: "absolute", zIndex: 20000,top: 0, marginTop: "20%", height: "100%", width : "110%", marginHorizontal: "-5%", backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
        </>
    )
}

const OptionControll = ({ sProps, fnCancel, fnSelectValue }) => {
    const [loading, setLoading] = useState(false);

    const [optionList, setOptionList] = useState([]);

    const [state, setstate] = useState("list");
    const [animated, setAnimated] = useState(0);

    const [sNm, setNm] = useState("");
    const [iData, setData] = useState([]);

    const [mustItem, setMustItem] = useState("radio");
    const [sMaxNm, setMaxNm] = useState(1);
    const [sMinNm, setMinNm] = useState(1);

    const optionBox = useRef([]);

    const close = async () => {
        if(fnCancel !== undefined && typeof fnCancel === "function"){
            await fnCancel();
        }
    }

    const checkValue = async (sIndex,aIndex,xIndex,nIndex) => {
        let tempList = optionBox.current;
        if(xIndex !== ""){
            let temp = {
                key: sIndex,
                name: aIndex,
                list: nIndex,
            }
            tempList.push(temp);
            optionBox.current = tempList;
        } else {
            optionBox.current = tempList.filter((item) => item.key !== sIndex);
        }
    }

    const addPage = async () => {
        setstate("step1");
    }

    const nextStep = async (sIndex,aIndex,dIndex) => {
        setLoading(true);
        if(sIndex === "step2"){
            setNm(dIndex.sNm);
            setMustItem(dIndex.mustItem);
            setMaxNm(dIndex.sMaxNm);
            setMinNm(dIndex.sMinNm);
        } else if (sIndex === "step3"){
            setData(dIndex);
        }
        setstate(sIndex);
        setAnimated(aIndex);
        setLoading(false);
    }
    
    const insertOption = async () => {
        setLoading(true);
        const store_id = sProps.UserConfigReducer.StoreID;
        let oData = {
            sGroupTitle : sNm,
            type : mustItem,
            sData : iData,
            maxCount : 1,
            minCount : 1,
            store_id,
        }
        if(mustItem === "checkbox"){
            oData = {
                sGroupTitle : sNm,
                type : mustItem,
                sData : iData,
                maxCount : sMaxNm,
                store_id,
            }
        } else {
            if(parseInt(sMaxNm) > 1){
                oData = {
                    sGroupTitle : sNm,
                    type : "radioDouble",
                    sData : iData,
                    maxCount : sMaxNm,
                    minCount : sMaxNm,
                    store_id,
                }
            }
        }
        const oResponse = await sProps.appManager.accessAxios("/app/sales/store/register/insertOption/v2", "post", null, oData);
        if(oResponse !== undefined){
            if(oResponse.resultCd === "0000"){
                setNm("");
                setData([]);
                setMustItem("radio");
                setMaxNm(1);
                setMinNm(1);
                setAnimated(0);
                await getList();
                setstate("list");
            }
        }
        setLoading(false);
    }

    const prevStep = async (sIndex,aIndex) => {
        setstate(sIndex);
        setAnimated(aIndex);
    }

    const stopStep = async () => {
        setAnimated(0);
        setstate("list");
    }
    
    const selectedList = async () => {
        if(fnSelectValue !== undefined && typeof fnSelectValue === "function"){
            await fnSelectValue(optionBox.current);
        }
    }

    const getList = async () => {
        setLoading(true);
        const store_id = sProps.UserConfigReducer.StoreID;
        const oResponse = await sProps.appManager.accessAxios('/modal/getOptionListModal-' + store_id, "get", "text", null);
        if(oResponse !== undefined){
            if(oResponse.resultCd === "0000"){
                setOptionList(oResponse.result);
            }
        }
        setLoading(false);
    }

    useEffect(() => {
        getList();
    }, []);

    return (
        <>
            {state === "list" &&
                <SubOptionListPage 
                    iOptionList={optionList}
                    fnStopOption={() => close()}
                    fnAddPage={() => addPage()}
                    fnSelected={(sIndex,aIndex,xIndex,zIndex) => checkValue(sIndex,aIndex,xIndex,zIndex)}
                    fnSelectedList={() => selectedList()}
                />
            }
            {state === "step1" &&
                <SubOptionAddPage1 
                    iNm={sNm}
                    sAnimated={animated}
                    iMustItem={mustItem}
                    iMaxNm={sMaxNm}
                    iMinNm={sMinNm}
                    fnStopStep={() => stopStep()}
                    fnNextStep={(sIndex,aIndex,dIndex) => nextStep(sIndex,aIndex,dIndex)}
                />
            }
            {state === "step2" &&
                <SubOptionAddPage2
                    nData={iData}
                    sAnimated={animated}
                    oProps={sProps}
                    iMustItem={mustItem}
                    iMaxNm={sMaxNm}
                    iMinNm={sMinNm}
                    fnStopStep={() => stopStep()}
                    fnPrevStep={(sIndex,aIndex) => prevStep(sIndex,aIndex)}
                    fnNextStep={(sIndex,aIndex,dIndex) => nextStep(sIndex,aIndex,dIndex)}
                />
            }
            {state === "step3" &&
                <SubOptionAddPage4
                    sAnimated={animated}
                    iNm={sNm}
                    nData={iData}
                    iMustItem={mustItem}
                    iMaxNm={sMaxNm}
                    iMinNm={sMinNm}
                    fnStopStep={() => stopStep()}
                    fnPrevStep={(sIndex,aIndex) => prevStep(sIndex,aIndex)}
                    fnNextStep={() => insertOption()}
                />
            }
            {loading &&
                <View style={{position: "absolute", zIndex: 20000,top: 0, marginTop: "0%", height: "100%", width : "110%", marginHorizontal: "-5%", backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8, borderRadius: 5}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
        </>
    )
}

export const CompModalAboutMenuGroup = ({fnClose}) => {

    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "0%",
                width: width * 0.9,
                height: height * 0.65, 
                backgroundColor: "#fff",
                borderRadius: width * 0.03, 
            }}
        >
            <View style={{height: height * 0.02 }}/>
            <View style={{height: height * 0.07, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>메뉴 그룹명이란?</Text>
            </View>
            <View style={{flex:1}}>
                <Image source={menuGroupNmImg} style={{ width: "100%", height: "100%", resizeMode: "contain"}}/>
            </View>
            <View style={{height: height * 0.1, width: "100%", justifyContent: "flex-start", alignItems: "center"}}>
                <TouchableOpacity onPress={close} style={{height: height * 0.07, borderWidth: 1, borderColor: "#E1E2E3", width: "90%", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>확인</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const CompModalAboutOptionGroup = ({fnClose}) => {

    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "0%",
                width: width * 0.9,
                height: height * 0.5, 
                backgroundColor: "#fff",
                borderRadius: width * 0.03, 
            }}
        >
            <View style={{height: height * 0.02 }}/>
            <View style={{height: height * 0.07, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>메뉴 그룹명이란?</Text>
            </View>
            <View style={{flex:1}}>
                <Image source={optionselecctedImg} style={{ width: "100%", height: "100%", resizeMode: "contain"}}/>
            </View>
            <View style={{height: height * 0.1, width: "100%", justifyContent: "flex-start", alignItems: "center"}}>
                <TouchableOpacity onPress={close} style={{height: height * 0.07, borderWidth: 1, borderColor: "#E1E2E3", width: "90%", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>확인</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const CompModalThrooOnlyDetail = ({fnClose}) => {

    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "0%",
                width: width * 0.9,
                height: height * 0.65, 
                backgroundColor: "#fff",
                borderRadius: width * 0.03, 
            }}
        >
            <View style={{height: height * 0.02 }}/>
            <View style={{height: height * 0.07, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>스루온리 메뉴란?</Text>
            </View>
            <View style={{flex:1}}>
                <Image source={throoOnlyImg} style={{ width: "100%", height: "100%", resizeMode: "contain"}}/>
            </View>
            <View style={{height: height * 0.1, width: "100%", justifyContent: "flex-start", alignItems: "center"}}>
                <TouchableOpacity onPress={close} style={{height: height * 0.07, borderWidth: 1, borderColor: "#E1E2E3", width: "90%", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>확인</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const CompModalMenuDetail = ({fnClose}) => {

    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "0%",
                width: width * 0.9,
                height: height * 0.65, 
                backgroundColor: "#fff",
                borderRadius: width * 0.03, 
            }}
        >
            <View style={{height: height * 0.02 }}/>
            <View style={{height: height * 0.07, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>메뉴 설명 노출 위치</Text>
            </View>
            <View style={{flex:1}}>
                <Image source={menuDetailImg} style={{ width: "100%", height: "100%", resizeMode: "contain"}}/>
            </View>
            <View style={{height: height * 0.1, width: "100%", justifyContent: "flex-start", alignItems: "center"}}>
                <TouchableOpacity onPress={close} style={{height: height * 0.07, borderWidth: 1, borderColor: "#E1E2E3", width: "90%", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>확인</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const CompModalDiscountDetail = ({fnClose}) => {

    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "0%",
                width: width * 0.9,
                height: height * 0.64, 
                backgroundColor: "#fff",
                borderRadius: width * 0.03, 
            }}
        >
            <View style={{height: height * 0.02 }}/>
            <View style={{height: height * 0.06, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>할인 가격 설정</Text>
            </View>
            <View style={{flex:1}}>
                <Image source={discountImg} style={{ width: "100%", height: "100%", resizeMode: "contain"}}/>
            </View>
            <View style={{height: height * 0.1, width: "100%", justifyContent: "flex-start", alignItems: "center"}}>
                <TouchableOpacity onPress={close} style={{height: height * 0.07, borderWidth: 1, borderColor: "#E1E2E3", width: "90%", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>확인</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const CompOptionFunction = ({ sItem, fnClose, oProps, iList }) => {
    const [loading, setLoading] = useState(false);
    const [preLoading, setPreLoading] = useState(false);
    const [deleteLoad, setDeleteLoading] = useState(false);

    const [changeAlert, setChangeAlert] = useState(true);

    const [state, setstate] = useState("list");

    const [textInputType, setTextInputType] = useState("");
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const [sOptionId, setOptionId] = useState(sItem.id);

    const [minCount, setMinCount] = useState(false);
    const [maxCount, setMaxCount] = useState(false);

    const [iNm, setINm] = useState("");
    const [sPrice, setPrice] = useState("");

    const [sNm, setNm] = useState("");
    const [mustItem, setMustItem] = useState("radio");
    const [sMaxNm, setMaxNm] = useState(1);
    const [sMinNm, setMinNm] = useState(1);
    const [textMaxNm, setTextMaxNm] = useState("1 개");

    const [errINmColor, setErrINmColor] = useState("#EFF0F6");
    const [errINmText, setErrINmText] = useState("");
    const [errPriceColor, setErrPriceColor] = useState("#EFF0F6");
    const [errPriceText, setErrPriceText] = useState("");
    const [errNmColor, setErrNmColor] = useState("#EFF0F6");
    const [errNmText, setErrNmText] = useState("");

    const [xList, setList] = useState([]);
    const [bList, setBList] = useState([]);

    const [eScrollEnabled, setEscrollEnabled] = useState(true);
    
    const sFocus = useRef(null);
    const iFocus = useRef(null);

    const mData = useRef([]);

    const onChangeINm = text => {
        setINm(text);
        setErrINmColor("#6490E7");
        setErrINmText("");
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

    const nextInputSection = async (sIndex) => {
        if(sIndex === "iNm"){
            if(sPrice !== "" && iNm !== "") {
                insertOption();
            } else if(sPrice === ""){
                unactiveINmText();
                activePriceText();
            } else {
                unactiveINmText();
                Keyboard.dismiss();
            }
        } else {
            if(sPrice !== "" && iNm !== "") {
                insertOption();
            } else if(iNm === ""){
                unactivePriceText();
                activeINmText();
            } else {
                unactivePriceText();
                Keyboard.dismiss();
            }
        }
    };

    const onChangeNm = text => {
        setNm(text);
        setErrNmColor("#6490E7");
        setErrNmText("");
    };

    const activeNmText = () => {
        setErrNmColor("#6490E7");
        setTextInputType("nm");
    };

    const unactiveNmText = () => {
        setErrNmColor("#EFF0F6");
        setTextInputType("");
        Keyboard.dismiss();
    };

    const activeINmText = () => {
        iFocus.current.focus();
        setErrINmColor("#6490E7");
        setErrPriceColor("#EFF0F6");
        setTextInputType("iNm");
    };

    const unactiveINmText = () => {
        setErrINmColor("#EFF0F6");
        setErrPriceColor("#EFF0F6");
        setTextInputType("");
    };
    
    const activePriceText = () => {
        sFocus.current.focus();
        setErrINmColor("#EFF0F6");
        setErrPriceColor("#6490E7");
        setTextInputType("sPrice");
    };
    
    const unactivePriceText = () => {
        setErrINmColor("#EFF0F6");
        setErrPriceColor("#EFF0F6");
        setTextInputType("");
    };

    const onChangeMaxCount = async (sIndex) => {
        setMinCount(false);
        setMaxCount(false);
        setMaxNm(sIndex.value);
        setTextMaxNm(sIndex.name);
    }

    const editItem = async (sParam) => {
        setLoading(true);
        let oData = {
            option_id : sOptionId,
            sGroupTitle : sNm,
            sData : xList,
            type : mustItem,
            maxCount : 1,
            minCount : 1,
            store_id : oProps.UserConfigReducer.StoreID,
        }
        if(mustItem === "checkbox"){
            oData = {
                option_id : sOptionId,
                sGroupTitle : sNm,
                sData : xList,
                type : mustItem,
                maxCount : sMaxNm,
                store_id : oProps.UserConfigReducer.StoreID,
            }
        } else {
            if(parseInt(sMaxNm) > 1){
                oData = {
                    option_id : sOptionId,
                    sGroupTitle : sNm,
                    sData : xList,
                    type : "radioDouble",
                    maxCount : sMaxNm,
                    minCount : sMaxNm,
                    store_id : oProps.UserConfigReducer.StoreID,
                }
            }
        }
        const oResponse = await oProps.appManager.accessAxios("/app/ceo/store/product/editOption/v3", "post", null, oData);
        if(oResponse !== undefined){
            if(oResponse.resultCd === "0000"){
                close();
            }
        }

        setLoading(false);
    }

    const deleteOption = async (key) => {
        let tempList = xList;
        setList(tempList.filter((item) => item.key !== parseInt(key)));
    }

    const onList = async () => {
        Keyboard.dismiss();
        setTextInputType("");
        setErrINmColor("#EFF0F6");
        setErrINmText("");
        setErrPriceColor("#EFF0F6");
        setErrPriceText("");
        setErrNmColor("#EFF0F6");
        setErrNmText("");
        setstate("list");
    }

    const onChangeType = async (sIndex) => {
        setMustItem(sIndex);
        setMinCount(false);
        setMaxCount(false);
        setMaxNm(1);
        setMinNm(1);
        setTextMaxNm("1개");
    }

    const onChangeMax = async () => {
        setMinCount(false);
        setMaxCount(true);
    }

    const onChangeOptionCollectSet = async () => {
        await asyncData();
        setstate("change");
    }
    
    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    const deleteItem = async () => {
        if(sOptionId !== undefined && sOptionId !== null && parseInt(sOptionId) > 0){
            setDeleteLoading(true);
            const oData = {
                sIndex: sOptionId,
                store_id: oProps.UserConfigReducer.StoreID
            }
            const oResponse = await oProps.appManager.accessAxios("/app/sales/store/register/deleteOption", "post", null, oData);
            if(oResponse !== undefined){
                if(oResponse){
                    close();
                }
            }
            setDeleteLoading(false);
        }
    }
 
    const addOption = async () => {
        setstate("add");
    }

    const insertOption = async () => {
        if(iNm !== "" && sPrice !== ""){
            if(xList.length > 0){
                let tempNm = 0
                for await (const iterator of xList) {
                    if(parseInt(tempNm) <= parseInt(iterator.key)){
                        tempNm = parseInt(iterator.key) + 1;
                    }
                }
                const kData = {
                    key : tempNm,
                    name : iNm,
                    price : parseInt(sPrice)
                }
                setList([...xList, kData]);
            } else {
                const kData = {
                    key : 1,
                    name : iNm,
                    price : parseInt(sPrice)
                }
                setList(kData);
            }
            setINm("");
            setPrice("");
            unactiveINmText();
            unactivePriceText();
            Keyboard.dismiss();
            setstate("change");
        }
    };

    const onChangeOptionGroupSet = async (sIndex) => {
        await asyncData();
        if(sIndex === "nm"){
            setstate("optionGroupNm")
        } else {
            setstate("option")
        }
    }

    const asyncData = async () => {
        setPreLoading(true);
        const option_id = sItem.id;
        const oResponse = await oProps.appManager.accessAxios("/app/sales/store/register/detailOptionRow-" + option_id, "get", "text", null);
        if(oResponse !== undefined){
            if(oResponse.resultCd === "0000"){
                let temp = [];
                let tempData = oResponse.resultData;
                if(parseInt(tempData.minCount) > 1){
                    setMustItem("radio");
                    setMaxNm(parseInt(tempData.minCount));
                    setTextMaxNm(tempData.minCount+ " 개");
                    
                } else {
                    if(tempData.inputType === "radio"){
                        setMustItem("radio");
                        setMaxNm(parseInt(1));
                        setTextMaxNm("1 개");
                    } else {
                        setMustItem("checkbox");
                        setMaxNm(parseInt(tempData.maxCount));
                        setTextMaxNm(tempData.maxCount+ " 개");
                    }
                }
                for (let i = 1; i < (tempData.list.length + 1) ; i++) {
                    temp.push({
                        key: i,
                        value: i,
                        name: `${i} 개`
                    });
                };
                setBList(temp);
                setOptionId(sItem.id);
                setNm(tempData.sGroupTitle);
                setList(tempData.list);
            } else {
                close();
            }
        }
        setPreLoading(false);
    }

    const onKeyboardDidShow = (e) => {
        setKeyboardHeight(e.endCoordinates.height);
    }

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    }, []);

    const renderItem = ( item ) => {
        return (
            <View style={{width, height: height * 0.14,  justifyContent: "center", alignItems: "center"}}>
                <View style={{height: height * 0.11, width: width * 0.9, borderRadius: 10, borderWidth: 1, borderColor: "#F2F3F5", flexDirection: "row"}}>
                    <View style={{flex:0.15, justifyContent: "center", alignItems: "center"}}>
                        <ComponentGroupList iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                    </View>
                    <View style={{flex:0.6, backgroundColor: "#fff", marginLeft: "2%"}}>
                        <View style={{flex: 1, justifyContent: "flex-end"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#333D4B"}}>{item.name}</Text>
                        </View>
                        <View style={{flex: 1, justifyContent: "flex-start", marginTop: "3%"}}>
                            <Text style={{fontSize: RFPercentage(1.8), fontWeight: '500', color: "#6B7583"}}>{item.price}원</Text>
                        </View>
                    </View>
                    <View style={{flex:0.25, justifyContent: "center"}}>
                        <TouchableOpacity onPress={() => deleteOption(item.key)} style={{height: "60%", width: "80%", backgroundColor: "#fff", justifyContent: "center", alignItems: "center", borderRadius: 5, borderWidth: 1, borderColor: "#EF4452"}}>
                            <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#EF4452"}}>삭제</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <>
            {state === "list" &&
                <View 
                    style={{
                        marginHorizontal: "-5%",
                        marginTop: height * 0.7,
                        width: width,
                        height: height * 0.5, 
                        backgroundColor: "#fff",
                        borderTopLeftRadius: width * 0.04, 
                        borderTopRightRadius: width * 0.04, 
                    }}
                >
                    <View style={{height: height * 0.02, width}} />
                    <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={{fontSize: RFPercentage(2.4), fontWeight: '600', color: "#191F28"}}>{sItem.name}</Text>
                        <TouchableOpacity onPress={close} style={{height: height * 0.025, width: width * 0.07}}>
                            <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => onChangeOptionGroupSet("nm")} style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>옵션그룹명 설정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeOptionGroupSet("option")} style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>옵션그룹 설정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeOptionCollectSet()} style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>옵션 설정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setstate("delete")} style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#EF4452"}}>옵션그룹 삭제</Text>
                    </TouchableOpacity>
                </View>
            }
            {state === "optionGroupNm" &&
                <View 
                    style={{
                        marginHorizontal: "-5%",
                        marginTop: height * 0.1,
                        width: width,
                        height: height * 0.9, 
                        backgroundColor: "#fff",
                        borderTopLeftRadius: width * 0.04, 
                        borderTopRightRadius: width * 0.04, 
                    }}
                >
                    <View style={{height: height * 0.04, width}} />
                    <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", justifyContent: "flex-start"}}>
                        <Text style={{fontSize: RFPercentage(2.5), fontWeight: '600', color: "#191F28"}}>옵션그룹 설정</Text>
                        <TouchableOpacity onPress={() => onList()} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", right: 0}}>
                            <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()} style={{flex:1, backgroundColor: "#fff"}}>
                        {textInputType === "nm" &&
                            <View style={{ height: height * 0.1}} />
                        }                       
                        <View style={{height: height * 0.14, alignItems: "center"}}>
                            <View style={{height: height * 0.05, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>옵션그룹명</Text>
                            </View>
                            <TextInput
                                placeholder="예) 맛 선택"
                                placeholderTextColor="#919AA7"
                                returnKeyType="done"
                                onChangeText={text => onChangeNm(text)}
                                onFocus={() => activeNmText()}
                                onBlur={() => unactiveNmText()}
                                onSubmitEditing={() => editItem("edit")}
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
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{errNmText}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {textInputType === "nm" &&
                        <TouchableOpacity activeOpacity={0.8} onPress={() => editItem("edit")} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.195}}>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                        </TouchableOpacity>
                    }
                    {textInputType === "" &&
                        <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                            <TouchableOpacity onPress={() => editItem("edit")} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>수정</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            }
            {state === "option" &&
                <View 
                    style={{
                        marginHorizontal: "-5%",
                        marginTop: height * 0.1,
                        width: width,
                        height: height * 0.9, 
                        backgroundColor: "#fff",
                        borderTopLeftRadius: width * 0.04, 
                        borderTopRightRadius: width * 0.04, 
                    }}
                >
                    <View style={{height: height * 0.04, width}} />
                    <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", justifyContent: "flex-start"}}>
                        <Text style={{fontSize: RFPercentage(2.5), fontWeight: '600', color: "#191F28"}}>옵션그룹 설정</Text>
                        <TouchableOpacity onPress={() => onList()} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", right: 0}}>
                            <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1, backgroundColor: "#fff"}}>
                        <View style={{height: height * 0.18}}>
                            <View style={{height: height * 0.05, width, alignItems: "center", marginLeft: "5%", flexDirection: "row"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>필수 여부</Text>
                            </View>
                            <View style={{height: height * 0.13, width, justifyContent: "flex-start", marginLeft: "5%"}}>
                                <TouchableOpacity onPress={() => onChangeType("radio")} style={{height: height * 0.05, width, alignItems: "center", flexDirection: "row"}}>
                                    {mustItem === "radio" ?
                                        <ComponentSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                    :
                                        <ComponentUnSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                    }
                                    <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#333D4B", marginLeft: "2%" }}> 옵션을 반드시 선택해야 주문이 가능해요</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => onChangeType("checkbox")} style={{height: height * 0.05, width, alignItems: "center", flexDirection: "row"}}>
                                    {mustItem === "radio" ?
                                        <ComponentUnSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                    :
                                        <ComponentSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                    }
                                    <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#333D4B", marginLeft: "2%" }}> 옵션을 선택하지 않아도 주문이 가능해요</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{height: height * 0.42}}>
                            <View style={{height: height * 0.08, width, alignItems: "center", marginLeft: "5%", flexDirection: "row"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>선택 가능한 옵션 수</Text>
                            </View>
                            {mustItem === "radio" ?
                                <View style={{height: height * 0.1, width: "90%", flexDirection: "row", marginLeft: "5%"}}>
                                    <View style={{height: "70%", width: "25%", justifyContent: "center"}}>
                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#6B7583" }}>최소선택수</Text>
                                    </View>
                                    <TouchableOpacity onPress={onChangeMax} style={{height: "70%", width: "75%", backgroundColor: "#FAFAFB", borderRadius: 5, borderWidth: 1, borderColor: "#EFF0F6", alignItems: "center", justifyContent: "space-between", flexDirection: "row", paddingLeft: "5%", paddingRight: "5%"}}>
                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>{textMaxNm}</Text>
                                        <ComponentArrowDown1 iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                    </TouchableOpacity>
                                    {maxCount &&
                                        <ScrollView style={{position: "absolute", left: "25%", top: 0, width: "75%", minHeight: height * 0.07, maxHeight: height * 0.3, backgroundColor: "#E5E7EA", borderRadius: 5, zIndex: 100}}>
                                            {bList.map((item,index) => {
                                                return (
                                                    <TouchableOpacity key={index} onPress={() => onChangeMaxCount(item)} style={{ height: height * 0.07, width: "100%", alignItems: "center", justifyContent: "space-between", flexDirection: "row", paddingLeft: "5%", paddingRight: "5%", borderBottomColor: "#fff",  borderBottomWidth: 1}}>
                                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>{item.name}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })}
                                        </ScrollView>
                                    }
                                </View>
                            :
                                <View style={{height: height * 0.1, width: "90%", flexDirection: "row", marginLeft: "5%"}}>
                                    <View style={{height: "70%", width: "25%", justifyContent: "center"}}>
                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#6B7583" }}>최대선택수</Text>
                                    </View>
                                    <TouchableOpacity onPress={onChangeMax} style={{height: "70%", width: "75%", backgroundColor: "#FAFAFB", borderRadius: 5, borderWidth: 1, borderColor: "#EFF0F6", alignItems: "center", justifyContent: "space-between", flexDirection: "row", paddingLeft: "5%", paddingRight: "5%"}}>
                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>{textMaxNm}</Text>
                                        <ComponentArrowDown1 iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                    </TouchableOpacity>
                                    {maxCount &&
                                        <ScrollView style={{position: "absolute", left: "25%", top: 0, width: "75%", minHeight: height * 0.07, maxHeight: height * 0.3, backgroundColor: "#E5E7EA", borderRadius: 5, zIndex: 100}}>
                                            {bList.map((item,index) => {
                                                return (
                                                    <TouchableOpacity key={index} onPress={() => onChangeMaxCount(item)} style={{ height: height * 0.07, width: "100%", alignItems: "center", justifyContent: "space-between", flexDirection: "row", paddingLeft: "5%", paddingRight: "5%", borderBottomColor: "#fff",  borderBottomWidth: 1}}>
                                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>{item.name}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })}
                                        </ScrollView>
                                    }
                                </View>
                            }
                            {(!maxCount && !minCount) &&
                                <>
                                    <View style={{height: height * 0.05, width, justifyContent: "flex-start", marginLeft: "5%"}}>
                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>의 옵션을 고객이 선택할 수 있어요.</Text>
                                    </View>
                                    <View style={{height: height * 0.08, width, justifyContent: "flex-start", marginLeft: "5%"}}>
                                        <View style={{height: height * 0.06, width: "90%", alignItems: "flex-start", justifyContent: "center", backgroundColor: "#F2F3F5", borderRadius: 5, paddingLeft: "5%"}}>
                                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.8), color: "#505866" }}>이 옵션 그룹에는 옵션이 총 {xList.length}개 있습니다.</Text>
                                        </View>
                                    </View>
                                </>
                            }
                        </View>
                    </View>
                    <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                        <TouchableOpacity onPress={() => editItem("edit")} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>수정</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            {state === "change" &&
                <View 
                    style={{
                        marginHorizontal: "-5%",
                        marginTop: height * 0.1,
                        width: width,
                        height: height * 0.9, 
                        backgroundColor: "#fff",
                        borderTopLeftRadius: width * 0.04, 
                        borderTopRightRadius: width * 0.04, 
                    }}
                >
                    <View style={{height: height * 0.04, width}} />
                    <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", justifyContent: "flex-start"}}>
                        <Text style={{fontSize: RFPercentage(2.5), fontWeight: '600', color: "#191F28"}}>옵션그룹 설정</Text>
                        <TouchableOpacity onPress={() => onList()} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", right: 0}}>
                            <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                        </TouchableOpacity>
                    </View>
                    {(xList.length > 0 && changeAlert) && 
                        <>
                            <TouchableOpacity onPress={() => setChangeAlert(false)} style={{position: "absolute", zIndex: 99, top: height * 0.08, left: "10%", height: height * 0.04, width: width * 0.8, backgroundColor: "#6490E7", borderRadius: width * 0.05, justifyContent: "space-between", alignItems: "center", flexDirection: "row", paddingLeft: "20%"}}>
                                <Text style={{fontSize: RFPercentage(1.5), fontWeight: '400', color: "#fff"}}>버튼을 위 아래로 움직여 순서를 변경해주세요.</Text>
                                <ComponentDelete iHeight={height * 0.02} iWidth={width * 0.08} iColor={"#fff"}/>
                                <View style={{position: "absolute", zIndex: 99, top: height * 0.02, left: "15%", height: height * 0.025, width: height * 0.025, backgroundColor: "#6490E7", transform: [{ rotateZ: '0.785398rad' }]}} />
                            </TouchableOpacity>
                        </>
                    }
                    <ScrollView
                        scrollEnabled = {eScrollEnabled}
                        style={{flex: 1, backgroundColor: "#fff", borderBottomColor: "#F2F3F5", borderBottomWidth: 1 }}
                    >
                        <DragSortableView
                            dataSource={xList}
                            parentWidth={width}
                            childrenWidth= {width}
                            childrenHeight={height * 0.14}
                            scaleStatus={'scaleY'}
                            onDragStart={(startIndex,endIndex)=>{
                                setEscrollEnabled(false);
                            }}
                            onDragEnd={(startIndex)=>{
                                setEscrollEnabled(true);
                            }}
                            onDataChange = {(data)=>{
                                setList([])
                                setList(data)
                            }}
                            keyExtractor={(item,index)=> index} 
                            onClickItem={(data,item,index)=>{}}
                            renderItem={(item,index)=>{
                                return renderItem(item,index)
                            }}
                        />
                    </ScrollView>
                    <TouchableOpacity onPress={addOption} style={{height: height * 0.1, marginLeft: "10%", justifyContent: "center" }}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#6490E7" }}>+ 옵션 추가</Text>
                    </TouchableOpacity>
                    <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                        <TouchableOpacity onPress={() => editItem("edit")} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>수정</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            {state === "add" &&
                <View 
                    style={{
                        marginHorizontal: "-5%",
                        marginTop: height * 0.1,
                        width: width,
                        height: height * 0.9, 
                        backgroundColor: "#fff",
                        borderTopLeftRadius: width * 0.04, 
                        borderTopRightRadius: width * 0.04, 
                    }}
                >
                    <View style={{height: height * 0.04, width}} />
                    <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", justifyContent: "flex-start"}}>
                        <Text style={{fontSize: RFPercentage(2.5), fontWeight: '600', color: "#191F28"}}>옵션 추가</Text>
                        <TouchableOpacity onPress={() => setstate("change")} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", right: 0}}>
                            <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, backgroundColor: "#fff"}}>
                        {(textInputType === "iNm" || textInputType === "sPrice") &&
                            <View style={{ height: height * 0.05 }} />
                        }
                        <View style={{height: height * 0.1, width, flexDirection: "row", marginLeft: "5%", alignItems: "center"}}>
                            <TextInput
                                ref={iFocus}
                                placeholder="예) ICE"
                                placeholderTextColor="#919AA7"
                                returnKeyType="next"
                                onChangeText={text => onChangeINm(text)}
                                onFocus={() => activeINmText()}
                                onBlur={() => unactiveINmText()}
                                onSubmitEditing={() => nextInputSection("iNm")}
                                value={iNm}
                                style={{
                                    width: "30%",
                                    marginRight: "3%",
                                    height: height * 0.06,
                                    borderColor: errINmColor,
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
                                placeholder="예) 500원"
                                placeholderTextColor="#919AA7"
                                returnKeyType="done"
                                keyboardType="numeric"
                                onChangeText={text => onChangePrice(text)}
                                onFocus={() => activePriceText()}
                                onBlur={() => unactivePriceText()}
                                onSubmitEditing={() => nextInputSection("sPrice")}
                                value={sPrice}
                                style={{
                                    width: "38%",
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
                            <View style={{position: "absolute", top: "20%", right: "30%", width: height * 0.04, height: height * 0.06, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#919AA7"}}>원</Text>
                            </View>
                        </View>
                        {(errINmText !== "" || errPriceText !== "") &&
                            <View style={{height: height * 0.03, width, flexDirection: "row", marginLeft: "5%"}}>
                                <View style={{height: height * 0.03, width: "25%", marginRight: "3%"}}>
                                    <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{errINmText}</Text>
                                </View>
                                <View style={{height: height * 0.03, width: "40%", marginRight: "3%"}}>
                                    <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{errPriceText}</Text>
                                </View>
                                <View style={{height: height * 0.03, width: "18%"}} />
                            </View>
                        }
                    </View>
                    {textInputType === "iNm" &&
                        <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.2}}>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                        </TouchableOpacity>
                    }
                    {textInputType === "sPrice" &&
                        <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.165}}>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                        </TouchableOpacity>
                    }
                    {textInputType === "" &&
                        <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                            <TouchableOpacity onPress={() => insertOption()} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>추가</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            }
            {state === "delete" &&
                <View 
                    style={{
                        marginHorizontal: "0%",
                        marginTop: height * 0.1,
                        width: width * 0.9,
                        height: height * 0.24, 
                        backgroundColor: "#fff",
                        borderRadius: width * 0.03, 
                    }}
                >
                    <View style={{height: height * 0.03, width}} />
                    <View style={{height: height * 0.04, marginLeft: "5%", justifyContent: "center"}}>
                        <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>옵션그룹 삭제</Text>
                    </View>
                    <View style={{height: height * 0.08, marginLeft: "5%", justifyContent: "center"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>{sItem.name} 삭제하시겠습니까?</Text>
                    </View>
                    <View style={{height: height * 0.09, flexDirection: "row", justifyContent: "center"}}>
                        <TouchableOpacity onPress={() => onList()} style={{height: "70%", width: "42%", backgroundColor: "#F2F3F5", marginRight: "5%", borderRadius: 5, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>취소</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteItem(sItem.id)} style={{height: "70%", width: "42%", backgroundColor: "#EF4452", borderRadius: 5, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#fff"}}>삭제</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            {preLoading &&
                <View style={{position: "absolute", zIndex: 20000,top: 0, marginTop: height * 0.6, height: height * 0.4, width : "110%", marginHorizontal: "-5%", backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
            {loading &&
                <View style={{position: "absolute", zIndex: 20000,top: 0, marginTop: "25%", height: "100%", width : "110%", marginHorizontal: "-5%", backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
            {deleteLoad &&
                <View style={{position: "absolute", zIndex: 20000,top: 0, marginTop: height * 0.43, height: height * 0.2, width : "100%", marginHorizontal: "0%", backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8, borderRadius: 10}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
        </>
    )
}

export const CompMenuFunction = ({ sItem, iProductList, fnClose, oProps, sEditData }) => {
    const [loading, setLoading] = useState(false);
    const [preLoading, setPreLoading] = useState(false);
    const [deleteLoad, setDeleteLoading] = useState(false);

    const [changeAlert, setChangeAlert] = useState(true);
    const [changeSAlert, setChangeSAlert] = useState(true);

    const [openModalSetting, setOpenModalSetting] = useState(false);

    const [state, setstate] = useState("list");

    const [isImgDelete, setIsImgDelete] = useState(false);
    const [isImg, setIsImg] = useState(false);
    const [activeImg, setActiveImg] = useState(null);

    const [productType, setProductType] = useState("normal");
    const [iStock, setStock] = useState("");
    const [mediaId, setMediaId] = useState(0);
    const [sDetail, setDetail] = useState("");
    const [sNm, setNm] = useState("");
    const [sOriginPrice, setOriginPrice] = useState("");
    const [sCategoryNm, setCategoryNm] = useState("");
    const [sCategory, setCategory] = useState("");
    const [sProductId, setProductId] = useState(0);
    const [iProductType, setIProductType] = useState(false);
    const [sPrice, setPrice] = useState("");
    const [imgUri, setImageuri] = useState("");
    const [xList, setList] = useState([]);
    const [preOptionList, setPreOptionList] = useState([]);
    const [discountNm, setDiscountNm] = useState("");
    const [itemList, setItemList] = useState([]);
    
    const [errDetailColor, setErrDetailColor] = useState("#EFF0F6");
    const [errNmColor, setErrNmColor] = useState("#EFF0F6");
    const [errNmText, setErrNmText] = useState("");
    const [errOriginPriceColor, setErrOriginPriceColor] = useState("#EFF0F6");
    const [errOriginPriceText, setErrOriginPriceText] = useState("");
    const [errDiscountPriceColor, setErrDiscountPriceColor] = useState("#EFF0F6");
    const [errDiscountPriceText, setErrDiscountPriceText] = useState("");
    const [errStockColor, setErrStockColor] = useState("#EFF0F6");
    const [errStockText, setErrStockText] = useState("");

    const [textInputType, setTextInputType] = useState("");

    const [sErrMessage, setErrMessage] = useState("");

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const [eScrollEnabled, setEscrollEnabled] = useState(true);
    const [iScrollEnabled, setIcrollEnabled] = useState(true);

    const optionBox = useRef([]);

    const onChangeNm = text => {
        setNm(text);
        setErrNmColor("#6490E7");
        setErrNmText("");
    };
    
    const onChangeDetail = text => {
        setDetail(text);
        setErrDetailColor("#6490E7");
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

    const onChangeStock = text => {
        const sTemp = text;
        const regex = /[0-9]+$/gi;
        if(sTemp === "" || sTemp === null){
            setStock(text);
            setErrStockColor("#6490E7");
            setErrStockText("");
        } else {
            if (regex.test(sTemp)) {
                setStock(text);
                setErrStockColor("#6490E7");
                setErrStockText("");
            } else {
                setErrStockColor("#E32938");
                setErrStockText("숫자만 입력가능합니다.");
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

    const throoOnlySwitch = async () => {
        if(iProductType){
            setProductType("normal");
        } else {
            setProductType("only");
        }
        setIProductType(!iProductType);
    }

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

    const activeDetailText = () => {
        setErrDetailColor("#6490E7");
        setTextInputType("detail")
    };
    
    const unactiveDetailText = () => {
        setErrDetailColor("#EFF0F6");
        setTextInputType("")
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

    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    const deleteImage = async () => {
        setActiveImg(null);
        setIsImgDelete(true);
        setImageuri("");
    }

    const openOptionControll = () => {
        setstate("optionList");
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
                                setIsImg(true);
                                setImageuri(res.uri);
                                setActiveImg(res);
                            } else {
                                setErrMessage("파일의 용량은 10MB이하만 가능합니다");
                            }
                        } else {
                            setErrMessage("PNG 파일이나 JPG 파일만 가능합니다.");
                        }
                    } else if (res.error) {
                        if(res.error.toString() === "Camera permissions not granted"){
                            setErrMessage("카메라 접근 권한이 필요합니다.");
                        } else {
                            setErrMessage("일시적인 에러가 발생했습니다, 다시 시도해주세요.");
                        }
                    }
                });
            } else {
                setOpenModalSetting(true);
            }
            
        } catch (error) {
            setErrMessage("일시적인 에러가 발생했습니다, 다시 시도해주세요.");
        }
    }

    const settingModalMove = () => {
        Linking.openSettings();
        setOpenModalSetting(false);
    }

    const deleteItem = async (sIndex) => {
        setDeleteLoading(true);
        const oData = {
            sIndex
        };
        const oResponse = await oProps.appManager.accessAxios("/app/sales/store/register/deleteMenu/v2", "post", null, oData);
        if(oResponse !== undefined){
            if(oResponse){
                close();
            }
        }
        setDeleteLoading(false);
    }
  
    const selectValue = async (sIndex) => {
        setList([]);
        setList(sIndex);
        setstate("option");
    }
  
    const onChangeList = async () => {
        unactiveDetailText();
        setTextInputType("")
        Keyboard.dismiss();
        setstate("list");
    }

    const asyncData = async () => {
        setPreLoading(true);
        const menu_id = sItem.id;
        const oResponse = await oProps.appManager.accessAxios("/app/sales/store/product/info/v3-" + menu_id, "get", "text", null);
        if(oResponse !== undefined){
            let temp = 0;
            if(oResponse.url_path !== undefined && oResponse.url_path !== null && oResponse.url_path !== ""){
                setImageuri(oResponse.url_path);
            } else {
                setImageuri("");
            }
            if(oResponse.options !== undefined && oResponse.options !== null && oResponse.options.length > 0){
                optionBox.current = oResponse.options;
                setList(oResponse.options);
                setPreOptionList(oResponse.options);
            } else {
                optionBox.current = [];
                setList([]);
                setPreOptionList([]);
            }
    
            if(parseInt(oResponse.base_price) > 0){
                setPrice(oResponse.base_price.toString());
            } else {
                setPrice("");
            }
            if(oResponse.base_price > 0){
                if(oResponse.base_price.toString().trim() === "" || oResponse.org_price.toString().trim() === ""){
                    temp = 0;
                } else  {
                    temp = Math.round(parseFloat(100 - (parseInt(oResponse.base_price) / parseInt(oResponse.org_price) * 100)));
                }
            }
            if(oResponse.isThrooOnly === "only"){
                setIProductType(true);
            } else {
                setIProductType(false);
            }
            setDiscountNm(temp);
            setProductId(oResponse.productId);
            setCategory(oResponse.categoryId);
            setCategoryNm(oResponse.category_name);
            setOriginPrice(oResponse.org_price.toString());
            setNm(oResponse.product_name);
            setDetail(oResponse.description);
            setMediaId(oResponse.mediaId);
            setStock(oResponse.inStock);
            setProductType(oResponse.isThrooOnly);  
            setItemList(iProductList);
        }
        setPreLoading(false);
    }

    const onKeyboardDidShow = (e) => {
        setKeyboardHeight(e.endCoordinates.height);
    }

    const onChangeState = async (sIndex) => {
        await asyncData();
        setstate(sIndex);
    }

    const deleteOption = (sIndex) => {
        let temp = xList;
        temp = temp.filter((item) => item.key !== sIndex);
        setList(temp);
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

    const uploadImageData = async () => {
        let temp = "";
        const oData = await createFormData(activeImg);
        const oResponse = await oProps.appManager.accessAxios('/store/register/filesLogo', "post", "multipart", oData);
        if (oResponse !== undefined) {
            if (oResponse.url_path !== undefined && oResponse.url_path !== null && oResponse.url_path !== "") {
                temp = oResponse.url_path;
                return temp;
            }
        }
    }

    const editMenu = async (sIndex) => {
        setLoading(true);
        let oData = {
            sTitle: sNm,
            sCategory: sCategory,
            iPrice: sOriginPrice,
            dPrice: sPrice,
            options: xList,
            sDesc: sDetail,
            product_id : sProductId,
            media_id : mediaId,
            url_path: imgUri,
            isCheck: isImgDelete,
            pre_option_list : preOptionList,
            store_id: oProps.UserConfigReducer.StoreID,
            iStock : iStock,
            productType : productType,
        };
        if(sIndex === "image"){
            if(isImgDelete){
                if(isImg){
                    const getUrl = await uploadImageData();
                    if(getUrl !== ""){
                        oData.url_path = getUrl;
                    }
                } else {
                    oData.url_path = imgUri;
                }
            }
        }
        const oResponse = await oProps.appManager.accessAxios("/app/sales/store/register/edit/v3", "post", null, oData);
        if(oResponse !== undefined){
            if(oResponse.resultCd === "0000"){
                close();
            }
        }
        setLoading(false);
    }

    const exchange = async () => {
        setLoading(true);
        const oData = {
            sIndex: itemList,
            store_id: oProps.UserConfigReducer.StoreID
        }
        const oResponse = await oProps.appManager.accessAxios("/store/register/changeIndexMenu", "post", "login", oData);
        if(oResponse !== undefined){
            if(oResponse.resultCd === "0000"){
                close();
            }
        }
        setLoading(false);
    }

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    }, []);

    const renderItem = (item) => {
        return (
            <View style={{width, height: height * 0.14,  justifyContent: "center", alignItems: "center"}}>
                <View style={{height: height * 0.11, width: width * 0.9, borderRadius: 10, borderWidth: 1, borderColor: "#F2F3F5", flexDirection: "row"}}>
                    <View style={{flex:0.2, justifyContent: "center", alignItems: "center"}}>
                        <ComponentGroupList iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                    </View>
                    <View style={{flex:0.8, backgroundColor: "#fff"}}>
                        <View style={{flex: 0.6, justifyContent: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#333D4B"}}>{item.name}</Text>
                        </View>
                        <View style={{flex: 0.4, justifyContent: "flex-start"}}>
                            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '500', color: "#333D4B"}}>{item.price}원</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const optionRenderItem = (item) => {
        return (
            <View style={{width, height: height * 0.14,  justifyContent: "center", alignItems: "center"}}>
                <View style={{height: height * 0.11, width: width * 0.9, borderRadius: 10, borderWidth: 1, borderColor: "#F2F3F5", flexDirection: "row"}}>
                    <View style={{flex:0.15, justifyContent: "center", alignItems: "center"}}>
                        <ComponentGroupList iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                    </View>
                    <View style={{flex:0.6, backgroundColor: "#fff", marginLeft: "2%"}}>
                        <View style={{flex: 1, justifyContent: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#333D4B"}}>{item.name}</Text>
                        </View>
                    </View>
                    <View style={{flex:0.25, justifyContent: "center"}}>
                        <TouchableOpacity onPress={() => deleteOption(item.key)} style={{height: "60%", width: "80%", backgroundColor: "#fff", justifyContent: "center", alignItems: "center", borderRadius: 5, borderWidth: 1, borderColor: "#EF4452"}}>
                            <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#EF4452"}}>해제</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <>
            {state === "list" &&
                <View 
                    style={{
                        marginHorizontal: "-5%",
                        marginTop: height * 0.4,
                        width: width,
                        height: height * 0.6, 
                        backgroundColor: "#fff",
                        borderTopLeftRadius: width * 0.04, 
                        borderTopRightRadius: width * 0.04, 
                    }}
                >
                    <View style={{height: height * 0.02, width}} />
                    <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={{fontSize: RFPercentage(2.4), fontWeight: '600', color: "#191F28"}}>{sItem.name}</Text>
                        <TouchableOpacity onPress={close} style={{height: height * 0.025, width: width * 0.07}}>
                            <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => onChangeState("info")} style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>메뉴 정보 설정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeState("detail")} style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>메뉴 설명 설정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeState("option")} style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>옵션 설정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeState("change")} style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>메뉴 순서 설정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeState("image")} style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>메뉴 이미지 설정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setstate("delete")} style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#EF4452"}}>메뉴 삭제</Text>
                    </TouchableOpacity>
                </View>
            }
            {state === "info" &&
                <View 
                    style={{
                        marginHorizontal: "-5%",
                        marginTop: height * 0.1,
                        width: width,
                        height: height * 0.9, 
                        backgroundColor: "#fff",
                        borderTopLeftRadius: width * 0.04, 
                        borderTopRightRadius: width * 0.04, 
                    }}
                >
                    <View style={{height: height * 0.04, width}} />
                    <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", justifyContent: "flex-start"}}>
                        <Text style={{fontSize: RFPercentage(2.5), fontWeight: '600', color: "#191F28"}}>메뉴 정보 설정</Text>
                        <TouchableOpacity onPress={() => onChangeList()} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", right: 0}}>
                            <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, backgroundColor: "#fff"}}>
                        {(textInputType === "" || textInputType === "nm") &&
                            <View style={{flex: 0.23, alignItems: "center"}}>
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
                            <View style={{flex: 0.67, alignItems: "center"}}>
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
                                        <View style={{height: height * 0.07, backgroundColor: "#fff", width, alignItems: "center", marginLeft: "10%", flexDirection: "row"}}>
                                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#3B3B46" }}>
                                                할인 판매 가격
                                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#919AA7" }}>
                                                    (선택)
                                                </Text>
                                            </Text>
                                        </View>
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
                                <View style={{flex:1, alignItems: "center", flexDirection: "row"}}>
                                    <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#3B3B46"}}>스루온리 메뉴</Text>
                                </View>
                                <View style={{flex:1, alignItems: "flex-end", justifyContent: "center"}}>
                                    <ThrooOnlySwitchToggle isOn={iProductType} onToggle={() => throoOnlySwitch()}/>
                                </View>
                            </View>
                        }
                    </View>
                    {textInputType === "nm" &&
                        <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.195}}>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                        </TouchableOpacity>
                    }
                    {(textInputType === "origin" || textInputType === "discount" || textInputType === "stock") &&
                        <TouchableOpacity activeOpacity={0.8} onPress={() => nextInputSection(textInputType)} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.165}}>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                        </TouchableOpacity>
                    }
                    {textInputType === "" &&
                        <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center"}}>
                            <TouchableOpacity onPress={() => editMenu("detail")} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>적용</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            }
            {state === "detail" &&
                <View 
                    style={{
                    marginHorizontal: "-5%",
                    marginTop: height * 0.1,
                    width: width,
                    height: height * 0.9, 
                    backgroundColor: "#fff",
                    borderTopLeftRadius: width * 0.04, 
                    borderTopRightRadius: width * 0.04, 
                    }}
                >
                    <View style={{height: height * 0.04, width}} />
                    <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", justifyContent: "flex-start"}}>
                        <Text style={{fontSize: RFPercentage(2.5), fontWeight: '600', color: "#191F28"}}>메뉴 설명 설정</Text>
                        <TouchableOpacity onPress={() => onChangeList()} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", right: 0}}>
                            <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()} style={{flex: 1, backgroundColor: "#fff"}}>
                        <View style={{flex: 0.37, alignItems: "center"}}>
                            <View style={{height: height * 0.07, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <View style={{flex:1, alignItems: "center", flexDirection: "row"}}>
                                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '600', color: "#3B3B46"}}>메뉴 설명</Text>
                                </View>
                            </View>
                            <TextInput
                                multiline={true}
                                placeholder="예) 한우 패티에 치즈 듬뿍 신선한 야채 가득 버거에 프렌치프라이와 음료"
                                placeholderTextColor="#919AA7"
                                returnKeyType="done"
                                onChangeText={text => onChangeDetail(text)}
                                onFocus={() => activeDetailText()}
                                onBlur={() => unactiveDetailText()}
                                onSubmitEditing={() => editMenu("detail")}
                                value={sDetail}
                                style={{
                                    width: "90%",
                                    height: height * 0.2,
                                    fontSize: RFPercentage(2),
                                    borderColor: errDetailColor,
                                    borderWidth: 1,
                                    fontWeight: '500',
                                    paddingTop: "5%",
                                    paddingBottom: "5%",
                                    paddingLeft: "5%",
                                    paddingRight: "5%",
                                    backgroundColor: '#FAFAFB',
                                    borderRadius: 5,
                                    color: "#000"
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                    {textInputType === "detail" &&
                        <TouchableOpacity activeOpacity={0.8} onPress={() => editMenu("detail")} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.195}}>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>완료</Text>
                        </TouchableOpacity>
                    } 
                    {textInputType === "" &&
                        <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center"}}>
                            <TouchableOpacity onPress={() => editMenu("detail")} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>수정</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            }
            {state === "option" &&
                <View 
                    style={{
                    marginHorizontal: "-5%",
                    marginTop: height * 0.1,
                    width: width,
                    height: height * 0.9, 
                    backgroundColor: "#fff",
                    borderTopLeftRadius: width * 0.04, 
                    borderTopRightRadius: width * 0.04, 
                    }}
                >
                    <View style={{height: height * 0.04, width}} />
                    <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", justifyContent: "flex-start"}}>
                        <Text style={{fontSize: RFPercentage(2.5), fontWeight: '600', color: "#191F28"}}>옵션 설정</Text>
                        <TouchableOpacity onPress={() => setstate("list")} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", right: 0}}>
                            <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                        </TouchableOpacity>
                    </View>
                    {(xList.length > 0 && changeSAlert) && 
                        <>
                            <TouchableOpacity onPress={() => setChangeSAlert(false)} style={{position: "absolute", zIndex: 99, top: height * 0.08, left: "10%", height: height * 0.04, width: width * 0.8, backgroundColor: "#6490E7", borderRadius: width * 0.05, justifyContent: "space-between", alignItems: "center", flexDirection: "row", paddingLeft: "20%"}}>
                                <Text style={{fontSize: RFPercentage(1.5), fontWeight: '400', color: "#fff"}}>버튼을 위 아래로 움직여 순서를 변경해주세요.</Text>
                                <ComponentDelete iHeight={height * 0.02} iWidth={width * 0.08} iColor={"#fff"}/>
                                <View style={{position: "absolute", zIndex: 99, top: height * 0.02, left: "15%", height: height * 0.025, width: height * 0.025, backgroundColor: "#6490E7", transform: [{ rotateZ: '0.785398rad' }]}} />
                            </TouchableOpacity>
                        </>
                    }
                    <ScrollView
                        scrollEnabled = {iScrollEnabled}
                        style={{flex: 1, backgroundColor: "#fff" }}
                    >
                        <DragSortableView
                            dataSource={xList}
                            parentWidth={width}
                            childrenWidth= {width}
                            childrenHeight={height * 0.14}
                            scaleStatus={'scaleY'}
                            onDragStart={(startIndex,endIndex)=>{
                                setIcrollEnabled(false);
                            }}
                            onDragEnd={(startIndex)=>{
                                setIcrollEnabled(true);
                            }}
                            onDataChange = {(data)=>{
                                setList([])
                                setList(data)
                            }}
                            keyExtractor={(item,index)=> index} 
                            onClickItem={(data,item,index)=>{}}
                            renderItem={(item,index)=>{
                                return optionRenderItem(item,index)
                            }}
                        />
                        <TouchableOpacity onPress={openOptionControll} style={{height : height * 0.1, justifyContent: "center", marginLeft: "5%"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#6490E7"}}>
                                + 옵션그룹 추가
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                    <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center"}}>
                        <TouchableOpacity onPress={() => editMenu("detail")} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>적용</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            {state === "change" &&
                <View 
                    style={{
                    marginHorizontal: "-5%",
                    marginTop: height * 0.1,
                    width: width,
                    height: height * 0.9, 
                    backgroundColor: "#fff",
                    borderTopLeftRadius: width * 0.04, 
                    borderTopRightRadius: width * 0.04, 
                    }}
                >
                    <View style={{height: height * 0.04, width}} />
                    <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", justifyContent: "flex-start"}}>
                        <Text style={{fontSize: RFPercentage(2.5), fontWeight: '600', color: "#191F28"}}>메뉴 순서 설정</Text>
                        <TouchableOpacity onPress={() => setstate("list")} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", right: 0}}>
                            <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                        </TouchableOpacity>
                    </View>
                    {(itemList.length > 0 && changeAlert) && 
                        <>
                            <TouchableOpacity onPress={() => setChangeAlert(false)} style={{position: "absolute", zIndex: 99, top: height * 0.09, left: "10%", height: height * 0.04, width: width * 0.8, backgroundColor: "#6490E7", borderRadius: width * 0.05, justifyContent: "space-between", alignItems: "center", flexDirection: "row", paddingLeft: "10%"}}>
                                <Text style={{fontSize: RFPercentage(1.5), fontWeight: '400', color: "#fff"}}>메뉴명을 누른채로 원하는 순서로 옮기시면 됩니다.</Text>
                                <ComponentDelete iHeight={height * 0.02} iWidth={width * 0.08} iColor={"#fff"}/>
                            </TouchableOpacity>
                            <View style={{position: "absolute", zIndex: 9, top: height * 0.11, left: "15%", height: height * 0.025, width: height * 0.025, backgroundColor: "#6490E7", transform: [{ rotateZ: '0.785398rad' }]}} />
                        </>
                    }
                    <View style={{height: height * 0.01, width}} />
                    <ScrollView
                        scrollEnabled = {eScrollEnabled}
                        style={{flex: 1, backgroundColor: "#fff" }}
                    >
                        <DragSortableView
                            dataSource={itemList}
                            parentWidth={width}
                            childrenWidth= {width}
                            childrenHeight={height * 0.14}
                            scaleStatus={'scaleY'}
                            onDragStart={(startIndex,endIndex)=>{
                                setEscrollEnabled(false);
                            }}
                            onDragEnd={(startIndex)=>{
                                setEscrollEnabled(true);
                            }}
                            onDataChange = {(data)=>{
                                setItemList([])
                                setItemList(data)
                            }}
                            keyExtractor={(item,index)=> index} 
                            onClickItem={(data,item,index)=>{}}
                            renderItem={(item,index)=>{
                                return renderItem(item,index)
                            }}
                        />
                    </ScrollView>
                    <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center"}}>
                        <TouchableOpacity onPress={exchange} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>적용</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            {state === "image" &&
                <View 
                    style={{
                    marginHorizontal: "-5%",
                    marginTop: height * 0.1,
                    width: width,
                    height: height * 0.9, 
                    backgroundColor: "#fff",
                    borderTopLeftRadius: width * 0.04, 
                    borderTopRightRadius: width * 0.04, 
                    }}
                >
                    {openModalSetting &&
                        <View style={{position: "absolute", top: 0, height: "100%", width: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 90, justifyContent: "center", alignItems: "center", borderTopLeftRadius: width * 0.04, borderTopRightRadius: width * 0.04 }}>
                            <View style={{height: width * 0.45, width: width * 0.8, backgroundColor: "#fff", borderRadius: width * 0.05, }}>
                                <View style={{height: width * 0.1, justifyContent: "center", alignItems: "center", borderBottomColor: "#dfdfdf", borderBottomWidth: 1, margin: "3%"}}>
                                    <Text style={{fontSize: RFPercentage(1.8), fontWeight: '600', color: "#6490E8"}}>사진 이용 권한을 허용해주세요</Text>
                                </View>
                                <View style={{height: width * 0.15, justifyContent: "center", alignItems: "center"}}>
                                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '700', color: "#000"}}>설정 페이지로 이동하시겠습니까?</Text>
                                </View>
                                <View style={{height: width * 0.15,justifyContent: "center", alignItems: "center", flexDirection: "row", borderTopWidth: 1, borderTopColor: "#dfdfdf"}}>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => settingModalMove()} style={{height: "100%",width: "50%", justifyContent: "center", alignItems: "center"}}>
                                        <Text style={{fontSize: RFPercentage(2), fontWeight: '800', color: "#6490E8"}}>이동</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => setOpenModalSetting(false)} style={{height: "100%",width: "50%", justifyContent: "center", alignItems: "center", borderLeftColor: "#dfdfdf", borderLeftWidth: 1}}>
                                        <Text style={{fontSize: RFPercentage(2), fontWeight: '800', color: "#dd1212"}}>취소</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    }
                    <View style={{height: height * 0.04, width}} />
                    <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", justifyContent: "flex-start"}}>
                        <Text style={{fontSize: RFPercentage(2.5), fontWeight: '600', color: "#191F28"}}>메뉴 이미지 설정</Text>
                        <TouchableOpacity onPress={() => setstate("list")} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", right: 0}}>
                            <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, backgroundColor: "#fff"}}>
                        <View style={{height: height * 0.18}}>
                            <View style={{flex: 1, justifyContent: "center", marginLeft: "5%"}}>
                                <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#333D4B"}}>메뉴 이미지</Text>
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
                                <TouchableOpacity onPress={() => deleteImage()} style={{position: "absolute", top: "5%", right: "5%", height: height * 0.03, width: height * 0.03 }}>
                                    <ComponentDeleteImage iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                                </TouchableOpacity>
                            </View>
                            :
                            <TouchableOpacity onPress={selectImage} style={{height: height * 0.09, width: width * 0.25, marginLeft: "5%", borderStyle: "dashed", borderWidth: 1, borderColor: "#D0D5DC", justifyContent: "center", alignItems: "center", borderRadius: 5}}>
                                <ComponentCamera iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#6490E7"}/>
                                <Text style={{fontSize: RFPercentage(1.6), fontWeight: '500', color: "#333D4B", marginTop: "5%"}}>첨부</Text>
                            </TouchableOpacity>
                        }
                        {sErrMessage !== "" &&
                            <View style={{height: height * 0.08, justifyContent: "center"}}>
                                <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#EF4452", marginLeft: "5%" }}>{sErrMessage}</Text>
                            </View>
                        }
                    </View>
                    <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center"}}>
                        <TouchableOpacity onPress={() => editMenu("image")} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>수정</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            {state === "optionList" &&
                <View 
                    style={{
                        marginHorizontal: "-5%",
                        marginTop: height * 0.1,
                        width: width,
                        height: height * 0.9, 
                        backgroundColor: "#fff",
                        borderTopLeftRadius: width * 0.04, 
                        borderTopRightRadius: width * 0.04, 
                    }}
                >
                    <OptionControll
                        sProps={oProps}
                        fnSelectValue={(sIndex) => selectValue(sIndex)}
                        fnCancel={() => setstate("option")} 
                    />
                </View>
            }
            {state === "delete" &&
                <View 
                    style={{
                        marginHorizontal: "0%",
                        marginTop: height * 0.1,
                        width: width * 0.9,
                        height: height * 0.24, 
                        backgroundColor: "#fff",
                        borderRadius: width * 0.03, 
                    }}
                >
                    <View style={{height: height * 0.03, width}} />
                    <View style={{height: height * 0.04, marginLeft: "5%", justifyContent: "center"}}>
                        <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>메뉴 삭제</Text>
                    </View>
                    <View style={{height: height * 0.08, marginLeft: "5%", justifyContent: "center"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>{sItem.name} 삭제하시겠습니까?</Text>
                    </View>
                    <View style={{height: height * 0.09, flexDirection: "row", justifyContent: "center"}}>
                        <TouchableOpacity onPress={() => setstate("list")} style={{height: "70%", width: "42%", backgroundColor: "#F2F3F5", marginRight: "5%", borderRadius: 5, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>취소</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteItem(sItem.id)} style={{height: "70%", width: "42%", backgroundColor: "#EF4452", borderRadius: 5, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#fff"}}>삭제</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            {preLoading &&
                <View style={{position: "absolute", zIndex: 20000,top: 0, marginTop: height * 0.47, height: height * 0.53, width : "110%", marginHorizontal: "-5%", backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
            {loading &&
                <View style={{position: "absolute", zIndex: 20000,top: 0, marginTop: "20%", height: "100%", width : "110%", marginHorizontal: "-5%", backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
            {deleteLoad &&
                <View style={{position: "absolute", zIndex: 20000,top: 0, marginTop: height * 0.43, height: height * 0.2, width : "100%", marginHorizontal: "0%", backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8, borderRadius: 10}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
        </>
    )
}

export const CompMainMenuInsertFunction = ({ fnClose, sProps, iTotalList, iMainList }) => {
    const [loading, setLoading] = useState(false);
    
    const [groupNm, setGroupNm] = useState("");

    const [keyboardUp, setKeyboardUp] = useState(false);

    const [totalList, setTotalList] = useState([]);
    const [subTotalList, setSubTotalList] = useState([]);

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const refList = useRef([]);

    const onChangeGroupNm = async (text) => {
        let temp = text;
        setGroupNm(temp);
        if(subTotalList.length > 0){
            const sList = subTotalList;
            const result = sList.filter(object => object.name.toLowerCase().includes((temp === undefined || temp === null) ? "" : temp.toLowerCase()));
            refList.current = [];
            setTotalList(result);
        }
    };
    
    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    const asyncData = async () => {
        setLoading(true);
        setTotalList(iTotalList);
        setSubTotalList(iTotalList);
        setLoading(false);
    }

    const insertMain = async () => {
        setLoading(true);
        const oData = {
            store_id: sProps.UserConfigReducer.StoreID,
            store_name: sProps.UserConfigReducer.StoreName,
            targetKeys: refList.current,
        }
        const oResponse = await sProps.appManager.accessAxios("/app/ceo/store/product/insert/mainMenu", "post", null, oData);
        if(oResponse !== undefined){
            if(oResponse.resultCd === "0000"){
                close();
            }
        }
        setLoading(false);
    }
    
    const checkValue = async (sIndex,aIndex,xIndex,nIndex) => {
        let tempList = refList.current;
        if(nIndex !== ""){
            let temp = {
                key: sIndex,
                name: aIndex,
                price: xIndex,
            }
            tempList.push(temp);
            refList.current = tempList;
        } else {
            refList.current = tempList.filter((item) => item.key !== sIndex);
            tempList = refList.current;
        }
    }

    const unActivateKeyboard = () => {
        Keyboard.dismiss();
        setKeyboardUp(false);
    }

    const onKeyboardDidShow = (e) => {
        setKeyboardHeight(e.endCoordinates.height);
    }

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
        asyncData();
    }, []);

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: height * 0.1,
                width: width,
                height: height * 0.9, 
                backgroundColor: "#fff",
                borderTopLeftRadius: width * 0.04, 
                borderTopRightRadius: width * 0.04, 
            }}
        >
            <View style={{height: height * 0.04, width}} />
            <View style={{height: height * 0.08, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", justifyContent: "flex-start"}}>
                <Text style={{fontSize: RFPercentage(2.5), fontWeight: '600', color: "#191F28"}}>대표메뉴 추가</Text>
                <TouchableOpacity onPress={close} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", right: 0}}>
                    <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                </TouchableOpacity>
            </View>
            {keyboardUp &&
                <View style={{ height: height * 0.05 }} />
            }
            <View style={{height: height * 0.1, backgroundColor: "#fff", justifyContent: "flex-start", alignItems: "center"}}>
                <TextInput
                    placeholder="메뉴명으로 검색해 보세요."
                    placeholderTextColor="#919AA7"
                    returnKeyType="done"
                    onFocus={() => setKeyboardUp(true)}
                    onBlur={() => setKeyboardUp(false)}
                    onChangeText={text => onChangeGroupNm(text)}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    value={groupNm}
                    style={{
                        paddingLeft: "15%",
                        width: "90%",
                        borderRadius: 5,
                        backgroundColor: "#FAFAFB",
                        height: height * 0.07,
                        fontSize: RFPercentage(2),
                        fontWeight: '500',
                        color: "#000"
                    }}
                />
                <View style={{position: "absolute", top: 0, left: "6%", width: height * 0.07, height: height * 0.07, justifyContent: "center", alignItems: "center"}}>
                    <ComponentSearch1 iHeight={height * 0.02} iWidth={width * 0.06} iColor={"#6B7583"}/>
                </View>
            </View>
            <View style={{flex: 1}}>
                <FlatList
                    data={totalList}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(data, index) => "list-" + index + Math.random()}
                    renderItem={({ item, index }) => {
                        return (
                            <MenuItem 
                                sMainList={refList.current}
                                sData={item}
                                fnCheck={(sIndex,aIndex,xIndex,zIndex) => checkValue(sIndex,aIndex,xIndex,zIndex)}
                            />
                        ) 
                    }}
                />
            </View>
            {keyboardUp &&
                <>
                <View style={{ height: keyboardHeight - height * 0.27 }} />
                <TouchableOpacity activeOpacity={0.8} onPress={unActivateKeyboard} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.195}}>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                </TouchableOpacity>
                </>
            }
            <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center"}}>
                <TouchableOpacity onPress={insertMain} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>추가</Text>
                </TouchableOpacity>
            </View>
            {loading &&
                <View style={{position: "absolute", zIndex: 20000,top: 0, marginTop: "5%", height: "100%", width : "110%", marginHorizontal: "-5%", backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
        </View>
    )
}

export const CompMenuGroupFunction = ({ sItem, iList, fnClose, oProps }) => {
    const [loading, setLoading] = useState(false);
    const [deleteLoad, setDeleteLoading] = useState(false);

    const [changeAlert, setChangeAlert] = useState(true);
    const [sChangeAlert, setSChangeAlert] = useState(true);

    const [sProductList, setProductList] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [groupNm, setGroupNm] = useState("");
    const [groupNmErrColor, setGroupNmErrColor] = useState("#EFF0F6");
    const [sNmErrText, setNmErrText] = useState("");

    const [state, setstate] = useState("list");

    const [textInputType, setTextInputType] = useState("");

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const [eScrollEnabled, setEscrollEnabled] = useState(true);
    const [iScrollEnabled, setIcrollEnabled] = useState(true);

    const onChangeGroupNm = text => {
        setGroupNm(text);
        setNmErrText("");
        setGroupNmErrColor("#6490E7");
    };

    const activeNmText = () => {
        setGroupNmErrColor("#6490E7");
        setTextInputType("nm");
    }
    
    const unactiveNmText = () => {
        setGroupNmErrColor("#EFF0F6");
        setTextInputType("");
        Keyboard.dismiss();
    }

    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    const onKeyboardDidShow = (e) => {
        setKeyboardHeight(e.endCoordinates.height);
    }

    const onChangeList = async (sIndex) => {
        await asyncData();
        unactiveNmText();
        Keyboard.dismiss();
        setstate(sIndex);
    }

    const exchange = async () => {
        setLoading(true);
        const oData = {
            categoryList : itemList,
            storeId: oProps.UserConfigReducer.StoreID
        }
        const oResponse = await oProps.appManager.accessAxios("/app/ceo/store/product/changeIndexCategory", "post", null, oData);
        if(oResponse !== undefined){
            if(oResponse.resultCd === "0000"){
                close();
            }
        }
        setLoading(false);
    }

    const edit = async () => {
        if(groupNm !== ""){
            setLoading(true);
            const oData = {
                sContent : groupNm,
                isMain : false,
                isUse : "use",
                menuId : sItem.id,
                storeId: oProps.UserConfigReducer.StoreID
            }
            const oResponse = await oProps.appManager.accessAxios("/app/sales/store/register/editCategoryList", "post", null, oData);
            if(oResponse !== undefined){
                if(oResponse){
                    close();
                }
            }
            setLoading(false);
        } else {
            setGroupNmErrColor("#EF4452");
            setNmErrText("메뉴 그룹명을 입력해주세요.");
        }
    }

    const deleteItem = async () => {
        setDeleteLoading(true);
        const oData = {
            category_id: sItem.id,
            storeId: oProps.UserConfigReducer.StoreID
        }
        const oResponse = await oProps.appManager.accessAxios("/app/sales/store/register/deleteCategory", "post", null, oData);
        if(oResponse !== undefined){
            if(oResponse){
                close();
            }
        }
        setDeleteLoading(false);
    }

    const exchangeMenu = async () => {
        setLoading(true);
        const oData = {
            sIndex: sProductList,
            store_id: oProps.UserConfigReducer.StoreID
        }
        const oResponse = await oProps.appManager.accessAxios("/store/register/changeIndexMenu", "post", "login", oData);
        if(oResponse !== undefined){
            if(oResponse.resultCd === "0000"){
                close();
            }
        }
        setLoading(false);
    }

    const asyncData = async () => {
        const category_id = sItem.id;
        const oResponse = await oProps.appManager.accessAxios("/app/sales/store/register/menuList-" + category_id, "get", "text", null);
        if(oResponse !== undefined){
            setProductList(oResponse);
        }
        setGroupNm(sItem.name);
        setItemList(iList);
    }

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
        asyncData();
    }, []);

    const itemRenderItem = (item) => {
        return (
            <View style={{width, height: height * 0.14,  justifyContent: "center", alignItems: "center"}}>
                <View style={{height: height * 0.11, width: width * 0.9, borderRadius: 10, borderWidth: 1, borderColor: "#F2F3F5", flexDirection: "row"}}>
                    <View style={{flex:0.2, justifyContent: "center", alignItems: "center"}}>
                        <ComponentGroupList iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                    </View>
                    <View style={{flex:0.8, backgroundColor: "#fff"}}>
                        <View style={{flex: 0.6, justifyContent: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#333D4B"}}>{item.name}</Text>
                        </View>
                        <View style={{flex: 0.4, justifyContent: "flex-start"}}>
                            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '500', color: "#333D4B"}}>{item.price}원</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const renderItem = (item, index, isMoved) => {
        return (
            <View style={{width, height: height * 0.14,  justifyContent: "center", alignItems: "center"}}>
                <View style={{height: height * 0.11, width: width * 0.9, borderRadius: 10, borderWidth: 1, borderColor: "#F2F3F5", flexDirection: "row"}}>
                    <View style={{flex:0.2, justifyContent: "center", alignItems: "center"}}>
                        <ComponentGroupList iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                    </View>
                    <View style={{flex:0.8, backgroundColor: "#fff"}}>
                        {item.productLine !== "" ?
                            <>
                                <View style={{flex: 0.6, justifyContent: "center"}}>
                                    <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#333D4B"}}>{item.name}</Text>
                                </View>
                                <View style={{flex: 0.4, justifyContent: "flex-start"}}>
                                    <Text style={{fontSize: RFPercentage(1.6), fontWeight: '500', color: "#333D4B"}}>{item.productLine}</Text>
                                </View>
                            </>
                        :
                            <View style={{flex: 1, justifyContent: "center"}}>
                                <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#333D4B"}}>{item.name}</Text>
                            </View>
                        }
                    </View>
                </View>
            </View>
        );
    };

    return (
        <>
            {state === "list" &&
                <View 
                    style={{
                        marginHorizontal: "-5%",
                        marginTop: height * 0.53,
                        width: width,
                        height: height * 0.47, 
                        backgroundColor: "#fff",
                        borderTopLeftRadius: width * 0.04, 
                        borderTopRightRadius: width * 0.04, 
                    }}
                >
                    <View style={{height: height * 0.02, width}} />
                    <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={{fontSize: RFPercentage(2.4), fontWeight: '600', color: "#191F28"}}>{sItem.name}</Text>
                        <TouchableOpacity onPress={close} style={{height: height * 0.025, width: width * 0.07}}>
                            <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => onChangeList("edit")} style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>메뉴그룹명 변경</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeList("change")} style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>메뉴그룹 순서 변경</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeList("menu")} style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#6490E7"}}>
                            {sItem.name}
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>의 메뉴 순서 변경</Text>
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeList("delete")} style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#EF4452"}}>메뉴그룹 삭제</Text>
                    </TouchableOpacity>
                </View>
            }
            {state === "edit" &&
                <View 
                    style={{
                        marginHorizontal: "-5%",
                        marginTop: height * 0.1,
                        width: width,
                        height: height * 0.9, 
                        backgroundColor: "#fff",
                        borderTopLeftRadius: width * 0.04, 
                        borderTopRightRadius: width * 0.04, 
                    }}
                >
                    <View style={{height: height * 0.04, width}} />
                    <View style={{height: height * 0.09, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", justifyContent: "flex-start"}}>
                        <Text style={{fontSize: RFPercentage(2.5), fontWeight: '600', color: "#191F28"}}>메뉴 그룹명 변경</Text>
                        <TouchableOpacity onPress={() => setstate("list")} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", right: 0}}>
                            <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={{flex: 1}}>
                        <View style={{height: height * 0.06, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", flexDirection: "row"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#3B3B46"}}>메뉴 그룹명</Text>
                        </View>
                        <View style={{height: height * 0.08, justifyContent: "center", alignItems: "center"}}>
                            <TextInput
                                placeholder="예) 햄버거 세트메뉴"
                                placeholderTextColor="#919AA7"
                                returnKeyType="done"
                                onChangeText={text => onChangeGroupNm(text)}
                                onFocus={() => activeNmText()}
                                onBlur={() => unactiveNmText()}
                                onSubmitEditing={() => edit()}
                                value={groupNm}
                                style={{
                                    paddingLeft: "5%",
                                    width: "90%",
                                    borderRadius: 5,
                                    backgroundColor: "#FAFAFB",
                                    borderWidth: 1,
                                    borderColor: groupNmErrColor,
                                    height: height * 0.07,
                                    fontSize: RFPercentage(2),
                                    fontWeight: '500',
                                    color: "#000"
                                }}
                            />
                        </View>
                        {sNmErrText !== "" &&
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "6%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{sNmErrText}</Text>
                            </View>
                        }
                    </TouchableOpacity>
                    {textInputType === "nm" &&
                        <TouchableOpacity activeOpacity={0.8} onPress={edit} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.2}}>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                        </TouchableOpacity>
                    }
                    {textInputType === "" &&
                        <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center"}}>
                            <TouchableOpacity onPress={edit} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>적용</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            }
            {state === "change" &&
                <View 
                    style={{
                        marginHorizontal: "-5%",
                        marginTop: height * 0.1,
                        width: width,
                        height: height * 0.9, 
                        backgroundColor: "#fff",
                        borderTopLeftRadius: width * 0.04, 
                        borderTopRightRadius: width * 0.04, 
                    }}
                >
                    <View style={{height: height * 0.04, width}} />
                    <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", justifyContent: "flex-start"}}>
                        <Text style={{fontSize: RFPercentage(2.5), fontWeight: '600', color: "#191F28"}}>메뉴그룹 순서 변경</Text>
                        <TouchableOpacity onPress={() => setstate("list")} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", right: 0}}>
                            <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                        </TouchableOpacity>
                    </View>
                    {(itemList.length > 0 && changeAlert) && 
                        <>
                            <TouchableOpacity onPress={() => setChangeAlert(false)} style={{position: "absolute", zIndex: 99, top: height * 0.08, left: "10%", height: height * 0.04, width: width * 0.8, backgroundColor: "#6490E7", borderRadius: width * 0.05, justifyContent: "space-between", alignItems: "center", flexDirection: "row", paddingLeft: "20%"}}>
                                <Text style={{fontSize: RFPercentage(1.5), fontWeight: '400', color: "#fff"}}>버튼을 위 아래로 움직여 순서를 변경해주세요.</Text>
                                <ComponentDelete iHeight={height * 0.02} iWidth={width * 0.08} iColor={"#fff"}/>
                            </TouchableOpacity>
                            <View style={{position: "absolute", zIndex: 99, top: height * 0.1, left: "15%", height: height * 0.025, width: height * 0.025, backgroundColor: "#6490E7", transform: [{ rotateZ: '0.785398rad' }]}} />
                        </>
                    }
                    <ScrollView
                        scrollEnabled = {eScrollEnabled}
                        style={{flex: 1, backgroundColor: "#fff" }}
                    >
                        <DragSortableView
                            dataSource={itemList}
                            parentWidth={width}
                            childrenWidth= {width}
                            childrenHeight={height * 0.14}
                            scaleStatus={'scaleY'}
                            onDragStart={(startIndex,endIndex)=>{
                                setEscrollEnabled(false);
                            }}
                            onDragEnd={(startIndex)=>{
                                setEscrollEnabled(true);
                            }}
                            onDataChange = {(data)=>{
                                setItemList([])
                                setItemList(data)
                            }}
                            keyExtractor={(item,index)=> index} 
                            onClickItem={(data,item,index)=>{}}
                            renderItem={(item,index)=>{
                                return renderItem(item,index)
                            }}
                        />
                    </ScrollView>
                    <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center"}}>
                        <TouchableOpacity onPress={exchange} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>적용</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            {state === "menu" &&
                <View 
                    style={{
                        marginHorizontal: "-5%",
                        marginTop: height * 0.1,
                        width: width,
                        height: height * 0.9, 
                        backgroundColor: "#fff",
                        borderTopLeftRadius: width * 0.04, 
                        borderTopRightRadius: width * 0.04, 
                    }}
                >
                    <View style={{height: height * 0.04, width}} />
                    <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", justifyContent: "flex-start"}}>
                        <Text style={{fontSize: RFPercentage(2.5), fontWeight: '600', color: "#191F28"}}>{sItem.name}의 메뉴 순서 변경</Text>
                        <TouchableOpacity onPress={() => setstate("list")} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", right: 0}}>
                            <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                        </TouchableOpacity>
                    </View>
                    {(sProductList.length > 0 && sChangeAlert) && 
                        <>
                            <TouchableOpacity onPress={() => setSChangeAlert(false)} style={{position: "absolute", zIndex: 99, top: height * 0.08, left: "10%", height: height * 0.04, width: width * 0.8, backgroundColor: "#6490E7", borderRadius: width * 0.05, justifyContent: "space-between", alignItems: "center", flexDirection: "row", paddingLeft: "20%"}}>
                                <Text style={{fontSize: RFPercentage(1.5), fontWeight: '400', color: "#fff"}}>버튼을 위 아래로 움직여 순서를 변경해주세요.</Text>
                                <ComponentDelete iHeight={height * 0.02} iWidth={width * 0.08} iColor={"#fff"}/>
                            </TouchableOpacity>
                            <View style={{position: "absolute", zIndex: 99, top: height * 0.1, left: "15%", height: height * 0.025, width: height * 0.025, backgroundColor: "#6490E7", transform: [{ rotateZ: '0.785398rad' }]}} />
                        </>
                    }
                    <ScrollView
                        scrollEnabled = {iScrollEnabled}
                        style={{flex: 1, backgroundColor: "#fff" }}
                    >
                        <DragSortableView
                            dataSource={sProductList}
                            parentWidth={width}
                            childrenWidth= {width}
                            childrenHeight={height * 0.14}
                            scaleStatus={'scaleY'}
                            onDragStart={(startIndex,endIndex)=>{
                                setIcrollEnabled(false);
                            }}
                            onDragEnd={(startIndex)=>{
                                setIcrollEnabled(true);
                            }}
                            onDataChange = {(data)=>{
                                setProductList([])
                                setProductList(data)
                            }}
                            keyExtractor={(item,index)=> index} 
                            onClickItem={(data,item,index)=>{}}
                            renderItem={(item,index)=>{
                                return itemRenderItem(item,index)
                            }}
                        />
                    </ScrollView>
                    <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center"}}>
                        <TouchableOpacity onPress={exchangeMenu} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>적용</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            {state === "delete" &&
                <View 
                    style={{
                        marginHorizontal: "0%",
                        marginTop: height * 0.1,
                        width: width * 0.9,
                        height: height * 0.24, 
                        backgroundColor: "#fff",
                        borderRadius: width * 0.03, 
                    }}
                >
                    <View style={{height: height * 0.03, width}} />
                    <View style={{height: height * 0.04, marginLeft: "5%", justifyContent: "center"}}>
                        <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>메뉴그룹 삭제</Text>
                    </View>
                    <View style={{height: height * 0.08, marginLeft: "5%", justifyContent: "center"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>{sItem.name} 삭제하시겠습니까?</Text>
                    </View>
                    <View style={{height: height * 0.09, flexDirection: "row", justifyContent: "center"}}>
                        <TouchableOpacity onPress={() => setstate("list")} style={{height: "70%", width: "42%", backgroundColor: "#F2F3F5", marginRight: "5%", borderRadius: 5, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>취소</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteItem()} style={{height: "70%", width: "42%", backgroundColor: "#EF4452", borderRadius: 5, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#fff"}}>삭제</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            {loading &&
                <View style={{position: "absolute", zIndex: 20000,top: 0, marginTop: "20%", height: "100%", width : "110%", marginHorizontal: "-5%", backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
            {deleteLoad &&
                <View style={{position: "absolute", zIndex: 20000,top: 0, marginTop: height * 0.43, height: height * 0.2, width : "100%", marginHorizontal: "0%", backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8, borderRadius: 10}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
        </>
    )
}

export const CompMainMenuFunction = ({ sItem, iList, fnClose, oProps }) => {
    const [loading, setLoading] = useState(false);
    const [deleteLoad, setDeleteLoading] = useState(false);

    const [changeAlert, setChangeAlert] = useState(true);

    const [itemList, setItemList] = useState([]);

    const [state, setstate] = useState("list");

    const [eScrollEnabled, setEscrollEnabled] = useState(true);

    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    const exchange = async () => {
        setLoading(true);
        const oData = {
            sIndex: itemList,
            store_id: oProps.UserConfigReducer.StoreID
        }
        const oResponse = await oProps.appManager.accessAxios("/app/ceo/store/search/product/changeIndexMainMenu", "post", "login", oData);
        if(oResponse !== undefined){
            if(oResponse.resultCd === "0000"){
                close();
            }
        }
        setLoading(false);
    }
    
    const onChangeList = async (sIndex) => {
        setItemList(iList);
        setstate(sIndex);
    }

    const deleteItem = async () => {
        setDeleteLoading(true);
        const oData = {
            sIndex: sItem.key
        };
        const oResponse = await oProps.appManager.accessAxios("/app/sales/store/register/deleteMenu/v2", "post", null, oData);
        if(oResponse !== undefined){
            if(oResponse){
                close();
            }
        }
        setDeleteLoading(false);
    }

    const renderItem = (item) => {
        return (
            <View style={{width, height: height * 0.14,  justifyContent: "center", alignItems: "center"}}>
                <View style={{height: height * 0.11, width: width * 0.9, borderRadius: 10, borderWidth: 1, borderColor: "#F2F3F5", flexDirection: "row"}}>
                    <View style={{flex:0.2, justifyContent: "center", alignItems: "center"}}>
                        <ComponentGroupList iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                    </View>
                    <View style={{flex:0.8, backgroundColor: "#fff"}}>
                        <View style={{flex: 1, justifyContent: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#333D4B"}}>{item.name}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <>
            {state === "list" &&
                <View 
                    style={{
                        marginHorizontal: "-5%",
                        marginTop: height * 0.67,
                        width: width,
                        height: height * 0.33, 
                        backgroundColor: "#fff",
                        borderTopLeftRadius: width * 0.04, 
                        borderTopRightRadius: width * 0.04, 
                    }}
                >
                    <View style={{height: height * 0.02, width}} />
                    <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={{fontSize: RFPercentage(2.4), fontWeight: '600', color: "#191F28"}}>{sItem.name}</Text>
                        <TouchableOpacity onPress={close} style={{height: height * 0.025, width: width * 0.07}}>
                            <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => onChangeList("change")} style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>대표메뉴 순서 변경</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeList("delete")} style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#EF4452"}}>대표메뉴에서 해당 메뉴 삭제</Text>
                    </TouchableOpacity>
                </View>
            }
            {state === "change" &&
                <View 
                    style={{
                        marginHorizontal: "-5%",
                        marginTop: height * 0.1,
                        width: width,
                        height: height * 0.9, 
                        backgroundColor: "#fff",
                        borderTopLeftRadius: width * 0.04, 
                        borderTopRightRadius: width * 0.04, 
                    }}
                >
                    <View style={{height: height * 0.04, width}} />
                    <View style={{height: height * 0.07, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", justifyContent: "flex-start"}}>
                        <Text style={{fontSize: RFPercentage(2.5), fontWeight: '600', color: "#191F28"}}>대표메뉴 순서 변경</Text>
                        <TouchableOpacity onPress={() => setstate("list")} style={{height: height * 0.025, width: width * 0.07, position: "absolute", top: "5%", right: 0}}>
                            <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                        </TouchableOpacity>
                    </View>
                    {(itemList.length > 0 && changeAlert) && 
                        <>
                            <TouchableOpacity onPress={() => setChangeAlert(false)} style={{position: "absolute", zIndex: 99, top: height * 0.08, left: "10%", height: height * 0.04, width: width * 0.8, backgroundColor: "#6490E7", borderRadius: width * 0.05, justifyContent: "space-between", alignItems: "center", flexDirection: "row", paddingLeft: "20%"}}>
                                <Text style={{fontSize: RFPercentage(1.5), fontWeight: '400', color: "#fff"}}>버튼을 위 아래로 움직여 순서를 변경해주세요.</Text>
                                <ComponentDelete iHeight={height * 0.02} iWidth={width * 0.08} iColor={"#fff"}/>
                            </TouchableOpacity>
                            <View style={{position: "absolute", zIndex: 99, top: height * 0.1, left: "15%", height: height * 0.025, width: height * 0.025, backgroundColor: "#6490E7", transform: [{ rotateZ: '0.785398rad' }]}} />
                        </>
                    }
                    <ScrollView
                        scrollEnabled = {eScrollEnabled}
                        style={{flex: 1, backgroundColor: "#fff", borderBottomColor: "#F2F3F5", borderBottomWidth: 1 }}
                    >
                        <DragSortableView
                            dataSource={itemList}
                            parentWidth={width}
                            childrenWidth= {width}
                            childrenHeight={height * 0.14}
                            scaleStatus={'scaleY'}
                            onDragStart={(startIndex,endIndex)=>{
                                setEscrollEnabled(false);
                            }}
                            onDragEnd={(startIndex)=>{
                                setEscrollEnabled(true);
                            }}
                            onDataChange = {(data)=>{
                                setItemList([])
                                setItemList(data)
                            }}
                            keyExtractor={(item,index)=> index} 
                            onClickItem={(data,item,index)=>{}}
                            renderItem={(item,index)=>{
                                return renderItem(item,index)
                            }}
                        />
                    </ScrollView>
                    <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center"}}>
                        <TouchableOpacity onPress={exchange} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>적용</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            {state === "delete" &&
                <View 
                    style={{
                        marginHorizontal: "0%",
                        marginTop: height * 0.1,
                        width: width * 0.9,
                        height: height * 0.31, 
                        backgroundColor: "#fff",
                        borderRadius: width * 0.03, 
                    }}
                >
                    <View style={{height: height * 0.03, width}} />
                    <View style={{height: height * 0.04, marginLeft: "5%", justifyContent: "center"}}>
                        <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>메뉴 삭제</Text>
                    </View>
                    <View style={{height: height * 0.15, marginLeft: "5%", justifyContent: "center"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>선택한 메뉴를 삭제하시겠습니까?</Text>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>대표메뉴에서만 삭제되고</Text>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>메뉴 정보는 삭제되지 않습니다.</Text>
                    </View>
                    <View style={{height: height * 0.09, flexDirection: "row", justifyContent: "center"}}>
                        <TouchableOpacity onPress={() => setstate("list")} style={{height: "70%", width: "42%", backgroundColor: "#F2F3F5", marginRight: "5%", borderRadius: 5, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#4E5867"}}>취소</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteItem()} style={{height: "70%", width: "42%", backgroundColor: "#EF4452", borderRadius: 5, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: RFPercentage(2), fontWeight: '500', color: "#fff"}}>삭제</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            {loading &&
                <View style={{position: "absolute", zIndex: 20000,top: 0, marginTop: "20%", height: "100%", width : "110%", marginHorizontal: "-5%", backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
            {deleteLoad &&
                <View style={{position: "absolute", zIndex: 20000,top: 0, marginTop: height * 0.43, height: height * 0.22, width : "100%", marginHorizontal: "0%", backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8, borderRadius: 10}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
        </>
    )
}

export const CompModalPickUpAlert = ({fnClose}) => {

    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "0%",
                marginTop: width * 0.1,
                width: width * 0.9,
                height: height * 0.26, 
                backgroundColor: "#fff",
                borderRadius: width * 0.02, 
            }}
        >
            <View style={{height: height * 0.02, justifyContent: "center", alignItems: "center"}} />
            <View style={{height: height * 0.07, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>픽업존 근접 알림</Text>
            </View>
            <View style={{height: height * 0.08, justifyContent: "flex-start", alignItems: "center", marginLeft: "5%", marginRight: "5%"}}>
                <Text style={{fontSize: RFPercentage(1.7), fontWeight: '500', color: "#4E5867"}}>
                    고객이 픽업존 근처에 도착하면 알람이 울립니다. 픽업존과 고객의 거리가 몇 미터일 때 알람이 울릴지 설정해 주세요.
                </Text>
            </View>
            <View style={{height: height * 0.09, justifyContent: "flex-start", alignItems: "center" }}>
                <TouchableOpacity onPress={close} style={{height: "70%", width: "90%", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#E1E2E3", borderRadius: 10}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>확인</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const CompModalOperationAlert = ({fnClose}) => {

    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "0%",
                marginTop: width * 0.1,
                width: width * 0.9,
                height: height * 0.28, 
                backgroundColor: "#fff",
                borderRadius: width * 0.02, 
            }}
        >
            <View style={{height: height * 0.02, justifyContent: "center", alignItems: "center"}} />
            <View style={{height: height * 0.07, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>메뉴 준비시간 안내</Text>
            </View>
            <View style={{height: height * 0.1, justifyContent: "flex-start", alignItems: "center", marginLeft: "5%", marginRight: "5%"}}>
                <Text style={{fontSize: RFPercentage(1.7), fontWeight: '500', color: "#4E5867"}}>
                    매장의 바쁜 정도에따라 상품준비시간을 미리 설정할 수 있어요.  너무 바뻐서 차까지 전달이 어려운 시간대는 워크스루만 가능으로 선택하시면, 해당 시간에는 고객에게 워크스루만 가능 매장으로 표시됩니다.
                </Text>
            </View>
            <View style={{height: height * 0.09, justifyContent: "flex-start", alignItems: "center" }}>
                <TouchableOpacity onPress={close} style={{height: "70%", width: "90%", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#E1E2E3", borderRadius: 10}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>확인</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const CompModalTemperaryContent = ({fnClose, fnConfirm}) => {

    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    const confirm = async () => {
        if(fnConfirm !== undefined && typeof fnConfirm === "function"){
            await fnConfirm();
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "0%",
                marginTop: width * 0.1,
                width: width * 0.9,
                height: height * 0.22, 
                backgroundColor: "#fff",
                borderRadius: width * 0.02, 
            }}
        >
            <View style={{height: height * 0.02, justifyContent: "center", alignItems: "center"}} />
            <View style={{height: height * 0.05, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>임시휴무 삭제</Text>
            </View>
            <View style={{height: height * 0.05, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(1.7), fontWeight: '500', color: "#4E5867"}}>임시휴무를 삭제하시겠습니까?</Text>
            </View>
            <View style={{height: height * 0.1, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                <TouchableOpacity onPress={close} style={{height: "65%", width: "42%", justifyContent: "center", alignItems: "center", backgroundColor: "#F2F3F5", marginRight: "5%", borderRadius: 10}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirm} style={{height: "65%", width: "42%", justifyContent: "center", alignItems: "center", backgroundColor: "#EF4452", borderRadius: 10}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#fff"}}>삭제</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const CompModalRegularContent = ({fnClose, fnConfirm, sKey}) => {

    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    const confirm = async () => {
        if(fnConfirm !== undefined && typeof fnConfirm === "function"){
            await fnConfirm(sKey);
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "0%",
                marginTop: width * 0.1,
                width: width * 0.9,
                height: height * 0.22, 
                backgroundColor: "#fff",
                borderRadius: width * 0.02, 
            }}
        >
            <View style={{height: height * 0.02, justifyContent: "center", alignItems: "center"}} />
            <View style={{height: height * 0.05, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>정기휴무 삭제</Text>
            </View>
            <View style={{height: height * 0.05, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(1.7), fontWeight: '500', color: "#4E5867"}}>정기휴무를 삭제하시겠습니까?</Text>
            </View>
            <View style={{height: height * 0.1, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                <TouchableOpacity onPress={close} style={{height: "65%", width: "42%", justifyContent: "center", alignItems: "center", backgroundColor: "#F2F3F5", marginRight: "5%", borderRadius: 10}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirm} style={{height: "65%", width: "42%", justifyContent: "center", alignItems: "center", backgroundColor: "#EF4452", borderRadius: 10}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#fff"}}>삭제</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const CompModalTerms = ({ type, fnAgree, isAgree }) => {
    
    const agree = async () => {
        if(fnAgree !== undefined && typeof fnAgree === "function"){
            await fnAgree();
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: height * 0.3,
                width: width,
                height: height * 0.7, 
                backgroundColor: "#fff",
                borderTopLeftRadius: width * 0.05, 
                borderTopRightRadius: width * 0.05, 
            }}
        >
            <View style={{height: height / 12, backgroundColor: "#fff", marginTop: "5%", justifyContent: "center", width: "100%", marginLeft: "5%"}}>
                {type === "term1" &&
                    <Text style={{ fontSize: RFPercentage(2.3), fontWeight: '600', color: '#191F28' }}>판매 이용약관</Text>
                }
                {type === "term2" &&
                    <Text style={{ fontSize: RFPercentage(2.3), fontWeight: '600', color: '#191F28' }}>전자금융거래 이용약관</Text>
                }
                {type === "term3" &&
                    <Text style={{ fontSize: RFPercentage(2.3), fontWeight: '600', color: '#191F28' }}>판매자 개인 정보 수집 및 이용 동의</Text>
                }
            </View>
            <View style={{flex:1,justifyContent: "center", alignItems: "center", marginLeft: "5%", marginRight: "5%", paddingBottom: "5%"}}>
                <ScrollView>
                    {type === "term1" &&
                        <BasicTerms />
                    }
                    {type === "term2" &&
                        <AgreeTerms />
                    }
                    {type === "term3" &&
                        <PersonalTerms />
                    }
                </ScrollView>
            </View>
            <View style={{height: height / 9 , backgroundColor: "#fff", justifyContent: "flex-start"}}>
                <TouchableOpacity
                    onPress={agree}
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
                <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>{isAgree ? "동의완료": "동의합니다"}</Text>
                </TouchableOpacity>
            </View>
            {/* <View style={{height: height * 0.1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                <TouchableOpacity  onPress={agree} style={{height: 54, width: "90%", backgroundColor: isAgree ? "#dfdfdf" :"#6490E8", borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '800', color: "#fff"}}>{isAgree ? "동의완료": "동의합니다"}</Text>
                </TouchableOpacity>
            </View> */}
        </View>
    )
}

export const CompModalOpenConfirm = ({fnClose,fnMove}) => {

    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    const move = async () => {
        if(fnMove !== undefined && typeof fnMove === "function"){
            await fnMove();
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "5%",
                marginTop: width * 0.1,
                width: width * 0.8,
                height: height * 0.35, 
                backgroundColor: "#fff",
                borderRadius: width * 0.05, 
            }}
        >
            <View style={{height: height * 0.1, alignItems: "center", justifyContent: "flex-end"}}>
                <Text style={{fontSize: RFPercentage(1.9), fontWeight: '700', color: "#000"}}>정보 입력이 완료되지 않았습니다.</Text>
                <Text style={{fontSize: RFPercentage(1.9), fontWeight: '700', color: "#000"}}>여기서 나가시겠습니까?</Text>
            </View>
            <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center"}}>
                <Text style={{fontSize: RFPercentage(1.9), fontWeight: '400', color: "#000"}}>입력된 정보는 자동 저장되며,</Text>
                <Text style={{fontSize: RFPercentage(1.9), fontWeight: '400', color: "#000"}}>로그인 후 이어서 작성이 가능합니다.</Text>
            </View>
            <View style={{height: height * 0.1, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                <TouchableOpacity onPress={close} style={{height: "65%", width: "42%", justifyContent: "center", alignItems: "center", backgroundColor: "#F2F3F5", marginRight: "5%", borderRadius: 10}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>머무르기</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={move} style={{height: "65%", width: "42%", justifyContent: "center", alignItems: "center", backgroundColor: "#EF4452", borderRadius: 10}}>
                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#fff"}}>나가기</Text>
                </TouchableOpacity>
            </View>
            {/* <View style={{height: width * 0.15,justifyContent: "center", alignItems: "center", flexDirection: "row", borderTopWidth: 1, borderTopColor: "#dfdfdf"}}>
                <TouchableOpacity activeOpacity={0.8} onPress={close} style={{height: "100%",width: "50%", justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(2), fontWeight: '800', color: "#6490E8"}}>머무르기</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onPress={move} style={{height: "100%",width: "50%", justifyContent: "center", alignItems: "center", borderLeftColor: "#dfdfdf", borderLeftWidth: 1}}>
                    <Text style={{fontSize: RFPercentage(2), fontWeight: '800', color: "#dd1212"}}>나가기</Text>
                </TouchableOpacity>
            </View> */}
        </View>
    )
}

export const CompModalAddress = ({fnAddress}) => {

    const getAddress = async (data) => {
        let temp = data;
        if(temp !== undefined){
            if(temp.address !== undefined){
                if(fnAddress !== undefined && typeof fnAddress === "function"){
                    await fnAddress(temp.address);
                }
            }
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: height * 0.3,
                width: width,
                height: height * 0.8, 
                backgroundColor: "#fff",
                borderTopLeftRadius: width * 0.05, 
                borderTopRightRadius: width * 0.05, 
            }}
        >
            <View style={{height: height * 0.07, backgroundColor: "#fff", justifyContent: "center", paddingLeft: "7%", marginTop: "5%"}}>
                <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#191F28" }}>매장 주소를 선택하세요</Text>
            </View>
            <View style={{flex:1,justifyContent: "center", alignItems: "center", marginTop: "5%", marginLeft: "5%", marginRight: "5%", marginBottom: "10%"}}>
                <Postcode
                    style={{ width: "100%", height: "100%" }}
                    jsOptions={{ animation: false, hideMapBtn: false }}
                    onSelected={data => getAddress(data)}
                />
            </View>
        </View>
    )
}

export const CompModalSettingPage = ({fnCancel, fnMove}) => {
    const cancelTo = async () => {
        if(fnCancel !== undefined && typeof fnCancel === "function"){
            await fnCancel();
        }
    }

    const moveTo = async () => {
        if(fnMove !== undefined && typeof fnMove === "function"){
            await fnMove();
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "5%",
                marginTop: width * 0.1,
                width: width * 0.8,
                height: width * 0.45, 
                backgroundColor: "#fff",
                borderRadius: width * 0.05, 
            }}
        >
            <View style={{height: width * 0.1, justifyContent: "center", alignItems: "center", borderBottomColor: "#dfdfdf", borderBottomWidth: 1, margin: "3%"}}>
                <Text style={{fontSize: RFPercentage(1.8), fontWeight: '600', color: "#6490E8"}}>사진 이용 권한을 허용해주세요</Text>
            </View>
            <View style={{height: width * 0.15, justifyContent: "center", alignItems: "center"}}>
                <Text style={{fontSize: RFPercentage(1.9), fontWeight: '700', color: "#000"}}>설정 페이지로 이동하시겠습니까?</Text>
            </View>
            <View style={{height: width * 0.15,justifyContent: "center", alignItems: "center", flexDirection: "row", borderTopWidth: 1, borderTopColor: "#dfdfdf"}}>
                <TouchableOpacity activeOpacity={0.8} onPress={moveTo} style={{height: "100%",width: "50%", justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(2), fontWeight: '800', color: "#6490E8"}}>이동</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onPress={cancelTo} style={{height: "100%",width: "50%", justifyContent: "center", alignItems: "center", borderLeftColor: "#dfdfdf", borderLeftWidth: 1}}>
                    <Text style={{fontSize: RFPercentage(2), fontWeight: '800', color: "#dd1212"}}>취소</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const CompModalStoreAlert = ({ fnClose }) => {

    const closeModal = async (sIndex) => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose(sIndex);
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "0%",
                width: width * 0.9,
                height: height * 0.6, 
                backgroundColor: "#fff",
                borderRadius: width * 0.05, 
            }}
        >
            <View style={{padding: "7%"}}>
                <View style={{height: height * 0.05, backgroundColor: "#fff", justifyContent: "center"}}>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2.4), color: "#191F28" }}>공지사항 안내</Text>
                </View>
                <View style={{height: height * 0.4, backgroundColor: "#fff"}}>
                    <Image source={preNoticeImg} style={{ width: "100%", height: "100%", resizeMode: "contain"}}/>
                </View>
                <View style={{height: height * 0.1, backgroundColor: "#fff", justifyContent: "center"}}>
                    <TouchableOpacity onPress={closeModal} style={{height: height * 0.06, backgroundColor: "#fff",borderWidth: 1, borderColor: "#E1E2E3", borderRadius: width * 0.02, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#191F28" }}>확인</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export const CompModalBankList = ({ fnSelectValue, aBank }) => {
    const [state, setstate] = useState("");

    const selectValue = async (sIndex) => {
        if(fnSelectValue !== undefined && typeof fnSelectValue === "function"){
            await fnSelectValue(sIndex);
        }
    }

    useEffect(() => {
        if(aBank !== undefined && aBank !== null && aBank !== ""){
            setstate(aBank);
        }
    }, [aBank]);

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: height * 0.3,
                width: width,
                height: height * 0.7, 
                backgroundColor: "#fff",
                borderTopLeftRadius: width * 0.05, 
                borderTopRightRadius: width * 0.05, 
            }}
        >
            <View style={{padding: "7%"}}>
                <FlatList
                    data={bankTypeList}
                    numColumns={3}
                    contentContainerStyle={{paddingHorizontal: width * 0.01}}
                    ListFooterComponent={<View style={{ height: 100 }} />}
                    ListHeaderComponent={
                        <View style={{height: height * 0.07, backgroundColor: "#fff", justifyContent: "flex-start"}}>
                            <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#191F28" }}>은행을 선택하세요</Text>
                        </View>
                    }
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(data, index) => "list-" + index + Math.random()}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={{height: height * 0.03}}/>
                        )
                    }}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity onPress={() => selectValue(item.name)} style={{height: width * 0.2, backgroundColor: "#FAFAFB", width: width * 0.25, borderRadius: 10, marginRight: "5%", justifyContent: "center", alignItems: "center"}}>
                                {item.image !== undefined &&
                                    <Image source={item.image} style={{ width: height * 0.05, height: height * 0.025, resizeMode: "contain"}}/>
                                }
                                <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#000", marginTop: "10%" }}>{item.name}</Text>
                            </TouchableOpacity>
                        ) 
                    }}
                />
            </View>
        </View>
    )
}


export const CompModalTypeList = ({ fnCompleteSelect, iProps, iPlainOptions, iCafeOptions, iShopOptions }) => {
    const [state, setState] = useState("main");

    const [mainType, setMainType] = useState({});
    const [subType, setSubType] = useState({});

    const optionBox = useRef([]);
    const subOptionBox = useRef([]);
    const typeBox = useRef([]);

    const selectValue = async (sIndex) => {
        if(sIndex.key.toString() === "1"){
            typeBox.current = iPlainOptions;
        } else if (sIndex.key.toString() === "2"){
            typeBox.current = iCafeOptions;
        } else if (sIndex.key.toString() === "3"){
            typeBox.current = iShopOptions;
        }
        optionBox.current = [];
        setMainType(sIndex);
        setState("mainList");
    }

    const completeSelect = async (sIndex) => {
        if(fnCompleteSelect !== undefined && typeof fnCompleteSelect === "function"){
            let temp = subType;
            if(sIndex !== undefined && sIndex !== null){
                temp = sIndex;
            }
            await fnCompleteSelect(mainType,temp,optionBox.current,subOptionBox.current);
        }
    }

    const selectSubValue = async (sIndex) => {
        if(parseInt(sIndex.key) === 4){
            setSubType({});
            subOptionBox.current = [];
            completeSelect(sIndex);
        } else {
            if(sIndex.key.toString() === "1"){
                typeBox.current = iPlainOptions;
            } else if (sIndex.key.toString() === "2"){
                typeBox.current = iCafeOptions;
            } else if (sIndex.key.toString() === "3"){
                typeBox.current = iShopOptions;
            }
            subOptionBox.current = [];
            setSubType(sIndex);
            setState("subList");
        }
    }

    const nextToSubType = async (sIndex) => {
        setState("sub");
    }

    const checkValue = (sIndex,aIndex,xIndex) => {
        let tempList = optionBox.current;
        if(xIndex !== ""){
            let temp = {
                key: sIndex,
                name: aIndex
            }
            tempList.push(temp);
            optionBox.current = tempList;
        } else {
            optionBox.current = tempList.filter((item) => item.key !== sIndex);
        }
    }

    const subCheckValue = (sIndex,aIndex,xIndex) => {
        let tempList = subOptionBox.current;
        if(xIndex !== ""){
            let temp = {
                key: sIndex,
                name: aIndex
            }
            tempList.push(temp);
            subOptionBox.current = tempList;
        } else {
            subOptionBox.current = tempList.filter((item) => item.key !== sIndex);
        }
    }

    const changeState = async () => {
        setState("main");
    }
    const changeSubState = async () => {
        setState("sub");
    }

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: width * 0.3,
                width: width,
                height: height * 0.8, 
                backgroundColor: "#f0f6fc",
                borderRadius: width * 0.05, 
            }}
        >
            {state === "main" &&
                <MainTypeContent 
                    sMainType={mainType}
                    fnSelectValue={(sIndex) => selectValue(sIndex)}
                />
            }
            {state === "mainList" &&
                <MainTypeList
                    iList={typeBox.current}
                    fnDone={() => nextToSubType()}
                    fnChangeState={() => changeState()}
                    fnSelected={(sIndex,aIndex,xIndex) => checkValue(sIndex,aIndex,xIndex)}
                />
            }
            {state === "sub" &&
                <SubTypeContent
                    sMainType={mainType}
                    iSubType={subType}
                    fnSelectValue={(sIndex) => selectSubValue(sIndex)}
                />
            }
            {state === "subList" &&
                <SubTypeList
                    iList={typeBox.current}
                    fnDone={() => completeSelect()}
                    fnChangeState={() => changeSubState()}
                    fnSelected={(sIndex,aIndex,xIndex) => subCheckValue(sIndex,aIndex,xIndex)}
                />
            }
        </View>
    )
}

export const CompModalMainTypePage = ({ fnCompleteSelect, iPlainOptions, iCafeOptions, iShopOptions, fnClose }) => {
    const [state, setState] = useState("main");
    const [mList, setMList] = useState([]);

    const [mainTypeNm, setMainTypeNm] = useState("");
    const [mainTypeNumber, setMainTypeNumber] = useState(0);

    const optionBox = useRef([]);
    
    const closeModal = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    const selectedMainValue = async (sIndex,aIndex) => {
        setMainTypeNm(sIndex);
        setMainTypeNumber(aIndex);
        if(aIndex.toString() === "1"){
            setMList(iPlainOptions);
        } else if (aIndex.toString() === "2"){
            setMList(iCafeOptions);
        } else {
            setMList(iShopOptions);
        }
        setState("selectMain");
    }

    const completeSelect = async () => {
        if(fnCompleteSelect !== undefined && typeof fnCompleteSelect === "function"){
            await fnCompleteSelect(mainTypeNm,mainTypeNumber,optionBox.current);
        }
    }

    const checkValue = async (sIndex,aIndex,xIndex) => {
        let tempList = optionBox.current;
        if(xIndex !== ""){
            let temp = {
                key: sIndex,
                name: aIndex
            }
            tempList.push(temp);
            optionBox.current = tempList;
        } else {
            optionBox.current = tempList.filter((item) => item.key !== sIndex);
        }
    }

    const backToMain = async () => {
        setMList([]);
        setState("main");
    }

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: width * 0.35,
                width: width,
                height: height * 0.85, 
                backgroundColor: "#fff",
                borderRadius: width * 0.05, 
            }}
        >
            {state === "main" &&
                <MainTypePage 
                    sNext={(sIndex,aIndex) => selectedMainValue(sIndex,aIndex)}
                    sCancel={() => closeModal()}
                />
            }
            {state === "selectMain" &&
                <MainTypeSelectPage 
                    iStep={"none"}
                    iList={mList}
                    fnSelected={(sIndex,aIndex,xIndex) => checkValue(sIndex,aIndex,xIndex)}
                    fnNextToSubType={() => completeSelect()}
                    sCancel={() => backToMain()}
                />
            }
        </View>
    )
}

export const CompModalSubTypePage = ({ fnCompleteSelect, iPlainOptions, iCafeOptions, iShopOptions, fnClose, sTypeNumber }) => {
    const [state, setState] = useState("sub");
    const [sList, setSList] = useState([]);

    const [subTypeNm, setSubTypeNm] = useState("");
    const [subTypeNumber, setSubTypeNumber] = useState(0);

    const subOptionBox = useRef([]);
    
    const closeModal = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    const selectedSubValue = async (sIndex,aIndex) => {
        setSubTypeNm(sIndex);
        setSubTypeNumber(aIndex);
        if(aIndex.toString() === "1"){
            setSList(iPlainOptions);
        } else if (aIndex.toString() === "2"){
            setSList(iCafeOptions);
        } else if (aIndex.toString() === "3"){
            setSList(iShopOptions);
        } else {
            if(fnCompleteSelect !== undefined && typeof fnCompleteSelect === "function"){
                await fnCompleteSelect(sIndex,aIndex,subOptionBox.current);
            }
            return false;
        }
        setState("selectSub");
    }

    const completeSelect = async () => {
        if(fnCompleteSelect !== undefined && typeof fnCompleteSelect === "function"){
            await fnCompleteSelect(subTypeNm,subTypeNumber,subOptionBox.current);
        }
    }

    const checkValue = async (sIndex,aIndex,xIndex) => {
        let tempList = subOptionBox.current;
        if(xIndex !== ""){
            let temp = {
                key: sIndex,
                name: aIndex
            }
            tempList.push(temp);
            subOptionBox.current = tempList;
        } else {
            subOptionBox.current = tempList.filter((item) => item.key !== sIndex);
        }
    }

    const backToSub = async () => {
        setSList([]);
        setState("sub");
    }

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: width * 0.35,
                width: width,
                height: height * 0.85, 
                backgroundColor: "#fff",
                borderRadius: width * 0.05, 
            }}
        >
            {state === "sub" &&
                <SubTypePage
                    sMainType={sTypeNumber}
                    sCancel={() => closeModal()}
                    sNext={(sIndex,aIndex) => selectedSubValue(sIndex,aIndex)}
                />
            }
            {state === "selectSub" &&
                <SubTypeSelectPage 
                    iList={sList}
                    fnSelected={(sIndex,aIndex,xIndex) => checkValue(sIndex,aIndex,xIndex)}
                    fnNextToSubType={() => completeSelect()}
                    sCancel={() => backToSub()}
                />
            }
        </View>
    )
}

export const CompModalMainListTypePage = ({ fnCompleteSelect, mList, iList, fnCloseModal }) => {
    const optionBox = useRef(iList);

    const completeSelect = async () => {
        if(fnCompleteSelect !== undefined && typeof fnCompleteSelect === "function"){
            await fnCompleteSelect(optionBox.current);
        }
    }

    const closeModal = async () => {
        if(fnCloseModal !== undefined && typeof fnCloseModal === "function"){
            await fnCloseModal();
        }
    }

    const checkValue = async (sIndex,aIndex,xIndex) => {
        let tempList = optionBox.current;
        if(xIndex !== ""){
            let temp = {
                key: sIndex,
                name: aIndex
            }
            tempList.push(temp);
            optionBox.current = tempList;
        } else {
            optionBox.current = tempList.filter((item) => item.key !== sIndex);
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: width * 0.35,
                width: width,
                height: height * 0.85, 
                backgroundColor: "#fff",
                borderRadius: width * 0.05, 
            }}
        >
            <MainTypeSelectedPage 
                iList={mList}
                iOptionBox={iList}
                fnSelected={(sIndex,aIndex,xIndex) => checkValue(sIndex,aIndex,xIndex)}
                fnNextToSubType={() => completeSelect()}
                sCancel={() => closeModal()}
            />
        </View>
    )
}

export const CompModalSubListTypePage = ({ fnCompleteSelect, mList, iList, fnCloseModal }) => {
    const subOptionBox = useRef(iList);

    const completeSelect = async () => {
        if(fnCompleteSelect !== undefined && typeof fnCompleteSelect === "function"){
            await fnCompleteSelect(subOptionBox.current);
        }
    }

    const closeModal = async () => {
        if(fnCloseModal !== undefined && typeof fnCloseModal === "function"){
            await fnCloseModal();
        }
    }

    const checkValue = async (sIndex,aIndex,xIndex) => {
        let tempList = subOptionBox.current;
        if(xIndex !== ""){
            let temp = {
                key: sIndex,
                name: aIndex
            }
            tempList.push(temp);
            subOptionBox.current = tempList;
        } else {
            subOptionBox.current = tempList.filter((item) => item.key !== sIndex);
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: width * 0.35,
                width: width,
                height: height * 0.85, 
                backgroundColor: "#fff",
                borderRadius: width * 0.05, 
            }}
        >
            <MainTypeSelectedPage 
                iList={mList}
                iOptionBox={iList}
                fnSelected={(sIndex,aIndex,xIndex) => checkValue(sIndex,aIndex,xIndex)}
                fnNextToSubType={() => completeSelect()}
                sCancel={() => closeModal()}
            />
        </View>
    )
}

export const CompModalStoreType = ({ fnCompleteSelect, iPlainOptions, iCafeOptions, iShopOptions }) => {
    const [state, setState] = useState("main");

    const [mList, setMList] = useState([]);
    const [sList, setSList] = useState([]);

    const [mainTypeNm, setMainTypeNm] = useState("");
    const [mainTypeNumber, setMainTypeNumber] = useState(0);
    const [subTypeNm, setSubTypeNm] = useState("");
    const [subTypeNumber, setSubTypeNumber] = useState(0);

    const optionBox = useRef([]);
    const subOptionBox = useRef([]);
    const typeBox = useRef([]);

    const closeModal = async () => {
        if(fnCompleteSelect !== undefined && typeof fnCompleteSelect === "function"){
            await fnCompleteSelect(mainTypeNm,mainTypeNumber,subTypeNm,subTypeNumber,optionBox.current,subOptionBox.current,"close");
        }
    }

    const backToMain = async () => {
        setMList([]);
        setState("main");
    }

    const backToSub = async () => {
        setSList([]);
        setState("sub");
    }

    const nextToSubType = async (sIndex) => {
        setState("sub");
    }

    const completeSelect = async () => {
        if(fnCompleteSelect !== undefined && typeof fnCompleteSelect === "function"){
            await fnCompleteSelect(mainTypeNm,mainTypeNumber,subTypeNm,subTypeNumber,optionBox.current,subOptionBox.current,"close");
        }
    }

    const selectedMainValue = async (sIndex,aIndex) => {
        setMainTypeNm(sIndex);
        setMainTypeNumber(aIndex);
        if(aIndex.toString() === "1"){
            setMList(iPlainOptions);
        } else if (aIndex.toString() === "2"){
            setMList(iCafeOptions);
        } else {
            setMList(iShopOptions);
        }
        if(fnCompleteSelect !== undefined && typeof fnCompleteSelect === "function"){
            await fnCompleteSelect(sIndex,aIndex,subTypeNm,subTypeNumber,optionBox.current,subOptionBox.current,"select");
        }
        setState("selectMain");
    }

    const selectedSubValue = async (sIndex,aIndex) => {
        setSubTypeNm(sIndex);
        setSubTypeNumber(aIndex);
        if(aIndex.toString() === "1"){
            setSList(iPlainOptions);
        } else if (aIndex.toString() === "2"){
            setSList(iCafeOptions);
        } else if (aIndex.toString() === "3"){
            setSList(iShopOptions);
        } else {
            if(fnCompleteSelect !== undefined && typeof fnCompleteSelect === "function"){
                await fnCompleteSelect(mainTypeNm,mainTypeNumber,sIndex,aIndex,optionBox.current,subOptionBox.current,"close");
            }
            return false;
        }
        if(fnCompleteSelect !== undefined && typeof fnCompleteSelect === "function"){
            await fnCompleteSelect(mainTypeNm,mainTypeNumber,sIndex,aIndex,optionBox.current,subOptionBox.current,"select");
        }
        setState("selectSub");
    }
    
    const checkValue = async (sIndex,aIndex,xIndex) => {
        let tempList = optionBox.current;
        if(xIndex !== ""){
            let temp = {
                key: sIndex,
                name: aIndex
            }
            tempList.push(temp);
            optionBox.current = tempList;
        } else {
            optionBox.current = tempList.filter((item) => item.key !== sIndex);
        }
        if(fnCompleteSelect !== undefined && typeof fnCompleteSelect === "function"){
            await fnCompleteSelect(mainTypeNm,mainTypeNumber,subTypeNm,subTypeNumber,optionBox.current,subOptionBox.current,"select");
        }
    }
    
    const checkSubValue = async (sIndex,aIndex,xIndex) => {
        let tempList = subOptionBox.current;
        if(xIndex !== ""){
            let temp = {
                key: sIndex,
                name: aIndex
            }
            tempList.push(temp);
            subOptionBox.current = tempList;
        } else {
            subOptionBox.current = tempList.filter((item) => item.key !== sIndex);
        }
        if(fnCompleteSelect !== undefined && typeof fnCompleteSelect === "function"){
            await fnCompleteSelect(mainTypeNm,mainTypeNumber,subTypeNm,subTypeNumber,optionBox.current,subOptionBox.current,"select");
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: width * 0.35,
                width: width,
                height: height * 0.85, 
                backgroundColor: "#fff",
                borderRadius: width * 0.05, 
            }}
        >
            {state === "main" &&
                <MainTypePage 
                    sNext={(sIndex,aIndex) => selectedMainValue(sIndex,aIndex)}
                    sCancel={() => closeModal()}
                />
            }
            {state === "selectMain" &&
                <MainTypeSelectPage 
                    iStep={"total"}
                    iList={mList}
                    fnSelected={(sIndex,aIndex,xIndex) => checkValue(sIndex,aIndex,xIndex)}
                    fnNextToSubType={() => nextToSubType()}
                    sCancel={() => backToMain()}
                />
            }
            {state === "sub" &&
                <SubTypePage
                    sMainType={mainTypeNumber}
                    sCancel={() => closeModal()}
                    sNext={(sIndex,aIndex) => selectedSubValue(sIndex,aIndex)}
                />
            }
            {state === "selectSub" &&
                <SubTypeSelectPage 
                    iList={sList}
                    fnSelected={(sIndex,aIndex,xIndex) => checkSubValue(sIndex,aIndex,xIndex)}
                    fnNextToSubType={() => completeSelect()}
                    sCancel={() => backToSub()}
                />
            }
        </View>
    )
}

export const CompModalOrderTimeList = ({ fnCompleteSelect, sList, sType, iSelected }) => {
    const [selectValue, setSelectValue] = useState(iSelected);
    const [selectName, setSelectName] = useState("");
    
    const completeSelect = async () => {
        if(fnCompleteSelect !== undefined && typeof fnCompleteSelect === "function"){
            await fnCompleteSelect(selectValue,selectName,sType);
        }
    }
    
    const selectOrderTime = async (sIndex) => {
        setSelectValue(sIndex.value);
        setSelectName(sIndex.name);
    }

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: width * 0.35,
                width: width,
                height: height * 0.85, 
                backgroundColor: "#fff",
                borderRadius: width * 0.05, 
            }}
        >
            <View style={{flex: 1, padding: "7%"}}>
                <View style={{height: height * 0.1, backgroundColor: "#fff"}}>
                    {sType === "easy" &&
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(2.4), color: "#191F28" }}>매장이 여유로울 때</Text>
                    }
                    {sType === "normal" &&
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(2.4), color: "#191F28" }}>매장이 보통일 때</Text>
                    }
                    {sType === "busy" &&
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(2.4), color: "#191F28" }}>매장이 바쁠 때</Text>
                    }
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2.4), color: "#191F28" }}>음식준비에 걸리는 시간을 선택해주세요</Text>
                </View>
                <FlatList
                    data={sList}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(data, index) => "list-" + index + Math.random()}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={{height: height * 0.03}}/>
                        )
                    }}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                onPress={() => selectOrderTime(item)}
                                style={{
                                    height: height * 0.08,
                                    backgroundColor: "#fff",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    borderWidth: 1,
                                    borderColor: selectValue == item.value ? "#6490E7" : "#E5E7EA",
                                    borderRadius: 10,
                                    paddingLeft: "5%"
                                }}
                            >
                                {selectValue == item.value ?
                                    <ComponentSelectedCircle iHeight={height * 0.025} iWidth={height * 0.025} iColor={"#646970"}/>
                                :
                                    <ComponentSelectCircle iHeight={height * 0.025} iWidth={height * 0.025} iColor={"#646970"}/>
                                }
                                <Text style={{fontSize: RFPercentage(1.8), fontWeight: '500', color: "#4E5867", marginLeft: "5%"}}>{item.name}</Text>
                            </TouchableOpacity>
                        ) 
                    }}
                />
                 <View style={{height: height * 0.12, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                    <TouchableOpacity onPress={completeSelect} style={{height: height * 0.07, backgroundColor: "#6490E7", width: "100%", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontSize: RFPercentage(1.9), fontWeight: '600', color: "#fff"}}>완료</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export const CompModalPickUpList = ({ fnCompleteSelect, sList, sType }) => {
    const [selectValue, setSelectValue] = useState(1);
    const [selectName, setSelectName] = useState("");
    
    const selectOrderTime = async (sIndex) => {
        setSelectValue(sIndex.value);
        setSelectName(sIndex.name);
        if(fnCompleteSelect !== undefined && typeof fnCompleteSelect === "function"){
            await fnCompleteSelect(sIndex.value,sIndex.name,sType);
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: width * 0.65,
                width: width,
                height: height * 0.7, 
                backgroundColor: "#f0f6fc",
                borderRadius: width * 0.05, 
            }}
        >
            <View style={{flex: 1, padding: "7%"}}>
                <FlatList
                    data={sList}
                    ListHeaderComponent={<View style={{ height: height * 0.05 }} />}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(data, index) => "list-" + index + Math.random()}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={{height: height * 0.03}}/>
                        )
                    }}
                    ListFooterComponent={() => {
                        return (
                            <View style={{height: height * 0.1}}/>
                        )
                    }}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity onPress={() => selectOrderTime(item)} style={{height: height * 0.08, backgroundColor: "#fff", width: "100%", borderRadius: 10, flexDirection: "row"}}>
                                <View style={{flex: 0.7, justifyContent: "center", paddingLeft: "5%"}}>
                                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '600', color: "#000" }}>{item.name}</Text>
                                </View>
                                <View style={{flex: 0.3, justifyContent: "center", alignItems: "center", marginRight: "5%"}}>
                                    <View style={{height: width * 0.07, width: width * 0.07,  justifyContent: "center", alignItems: "center"}}>
                                        {item.name === selectName ?
                                            <ComponentCheckCircle iHeight={height * 0.03} iWidth={width * 0.08} iColor={"#6490E8"}/>
                                            :
                                            <ComponentCircle iHeight={height * 0.03} iWidth={width * 0.08} iColor={"#6490E8"}/>
                                        }
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ) 
                    }}
                />
            </View>
        </View>
    )
}


export const CompModalPickUpZone = ({ fnCancelPage, fnGetData, sUserLat, sUserLng, sAnglePoint }) => {
    const [state, setstate] = useState(false);
    const [isLoad, setLoad] = useState(true);

    const sUri = useRef(null);
    const newUserLat = useRef(parseFloat(37.56637919891677));
    const newUserLng = useRef(parseFloat(126.97914589375286));
    const anglePoint = useRef({
        pan: 0,
        tilt: 0,
        zoom: 0
    });

    const cancelPage = async () => {
        if(fnCancelPage !== undefined && typeof fnCancelPage === "function"){
            await fnCancelPage();
        }
    }

    const getData = async () => {
        if(fnGetData !== undefined && typeof fnGetData === "function"){
            await fnGetData(newUserLat.current,newUserLng.current,anglePoint.current);
        }
    }

    const handleOnMessage = ({ nativeEvent: { data } }) => {
        let temp = JSON.parse(data);
        if(temp.latLng !== undefined && temp.latLng !== null){
            const sData = temp.latLng;
            newUserLat.current = sData.Ma;
            newUserLng.current = sData.La;
        }
        if(temp.viewpoint !== undefined && temp.viewpoint !== null){
            anglePoint.current = temp.viewpoint
        }
    };

    useEffect(() => {
        if(sUserLat !== undefined && sUserLat !== null && sUserLng !== undefined && sUserLng !== null && sAnglePoint !== undefined && sAnglePoint !== null){
            newUserLat.current = sUserLat;
            newUserLng.current = sUserLng;
            anglePoint.current = sAnglePoint;
            sUri.current = "https://ceo.throo.co.kr/selfmanage/app/sales?=" + parseFloat(sUserLat) + "?@=" + parseFloat(sUserLng) + "?@=" + parseFloat(sAnglePoint.pan) + "?@=" + parseFloat(sAnglePoint.tilt) + "?@=" + parseFloat(sAnglePoint.zoom)
            setstate(true);
        }
    }, [sUserLat, sUserLng, sAnglePoint]);

    return (
        <View 
            style={{
                marginHorizontal: "-5.5%",
                width: width,
                height: height, 
                backgroundColor: "#fff",
            }}
        >
            <View style={{flex: 1, padding: "2%", ...ifIphoneX ({ paddingTop: 50})}}>
                <View style={{height: height * 0.06, justifyContent: "center", alignItems: "center", borderBottomWidth: 1, marginBottom: "5%", borderBottomColor: "#bbb"}}>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#000" }}>픽업존 위치 설정</Text>
                </View>
                <View style={{height: height * 0.06, backgroundColor: "#f0f6fc", justifyContent: "center", marginBottom: "5%"}}>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(1.5), color: "#6b7684", textAlign: "left", marginLeft: "3%", marginRight: "2%" }}>
                        ※ 고객이 쉽게 픽업존을 알 수 있도록 
                        <Text style={{fontWeight: "800", fontSize: RFPercentage(1.5), color: "#6490E8", textAlign: "left", marginLeft: "3%", marginRight: "2%" }}>
                            ' 각도 '
                        </Text>
                         를 설정해주세요
                    </Text>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(1.5), color: "#6b7684", textAlign: "left", marginLeft: "3%", marginRight: "2%" }}>
                        ※ 설정시
                        <Text style={{fontWeight: "800", fontSize: RFPercentage(1.5), color: "#6490E8", textAlign: "left", marginLeft: "3%", marginRight: "2%" }}>
                            ' 로드뷰 '
                        </Text>
                        로 픽업존 위치가 노출됩니다.
                    </Text>
                </View>
                {state &&
                    <>
                    {isLoad &&
                        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                            <LottieView style={{width: width * 0.5, height: width * 0.5 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                        </View>
                    }
                    <WebView
                        onMessage={handleOnMessage}
                        originWhitelist={['*']}
                        cacheEnabled={false}
                        source={{ uri: sUri.current}}
                        onLoadEnd={() => setLoad(false)}
                    />
                    </>
                }
            </View>
            <View style={{height : height * 0.1, justifyContent: "center", alignItems: "center"}}>
                <View style={{width: "85%", height: "60%", flexDirection: "row", marginBottom: "3%"}}>
                    <TouchableOpacity onPress={cancelPage} activeOpacity={0.8} style={{width: "47.5%", height: "100%", borderColor: "#F45552", marginRight: "5%", borderWidth: 1, borderRadius: 10, justifyContent: "center", alignItems: "center", backgroundColor: "#fff"}}>
                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#F45552" }}>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={getData} style={{width: "47.5%", height: "100%", backgroundColor: "#6490E8", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>완료</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export const CompModalList = ({ sType, fnSelectValue }) => {
    const [sList, setList] = useState([]);

    const selectValue = async (sIndex) => {
        if(fnSelectValue !== undefined && typeof fnSelectValue === "function"){
            await fnSelectValue(sIndex.name,sIndex.value,sType);
        }
    }

    useEffect(() => {
        if(sType !== undefined){
            if(sType === "sDayData"){
                setList(dayList);
            } else if (sType === "sEachDayData") {
                setList(eachDayList);
            } else if (sType === "sCongestionData") {
                setList(congestionList);
            }
        }
    }, [sType]);

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: width * 0.7,
                width: width,
                height: width * 1.5, 
                backgroundColor: "#f0f6fc",
                borderRadius: width * 0.05, 
            }}
        >
            <View style={{padding: "7%"}}>
                <FlatList
                    data={sList}
                    ListFooterComponent={<View style={{ height: width * 0.6 }} />}
                    ListHeaderComponent={<View style={{ height: height * 0.01 }} />}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(data, index) => "list-" + index + Math.random()}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={{height: height * 0.03}}/>
                        )
                    }}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity onPress={() => selectValue(item)} style={{height: height * 0.08, backgroundColor: "#fff", width: "100%", borderRadius: 10, flexDirection: "row"}}>
                                <View style={{flex: 0.7, justifyContent: "center", paddingLeft: "5%"}}>
                                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '600', color: "#000" }}>{item.name}</Text>
                                </View>
                                <View style={{flex: 0.3, justifyContent: "center", alignItems: "center", marginRight: "5%"}}>
                                    <View style={{height: width * 0.07, width: width * 0.07,  justifyContent: "center", alignItems: "center"}}>
                                        <ComponentCircle iHeight={height * 0.03} iWidth={width * 0.08} iColor={"#6490E8"}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ) 
                    }}
                />
            </View>
        </View>
    )
}

export const CompOperationTime = ({ fnClose, fnInsert, bAlert }) => {
    const [sType, setType] = useState("");

    const [iFocus, setFocus] = useState(false);
    const [sAlert] = useState(bAlert);
    const [iAlert, setIAlert] = useState(false);

    const [iMonday, setMonday] = useState(false);
    const [iTuesday, setTuesday] = useState(false);
    const [iWednesday, setWednesday] = useState(false);
    const [iThursday, setThursday] = useState(false);
    const [iFriday, setFriday] = useState(false);
    const [iSaturday, setSaturday] = useState(false);
    const [iSunday, setSunday] = useState(false);

    const [sEachDayValue] = useState(7);
    const [sEachDayData] = useState("매일");

    const [sStoreTime, setStoreTime] = useState("");
    const [startHour, setStartHour] = useState("");
    const [startMin, setStartMin] = useState("");
    const [endHour, setEndHour] = useState("");
    const [endMin, setEndMin] = useState("");

    const [sCongestionValue, setCongestionValue] = useState(0);
    const [sCongestionData, setCongestionData] = useState("여유");

    const [fDatePickerVisible, setFDatePickerVisibility] = useState(false);
    const [tDatePickerVisible, setTDatePickerVisibility] = useState(false);
    
    const typeBox = useRef([]);

    const selectDayValue = (sIndex,aIndex) => {
        let xIndex = "add";
        let tempList = typeBox.current;
        if(parseInt(aIndex) < 1){
            if(iSunday){
                xIndex = "";
            }
            setSunday(!iSunday);
        } else if (parseInt(aIndex) < 2 && parseInt(aIndex) > 0) {
            if(iMonday){
                xIndex = "";
            }
            setMonday(!iMonday);
        } else if (parseInt(aIndex) < 3 && parseInt(aIndex) > 1) {
            if(iTuesday){
                xIndex = "";
            }
            setTuesday(!iTuesday);
        } else if (parseInt(aIndex) < 4 && parseInt(aIndex) > 2) {
            if(iWednesday){
                xIndex = "";
            }
            setWednesday(!iWednesday);
        } else if (parseInt(aIndex) < 5 && parseInt(aIndex) > 3) {
            if(iThursday){
                xIndex = "";
            }
            setThursday(!iThursday);
        } else if (parseInt(aIndex) < 6 && parseInt(aIndex) > 4) {
            if(iFriday){
                xIndex = "";
            }
            setFriday(!iFriday);
        } else if (parseInt(aIndex) < 7 && parseInt(aIndex) > 5) {
            if(iSaturday){
                xIndex = "";
            }
            setSaturday(!iSaturday);
        }
        
        if(xIndex !== ""){
            let temp = {
                sDayValue: aIndex,
                sDayData: sIndex
            }
            tempList.push(temp);
            typeBox.current = tempList;
        } else {
            typeBox.current = tempList.filter((item) => item.sDayValue !== aIndex);
        }
    }

    const handleFromConfirm = (date) => {
        setStartHour(moment(date).format("HH"));
        setStartMin(moment(date).format("mm"));
        if(endHour !== "" && endMin !== ""){
            let temp = moment(date).format("HH") + "시" + moment(date).format("mm") + "분" + "~" + endHour + "시" + endMin + "분";
            setStoreTime(temp);
        }
        hideFromDatePicker();
    };

    const hideToDatePicker = () => {
        setTDatePickerVisibility(false);
    };

    const handleToConfirm = (date) => {
        setEndHour(moment(date).format("HH"));
        setEndMin(moment(date).format("mm"));
        if(startHour !== "" && startMin !== ""){
            let temp = startHour + "시" + startMin + "분" + "~" + moment(date).format("HH") + "시" + moment(date).format("mm") + "분";
            setStoreTime(temp);
        }
        hideToDatePicker();
    };

    const hideFromDatePicker = () => {
        setFDatePickerVisibility(false);
    };

    const selectCongestionValue = (sIndex,aIndex) => {
        setCongestionValue(sIndex);
        setCongestionData(aIndex);
    }

    const checkUpInsert = async () => {
        if(fnInsert !== undefined && typeof fnInsert === "function"){
            let iStep = false;
            let oData = {};
            let iType = "";
            let dataList = typeBox.current;
            let iList = [];

            if(startHour !== "" && startMin !== "" && endHour !== "" && endMin !== ""){
                iStep = true;
            }

            if(sType === "date"){
                if(dataList.length > 0){
                    for await (const iterator of dataList) {
                        let temp = {
                            sType,
                            sStoreTime,
                            sDayValue: iterator.sDayValue,
                            sDayData: iterator.sDayData,
                            sEachDayValue,
                            sEachDayData,
                            startHour,
                            startMin,
                            endHour,
                            endMin,
                            sCongestionData,
                            sCongestionValue
                        }
                        iList.push(temp);
                    }
                    iType = "both";
                } else {
                    iStep = false;
                }
            } else {
                oData = {
                    sType,
                    sStoreTime,
                    sDayValue: 1,
                    sDayData: "월",
                    sEachDayValue,
                    sEachDayData,
                    startHour,
                    startMin,
                    endHour,
                    endMin,
                    sCongestionData,
                    sCongestionValue
                }
            }

            if(iStep){
                await fnInsert(oData,iType,iList);
            }
        }
    }

    const close = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
    }

    return (
        <>
        {iAlert ?
            <View 
                style={{
                    marginHorizontal: "0%",
                    marginTop: width * 0.1,
                    width: width * 0.9,
                    height: height * 0.28, 
                    backgroundColor: "#fff",
                    borderRadius: width * 0.02, 
                }}
            >
                <View style={{height: height * 0.02, justifyContent: "center", alignItems: "center"}} />
                <View style={{height: height * 0.07, justifyContent: "center", marginLeft: "5%"}}>
                    <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#333D4B"}}>메뉴 준비시간 안내</Text>
                </View>
                <View style={{height: height * 0.1, justifyContent: "flex-start", alignItems: "center", marginLeft: "5%", marginRight: "5%"}}>
                    <Text style={{fontSize: RFPercentage(1.7), fontWeight: '500', color: "#4E5867"}}>
                        매장의 바쁜 정도에따라 상품준비시간을 미리 설정할 수 있어요.  너무 바뻐서 차까지 전달이 어려운 시간대는 워크스루만 가능으로 선택하시면, 해당 시간에는 고객에게 워크스루만 가능 매장으로 표시됩니다.
                    </Text>
                </View>
                <View style={{height: height * 0.09, justifyContent: "flex-start", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => setIAlert(false)} style={{height: "70%", width: "90%", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#E1E2E3", borderRadius: 10}}>
                        <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#4E5867"}}>확인</Text>
                    </TouchableOpacity>
                </View>
            </View>
        :
            <View 
                style={{
                    marginHorizontal: "-5%",
                    marginTop: height * 0.1,
                    width: width,
                    height: height * 0.9, 
                    backgroundColor: "#fff",
                    borderTopRightRadius: width * 0.03, 
                    borderTopLeftRadius: width * 0.03
                }}
            >
                <View style={{ flex:1 }}>
                    <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", marginLeft: "5%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>영업시간 설정</Text>
                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.6), color: "#95959E" }}>BREAK TIME은 빼고 주문 가능한 시간만 설정해주세요.</Text>
                        <TouchableOpacity onPress={close} activeOpacity={0.8} style={{ height: "50%", width: "10%", justifyContent: "center", alignItems: "flex-start", position: "absolute", zIndex: 90, top: "20%", right: "5%"}}>
                            <ComponentDelete iHeight={height * 0.025} iWidth={width * 0.05} iColor={"#646970"}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{height: height * 0.08, backgroundColor: "#fff", justifyContent: "center", alignItems: "flex-start", flexDirection: "row"}}>
                        <TouchableOpacity onPress={() => setType("")} style={{height: height * 0.06, backgroundColor: sType !== "date" ? "#F3F7FF" : "#fff", width: "42%", marginRight: "5%", marginTop: "1%", borderRadius: 10, borderWidth: 1, borderColor: sType !== "date" ? "#6490E7" : "#EFF0F6" , justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: sType !== "date" ? "#6490E7" : "#B0B7C1" }}>매일 같아요</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setType("date")} style={{height: height * 0.06, backgroundColor: sType === "date" ? "#F3F7FF" : "#fff", width: "42%", marginTop: "1%", borderRadius: 10, borderWidth: 1, borderColor: sType === "date" ? "#6490E7" : "#EFF0F6", justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: sType === "date" ? "#6490E7" : "#B0B7C1" }}>요일별로 달라요</Text>
                        </TouchableOpacity>
                    </View>
                    {(sType === "date" && !iFocus) &&
                        <TouchableOpacity onPress={() => setFocus(true)} style={{position: "absolute", zIndex: 10, top: height * 0.17, left: "13%", height: height * 0.04, width: width * 0.8, backgroundColor: "#6490E7", borderRadius: width * 0.05, justifyContent: "space-between", alignItems: "center", flexDirection: "row", paddingLeft: "15%"}}>
                            <Text style={{fontSize: RFPercentage(1.5), fontWeight: '400', color: "#fff"}}>동일한 시간으로 운영되는 요일을 선택해 주세요!</Text>
                            <ComponentDelete iHeight={height * 0.02} iWidth={width * 0.08} iColor={"#fff"}/>
                            <View style={{position: "absolute", zIndex: 2, top: height * 0.02, left: "10%", height: height * 0.025, width: height * 0.025, backgroundColor: "#6490E7", transform: [{ rotateZ: '0.785398rad' }]}} />
                        </TouchableOpacity>
                    }
                    {sType === "date" &&
                        <View style={{height: height * 0.09, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                            <TouchableOpacity onPress={() => selectDayValue("월요일",1)} style={{height: height * 0.06, backgroundColor: !iMonday ? "#FAFAFB" : "#F3F7FF", borderWidth: 1, borderColor: !iMonday ? "#EFF0F6" : "#6490E7", width: "10%", borderRadius: width * 0.05, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(2), color: !iMonday ? "#6B7583" : "#6490E7" }}>월</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => selectDayValue("화요일",2)} style={{height: height * 0.06, backgroundColor: !iTuesday ? "#FAFAFB" : "#F3F7FF", borderWidth: 1, borderColor: !iTuesday ? "#EFF0F6" : "#6490E7", width: "10%", borderRadius: width * 0.05, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(2), color: !iTuesday ? "#6B7583" : "#6490E7" }}>화</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => selectDayValue("수요일",3)} style={{height: height * 0.06, backgroundColor: !iWednesday ? "#FAFAFB" : "#F3F7FF", borderWidth: 1, borderColor: !iWednesday ? "#EFF0F6" : "#6490E7", width: "10%", borderRadius: width * 0.05, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(2), color: !iWednesday ? "#6B7583" : "#6490E7" }}>수</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => selectDayValue("목요일",4)} style={{height: height * 0.06, backgroundColor: !iThursday ? "#FAFAFB" : "#F3F7FF", borderWidth: 1, borderColor: !iThursday ? "#EFF0F6" : "#6490E7", width: "10%", borderRadius: width * 0.05, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(2), color: !iThursday ? "#6B7583" : "#6490E7" }}>목</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => selectDayValue("금요일",5)} style={{height: height * 0.06, backgroundColor: !iFriday ? "#FAFAFB" : "#F3F7FF", borderWidth: 1, borderColor: !iFriday ? "#EFF0F6" : "#6490E7", width: "10%", borderRadius: width * 0.05, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(2), color: !iFriday ? "#6B7583" : "#6490E7" }}>금</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => selectDayValue("토요일",6)} style={{height: height * 0.06, backgroundColor: !iSaturday ? "#FAFAFB" : "#F3F7FF", borderWidth: 1, borderColor: !iSaturday ? "#EFF0F6" : "#6490E7", width: "10%", borderRadius: width * 0.05, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(2), color: !iSaturday ? "#6B7583" : "#6490E7" }}>토</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => selectDayValue("일요일",0)} style={{height: height * 0.06, backgroundColor: !iSunday ? "#FAFAFB" : "#F3F7FF", borderWidth: 1, borderColor: !iSunday ? "#EFF0F6" : "#6490E7", width: "10%", borderRadius: width * 0.05, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(2), color: !iSunday ? "#6B7583" : "#6490E7" }}>일</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    <View style={{height: height * 0.1, backgroundColor: "#fff", flexDirection: "row", alignItems: "center"}}>
                        <DateTimePickerModal
                            isVisible={fDatePickerVisible}
                            mode="time"
                            locale="ko-Kore_KR"
                            confirmTextIOS="확인"
                            cancelTextIOS="취소"
                            onConfirm={handleFromConfirm}
                            onCancel={hideFromDatePicker}
                        />
                        <DateTimePickerModal
                            isVisible={tDatePickerVisible}
                            mode="time"
                            locale="ko-Kore_KR"
                            confirmTextIOS="확인"
                            cancelTextIOS="취소"
                            onConfirm={handleToConfirm}
                            onCancel={hideToDatePicker}
                        />
                        <View style={{height: height * 0.06, backgroundColor: "#fff", width: "25%", justifyContent: "center", alignItems: "flex-start", paddingLeft: "5%"}}>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.7), color: "#3B3B46" }}>영업시간</Text>
                        </View>
                        <TouchableOpacity onPress={() => setFDatePickerVisibility(true)} style={{height: height * 0.06, backgroundColor: "#FAFAFB", width: "30%", borderRadius: 5, borderWidth: 1, borderColor: "#EFF0F6", justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#3B3B46", lineHeight: RFPercentage(2.4) }}>{(startHour !== "" && startMin !== "" ? startHour + "시" + startMin + "분": "00시00분")}</Text>
                        </TouchableOpacity>
                        <View style={{height: height * 0.06, backgroundColor: "#fff", width: "10%", justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.7), color: "#3B3B46" }}>~</Text>
                        </View>
                        <TouchableOpacity onPress={() => setTDatePickerVisibility(true)} style={{height: height * 0.06, backgroundColor: "#FAFAFB", width: "30%", borderRadius: 5, borderWidth: 1, borderColor: "#EFF0F6", justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#3B3B46", lineHeight: RFPercentage(2.4) }}>{(endHour !== "" && endMin !== "" ? endHour + "시" + endMin + "분": "00시00분")}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{height: height * 0.17}}>
                        <TouchableOpacity onPress={() => setIAlert(true)} style={{height: height * 0.06, backgroundColor: "#fff", width: "35%", alignItems: "center", justifyContent: "flex-start", paddingLeft: "5%", flexDirection: "row"}}>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.7), color: "#3B3B46", marginRight: "2%" }}>메뉴 준비시간</Text>
                            <ComponentQuestionMark iHeight={height * 0.017} iWidth={height * 0.017} />
                        </TouchableOpacity>
                        {!sAlert ?
                            <View style={{ height: height * 0.11, marginLeft: "5%", marginRight: "5%", backgroundColor: "#FAFAFB"}}>
                                <View style={{height: height * 0.07, alignItems: "flex-start", justifyContent: "center", flexDirection: "row"}}>
                                    <TouchableOpacity onPress={() => selectCongestionValue(0, "여유")} style={{height: height * 0.055, width: "31%", backgroundColor: sCongestionValue.toString() === "0" ? "#F3F7FF" : "#FAFAFB", borderWidth: 1, borderColor: sCongestionValue.toString() === "0" ? "#6490E7" : "#EFF0F6", borderRadius: width * 0.01, justifyContent: "center", alignItems: "center", marginRight: "3%"}}>
                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: sCongestionValue.toString() === "0" ? "#6490E7" : "#6B7583" }}>여유</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => selectCongestionValue(1, "보통")} style={{height: height * 0.055, width: "31%", backgroundColor: sCongestionValue.toString() === "1" ? "#F3F7FF" : "#FAFAFB", borderWidth: 1, borderColor: sCongestionValue.toString() === "1" ? "#6490E7" : "#EFF0F6", borderRadius: width * 0.01, justifyContent: "center", alignItems: "center", marginRight: "3%"}}>
                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: sCongestionValue.toString() === "1" ? "#6490E7" : "#6B7583" }}>보통</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => selectCongestionValue(2, "바쁨")} style={{height: height * 0.055, width: "31%", backgroundColor: sCongestionValue.toString() === "2" ? "#F3F7FF" : "#FAFAFB", borderWidth: 1, borderColor: sCongestionValue.toString() === "2" ? "#6490E7" : "#EFF0F6", borderRadius: width * 0.01, justifyContent: "center", alignItems: "center"}}>
                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: sCongestionValue.toString() === "2" ? "#6490E7" : "#6B7583" }}>바쁨</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        :
                            <View style={{ height: height * 0.11, flexDirection: "row", marginLeft: "5%", marginRight: "5%", backgroundColor: "#FAFAFB", borderWidth: 1, borderColor: "#6490E7", borderRadius: width * 0.01}}>
                                <View style={{height: height * 0.11, width: "65%"}}>
                                    <View style={{height: height * 0.04, justifyContent: "center", alignItems: "center"}}>
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.5), color: "#6490E7" }}>드라이브스루 + 워크스루</Text>
                                    </View>
                                    <View style={{height: height * 0.07, alignItems: "flex-start", justifyContent: "center", flexDirection: "row"}}>
                                        <TouchableOpacity onPress={() => selectCongestionValue(0, "여유")} style={{height: height * 0.055, width: "30%", backgroundColor: sCongestionValue.toString() === "0" ? "#F3F7FF" : "#FAFAFB", borderWidth: 1, borderColor: sCongestionValue.toString() === "0" ? "#6490E7" : "#EFF0F6", borderRadius: width * 0.01, justifyContent: "center", alignItems: "center", marginRight: "3%"}}>
                                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: sCongestionValue.toString() === "0" ? "#6490E7" : "#6B7583" }}>여유</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => selectCongestionValue(1, "보통")} style={{height: height * 0.055, width: "30%", backgroundColor: sCongestionValue.toString() === "1" ? "#F3F7FF" : "#FAFAFB", borderWidth: 1, borderColor: sCongestionValue.toString() === "1" ? "#6490E7" : "#EFF0F6", borderRadius: width * 0.01, justifyContent: "center", alignItems: "center", marginRight: "3%"}}>
                                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: sCongestionValue.toString() === "1" ? "#6490E7" : "#6B7583" }}>보통</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => selectCongestionValue(2, "바쁨")} style={{height: height * 0.055, width: "30%", backgroundColor: sCongestionValue.toString() === "2" ? "#F3F7FF" : "#FAFAFB", borderWidth: 1, borderColor: sCongestionValue.toString() === "2" ? "#6490E7" : "#EFF0F6", borderRadius: width * 0.01, justifyContent: "center", alignItems: "center"}}>
                                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: sCongestionValue.toString() === "2" ? "#6490E7" : "#6B7583" }}>바쁨</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{height: height * 0.11, width: "35%", borderLeftWidth: 1, borderLeftColor: "#6490E7"}}>
                                    <View style={{height: height * 0.04, justifyContent: "center", alignItems: "center"}}>
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.5), color: "#6490E7" }}>워크스루만 가능</Text>
                                    </View>
                                    <View style={{height: height * 0.07, justifyContent: "flex-start", alignItems: "center"}}>
                                        <TouchableOpacity onPress={() => selectCongestionValue(3, "워크스루")} style={{height: height * 0.055, width: "90%", backgroundColor: sCongestionValue.toString() === "3" ? "#F3F7FF" : "#FAFAFB", borderWidth: 1, borderColor: sCongestionValue.toString() === "3" ? "#6490E7" : "#EFF0F6", borderRadius: width * 0.01, justifyContent: "center", alignItems: "center"}}>
                                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: sCongestionValue.toString() === "3" ? "#6490E7" : "#6B7583" }}>워크스루</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        }
                    </View>
                </View>
                <View style={{height: height * 0.14, justifyContent: "flex-start", alignItems: "flex-end", paddingTop: "5%", paddingRight: "5%"}}>
                    <TouchableOpacity onPress={() => checkUpInsert()} style={{height: height / 14, width: width * 0.9, backgroundColor: "#6490E7", justifyContent: "center", alignItems: "center", borderRadius: width * 0.02}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#fff" }}>완료</Text>
                    </TouchableOpacity>
                </View>
            </View>
        }
        </>
    )
}

export const CompModalTimeList = ({ fnSelectValue }) => {
    const [state, setstate] = useState("step1");

    const [startHour, setStartHour] = useState('00');
    const [startHourNm, setStartHourNm] = useState('00시');
    const [startMin, setStartMin] = useState('00');
    const [startMinNm, setStartMinNm] = useState('00분');

    const [endHour, setEndHour] = useState("01");
    const [endHourNm, setEndHourNm] = useState("01시");
    const [endHourList, setEndHourList] = useState([]);

    const nextStep = (sIndex,aIndex,xIndex,nIndex,dIndex,fIndex,gIndex) => {
        setStartHour(sIndex);
        setStartHourNm(aIndex);
        setStartMin(xIndex);
        setStartMinNm(nIndex);
        setEndHour(dIndex);
        setEndHourNm(fIndex);
        setEndHourList(gIndex);
        setstate("step2");
    }

    const selectedTime = async (sIndex,aIndex,xIndex,nIndex) => {
        const timeText =  startHourNm + startMinNm + "~" + aIndex + nIndex;
        if(fnSelectValue !== undefined && typeof fnSelectValue === "function"){
            await fnSelectValue(startHour,startMin,sIndex,xIndex,timeText);
        }
    }

    const returnStep = () => {
        setstate("step1");
    }

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: height * 0.1,
                width: width,
                height: height * 0.9, 
                backgroundColor: "#fff",
                borderRadius: width * 0.05, 
            }}
        >
            {state === "step1" &&
                <CompModalTimeListStep1 
                    sValue={{startHour,startHourNm,startMin,startMinNm}}
                    fnNextValue={(sIndex,aIndex,xIndex,nIndex,dIndex,fIndex,gIndex) => nextStep(sIndex,aIndex,xIndex,nIndex,dIndex,fIndex,gIndex)}
                />
            }
            {state === "step2" &&
                <CompModalTimeListStep2
                    sEndHour={endHour}
                    sEndHourNm={endHourNm}
                    sEndHourList={endHourList}
                    fnReturn={() => returnStep()}
                    fnNextValue={(sIndex,aIndex,xIndex,nIndex) => selectedTime(sIndex,aIndex,xIndex,nIndex)}
                />
            }
        </View>
    )
}

export const CompDateModal = ({sDate,fnOnChangeDate,sType}) => {
    const [state, setstate] = useState({});

    const sendingDate = async (xIndex) => {
        if(fnOnChangeDate !== undefined && typeof fnOnChangeDate === "function"){
            await fnOnChangeDate(xIndex,sType);
        }
    }

    const selectDay = async (day) => {
        if(day !== undefined && day !== null){
            if(day.dateString !== undefined && day.dateString !== null){
                sendingDate(day.dateString.toString());
            }
        }
    }

    useEffect(() => {
        let temp = [];
        for (let index = 0; index < 1 ; index++) {
            temp.push(sDate);
        }
        let obj = temp.reduce( (c, v) => Object.assign(c, { [v]: { selected: true,  selectedColor: '#617BE3' }, }), {}, ); 
        setstate(obj);
    }, []);

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: width * 1.2,
                width: width,
                height: width * 1.2, 
                backgroundColor: "#fff",
                borderTopRightRadius: width * 0.05, 
                borderTopLeftRadius: width * 0.05
            }}
        >
            <View style={{flex: 1}}>
                <View style={{height: width * 0.1, backgroundColor: "#fff", width, paddingTop: width * 0.1, borderTopRightRadius: width * 0.05, borderTopLeftRadius: width * 0.05}} />
                <Calendar
                    style={{width: width, height: width * 0.5}}
                    markedDates={state}
                    current={moment().format("YYYY-MM-DD")}
                    minDate={'2021-09-29'}
                    maxDate={'2021-12-31'}
                    onDayPress={(day) => selectDay(day)}
                    horizontal={true}
                    monthFormat={'yyyy MM'}
                    hideArrows={false}
                    hideExtraDays={false}
                    disableMonthChange={false}
                    firstDay={1}
                    hideDayNames={false}
                    disableArrowLeft={false}
                    disableArrowRight={false}
                    disableAllTouchEventsForDisabledDays={false}
                />
            </View>
        </View>
    )
}

export const CompWeekModal = ({ fnChangeMethodValue, fnChangeDayValue, sList, sType }) => {
    const selectValue = async (sIndex) => {
        if(sType === "week"){
            if(fnChangeMethodValue !== undefined && typeof fnChangeMethodValue === "function"){
                await fnChangeMethodValue(sIndex);
            }
        } else {
            if(fnChangeDayValue !== undefined && typeof fnChangeDayValue === "function"){
                await fnChangeDayValue(sIndex);
            }
        }
    }

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: width * 0.7,
                width: width,
                height: width * 1.5, 
                backgroundColor: "#f0f6fc",
                borderRadius: width * 0.05, 
            }}
        >
            <View style={{padding: "7%"}}>
                <FlatList
                    data={sList}
                    ListFooterComponent={<View style={{ height: width * 0.6 }} />}
                    ListHeaderComponent={<View style={{ height: height * 0.01 }} />}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(data, index) => "list-" + index + Math.random()}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={{height: height * 0.03}}/>
                        )
                    }}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity onPress={() => selectValue(item)} style={{height: height * 0.08, backgroundColor: "#fff", width: "100%", borderRadius: 10, flexDirection: "row"}}>
                                <View style={{flex: 0.7, justifyContent: "center", paddingLeft: "5%"}}>
                                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '600', color: "#000" }}>{item.name}</Text>
                                </View>
                                <View style={{flex: 0.3, justifyContent: "center", alignItems: "center", marginRight: "5%"}}>
                                    <View style={{height: width * 0.07, width: width * 0.07,  justifyContent: "center", alignItems: "center"}}>
                                        <ComponentCircle iHeight={height * 0.03} iWidth={width * 0.08} iColor={"#6490E8"}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ) 
                    }}
                />
            </View>
        </View>
    )
}

export const CompModalEventBanner = ({ fnClose }) => {

    const loadInBrowser = async () => {
        if(fnClose !== undefined && typeof fnClose === "function"){
            await fnClose();
        }
        Linking.openURL("https://ceo.throo.co.kr/promotion").catch(err => console.error("Couldn't load page", err));
    };

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: height * 0.3,
                width: width,
                height: height * 0.7, 
                backgroundColor: "#fff",
                borderTopLeftRadius: width * 0.05, 
                borderTopRightRadius: width * 0.05, 
            }}
        >
            <View style={{flex: 1,justifyContent: "center", alignItems: "center", padding: "1%"}}>
                <View style={{width: "100%",height: height * 0.07, justifyContent: "center", alignItems: "center", borderBottomWidth: 1, marginLeft: "5%", marginRight: "5%", borderBottomColor: "#bbb"}}>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#000" }}>입점신청 이벤트</Text>
                </View>
                <View style={{height: height * 0.63}}>
                    <View style={{width: width * 0.9, height: height * 0.35}}>
                        <Image source={{uri: "https://api-stg.ivid.kr/ceo/homepage/bannerImg/bannerFree_mobile.png"}} style={{height: "100%", width: "100%", borderRadius: width * 0.05, resizeMode: "contain"}}/>
                    </View>
                    <View style={{width: width * 0.9, height: height * 0.28}}>
                        <View style={{flex:1, alignItems: "center"}}>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#000" }}>홍보물 무상지원</Text>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#000", marginTop: "5%" }}>스루 설치 절차를 완료하시면</Text>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#000", marginTop: "1%" }}>드라이브스루 영업 시작을 알리시도록 도와드려요.</Text>
                        </View>
                        <View style={{flex:1, alignItems: "center"}}>
                            <TouchableOpacity onPress={loadInBrowser} style={{width: "100%", height: height * 0.08, backgroundColor: "#6490E8", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontWeight: "900", fontSize: RFPercentage(2.3), color: "#fff" }}>신청하기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export const CompModalCategoryList = ({ fnSelectValue, iList, aCategoryNm }) => {
    const [state, setstate] = useState("");
    const selectValue = async (sIndex) => {
        if(fnSelectValue !== undefined && typeof fnSelectValue === "function"){
            await fnSelectValue(sIndex);
        }
    }

    useEffect(() => {
        if(aCategoryNm !== undefined && aCategoryNm !== null && aCategoryNm !== ""){
            setstate(aCategoryNm);
        }
    }, [aCategoryNm]);

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: width * 0.7,
                width: width,
                height: width * 1.5, 
                backgroundColor: "#f0f6fc",
                borderRadius: width * 0.05, 
            }}
        >
            <View style={{padding: "7%"}}>
                <FlatList
                    data={iList}
                    ListFooterComponent={<View style={{ height: width * 0.6 }} />}
                    ListHeaderComponent={<View style={{ height: height * 0.01 }} />}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(data, index) => "list-" + index + Math.random()}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={{height: height * 0.03}}/>
                        )
                    }}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity onPress={() => selectValue(item)} style={{height: height * 0.08, backgroundColor: "#fff", width: "100%", borderRadius: 10, flexDirection: "row"}}>
                                <View style={{flex: 0.7, justifyContent: "center", paddingLeft: "5%"}}>
                                    <Text style={{fontSize: RFPercentage(1.9), fontWeight: '600', color: "#000" }}>{item.name}</Text>
                                </View>
                                <View style={{flex: 0.3, justifyContent: "center", alignItems: "center", marginRight: "5%"}}>
                                    <View style={{height: width * 0.07, width: width * 0.07,  justifyContent: "center", alignItems: "center"}}>
                                        {state === item.name ?
                                        <ComponentCheckCircle iHeight={height * 0.03} iWidth={width * 0.08} iColor={"#6490E8"}/>
                                        :
                                        <ComponentCircle iHeight={height * 0.03} iWidth={width * 0.08} iColor={"#6490E8"}/>
                                        }
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ) 
                    }}
                />
            </View>
        </View>
    )
}


export const CompModalOptionList = ({ fnSelectValue, oProps, iStoreId }) => {
    const [state, setState] = useState("list");

    const [sList, setList] = useState([]);
    
    const [sNm, setNm] = useState("");
    const [sCount, setCount] = useState(1);
    const [mustItem, setMustItem] = useState("radio");
    const [selectBoxText, setSelectBoxText] = useState("최소선택수");
    const [nList, setNList] = useState([]);

    const optionBox = useRef([]);

    const changeState = async () => {
        setState("add");
    }

    const cancelAdd = async () => {
        setState("list");
    }

    const nextLevel = async (sIndex,aIndex,xIndex,nIndex) => {
        setNm(sIndex);
        setCount(aIndex);
        setSelectBoxText(xIndex);
        setMustItem(nIndex);
        setState("last");
    }

    const returnPrev = async () => {
        setState("add");
    }

    const insertDone = async (sIndex) => {
        const store_id = iStoreId;
        let oData = {
            sGroupTitle : sNm,
            type : mustItem,
            sData : sIndex,
            maxCount : 1,
            minCount : 1,
            store_id,
        }
    
        if(mustItem === "checkbox"){
            oData = {
                sGroupTitle : sNm,
                type : mustItem,
                sData : sIndex,
                maxCount : sCount,
                store_id,
            }
        } else {
            if(parseInt(sCount) > 1){
                oData = {
                    sGroupTitle : sNm,
                    type : "radioDouble",
                    sData : sIndex,
                    maxCount : sCount,
                    minCount : sCount,
                    store_id,
                }
            }
        }
        const oResponse = await oProps.appManager.accessAxios("/app/sales/store/register/insertOption/v2", "post", null, oData);
        if(oResponse !== undefined){
            if(oResponse.resultCd === "0000"){
                setState("list");
                asyncData();
            }
        }
    }

    const selectValue = async () => {
        if(fnSelectValue !== undefined && typeof fnSelectValue === "function"){
            await fnSelectValue(optionBox.current);
        }
    }

    const checkValue = (sIndex,aIndex,xIndex) => {
        let tempList = optionBox.current;
        if(xIndex !== ""){
            let temp = {
                key: sIndex,
                name: aIndex
            }
            tempList.push(temp);
            optionBox.current = tempList;
        } else {
            optionBox.current = tempList.filter((item) => item.key !== sIndex);
        }
    }

    const asyncData = async () => {
        const store_id = iStoreId;
        const oResponse = await oProps.appManager.accessAxios('/modal/getOptionListModal-' + store_id, "get", "text", null);
        if(oResponse !== undefined){
            if(oResponse.resultCd === "0000"){
                setList(oResponse.result);
            }
        }
    }

    useEffect(() => {
        asyncData();
    }, []);

    return (
        <View 
            style={{
                marginHorizontal: "-5%",
                marginTop: width * 0.3,
                width: width,
                height: height * 0.8, 
                backgroundColor: "#fff",
                borderRadius: width * 0.05, 
            }}
        >
            {state === "list" &&
                <ModalOptionList 
                    iList={sList}
                    fnSelected={(sIndex,aIndex,xIndex) => checkValue(sIndex,aIndex,xIndex)}
                    fnDone={() => selectValue()}
                    fnChangeState={() => changeState()}
                />
            }
            {state === "add" &&
                <ModalAddOption
                    iNm={sNm}
                    iCount={sCount}
                    iMustItem={mustItem}
                    iSelectBoxText={selectBoxText}
                    fnCancel={() => cancelAdd()}
                    fnNextLevel={(sIndex,aIndex,xIndex,nIndex) => nextLevel(sIndex,aIndex,xIndex,nIndex)}
                />
            }
            {state === "last" &&
                <ModalLastOption
                    fnReturnPrev={() => returnPrev()}
                    fnInsertDone={(sIndex) => insertDone(sIndex)}
                />
            }
        </View>
    )
}

export const ThrooOnlySwitchToggle = ({ onToggle, isOn }) => {
    const [aniValue] = useState(new Animated.Value(0));
    const color = isOn ? "#6490E7" : "#E9E9EA";

    const moveSwitchToggle = aniValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width * 0.11],
    });

    Animated.timing(aniValue, {
        toValue: isOn ? 1 : 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
    }).start();

    return (
        <View style={{flexDirection: "row", alignItems: "center"}}>
            <TouchableOpacity onPress={onToggle}>
                <View style={{ width: width * 0.17, height: height * 0.02, paddingLeft: 2, borderRadius: 15, justifyContent: "center",backgroundColor: color }}>
                    <Animated.View 
                        style={{ 
                            transform: [{ translateX: moveSwitchToggle }],
                            width: width * 0.05,
                            height: width * 0.05,
                            backgroundColor: "#fff",
                            borderRadius: width,
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.2,
                            shadowRadius: 2.5,
                            elevation: 1.5
                        }}
                    />
                </View>
            </TouchableOpacity>
        </View>
    )
}