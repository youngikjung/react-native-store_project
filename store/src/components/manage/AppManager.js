import React, { useRef, useEffect, useState } from 'react';
import { Platform, Dimensions } from 'react-native';
import axios from 'axios';
import Sound from 'react-native-sound';
import SystemSetting from 'react-native-system-setting';
import messaging from '@react-native-firebase/messaging';
import { USBPrinter, BLEPrinter } from "react-native-thermal-receipt-printer";
import columnify from 'columnify';
import { useBackHandler } from '@react-native-community/hooks';
import moment from 'moment-timezone';
import 'moment/locale/ko';

import WebSocketClient from '../../lib/WebSocketClient';

import * as RootNavigation from '../../routes/RootNavigatorRef';
import {AppRoute} from '../../routes/AppRoutes';

import ReducerSetter from '../../components/manage/ReducerSetter';
import AppModal from './AppModal';
import AppDrawer from './AppDrawer';
import GlobalVar from '../../utils/globalvar';
import CONSTANTS from '../../config/constants';

import { CompModalOrderAlert } from '../modal/AppModalContent';

let oSoundOrderNew;
let bSoundOrderNewIsPlaying = false;
let bHasOrderNew = false;

let oSoundUserNearby;
let bSoundUserNearbyIsPlaying = false;
let bHasUserNearby = false;

let oSoundUserArrived;
let bSoundUserArrivedIsPlaying = false;
let bHasUserArrived = false;

let iOriginalSystemVolume;

const iReceipt = `
<CM>[스루] 고객 근접 알림</CM>       

================================
현재시각    : ${moment().format("YYYY-MM-DD HH:mm")}
        
<CD>고객님이 매장에 곧 도착합니다</CD>  

================================
.
.
.
`;

const cReceipt = `
<CM>[스루] 고객 도착 알림</CM>        

================================
현재시각    : ${moment().format("YYYY-MM-DD HH:mm")}
        
<CD>고객님이 픽업존에 도착했습니다</CD>  

================================
.
.
.
`;

const sReceipt = `
<CM>[스루] 테스트 영수증</CM>       

================================
주문시간    : ${moment().format("YYYY-MM-DD")}
        
<CD>테스트</CD>  

================================
`;

const newReceipt = `
<CM>[스루] 주문 접수요청</CM>       

================================
<CD>지금 바로 스루스토어에서</CD>  
<CD>주문확인 부탁드립니다</CD>  

================================
.
.
.
`;
const { width, height } = Dimensions.get('window');

const AppManager = oProps => {
    let oSavedRouteParams = {};

    const oAppModal = useRef();
    const oAppDrawer = useRef();
    const oReducerSetter = useRef();
    const usbPrinters = useRef();
    const bluePrinters = useRef();

    const getPaymentApiUrl = () => {
        return CONSTANTS.PAYMENT_API_URL;
    }

    const fnNavGoTo = (sType, sUrl, oParams) => {
        oSavedRouteParams = oParams;
        if (oParams !== undefined && oParams.hasOwnProperty('oInitialProps')) {
            delete oParams['oInitialProps'];
        }

        if (RootNavigation !== undefined) {
            if (sType !== undefined && sType === 'reset') {
                RootNavigation.reset({
                    index: 0,
                    routes: [{name: sUrl, params: oParams}],
                });
            } else if (sType !== undefined && sType === 'push') {
                RootNavigation.push(sUrl, oParams);
            } else if (sType !== undefined && sType === 'drawer') {
                RootNavigation.navigate(AppRoute.DRAWERNAV, {
                    screen: sUrl,
                    params: oParams,
                });
            } else if (sType !== undefined && sType === 'mainnav') {
                RootNavigation.navigate(AppRoute.MAINNAV, {
                    screen: sUrl,
                    params: oParams,
                });
            } else if (sType !== undefined && sType === 'goback') {
                RootNavigation.doGoback(oParams);
            } else if (sUrl !== undefined) {
                RootNavigation.navigate(sUrl, oParams);
            }
        }
    };

    const fnHideModal = () => {
        if (oAppModal.current != undefined) {
            oAppModal.current._refHideModal();
        }
    }

    const fnShowModal = (bBoolean, ViewComponent, sTemplate, sTimeoutSec) => {
        if (oAppModal.current != undefined) {
            oAppModal.current._refShowModal(bBoolean, ViewComponent, sTemplate, sTimeoutSec);
        }
    }

    const fnHideDrawer = () => {
        if (oAppDrawer.current != undefined) {
            oAppDrawer.current._refHideDrawer();
        }
    }
    const fnShowDrawer = (bBoolean, ViewComponent, sTemplate, sTimeoutSec) => {
        if (oAppDrawer.current != undefined) {
            oAppDrawer.current._refShowDrawer(bBoolean, ViewComponent, sTemplate, sTimeoutSec);
        }
    }

    const fnAxios = async (sUrl, sMethod, sHeader, oData, oPath) => {
        let sGetApiUrl = CONSTANTS.API_URL;
        let sConnectUrl = sUrl;

        if(oPath !== undefined && oPath !== null && oPath !== ""){
            sGetApiUrl = CONSTANTS.API_POS_URL;
        }

        if (sConnectUrl.indexOf('http') == -1) {
            sConnectUrl = sGetApiUrl + sConnectUrl;
        }
        let oUserConfig = oReducerSetter.current._refGetUserConfig();
        let oDefHeader = {
            'Content-Type': 'application/json',
        };
        if (sHeader !== undefined && sHeader !== null && typeof sHeader === 'string') {
            if (sHeader === 'login') {
                if(sMethod === "post"){
                    oDefHeader = {
                        Authorization: oUserConfig.Token,
                        'Content-Type': 'application/json',
                        'refresh-token': oUserConfig.RefreshToken,
                    };
                } else {
                    oDefHeader = {
                        Authorization: oUserConfig.Token,
                        'Content-Type': 'text/plain',
                        'refresh-token': oUserConfig.RefreshToken,
                    };
                }
            } else if (sHeader == 'multipart') {
                oDefHeader = {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                };
            } else if (sHeader === 'text') {
                oDefHeader = {
                    'Content-Type': 'text/plain',
                };
            }
        }
        try {
            const oResponse = await axios({
                url: sConnectUrl,
                method: sMethod,
                timeout: 15 * 1000,
                headers: oDefHeader,
                data: oData,
                transformResponse: [
                    data => {
                        return data;
                    },
                ],
            });

            if (oResponse !== undefined && oResponse.name !== undefined && oResponse.name.toLowerCase() === 'error') {
                if (oResponse.message !== undefined && oResponse.message.toLowerCase().indexOf('401') !== -1) {}
            }
            if (oResponse.headers !== undefined && oResponse.headers['refreshed-token'] !== undefined) {}
            if (oResponse !== undefined && oResponse.data !== undefined) {
                return JSON.parse(oResponse.data);
            } else {
                return false;
            }
        } catch (err) {
            if (err.message.toLowerCase().indexOf('401') !== -1) {}
        }
    };

    const fnSetReduxUserConfig = oUserConfigData => {
        if (oReducerSetter.current !== undefined) {
            oReducerSetter.current._refSetUserConfig(oUserConfigData);
        }
        return false;
    };

    const fnGetReduxUserConfig = () => {
        if (oReducerSetter.current !== undefined) {
            return oReducerSetter.current._refGetUserConfig();
        }
        return false;
    };

    const fnGetReduxUserBasket = () => {
        if (oReducerSetter.current !== undefined) {
            return oReducerSetter.current._refGetUserBasket();
        }
        return false;
    };

    const fnSetReduxUserBasket = oUserBasketData => {
        oReducerSetter.current._refSetUserBasket(oUserBasketData);
    };

    const fnStopSound = async (sType) => {
        if (sType === 'new-order') {
            bHasOrderNew = false;
            if(oSoundOrderNew !== undefined && oSoundOrderNew !== null){
                oSoundOrderNew.stop( async (res) => {
                    if(res){
                        SystemSetting.setVolume(0, { type: 'music', playSound: false, showUI: false });
                    }
                });
                
            }
        } else if (sType === 'customer-arrived') {
            bHasUserArrived = false;
            if(oSoundUserArrived !== undefined && oSoundUserArrived !== null){
                oSoundUserArrived.stop( async (res) => {
                    if(res){
                        SystemSetting.setVolume(0, { type: 'music', playSound: false, showUI: false });
                    }
                });
            }
        } else if (sType === 'customer-nearby') {
            bHasUserNearby = false;
            if(oSoundUserNearby !== undefined && oSoundUserNearby !== null){
                oSoundUserNearby.stop( async (res) => {
                    if(res){
                        SystemSetting.setVolume(0, { type: 'music', playSound: false, showUI: false });
                    }
                });
            }
        }
    }

    const fnLogOut = async () => {
        let oResult = false;

        try {
            let oUserConfig = {};
            oUserConfig['activate'] = false;
            oUserConfig['AutoLogin'] = false;
            oUserConfig['LoginId'] = "";
            oUserConfig['LoginPw'] = "";
            oUserConfig['Token'] = "";
            oUserConfig['RefreshToken'] = "";
            oUserConfig['UserPushToken'] = "";
            oUserConfig['uniqueId'] = "";
            oUserConfig['AppPushStatus'] = true;

            oUserConfig['StoreID'] = 0;
            oUserConfig['BusinessType'] = "";
            oUserConfig['StoreName'] = "";
            oUserConfig['StoreOwner'] = "";

            oUserConfig['ACTIVATION'] = false;
            oUserConfig['MENU'] = false;
            oUserConfig['STOREOPERATIONTIME'] = false;
            oUserConfig['STOREPICKUPZONEDETAIL'] = false;
            oUserConfig['STOREPICKUPIMAGE'] = false;
            oUserConfig['STOREPICKUPZONE'] = false;
            oUserConfig['STOREHOLIDAY'] = false;
            oUserConfig['STORELOGO'] = false;
            oUserConfig['STOREIMAGES'] = false;
            oUserConfig['STOREORDERTIME'] = false;
            oUserConfig['STOREORIGINNOTICE'] = false;
            oUserConfig['STOREINFOMATION'] = false;
            oUserConfig['OWNERACCOUNT'] = false;
            oUserConfig['STORETYPE'] = false;
            oUserConfig['STORENOTICE'] = false;
            oUserConfig['STOREALERT'] = false;

            oUserConfig['SOUNDVOLUME'] = 1;
            oUserConfig['QUITSOUND'] = false;

            oUserConfig['BOOKMARKONE'] = "";
            oUserConfig['BOOKMARKTWO'] = "";
            oUserConfig['BOOKMARKTHREE'] = "";
            oUserConfig['BOOKMARKCOUNTONE'] = 0;
            oUserConfig['BOOKMARKCOUNTTWO'] = 0;
            oUserConfig['BOOKMARKCOUNTTHREE'] = 0;
            oUserConfig['BOOKMARKROUTEONE'] = "";
            oUserConfig['BOOKMARKROUTETWO'] = "";
            oUserConfig['BOOKMARKROUTETHREE'] = "";

            await oReducerSetter.current._refSetUserConfig(oUserConfig);
            await WebSocketClient.disconnect();
            oResult = true;

        } catch (error) {
        }

        return oResult;
    }

    const fnPlaySound = (sType) => {
        SystemSetting.setVolume(1, { type: 'music', playSound: false, showUI: false });
        if (sType === 'new-order' && oSoundOrderNew !== undefined) {
            bHasOrderNew = true;
            if (bSoundOrderNewIsPlaying === true) {
                return;
            }

            oSoundOrderNew.play((success) => {
                bSoundOrderNewIsPlaying = true;
                if (success) {
                    bSoundOrderNewIsPlaying = false;
                }
            });
        } else if (sType === 'customer-arrived' && oSoundUserArrived !== undefined) {
            bHasUserArrived = true;
            if (bSoundUserArrivedIsPlaying === true) {
                return;
            }

            oSoundUserArrived.play((success) => {
                bSoundUserArrivedIsPlaying = true;
                if (success) {
                    bSoundUserArrivedIsPlaying = false;
                }
            });
        } else if (sType === 'customer-nearby' && oSoundUserNearby !== undefined) {
            bHasUserNearby = true;
            if (bSoundUserNearbyIsPlaying === true) {
                return;
            }

            oSoundUserNearby.play((success) => {
                bSoundUserNearbyIsPlaying = true;
                if (success) {
                    bSoundUserNearbyIsPlaying = false;
                }
            });
        }
    }

    const testPrinter = async (printerOption) => {
        let preReceipt = sReceipt;
        let oUserConfig = oReducerSetter.current._refGetUserConfig();
        let sNm = oUserConfig.USB_PRINTER_DEVICENAME;
        let sPid = oUserConfig.USB_PRINTER_PRODUCTID;
        let sVid = oUserConfig.USB_PRINTER_VENDERID;
        let sType = oUserConfig.PRINTERTYPE;
        let oPrintOptions = {
            beep: false,
            cut: true,
            tailingLine: false
        }

        if(printerOption !== undefined && printerOption !== null && printerOption !== ""){
            preReceipt = newReceipt;
        }
        if(sType !== undefined && sType !== null && sType !== ""){
            if(sType === "usb"){
                oPrintOptions = {
                    beep: false,
                    cut: true,
                    encoding: 'EUC-KR',
                    tailingLine: false
                }
                if(Platform.OS == 'android'){
                    await USBPrinter.init().then(async ()=> {
                        try {
                            await USBPrinter.getDeviceList().then( async (data) => {
                                if(sNm !== undefined && sNm !== null && sNm !== "" && sPid !== undefined && sPid !== null && sPid !== "" && sVid !== undefined && sVid !== null && sVid !== ""){
                                    if(data !== undefined && data !== null && data.length > 0){
                                        for await (const iterator of data) {
                                            let tempNm = iterator.device_name;
                                            if(tempNm.toString() === sNm.toString()){
                                                if (!isNaN(parseInt(sVid)) && !isNaN(parseInt(sPid))) {
                                                    await USBPrinter.connectPrinter(parseInt(sVid), parseInt(sPid))
                                                                    .then(async (data) => {
                                                                        USBPrinter.printBill(preReceipt, oPrintOptions)
                                                                                  .then(async (res) => {
                                                                                  })
                                                                                  .catch((error) => {});
                                                                    })
                                                                    .catch((error) => {});
                                                }
                                            }
                                        }
                                    } else {
                                        let oUserConfig = {};
                                        oUserConfig['PRINTERTYPE'] = "";
                                        oUserConfig['USB_PRINTER_VENDERID'] = "";
                                        oUserConfig['USB_PRINTER_DEVICENAME'] = "";
                                        oUserConfig['USB_PRINTER_PRODUCTID'] = "";
                                        oReducerSetter.current._refSetUserConfig(oUserConfig);
                                    }
                                }
                            });
                        } catch (error) {
                            usbPrinters.current = [];
                        }
                    })
                }
            } else {
                await BLEPrinter.init().then(async () => {
                    try {
                        await BLEPrinter.getDeviceList().then( async (data) => {
                            if(sNm !== undefined && sNm !== null && sNm !== "" && sPid !== undefined && sPid !== null && sPid !== "" && sVid !== undefined && sVid !== null && sVid !== ""){
                                if(data !== undefined && data !== null && data.length > 0){
                                    for await (const iterator of data) {
                                        let tempNm = iterator.device_name;
                                        if(tempNm.toString() === sNm.toString()){
                                            await BLEPrinter.connectPrinter(sVid)
                                                            .then((data) => {
                                                                BLEPrinter.printBill(preReceipt, oPrintOptions);
                                                            })
                                                            .catch((error) => {});
                                        }
                                    }
                                } else {
                                    let oUserConfig = {};
                                    oUserConfig['PRINTERTYPE'] = "";
                                    oUserConfig['USB_PRINTER_VENDERID'] = "";
                                    oUserConfig['USB_PRINTER_DEVICENAME'] = "";
                                    oUserConfig['USB_PRINTER_PRODUCTID'] = "";
                                    oReducerSetter.current._refSetUserConfig(oUserConfig);
                                }
                            }
                        });
                    } catch (error) {
                        bluePrinters.current = [];
                    }
                });
            }
        }
    }

    const fnPrinterBill = async (oOrderList) => {
        let oUserConfig = oReducerSetter.current._refGetUserConfig();
        let sType = oUserConfig.PRINTERTYPE;
        let sNm = oUserConfig.USB_PRINTER_DEVICENAME;
        let sPid = oUserConfig.USB_PRINTER_PRODUCTID;
        let sVid = oUserConfig.USB_PRINTER_VENDERID;
        let iColASize = 20;
        let iColBSize = 6;
        let iColCSize = 11;
        let iPrdLines = '';
        let sPrdLines = "";
        let sReceipt = "";
        let iNm = "";
        let iPid = "";
        let iVid = "";
        let iSwitchOn = false;
        let iConnected = "";
        let oPrintOptions = {
            beep: false,
            cut: true,
            tailingLine: false
        }
        if(sType !== undefined && sType !== null && sType !== "" && sVid !== undefined && sVid !== null && sVid !== ""){
            if(Platform.OS == 'android'){
                let aOrderPrdList = oOrderList.optionList;
                let iHeaders = columnify([
                    {
                        titlea: '메뉴명',
                        titleb: '수량',
                        titlec: '금액'
                    }
                ], {
                    paddingChr: ' ',
                    columnSplitter: ' ',
                    config: {
                        titlea: { minWidth: iColASize, maxWidth: iColASize, showHeaders: false },
                        titleb: { minWidth: iColBSize, maxWidth: iColBSize, align: 'right', showHeaders: false },
                        titlec: { minWidth: iColCSize, maxWidth: iColCSize, align: 'right', showHeaders: false }
                    }
                });
                let aHeaders = iHeaders.split('\n').slice(1);
                let sHeaders = aHeaders.join('\n');

                if (aOrderPrdList != undefined && aOrderPrdList.length > 0) {
                    let aPrd = [];
                    for await (const oOrdPrd of aOrderPrdList) {
                        let oPrd = {
                            titlea: oOrdPrd['prd_name'],
                            titleb: oOrdPrd['prd_quantity'],
                            titlec: oOrdPrd['prd_total_price_show'] + '원'
                        };
                        aPrd.push(oPrd);
                        if (oOrdPrd.options != undefined && oOrdPrd.options.length > 0) {
                            let oOptionItem = {};
                            for await (let oOptions of oOrdPrd.options) {
                                oOptionItem = {}
                                oOptionItem['titlea'] = '+' + oOptions['option_name'];
                                oOptionItem['titleb'] = '';
                                oOptionItem['titlec'] = (oOptions['option_price_show'] || 0) + '원';
                                aPrd.push(oOptionItem);
                            }
                        }
                    }

                    iPrdLines = columnify(aPrd, {
                        paddingChr: ' ',
                        columnSplitter: ' ',
                        config: {
                            titlea: { minWidth: 22, maxWidth: 22, showHeaders: false },
                            titleb: { minWidth: 4, maxWidth: 4, align: 'right', showHeaders: false },
                            titlec: { minWidth: 11, maxWidth: 11, align: 'right', showHeaders: false }
                        }
                    });

                    let aPrdLines = iPrdLines.split('\n').slice(1);
                    sPrdLines = aPrdLines.join('\n');
                }

                let aSubtotal = [];
                aSubtotal.push({
                    titlea: '',
                    titleb: '총금액',
                    titlec: '' + oOrderList.order_total_amount_org_show.toString() + '원'
                });

                // Check for discount
                if (parseFloat(oOrderList.order_discount_amount) !== 0) {
                    aSubtotal.push({
                        titlea: '',
                        titleb: '할인',
                        titlec: '' + oOrderList.order_discount_amount_show.toString() + '원'
                    });
                }

                let iSubtotal = columnify(aSubtotal, {
                    paddingChr: ' ',
                    columnSplitter: ' ',
                    config: {
                        titlea: { minWidth: iColASize, maxWidth: iColASize, showHeaders: false },
                        titleb: { minWidth: iColBSize, maxWidth: iColBSize, align: 'right', showHeaders: false },
                        titlec: { minWidth: iColCSize, maxWidth: iColCSize, align: 'right', showHeaders: false }
                    }
                });

                let aSubtotalContent = iSubtotal.split('\n').slice(1);
                let sSubtotal = aSubtotalContent.join('\n');

                let iTotal = columnify([
                    {
                        titlea: '총결제금액',
                        titleb: '',
                        titlec: '' + (parseInt(oOrderList.order_total_amount_incl) < 0 ? '0' : oOrderList.order_total_amount_show.toString()) + '원'
                    }
                ], {
                    paddingChr: ' ',
                    columnSplitter: ' ',
                    config: {
                        titlea: { minWidth: iColASize, maxWidth: iColASize, showHeaders: false },
                        titleb: { minWidth: iColBSize, maxWidth: iColBSize, align: 'right', showHeaders: false },
                        titlec: { minWidth: iColCSize, maxWidth: iColCSize, align: 'right', showHeaders: false }
                    }
                });

                let aTotal = iTotal.split('\n').slice(1);
                const sTotal = aTotal.join('\n');
                const sOrderDate = oOrderList.order_created_at;
                const sOrderNr = oUserConfig.StoreID + oOrderList.order_nr.toString() + '-' + oOrderList.uuid.slice(-4);
                const sOrderArrival = oOrderList.arrival_norm;
                const sPhoneNr = oOrderList.user_phone_number;
                const sInquiry = oOrderList.inquiry;
                const sCarLicenseNr = oOrderList.pickup_type === "2" ? "픽업" : oOrderList.car_nr;
                if(sType === "usb"){
sReceipt = `

<CM>[스루] 주문이 접수되었습니다</CM>       

=======================================
주문시간    : ${sOrderDate}
주문번호    : ${sOrderNr}
도착예정    : ${sOrderArrival}
전화번호    : ${sPhoneNr}
요청사항    : ${sInquiry}

<CD>${sCarLicenseNr}</CD>  

=======================================
${sHeaders}
=======================================
${sPrdLines}
=======================================
${sSubtotal}
=======================================
<M>${sTotal}</M>
=======================================
.
.
.
`;
                    oPrintOptions = {
                        beep: false,
                        cut: true,
                        encoding: 'EUC-KR',
                        tailingLine: false
                    }
                    try {
                        await USBPrinter.init().then(async ()=> {
                            try {
                                await USBPrinter.getDeviceList().then( async (data) => {
                                    if(sNm !== undefined && sNm !== null && sNm !== "" && sPid !== undefined && sPid !== null && sPid !== "" && sVid !== undefined && sVid !== null && sVid !== ""){
                                        if(data !== undefined && data !== null && data.length > 0){
                                            try {
                                                if (!isNaN(parseInt(sVid)) && !isNaN(parseInt(sPid))) {
                                                    await USBPrinter.connectPrinter(parseInt(sVid), parseInt(sPid)).then(async (data) => {
                                                        try {
                                                            USBPrinter.printBill(sReceipt, oPrintOptions);
                                                            iSwitchOn = true;
                                                            iConnected = "connected";
                                                        } catch (err) {
                                                            iConnected = "need";
                                                        }
                                                    }).catch((error) => {
                                                        iConnected = "need";
                                                    });
                                                }
                                            } catch (error) {
                                                iConnected = "need";
                                            }

                                            if(iConnected === "need"){
                                                for await (const iterator of data) {
                                                    if(iterator.vendor_id !== undefined && iterator.product_id !== undefined){
                                                        let tempId = iterator.vendor_id;
                                                        let tempNm = iterator.device_name;
                                                        let tempProductId = iterator.product_id;
                                                        try {
                                                            await USBPrinter.connectPrinter(parseInt(tempId), parseInt(tempProductId)).then(async (data) => {
                                                                try {
                                                                    USBPrinter.printBill(sReceipt, oPrintOptions);
                                                                    iSwitchOn = true;
                                                                    iConnected = "connect";
                                                                    iNm = tempNm;
                                                                    iPid = tempProductId;
                                                                    iVid = tempId;
                                                                } catch (error) {
                                                                    iSwitchOn = false;
                                                                }
                                                            }).catch((error) => {
                                                                iSwitchOn = false;
                                                            });
                                                        } catch (error) {
                                                            iSwitchOn = false;
                                                        }
                                                    }
                                                }
                                            }
                                        } else {
                                            iSwitchOn = false;
                                        }
                                    }
                                });
                            } catch {
                                iSwitchOn = false;
                            }
                        })
                    } catch {
                        iSwitchOn = false;
                    }
                } else {
sReceipt = `

<CM>[스루] 주문이 접수되었습니다</CM>       

================================
주문시간    : ${sOrderDate}
주문번호    : ${sOrderNr}
도착예정    : ${sOrderArrival}
전화번호    : ${sPhoneNr}
요청사항    : ${sInquiry}

<CD>${sCarLicenseNr}</CD>  

================================
${sHeaders}
================================
${sPrdLines}
================================
${sSubtotal}
================================
<M>${sTotal}</M>
================================
.
.
.
`;
                    try {
                        await BLEPrinter.init().then(async () => {
                            try {
                                await BLEPrinter.getDeviceList().then( async (data) => {
                                    if(sNm !== undefined && sNm !== null && sNm !== "" && sPid !== undefined && sPid !== null && sPid !== "" && sVid !== undefined && sVid !== null && sVid !== ""){
                                        if(data !== undefined && data !== null && data.length > 0){
                                            try {
                                                await BLEPrinter.connectPrinter(sVid).then((data) => {
                                                    try {
                                                        BLEPrinter.printBill(sReceipt, oPrintOptions);
                                                        iSwitchOn = true;
                                                        iConnected = "connected";
                                                    } catch (error) {
                                                        iConnected = "need";
                                                    }
                                                }).catch((error) => {
                                                    iConnected = "need";
                                                });
                                            } catch (error) {
                                                iConnected = "need";
                                            }

                                            if(iConnected === "need"){
                                                for await (const iterator of data) {
                                                    let tempId = iterator.inner_mac_address;
                                                    let tempNm = iterator.device_name;
                                                    try {
                                                        if(tempId !== undefined){
                                                            await BLEPrinter.connectPrinter(tempId).then((data) => {
                                                                try {
                                                                    BLEPrinter.printBill(sReceipt, oPrintOptions);
                                                                    iSwitchOn = true;
                                                                    iConnected = "connect";
                                                                    iNm = tempNm;
                                                                    iPid = tempId;
                                                                    iVid = tempId;
                                                                } catch (error) {
                                                                    iSwitchOn = false;
                                                                }
                                                            }).catch((error) => {
                                                                iSwitchOn = false;
                                                            });
                                                        }
                                                    } catch (error) {
                                                        iSwitchOn = false;
                                                    }
                                                }
                                            }
                                        } else {
                                            iSwitchOn = false;
                                        }
                                    }
                                });
                            } catch (error) {
                                iSwitchOn = false;
                            }
                        });
                    } catch (error) {
                        iSwitchOn = false;
                    }
                }
    
                if(!iSwitchOn && iConnected !== "connect" ){
                    resetPrinterPreset();
                }

                if(iConnected === "connect"){
                    setPrinterPreset(iNm,iPid,iVid);
                }
            }
        }
    }


    const fnCancelPrinterBill = async (oOrderList) => {
        let oUserConfig = oReducerSetter.current._refGetUserConfig();
        let sType = oUserConfig.PRINTERTYPE;
        let sNm = oUserConfig.USB_PRINTER_DEVICENAME;
        let sPid = oUserConfig.USB_PRINTER_PRODUCTID;
        let sVid = oUserConfig.USB_PRINTER_VENDERID;
        let iColASize = 20;
        let iColBSize = 6;
        let iColCSize = 11;
        let iPrdLines = '';
        let sPrdLines = "";
        let sReceipt = "";
        let iNm = "";
        let iPid = "";
        let iVid = "";
        let iSwitchOn = false;
        let iConnected = "";
        let oPrintOptions = {
            beep: false,
            cut: true,
            tailingLine: false
        }
        if(sType !== undefined && sType !== null && sType !== "" && sVid !== undefined && sVid !== null && sVid !== ""){
            if(Platform.OS == 'android'){
                let aOrderPrdList = oOrderList.optionList;
                let iHeaders = columnify([
                    {
                        titlea: '메뉴명',
                        titleb: '수량',
                        titlec: '금액'
                    }
                ], {
                    paddingChr: ' ',
                    columnSplitter: ' ',
                    config: {
                        titlea: { minWidth: iColASize, maxWidth: iColASize, showHeaders: false },
                        titleb: { minWidth: iColBSize, maxWidth: iColBSize, align: 'right', showHeaders: false },
                        titlec: { minWidth: iColCSize, maxWidth: iColCSize, align: 'right', showHeaders: false }
                    }
                });
                let aHeaders = iHeaders.split('\n').slice(1);
                let sHeaders = aHeaders.join('\n');
                if (aOrderPrdList != undefined && aOrderPrdList.length > 0) {
                    let aPrd = [];
                    for await (const oOrdPrd of aOrderPrdList) {
                        let oPrd = {
                            titlea: oOrdPrd['prd_name'],
                            titleb: oOrdPrd['prd_quantity'],
                            titlec: oOrdPrd['prd_total_price_show'] + '원'
                        };
                        aPrd.push(oPrd);
                        if (oOrdPrd.options != undefined && oOrdPrd.options.length > 0) {
                            let oOptionItem = {};
                            for await (let oOptions of oOrdPrd.options) {
                                oOptionItem = {}
                                oOptionItem['titlea'] = '+' + oOptions['option_name'];
                                oOptionItem['titleb'] = '';
                                oOptionItem['titlec'] = (oOptions['option_price_show'] || 0) + '원';
                                aPrd.push(oOptionItem);
                            }
                        }
                    }
                    iPrdLines = columnify(aPrd, {
                        paddingChr: ' ',
                        columnSplitter: ' ',
                        config: {
                            titlea: { minWidth: 22, maxWidth: 22, showHeaders: false },
                            titleb: { minWidth: 4, maxWidth: 4, align: 'right', showHeaders: false },
                            titlec: { minWidth: 11, maxWidth: 11, align: 'right', showHeaders: false }
                        }
                    });

                    let aPrdLines = iPrdLines.split('\n').slice(1);
                    sPrdLines = aPrdLines.join('\n');
                }

                let aSubtotal = [];
                aSubtotal.push({
                    titlea: '',
                    titleb: '총금액',
                    titlec: '' + oOrderList.order_total_amount_org_show.toString() + '원'
                });

                // Check for discount
                if (parseFloat(oOrderList.order_discount_amount) !== 0) {
                    aSubtotal.push({
                        titlea: '',
                        titleb: '할인',
                        titlec: '' + oOrderList.order_discount_amount_show.toString() + '원'
                    });
                }

                let iSubtotal = columnify(aSubtotal, {
                    paddingChr: ' ',
                    columnSplitter: ' ',
                    config: {
                        titlea: { minWidth: iColASize, maxWidth: iColASize, showHeaders: false },
                        titleb: { minWidth: iColBSize, maxWidth: iColBSize, align: 'right', showHeaders: false },
                        titlec: { minWidth: iColCSize, maxWidth: iColCSize, align: 'right', showHeaders: false }
                    }
                });

                let aSubtotalContent = iSubtotal.split('\n').slice(1);
                let sSubtotal = aSubtotalContent.join('\n');
                let iTotal = columnify([
                    {
                        titlea: '총취소금액',
                        titleb: '',
                        titlec: '' + (parseInt(oOrderList.order_total_amount_incl) < 0 ? '0' : oOrderList.order_total_amount_show.toString()) + '원'
                    }
                ], {
                    paddingChr: ' ',
                    columnSplitter: ' ',
                    config: {
                        titlea: { minWidth: iColASize, maxWidth: iColASize, showHeaders: false },
                        titleb: { minWidth: iColBSize, maxWidth: iColBSize, align: 'right', showHeaders: false },
                        titlec: { minWidth: iColCSize, maxWidth: iColCSize, align: 'right', showHeaders: false }
                    }
                });

                let aTotal = iTotal.split('\n').slice(1);
                let sTotal = aTotal.join('\n');
                let sOrderDate = oOrderList.order_created_at;
                let sOrderNr = oUserConfig.StoreID + oOrderList.order_nr.toString() + '-' + oOrderList.uuid.slice(-4);
                let sOrderArrival = oOrderList.arrival_norm;
                let sPhoneNr = oOrderList.user_phone_number;
                let sInquiry = oOrderList.inquiry;
                let sCarLicenseNr = oOrderList.pickup_type === "2" ? "포장" : oOrderList.car_nr;

                if(sType === "usb"){
sReceipt = `

<CM>[스루] 주문이 취소되었습니다</CM>       

=======================================
주문시간    : ${sOrderDate}
주문번호    : ${sOrderNr}
도착예정    : ${sOrderArrival}
전화번호    : ${sPhoneNr}
요청사항    : ${sInquiry}

<CD>${sCarLicenseNr}</CD>  

=======================================
${sHeaders}
=======================================
${sPrdLines}
=======================================
${sSubtotal}
=======================================
<M>${sTotal}</M>
=======================================
.
.
.
`;
                    oPrintOptions = {
                        beep: false,
                        cut: true,
                        encoding: 'EUC-KR',
                        tailingLine: false
                    }
                    try {
                        await USBPrinter.init().then(async ()=> {
                            try {
                                await USBPrinter.getDeviceList().then( async (data) => {
                                    if(sNm !== undefined && sNm !== null && sNm !== "" && sPid !== undefined && sPid !== null && sPid !== "" && sVid !== undefined && sVid !== null && sVid !== ""){
                                        if(data !== undefined && data !== null && data.length > 0){
                                            try {
                                                if (!isNaN(parseInt(sVid)) && !isNaN(parseInt(sPid))) {
                                                    await USBPrinter.connectPrinter(parseInt(sVid), parseInt(sPid)).then(async (data) => {
                                                        try {
                                                            USBPrinter.printBill(sReceipt, oPrintOptions);
                                                            iSwitchOn = true;
                                                            iConnected = "connected";
                                                        } catch (err) {
                                                            iConnected = "need";
                                                        }
                                                    }).catch((error) => {
                                                        iConnected = "need";
                                                    });
                                                }
                                            } catch (error) {
                                                iConnected = "need";
                                            }

                                            if(iConnected === "need"){
                                                for await (const iterator of data) {
                                                    if(iterator.vendor_id !== undefined && iterator.product_id !== undefined){
                                                        let tempId = iterator.vendor_id;
                                                        let tempNm = iterator.device_name;
                                                        let tempProductId = iterator.product_id;
                                                        try {
                                                            await USBPrinter.connectPrinter(parseInt(tempId), parseInt(tempProductId)).then(async (data) => {
                                                                try {
                                                                    USBPrinter.printBill(sReceipt, oPrintOptions);
                                                                    iSwitchOn = true;
                                                                    iConnected = "connect";
                                                                    iNm = tempNm;
                                                                    iPid = tempProductId;
                                                                    iVid = tempId;
                                                                } catch (error) {
                                                                    iSwitchOn = false;
                                                                }
                                                            }).catch((error) => {
                                                                iSwitchOn = false;
                                                            });
                                                        } catch (error) {
                                                            iSwitchOn = false;
                                                        }
                                                    }
                                                }
                                            }
                                        } else {
                                            iSwitchOn = false;
                                        }
                                    }
                                });
                            } catch {
                                iSwitchOn = false;
                            }
                        })
                    } catch {
                        iSwitchOn = false;
                    }
                } else {
sReceipt = `

<CM>[스루] 주문이 취소되었습니다</CM>       

================================
주문시간    : ${sOrderDate}
주문번호    : ${sOrderNr}
도착예정    : ${sOrderArrival}
전화번호    : ${sPhoneNr}
요청사항    : ${sInquiry}

<CD>${sCarLicenseNr}</CD>  

================================
${sHeaders}
================================
${sPrdLines}
================================
${sSubtotal}
================================
<M>${sTotal}</M>
================================
.
.
.
`;

                    try {
                        await BLEPrinter.init().then(async () => {
                            try {
                                await BLEPrinter.getDeviceList().then( async (data) => {
                                    if(sNm !== undefined && sNm !== null && sNm !== "" && sPid !== undefined && sPid !== null && sPid !== "" && sVid !== undefined && sVid !== null && sVid !== ""){
                                        if(data !== undefined && data !== null && data.length > 0){
                                            try {
                                                await BLEPrinter.connectPrinter(sVid).then((data) => {
                                                    try {
                                                        BLEPrinter.printBill(sReceipt, oPrintOptions);
                                                        iSwitchOn = true;
                                                        iConnected = "connected";
                                                    } catch (error) {
                                                        iConnected = "need";
                                                    }
                                                }).catch((error) => {
                                                    iConnected = "need";
                                                });
                                            } catch (error) {
                                                iConnected = "need";
                                            }

                                            if(iConnected === "need"){
                                                for await (const iterator of data) {
                                                    let tempId = iterator.inner_mac_address;
                                                    let tempNm = iterator.device_name;
                                                    try {
                                                        if(tempId !== undefined){
                                                            await BLEPrinter.connectPrinter(tempId).then((data) => {
                                                                try {
                                                                    BLEPrinter.printBill(sReceipt, oPrintOptions);
                                                                    iSwitchOn = true;
                                                                    iConnected = "connect";
                                                                    iNm = tempNm;
                                                                    iPid = tempId;
                                                                    iVid = tempId;
                                                                } catch (error) {
                                                                    iSwitchOn = false;
                                                                }
                                                            }).catch((error) => {
                                                                iSwitchOn = false;
                                                            });
                                                        }
                                                    } catch (error) {
                                                        iSwitchOn = false;
                                                    }
                                                }
                                            }
                                        } else {
                                            iSwitchOn = false;
                                        }
                                    }
                                });
                            } catch (error) {
                                iSwitchOn = false;
                            }
                        });
                    } catch (error) {
                        iSwitchOn = false;
                    }
                }

                if(!iSwitchOn && iConnected !== "connect" ){
                    resetPrinterPreset();
                }

                if(iConnected === "connect"){
                    setPrinterPreset(iNm,iPid,iVid);
                }
            }
        }
    }

    const fnUserClosePrinterBill = async () => {
        let oUserConfig = oReducerSetter.current._refGetUserConfig();
        let sType = oUserConfig.PRINTERTYPE;
        let sNm = oUserConfig.USB_PRINTER_DEVICENAME;
        let sPid = oUserConfig.USB_PRINTER_PRODUCTID;
        let sVid = oUserConfig.USB_PRINTER_VENDERID;
        let iNm = "";
        let iPid = "";
        let iVid = "";
        let iSwitchOn = false;
        let iConnected = "";
        let oPrintOptions = {
            beep: false,
            cut: true,
            tailingLine: false
        }
        if(sType !== undefined && sType !== null && sType !== ""){
            if(Platform.OS == 'android'){
                if(sType === "usb"){
                    oPrintOptions = {
                        beep: false,
                        cut: true,
                        encoding: 'EUC-KR',
                        tailingLine: false
                    }
                    await USBPrinter.init().then(async ()=> {
                        try {
                            await USBPrinter.getDeviceList().then( async (data) => {
                                if(sNm !== undefined && sNm !== null && sNm !== "" && sPid !== undefined && sPid !== null && sPid !== "" && sVid !== undefined && sVid !== null && sVid !== ""){
                                    if(data !== undefined && data !== null && data.length > 0){
                                        try {
                                            if (!isNaN(parseInt(sVid)) && !isNaN(parseInt(sPid))) {
                                                await USBPrinter.connectPrinter(parseInt(sVid), parseInt(sPid)).then(async (data) => {
                                                    try {
                                                        USBPrinter.printBill(iReceipt, oPrintOptions);
                                                        iSwitchOn = true;
                                                        iConnected = "connected";
                                                    } catch (err) {
                                                        iConnected = "need";
                                                    }
                                                }).catch((error) => {
                                                    iConnected = "need";
                                                });
                                            }
                                        } catch (error) {
                                            iConnected = "need";
                                        }

                                        if(iConnected === "need"){
                                            for await (const iterator of data) {
                                                if(iterator.vendor_id !== undefined && iterator.product_id !== undefined){
                                                    let tempId = iterator.vendor_id;
                                                    let tempNm = iterator.device_name;
                                                    let tempProductId = iterator.product_id;
                                                    try {
                                                        await USBPrinter.connectPrinter(parseInt(tempId), parseInt(tempProductId)).then(async (data) => {
                                                            try {
                                                                USBPrinter.printBill(iReceipt, oPrintOptions);
                                                                iSwitchOn = true;
                                                                iConnected = "connect";
                                                                iNm = tempNm;
                                                                iPid = tempProductId;
                                                                iVid = tempId;
                                                            } catch (error) {
                                                                iSwitchOn = false;
                                                            }
                                                        }).catch((error) => {
                                                            iSwitchOn = false;
                                                        });
                                                    } catch (error) {
                                                        iSwitchOn = false;
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        iSwitchOn = false;
                                    }
                                }
                            });
                        } catch {
                            iSwitchOn = false;
                        }
                    })
                } else {
                    try {
                        await BLEPrinter.init().then(async () => {
                            try {
                                await BLEPrinter.getDeviceList().then( async (data) => {
                                    if(sNm !== undefined && sNm !== null && sNm !== "" && sPid !== undefined && sPid !== null && sPid !== "" && sVid !== undefined && sVid !== null && sVid !== ""){
                                        if(data !== undefined && data !== null && data.length > 0){
                                            try {
                                                await BLEPrinter.connectPrinter(sVid).then((data) => {
                                                    try {
                                                        BLEPrinter.printBill(iReceipt, oPrintOptions);
                                                        iSwitchOn = true;
                                                        iConnected = "connected";
                                                    } catch (error) {
                                                        iConnected = "need";
                                                    }
                                                }).catch((error) => {
                                                    iConnected = "need";
                                                });
                                            } catch (error) {
                                                iConnected = "need";
                                            }

                                            if(iConnected === "need"){
                                                for await (const iterator of data) {
                                                    let tempId = iterator.inner_mac_address;
                                                    let tempNm = iterator.device_name;
                                                    try {
                                                        if(tempId !== undefined){
                                                            await BLEPrinter.connectPrinter(tempId).then((data) => {
                                                                try {
                                                                    BLEPrinter.printBill(iReceipt, oPrintOptions);
                                                                    iSwitchOn = true;
                                                                    iConnected = "connect";
                                                                    iNm = tempNm;
                                                                    iPid = tempId;
                                                                    iVid = tempId;
                                                                } catch (error) {
                                                                    iSwitchOn = false;
                                                                }
                                                            }).catch((error) => {
                                                                iSwitchOn = false;
                                                            });
                                                        }
                                                    } catch (error) {
                                                        iSwitchOn = false;
                                                    }
                                                }
                                            }
                                        } else {
                                            iSwitchOn = false;
                                        }
                                    }
                                });
                            } catch (error) {
                                iSwitchOn = false;
                            }
                        });
                    } catch (error) {
                        iSwitchOn = false;
                    }
                }

                if(!iSwitchOn && iConnected !== "connect" ){
                    resetPrinterPreset();
                }

                if(iConnected === "connect"){
                    setPrinterPreset(iNm,iPid,iVid);
                }
            }
        }
    }

    const fnUserArrivePrinterBill = async () => {
        let oUserConfig = oReducerSetter.current._refGetUserConfig();
        let sType = oUserConfig.PRINTERTYPE;
        let sNm = oUserConfig.USB_PRINTER_DEVICENAME;
        let sPid = oUserConfig.USB_PRINTER_PRODUCTID;
        let sVid = oUserConfig.USB_PRINTER_VENDERID;
        let iNm = "";
        let iPid = "";
        let iVid = "";
        let iSwitchOn = false;
        let iConnected = "";
        let oPrintOptions = {
            beep: false,
            cut: true,
            tailingLine: false
        }
        if(sType !== undefined && sType !== null && sType !== ""){
            if(Platform.OS == 'android'){
                if(sType === "usb"){
                    oPrintOptions = {
                        beep: false,
                        cut: true,
                        encoding: 'EUC-KR',
                        tailingLine: false
                    }
                    await USBPrinter.init().then(async ()=> {
                        try {
                            await USBPrinter.getDeviceList().then( async (data) => {
                                if(sNm !== undefined && sNm !== null && sNm !== "" && sPid !== undefined && sPid !== null && sPid !== "" && sVid !== undefined && sVid !== null && sVid !== ""){
                                    if(data !== undefined && data !== null && data.length > 0){
                                        try {
                                            if (!isNaN(parseInt(sVid)) && !isNaN(parseInt(sPid))) {
                                                await USBPrinter.connectPrinter(parseInt(sVid), parseInt(sPid)).then(async (data) => {
                                                    try {
                                                        USBPrinter.printBill(cReceipt, oPrintOptions);
                                                        iSwitchOn = true;
                                                        iConnected = "connected";
                                                    } catch (err) {
                                                        iConnected = "need";
                                                    }
                                                }).catch((error) => {
                                                    iConnected = "need";
                                                });
                                            }
                                        } catch (error) {
                                            iConnected = "need";
                                        }

                                        if(iConnected === "need"){
                                            for await (const iterator of data) {
                                                if(iterator.vendor_id !== undefined && iterator.product_id !== undefined){
                                                    let tempId = iterator.vendor_id;
                                                    let tempNm = iterator.device_name;
                                                    let tempProductId = iterator.product_id;
                                                    try {
                                                        await USBPrinter.connectPrinter(parseInt(tempId), parseInt(tempProductId)).then(async (data) => {
                                                            try {
                                                                USBPrinter.printBill(cReceipt, oPrintOptions);
                                                                iSwitchOn = true;
                                                                iConnected = "connect";
                                                                iNm = tempNm;
                                                                iPid = tempProductId;
                                                                iVid = tempId;
                                                            } catch (error) {
                                                                iSwitchOn = false;
                                                            }
                                                        }).catch((error) => {
                                                            iSwitchOn = false;
                                                        });
                                                    } catch (error) {
                                                        iSwitchOn = false;
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        iSwitchOn = false;
                                    }
                                }
                            });
                        } catch (error) {
                            iSwitchOn = false;
                        }
                    })
                } else {
                    try {
                        await BLEPrinter.init().then(async () => {
                            try {
                                await BLEPrinter.getDeviceList().then( async (data) => {
                                    if(sNm !== undefined && sNm !== null && sNm !== "" && sPid !== undefined && sPid !== null && sPid !== "" && sVid !== undefined && sVid !== null && sVid !== ""){
                                        if(data !== undefined && data !== null && data.length > 0){
                                            try {
                                                await BLEPrinter.connectPrinter(sVid).then((data) => {
                                                    try {
                                                        BLEPrinter.printBill(cReceipt, oPrintOptions);
                                                        iSwitchOn = true;
                                                        iConnected = "connected";
                                                    } catch (error) {
                                                        iConnected = "need";
                                                    }
                                                }).catch((error) => {
                                                    iConnected = "need";
                                                });
                                            } catch (error) {
                                                iConnected = "need";
                                            }

                                            if(iConnected === "need"){
                                                for await (const iterator of data) {
                                                    let tempId = iterator.inner_mac_address;
                                                    let tempNm = iterator.device_name;
                                                    try {
                                                        if(tempId !== undefined){
                                                            await BLEPrinter.connectPrinter(tempId).then((data) => {
                                                                try {
                                                                    BLEPrinter.printBill(cReceipt, oPrintOptions);
                                                                    iSwitchOn = true;
                                                                    iConnected = "connect";
                                                                    iNm = tempNm;
                                                                    iPid = tempId;
                                                                    iVid = tempId;
                                                                } catch (error) {
                                                                    iSwitchOn = false;
                                                                }
                                                            }).catch((error) => {
                                                                iSwitchOn = false;
                                                            });
                                                        }
                                                    } catch (error) {
                                                        iSwitchOn = false;
                                                    }
                                                }
                                            }
                                        } else {
                                            iSwitchOn = false;
                                        }
                                    }
                                });
                            } catch (error) {
                                iSwitchOn = false;
                            }
                        });
                    } catch (error) {
                        iSwitchOn = false;
                    }
                }

                if(!iSwitchOn && iConnected !== "connect" ){
                    resetPrinterPreset();
                }

                if(iConnected === "connect"){
                    setPrinterPreset(iNm,iPid,iVid);
                }
            }
        }
    }

    const resetPrinterPreset = () => {
        let oUserConfig = {};
        oUserConfig['PRINTERTYPE'] = "";
        oUserConfig['USB_PRINTER_VENDERID'] = "";
        oUserConfig['USB_PRINTER_DEVICENAME'] = "";
        oUserConfig['USB_PRINTER_PRODUCTID'] = "";
        oReducerSetter.current._refSetUserConfig(oUserConfig);
    }

    const setPrinterPreset = (iNm,iPid,iVid) => {
        let oUserConfig = {};
        oUserConfig['USB_PRINTER_VENDERID'] = iVid;
        oUserConfig['USB_PRINTER_DEVICENAME'] = iNm;
        oUserConfig['USB_PRINTER_PRODUCTID'] = iVid;
        oReducerSetter.current._refSetUserConfig(oUserConfig);
    }

    const fDetectBackPress = () => {

    }

    const oThisManager = {
        accessAxios: fnAxios,

        navGoTo: fnNavGoTo,

        showModal: fnShowModal,
        hideModal: fnHideModal,

        setPlaySound: fnPlaySound,
        setStopSound: fnStopSound,

        showDrawer: fnShowDrawer,
        hideDrawer: fnHideDrawer,

        setLogOut: fnLogOut,

        setReduxUserConfig: fnSetReduxUserConfig,
        getReduxUserConfig: fnGetReduxUserConfig,
        getReduxUserBasket: fnGetReduxUserBasket,
        setReduxUserBasket: fnSetReduxUserBasket,

        detectBackPress: fDetectBackPress,

        paymentApiUrl: getPaymentApiUrl,

        setPrinter: testPrinter,
        setPrinterBill: fnPrinterBill,
        setCancelPrinterBill: fnCancelPrinterBill,
        setUserClosePrinterBill: fnUserClosePrinterBill,
        setUserArrivePrinterBill: fnUserArrivePrinterBill,

    };

    useBackHandler(() => {
        let bBackBtnReturn = fDetectBackPress();
        return bBackBtnReturn;
    })

    useEffect(() => {
        if (oSoundOrderNew === undefined) {
            oSoundOrderNew = new Sound('order_action.mp3', Sound.MAIN_BUNDLE);
        }
        if (oSoundUserNearby === undefined) {
            oSoundUserNearby = new Sound('close_arrive.mp3', Sound.MAIN_BUNDLE);
        }
        if (oSoundUserArrived === undefined) {
            oSoundUserArrived = new Sound('arrive_action.mp3', Sound.MAIN_BUNDLE);
        }
        testPrinter();
    }, []);

    useEffect(() => {
        messaging().onMessage(async remoteMessage => {
            let oUserConfig = oReducerSetter.current._refGetUserConfig();
            let res = remoteMessage;
            if (res.data.type === "chat_message") {
                if(oUserConfig.APPROUTE !== "/nav/order/chat"){
                    fnNavGoTo('push',  AppRoute.CHAT, {
                        sOrderId : res.data.order_id,
                        sUserId : res.data.user_id, 
                        iStoreId : res.data.store_id,
                    })
                }
            } else if (res.data.type === "customer_arrived_early") {
                if(oUserConfig.APPROUTE !== "/nav/order"){
                    fnNavGoTo('push', AppRoute.ORDER)
                }
            } else if (res.data.type === "customernearby") {
                if(oUserConfig.APPROUTE !== "/nav/order"){
                    fnNavGoTo('push', AppRoute.ORDER)
                }
            } else if (res.data.type === "customerarrived") {
                if(oUserConfig.APPROUTE !== "/nav/order"){
                    fnNavGoTo('push', AppRoute.ORDER)
                }
            } else if (res.data.type === "neworder") {
                if(oUserConfig.APPROUTE !== "/nav/order"){
                    fnNavGoTo('push', AppRoute.ORDER)
                }
            }
        });
    }, []);

    return (
        <>
            {React.cloneElement(oProps.children, {appManager: oThisManager})}
            <ReducerSetter {...oProps} ref={oReducerSetter} />
            <AppModal {...oProps} ref={oAppModal} />
            <AppDrawer {...oProps} ref={oAppDrawer} />
        </>
    )
}

export default AppManager;