import React, {useState,useEffect,useRef} from 'react';
import { View, Dimensions, Text, TouchableOpacity, FlatList, Platform } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';
import { USBPrinter, BLEPrinter } from "react-native-thermal-receipt-printer";
import moment from 'moment-timezone';
import 'moment/locale/ko';

import { AppRoute } from '../../routes/AppRoutes';

import { CompModalNoticeContent } from '../../components/modal/AppModalContent';

import { ComponentSelectedCircle } from '../../assets/svg/selectedCircle';
import { ComponentUnSelectedCircle } from '../../assets/svg/unselectedCircle';
import { ComponentDelete } from '../../assets/svg/delete';

const sReceipt = `
<CM>[스루] 테스트 영수증</CM>       

================================
주문시간    : ${moment().format("YYYY-MM-DD")}
        
<CD>테스트</CD>  

================================
`;
const { width, height } = Dimensions.get('window');
const OrderScreen = oProps => {
    const [loading, setLoading] = useState(false);

    const [state, setstate] = useState("usb");

    const [sCurrentUSBName, setSCurrentUSBName] = useState("");
    const [sCurrentBLUName, setSCurrentBLUName] = useState("");
    const [printersList, setPrintersList] = useState([]);

    const sVendorId = useRef();
    const sProductId = useRef();
    const sDeviceName = useRef();
    const bVendorId = useRef();
    const bDeviceName = useRef();

    const registerBLUPrinter = async () => {
        if(bVendorId.current !== undefined && bVendorId.current !== ""){
            let oUserConfig = {};
            oUserConfig['PRINTERTYPE'] = "bluetooth";
            oUserConfig['USB_PRINTER_VENDERID'] = bVendorId.current;
            oUserConfig['USB_PRINTER_PRODUCTID'] = bVendorId.current;
            oUserConfig['USB_PRINTER_DEVICENAME'] = bDeviceName.current;
            await oProps.reduxSetUserConfig(oUserConfig);
            GoBack();
        }
    }

    const registerUSBPrinter = async () => {
        if(sVendorId.current !== undefined && sVendorId.current !== ""){
            let oUserConfig = {};
            oUserConfig['PRINTERTYPE'] = "usb";
            oUserConfig['USB_PRINTER_VENDERID'] = sVendorId.current;
            oUserConfig['USB_PRINTER_PRODUCTID'] = sProductId.current;
            oUserConfig['USB_PRINTER_DEVICENAME'] = sDeviceName.current;
            await oProps.reduxSetUserConfig(oUserConfig);
            GoBack();
        }
    }

    const selectedPrinter = (item) => {
        if(state === "usb"){
            if(item.vendor_id !== undefined && item.product_id !== undefined){
                let sVendorProductId = item.vendor_id + ':' + item.product_id;
                sVendorId.current = item.vendor_id;
                sProductId.current = item.product_id;
                sDeviceName.current = item.device_name;
                setSCurrentUSBName(item.device_name)
                usbPrintTest(sVendorProductId, "usb");
            }

        } else {
            if(item.inner_mac_address !== undefined){
                bVendorId.current = item.inner_mac_address;
                bDeviceName.current = item.device_name;
                setSCurrentBLUName(item.device_name);
                usbPrintTest(item.inner_mac_address, "bluetooth");
            }
        }
    }

    const usbPrintTest = async (sIndex, aIndex) => {
        let oPrintOptions = {
            beep: true,
            cut: true,
            tailingLine: false
        }
        if(aIndex === "bluetooth"){
            await BLEPrinter.connectPrinter(sIndex)
                            .then((data) => {
                                BLEPrinter.printBill(sReceipt, oPrintOptions);
                            })
                            .catch((error) => {
                            });
        } else {
            oPrintOptions = {
                beep: false,
                cut: true,
                encoding: 'EUC-KR',
                tailingLine: false
            }
            if (sIndex.indexOf(":") != -1) {
                let aPrinterSplit = sIndex.split(':');
                if (aPrinterSplit.length > 0) {
                    if (!isNaN(parseInt(aPrinterSplit[0])) && !isNaN(parseInt(aPrinterSplit[1]))) {
                        await USBPrinter.connectPrinter(parseInt(aPrinterSplit[0]), parseInt(aPrinterSplit[1]))
                                        .then(async (data) => {
                                            USBPrinter.printBill(sReceipt, oPrintOptions);
                                        })
                                        .catch((error) => {
                                        });
                    }
                }
            }
        }
    }

    const GoBack = () => {
        oProps.appManager.navGoTo('reset', AppRoute.HOME);
    }

    const getList = async () => {
        let oUserConfig = {};
        oUserConfig['APPROUTE'] = AppRoute.PRINTER;
        await oProps.reduxSetUserConfig(oUserConfig);

        const oResponse = await oProps.appManager.accessAxios("/store/order/getall", "get", "login", null);
        if(oResponse !== undefined){
            if(oResponse.isOrder){
                if(parseInt(oResponse.iReady) > 0){
                    oProps.appManager.navGoTo('reset', AppRoute.ORDER)
                }
            }
        }
    }

    const getUSBList = async () => {
        setLoading(true);
        if(Platform.OS == 'android'){
            await USBPrinter.init().then(async ()=> {
                try {
                    await USBPrinter.getDeviceList().then((data) => {
                        let sNm = oProps.UserConfigReducer.USB_PRINTER_DEVICENAME;
                        let sPid = oProps.UserConfigReducer.USB_PRINTER_PRODUCTID;
                        let sVid = oProps.UserConfigReducer.USB_PRINTER_VENDERID;
                        if(sNm !== undefined && sNm !== null && sNm !== "" && sPid !== undefined && sPid !== null && sPid !== "" && sVid !== undefined && sVid !== null && sVid !== ""){
                            setSCurrentUSBName(sNm);
                        }
                        setPrintersList(data);
                    });
                } catch (error) {
                    setPrintersList([]);
                }
            })
        }
        setstate("usb");
        setLoading(false);
    }

    const getBlueToothList = async () => {
        setLoading(true);
        await BLEPrinter.init().then(async () => {
            try {
                await BLEPrinter.getDeviceList().then((data) => {
                    let sNm = oProps.UserConfigReducer.USB_PRINTER_DEVICENAME;
                    let sPid = oProps.UserConfigReducer.USB_PRINTER_PRODUCTID;
                    let sVid = oProps.UserConfigReducer.USB_PRINTER_VENDERID;
                    if(sNm !== undefined && sNm !== null && sNm !== "" && sPid !== undefined && sPid !== null && sPid !== "" && sVid !== undefined && sVid !== null && sVid !== ""){
                        setSCurrentBLUName(sNm);
                    }
                    
                    setPrintersList(data)
                });
            } catch (error) {
                setPrintersList([])
            }
        });
        setstate("bluetooth");
        setLoading(false);
    }

    useEffect(() => {
        getList();
        getUSBList();
    }, []);

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            {loading ?
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            :
            <>
                <View style={{height: height * 0.08 }}>
                    <View style={{flex:1, alignItems: "flex-start", justifyContent: "center", paddingLeft: width * 0.07, marginTop: "3%" }}>
                        <Text style={{fontWeight: "700", fontSize: RFPercentage(2.1), color: "#191F28" }}>프린터설정</Text>
                    </View>
                    <TouchableOpacity onPress={GoBack} style={{ position: "absolute", top: height * 0.02, right: width * 0.05, height: height * 0.05, width: height * 0.05, justifyContent: "center", alignItems: "center"}}>
                        <ComponentDelete iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
                    </TouchableOpacity>
                </View>
                <View style={{ height: height * 0.05, justifyContent: "flex-end", alignItems: "flex-start", paddingLeft: "6%"}}>
                    <Text style={{ fontWeight: "600", fontSize: RFPercentage(1.9), color: "#95959E" }}>사용하실 프린터를 선택하세요.</Text>
                </View>
                <View style={{height: height * 0.2, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center"}}>
                    <TouchableOpacity 
                        onPress={getUSBList} 
                        style={{
                            height: height * 0.15, width: width * 0.4, backgroundColor: "#FAFAFB", borderRadius: width * 0.03,
                            ...Platform.select({
                                ios: {
                                    shadowColor: "#000",
                                    shadowOpacity: 0.1,
                                    shadowRadius: 5,
                                    shadowOffset: {
                                        height: 0,
                                        width: 0,
                                    },
                                },
                                android: {
                                    shadowColor: "#000",
                                    elevation: 0.5,
                                },
                            })
                        }}
                    >
                        <View style={{flex:0.6, justifyContent: "center", alignItems: "center"}}>
                            <LottieView style={{width: height * 0.09, height: height * 0.09 }} source={require('../../assets/lottie/usb.json')} autoPlay loop/>
                        </View>
                        <View style={{flex:0.4, alignItems: "center", justifyContent: "center"}}>
                            <Text style={{ fontWeight: "600", fontSize: RFPercentage(1.8), color: state === "usb" ? "#6490E7" : "#B0B7C1" }}>USB 프린터</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={getBlueToothList} 
                        style={{
                            height: height * 0.15, width: width * 0.4, backgroundColor: "#FAFAFB", borderRadius: width * 0.03,
                            ...Platform.select({
                                ios: {
                                    shadowColor: "#000",
                                    shadowOpacity: 0.1,
                                    shadowRadius: 5,
                                    shadowOffset: {
                                        height: 0,
                                        width: 0,
                                    },
                                },
                                android: {
                                    shadowColor: "#000",
                                    elevation: 0.5,
                                },
                            })
                        }}
                    >
                        <View style={{flex:0.6, justifyContent: "center", alignItems: "center"}}>
                            <LottieView style={{width: height * 0.09, height: height * 0.09 }} source={require('../../assets/lottie/bluetooth.json')} autoPlay loop/>
                        </View>
                        <View style={{flex:0.4, alignItems: "center", justifyContent: "center"}}>
                            <Text style={{ fontWeight: "600", fontSize: RFPercentage(1.8), color: state === "bluetooth" ? "#6490E7" : "#B0B7C1" }}>블루투스 프린터</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1, backgroundColor: "#fff"}}>
                    <FlatList
                        data={printersList}
                        ListFooterComponent={<View style={{ height: height * 0.04 }} />}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(data, index) => "list-" + index + Math.random()}
                        ListEmptyComponent={
                            <View style={{height: width * 0.3, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontWeight: "400", fontSize: RFPercentage(1.7), color: "#bbb"}}>프린터가 없습니다.</Text>
                            </View>
                        }
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{height: height * 0.1, width, justifyContent: "center", alignItems: "center"}}>
                                    <TouchableOpacity 
                                        onPress={() => selectedPrinter(item)} 
                                        style={{
                                            height: height * 0.08, width: width * 0.9, alignItems: "center", flexDirection: "row", borderRadius: width * 0.03,
                                            backgroundColor: "#fff",
                                            paddingLeft: "5%",
                                        }}
                                    >
                                        {state === "bluetooth" ?
                                            <>
                                                {sCurrentBLUName !== item.device_name ?
                                                    <ComponentUnSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                                    :
                                                    <ComponentSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                                }
                                            </>
                                        :
                                            <>
                                                {sCurrentUSBName !== item.device_name ?
                                                    <ComponentUnSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                                    :
                                                    <ComponentSelectedCircle iHeight={height * 0.025} iWidth={width * 0.06} iColor={"#6B7583"}/>
                                                }
                                            </>
                                        }
                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.9), color: "#333D4B", marginLeft: "2%" }}>{item.device_name}</Text>
                                    </TouchableOpacity>
                                </View>
                            ) 
                        }}
                    />
                </View>
                <View style={{height: height / 6 , backgroundColor: "#fff", justifyContent: "center"}}>
                    <TouchableOpacity
                        onPress={() => state !== "usb" ? registerBLUPrinter() : registerUSBPrinter()}
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
                        <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>설정완료</Text>
                    </TouchableOpacity>
                </View>
            </>
            }
        </View>
    )
}

export default OrderScreen;