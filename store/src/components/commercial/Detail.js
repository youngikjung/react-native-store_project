import React, {useState,useEffect} from 'react';
import { TouchableOpacity, View, Dimensions, Text, TextInput, Keyboard, Image, PermissionsAndroid, Linking, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';

import BannerCommercial from './type/BannerCommercial';
import CouponCommercial from './type/CouponCommercial';
import NewStoreCommercial from './type/NewStoreCommercial';
import ThrooOnlyCommercial from './type/ThrooOnlyCommercial';
import HotMenuCommercial from './type/HotMenuCommercial';
import PicketCommercial from './type/PicketCommercial';
import ThrooKitCommercial from './type/ThrooKitCommercial';

const { width, height } = Dimensions.get('window');

const Detail = ({ iProps, fnReturn, eDetailData, fnCartData, iParam, sParam  }) => {
    const [state, setState] = useState("");

    const returnPage = async () => {
        if(fnReturn !== undefined && typeof fnReturn === "function"){
            await fnReturn();
        }
    }

    const cartData = async (sIndex,aIndex) => {
        if(fnCartData !== undefined && typeof fnCartData === "function"){
            await fnCartData(sIndex,aIndex);
        }
    }

    useEffect(() => {
        setState(eDetailData.param);
    }, [eDetailData]);

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            {state === "" &&
                <View style={{position: "absolute", top: 0, height, width, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", opacity: 0.8}}>
                    <LottieView style={{width: width * 0.7, height: width * 0.7 }} source={require('../../assets/lottie/throo_splash.json')} autoPlay loop/>
                </View>
            }
            {state === "banner" &&
                <BannerCommercial 
                    sProps={iProps}
                    sParam={iParam}
                    iDetailData={eDetailData}
                    fnInitReturn={() => returnPage()}
                    fnInsertCart={(sIndex,aIndex) => cartData(sIndex,aIndex)}
                />
            }
            {state === "coupon" &&
                <CouponCommercial 
                    sProps={iProps}
                    sParam={iParam}
                    iParam={sParam}
                    iDetailData={eDetailData}
                    fnInitReturn={() => returnPage()}
                    fnInsertCart={(sIndex,aIndex) => cartData(sIndex,aIndex)}
                />
            }
            {state === "only" &&
                <ThrooOnlyCommercial 
                    sProps={iProps}
                    sParam={iParam}
                    iParam={sParam}
                    iDetailData={eDetailData}
                    fnInitReturn={() => returnPage()}
                    fnInsertCart={(sIndex,aIndex) => cartData(sIndex,aIndex)}
                />
            }
            {state === "new" &&
                <NewStoreCommercial 
                    sProps={iProps}
                    sParam={iParam}
                    iDetailData={eDetailData}
                    fnInitReturn={() => returnPage()}
                    fnInsertCart={(sIndex,aIndex) => cartData(sIndex,aIndex)}
                />
            }
            {state === "hot" &&
                <HotMenuCommercial 
                    sProps={iProps}
                    sParam={iParam}
                    iParam={sParam}
                    iDetailData={eDetailData}
                    fnInitReturn={() => returnPage()}
                    fnInsertCart={(sIndex,aIndex) => cartData(sIndex,aIndex)}
                />
            }
            {state === "kit" &&
                <ThrooKitCommercial 
                    sProps={iProps}
                    sParam={iParam}
                    iParam={sParam}
                    iDetailData={eDetailData}
                    fnInitReturn={() => returnPage()}
                    fnInsertCart={(sIndex,aIndex) => cartData(sIndex,aIndex)}
                />
            }
            {state === "picket" &&
                <PicketCommercial 
                    sProps={iProps}
                    sParam={iParam}
                    iParam={sParam}
                    iDetailData={eDetailData}
                    fnInitReturn={() => returnPage()}
                    fnInsertCart={(sIndex,aIndex) => cartData(sIndex,aIndex)}
                />
            }
        </View>
    )
}

export default Detail;