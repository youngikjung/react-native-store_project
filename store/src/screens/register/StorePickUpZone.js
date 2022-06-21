import React, {useState,useEffect,useRef} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';
import { WebView } from "react-native-webview";

import { CompModalContent } from '../../components/modal/ModalContents';

import { ComponentDelete } from '../../assets/svg/delete';
import { ComponentArrowLeft3 } from '../../assets/svg/arrowLeft3';

import { AppRoute } from '../../routes/AppRoutes';

const { width, height } = Dimensions.get('window');

const StorePickUpZone = oProps => {
    const [loading, setLoading] = useState(false);
    const [sLocation, setLocation] = useState("");

    const [isLoad, setLoad] = useState(true);

    const sUri = useRef(null);
    const newUserLat = useRef(parseFloat(37.56637919891677));
    const newUserLng = useRef(parseFloat(126.97914589375286));
    const anglePoint = useRef({
        pan: 0,
        tilt: 0,
        zoom: 0
    });

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
        oProps.appManager.navGoTo('reset', AppRoute.STOREHOLIDAY);
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

    const asyncData = async () => {
        setLoading(true);
        const store_id = oProps.UserConfigReducer.StoreID;
        const iResponse = await oProps.appManager.accessAxios("/app/sales/store/pickup/getPickUpZoneInfo/v2-" + store_id, "get", "text", null);
        if(iResponse !== undefined && iResponse !== null){
            newUserLat.current = iResponse.lat;
            newUserLng.current = iResponse.lng;
            sUri.current = "https://ceo.throo.co.kr/selfmanage/app/sales?=" + parseFloat(iResponse.lat) + "?@=" + parseFloat(iResponse.lng) + "?@=" + parseFloat(iResponse.pointView.pan) + "?@=" + parseFloat(iResponse.pointView.tilt) + "?@=" + parseFloat(iResponse.pointView.zoom)
            anglePoint.current = iResponse.pointView;
        }
        setLoading(false);
    }
    
    const openModal = (sIndex) => {
        oProps.appManager.showModal(
            true,
            <CompModalContent sText={sIndex}/>, 
            "custom",
            2500
        );
    };

    const access = async () => {
        setLoading(true);
        const oData = {
            store_id: oProps.UserConfigReducer.StoreID,
            lat: newUserLat.current,
            lng: newUserLng.current,
            viewPoint: anglePoint.current,
        }
        const oResponse = await oProps.appManager.accessAxios("/app/sales/store/pickup/setPickUpZone/v2", "post", null, oData);
        if(oResponse !== undefined){
            if(!oResponse){
                openModal("문제가 발생했습니다 관리자에 연락바랍니다.");
            } else {
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
    
                    oUserConfig['STOREPICKUPZONE'] = false;
                    oUserConfig['STOREPICKUPIMAGE'] = true;
    
                    await oProps.reduxSetUserConfig(oUserConfig);
                    oProps.appManager.navGoTo('reset', AppRoute.STOREPICKUPIMAGE);
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
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>매장의 픽업존 위치를</Text>
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>설정해 주세요.</Text>
                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.6), color: "#95959E" }}>고객이 픽업존 위치를 쉽게 찾을 수 있게 거리뷰를 설정해주세요.</Text>
            </View>
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <View style={{flex:1, marginLeft: "5%", marginRight: "5%", marginTop: "5%", borderRadius: width * 0.02}}>
                    {isLoad &&
                        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                            <LottieView style={{width: width * 0.4, height: width * 0.4 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                        </View>
                    }
                    <WebView
                        onMessage={handleOnMessage}
                        originWhitelist={['*']}
                        cacheEnabled={false}
                        source={{ uri: sUri.current}}
                        onLoadEnd={() => setLoad(false)}
                    />
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
                    <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>적용</Text>
                </TouchableOpacity>
            </View>
            {loading &&
                <View style={{position: "absolute", top: 0, height, width, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
        </View>
    )
}

export default StorePickUpZone;