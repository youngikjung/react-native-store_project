import React, {useState,useEffect,useRef} from 'react';
import { View, Dimensions, Text, FlatList, Platform, Image, TouchableOpacity, AppState } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

import { InventorySwitchToggle } from '../modal/AppModalContent';

import {ComponentUnLimit} from '../../assets/svg/unlimit';
import {ComponentEdit} from '../../assets/svg/edit';

const { width, height } = Dimensions.get('window');

const Item = ({ sItem, fnOpen, iProps }) => {
    const [togle, setTogle] = useState(true);

    const openInventory = async () => {
        if(fnOpen !== undefined && typeof fnOpen === "function"){
            await fnOpen(sItem);
        }
    };

    const handleToggle = async () => {
        const oData = {
            sold_out : !togle,
            product_id : parseInt(sItem.id),
        }
        const oResponse = await iProps.appManager.accessAxios("/app/ceo/store/inventory/soldout", "post", null, oData);
        if(oResponse !== undefined){
            if(oResponse){
                setTogle(!togle);
            }
        }
    }

    useEffect(() => {
        setTogle(sItem.soldOut);
    }, [sItem]);

    return (
        <View style={{height: height * 0.12, width: "100%", justifyContent: "center", alignItems: "center"}}>
            <View style={{height: height * 0.11, width: width * 0.9, flexDirection: "row"}}>
                <View style={{flex:0.15, justifyContent: "center", alignItems: "center"}}>
                    <View style={{width: height * 0.05, height : height * 0.05, borderRadius: width}}>
                        <Image source={{uri: sItem.urlImg}} style={{height: "100%", width: "100%", borderRadius: width, resizeMode: "stretch"}}/>
                    </View>
                </View>
                <View style={{flex: 0.5, justifyContent: "center", paddingLeft: "5%"}}>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#000"}}>{sItem.name}</Text>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(1.7), color: "#000", marginTop: "10%"}}>
                        현재 수량:
                        {parseInt(sItem.count) > 0 ?
                            <Text style={{fontWeight: "800", fontSize: RFPercentage(1.8), color: "#000"}}> {sItem.count} 개</Text>
                        :
                            <ComponentUnLimit iHeight={height * 0.013} iWidth={height * 0.05} iColor={"#000"}/>
                        }
                    </Text>
                </View>
                <View style={{flex: 0.35, justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => openInventory()} style={{height: "40%", width: "95%", justifyContent: "center", alignItems: "center", flexDirection: "row", backgroundColor: "#E8EFFC", borderRadius: width * 0.03}}>
                        <Text style={{fontWeight: "800", fontSize: RFPercentage(1.6), color: "#6490E7", marginRight: "5%"}}>+ 수량 변경</Text>
                    </TouchableOpacity>
                    <View style={{height: "45%", width: "100%", justifyContent: "space-around", alignItems: "center", flexDirection: "row"}}>
                        <Text style={{fontWeight: "800", fontSize: RFPercentage(1.6), color: togle ? "#6490E8" :"#F45552"}}>{togle ? "판매중": "품절"}</Text>
                        <InventorySwitchToggle isOn={togle} onToggle={() => handleToggle()} />
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Item;