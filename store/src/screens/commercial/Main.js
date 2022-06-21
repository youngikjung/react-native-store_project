import React, {useState,useEffect,useRef} from 'react';
import { View, Dimensions } from 'react-native';
import PushNotification, { Importance } from 'react-native-push-notification';
import LottieView from 'lottie-react-native';

import {AppRoute} from '../../routes/AppRoutes';

import Init from '../../components/commercial/Init';
import Charged from '../../components/commercial/Charged';
import Detail from '../../components/commercial/Detail';
import Cart from '../../components/commercial/Cart';
import Used from '../../components/commercial/Used';

const { width, height } = Dimensions.get('window');

const CommercialPage = oProps => {
    const [commercialList, setCommercialList] = useState([]);
    const [PrePageState, setPrePageState] = useState("");
    const [pageState, setPageState] = useState("");
    const [usedPage, setUsedPage] = useState("list");

    const [detailData, setDetailData] = useState({});

    const [myPoint, setMyPoint] = useState(0);
    const [myPointWon, setMyPointWon] = useState("0");
    const [myPointCharged, setMyPointCharged] = useState(0);
    const [myPointChargedWon, setMyPointChargedWon] = useState("0");
    const [totalPointWon, setTotalPointWon] = useState("0");
    
    const paramListRef = useRef([]);

    const priceToString = async (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    const getList = async () => {
        let oUserConfig = {};
        oUserConfig['APPROUTE'] = AppRoute.COUPON;
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

    const asynData = async (lenk) => {
        const store_id = oProps.UserConfigReducer.StoreID;
        const oResponse = await oProps.appManager.accessAxios("/store/commercial/getCommercial/-" + store_id, "get", "login", null);
        if(oResponse !== undefined){
            let temp = parseInt(oResponse.remainPrice) + parseInt(oResponse.remainChargedPrice);
            temp = await priceToString(temp);
            setCommercialList(oResponse.commercialList);
            setMyPoint(oResponse.remainPrice);
            setMyPointCharged(oResponse.remainChargedPrice);
            setMyPointWon(oResponse.remainPriceWon);
            setMyPointChargedWon(oResponse.remainChargedPriceWon);
            setTotalPointWon(temp);

            if(lenk === undefined || lenk === null){
                if(oResponse.storeType === "new"){
                    setPrePageState("init");
                    setPageState("init");
                } else {
                    setPrePageState("used");
                    setPageState("used");
                }
            }
        }
    }

    const chargedPoint = (sIndex) => {
        if(sIndex !== undefined && sIndex !== null){
            setUsedPage(sIndex);
        }
        setPageState("point");
    }

    const returnInit = () => {
        asynData();
        if(PrePageState === "used"){
            setUsedPage("add");
            setPageState("used");
        } else {
            setPageState("init");
        }
    }

    const completeCommercial = () => {
        paramListRef.current = [];
        asynData();
        if(PrePageState === "used"){
            setUsedPage("add");
            setPageState("used");
        } else {
            setPageState("init");
        }
    }

    const getCartData = (sIndex) => {
        if(sIndex !== undefined && sIndex !== null){
            setUsedPage(sIndex);
        }
        setPageState("cart");
    }

    const goToCommercialDetail = (sIndex,aIndex) => {
        if(aIndex !== undefined && aIndex !== null){
            setUsedPage(aIndex);
        }
        setDetailData(sIndex);
        setPageState("detail");
    }

    const fromOtherPage = (sIndex,aIndex) => {
        asynData("from");
        if(aIndex === "used"){
            setPrePageState("used");
            setUsedPage("add");
        } else {
            setPrePageState("init");
        }
        setDetailData(sIndex);
        setPageState("detail");
    }

    const allDeleteCarData = async () => {
        paramListRef.current = [];
        if(PrePageState === "used"){
            setUsedPage("add");
            setPageState("used");
        } else {
            setPageState("init");
        }
    }

    const cartPageDeleteCartItem = async (sIndex) => {
        paramListRef.current = sIndex;
        if(sIndex.length < 1){
            if(PrePageState === "used"){
                setUsedPage("add");
                setPageState("used");
            } else {
                setPageState("init");
            }
        }
    }

    const insertCart = async (sIndex,aIndex) => {
        setPageState("");

        if(aIndex !== undefined && aIndex !== null && aIndex === "go"){
            let tempList = paramListRef.current;
            paramListRef.current = await tempList.filter((item) => item.param !== sIndex.param);
        }
        paramListRef.current = [...paramListRef.current, sIndex];
        if(PrePageState === "used"){
            setUsedPage("add");
            setPageState("used");
        } else {
            setPageState("init");
        }
    }

    useEffect(() => {
        PushNotification.removeAllDeliveredNotifications();
        if(oProps.initialProps !== undefined && oProps.initialProps !== null){
            if(oProps.initialProps.route !== undefined && oProps.initialProps.route !== null){
                if(oProps.initialProps.route.params !== undefined && oProps.initialProps.route.params !== null){
                    const initital = oProps.initialProps.route.params;
                    if(initital.sParam !== "home"){
                        fromOtherPage(initital.sParam,initital.iParam);
                    } else {
                        asynData();
                    }
                } else {
                    asynData();
                }
            } else {
                asynData();
            }
        } else {
            asynData();
        }
        getList();
    }, []);

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            {pageState === "" &&
                <View style={{ flex:1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
            {pageState === "init" &&
                <Init 
                    sProps={oProps}
                    iTotalPointWon={totalPointWon}
                    iMyPointWon={myPointWon}
                    iMyPointChargedWon={myPointChargedWon}
                    commercial={commercialList}
                    iParam={paramListRef.current}
                    fnChargedPoint={() => chargedPoint()}
                    fnCommercialDetail={(sIndex) => goToCommercialDetail(sIndex)}
                    fnGoToCart={() => getCartData()}
                />
            }
            {pageState === "used" &&
                <Used 
                    sProps={oProps}
                    iTotalPointWon={totalPointWon}
                    iMyPointWon={myPointWon}
                    iMyPointChargedWon={myPointChargedWon}
                    iUsedPage={usedPage}
                    commercial={commercialList}
                    iParam={paramListRef.current}
                    fnChargedPoint={(sIndex) => chargedPoint(sIndex)}
                    fnCommercialDetail={(sIndex,aIndex) => goToCommercialDetail(sIndex,aIndex)}
                    fnGoToCart={(sIndex) => getCartData(sIndex)}
                />
            }
            {pageState === "point" &&
                <Charged 
                    sProps={oProps}
                    iAmount={myPoint}
                    cAmount={myPointCharged}
                    iMyPointWon={myPointWon}
                    iMyPointChargedWon={myPointChargedWon}
                    fnReturn={() => returnInit()}
                    fnCompleteCharged={() => returnInit()}
                />
            }
            {pageState === "detail" &&
                <Detail 
                    iProps={oProps}
                    eDetailData={detailData}
                    sParam={PrePageState}
                    iParam={paramListRef.current}
                    fnReturn={() => returnInit()}
                    fnCartData={(sIndex,aIndex) => insertCart(sIndex,aIndex)}
                />
            }
            {pageState === "cart" &&
                <Cart 
                    iProps={oProps}
                    iMyPoint={myPoint}
                    iMyPointWon={myPointWon}
                    aPoint={myPointCharged}
                    aPointWon={myPointChargedWon}
                    iCartList={paramListRef.current}
                    fnBack={() => returnInit()}
                    fnComplete={() => completeCommercial()}
                    fnCartAllDelete={() => allDeleteCarData()}
                    fnDeleteCartItem={(sIndex) => cartPageDeleteCartItem(sIndex)}
                />
            }
        </View>
    )
}

export default CommercialPage;
