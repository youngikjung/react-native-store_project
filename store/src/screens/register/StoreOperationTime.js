import React, {useState,useEffect,useRef} from 'react';
import { TouchableOpacity, View, Dimensions, Text, ScrollView, Keyboard } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';
import moment from 'moment-timezone';
import 'moment/locale/ko';

import { CompModalOperationAlert, CompModalTimeList, CompModalContent, CompOperationTime } from '../../components/modal/ModalContents';

import { ComponentDelete } from '../../assets/svg/delete';
import { ComponentArrowLeft3 } from '../../assets/svg/arrowLeft3';
import { ComponentQuestionMark } from '../../assets/svg/question_mark';
import { ComponentDeleteTimeLine } from '../../assets/svg/deleteTimeLine';

import { AppRoute } from '../../routes/AppRoutes';

const { width, height } = Dimensions.get('window');
const dayList = [
    { id: 1, value : 1, name : "월요일"},
    { id: 2, value : 2, name : "화요일"},
    { id: 3, value : 3, name : "수요일"},
    { id: 4, value : 4, name : "목요일"},
    { id: 5, value : 5, name : "금요일"},
    { id: 6, value : 6, name : "토요일"},
    { id: 0, value : 0, name : "일요일"},
];
const generaterAsync = (sIndex) => {
    let tempList = [];
    for (let index = 1; index < sIndex; index++) {
        tempList.push(index);
    }
    return tempList;
};

const generaterAsync2 = () => {
    let tempList = [];
    for (let index = 0; index < 2; index++) {
        tempList.push(index);
    }
    return tempList;
};

const StoreOperationTime = oProps => {
    const [loading, setLoading] = useState(false);
    const [sLocation, setLocation] = useState("");
    
    const [errText, setErrText] = useState("");

    const [sAlert, setAlert] = useState(false);

    const [listData, setListData] = useState([]);
    const operationList = useRef([]);

    const findUrl = () => {
        let temp = AppRoute.MAIN;
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

    const openOperationModal = () => {
        oProps.appManager.showModal(
            true,
            <CompOperationTime
                bAlert={sAlert}
                fnInsert={(sIndex,aIndex,xIndex) => setModalData(sIndex,aIndex,xIndex)}
                fnClose={() =>  oProps.appManager.hideModal()}
            />, 
            "custom"
        );
    }

    const backToInfomation = () => {
        oProps.appManager.navGoTo('reset', AppRoute.STOREORDERTIME);
    }

    const asyncData = async () => {
        setLoading(true);
        const store_id = oProps.UserConfigReducer.StoreID;
        const oResponse = await oProps.appManager.accessAxios("/app/sales/store/getStoreOperationV2-" + store_id, "get", "text", null);
        if(oResponse !== undefined && oResponse !== null){
            if(oResponse.resultCd === "locked"){
                setListData(oResponse.sData);
            }
            setAlert(oResponse.setWalkthru);
        }
        setLoading(false);
    }

    const access = async () => {
        setLoading(true);
        if(listData.length > 0){
            const oData = {
                store_id: oProps.UserConfigReducer.StoreID,
                sData: listData,
            }
            const oResponse = await oProps.appManager.accessAxios("/app/sales/store/register/editStoreOperationV2", "post", null, oData);
            if(oResponse !== undefined){
                if(!oResponse.resultCd){
                    openModal("문제가 발생했습니다 관리자에 연락바랍니다.");
                } else {
                    if(sLocation !== ""){
                        let oUserConfig = {};
                        let temp = AppRoute.MAIN;
                        if (sLocation === "order"){
                            temp = AppRoute.ORDER;
                        } else if (sLocation === "manage"){
                            temp = AppRoute.QUICKMANAGE;
                        } else if (sLocation === "list"){
                            temp = AppRoute.ORDERLIST;
                        } else if (sLocation === "product"){
                            temp = AppRoute.QUICKINSERT;
                        }
                        oUserConfig['PickupType'] = oResponse.pickup;
                        await oProps.reduxSetUserConfig(oUserConfig);
                        oProps.appManager.navGoTo('reset', temp);
                    } else {
                        let oUserConfig = {};
        
                        oUserConfig['STOREOPERATIONTIME'] = false;
                        oUserConfig['MENU'] = true;
                        oUserConfig['PickupType'] = oResponse.pickup;
        
                        await oProps.reduxSetUserConfig(oUserConfig);
                        oProps.appManager.navGoTo('reset', AppRoute.MENU);
                    }
                }
            }
        }
        setLoading(false);
    }

    const openModal = async (sIndex) => {
        oProps.appManager.showModal(
            true,
            <CompModalContent sText={sIndex}/>, 
            "custom",
            2500
        );
    };

    const setModalData = async (sIndex,aIndex,xIndex) => {
        setLoading(true);
        if(aIndex === "both"){
            let tempList = listData;
            for await (const iterator of xIndex) {
                const result = await checkUpInsertDate(iterator,xIndex);
                if(result !== undefined && result.length > 0){
                    tempList.push(result[0]);
                } else {
                    tempList = listData;
                    break;
                }
            }
            setListData(tempList);
        } else {
            checkUpInsert(sIndex,xIndex);
        }
        await oProps.appManager.hideModal();
        setLoading(false);
    }

    const checkUpInsert = async (param,dataline) => {
        let sIndex = 0;

        for await (const iterator of listData) {
            if(parseInt(iterator.day_of_week) === 7){
                if(param.sEachDayValue > 7 || param.sEachDayValue < 7){
                    sIndex += 1;
                }
            } else {
                if(parseInt(param.sEachDayValue) === 7){
                    sIndex += 1;
                }
            }
            
        }
        if(sIndex > 0){
            setErrText("중복되는 요일이 존재합니다.");
        } else {
            if((param.startHour + param.startMin) === (param.endHour + param.endMin)){
                setErrText("시작하는 시간과 끝나는시간이 같습니다.");
            } else {
                insertList(param,dataline);
            }
        }
    }

    const checkUpInsertDate = async (param,dataline) => {
        let sIndex = 0;

        for await (const iterator of listData) {
            if(parseInt(iterator.day_of_week) === 7){
                sIndex += 1;
            }
        }
        if(sIndex > 0){
            setErrText("중복되는 요일이 존재합니다.");
        } else {
            if((param.startHour + param.startMin) === (param.endHour + param.endMin)){
                setErrText("시작하는 시간과 끝나는시간이 같습니다.");
            } else {
                const result = await insertDateList(param,dataline);
                return result;
            }
        }
    }

    const insertList = async (param,dataline) => {
        let temp = "under";
        if(parseInt(param.endHour) > 24){
            temp = "over"
        }

        if (parseInt(param.sEachDayValue) > 7 && parseInt(param.sEachDayValue) < 9){
            await rollingDate(6,temp,"weekday",param);
        } else if (parseInt(param.sEachDayValue) > 8 && parseInt(param.sEachDayValue) < 10){
            await rollingDate(2,temp,"saturday",param);
        } else if (parseInt(param.sEachDayValue) > 9 && parseInt(param.sEachDayValue) < 11){
            await rollingDate(2,temp,"sunday",param);
        } else {
            await rollingDate(2,temp,"everyDay",param);
        }
    }

    const insertDateList = async (param,dataline) => {
        let temp = "under";
        if(parseInt(param.endHour) > 24){
            temp = "over"
        }

        const result = await rollingDay(temp,param,dataline);
        return result;
    }

    const rollingDate = async (loopCountX,xIndex,aIndex,param) => {
        let isProcess = false;
        let xData = [];
        let tempHour = param.endHour;
        tempHour = await parseInt(tempHour) - 24;
        const generator1 = await generaterAsync(loopCountX);
        for await (const x of generator1) {
            let isLargeNumber = (element) => element.value === parseInt(x);
            if(xIndex === "over"){
                const generator2 = await generaterAsync2();
                for await (const i of generator2) {
                    let result = {};
                    if(aIndex === "weekday"){
                        result = await weekdayBraces(xIndex,i,tempHour,x,isLargeNumber,param);
                    } else if (aIndex === "sunday") {
                        result = await sundayBraces(xIndex,i,tempHour,param);
                    } else if (aIndex === "saturday") {
                        result = await saturdayBraces(xIndex,i,tempHour,param);
                    } else if (aIndex === "everyDay") {
                        result = await everyDayBraces(xIndex,i,tempHour,param);
                    }
                    const validation = await validateData(result,listData);
                    if(validation < 1){
                        xData.push(result);
                    }
                }
                if (xData.length < 2) {
                    setErrText("중복되는 시간이 존재합니다");
                    break;
                }
            } else {
                let result = {};
                if(aIndex === "weekday"){
                    result = await weekdayBraces(xIndex,null,tempHour,x,isLargeNumber,param);
                } else if (aIndex === "sunday") {
                    result = await sundayBraces(xIndex,null,tempHour,param);
                } else if (aIndex === "saturday") {
                    result = await saturdayBraces(xIndex,null,tempHour,param);
                } else if (aIndex === "everyDay") {
                    result = await everyDayBraces(xIndex,null,tempHour,param);
                }
                const validation = await validateData(result,listData);
                if(validation < 1){
                    xData.push(result);
                } else {
                    setErrText("중복되는 시간이 존재합니다");
                    break;
                }
            }
        }

        if(aIndex !== "weekday"){
            if((xIndex === "over" && xData.length === 2) || (xIndex !== "over" && xData.length === 1)) {
                isProcess = true;
            }
        } else {
            if((xIndex === "over" && xData.length === 10) || (xIndex !== "over" && xData.length === 5)) {
                isProcess = true;
            }
        }

        await insert([...listData,...xData]);
    }

    const rollingDay = async (xIndex,param,dataline) => {
        let sNm = 0;
        let isLargeNumber;
        let isProcess = false;
        let xData = [];
        let tempHour = param.endHour;
        tempHour = parseInt(tempHour) - 24;
        if(xIndex === "over"){
            const generator2 = await generaterAsync2();
            for await (const iCount of generator2) {
                let temp = {};
                if(parseInt(iCount) > 0){
                    if(param.sDayValue.toString() === "0"){
                        isLargeNumber = "월요일";
                        sNm = (parseInt(param.sDayValue) + 1).toString();
                    } else {
                        if(param.sDayValue.toString() === "6"){
                            sNm = "0";
                        } else {
                            sNm = (parseInt(param.sDayValue) + 1).toString()
                        }
                        isLargeNumber = dayList[parseInt(param.sDayValue)].name;
                    }
                    temp = {
                        key : param.sDayValue.toString() + "00:00~0" + tempHour.toString() + ":" + param.endMin,
                        day : isLargeNumber,
                        operation : "00:00~0" + tempHour.toString() + ":" + param.endMin,
                        time : param.sCongestionData,
                        day_of_week: sNm,
                        congestion_type: param.sCongestionValue,
                        opening_time: "00:00",
                        closing_time: "0" + tempHour.toString() + ":" + param.endMin,
                    }
                } else {
                    if(param.sDayValue.toString() === "0"){
                        isLargeNumber = "일요일"
                    } else {
                        isLargeNumber = dayList[parseInt(param.sDayValue) - 1].name;
                    }
                    temp = {
                        key : (parseInt(param.sDayValue) - 1).toString() + param.startHour + ":" + param.startMin + "~24:00",
                        day : isLargeNumber.toString(),
                        operation : param.startHour + ":" + param.startMin + "~24:00",
                        time : param.sCongestionData,
                        day_of_week: param.sDayValue,
                        congestion_type: param.sCongestionValue,
                        opening_time: param.startHour + ":" + param.startMin,
                        closing_time: "24:00",
                    }
                }
                const validation = await validateData(temp,listData);
                if(validation < 1){
                    xData.push(temp);
                }
            }
            if (xData.length < 2) {
                setErrText("중복되는 시간이 존재합니다");
            }
        } else {
            const temp = {
                key : param.sDayValue.toString() + param.startHour + ":" + param.startMin + "~" + param.endHour + ":" + param.endMin,
                day : param.sDayData,
                operation : param.startHour + ":" + param.startMin + "~" + param.endHour + ":" + param.endMin,
                time : param.sCongestionData,
                day_of_week: param.sDayValue,
                congestion_type: param.sCongestionValue,
                opening_time: param.startHour + ":" + param.startMin,
                closing_time: param.endHour + ":" + param.endMin,
            }
            const validation = await validateData(temp,listData);
            if(validation < 1){
                xData.push(temp);
            } else {
                setErrText("중복되는 시간이 존재합니다");
            }
        }

        if((xIndex === "over" && xData.length === 2) || (xIndex !== "over" && xData.length === 1)) {
            isProcess = true;
        }
        return xData;
    }

    const everyDayBraces = async (xIndex,iCount,tempHour,param) => {
        let temp = {};
        if(xIndex === "over"){
            if(parseInt(iCount) > 0){
                temp = {
                    key : param.sEachDayValue.toString() + "00:00~0" + tempHour.toString() + ":" + param.endMin,
                    day : param.sEachDayData,
                    operation : "00:00~0" + tempHour.toString() + ":" + param.endMin,
                    time : param.sCongestionData,
                    day_of_week: param.sEachDayValue,
                    congestion_type: param.sCongestionValue,
                    opening_time: "00:00",
                    closing_time: "0" + tempHour.toString() + ":" + param.endMin,
                }
            } else {
                temp = {
                    key : param.sEachDayValue.toString() + param.startHour + ":" + param.startMin + "~24:00",
                    day : param.sEachDayData,
                    operation : param.startHour + ":" + param.startMin + "~24:00",
                    time : param.sCongestionData,
                    day_of_week: param.sEachDayValue,
                    congestion_type: param.sCongestionValue,
                    opening_time: param.startHour + ":" + param.startMin,
                    closing_time: "24:00",
                }
            }
        } else {
            temp = {
                key : param.sEachDayValue.toString() + param.startHour + ":" + param.startMin + "~" + param.endHour + ":" + param.endMin,
                day : param.sEachDayData,
                operation : param.startHour + ":" + param.startMin + "~" + param.endHour + ":" + param.endMin,
                time : param.sCongestionData,
                day_of_week: param.sEachDayValue,
                congestion_type: param.sCongestionValue,
                opening_time: param.startHour + ":" + param.startMin,
                closing_time: param.endHour + ":" + param.endMin,
            }
        }
        return temp;
    }

    const saturdayBraces = async (xIndex,iCount,tempHour,param) => {
        let temp = {};
        if(xIndex === "over"){
            if(parseInt(iCount) > 0){
                temp = {
                    key : "000:00~0" + tempHour.toString() + ":" + param.endMin,
                    day : "일요일",
                    operation : "00:00~0" + tempHour.toString() + ":" + param.endMin,
                    time : param.sCongestionData,
                    day_of_week: 0,
                    congestion_type: param.sCongestionValue,
                    opening_time: "00:00",
                    closing_time: "0" + tempHour.toString() + ":" + param.endMin,
                }
            } else {
                temp = {
                    key : "6" + param.startHour + ":" + param.startMin + "~24:00",
                    day : "토요일",
                    operation : param.startHour + ":" + param.startMin + "~24:00",
                    time : param.sCongestionData,
                    day_of_week: 6,
                    congestion_type: param.sCongestionValue,
                    opening_time: param.startHour + ":" + param.startMin,
                    closing_time: "24:00",
                }
            }
        } else {
            temp = {
                key : "6" + param.startHour + ":" + param.startMin + "~" + param.endHour + ":" + param.endMin,
                day : "토요일",
                operation : param.startHour + ":" + param.startMin + "~" + param.endHour + ":" + param.endMin,
                time : param.sCongestionData,
                day_of_week: 6,
                congestion_type: param.sCongestionValue,
                opening_time: param.startHour + ":" + param.startMin,
                closing_time: param.endHour + ":" + param.endMin,
            }
        }
        return temp;
    }

    const sundayBraces = async (xIndex,iCount,tempHour,param) => {
        let temp = {};
        if(xIndex === "over"){
            if(parseInt(iCount) > 0){
                temp = {
                    key : "100:00~0" + tempHour.toString() + ":" + param.endMin,
                    day : "월요일",
                    operation : "00:00~0" + tempHour.toString() + ":" + param.endMin,
                    time : param.sCongestionData,
                    day_of_week: 1,
                    congestion_type: param.sCongestionValue,
                    opening_time: "00:00",
                    closing_time: "0" + tempHour.toString() + ":" + param.endMin,
                }
            } else {
                temp = {
                    key : "0" + param.startHour + ":" + param.startMin + "~24:00",
                    day : "일요일",
                    operation : param.startHour + ":" + param.startMin + "~24:00",
                    time : param.sCongestionData,
                    day_of_week: 0,
                    congestion_type: param.sCongestionValue,
                    opening_time: param.startHour + ":" + param.startMin,
                    closing_time: "24:00",
                }
            }
        } else {
            temp = {
                key : "0" + param.startHour + ":" + param.startMin + "~" + param.endHour + ":" + param.endMin,
                day : "일요일",
                operation : param.startHour + ":" + param.startMin + "~" + param.endHour + ":" + param.endMin,
                time : param.sCongestionData,
                day_of_week: 0,
                congestion_type: param.sCongestionValue,
                opening_time: param.startHour + ":" + param.startMin,
                closing_time: param.endHour + ":" + param.endMin,
            }
        }
        return temp;
    }

    const weekdayBraces = async (xIndex,iCount,tempHour,xCount,isLargeNumber,param) => {
        let iLargeNumber = isLargeNumber;
        let temp = {};
        if(xIndex === "over"){
            if(parseInt(iCount) > 0){
                iLargeNumber = (element) => element.value === (parseInt(xCount) + 1);
                temp = {
                    key : (parseInt(xCount) + 1).toString() + "00:00~0" + tempHour.toString() + ":" + param.endMin,
                    day : dayList[dayList.findIndex(iLargeNumber)].name,
                    operation : "00:00~0" + tempHour.toString() + ":" + param.endMin,
                    time : param.sCongestionData,
                    day_of_week: parseInt(xCount) + 1,
                    congestion_type: param.sCongestionValue,
                    opening_time: "00:00",
                    closing_time: "0" + tempHour.toString() + ":" + param.endMin,
                }
            } else {
                temp = {
                    key : xCount.toString() + param.startHour + ":" + param.startMin + "~24:00",
                    day : dayList[dayList.findIndex(iLargeNumber)].name,
                    operation : param.startHour + ":" + param.startMin + "~24:00",
                    time : param.sCongestionData,
                    day_of_week: parseInt(xCount),
                    congestion_type: param.sCongestionValue,
                    opening_time: param.startHour + ":" + param.startMin,
                    closing_time: "24:00",
                }
            }
        } else {
            temp = {
                key : xCount.toString() + param.startHour + ":" + param.startMin + "~" + param.endHour + ":" + param.endMin,
                day : dayList[dayList.findIndex(iLargeNumber)].name,
                operation : param.startHour + ":" + param.startMin + "~" + param.endHour + ":" + param.endMin,
                time : param.sCongestionData,
                day_of_week: parseInt(xCount),
                congestion_type: param.sCongestionValue,
                opening_time: param.startHour + ":" + param.startMin,
                closing_time: param.endHour + ":" + param.endMin,
            }
        }
        return temp;
    }

    const validateData = async (qList,lDate) => {
        let oResult = 0;
        if(lDate.length > 0){
            for await (const iterator of lDate) {
                if(iterator.day === qList.day){
                    if(((parseInt(qList.opening_time) || 0) === 0 && (parseInt(qList.closing_time) || 0) === 0)){
                        oResult = oResult + 1;
                    } else {
                        const iStartTime = moment(iterator.opening_time,"HH:mm");
                        const iEndTime = moment(iterator.closing_time,"HH:mm");
                        const openTime = moment(qList.opening_time,"HH:mm");
                        const endTime = moment(qList.closing_time,"HH:mm");
                        if(iterator.opening_time === iterator.closing_time){
                            oResult = oResult + 1;
                        } else if(iterator.closing_time === qList.opening_time){

                        } else {
                            if(iEndTime === endTime){
                                oResult = oResult + 1;
                            } else {
                                if(!moment(iEndTime).isBefore(openTime)){
                                    if (!moment(endTime).isBefore(iStartTime)){
                                        if(qList.closing_time !== iterator.opening_time){
                                            oResult = oResult + 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return oResult
    }

    const insert = async (key) => {
        operationList.current = await key
        setListData(operationList.current);
        setErrText("");
       
    }

    const deleteList = async (key) => {
        operationList.current = operationList.current.filter((item) => item.key.toString() !== key.toString());
        setListData(operationList.current);
    }

    useEffect(() => {
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
        <View style={{flex:1, backgroundColor: "#fff"}}>
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
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>영업시간을 설정해주세요.</Text>
                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.6), color: "#95959E" }}>BREAK TIME은 빼고 주문 가능한 시간만 설정해주세요.</Text>
            </View>
            
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <ScrollView style={{flex:1}}>
                    {errText !== "" &&
                        <View style={{height: height * 0.06, width, backgroundColor: "#fff", justifyContent: "center", marginLeft: "5%", borderRadius: width * 0.02}}>
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#EF4452" }}>{errText}</Text>
                        </View>
                    }
                    <View style={{height: height * 0.12, justifyContent: "flex-start", alignItems: "flex-end", paddingTop: "5%", paddingRight: "5%"}}>
                        <TouchableOpacity onPress={() => openOperationModal()} style={{height: height * 0.06, width: width * 0.9, backgroundColor: "#E8EFFC", justifyContent: "center", alignItems: "center", borderRadius: width * 0.02}}>
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#6490E7" }}>+ 영업시간 추가하기</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{height: height * 0.05, backgroundColor: "#F2F3F5", flexDirection: "row", width: width * 0.9, marginLeft: "5%", borderRadius: width * 0.01}}>
                        <View style={{width: "20%", height: "100%", justifyContent: "center", alignItems: "center"}}>
                            <Text style={{ fontSize: RFPercentage(1.8), fontWeight: '600', color: '#6B7583' }}>요일</Text>
                        </View>
                        <View style={{width: "45%", height: "100%", justifyContent: "center", alignItems: "flex-start", paddingLeft: "5%"}}>
                            <Text style={{ fontSize: RFPercentage(1.8), fontWeight: '600', color: '#6B7583' }}>영업시간</Text>
                        </View>
                        <View style={{width: "15%", height: "100%", justifyContent: "center", alignItems: "center"}}>
                            <Text style={{ fontSize: RFPercentage(1.8), fontWeight: '600', color: '#6B7583' }}>준비시간</Text>
                        </View>
                        <View style={{width: "20%", height: "100%", justifyContent: "center", alignItems: "center"}}>
                            <Text style={{ fontSize: RFPercentage(1.5), fontWeight: '600', color: '#6B7583' }}></Text>
                        </View>
                    </View>
                    {listData.length > 0 ? 
                        <>
                            {listData.map((frontSData,frontSIndex) => {
                                return (
                                    <View key={frontSIndex} style={{height: height * 0.06, backgroundColor: "#fff", flexDirection: "row", width: width * 0.9, marginLeft: "5%", borderRadius: width * 0.01}}>
                                        <View style={{width: "20%", height: "100%", justifyContent: "center", alignItems: "center"}}>
                                            <Text style={{ fontSize: RFPercentage(1.9), fontWeight: '700', color: '#3B3B46' }}>{frontSData.day}</Text>
                                        </View>
                                        <View style={{width: "45%", height: "100%", justifyContent: "center", alignItems: "flex-start", paddingLeft: "5%"}}>
                                            <Text style={{ fontSize: RFPercentage(1.9), fontWeight: '700', color: '#3B3B46' }}>{frontSData.operation}</Text>
                                        </View>
                                        <View style={{width: "15%", height: "100%", justifyContent: "center", alignItems: "center"}}>
                                            <Text style={{ fontSize: RFPercentage(1.9), fontWeight: '700', color: '#3B3B46' }}>{frontSData.time}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => deleteList(frontSData.key)} style={{width: "20%", height: "100%", justifyContent: "center", alignItems: "center"}}>
                                            <ComponentDeleteTimeLine iHeight={height * 0.04} iWidth={width * 0.05} iColor={"#646970"}/>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                        </>
                    :
                        <View style={{height: height * 0.1, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#bbb"}}>매장의 영업시간을 추가해주세요</Text>
                        </View>
                    }
                    <View style={{ height: height * 0.1 }} />
                </ScrollView>
            </View>
            {listData.length > 0 &&
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
            }
            {loading &&
                <View style={{position: "absolute", top: 0, height, width, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
        </View>
    )
}

export default StoreOperationTime;