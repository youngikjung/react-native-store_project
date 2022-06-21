import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

const {width, height} = Dimensions.get('window');

const HomeScreen = ({ fnStart, fnSignIn }) => {
    const startFunction = async () => {
        if(fnStart !== undefined && typeof fnStart === "function"){
            await fnStart();
        }
    }

    const signInFunction = async () => {
        if(fnSignIn !== undefined && typeof fnSignIn === "function"){
            await fnSignIn();
        }
    }

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            <View style={{ height: height * 0.24, backgroundColor: "#fff", justifyContent: "flex-end", alignItems: "center" }}>
                <View style={{ height: height * 0.07, width: "90%", justifyContent: "center", alignItems: "flex-start" }}>
                    <Text style={{fontSize: RFPercentage(2.8), fontWeight: '600', color: "#191F28", lineHeight: RFPercentage(4)}}>사장님을 위한</Text>
                    <Text style={{fontSize: RFPercentage(2.8), fontWeight: '600', color: "#191F28", lineHeight: RFPercentage(4)}}>스마트한 D-THRU 포스앱</Text>
                </View>
            </View>
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <View style={{height: height * 0.05, backgroundColor: "#fff"}} />
                <View style={{height: height * 0.11, justifyContent: "flex-start", alignItems: "center"}}>
                    <View style={{height: height * 0.04, width: "90%"}}>
                        <Text style={{fontSize: RFPercentage(1.8), fontWeight: '500', color: "#4E5867", lineHeight: RFPercentage(2.8)}}>스루 스토어에서 편리하게</Text>
                        <Text style={{fontSize: RFPercentage(1.8), fontWeight: '500', color: "#4E5867", lineHeight: RFPercentage(2.8)}}>드라이브스루 매장을 운영해 보세요.</Text>
                    </View>
                </View>
            </View>
            <View style={{ height: height * 0.2, backgroundColor: "#fff", alignItems: "center", justifyContent: "flex-start" }}>
                <TouchableOpacity onPress={() => startFunction()} activeOpacity={0.8} style={{ width: "90%", height: height * 0.07, backgroundColor: "#6490E7", justifyContent: "center", alignItems: "center", borderRadius: width * 0.02 }}>
                    <Text style={{fontSize: RFPercentage(1.8), fontWeight: '600', color: "#fff"}}>시작하기</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => signInFunction()} activeOpacity={0.8} style={{ width: "90%", height: height * 0.03, justifyContent: "flex-start", alignItems: "center", backgroundColor: "#fff", marginTop: height * 0.04}}>
                    <Text style={{fontSize: RFPercentage(1.8), fontWeight: '600', color: "#6490E7"}}>이미 계정이 있으신가요?</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};

export default HomeScreen;