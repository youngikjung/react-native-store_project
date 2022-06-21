import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';

import { CompModalPickUpAlert, CompModalPickUpList } from '../../components/modal/ModalContents';

import { ComponentDelete } from '../../assets/svg/delete';
import { ComponentArrowLeft3 } from '../../assets/svg/arrowLeft3';
import { ComponentArrowDown1 } from '../../assets/svg/arrow_down1';
import { ComponentQuestionMark } from '../../assets/svg/question_mark';

import { AppRoute } from '../../routes/AppRoutes';

const { width, height } = Dimensions.get('window');
const nearByList = [];
const parkingList = [
    {
        key: 1,
        value: 1,
        name: `1 분`,
    }
];
for (let i = 1; i < 15 ; i++) {
    nearByList.push({
        key: i,
        value: i * 50,
        name: `${i * 50} M`,
    });
};
for (let k = 1; k <13 ; k++) {
    parkingList.push({
        key: k,
        value: k * 5,
        name: `${k * 5} 분`,
    });
};

const StorePickUpZoneDetail = oProps => {
    const [loading, setLoading] = useState(false);
    const [sLocation, setLocation] = useState("");

    const [sNearByDistance, setNearByDistance] = useState(50);
    const [sNearByDistanceNm, setNearByDistanceNm] = useState("50M");
    const [sParkingTime, setParkingTime] = useState(5);
    const [sParkingTimeNm, setParkingTimeNm] = useState("5분");

    const [sNearByDistanceNmErrColor, setNearByDistanceNmErrColor] = useState("#F2F3F5");
    const [sNearByDistanceNmErrText, setNearByDistanceNmErrText] = useState("");
    const [sParkingTimeNmErrColor, setsParkingTimeNmErrColor] = useState("#F2F3F5");
    const [sParkingTimeNmErrText, setsParkingTimeNmErrText] = useState("");

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
        oProps.appManager.navGoTo('reset', AppRoute.STOREPICKUPIMAGE);
    }

    const completeSelectType = (sIndex,aIndex,xIndex) => {
        if(xIndex === "nearByList"){
            setNearByDistance(sIndex);
            setNearByDistanceNm(aIndex);
            setNearByDistanceNmErrColor("#F2F3F5");
            setNearByDistanceNmErrText("");
        } else if (xIndex === "parkingList"){
            setParkingTime(sIndex);
            setParkingTimeNm(aIndex);
            setsParkingTimeNmErrColor("#F2F3F5");
            setsParkingTimeNmErrText("");
        }
        oProps.appManager.hideModal();
    };

    const openPicUpList = (mIndex,kIndex) => {
        oProps.appManager.showModal(
            true,
            <CompModalPickUpList
                sType={kIndex}
                sList={mIndex}
                fnCompleteSelect={(sIndex,aIndex,xIndex) => completeSelectType(sIndex,aIndex,xIndex)}
            />, 
            "custom"
        );
    }
            
    const openAlert = () => {
        oProps.appManager.showModal(
            true,
            <CompModalPickUpAlert
                fnClose={() =>  oProps.appManager.hideModal()}
            />, 
            "custom"
        );
    }

    const asyncData = async () => {
        setLoading(true);
        const store_id = oProps.UserConfigReducer.StoreID;
        const oResponse = await oProps.appManager.accessAxios("/app/sales/store/store/pickup/getPickUpInfo-" + store_id, "get", "text", null);
        if(oResponse !== undefined && oResponse !== null){
            setNearByDistance(oResponse.sNoti);
            setNearByDistanceNm(oResponse.sNoti.toString() + " M");
            setParkingTime(oResponse.parkingTime);
            setParkingTimeNm(oResponse.parkingTime.toString() + "분");
        }
        setLoading(false);
    }
    
    const access = async () => {
        setLoading(true);
        const oData = {
            store_id: oProps.UserConfigReducer.StoreID,
            sNotsNearByDistanceValue: sNearByDistance,
            sParkingTime,
        }
        const oResponse = await oProps.appManager.accessAxios("/app/ceo/store/pickup/pickupInfo", "post", null, oData);
        if(oResponse !== undefined){
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
    
                    oUserConfig['STOREPICKUPZONEDETAIL'] = false;
                    oUserConfig['STOREORDERTIME'] = true;
    
                    await oProps.reduxSetUserConfig(oUserConfig);
                    oProps.appManager.navGoTo('reset', AppRoute.STOREORDERTIME);
                }
            } else {
                openModal("문제가 발생했습니다 관리자에 연락바랍니다.");
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
            <View style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>픽업존 추가 설명을 해주세요.</Text>
            </View>
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <TouchableOpacity onPress={() => openPicUpList(parkingList,"parkingList")} style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                    {sParkingTimeNm !== "" &&
                        <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1" }}>정차 가능 시간</Text>
                        </View>
                    }
                    <View style={{width: "90%", height: height * 0.07, borderBottomColor: sNearByDistanceNmErrColor, borderBottomWidth: 1, backgroundColor: "#fff", justifyContent: "center"}}>
                        {sParkingTimeNm !== "" ?
                            <Text style={{color: "#000", fontWeight: "500", fontSize: RFPercentage(2.3)}}>{sParkingTimeNm}</Text>
                            :
                            <Text style={{color: "#B0B7C1", fontWeight: "500", fontSize: RFPercentage(2.3)}}>픽업존 근접 알림</Text>
                        }
                        <View style={{position: "absolute", bottom: "20%", backgroundColor: "#fff",height: height * 0.04, width: width * 0.1, right: "0%", justifyContent: "center", alignItems: "center"}}>
                            <ComponentArrowDown1 iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                        </View>
                    </View>
                    {sParkingTimeNmErrText !== "" &&
                        <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{sParkingTimeNmErrText}</Text>
                        </View>
                    }
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openPicUpList(nearByList,"nearByList")} style={{height: height * 0.13, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                    {sNearByDistanceNm !== "" &&
                        <TouchableOpacity onPress={() => openAlert()} style={{height: height * 0.03, backgroundColor: "#fff", width, alignItems: "center", marginLeft: "10%", flexDirection: "row"}}>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#8B94A1", marginRight: "2%" }}>픽업존 근접 알림</Text>
                            <ComponentQuestionMark iHeight={height * 0.02} iWidth={height * 0.02} iColor={"#646970"}/>
                        </TouchableOpacity>
                    }
                    <View style={{width: "90%", height: height * 0.07, borderBottomColor: sParkingTimeNmErrColor, borderBottomWidth: 1, backgroundColor: "#fff", justifyContent: "center"}}>
                        {sNearByDistanceNm !== "" ?
                            <Text style={{color: "#000", fontWeight: "500", fontSize: RFPercentage(2.3)}}>{sNearByDistanceNm}</Text>
                            :
                            <Text style={{color: "#B0B7C1", fontWeight: "500", fontSize: RFPercentage(2.3)}}>정차 가능 시간</Text>
                        }
                        <View style={{position: "absolute", bottom: "20%", backgroundColor: "#fff",height: height * 0.04, width: width * 0.1, right: "0%", justifyContent: "center", alignItems: "center"}}>
                            <ComponentArrowDown1 iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                        </View>
                    </View>
                    {sNearByDistanceNmErrText !== "" &&
                        <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "10%"}}>
                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{sNearByDistanceNmErrText}</Text>
                        </View>
                    }
                </TouchableOpacity>
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

export default StorePickUpZoneDetail;