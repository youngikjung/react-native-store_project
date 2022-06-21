import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard, Image, FlatList } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');

const Init = ({ fnCommercialDetail, commercial }) => {
    const [commercialList, setCommercialList] = useState([]);

    const commercialDetail = async (sIndex) => {
        if(fnCommercialDetail !== undefined && typeof fnCommercialDetail === "function"){
            await fnCommercialDetail(sIndex);
        }
    }

    useEffect(() => {
        setCommercialList(commercial);
    }, [commercial]);

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            {commercialList.length < 1 ?
                <>
                <View style={{height: height * 0.03 }}/>
                <View style={{height: height * 0.1, justifyContent: "center", alignItems: "center", marginLeft: "5%", marginRight: "5%", backgroundColor: "#F2F3F5", borderRadius: width * 0.03}}>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#191F28" }}>모든 광고를 사용중입니다.</Text>
                </View>
                <View style={{height: height * 0.03 }}/>
                </>
            :
                <FlatList
                    data={commercialList}
                    ListFooterComponent={<View style={{ height: height * 0.03 }} />}
                    ListHeaderComponent={
                        <>
                        <View style={{height: height * 0.03 }}/>
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
                                <View style={{ height: height * 0.2, width: "100%", flexDirection: "row"}}>
                                    <View style={{height: height * 0.2, width: width * 0.4, alignItems: "center" }}>
                                        <Image source={{ uri: item.img }} style={{width: width * 0.3, height : height * 0.2, borderRadius: width * 0.03, resizeMode: "center"}}/>
                                    </View>
                                    <View style={{height: height * 0.2, width: width * 0.6, justifyContent: "center", alignItems: "center" }}>
                                        <View style={{height: height * 0.15, width: width * 0.6}}>
                                            <View style={{height: height * 0.03, justifyContent: "center"}}>
                                                <Text style={{fontWeight: "800", fontSize: RFPercentage(2.3), color: "#000" }}>{item.name}</Text>
                                            </View>
                                            <View style={{height: height * 0.07, marginRight: "5%", justifyContent: "space-around"}}>
                                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#6B7583" }}>{item.detail1}</Text>
                                            </View>
                                            <View style={{height: height * 0.05, marginRight: "10%", justifyContent: "center"}}>
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
            }
        </View>
    )
}

export default Init;