
import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, Image, FlatList, ScrollView } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import LottieView from 'lottie-react-native';
import moment from 'moment-timezone';
import 'moment/locale/ko';

import { AppRoute } from '../../../routes/AppRoutes';

import appBanner03 from '../../../assets/img/appBanner03.png';
import Commercial1 from '../../../assets/img/commercial_1.png';
import Commercial2 from '../../../assets/img/commercial_2.png';
import Commercial3 from '../../../assets/img/commercial_3.png';

import { ComponentArrowLeft3 } from '../../../assets/svg/arrowLeft3';
import { ComponentSelectedCircle } from '../../../assets/svg/selected_circle';
import { ComponentThrooOnly } from '../../../assets/svg/throoonly';

import { CompModalContent, CompCommercialSelect } from '../../modal/ModalContents';

const { width, height } = Dimensions.get('window');

const Detail = ({ sProps, fnInitReturn, iDetailData, fnInsertCart, sParam, iParam }) => {
    const [loading, setLoading] = useState(false);

    const [productList, setProductList] = useState([]);
    const [preList, setPreList] = useState([{ name: "아메리카노", orgPrice: "5,000원", image: "1" },{ name: "안심살", orgPrice: "5,000원", image: "2" },{ name: "케이크", orgPrice: "1,000원", image: "3" }]);

    const [productId, setProductId] = useState("");

    const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
    const [fDatePickerVisible, setFDatePickerVisibility] = useState(false);

    const backToInfomation = async () => {
        if(fnInitReturn !== undefined && typeof fnInitReturn === "function"){
            await fnInitReturn();
        }
    }

    const withoutData = async (sIndex) => {
        if(fnInsertCart !== undefined && typeof fnInsertCart === "function"){
            await sProps.appManager.hideModal();
            await fnInsertCart(sIndex,"go");
        }
    }

    const openModal = (sIndex) => {
        sProps.appManager.showModal(
            true,
            <CompModalContent sText={sIndex}/>, 
            "custom",
            2500
        );
    };

    const openCommercialSelect = (sIndex) => {
        sProps.appManager.showModal(
            true,
            <CompCommercialSelect nIndex={sIndex} fnClose={() => sProps.appManager.hideModal()} fnInsert={(qIndex) => withoutData(qIndex)}/>, 
            "custom",
        );
    };

    const handleFromConfirm = (date) => {
        setFromDate(moment(date).format("YYYY-MM-DD"));
        hideFromDatePicker();
    };

    const hideFromDatePicker = () => {
        setFDatePickerVisibility(false);
    };

    const insertCommercial = (sIndex) => {
        let temp = [
            sIndex,{ name: "아메리카노", orgPrice: "5,000원", image: "1" },{ name: "안심살", orgPrice: "5,000원", image: "2" }
        ] ;
        setPreList(temp);
        setProductId(sIndex.id);
    };

    const insertCouponCommercial = async () => {
        setLoading(true);

        if(productId === ""){
            openModal("상품을 선택해주세요.");
        } else {
            let progress1 = true;
            for await (const iterator of sParam) {
                if(iterator.param === "only"){
                    progress1 = false;
                }
            }
            const oData = {
                key: iDetailData.key,
                name: iDetailData.param,
                img: iDetailData.img,
                title: iDetailData.name,
                priceCasting: iDetailData.priceCasting,
                price: iDetailData.price,
                param: iDetailData.param,
                productId,
                fromDate,
            }
            if(progress1){
                if(fnInsertCart !== undefined && typeof fnInsertCart === "function"){
                    await fnInsertCart(oData,"no");
                }
            } else {
                openCommercialSelect(oData);
            }
        }
        setLoading(false);
    }

    const getList = async () => {
        const store_id = sProps.UserConfigReducer.StoreID;
        const oResponse = await sProps.appManager.accessAxios("/store/commercial/throoOnly/getThrooOnlyList-" + store_id, "get", "login", null);
        if(oResponse !== undefined){
            setProductList(oResponse);
        }
    }

    useEffect(() => {
        getList();
    }, []);

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            {loading ?
                <View style={{position: "absolute", top: 0, height, width, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            :
            <>
                <View style={{height: height * 0.08 }}>
                    <TouchableOpacity onPress={backToInfomation} style={{ position: "absolute", top: height * 0.02, left: width * 0.05, height: height * 0.05, width: height * 0.05, justifyContent: "center", alignItems: "center"}}>
                        <ComponentArrowLeft3 iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{flex:1, backgroundColor: "#fff"}}>
                    <View style={{height: height * 0.05, width, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{fontWeight: "900", fontSize: RFPercentage(2.5), color: "#000"}}>{iDetailData.name}</Text>
                    </View>
                    <View style={{height: height * 0.1, width: "80%", justifyContent: "flex-start", alignItems: "center", marginLeft: "10%", marginRight: "10%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.8), color: "#6B7583"}}>{iDetailData.detail2}</Text>
                    </View>
                    <View style={{height: height * 0.23, width, alignItems: "center", justifyContent: "space-around" }}>
                        <Text style={{fontWeight: "400", fontSize: RFPercentage(1.6), color: "#666666"}}>-예시-</Text>
                        <View style={{height: height * 0.2, width: width * 0.9, alignItems: "center", justifyContent: "center" }}>
                            <View style={{position: "absolute", top: height * 0.01, left: width * 0.05, height: height * 0.02, width: width * 0.6, alignItems: "center", flexDirection: "row"}}>
                                <ComponentThrooOnly iHeight={height * 0.04} iWidth={height * 0.04} iColor={"#000"}/>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#111111", marginLeft: "5%"}}>오직 스루에서만 만나보세요.</Text>
                            </View>
                            <View style={{position: "absolute", bottom: 0, left: 0, height: height * 0.16, width: width * 0.8}}>
                                <FlatList
                                    data={preList}
                                    horizontal
                                    contentContainerStyle={{paddingHorizontal: width * 0.05, alignItems: "center" }}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(data, index) => "list-" + index + Math.random()}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View 
                                                style={{
                                                    height: height * 0.15,
                                                    width: width * 0.25,
                                                    borderRadius: width * 0.03,
                                                    marginRight: width * 0.03,
                                                }}
                                            >
                                                <View style={{ height: height * 0.1, width: height * 0.12, justifyContent: "center", alignItems: "center"}}>
                                                    {(item.image !== undefined && item.image !== null && item.image !== "") ?
                                                        <>
                                                        {item.image === "1" && <Image source={Commercial1} style={{height: height * 0.1, width: height * 0.12, borderRadius: width * 0.005,}}/>}
                                                        {item.image === "2" && <Image source={Commercial2} style={{height: height * 0.1, width: height * 0.12, borderRadius: width * 0.005,}}/>}
                                                        {item.image === "3" && <Image source={Commercial3} style={{height: height * 0.1, width: height * 0.12, borderRadius: width * 0.005,}}/>}
                                                        </>
                                                        :
                                                        <Image source={{uri: item.imgPath}} style={{height: height * 0.1, width: height * 0.12, borderRadius: width * 0.005, resizeMode: "stretch"}}/>
                                                    }
                                                </View>
                                                {(item.discount !== undefined && item.discount !== null && parseInt(item.discount) > 0) ?
                                                    <View style={{ height: height * 0.05, width: height * 0.12, justifyContent: "space-evenly", alignItems: "flex-start"}}>
                                                        <View style={{ height: height * 0.02, width: height * 0.12, alignItems: "center",flexDirection: "row"}}>
                                                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.5), color: "#111111", marginLeft: "5%"}}>{item.name}</Text>
                                                        </View>
                                                        <View style={{ height: height * 0.02, width: height * 0.12, alignItems: "center", flexDirection: "row"}}>
                                                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.4), color: "#001E62", marginLeft: "5%"}}>{item.discount}%</Text>
                                                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.4), color: "#5991FF", marginLeft: "5%"}}>{item.orgPrice}</Text>
                                                        </View>
                                                    </View>
                                                    :
                                                    <View style={{ height: height * 0.05, width: height * 0.12, justifyContent: "space-evenly", alignItems: "flex-start"}}>
                                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.5), color: "#111111", marginLeft: "5%"}}>{item.name !== undefined && item.name !== null ? item.name : "아메리카노"}</Text>
                                                        <Text style={{fontWeight: "400", fontSize: RFPercentage(1.4), color: "#111111", marginLeft: "5%"}}>{item.orgPrice !== undefined && item.orgPrice !== null ? item.orgPrice : "3,000원"}</Text>
                                                    </View>
                                                }
                                            </View>
                                        ) 
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    {productList.length > 0 &&
                    <>
                        <View style={{height: height * 0.16, alignItems: "center" }}>
                            <View style={{height: height * 0.05, backgroundColor: "#fff", width, justifyContent: "flex-end", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>광고 사용기간을 입력해주세요</Text>
                            </View>
                            <View style={{height: height * 0.11, width: width * 0.9, alignItems: "center", flexDirection: "row", marginLeft: "5%", marginRight: "5%" }}>
                                <DateTimePickerModal
                                    isVisible={fDatePickerVisible}
                                    mode="date"
                                    confirmTextIOS="확인"
                                    cancelTextIOS="취소"
                                    onConfirm={handleFromConfirm}
                                    onCancel={hideFromDatePicker}
                                />
                                <TouchableOpacity onPress={() => setFDatePickerVisibility(true)} style={{height: height * 0.06, width: "43%", backgroundColor: "#FAFAFB", borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: "4%"}}>
                                    <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#333D4B"}}>{fromDate}</Text>
                                </TouchableOpacity>
                                <View style={{height: "100%", width: "10%", marginRight: "5%", justifyContent: "center", alignItems: "center"}}>
                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(1.9), color: "#333D4B" }}>부터</Text>
                                </View>
                                <View style={{height: height * 0.06, width: "25%", borderRadius: 10, alignItems: "center", justifyContent: "center"}}>
                                    <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#333D4B"}}>
                                        <Text style={{fontWeight: "800", fontSize: RFPercentage(1.9), color: "#6490E7"}}>
                                            30일
                                        </Text>
                                        동안
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={{height: height * 0.06, alignItems: "center" }}>
                            <View style={{height: height * 0.05, backgroundColor: "#fff", width, justifyContent: "flex-end", marginLeft: "10%"}}>
                                <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#4E5867" }}>광고에 사용하실 상품을 선택해주세요</Text>
                            </View>
                        </View>
                        <View style={{flex:1}}>
                            {productList.map((item, index) => {
                                return (
                                    <View key={index} style={{height: height * 0.1, backgroundColor: productId !== item.id ? "#fff" : "#FBFBFD", alignItems: "flex-end", justifyContent: "center", flexDirection: "row"}}>
                                        <View style={{height: "100%", width: "20%", justifyContent: "center", alignItems: "flex-end"}}>
                                            <View style={{height: height * 0.06, width: width * 0.14}}>
                                                <Image source={{uri: item.imgPath}} style={{width: width * 0.14, height : height * 0.06, borderRadius: width * 0.1, resizeMode: "stretch"}}/>
                                            </View>
                                        </View>
                                        <View style={{height: "100%", width: "60%"}}>
                                            <View style={{flex:0.6, justifyContent: "center", marginLeft: "5%"}}>
                                                <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#333D4B" }}>{item.name}</Text>
                                            </View>
                                            <View style={{flex:0.4, justifyContent: "flex-start", marginLeft: "5%"}}>
                                                <Text style={{fontWeight: "500", fontSize: RFPercentage(1.6), color: "#333D4B" }}>{item.orgPrice}</Text>
                                            </View>
                                        </View>
                                        <View style={{height: "100%", width: "20%", justifyContent: "center", alignItems: "center"}}>
                                            {productId !== item.id ?
                                            <TouchableOpacity onPress={() => insertCommercial(item)} style={{ height: height * 0.04, width: width * 0.14, backgroundColor: "#E8EFFC", borderRadius: width * 0.02, justifyContent: "center", alignItems: "center"}}>
                                                <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#6490E7" }}>선택</Text>
                                            </TouchableOpacity>
                                            :
                                            <View onPress={() => insertCommercial(item)} style={{ height: height * 0.04, width: width * 0.14, justifyContent: "center", alignItems: "center"}}>
                                                <ComponentSelectedCircle iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
                                            </View>
                                            }
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                    </>
                    }
                </ScrollView>
                <View style={{height: height / 6 , backgroundColor: "#fff", justifyContent: "center"}}>
                    {productList.length > 0 ?
                        <TouchableOpacity
                            onPress={insertCouponCommercial}
                            style={{
                                height: height / 14,
                                backgroundColor: '#6490E7',
                                marginLeft: '5%',
                                marginRight: '5%',
                                borderRadius: width * 0.03,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>장바구니에 담기</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            onPress={() => sProps.appManager.navGoTo('push', AppRoute.MENU, {  sParam: "home", iParam: "menu", nParam: iDetailData, aParam: iParam } )}
                            style={{
                                height: height / 14,
                                backgroundColor: '#6490E7',
                                marginLeft: '5%',
                                marginRight: '5%',
                                borderRadius: width * 0.03,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>스루 온리 상품 추가하기</Text>
                        </TouchableOpacity>
                    }
                </View>
            </>
            }
        </View>
    )
}

export default Detail;