import React, { useEffect } from 'react';
import {SafeAreaView} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {connect} from 'react-redux';

import {setUserConfig} from '../reducers/UserConfigReducer';

import {AppRoute} from './AppRoutes';

import {EffectFadeIn} from '../assets/svg/effectFadeIn';

import CommonStyles from '~/styles/common';

import InitialPage from './InitialPage';
import StoreInfomation from '../screens/register/StoreInfomation';
import OwnerAccount from '../screens/register/OwnerAccount';
import StoreType from '../screens/register/StoreType';
import StoreNotice from '../screens/register/StoreNotice';
import StoreAlert from '../screens/register/StoreAlert';
import StoreOriginNotice from '../screens/register/StoreOriginNotice';
import StoreLogo from '../screens/register/StoreLogo';
import StoreImages from '../screens/register/StoreImages';
import StoreHoliday from '../screens/register/StoreHoliday';
import StorePickUpZone from '../screens/register/StorePickUpZone';
import StorePickUpZoneImage from '../screens/register/StorePickUpZoneImage';
import StorePickUpZoneDetail from '../screens/register/StorePickUpZoneDetail';
import StoreOrdertime from '../screens/register/StoreOrdertime';
import StoreOperationTime from '../screens/register/StoreOperationTime';
import MenuPage from '../screens/register/Menu';
import Activate from '../screens/register/Activate';
import HomePage from '../screens/dashboard/Home';
import NoticeList from '../screens/notice/Main';
import CouponPage from '../screens/coupon/CouponPage';
import StampPage from '../screens/stamp/StampPage';
import InventoryPage from '../screens/inventory/Main';
import QuickInsertPage from '../screens/quick/Main';
import OrderListPage from '../screens/orderList/Main';
import OrderPage from '../screens/order/OrderPage';
import PrinterPage from '../screens/printer/Main';
import ChatPage from '../screens/chat/Main';
import CommercialPage from '../screens/commercial/Main';

const RootStack = createStackNavigator();

const AppNavigator = oProps => {
    return (
        <RootStack.Navigator
            initialRouteName={AppRoute.MAIN}
            screenOptions={{headerShown: false}}
        >
            {/* 주문관리 및 홈화면 */}
            <RootStack.Screen name={AppRoute.MAIN} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <InitialPage {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.HOME} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <HomePage {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.NOTICE} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <NoticeList {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.COUPON} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <CouponPage {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.COMMERCIAL} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <CommercialPage {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.STAMP} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <StampPage {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.INVENTORY} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <InventoryPage {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.QUICKINSERT} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <QuickInsertPage {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.ORDERLIST} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <OrderListPage {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.ORDER} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <OrderPage {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.PRINTER} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <PrinterPage {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.CHAT} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <ChatPage {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>

            {/* 매장설정 및 가입절차 */}
            <RootStack.Screen name={AppRoute.STOREINFOMATION} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <StoreInfomation {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.OWNERACCOUNT} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <OwnerAccount {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.STORETYPE} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <StoreType {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.STORENOTICE} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <StoreNotice {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.STOREALERT} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <StoreAlert {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.STOREORIGINNOTICE} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <StoreOriginNotice {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.STORELOGO} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <StoreLogo {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.STOREIMAGES} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <StoreImages {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.STOREHOLIDAY} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <StoreHoliday {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.STOREPICKUPZONE} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <StorePickUpZone {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.STOREPICKUPIMAGE} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <StorePickUpZoneImage {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.STOREPICKUPZONEDETAIL} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <StorePickUpZoneDetail {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.STOREORDERTIME} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <StoreOrdertime {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.STOREOPERATIONTIME} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <StoreOperationTime {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.MENU} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <MenuPage {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
            <RootStack.Screen name={AppRoute.ACTIVATION} options={EffectFadeIn}>
                {props => (
                    <SafeAreaView style={CommonStyles.safeAreaWhite}>
                        <Activate {...oProps} initialProps={props} />
                    </SafeAreaView>
                )}
            </RootStack.Screen>
        </RootStack.Navigator>
    )
}

const mapStateToProps = state => {
    return {
        AppConfigReducer: state.AppConfigReducer,
        UserConfigReducer: state.UserConfigReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        reduxSetAppConfigStatus: oData => dispatch(setAppConfigStatus(oData)),
        reduxSetUserConfig: oData => dispatch(setUserConfig(oData)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigator);