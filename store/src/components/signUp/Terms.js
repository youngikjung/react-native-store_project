import React, { useState, useEffect } from 'react';
import { View, Keyboard, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

import { CompModalTerms, CompModalContent } from '../../components/modal/ModalContents';

import { ComponentSelectCircle } from '../../assets/svg/select_circle';
import { ComponentDelete } from '../../assets/svg/delete';
import { ComponentSelectedCircle } from '../../assets/svg/selected_circle';
import { ComponentAppIcon } from '../../assets/svg/appIcon';
import { ComponentArrowLeft2 } from '../../assets/svg/arrowLeft2';

const { width, height } = Dimensions.get('window');

const Terms = ({ sProps, fnNext, fnPrev, sTerms }) => {
    const [total, setTotal] = useState(false);
    const [term1, setTerm1] = useState(false);
    const [term2, setTerm2] = useState(false);
    const [term3, setTerm3] = useState(false);

    const termTotal = () => {
        setTotal(!total);
        setTerm1(!total);
        setTerm2(!total);
        setTerm3(!total);
    }

    const openModal = (sIndex) => {
        sProps.appManager.showModal(
            true,
            <CompModalContent 
                sText={sIndex}
            />, 
            "custom",
            2500
        );
    };


    const onChangeTerms = (sIndex) => {
        let temp1 = term1;
        let temp2 = term2;
        let temp3 = term3;

        if(sIndex === "term1"){
            temp1 = true;
        } else if (sIndex === "term2") {
            temp2 = true;
        } else if (sIndex === "term3") {
            temp3 = true;
        }
        if(temp1 && temp2 && temp3){
            setTotal(true);
        }
        setTerm1(temp1);
        setTerm2(temp2);
        setTerm3(temp3);
        sProps.appManager.hideModal();
    }

    const nextStep = async () => {
        if(total){
            if(fnNext !== undefined && typeof fnNext === "function"){
                await fnNext();
            }
        } else {
            openModal("이용약관에 동의을 해주세요.");
        }
    }

    const prevStep = async () => {
        if(fnPrev !== undefined && typeof fnPrev === "function"){
            await fnPrev();
        }
    }

    const openModalContent = (sIndex,aIndex) => {
        sProps.appManager.showModal(
            true,
            <CompModalTerms 
                type={sIndex}
                isAgree={aIndex}
                fnAgree={() => onChangeTerms(sIndex)}
            />, 
            "custom",
        );
    };

    useEffect(() => {
        if(sTerms !== undefined && sTerms){
            setTotal(true);
            setTerm1(true);
            setTerm2(true);
            setTerm3(true);
        };
    }, [sTerms])
    return (
        <View style={{flex: 1, backgroundColor: "#fff"}}>
            <View style={{ height: height * 0.3, backgroundColor: "#fff", justifyContent: "flex-end", alignItems: "center" }}>
                <TouchableOpacity onPress={prevStep} style={{height: height * 0.05, width: "10%", justifyContent: "center", alignItems: "flex-end", marginLeft: "80%"}}>
                    <ComponentDelete iHeight={height * 0.03} iWidth={height * 0.03} iColor={"#000"}/>
                </TouchableOpacity>
                <View style={{height: height * 0.1, width: "90%"}}>
                    <ComponentAppIcon iHeight={height * 0.08} iWidth={height * 0.08} iColor={"#646970"}/>
                </View>
                <View style={{ height: height * 0.07, width: "90%", justifyContent: "center", alignItems: "flex-start" }}>
                    <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#191F28", lineHeight: RFPercentage(3.5)}}>사장님</Text>
                    <Text style={{fontSize: RFPercentage(2.3), fontWeight: '600', color: "#191F28", lineHeight: RFPercentage(3.5)}}>환영합니다!</Text>
                </View>
            </View>
            <View style={{flex: 1, backgroundColor: "#fff", justifyContent: "flex-end", alignItems: "center" }}>
                <View style={{ height: height / 10, width: "100%", justifyContent: "flex-start", alignItems: "center"}}>
                    <TouchableOpacity onPress={termTotal} style={{ height: height / 12, backgroundColor: "#fff", width: "90%", alignItems: "center", justifyContent: "flex-start", borderColor: total ? "#6490E7" : "#E5E7EA", borderWidth: 1, borderRadius: 5, flexDirection: "row", paddingLeft: "5%"}}>
                        {total ?
                            <ComponentSelectedCircle iHeight={height * 0.025} iWidth={height * 0.025} iColor={"#646970"}/>
                            :
                            <ComponentSelectCircle iHeight={height * 0.025} iWidth={height * 0.025} iColor={"#646970"}/>
                        }
                        <Text style={{fontSize: RFPercentage(1.8), fontWeight: '500', color: "#191F28", marginLeft: "5%"}}>약관 전체동의</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: height * 0.2, backgroundColor: "#fff", width: "100%", justifyContent: "center", alignItems: "center"}}>
                    <TouchableOpacity onPress={() => openModalContent("term1",term1)} style={{ height: height * 0.063, backgroundColor: "#fff", width: "90%", alignItems: "center", justifyContent: "flex-start", flexDirection: "row", paddingLeft: "5%"}}>
                        {term1 ?
                            <ComponentSelectedCircle iHeight={height * 0.025} iWidth={height * 0.025} iColor={"#646970"}/>
                        :
                            <ComponentSelectCircle iHeight={height * 0.025} iWidth={height * 0.025} iColor={"#646970"}/>
                        }
                        <Text style={{fontSize: RFPercentage(1.8), fontWeight: '500', color: "#4E5867", marginLeft: "5%"}}>판매 이용약관 (필수)</Text>
                        <ComponentArrowLeft2 iHeight={height * 0.014} iWidth={height * 0.04} iColor={"#646970"}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openModalContent("term2",term2)} style={{ height: height * 0.063, backgroundColor: "#fff", width: "90%", alignItems: "center", justifyContent: "flex-start", flexDirection: "row", paddingLeft: "5%"}}>
                        {term2 ?
                            <ComponentSelectedCircle iHeight={height * 0.025} iWidth={height * 0.025} iColor={"#646970"}/>
                        :
                            <ComponentSelectCircle iHeight={height * 0.025} iWidth={height * 0.025} iColor={"#646970"}/>
                        }
                        <Text style={{fontSize: RFPercentage(1.8), fontWeight: '500', color: "#4E5867", marginLeft: "5%"}}>전자금융거래 이용약관 (필수)</Text>
                        <ComponentArrowLeft2 iHeight={height * 0.014} iWidth={height * 0.04} iColor={"#646970"}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openModalContent("term3",term3)} style={{ height: height * 0.063, backgroundColor: "#fff", width: "90%", alignItems: "center", justifyContent: "flex-start", flexDirection: "row", paddingLeft: "5%"}}>
                        {term3 ?
                            <ComponentSelectedCircle iHeight={height * 0.025} iWidth={height * 0.025} iColor={"#646970"}/>
                        :
                            <ComponentSelectCircle iHeight={height * 0.025} iWidth={height * 0.025} iColor={"#646970"}/>
                        }
                        <Text style={{fontSize: RFPercentage(1.8), fontWeight: '500', color: "#4E5867", marginLeft: "5%"}}>판매자 개인 정보 수집 및 이용 동의 (필수)</Text>
                        <ComponentArrowLeft2 iHeight={height * 0.014} iWidth={height * 0.04} iColor={"#646970"}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{height: height / 6 , backgroundColor: "#fff", justifyContent: "center"}}>
                <TouchableOpacity
                    onPress={nextStep}
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
                <Text style={{ fontSize: RFPercentage(2), fontWeight: '800', color: '#fff' }}>확인</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Terms;