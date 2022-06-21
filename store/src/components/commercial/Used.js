import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard, Image, FlatList } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

import { ComponentDelete } from '../../assets/svg/delete';

import { AppRoute } from '../../routes/AppRoutes';

import CommercialList from './used/List';
import CommercialProcess from './used/Process';
import CommercialUserList from './used/CommercialUserList';
import PaymentList from './used/PaymentList';

import {ComponentWon} from '../../assets/svg/won';
import {Componentbag} from '../../assets/svg/bag';

const { width, height } = Dimensions.get('window');

const Init = ({ sProps, fnChargedPoint, fnCommercialDetail, iParam, commercial, fnGoToCart, iMyPointWon, iMyPointChargedWon, iTotalPointWon, iUsedPage }) => {
    const [page, setPage] = useState("list");

    const [commercialList, setCommercialList] = useState([]);
    const [progresslList, setProgressList] = useState([]);

    const backToInfomation = () => {
        sProps.appManager.navGoTo('reset', AppRoute.HOME);
    }

    const chargedPoint = async () => {
        if(fnChargedPoint !== undefined && typeof fnChargedPoint === "function"){
            await fnChargedPoint(page);
        }
    }
    
    const goToCart = async () => {
        if(fnGoToCart !== undefined && typeof fnGoToCart === "function"){
            await fnGoToCart(page);
        }
    }

    const commercialDetail = async (sIndex) => {
        if(fnCommercialDetail !== undefined && typeof fnCommercialDetail === "function"){
            await fnCommercialDetail(sIndex,page);
        }
    }

    useEffect(() => {
        setProgressList(iParam);
    }, [iParam]);

    useEffect(() => {
        setCommercialList(commercial);
    }, [commercial]);

    useEffect(() => {
        setPage(iUsedPage);
    }, [iUsedPage]);

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
            <View style={{height: height * 0.1, justifyContent: "center"}}>
                <View style={{height: height * 0.05}}>
                    <FlatList
                        data={horizontalList}
                        horizontal
                        contentContainerStyle={{paddingHorizontal: width * 0.05 }}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(data, index) => "list-" + index + Math.random()}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity onPress={() => setPage(item.param)} style={{ height: height * 0.04, backgroundColor: item.param === page ? "#6490E7" : "#fff", borderRadius: width * 0.02, minWidth: width * 0.25, marginRight: width * 0.03, justifyContent: "center", alignItems: "center"}}>
                                    <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: item.param === page ? "#fff" : "#95959E"}}>{item.name}</Text>
                                </TouchableOpacity>
                            ) 
                        }}
                    />
                </View>
            </View>
            {page === "list" &&
                <CommercialProcess 
                    iProps={sProps}
                />
            }
            {page === "used" &&
                <CommercialUserList 
                    iProps={sProps}
                    commercial={commercialList}
                />
            }
            {page === "payment" &&
                <PaymentList 
                    iProps={sProps}
                />
            }
            {page === "add" &&
                <CommercialList 
                    iProps={sProps}
                    commercial={commercialList}
                    fnCommercialDetail={(sIndex) => commercialDetail(sIndex)}
                />
            }
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


const horizontalList = [
    { key :1, name: "스루 광고 서비스", param: "list" },
    { key :2, name: "광고 성과 차트", param: "used" },
    { key :3, name: "광고 추가하기", param: "add" },
    { key :4, name: "광고 결제내역", param: "payment" },
]