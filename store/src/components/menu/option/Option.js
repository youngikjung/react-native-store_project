import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard, ScrollView, FlatList, Image } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';

import { ComponentArrowLeft2 } from '../../../assets/svg/arrowLeft2';
import { ComponentArrowDown1 } from '../../../assets/svg/arrow_down1';
import { ComponentMenuLine } from '../../../assets/svg/menu_line';

import { CompOptionFunction } from '../../modal/ModalContents';

const { width, height } = Dimensions.get('window');

const Option = ({ iProps, fnGroupInsert }) => {
    const [loading, setLoading] = useState(false);

    const [initCategoryNm, setInitCategoryNm] = useState("")

    const [sList, setList] = useState([]);

    const closePopUp = () => {
        iProps.appManager.hideModal();
        asyncData();
    }

    const groupInsert = async () => {
        if(fnGroupInsert !== undefined && typeof fnGroupInsert === "function"){
            await fnGroupInsert([],"","option");
        }
    }

    const openOptionGroupFunction = async (sIndex) => {
        if(sIndex !== undefined && sIndex !== null){
            iProps.appManager.showModal(
                true,
                <CompOptionFunction 
                    sItem={sIndex}
                    oProps={iProps}
                    fnClose={() => closePopUp()}
                />, 
                "custom"
            );
        }
    }

    const asyncData = async () => {
        setLoading(true);
        const store_id = iProps.UserConfigReducer.StoreID;
        const oResponse = await iProps.appManager.accessAxios("/app/sales/store/register/optionList-" + store_id, "get", "text", null);
        if(oResponse !== undefined){
            setList(oResponse);
        }
        setLoading(false);
    }


    useEffect(() => {
        asyncData();
    }, []);

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            <View style={{height: height * 0.085, backgroundColor: "#fff", flexDirection: "row",justifyContent: "flex-end", alignItems: "center", paddingLeft: "5%", paddingRight: "5%"}}>
                <TouchableOpacity onPress={groupInsert} style={{height: height * 0.045, width: width * 0.3, backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontWeight: "500", fontSize: RFPercentage(1.7), color: "#fff" }}>옵션그룹 추가</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={sList}
                ListFooterComponent={<View style={{ height: height * 0.03 }} />}
                showsVerticalScrollIndicator={false}
                keyExtractor={(data, index) => "list-" + index + Math.random()}
                renderItem={({ item, index }) => {
                    return (
                        <View style={{height: height * 0.16, backgroundColor: "#fff"}}>
                            <View style={{height: height * 0.09, alignItems: "flex-end", justifyContent: "center", flexDirection: "row"}}>
                                <View style={{height: "100%", width: "80%"}}>
                                    <View style={{flex:0.6, justifyContent: "flex-end", marginLeft: "5%"}}>
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#333D4B" }}>{item.name}</Text>
                                    </View>
                                    <View style={{flex:0.4, justifyContent: "flex-start", marginLeft: "5%", marginTop: "2%"}}>
                                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.6), color: "#6B7583" }}>{item.optionNm}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => openOptionGroupFunction(item)} style={{height: "100%", width: "20%", justifyContent: "center", alignItems: "center"}}>
                                    <ComponentMenuLine iHeight={height * 0.045} iWidth={width * 0.045} iColor={"#646970"}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{height: height * 0.07, flexDirection: "row", marginLeft: "4%", marginRight: "4%"}}>
                                <View style={{height: height * 0.05, width: "25%", justifyContent: "center", alignItems: "flex-start"}}>
                                    <View style={{height: "70%", width: "80%", backgroundColor: "#F2F3F5", borderRadius: 5, justifyContent: "center", alignItems: "center"}}>
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.6), color: "#3B3B46" }}>연결메뉴</Text>
                                    </View>
                                </View>
                                <View style={{height: height * 0.05, width: "75%", justifyContent: "center"}}>
                                    <Text style={{fontWeight: "500", fontSize: RFPercentage(1.6), color: "#505866" }}>{item.menu}</Text>
                                </View>
                            </View>
                        </View>
                    ) 
                }}
            />
            {loading &&
                <View style={{position: "absolute", top: 0, flex:1, width, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
        </View>
    )
}

export default Option;