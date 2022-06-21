import React, {useRef, useEffect} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/es/integration/react';
import {NavigationContainer} from '@react-navigation/native';

import {store, persistor} from './config/store';

import {rootNavigatorRef, isReadyRef} from './routes/RootNavigatorRef';
import AppNavigator from './routes/AppNavigator';

import AppManager from './components/manage/AppManager';

import GlobalVar from './utils/globalvar';
// Gets the current screen from navigation state
const getActiveRouteName = state => {
    const route = state.routes[state.index];

    if (route.state) {
        return getActiveRouteName(route.state);
    }

    return route.name;
};

export default function App() {
    const routeNameRef = useRef();

    useEffect(() => {
        return () => {
            isReadyRef.current = false;
        };
    }, []);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <NavigationContainer
                    onStateChange={state => {
                        const previousRouteName = routeNameRef.current;
                        const currentRouteName = getActiveRouteName(state);
                        if (previousRouteName !== currentRouteName) {
                            GlobalVar.setRouteHistory(currentRouteName);
                        }
                        routeNameRef.current = currentRouteName;
                    }}
                    onReady={() => {
                        isReadyRef.current = true;
                    }}
                    ref={rootNavigatorRef}
                >
                    <AppManager>
                        <AppNavigator />
                    </AppManager>
                </NavigationContainer>
            </PersistGate>
        </Provider>
    )
}