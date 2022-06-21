import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard, ScrollView, FlatList, Animated } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';
import DraggableFlatList, {
    ScaleDecorator,
} from "react-native-draggable-flatlist";

import { CompModalOptionControll } from '../../../modal/ModalContents';

import { ComponentDelete } from '../../../../assets/svg/delete';
import { ComponentArrowLeft3 } from '../../../../assets/svg/arrowLeft3';
import { ComponentGroupList } from '../../../../assets/svg/groupList';

const { width, height } = Dimensions.get('window');

const Step4 = ({ oProps, fnBackGroupList, fnNextStep, fnDelete, sAnimated, iList }) => {
    const [animated] = useState(new Animated.Value(sAnimated));

    const [changeAlert, setChangeAlert] = useState(true);

    const [sList, setList] = useState([]);

    const done = async () => {
        if(fnNextStep !== undefined && typeof fnNextStep === "function"){
            await fnNextStep(sList);
        }
    }

    const backStep = async () => {
        if(fnBackGroupList !== undefined && typeof fnBackGroupList === "function"){
            await fnBackGroupList("step3",width * 0.8);
        }
    }

    const quitStep = async () => {
        if(fnDelete !== undefined && typeof fnDelete === "function"){
            await fnDelete();
        }
    }

    const selectValue = async (sIndex) => {
        setList(sIndex);
        await oProps.appManager.hideModal();
    }

    const openOptionControll = () => {
        oProps.appManager.showModal(
            true,
            <CompModalOptionControll
                sProps={oProps}
                fnSelectValue={(sIndex) => selectValue(sIndex)}
                fnCancel={() => oProps.appManager.hideModal()} 
            />, 
            "custom"
        );
    };

    const deleteOption = async (sIndex) => {
        let temp = sList;
        temp = temp.filter((item) => item.key !== sIndex);
        setList(temp);
    };

    const animationStyles = {
        width: animated,
    };

    Animated.timing(animated, {
        toValue: width * 0.8,
        duration: 1000,
        useNativeDriver: false,
    }).start();

    useEffect(() => {
        setList(iList);
    }, [iList]);

    const renderItem = ({ item, drag, isActive }) => {
        return (
            <ScaleDecorator>
                <TouchableOpacity 
                    onLongPress={drag}
                    disabled={isActive}
                    style={{height: height * 0.14, alignItems: "center"}}
                >
                    <View style={{height: height * 0.11, width: "90%", borderRadius: 10, borderWidth: 1, borderColor: "#F2F3F5", flexDirection: "row"}}>
                        <View style={{flex:0.15, justifyContent: "center", alignItems: "center"}}>
                            <ComponentGroupList iHeight={height * 0.025} iWidth={width * 0.07} iColor={"#6B7583"}/>
                        </View>
                        <View style={{flex:0.6, backgroundColor: "#fff", marginLeft: "2%"}}>
                            <View style={{flex: 0.6, justifyContent: "center"}}>
                                <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#333D4B"}}>{item.name}</Text>
                            </View>
                            <View style={{flex: 0.4, alignItems: "flex-start", flexDirection: "row"}}>
                                {item.list.slice(0,4).map((query,sIndex) => {
                                    if(sIndex == 3){
                                        return (
                                            <Text key={sIndex} style={{fontSize: RFPercentage(1.7), fontWeight: '500', color: "#333D4B"}}>{query.name}...</Text>
                                        )
                                    } else {
                                        return (
                                            <Text key={sIndex} style={{fontSize: RFPercentage(1.7), fontWeight: '500', color: "#333D4B"}}>{query.name},</Text>
                                        )
                                    }
                                })}
                            </View>
                        </View>
                        <View style={{flex:0.25, justifyContent: "center"}}>
                            <TouchableOpacity onPress={() => deleteOption(item.key)} style={{height: "60%", width: "80%", backgroundColor: "#fff", justifyContent: "center", alignItems: "center", borderRadius: 5, borderWidth: 1, borderColor: "#EF4452"}}>
                                <Text style={{fontSize: RFPercentage(1.9), fontWeight: '500', color: "#EF4452"}}>해제</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            <View style={{height: height * 0.06, backgroundColor: "#fff", justifyContent: "flex-end", alignItems: "center"}}>
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#333D4B" }}>메뉴 추가</Text>
                <TouchableOpacity onPress={quitStep} style={{position: "absolute", bottom: 0, right: "5%", height: height * 0.05, width: height * 0.05, justifyContent: "flex-end", alignItems: "center"}}>
                    <ComponentDelete iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={backStep} style={{position: "absolute", bottom: 0, left: "5%", height: height * 0.03, width: height * 0.03, justifyContent: "flex-end", alignItems: "center"}}>
                    <ComponentArrowLeft3 iHeight={height * 0.025} iWidth={height * 0.025} iColor={"#646970"}/>
                </TouchableOpacity>
            </View>
            <View style={{ height: height * 0.03}}/>
            <Animated.View style={[objectStyles.object, animationStyles]}/>
            <View style={{height : height * 0.09, justifyContent: "center", marginLeft: "5%"}}>
                <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#333D4B"}}>
                    옵션
                    <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#B0B8C3"}}>
                        (선택)
                    </Text>
                </Text>
            </View>
            {(sList.length > 0 && changeAlert) && 
                <>
                    <TouchableOpacity onPress={() => setChangeAlert(false)} style={{position: "absolute", zIndex: 99, top: height * 0.13, left: "10%", height: height * 0.04, width: width * 0.8, backgroundColor: "#6490E7", borderRadius: width * 0.05, justifyContent: "space-between", alignItems: "center", flexDirection: "row", paddingLeft: "20%"}}>
                        <Text style={{fontSize: RFPercentage(1.5), fontWeight: '400', color: "#fff"}}>버튼을 위 아래로 움직여 순서를 변경해주세요.</Text>
                        <ComponentDelete iHeight={height * 0.02} iWidth={width * 0.08} iColor={"#fff"}/>
                        <View style={{position: "absolute", zIndex: 99, top: height * 0.02, left: "15%", height: height * 0.025, width: height * 0.025, backgroundColor: "#6490E7", transform: [{ rotateZ: '0.785398rad' }]}} />
                    </TouchableOpacity>
                </>
            }
            <View style={{flex:1, backgroundColor: "#fff"}}>
                {sList.length > 0 ?
                    <DraggableFlatList
                        data={sList}
                        onDragEnd={({ data }) => {
                            setList(data)
                        }}
                        ListFooterComponent={() => {
                            return (
                                <TouchableOpacity onPress={openOptionControll} style={{height : height * 0.1, justifyContent: "flex-start", marginLeft: "5%"}}>
                                    <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#6490E7"}}>
                                        + 옵션그룹 추가
                                    </Text>
                                </TouchableOpacity>
                            )
                        }}
                        keyExtractor={(item) => item.key}
                        renderItem={renderItem}
                    />
                    :
                    <TouchableOpacity onPress={openOptionControll} style={{height : height * 0.1, justifyContent: "flex-start", marginLeft: "5%"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#6490E7"}}>
                            + 옵션그룹 추가
                        </Text>
                    </TouchableOpacity>
                }
            </View>
            <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center"}}>
                <TouchableOpacity onPress={done} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>다음</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const objectStyles = {
    object: {
        height: height * 0.005, 
        borderBottomColor: "#6490E7", 
        borderBottomWidth: 2
    },
}

export default Step4;