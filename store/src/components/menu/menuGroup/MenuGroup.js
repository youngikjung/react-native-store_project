import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard, ScrollView, FlatList } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';

import { CompMenuGroupFunction } from '../../modal/ModalContents';
import { ComponentMenuLine } from '../../../assets/svg/menu_line';

const { width, height } = Dimensions.get('window');

const MenuGroup = ({ iProps, fnGroupInsert }) => {
    const [loading, setLoading] = useState(false);

    const [hasList, setHasList] = useState("none");

    const [sList, setList] = useState([]);

    const closePopUp = () => {
        iProps.appManager.hideModal();
        asyncData();
    }

    const openMenuGroupFunction = (sIndex) => {
        iProps.appManager.showModal(
            true,
            <CompMenuGroupFunction 
                sItem={sIndex}
                iList={sList}
                oProps={iProps}
                fnClose={() => closePopUp()}
            />, 
            "custom"
        );
    }

    const asyncData = async () => {
        setLoading(true);
        const store_id = iProps.UserConfigReducer.StoreID;
        const oResponse = await iProps.appManager.accessAxios("/app/ceo/store/categoryList/v3-" + store_id, "get", "text", null);
        if(oResponse !== undefined){
            if(oResponse.noList !== "none"){
                setList(oResponse.sResult);
                setHasList(true);
            }
            setHasList(oResponse.noList);
        }
        setLoading(false);
    }
    
    const groupInsert = async () => {
        if(fnGroupInsert !== undefined && typeof fnGroupInsert === "function"){
            await fnGroupInsert(sList,hasList,"group");
        }
    }

    useEffect(() => {
        asyncData();
    }, []);

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            <View style={{height: height * 0.085, backgroundColor: "#fff", alignItems: "flex-end", justifyContent: "center", marginRight: "5%"}}>
                <TouchableOpacity onPress={groupInsert} style={{height: height * 0.045, width: width * 0.27, backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontWeight: "500", fontSize: RFPercentage(1.7), color: "#fff" }}>메뉴 그룹 추가</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={sList}
                ListFooterComponent={<View style={{ height: height * 0.03 }} />}
                showsVerticalScrollIndicator={false}
                keyExtractor={(data, index) => "list-" + index + Math.random()}
                renderItem={({ item, index }) => {
                    return (
                        <View style={{height: height * 0.09, backgroundColor: "#fff", alignItems: "flex-end", justifyContent: "center", flexDirection: "row"}}>
                            <View style={{height: "100%", width: "80%"}}>
                                {item.productLine !== "" ?
                                    <>
                                        <View style={{flex:0.6, justifyContent: "center", marginLeft: "5%"}}>
                                            <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#333D4B" }}>{item.name}</Text>
                                        </View>
                                        <View style={{flex:0.4, justifyContent: "flex-start", marginLeft: "5%"}}>
                                            <Text style={{fontWeight: "500", fontSize: RFPercentage(1.6), color: "#6B7583" }}>{item.productLine}</Text>
                                        </View>
                                    </>
                                    :
                                    <View style={{flex:1, justifyContent: "center", marginLeft: "5%"}}>
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#333D4B" }}>{item.name}</Text>
                                    </View>
                                }
                            </View>
                            <TouchableOpacity onPress={() => openMenuGroupFunction(item)} style={{height: "100%", width: "20%", justifyContent: "center", alignItems: "center"}}>
                                <ComponentMenuLine iHeight={height * 0.045} iWidth={width * 0.045} iColor={"#646970"}/>
                            </TouchableOpacity>
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

export default MenuGroup;