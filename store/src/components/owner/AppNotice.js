import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

import {ComponentCamera1 } from '../../assets/svg/camera_1';
import {ComponentFolder1 } from '../../assets/svg/folder_1';
import {ComponentPush1 } from '../../assets/svg/push_1';

const {width, height} = Dimensions.get('window');

const AppNotice = ({ fnTermAgree }) => {
    const termAgree = async () => {
        if(fnTermAgree !== undefined && typeof fnTermAgree === "function"){
            await fnTermAgree();
        }
    }

    return (
        <View style={{flex: 1, backgroundColor: "#fff"}}>
            <View style={{ height: height * 0.24, backgroundColor: "#fff", justifyContent: "flex-end", alignItems: "center" }}>
                <View style={{ height: height * 0.07, width: "90%", justifyContent: "center", alignItems: "flex-start" }}>
                    <Text style={{fontSize: RFPercentage(2.4), fontWeight: '600', color: "#191F28", lineHeight: 30}}>앱 사용을 위해 권한을 허용해주세요</Text>
                    <Text style={{fontSize: RFPercentage(2.4), fontWeight: '600', color: "#191F28", lineHeight: 30}}>꼭 필요한 권한만 받아요</Text>
                </View>
            </View>
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <View style={{height: height * 0.05, backgroundColor: "#fff"}} />
                <View style={{height: height * 0.11, justifyContent: "flex-start", alignItems: "center"}}>
                    <View style={{height: height * 0.04, width: "90%", flexDirection: "row"}}>
                        <View style={{width: "12%"}}>
                            <ComponentCamera1 iHeight={height * 0.04} iWidth={height * 0.04} iColor={"#646970"}/>
                        </View>
                        <View style={{width: "88%", backgroundColor: "#fff", justifyContent: "center"}}>
                            <Text style={{fontSize: RFPercentage(1.8), fontWeight: '800', color: "#4E5867"}}>카메라</Text>
                        </View>
                    </View>
                    <View style={{height: height * 0.03, width: "90%", flexDirection: "row"}}>
                        <View style={{width: "12%"}}/>
                        <View style={{width: "88%", backgroundColor: "#fff", justifyContent: "center"}}>
                            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '500', color: "#4E5867"}}>이미지 장치 이용 시</Text>
                        </View>
                    </View>
                </View>
                <View style={{height: height * 0.11, justifyContent: "flex-start", alignItems: "center"}}>
                    <View style={{height: height * 0.04, width: "90%", flexDirection: "row"}}>
                        <View style={{width: "12%"}}>
                            <ComponentFolder1 iHeight={height * 0.04} iWidth={height * 0.04} iColor={"#646970"}/>
                        </View>
                        <View style={{width: "88%", backgroundColor: "#fff", justifyContent: "center"}}>
                            <Text style={{fontSize: RFPercentage(1.8), fontWeight: '800', color: "#4E5867"}}>저장공간</Text>
                        </View>
                    </View>
                    <View style={{height: height * 0.03, width: "90%", flexDirection: "row"}}>
                        <View style={{width: "12%"}}/>
                        <View style={{width: "88%", backgroundColor: "#fff", justifyContent: "center"}}>
                            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '500', color: "#4E5867"}}>각종 저장 및 업로드 이용 시</Text>
                        </View>
                    </View>
                </View>
                <View style={{height: height * 0.11, justifyContent: "flex-start", alignItems: "center"}}>
                    <View style={{height: height * 0.04, width: "90%", flexDirection: "row"}}>
                        <View style={{width: "12%"}}>
                            <ComponentPush1 iHeight={height * 0.04} iWidth={height * 0.04} iColor={"#646970"}/>
                        </View>
                        <View style={{width: "88%", backgroundColor: "#fff", justifyContent: "center"}}>
                            <Text style={{fontSize: RFPercentage(1.8), fontWeight: '800', color: "#4E5867"}}>푸시 알림</Text>
                        </View>
                    </View>
                    <View style={{height: height * 0.03, width: "90%", flexDirection: "row"}}>
                        <View style={{width: "12%"}}/>
                        <View style={{width: "88%", backgroundColor: "#fff", justifyContent: "center"}}>
                            <Text style={{fontSize: RFPercentage(1.6), fontWeight: '500', color: "#4E5867"}}>스루 주문 접수 시</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ height: height * 0.13, backgroundColor: "#fff", alignItems: "center", justifyContent: "flex-start" }}>
                <TouchableOpacity activeOpacity={0.8} onPress={termAgree} style={{ width: "90%", height: height * 0.07, backgroundColor: "#6490E7", justifyContent: "center", alignItems: "center", borderRadius: width * 0.02 }}>
                    <Text style={{fontSize: RFPercentage(1.8), fontWeight: '600', color: "#fff"}}>계속하기</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default AppNotice;