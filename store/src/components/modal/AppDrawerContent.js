import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Dimensions, TouchableOpacity, FlatList, ScrollView, Image, Linking } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import { Transition, Transitioning } from 'react-native-reanimated';
import { WebView } from "react-native-webview";
import moment from 'moment-timezone';
import 'moment/locale/ko';

import { ComponentMonitor } from '../../assets/svg/monitor';
import { ComponentInfo } from '../../assets/svg/info';
import { ComponentBox } from '../../assets/svg/box';

import { AppRoute } from '../../routes/AppRoutes';

const { width, height } = Dimensions.get('window');

const transition = (
    <Transition.Together>
        <Transition.In type='fade' durationMs={500} />
        <Transition.Change />
        <Transition.Out type='fade' durationMs={500} />
    </Transition.Together>
);

export const CompDrawer = ({ sProps, iLocation }) => {
    const [currentIndex, setCurrentIndex] = useState(null);
    const use = useRef();

    return (
        <View 
            style={{
                marginHorizontal: "-6%",
                width: width * 0.7,
                height: height, 
                backgroundColor: "#fff",
            }}
        >
            <Transitioning.View ref={use} transition={transition} style={{flex: 1, paddingTop: "5%"}}>
                <View style={{height: height * 0.1,width : "100%", justifyContent: "center", paddingLeft: "10%"}}>
                    <Text style={{fontSize: RFPercentage(1.4), fontWeight: '400', color: "#000"}}>안녕하세요</Text>
                    <Text style={{fontSize: RFPercentage(1.6), fontWeight: '600', color: "#6490E8"}}>{sProps.UserConfigReducer.StoreName}</Text>
                </View>
                {sList.map(({ name, key, value, content }, index) => {
                    return (
                        <TouchableOpacity 
                            key={key.toString + value} 
                            onPress={() => {
                                use.current.animateNextTransition();
                                setCurrentIndex(index === currentIndex ? null : index)
                            }} 
                            style={{
                                height: currentIndex === index ? (height * 0.05) * content.length + height * 0.06 : height * 0.06,
                                width : "100%", 
                            }}
                        >
                            <View style={{height: height * 0.06, alignItems: "center", backgroundColor: currentIndex === index ? "#6490E8": "#fff", marginRight: "10%", borderTopRightRadius: 10, borderBottomRightRadius: 10, flexDirection: "row"}}>
                                <View style={{marginLeft: "5%", justifyContent: "center", alignItems: "center"}}>
                                    {value === "owner" &&
                                        <ComponentInfo iHeight={height * 0.02} iWidth={width * 0.1} iColor={currentIndex === index ? "#fff" : "#6490E8"}/>
                                    }
                                    {value === "product" &&
                                        <ComponentBox iHeight={height * 0.02} iWidth={width * 0.1} iColor={currentIndex === index ? "#fff" : "#6490E8"}/>
                                    }
                                    {value === "store" &&
                                        <ComponentMonitor iHeight={height * 0.02} iWidth={width * 0.1} iColor={currentIndex === index ? "#fff" : "#6490E8"}/>
                                    }
                                </View>
                                <Text style={{fontSize: RFPercentage(1.6), fontWeight: '400', color: currentIndex === index ? "#fff" : "#000", marginLeft: "2%"}}>{name}</Text>
                            </View>
                            {currentIndex === index &&
                                <View>
                                    {content.map(({title, route}) => (
                                        <TouchableOpacity key={title} onPress={() => sProps.appManager.navGoTo('reset', route, { sParam : iLocation})} style={{height: height * 0.05,width : "100%", justifyContent: "center", paddingLeft: "21%"}}>
                                            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '400', color: "#666666"}}>{title}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            }
                        </TouchableOpacity>
                    )
                })}
                <TouchableOpacity onPress={() => sProps.appManager.navGoTo('reset', AppRoute.SETTINGS, { sParam : iLocation})} style={{height: height * 0.06,width : "100%", justifyContent: "center", paddingLeft: "10%"}}>
                    <Text style={{fontSize: RFPercentage(1.6), fontWeight: '400', color: "#000"}}>앱 설정</Text>
                </TouchableOpacity>
                
                
            </Transitioning.View>
        </View>
    )
}

const sList = [
    { 
        key: 1, 
        value: "owner", 
        name: "사업자 정보", 
        content: [
            { key: 1, title: "사업자정보", route: AppRoute.OWNERINFO }
        ] 
    },
    { 
        key: 2, 
        value: "product", 
        name: "상품 관리", 
        content: [
            { key: 1, title: "상품분류 설정", route: AppRoute.CATEGORY },
            { key: 2, title: "상품관리 설정", route: AppRoute.PRODUCT },
            { key: 3, title: "옵션관리 설정", route: AppRoute.OPTION },
        ] 
    },
    { 
        key: 3, 
        value: "store", 
        name: "매장 관리", 
        content: [
            { key: 1, title: "매장 설정", route: AppRoute.STOREINFO },
            { key: 2, title: "상품준비시간 설정", route: AppRoute.READYTOORDER },
            { key: 3, title: "픽업정보 설정", route: AppRoute.PICUPINFO },
            { key: 4, title: "픽업존 설정", route: AppRoute.PICUPZONE },
            { key: 5, title: "운영시간 설정", route: AppRoute.OPERATIONTIME },
            { key: 6, title: "휴무 설정", route: AppRoute.STOREHOLIDAY },
            { key: 7, title: "매장사진 설정", route: AppRoute.STOREPIC },
        ]
    }
]