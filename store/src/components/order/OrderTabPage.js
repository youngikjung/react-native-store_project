import React, {useState,useEffect} from 'react';
import { View, Dimensions, Text, FlatList, TouchableOpacity } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

import {ComponentCheck} from '../../assets/svg/check';

const { width, height } = Dimensions.get('window');

const NavTabComponent = ({ iProps, sList }) => {

    const navigateToOne = async (nIndex) => {
        iProps.navigation.navigate("list" + nIndex.toString());
    };

    return (
        <View style={{height : height * 0.06, backgroundColor: "#fff", width}}>
            <FlatList
                data={sList}
                horizontal
                contentContainerStyle={{paddingHorizontal: width * 0.05, alignItems: "center" }}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(data, index) => "list-" + index + Math.random()}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity
                            style={{backgroundColor: "#fff"}}
                            onPress={() => navigateToOne(index)}
                        >
                            <View 
                                style={{
                                    width: width * 0.3, 
                                    height : height * 0.04, 
                                    borderRadius: width * 0.03, 
                                    marginRight: width * 0.03,
                                    backgroundColor: index.toString() === iProps.state.index.toString() ? "#6490E7" : "#f9f9f9",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }} 
                            >
                                {item.pickup_type.toString() === "1" ?
                                    <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: iProps.state.index.toString() === index.toString() ? "#fff" : "#666" }}>{item.car_nr}</Text>
                                :
                                    <>
                                        {item.user_phone_number !== undefined && item.user_phone_number !== null && item.user_phone_number !== "" &&
                                        <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: iProps.state.index.toString() === index.toString() ? "#fff" : "#666" }}>
                                            {item.user_phone_number.substring((item.user_phone_number.length - 4), item.user_phone_number.length)}
                                        </Text>
                                        }
                                    </>
                                }
                                {iProps.state.index.toString() === index.toString() &&
                                    <View style={{position: "absolute", bottom: width * 0.04, left: "5%"}}>
                                        <ComponentCheck iHeight={height * 0.03} iWidth={width * 0.08} iColor={"#FAE300"}/>
                                    </View>
                                }
                            </View>
                        </TouchableOpacity>
                    ) 
                }}
            />
        </View>
    )
}

export default NavTabComponent;