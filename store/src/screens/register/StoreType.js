import React, {useState,useEffect,useRef} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';

import { CompModalStoreType, CompModalMainTypePage, CompModalSubTypePage, CompModalMainListTypePage, CompModalSubListTypePage, CompModalContent } from '../../components/modal/ModalContents';

import { ComponentDelete } from '../../assets/svg/delete';
import { ComponentArrowLeft3 } from '../../assets/svg/arrowLeft3';
import { ComponentArrowDown1 } from '../../assets/svg/arrow_down1';

import { AppRoute } from '../../routes/AppRoutes';

const { width, height } = Dimensions.get('window');

const StoreType = oProps => {
    const [loading, setLoading] = useState(false);
    const [sLocation, setLocation] = useState("");

    const [plainOptions, setPlainOptions] = useState([]);
    const [cafeOptions, setCafeOptions] = useState([]);
    const [shopOptions, setShopOptions] = useState([]);

    const [mainTypeNm, setMainTypeNm] = useState("");
    const [mainTypeNumber, setMainTypeNumber] = useState(0);
    const [subTypeNm, setSubTypeNm] = useState("선택안함");
    const [subTypeNumber, setSubTypeNumber] = useState(4);
    const [mainTypeListNm, setMainTypeListNm] = useState("");
    const [subTypeListNm, setSubTypeListNm] = useState("");

    const [sMainTypeErrColor, setMainTypeErrColor] = useState("#6490E7");
    const [sMainTypeErrText, setMainTypeErrText] = useState("");
    const [sMainListTypeErrColor, setMainListTypeErrColor] = useState("#F2F3F5");
    const [sMainListTypeErrText, setMainListTypeErrText] = useState("");

    const optionBox = useRef([]);
    const subOptionBox = useRef([]);

    const [info] = useState(oProps.UserConfigReducer.STORETYPE);

    const backToInfomation = () => {
        oProps.appManager.navGoTo('reset', AppRoute.OWNERACCOUNT);
    }

    const completeSelectType = async (sIndex,aIndex,qIndex,rIndex,wIndex,eIndex,oIndex) => {
        let oCount = 0;
        let iCount = 0;
        let oTempNm = "";
        let iTempNm = "";
        optionBox.current = wIndex;
        subOptionBox.current = eIndex;

        if(sIndex !== ""){
            setMainTypeNumber(aIndex);
            setMainTypeNm(sIndex);
        }
        if(qIndex !== ""){
            setSubTypeNumber(rIndex);
            setSubTypeNm(qIndex);
        }
        for (const wParam of wIndex) {
            if(oCount.toString() < 2){
                if(oTempNm !== ""){
                    oTempNm = oTempNm + "," + wParam.name + "...";
                } else {
                    oTempNm = wParam.name;
                }
                oCount += 1;
            }
        }
        for (const eParam of eIndex) {
            if(iCount.toString() < 2){
                if(iTempNm !== ""){
                    iTempNm = iTempNm + "," + eParam.name + "...";
                } else {
                    iTempNm = eParam.name;
                }
                iCount += 1;
            }
        }

        setMainTypeErrColor("#F2F3F5");
        setMainTypeListNm(oTempNm);
        setSubTypeListNm(iTempNm);
        
        if(oIndex === "close"){
            oProps.appManager.hideModal();
        }
    };

    const completeMainType = async (sIndex,aIndex,qIndex) => {
        let oCount = 0;
        let oTempNm = "";
        if(sIndex !== ""){
            setMainTypeNumber(aIndex);
            setMainTypeNm(sIndex);
            setSubTypeNumber(4);
            setSubTypeNm("선택없음");
        }
        for (const wParam of qIndex) {
            if(oCount.toString() < 2){
                if(oTempNm !== ""){
                    oTempNm = oTempNm + "," + wParam.name + "...";
                } else {
                    oTempNm = wParam.name;
                }
                oCount += 1;
            }
        }
        optionBox.current = qIndex;
        subOptionBox.current = [];
        setMainTypeListNm(oTempNm);
        setSubTypeListNm("");
        oProps.appManager.hideModal();
    };

    const completeSubType = async (sIndex,aIndex,qIndex) => {
        let oCount = 0;
        let oTempNm = "";
        if(sIndex !== ""){
            setSubTypeNumber(aIndex);
            setSubTypeNm(sIndex);
        }
        for (const wParam of qIndex) {
            if(oCount.toString() < 2){
                if(oTempNm !== ""){
                    oTempNm = oTempNm + "," + wParam.name + "...";
                } else {
                    oTempNm = wParam.name;
                }
                oCount += 1;
            }
        }
        subOptionBox.current = qIndex;
        setSubTypeListNm(oTempNm);
        oProps.appManager.hideModal();
    };

    const completeMainTypeList = async (sIndex) => {
        if(sIndex.length > 0){
            let oCount = 0;
            let oTempNm = "";
            for (const wParam of sIndex) {
                if(oCount.toString() < 2){
                    if(oTempNm !== ""){
                        oTempNm = oTempNm + "," + wParam.name + "...";
                    } else {
                        oTempNm = wParam.name;
                    }
                    oCount += 1;
                }
            }
            optionBox.current = sIndex;
            setMainTypeListNm(oTempNm);
        }
        oProps.appManager.hideModal();
    };

    const completeSubTypeList = async (sIndex) => {
        if(sIndex.length > 0){
            let oCount = 0;
            let oTempNm = "";
            for (const wParam of sIndex) {
                if(oCount.toString() < 2){
                    if(oTempNm !== ""){
                        oTempNm = oTempNm + "," + wParam.name + "...";
                    } else {
                        oTempNm = wParam.name;
                    }
                    oCount += 1;
                }
            }
            subOptionBox.current = sIndex;
            setSubTypeListNm(oTempNm);
        }
        oProps.appManager.hideModal();
    };


    const openTypeList = (sIndex) => {
        if(parseInt(mainTypeNumber) > 0){
            if(sIndex === "main"){
                oProps.appManager.showModal(
                    true,
                    <CompModalMainTypePage
                        iPlainOptions={plainOptions}
                        iCafeOptions={cafeOptions}
                        iShopOptions={shopOptions}
                        fnClose={() => oProps.appManager.hideModal()}
                        fnCompleteSelect={(sIndex,aIndex,qIndex) => completeMainType(sIndex,aIndex,qIndex)}
                    />, 
                    "custom"
                );
            } else if (sIndex === "sub"){
                oProps.appManager.showModal(
                    true,
                    <CompModalSubTypePage
                        sTypeNumber={mainTypeNumber}
                        iPlainOptions={plainOptions}
                        iCafeOptions={cafeOptions}
                        iShopOptions={shopOptions}
                        fnClose={() => oProps.appManager.hideModal()}
                        fnCompleteSelect={(sIndex,aIndex,qIndex) => completeSubType(sIndex,aIndex,qIndex)}
                    />, 
                    "custom"
                );
            } else if (sIndex === "mainList"){
                let tempList = [];
                if(mainTypeNumber.toString() === "1"){
                    tempList = plainOptions;
                } else if (mainTypeNumber.toString() === "2"){
                    tempList = cafeOptions;
                } else {
                    tempList = shopOptions;
                }
                oProps.appManager.showModal(
                    true,
                    <CompModalMainListTypePage
                        mList={tempList}
                        iList={optionBox.current}
                        fnCloseModal={() => oProps.appManager.hideModal()}
                        fnCompleteSelect={(sIndex) => completeMainTypeList(sIndex)}
                    />, 
                    "custom"
                );
            } else if (sIndex === "subList"){
                let tempList = [];
                if(subTypeNumber.toString() === "1"){
                    tempList = plainOptions;
                } else if (subTypeNumber.toString() === "2"){
                    tempList = cafeOptions;
                } else {
                    tempList = shopOptions;
                }
                oProps.appManager.showModal(
                    true,
                    <CompModalSubListTypePage
                        mList={tempList}
                        iList={subOptionBox.current}
                        fnCloseModal={() => oProps.appManager.hideModal()}
                        fnCompleteSelect={(sIndex) => completeSubTypeList(sIndex)}
                    />, 
                    "custom"
                );
            }
        } else {
            oProps.appManager.showModal(
                true,
                <CompModalStoreType
                    iPlainOptions={plainOptions}
                    iCafeOptions={cafeOptions}
                    iShopOptions={shopOptions}
                    fnCompleteSelect={(sIndex,aIndex,qIndex,rIndex,wIndex,eIndex,oIndex) => completeSelectType(sIndex,aIndex,qIndex,rIndex,wIndex,eIndex,oIndex)}
                />, 
                "custom"
            );
        }
    }

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

    const openModal = (sIndex) => {
        oProps.appManager.showModal(
            true,
            <CompModalContent sText={sIndex}/>, 
            "custom",
            2500
        );
    };

    const insertData = async () => {
        setLoading(true);
        let mainType = optionBox.current;
        let subType = subOptionBox.current;
        if(mainType.length > 0){
            let oData = {
                store_id: oProps.UserConfigReducer.StoreID,
                mainType,
                subType,
                isSub: subTypeNumber
            }
            const oResponse = await oProps.appManager.accessAxios("/app/ceo/store/storeNotice", "post", null, oData);
            if(oResponse !== undefined && oResponse !== null){
                if(oResponse){
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
        
                        oUserConfig['STORETYPE'] = false;
                        oUserConfig['STORENOTICE'] = true;
        
                        await oProps.reduxSetUserConfig(oUserConfig);
                        oProps.appManager.navGoTo('reset', AppRoute.STORENOTICE);
                    }
                } else {
                    openModal("문제가 발생했습니다 관리자에 연락바랍니다.");
                }
            }
        } else {
            setMainTypeErrColor("#E32938");
            setMainListTypeErrColor("#E32938");
            setMainTypeErrText("주업종을 선택해주세요");
            setMainListTypeErrText("카테고리를 선택해주세요");
        }
        setLoading(false);
    }

    const asyncData = async () => {
        setLoading(true);
        const store_id = oProps.UserConfigReducer.StoreID;
        const oResponse = await oProps.appManager.accessAxios("/app/ceo/store/storeNotice-" + store_id, "get", "text", null);
        if(oResponse !== undefined && oResponse !== null){
            setMainTypeNm(oResponse.mainTypeNm);
            setMainTypeNumber(oResponse.mainTypeNumber);
            setSubTypeNm(oResponse.subTypeNm);
            setSubTypeNumber(oResponse.subTypeNumber);
            setMainTypeListNm(oResponse.mainTypeListNm);
            setSubTypeListNm(oResponse.subTypeListNm);
            setMainTypeErrColor("#F2F3F5");
            setPlainOptions(oResponse.plainOptions);
            setCafeOptions(oResponse.cafeOptions);
            setShopOptions(oResponse.shopOptions);
            optionBox.current = oResponse.mainType
            subOptionBox.current = oResponse.subType
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
            <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>업종을 선택해주세요</Text>
            </View>
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <TouchableOpacity onPress={() => openTypeList("main")} style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                    {mainTypeNm !== "" &&
                        <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>주업종</Text>
                        </View>
                    }
                    <View style={{width: "90%", height: height * 0.07, borderBottomColor: sMainTypeErrColor, borderBottomWidth: 1, backgroundColor: "#fff", justifyContent: "center"}}>
                        {mainTypeNm !== "" ?
                            <Text style={{color: "#000", fontWeight: "500", fontSize: RFPercentage(2.3)}}>{mainTypeNm}</Text>
                            :
                            <Text style={{color: "#B0B7C1", fontWeight: "500", fontSize: RFPercentage(2.3)}}>주업종</Text>
                        }
                        <View style={{position: "absolute", bottom: "20%", backgroundColor: "#fff",height: height * 0.04, width: width * 0.1, right: "0%", justifyContent: "center", alignItems: "center"}}>
                            <ComponentArrowDown1 iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                        </View>
                    </View>
                    {sMainTypeErrText !== "" &&
                        <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{sMainTypeErrText}</Text>
                        </View>
                    }
                </TouchableOpacity>
                {mainTypeNumber > 0 &&
                    <TouchableOpacity onPress={() => openTypeList("mainList")} style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                        {mainTypeNm !== "" &&
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>주업종 카테고리</Text>
                            </View>
                        }
                        <View style={{width: "90%", height: height * 0.07, borderBottomColor: sMainListTypeErrColor, borderBottomWidth: 1, backgroundColor: "#fff", justifyContent: "center"}}>
                            {mainTypeListNm !== "" ?
                                <Text style={{color: "#000", fontWeight: "500", fontSize: RFPercentage(2.3)}}>{mainTypeListNm}</Text>
                                :
                                <Text style={{color: "#B0B7C1", fontWeight: "500", fontSize: RFPercentage(2.3)}}>주업종 카테고리</Text>
                            }
                            <View style={{position: "absolute", bottom: "20%", backgroundColor: "#fff",height: height * 0.04, width: width * 0.1, right: "0%", justifyContent: "center", alignItems: "center"}}>
                                <ComponentArrowDown1 iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                            </View>
                        </View>
                        {sMainListTypeErrText !== "" &&
                            <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{sMainListTypeErrText}</Text>
                            </View>
                        }
                    </TouchableOpacity>
                }
                {mainTypeNumber > 0 &&
                    <TouchableOpacity onPress={() => openTypeList("sub")} style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                        <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>부업종</Text>
                        </View>
                        <View style={{width: "90%", height: height * 0.07, borderBottomColor: "#F2F3F5", borderBottomWidth: 1, backgroundColor: "#fff", justifyContent: "center"}}>
                            {subTypeNm !== "" ?
                                <Text style={{color: "#000", fontWeight: "500", fontSize: RFPercentage(2.3)}}>{subTypeNm}</Text>
                                :
                                <Text style={{color: "#B0B7C1", fontWeight: "500", fontSize: RFPercentage(2.3)}}>부업종</Text>
                            }
                            <View style={{position: "absolute", bottom: "20%", backgroundColor: "#fff",height: height * 0.04, width: width * 0.1, right: "0%", justifyContent: "center", alignItems: "center"}}>
                                <ComponentArrowDown1 iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                }
                {mainTypeNumber > 0 &&
                    <TouchableOpacity onPress={() => openTypeList("subList")} style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                        <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>부업종 카테고리</Text>
                        </View>
                        <View style={{width: "90%", height: height * 0.07, borderBottomColor: "#F2F3F5", borderBottomWidth: 1, backgroundColor: "#fff", justifyContent: "center"}}>
                            {subTypeListNm !== "" ?
                                <Text style={{color: "#000", fontWeight: "500", fontSize: RFPercentage(2.3)}}>{subTypeListNm}</Text>
                                :
                                <Text style={{color: "#B0B7C1", fontWeight: "500", fontSize: RFPercentage(2.3)}}>부업종 카테고리</Text>
                            }
                            <View style={{position: "absolute", bottom: "20%", backgroundColor: "#fff",height: height * 0.04, width: width * 0.1, right: "0%", justifyContent: "center", alignItems: "center"}}>
                                <ComponentArrowDown1 iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                }
            </View>
            <View style={{height: height / 8 , backgroundColor: "#fff", justifyContent: "center"}}>
                <TouchableOpacity
                    onPress={insertData}
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
                    <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>적용</Text>
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

export default StoreType;