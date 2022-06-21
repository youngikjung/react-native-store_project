import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard, Image, FlatList } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

import { ComponentDelete } from '../../assets/svg/delete';

import { AppRoute } from '../../routes/AppRoutes';

import {ComponentWon} from '../../assets/svg/won';
import {Componentbag} from '../../assets/svg/bag';

const { width, height } = Dimensions.get('window');

const Init = ({ sProps, fnChargedPoint, fnCommercialDetail, iParam, commercial, fnGoToCart, iMyPointWon, iMyPointChargedWon, iTotalPointWon }) => {
    const [commercialList, setCommercialList] = useState([]);
    const [progresslList, setProgressList] = useState([]);

    const backToInfomation = () => {
        sProps.appManager.navGoTo('reset', AppRoute.HOME);
    }

    const chargedPoint = async () => {
        if(fnChargedPoint !== undefined && typeof fnChargedPoint === "function"){
            await fnChargedPoint();
        }
    }
    
    const goToCart = async () => {
        if(fnGoToCart !== undefined && typeof fnGoToCart === "function"){
            await fnGoToCart();
        }
    }

    const commercialDetail = async (sIndex) => {
        if(fnCommercialDetail !== undefined && typeof fnCommercialDetail === "function"){
            await fnCommercialDetail(sIndex);
        }
    }

    useEffect(() => {
        setProgressList(iParam);
    }, [iParam]);

    useEffect(() => {
        setCommercialList(commercial);
    }, [commercial]);

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            <View style={{height: height * 0.08 }}>
                <View style={{flex:1, alignItems: "flex-start", justifyContent: "center", paddingLeft: width * 0.07 }}>
                    <Text style={{fontWeight: "700", fontSize: RFPercentage(2.1), color: "#191F28", marginTop: "3%"}}>광고 선택하기</Text>
                </View>
                <TouchableOpacity onPress={backToInfomation} style={{ position: "absolute", top: height * 0.02, right: width * 0.05, height: height * 0.05, width: height * 0.05, justifyContent: "center", alignItems: "center"}}>
                    <ComponentDelete iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
                </TouchableOpacity>
            </View>
            <View style={{height: height * 0.17, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                <View style={{height: height * 0.1, width: "20%", alignItems: "center"}}>
                    <ComponentWon iHeight={height * 0.04} iWidth={height * 0.04} iColor={"#646970"}/>
                </View>
                <View style={{height: height * 0.17, width: "50%", justifyContent: "center" }}>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2.3), color: "#000"}}>나의 광고포인트</Text>
                    <Text style={{fontWeight: "900", fontSize: RFPercentage(2.5), color: "#000"}}>{iTotalPointWon}원</Text>
                    <View style={{ height: height * 0.07, flexDirection: "row"}}>
                        <View style={{ width: "50%", height: "100%", justifyContent: "center"}}>
                            <Text style={{fontWeight: "400", fontSize: RFPercentage(1.6), color: "#6B7583"}}>무상 포인트</Text>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#6490E7", marginTop: "2%"}}>{iMyPointWon}원</Text>
                        </View>
                        <View style={{ width: "50%", height: "100%", justifyContent: "center"}}>
                            <Text style={{fontWeight: "400", fontSize: RFPercentage(1.6), color: "#6B7583"}}>유상 포인트</Text>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#6490E7", marginTop: "2%"}}>{iMyPointChargedWon}원</Text>
                        </View>
                    </View>
                </View>
                <View style={{height: height * 0.1, width: "30%", alignItems: "center"}}>
                    <TouchableOpacity onPress={chargedPoint} style={{height: height * 0.04, width: width * 0.2, backgroundColor: "#6490E7", justifyContent: "center", alignItems: "center", borderRadius: width * 0.03}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#fff"}}>충전</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <FlatList
                    data={commercialList}
                    ListFooterComponent={<View style={{ height: height * 0.03 }} />}
                    ListHeaderComponent={
                        <>
                        <View style={{height: height * 0.01 }}/>
                        <View style={{height: height * 0.1, justifyContent: "center", alignItems: "center", marginLeft: "5%", marginRight: "5%", backgroundColor: "#F2F3F5", borderRadius: width * 0.03}}>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#191F28" }}>우리매장에 맞는 광고를</Text>
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#191F28" }}>선택해볼까요?</Text>
                        </View>
                        <View style={{height: height * 0.03 }}/>
                        </>
                    }
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(data, index) => "list-" + index + Math.random()}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity onPress={() => commercialDetail(item)} style={{ height: height * 0.27, width, borderBottomColor: "#F2F3F5", borderBottomWidth: 1}}>
                                <View style={{height: height * 0.023 }}/>
                                <View style={{ height: height * 0.20, width: "100%", flexDirection: "row"}}>
                                    <View style={{height: height * 0.20, width: width * 0.4, alignItems: "center" }}>
                                        <Image source={{ uri :item.img }} style={{width: width * 0.3, height : height * 0.20, borderRadius: width * 0.03, resizeMode: "center"}}/>
                                    </View>
                                    <View style={{height: height * 0.20, width: width * 0.6, justifyContent: "center", alignItems: "center"}}>
                                        <View style={{height: height * 0.15, width: width * 0.6}}>
                                            <View style={{height: height * 0.03, justifyContent: "center"}}>
                                                <Text style={{fontWeight: "800", fontSize: RFPercentage(2.3), color: "#000" }}>{item.name}</Text>
                                            </View>
                                            <View style={{height: height * 0.07, marginRight: "5%", justifyContent: "space-around"}}>
                                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#6B7583" }}>{item.detail1}</Text>
                                            </View>
                                            <View style={{height: height * 0.05, marginRight: "5%", justifyContent: "center"}}>
                                                <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#000" }}>{item.priceCasting}원</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={{height: height * 0.06, justifyContent: "center", marginLeft: "5%"}}>
                                    <View style={{height: height * 0.05, backgroundColor: "#E8EFFC", width: "95%", borderRadius: width * 0.02, justifyContent: "center", alignItems: "center"}}>
                                        <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#6490E7" }}>선택</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ) 
                    }}
                />
            </View>
            {progresslList.length > 0 ?
                <View style={{height: height / 8 , backgroundColor: "#fff", alignItems: "center", flexDirection: "row"}}>
                    <TouchableOpacity
                        onPress={goToCart}
                        style={{
                            height: height / 14,
                            width: width * 0.7,
                            backgroundColor: '#6490E7',
                            marginLeft: '5%',
                            marginRight: '5%',
                            borderRadius: width * 0.03,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>광고 결제하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={goToCart} style={{ height:  width * 0.15, width:  width * 0.15, alignItems: "center", justifyContent: "center", borderRadius: width, backgroundColor: "#6490E7", zIndex: 0}}>
                        <Componentbag iHeight={height * 0.035} iWidth={height * 0.035} iColor={"#000"}/>
                    </TouchableOpacity>
                    <View style={{ position: "absolute", top: height * 0.01, right: width * 0.03, height: width * 0.08, width: width * 0.08, alignItems: "center", justifyContent: "center", borderRadius: width, backgroundColor: "#EF4452", zIndex: 5}}>
                        <Text style={{fontWeight: "400", fontSize: RFPercentage(2.5), color: "#fff" }}>{progresslList.length}</Text>
                    </View>
                </View>
            :
                <View style={{ height: height * 0.05}}/>
            }
        </View>
    )
}

export default Init;