import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { CompModalOrderTimeList } from '../../components/modal/ModalContents';

import { ComponentDelete } from '../../assets/svg/delete';
import { ComponentArrowLeft3 } from '../../assets/svg/arrowLeft3';
import { ComponentQuestionMark } from '../../assets/svg/question_mark';
import { ComponentArrowDown1 } from '../../assets/svg/arrow_down1';

import { AppRoute } from '../../routes/AppRoutes';

const { width, height } = Dimensions.get('window');
const sEasy = [];
const sNormal = [];
const sBusy = [];
const sWalk = [];
for (let i = 1; i <40 ; i++) {
    sEasy.push({
        key: i,
        value: i,
        name: `${i} 분`,
    });
};
for (let i = 5; i <50 ; i++) {
    sNormal.push({
        key: i,
        value: i,
        name: `${i} 분`,
    });
};
for (let i = 10; i <60 ; i++) {
    sBusy.push({
        key: i,
        value: i,
        name: `${i} 분`,
    });
};
for (let i = 1; i <60 ; i++) {
    sWalk.push({
        key: i,
        value: i,
        name: `${i} 분`,
    });
};

const StoreOrdertime = oProps => {
    const [sDone, setDone] = useState(false);

    const [loading, setLoading] = useState(false);
    const [sLocation, setLocation] = useState("");

    const [iEasy, setEasy] = useState(null);
    const [iEasyNm, setEasyNm] = useState("");
    const [iNormal, setNormal] = useState(null);
    const [iNormalNm, setNormalNm] = useState("");
    const [iBusy, setBusy] = useState(null);
    const [iBusyNm, setBusyNm] = useState("");
    const [iWalkThroo, setWalkThroo] = useState(null);
    const [iWalkThrooNm, setWalkThrooNm] = useState("");

    const [sEasyErrColor, setEasyErrColor] = useState("#F2F3F5");
    const [sEasyErrText, setEasyErrText] = useState("");
    const [sNormalErrColor, setNormalErrColor] = useState("#F2F3F5");
    const [sNormalErrText, setNormalErrText] = useState("");
    const [sBusyErrColor, setBusyErrColor] = useState("#F2F3F5");
    const [sBusyErrText, setBusyErrText] = useState("");

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
        oProps.appManager.navGoTo('reset', AppRoute.STOREPICKUPZONEDETAIL);
    }

    const asyncData = async () => {
        setLoading(true);
        const store_id = oProps.UserConfigReducer.StoreID;
        const iResponse = await oProps.appManager.accessAxios("/app/sales/store/orderTimeDesc-" + store_id, "get", "text", null);
        if(iResponse !== undefined && iResponse !== null){
            if(iResponse.result_cd === "0000"){
                setEasy(parseInt(iResponse.sEasy));
                setEasyNm(iResponse.sEasy.toString() + "분");
                setNormal(parseInt(iResponse.sNormal));
                setNormalNm(iResponse.sNormal.toString() + "분");
                setBusy(parseInt(iResponse.sBusy));
                setBusyNm(iResponse.sBusy.toString() + "분");

                if(iResponse.sWalkThroo.toString() !== ""){
                    setWalkThroo(parseInt(iResponse.sWalkThroo));
                    setWalkThrooNm(iResponse.sWalkThroo.toString() + "분");
                } else {
                    setWalkThroo(null);
                    setWalkThrooNm("");
                }
                setDone(true);
            }
        }
        setLoading(false);
    }

    const access = async () => {
        if(sDone){
            setLoading(true);
            const oData = {
                sEasy: parseInt(iEasy),
                sNormal: parseInt(iNormal),
                sBusy: parseInt(iBusy),
                sWalkThroo: iWalkThroo,
                store_id: oProps.UserConfigReducer.StoreID
            }
            const oResponse = await oProps.appManager.accessAxios("/app/sales/store/register/orderTime", "post", "login", oData);
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
        
                        oUserConfig['STOREORDERTIME'] = false;
                        oUserConfig['STOREOPERATIONTIME'] = true;
        
                        await oProps.reduxSetUserConfig(oUserConfig);
                        oProps.appManager.navGoTo('reset', AppRoute.STOREOPERATIONTIME);
                    }
                }
            }
            setLoading(false);
        } else {
            setEasyErrColor("#E32938");
            setEasyErrText("여유로울 때 걸리는 시간을 선택해주세요");
            setNormalErrColor("#E32938");
            setNormalErrText("보통일 때 걸리는 시간을 선택해주세요");
            setBusyErrColor("#E32938");
            setBusyErrText("바쁠 때 걸리는 시간을 선택해주세요");
        }
    }

    const completeSelectType = (sIndex,aIndex,xIndex) => {
        if(xIndex === "easy"){
            setEasy(sIndex);
            setEasyNm(aIndex);
        } else if (xIndex === "normal"){
            setNormal(sIndex);
            setNormalNm(aIndex);
        } else if (xIndex === "busy"){
            setBusy(sIndex);
            setBusyNm(aIndex);
        } else if (xIndex === "walkthroo"){
            setWalkThroo(sIndex);
            setWalkThrooNm(aIndex);
        }
        if(iEasy !== null && iNormal !== null && iBusy !== null){
            setDone(true);
        } else {
            setDone(false);
        }
        oProps.appManager.hideModal();
    };

    const openOrderTimeList = (mIndex,kIndex,nIndex) => {
        oProps.appManager.showModal(
            true,
            <CompModalOrderTimeList
                sType={kIndex}
                sList={mIndex}
                iSelected={nIndex}
                fnCompleteSelect={(sIndex,aIndex,xIndex) => completeSelectType(sIndex,aIndex,xIndex)}
            />, 
            "custom"
        );
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
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>매장 혼잡도에 따른</Text>
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>메뉴준비시간을 설정해주세요.</Text>
                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.6), color: "#95959E" }}>메뉴준비시간을 설정해주세요.</Text>
            </View>
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <TouchableOpacity onPress={() => openOrderTimeList(sEasy,"easy",iEasy)} style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                    {iEasyNm !== "" &&
                        <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>여유로울 때</Text>
                        </View>
                    }
                    <View style={{width: "90%", height: height * 0.07, borderBottomColor: sEasyErrColor, borderBottomWidth: 1, backgroundColor: "#fff", justifyContent: "center"}}>
                        {iEasyNm !== "" ?
                            <Text style={{color: "#000", fontWeight: "500", fontSize: RFPercentage(2.3)}}>{iEasyNm}</Text>
                        :
                            <Text style={{color: "#B0B7C1", fontWeight: "500", fontSize: RFPercentage(2.3)}}>여유로울 때</Text>
                        }
                        <View style={{position: "absolute", bottom: "20%", backgroundColor: "#fff",height: height * 0.04, width: width * 0.1, right: "0%", justifyContent: "center", alignItems: "center"}}>
                            <ComponentArrowDown1 iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                        </View>
                    </View>
                    {sEasyErrText !== "" &&
                        <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{sEasyErrText}</Text>
                        </View>
                    }
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openOrderTimeList(sNormal,"normal",iNormal)} style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                    {iNormalNm !== "" &&
                        <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>보통일 때</Text>
                        </View>
                    }
                    <View style={{width: "90%", height: height * 0.07, borderBottomColor: sNormalErrColor, borderBottomWidth: 1, backgroundColor: "#fff", justifyContent: "center"}}>
                        {iNormalNm !== "" ?
                            <Text style={{color: "#000", fontWeight: "500", fontSize: RFPercentage(2.3)}}>{iNormalNm}</Text>
                        :
                            <Text style={{color: "#B0B7C1", fontWeight: "500", fontSize: RFPercentage(2.3)}}>보통일 때</Text>
                        }
                        <View style={{position: "absolute", bottom: "20%", backgroundColor: "#fff",height: height * 0.04, width: width * 0.1, right: "0%", justifyContent: "center", alignItems: "center"}}>
                            <ComponentArrowDown1 iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                        </View>
                    </View>
                    {sNormalErrText !== "" &&
                        <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{sNormalErrText}</Text>
                        </View>
                    }
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openOrderTimeList(sBusy,"busy",iBusy)} style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                    {iBusyNm !== "" &&
                        <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>바쁠 때</Text>
                        </View>
                    }
                    <View style={{width: "90%", height: height * 0.07, borderBottomColor: sBusyErrColor, borderBottomWidth: 1, backgroundColor: "#fff", justifyContent: "center"}}>
                        {iBusyNm !== "" ?
                            <Text style={{color: "#000", fontWeight: "500", fontSize: RFPercentage(2.3)}}>{iBusyNm}</Text>
                        :
                            <Text style={{color: "#B0B7C1", fontWeight: "500", fontSize: RFPercentage(2.3)}}>바쁠 때</Text>
                        }
                        <View style={{position: "absolute", bottom: "20%", backgroundColor: "#fff",height: height * 0.04, width: width * 0.1, right: "0%", justifyContent: "center", alignItems: "center"}}>
                            <ComponentArrowDown1 iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                        </View>
                    </View>
                    {sBusyErrText !== "" &&
                        <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{sBusyErrText}</Text>
                        </View>
                    }
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openOrderTimeList(sWalk,"walkthroo",iWalkThroo)} style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                    {iWalkThrooNm !== "" &&
                        <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>워크스루만 가능할때 (선택)</Text>
                        </View>
                    }
                    <View style={{width: "90%", height: height * 0.07, borderBottomColor: "#F2F3F5", borderBottomWidth: 1, backgroundColor: "#fff", justifyContent: "center"}}>
                        {iWalkThrooNm !== "" ?
                            <Text style={{color: "#000", fontWeight: "500", fontSize: RFPercentage(2.3)}}>{iWalkThrooNm}</Text>
                        :
                            <Text style={{color: "#B0B7C1", fontWeight: "500", fontSize: RFPercentage(2.3)}}>워크스루만 가능할때 (선택)</Text>
                        }
                        <View style={{position: "absolute", bottom: "20%", backgroundColor: "#fff",height: height * 0.04, width: width * 0.1, right: "0%", justifyContent: "center", alignItems: "center"}}>
                            <ComponentArrowDown1 iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{height: height / 8 , backgroundColor: "#fff", justifyContent: "center"}}>
                <TouchableOpacity
                    onPress={access}
                    style={{
                        height: height / 14,
                        backgroundColor: !sDone ? "#C5D5F4" : '#6490E7',
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

export default StoreOrdertime;