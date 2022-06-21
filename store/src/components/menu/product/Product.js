import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard, ScrollView, FlatList, Image } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';

import { ComponentArrowLeft2 } from '../../../assets/svg/arrowLeft2';
import { ComponentArrowDown1 } from '../../../assets/svg/arrow_down1';
import { ComponentMenuLine } from '../../../assets/svg/menu_line';

import { CompMenuFunction } from '../../modal/ModalContents';

const { width, height } = Dimensions.get('window');

const MenuGroup = ({ iProps, fnGroupInsert }) => {
    const [loading, setLoading] = useState(false);

    const [initCategoryNm, setInitCategoryNm] = useState("")

    const [sCategory, setCategory] = useState("");

    const [sCategoryList, setCategoryList] = useState([]);
    const [sProductList, setProductList] = useState([]);

    const [getOpenList, setGetOpenList] = useState(false);

    const closePopUp = () => {
        iProps.appManager.hideModal();
        asyncData();
    }

    const openCategoryList = async () => {
        setGetOpenList(true);
    }
    
    const selectedCategoryList = async (sIndex) => {
        setInitCategoryNm(sIndex.name);
        setCategory(sIndex.id);
        getMenuList(sIndex.id);
        setGetOpenList(false);
    }

    const openMenuGroupFunction = async (sIndex) => {
        iProps.appManager.showModal(
            true,
            <CompMenuFunction 
                sItem={sIndex}
                oProps={iProps}
                iProductList={sProductList}
                fnClose={() => closePopUp()}
            />, 
            "custom"
        );
    }

    const asyncData = async () => {
        setLoading(true);
        await getCategory(parseInt(iProps.UserConfigReducer.StoreID));
        setLoading(false);
    }

    const groupInsert = async () => {
        if(fnGroupInsert !== undefined && typeof fnGroupInsert === "function"){
            await fnGroupInsert([],"","menu",sCategory);
        }
    }
    
    const getMenuList = async (sIndex) => {
        const category_id = sIndex;
        const oResponse = await iProps.appManager.accessAxios("/app/sales/store/register/menuList-" + category_id, "get", "text", null);
        if(oResponse !== undefined){
            setProductList(oResponse);
        }
    }

    const getCategory = async (sIndex) => {
        const store_id = sIndex;
        const oResponse = await iProps.appManager.accessAxios("/app/sales/store/register/detailMenuList-" + store_id, "get", "text", null);
        if(oResponse !== undefined){
            setCategoryList(oResponse.sResult);
            if(oResponse.sResult.length > 0){
                setCategory(parseInt(oResponse.sResult[0].id));
                setInitCategoryNm(oResponse.sResult[0].name);
                getMenuList(parseInt(oResponse.sResult[0].id));
            }
        }
    }

    useEffect(() => {
        asyncData();
    }, []);

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            <View style={{height: height * 0.085, backgroundColor: "#F2F3F5", flexDirection: "row",justifyContent: "flex-end", alignItems: "center", paddingLeft: "5%", paddingRight: "5%"}}>
                <View style={{height: height * 0.045, width: width * 0.7, alignItems: "center", flexDirection: "row"}}>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#6B7583", marginRight: "2%" }}>메뉴그룹</Text>
                    <ComponentArrowLeft2 iHeight={height * 0.02} iWidth={width * 0.02} iColor={"#646970"}/>
                    <TouchableOpacity onPress={openCategoryList} style={{height: height * 0.045, width: width * 0.5, justifyContent: "flex-start", alignItems: "center", flexDirection: "row", paddingLeft: "5%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#333D4B", marginRight: "5%" }}>{initCategoryNm}</Text>
                        <ComponentArrowDown1 iHeight={height * 0.04} iWidth={width * 0.04} iColor={"#646970"}/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={groupInsert} style={{height: height * 0.045, width: width * 0.2, backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontWeight: "500", fontSize: RFPercentage(1.7), color: "#fff" }}>메뉴 추가</Text>
                </TouchableOpacity>
            </View>
            {getOpenList &&
                <ScrollView style={{position: "absolute", zIndex: 100, left: "22%", top: "3%", minHeight: height * 0.05, maxHeight: height * 0.2, borderRadius: 5}}>
                    {sCategoryList.map((item,index) => {
                        return (
                            <TouchableOpacity key={index} onPress={() => selectedCategoryList(item)} style={{ height: height * 0.05, width: width * 0.45, alignItems: "flex-start", justifyContent: "center", paddingLeft: "5%", borderBottomColor: "#fff", borderBottomWidth: 1, backgroundColor: "#E5E7EA"}}>
                                <Text style={{fontWeight: "600", fontSize: RFPercentage(1.7), color: "#333D4B" }}>{item.name}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            }
            <FlatList
                data={sProductList}
                ListFooterComponent={<View style={{ height: height * 0.03 }} />}
                showsVerticalScrollIndicator={false}
                keyExtractor={(data, index) => "list-" + index + Math.random()}
                renderItem={({ item, index }) => {
                    return (
                        <View style={{height: height * 0.09, backgroundColor: "#fff", alignItems: "flex-end", justifyContent: "center", flexDirection: "row"}}>
                            <View style={{height: "100%", width: "20%", justifyContent: "center", alignItems: "flex-end"}}>
                                <View style={{height: height * 0.06, width: width * 0.14}}>
                                    {item.urlImg !== "" ?
                                        <Image source={{uri: item.urlImg}} style={{width: width * 0.14, height : height * 0.06, borderRadius: 5, resizeMode: "stretch"}}/>
                                    :
                                        <Image source={{uri: "https://api-stg.ivid.kr/img/no-image-new.png"}} style={{width: width * 0.14, height : height * 0.06, borderRadius: 5, resizeMode: "stretch"}}/>
                                    }
                                </View>
                            </View>
                            <View style={{height: "100%", width: "60%"}}>
                                <View style={{flex:0.6, justifyContent: "center", marginLeft: "5%"}}>
                                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#333D4B" }}>{item.name}</Text>
                                </View>
                                <View style={{flex:0.4, justifyContent: "flex-start", marginLeft: "5%"}}>
                                    <Text style={{fontWeight: "500", fontSize: RFPercentage(1.6), color: "#333D4B" }}>{item.price}원</Text>
                                </View>
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