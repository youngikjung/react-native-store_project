import React, {useState,useEffect,useRef} from 'react';
import { View, Dimensions, Text, TouchableOpacity, Image, FlatList, KeyboardAvoidingView, TextInput, Keyboard, StatusBar, Platform, ScrollView } from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import LottieView from 'lottie-react-native';
import moment from 'moment-timezone';
import 'moment/locale/ko';

import { ComponentArrowLeft3 } from '../../assets/svg/arrowLeft3';
import appBanner01 from '../../assets/img/event/appBanner01.png';
import appBanner02 from '../../assets/img/event/appBanner02.png';
import appBanner03 from '../../assets/img/event/appBanner03.png';
import appBanner04 from '../../assets/img/event/appBanner04.png';
import appBanner05 from '../../assets/img/event/appBanner05.png';
import appBanner06 from '../../assets/img/event/appBanner06.png';
import appBanner07 from '../../assets/img/event/appBanner07.png';
import appBanner08 from '../../assets/img/event/appBanner08.png';

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
                        <Text style={{fontWeight: "900", fontSize: RFPercentage(2.5), color: "#000"}}>앱 내 매장 광고 서비스 오픈 예정 안내</Text>
                    </View>
                    <View style={{ height: height * 0.1, justifyContent: "space-evenly", marginLeft: "5%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>안녕하세요 사장님</Text>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>스루입니다.</Text>
                    </View>
                    <View style={{ height: height * 0.16, justifyContent: "space-evenly", marginLeft: "5%", marginRight: "5%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>더 많은 고객에게 사장님의 스루 입점을 알리고 매출을 높일 수 있도록 광고 서비스 오픈을 안내드립니다.</Text>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>베타서비스 참여 사장님, 얼리어답터 사장님을 대상으로 사장님 매장을 광고할 수 있도록 광고 서비스 </Text>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>오픈 일 기준 3달간 광고 포인트 매달 15만 포인트씩 총 45만 포인트를 지원해 드립니다.</Text>
                    </View>
                    <View style={{ height: height * 0.12, justifyContent: "space-evenly", marginLeft: "5%", marginRight: "5%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>고객 위치 기반 2km 이내 매장만 노출이 되기 때문에 효율적인 광고효과를 기대할 수 있습니다. </Text>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>광고를 통해 추가 매출을 올려보세요.</Text>
                    </View>

                    <View style={{ height: height * 0.12, justifyContent: "center", marginLeft: "5%"}}>
                        <Text style={{fontWeight: "900", fontSize: RFPercentage(2.3), color: "#000"}}>1. 메인 배너광고</Text>
                    </View>
                    <View style={{ height: height * 0.6, width, justifyContent: "center", alignItems: "center" }}>
                        <View style={{ height: height * 0.6, width: width * 0.9}}>
                            <Image source={appBanner01} style={{height: "100%", width: "100%", resizeMode: "contain"}}/>
                        </View>
                    </View>
                    <View style={{ height: height * 0.08, justifyContent: "center", marginLeft: "5%", marginRight: "5%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>스루 앱 가장 처음 상단에 나타나는 메인 배너광고입니다. 고객에게 가장 먼저 보이기 때문에 노출도가 가장 높습니다.</Text>
                    </View>
                    <View style={{ height: height * 0.12, justifyContent: "center", marginLeft: "5%"}}>
                        <Text style={{fontWeight: "900", fontSize: RFPercentage(2.3), color: "#000"}}>2. 내 주변 쿠폰 광고</Text>
                    </View>
                    <View style={{ height: height * 0.3, width, justifyContent: "center", alignItems: "center" }}>
                        <View style={{ height: height * 0.3, width: width * 0.9}}>
                            <Image source={appBanner02} style={{height: "100%", width: "100%", resizeMode: "contain"}}/>
                        </View>
                    </View>
                    <View style={{ height: height * 0.08, justifyContent: "center", marginLeft: "5%", marginRight: "5%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>매장에 쿠폰이 등록되어 있을 경우에만 노출됩니다. 쿠폰을 등록한 뒤 광고를 통해 쿠폰 효과를 올려보세요.</Text>
                    </View>
                    <View style={{ height: height * 0.12, justifyContent: "center", marginLeft: "5%"}}>
                        <Text style={{fontWeight: "900", fontSize: RFPercentage(2.3), color: "#000"}}>3. 스루 온리 광고</Text>
                    </View>
                    <View style={{ height: height * 0.4, width, justifyContent: "center", alignItems: "center" }}>
                        <Image source={appBanner03} style={{height: "100%", width: "100%", resizeMode: "contain"}}/>
                    </View>
                    <View style={{ height: height * 0.16, justifyContent: "center", marginLeft: "5%", marginRight: "5%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>스루 온리 광고는 한시적으로 무료이며 최상단에 노출됩니다. 스루에서만 구매할 수 있는 상품을 등록하셨다면 자동으로 광고가 적용되어 더 많은 고객에게 상품이 노출됩니다. 적극 활용해 보세요!</Text>
                    </View>
                    <View style={{ height: height * 0.12, justifyContent: "center", marginLeft: "5%"}}>
                        <Text style={{fontWeight: "900", fontSize: RFPercentage(2.3), color: "#000"}}>4. 신규 입점 광고</Text>
                    </View>
                    <View style={{ height: height * 0.4, width, justifyContent: "center", alignItems: "center" }}>
                        <Image source={appBanner04} style={{height: "100%", width: "100%", resizeMode: "contain"}}/>
                    </View>
                    <View style={{ height: height * 0.08, justifyContent: "center", marginLeft: "5%", marginRight: "5%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>입점일 기준 6개월 이내의 매장들만 노출됩니다. 스루 영업 시작을 더 많은 고객에게 알려보세요.</Text>
                    </View>
                    <View style={{ height: height * 0.08, justifyContent: "center", marginLeft: "5%"}}>
                        <Text style={{fontWeight: "900", fontSize: RFPercentage(2.3), color: "#000"}}>5. 핫메뉴 광고</Text>
                    </View>
                    <View style={{ height: height * 0.4, width, justifyContent: "center", alignItems: "center" }}>
                        <Image source={appBanner05} style={{height: "100%", width: "90%", resizeMode: "contain"}}/>
                    </View>
                    <View style={{ height: height * 0.12, justifyContent: "center", marginLeft: "5%", marginRight: "5%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>우리 매장의 인기 상품을 광고해 보세요. 우리 매장의 인기상품이 여러 개라면 개수 제한 없이 모두 고객에게 알릴 수 있습니다.</Text>
                    </View>
                    <View style={{ height: height * 0.08, justifyContent: "center", marginLeft: "5%"}}>
                        <Text style={{fontWeight: "900", fontSize: RFPercentage(2), color: "#000"}}>😊 오프라인 광고</Text>
                    </View>
                    <View style={{ height: height * 0.08, justifyContent: "center", marginLeft: "5%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>오프라인 광고물을 통해 매장에 방문하시는 고객에게 스루 사용을 홍보할 수 있습니다.</Text>
                    </View>
                    <View style={{ height: height * 0.08, justifyContent: "center", marginLeft: "5%"}}>
                        <Text style={{fontWeight: "900", fontSize: RFPercentage(2.3), color: "#000"}}>오프라인 홍보 KIT</Text>
                    </View>
                    <View style={{ height: height * 0.35, width, justifyContent: "center", alignItems: "center" }}>
                        <Image source={appBanner06} style={{height: "100%", width: "90%", resizeMode: "contain"}}/>
                    </View>
                    <View style={{ height: height * 0.14, justifyContent: "center", marginLeft: "5%", marginRight: "5%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>a2 포스터, a3 포스터, a5 전단지, 테이블 텐트, 스티 커(매장 부착용 2종), 테이블 텐트도 2종 구성으로 이루어져 있습니다. 매장을 방문하는 고객에게 스루를 홍보할 수 있어요.</Text>
                    </View>
                    <View style={{ height: height * 0.08, justifyContent: "center", marginLeft: "5%"}}>
                        <Text style={{fontWeight: "900", fontSize: RFPercentage(2), color: "#000"}}>😊 광고 구매 안내</Text>
                    </View>
                    <View style={{ height: height * 0.4, width, justifyContent: "center", alignItems: "center" }}>
                        <Image source={appBanner07} style={{height: "100%", width: "90%", resizeMode: "contain"}}/>
                    </View>
                    <View style={{ height: height * 0.12, justifyContent: "center", marginLeft: "5%", marginRight: "5%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>광고 구매는 광고 포인트로 구매가 가능합니다. 광고 포인트 확인은 매장관리 {">"} 광고 포인트 페이지에서 확인 가능합니다.</Text>
                    </View>
                    <View style={{ height: height * 0.5, width, justifyContent: "center", alignItems: "center" }}>
                        <Image source={appBanner08} style={{height: "100%", width: "90%", resizeMode: "contain"}}/>
                    </View>
                    <View style={{ height: height * 0.12, justifyContent: "center", marginLeft: "5%", marginRight: "5%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>광고와 광고 노출 날짜를 사장님이 직접 선택하여 구매할 수 있습니다</Text>
                    </View>
                    <View style={{ height: height * 0.08, justifyContent: "center", marginLeft: "5%"}}>
                        <Text style={{fontWeight: "900", fontSize: RFPercentage(2), color: "#000"}}>😊 광고 포인트 지원 안내</Text>
                    </View>
                    <View style={{ height: height * 0.16, justifyContent: "space-evenly", marginLeft: "5%", marginRight: "5%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>영업 시작일 기준 매달 15만 포인트씩 3달을 지원해 드리며, 총 45만 포인트의 혜택을 제공합니다.</Text>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>기존 사장님은 광고 오픈 시작일을 기준으로 동일한 조건으로 지원해 드립니다.</Text>
                    </View>
                    <View style={{ height: height * 0.08, justifyContent: "space-evenly", marginLeft: "5%", marginRight: "5%"}}>
                        <Text style={{fontWeight: "600", fontSize: RFPercentage(1.9), color: "#191F28"}}>효율적인 광고 관리를 통해 더 많은 고객에게 우리 매장을 알리고 매출을 높여보세요</Text>
                    </View>
                    <View style={{ height: height * 0.1 }} />
                </ScrollView>
            </View>
        </View>
    )
}

export default List;