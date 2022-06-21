import React, {useState,useEffect,useRef} from 'react';
import { View, Dimensions, Text, TouchableOpacity, Image, FlatList, KeyboardAvoidingView, TextInput, Keyboard, StatusBar, Platform, ScrollView } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import LottieView from 'lottie-react-native';
import moment from 'moment-timezone';
import 'moment/locale/ko';

import { ComponentArrowLeft3 } from '../../assets/svg/arrowLeft3';
import walkThroo01 from '../../assets/img/event/walkThroo01.png';
import walkThroo02 from '../../assets/img/event/walkThroo02.png';
import walkThroo03 from '../../assets/img/event/walkThroo03.png';

const { width, height } = Dimensions.get('window');

const List = ({ fnGoBack }) => {
   
    const locationBack = async () => {
        if(fnGoBack !== undefined && typeof fnGoBack === "function"){
            await fnGoBack();
        }
    }

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
           <View style={{height: height * 0.08 }}>
                <TouchableOpacity onPress={locationBack} style={{ position: "absolute", top: height * 0.02, left: width * 0.05, height: height * 0.05, width: height * 0.05, justifyContent: "center", alignItems: "center"}}>
                    <ComponentArrowLeft3 iHeight={height * 0.04} iWidth={height * 0.03} iColor={"#000"}/>
                </TouchableOpacity>
            </View>
            <View style={{ flex:1, backgroundColor: "#fff"}}>
                <ScrollView>
                    <View style={{ height: height * 0.1, justifyContent: "center", marginLeft: "5%"}}>
                        <Text style={{fontWeight: "900", fontSize: RFPercentage(2.5), color: "#000"}}>매장 방문포장 서비스 워크 스루 오픈 안내</Text>
                    </View>
                    <View style={{ height: height * 0.1, justifyContent: "space-evenly", marginLeft: "5%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>안녕하세요 사장님</Text>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>스루입니다.</Text>
                    </View>
                    <View style={{ height: height * 0.16, justifyContent: "space-evenly", marginLeft: "5%", marginRight: "5%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>바쁜 시간대 차까지 전달이 어려운 매장을 위해 워크 스루 서비스가 오픈됨을 알려드립니다</Text>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>워크 스루 서비스를 이용하면 고객이 도착 전 주문과 결제를 미리 받기 때문에 회전율과 영업효율이 높아 집니다.</Text>
                    </View>
                    <View style={{ height: height * 0.04, justifyContent: "space-evenly", marginLeft: "5%", marginRight: "5%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>워크 스루 설정 방법 및 주요 내용은 아래를 참고해 주세요.</Text>
                    </View>
                    <View style={{ height: height * 0.08, justifyContent: "flex-end", marginLeft: "5%"}}>
                        <Text style={{fontWeight: "900", fontSize: RFPercentage(2.3), color: "#000"}}>영업시간 설정</Text>
                    </View>
                    <View style={{ height: height * 0.95, width, justifyContent: "center", alignItems: "center" }}>
                        <Image source={walkThroo01} style={{height: "100%", width: "100%", resizeMode: "cover"}}/>
                    </View>
                    <View style={{ height: height * 0.08, justifyContent: "center", marginLeft: "5%", marginRight: "5%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>상품 준비 시간 설정에서 고 객차까지 전달이 불가능한 시간대를 ‘워크스루만’으로 설정하시면 됩니다.</Text>
                    </View>
                    <View style={{ height: height * 0.12, justifyContent: "center", marginLeft: "5%"}}>
                        <Text style={{fontWeight: "900", fontSize: RFPercentage(2.3), color: "#000"}}>주문서</Text>
                    </View>
                    <View style={{ height: height * 0.4, width, justifyContent: "center", alignItems: "center" }}>
                        <Image source={walkThroo02} style={{height: "100%", width: "90%", resizeMode: "cover"}}/>
                    </View>
                    <View style={{ height: height * 0.08, justifyContent: "center", marginLeft: "5%", marginRight: "5%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>주문 접수 화면뿐만 아니라 프린트된 주문서에서 드라이브스루와 워크 스루를 쉽게 구분하실 수 있습니다.</Text>
                    </View>
                    <View style={{ height: height * 0.12, justifyContent: "center", marginLeft: "5%"}}>
                        <Text style={{fontWeight: "900", fontSize: RFPercentage(2.3), color: "#000"}}>앱 화면</Text>
                    </View>
                    <View style={{ height: height * 0.7, width, justifyContent: "center", alignItems: "center" }}>
                        <Image source={walkThroo03} style={{height: "100%", width: "90%", resizeMode: "contain"}}/>
                    </View>
                    <View style={{ height: height * 0.08, justifyContent: "center", marginLeft: "5%", marginRight: "5%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>고객 앱에서는 위 화면처럼 보이며, 드라이브스루 사용자와는 다른 이용 환경이 제공됩니다.</Text>
                    </View>
                    <View style={{ height: height * 0.17, width, justifyContent: "center", alignItems: "center"}}>
                        <View style={{ height: height * 0.14, width: width * 0.9, justifyContent: "space-around", borderBottomColor: "#B0B7C1", borderBottomWidth: 1, borderTopColor: "#B0B7C1", borderTopWidth: 1}}>
                            <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>😊 지금까지 피크시간 대처 및 1인 운영 때문에 입점을 고민하시던 사장님들은 바쁜 시간에는 워크 스루를 이용해 일손을 덜고 비수 시간에는 더 많은 운전자 고객을 만나서 추가 매출을 올려보세요.</Text>
                        </View>
                    </View>
                    <View style={{ height: height * 0.16, justifyContent: "space-evenly", marginLeft: "5%", marginRight: "5%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#EF4452"}}>*유의사항</Text>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#EF4452"}}>-워크 스루 서비스는 스루 앱 최신 업데이트 버전부터 순차적으로 반영됩니다. 사용자의 앱 업데이트 여부에 따라 일부 노출되지 않을 수 있습니다.</Text>
                    </View>
                    <View style={{ height: height * 0.08, justifyContent: "space-evenly", marginLeft: "5%", marginRight: "5%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>-워크 스루 고객은 픽업 존이 아닌 매장에서 상품을 전달해 주세요.</Text>
                    </View>
                    <View style={{ height: height * 0.1 }} />
                </ScrollView>
            </View>
        </View>
    )
}

export default List;