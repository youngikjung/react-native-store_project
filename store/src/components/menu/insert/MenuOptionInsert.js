import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard, ScrollView, FlatList } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';

import Step1 from './option/Step1';
import Step2 from './option/Step2';
import Step3 from './option/Step3';

import { CompModalContent, CompModalSettingPage } from '../../modal/ModalContents';

const { width, height } = Dimensions.get('window');

const MenuGroupInsert = ({ sProps, fnBackGroupList }) => {
    const [loading, setLoading] = useState(false);
    const [state, setstate] = useState("step1");

    const [sNm, setNm] = useState("");
    const [iData, setData] = useState([]);
    const [mustItem, setMustItem] = useState("radio");
    const [sMaxNm, setMaxNm] = useState(1);
    const [sMinNm, setMinNm] = useState(1);

    const [animated, setAnimated] = useState(width * 0);

    const backGroupList = async () => {
        if(fnBackGroupList !== undefined && typeof fnBackGroupList === "function"){
            await fnBackGroupList();
        }
    }

    const goToStep2 = async (sIndex,nIndex,aIndex,iIndex) => {
        setNm(sIndex);
        setMustItem(nIndex);
        setMaxNm(aIndex);
        setMinNm(iIndex);
        setAnimated(width * 0.33);
        setstate("step2");
    }
    
    const goToStep3 = async (sIndex) => {
        setData(sIndex);
        setAnimated(width * 0.67);
        setstate("step3");
    }
    
    const openModal = (sIndex) => {
        sProps.appManager.showModal(
            true,
            <CompModalContent sText={sIndex}/>, 
            "custom",
            2500
        );
    };

    const lastStep = async () => {
        setLoading(true);
        const store_id = sProps.UserConfigReducer.StoreID;
        let oData = {
            sGroupTitle : sNm,
            type : mustItem,
            sData : iData,
            maxCount : 1,
            minCount : 1,
            store_id,
        }
        if(mustItem === "checkbox"){
            oData = {
                sGroupTitle : sNm,
                type : mustItem,
                sData : iData,
                maxCount : sMaxNm,
                store_id,
            }
        } else {
            if(parseInt(sMaxNm) > 1){
                oData = {
                    sGroupTitle : sNm,
                    type : "radioDouble",
                    sData : iData,
                    maxCount : sMaxNm,
                    minCount : sMaxNm,
                    store_id,
                }
            }
        }
        const oResponse = await sProps.appManager.accessAxios("/app/sales/store/register/insertOption/v2", "post", null, oData);
        if(oResponse !== undefined){
            if(oResponse.resultCd === "0000"){
                openModal("등록되었습니다");
                if(fnBackGroupList !== undefined && typeof fnBackGroupList === "function"){
                    await fnBackGroupList();
                }
            }
        }
        setLoading(false);
    }
    
    const backStep = async (sIndex,aIndex) => {
        setAnimated(aIndex);
        setstate(sIndex);
    }
    
    return (
        <>
            {state === "step1" &&
                <Step1 
                    oProps={sProps}
                    iNm={sNm}
                    sAnimated={animated}
                    iMustItem={mustItem}
                    iMaxNm={sMaxNm}
                    iMinNm={sMinNm}
                    fnNextStep={(sIndex,nIndex,aIndex,iIndex) => goToStep2(sIndex,nIndex,aIndex,iIndex)}
                    fnDelete={() => backGroupList()}
                />
            }
            {state === "step2" &&
                <Step2 
                    sAnimated={animated}
                    oProps={sProps}
                    iMustItem={mustItem}
                    iMaxNm={sMaxNm}
                    iMinNm={sMinNm}
                    nData={iData}
                    fnNextStep={(sIndex) => goToStep3(sIndex)}
                    fnBackGroupList={(sIndex,aIndex) => backStep(sIndex,aIndex)}
                    fnDelete={() => backGroupList()}
                />
            }
            {state === "step3" &&
                <Step3
                    sAnimated={animated}
                    iNm={sNm}
                    nData={iData}
                    iMustItem={mustItem}
                    iMaxNm={sMaxNm}
                    iMinNm={sMinNm}
                    fnNextStep={() => lastStep()}
                    fnBackGroupList={(sIndex,aIndex) => backStep(sIndex,aIndex)}
                    fnDelete={() => backGroupList()}
                />
            }
            {loading &&
                <View style={{position: "absolute", top: 0, height, width, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
        </>
    )
}

export default MenuGroupInsert;