import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard, ScrollView, FlatList } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';

import { CompModalContent } from '../../modal/ModalContents';

import { ComponentDelete } from '../../../assets/svg/delete';
import { ComponentQuestionMark } from '../../../assets/svg/question_mark';

import { CompModalAboutMenuGroup } from '../../../components/modal/ModalContents';

const { width, height } = Dimensions.get('window');

const MenuGroupInsert = ({ sProps, fnBackGroupList, cList, sHasList }) => {
    const [loading, setLoading] = useState(false);

    const [groupNm, setGroupNm] = useState("");
    const [groupNmErrColor, setGroupNmErrColor] = useState("#EFF0F6");
    const [sNmErrText, setNmErrText] = useState("");

    const [textInputType, setTextInputType] = useState("");

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const onChangeGroupNm = text => {
        setGroupNm(text);
        setNmErrText("");
        setGroupNmErrColor("#6490E7");
    };
    
    const activeNmText = () => {
        setGroupNmErrColor("#6490E7");
        setTextInputType("nm");
    }
    
    const unactiveNmText = () => {
        setGroupNmErrColor("#EFF0F6");
        setTextInputType("");
        Keyboard.dismiss();
    }
    
    const onKeyboardDidShow = (e) => {
        setKeyboardHeight(e.endCoordinates.height);
    }

    const openModal = (sIndex) => {
        sProps.appManager.showModal(
            true,
            <CompModalContent sText={sIndex}/>, 
            "custom",
            2500
        );
    };

    const insert = async () => {
        if(groupNm !== ""){
            setLoading(true);
            unactiveNmText();
            
            const oData = {
                sContent : groupNm,
                isMain : false,
                isUse : "use",
                menuId : sHasList,
                sCategoryList: cList,
                store_id: sProps.UserConfigReducer.StoreID
            }
            const oResponse = await sProps.appManager.accessAxios("/app/sales/store/register/insertCategory", "post", null, oData);
            if(oResponse !== undefined){
                if(oResponse.resultCd === "0000"){
                    openModal("등록되었습니다");
                    if(fnBackGroupList !== undefined && typeof fnBackGroupList === "function"){
                        await fnBackGroupList();
                    }
                } else {
                    openModal(oResponse.resultMsg);
                }
            }
            setLoading(false);
        } else {
            setGroupNmErrColor("#EF4452");
            setNmErrText("메뉴 그룹명을 입력해주세요.");
        }
    }

    const openAboutMenuGroup = () => {
        sProps.appManager.showModal(
            true,
            <CompModalAboutMenuGroup
                fnClose={() => sProps.appManager.hideModal()}
            />, 
            "custom"
        );
    }

    const backGroupList = async () => {
        if(fnBackGroupList !== undefined && typeof fnBackGroupList === "function"){
            await fnBackGroupList();
        }
    }
    
    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    }, []);

    return (
        <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={{flex:1, backgroundColor: "#fff"}}>
            <View style={{height: height * 0.1, justifyContent: "center", alignItems: "center"}}>
                <Text style={{fontWeight: "600", fontSize: RFPercentage(2), color: "#333D4B" }}>메뉴 그룹 추가</Text>
                <TouchableOpacity onPress={backGroupList} style={{position: "absolute", bottom: 0, right: "5%", height: height * 0.1, width: height * 0.05, justifyContent: "center", alignItems: "center"}}>
                    <ComponentDelete iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#646970"}/>
                </TouchableOpacity>
            </View>
            <View style={{flex:1}}>
                <TouchableOpacity onPress={openAboutMenuGroup} style={{height: height * 0.06, backgroundColor: "#fff", alignItems: "center", marginLeft: "5%", marginRight: "5%", flexDirection: "row"}}>
                    <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#3B3B46"}}>메뉴 그룹명</Text>
                    <ComponentQuestionMark iHeight={height * 0.02} iWidth={width * 0.06} iColor={"#3B3B46"}/>
                </TouchableOpacity>
                <View style={{height: height * 0.08, justifyContent: "center", alignItems: "center"}}>
                    <TextInput
                        placeholder="예) 햄버거 세트메뉴"
                        placeholderTextColor="#919AA7"
                        returnKeyType="done"
                        onChangeText={text => onChangeGroupNm(text)}
                        onFocus={() => activeNmText()}
                        onBlur={() => unactiveNmText()}
                        onSubmitEditing={() => insert()}
                        value={groupNm}
                        style={{
                            paddingLeft: "5%",
                            width: "90%",
                            borderRadius: 5,
                            backgroundColor: "#FAFAFB",
                            borderWidth: 1,
                            borderColor: groupNmErrColor,
                            height: height * 0.07,
                            fontSize: RFPercentage(2),
                            fontWeight: '500',
                            color: "#000"
                        }}
                    />
                </View>
                {sNmErrText !== "" &&
                    <View style={{height: height * 0.03, backgroundColor: "#fff", width, justifyContent: "center", marginLeft: "6%"}}>
                        <Text style={{fontWeight: "500", fontSize: RFPercentage(1.4), color: "#E32938" }}>{sNmErrText}</Text>
                    </View>
                }
            </View>
            {textInputType === "nm" &&
                <TouchableOpacity activeOpacity={0.8} onPress={insert} style={{zIndex: 90, width, height: height * 0.08, backgroundColor: "#6490E8", justifyContent: "center", alignItems: "center", position: "absolute", bottom: keyboardHeight - height * 0.42}}>
                    <Text style={{fontWeight: "800", fontSize: RFPercentage(2), color: "#fff" }}>확인</Text>
                </TouchableOpacity>
            }
            {textInputType === "" &&
                <View style={{height: height * 0.15, justifyContent: "center", alignItems: "center"}}>
                    <TouchableOpacity onPress={insert} style={{height: height * 0.07, width: "90%", backgroundColor: "#6490E7", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontSize: RFPercentage(2), fontWeight: '600', color: "#fff"}}>추가</Text>
                    </TouchableOpacity>
                </View>
            }
            {loading &&
                <View style={{position: "absolute", top: 0, height, width, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
        </TouchableOpacity>
    )
}

export default MenuGroupInsert;