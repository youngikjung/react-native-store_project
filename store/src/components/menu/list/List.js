import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard, ScrollView, FlatList } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';

import { ComponentDelete } from '../../../assets/svg/delete';
import { ComponentArrowLeft3 } from '../../../assets/svg/arrowLeft3';

import MenuGroup from '../menuGroup/MenuGroup';
import Product from '../product/Product';
import Option from '../option/Option';
import MainMenu from '../mainMenu/MainMenu';

import { AppRoute } from '../../../routes/AppRoutes';

const { width, height } = Dimensions.get('window');

const MenuPage = ({ sProps, fnMenuGroupInsert, iType, sRoute, sPath, initData }) => {
    const [sLocation, setLocation] = useState("");
    
    const [state, setState] = useState("category");

    const findUrl = () => {
        if(sPath !== undefined && sPath !== null && sPath.name !== undefined && sPath.name !== null){
            sProps.appManager.navGoTo('reset', AppRoute.COMMERCIAL, { sParam: sPath, iParam: initData } );
        } else {
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
            sProps.appManager.navGoTo('reset', temp);
        }
    }

    const backToInfomation = () => {
        sProps.appManager.navGoTo('reset', AppRoute.STOREOPERATIONTIME);
    }

    const groupInsert = async (sIndex,aIndex,xIndex,zIndex) => {
        if(fnMenuGroupInsert !== undefined && typeof fnMenuGroupInsert === "function"){
            await fnMenuGroupInsert(sIndex,aIndex,xIndex,zIndex);
        }
    }

    const access = async () => {
        let oUserConfig = {};
    
        oUserConfig['MENU'] = false;
        oUserConfig['ACTIVATION'] = true;

        await sProps.reduxSetUserConfig(oUserConfig);
        sProps.appManager.navGoTo('reset', AppRoute.ACTIVATION);
    }

    useEffect(() => {
        sProps.appManager.hideModal();
        sProps.appManager.hideDrawer();
    }, []);

    useEffect(() => {
        setState(iType);
    }, [iType]);

    useEffect(() => {
        setLocation(sRoute);
    }, [sRoute]);

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
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2.8), color: "#191F28", lineHeight: RFPercentage(3.5) }}>메뉴를 등록해주세요.</Text>
            </View>
            <View style={{height: height * 0.05, flexDirection: "row", borderBottomColor: "#F2F3F5", borderBottomWidth: 1}}>
                <TouchableOpacity onPress={() => setState("category")} style={{flex:1, justifyContent: "center", alignItems: "center", marginLeft: "5%", marginRight: "5%", borderBottomColor: state === "category" ? "#333D4B" : "#F2F3F5", borderBottomWidth: state === "category" ? 2 : 0}}>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#333D4B" }}>메뉴그룹</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setState("menu")} style={{flex:1, justifyContent: "center", alignItems: "center", marginLeft: "5%", marginRight: "5%", borderBottomColor: state === "menu" ? "#333D4B" : "#F2F3F5", borderBottomWidth: state === "menu" ? 2 : 0}}>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#333D4B" }}>메뉴관리</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setState("option")} style={{flex:1, justifyContent: "center", alignItems: "center", marginLeft: "5%", marginRight: "5%", borderBottomColor: state === "option" ? "#333D4B" : "#F2F3F5", borderBottomWidth: state === "option" ? 2 : 0}}>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#333D4B" }}>옵션편집</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setState("main")} style={{flex:1, justifyContent: "center", alignItems: "center", marginLeft: "5%", marginRight: "5%", borderBottomColor: state === "main" ? "#333D4B" : "#F2F3F5", borderBottomWidth: state === "main" ? 2 : 0}}>
                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#333D4B" }}>대표메뉴</Text>
                </TouchableOpacity>
            </View>
            {state === "category" &&
                <MenuGroup 
                    iProps={sProps}
                    fnGroupInsert={(sIndex,aIndex,xIndex) => groupInsert(sIndex,aIndex,xIndex)}
                />
                }
            {state === "menu" &&
                <Product 
                    iProps={sProps}
                    fnGroupInsert={(sIndex,aIndex,xIndex,zIndex) => groupInsert(sIndex,aIndex,xIndex,zIndex)}
                />
            }
            {state === "option" &&
                <Option 
                    iProps={sProps}
                    fnGroupInsert={(sIndex,aIndex,xIndex,zIndex) => groupInsert(sIndex,aIndex,xIndex,zIndex)}
                />
            }
            {state === "main" &&
                <MainMenu 
                    iProps={sProps}
                    fnGroupInsert={(sIndex,aIndex,xIndex,zIndex) => groupInsert(sIndex,aIndex,xIndex,zIndex)}
                />
            }
            {sLocation === "" ?
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
                        <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>다음</Text>
                    </TouchableOpacity>
                </View>
                :
                <View style={{ height: height / 10}}/>
            }
        </View>
    )
}

export default MenuPage;