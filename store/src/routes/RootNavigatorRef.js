import * as React from 'react';
import {StackActions} from '@react-navigation/native';

export const rootNavigatorRef = React.createRef();
export const isReadyRef = React.createRef();

export function navigate(name, params) {
    if (isReadyRef.current && rootNavigatorRef.current) {
        // Perform navigation if the app has mounted
        rootNavigatorRef.current.navigate(name, params);
    } else {
        // You can decide what to do if the app hasn't mounted
        // You can ignore this, or add these actions to a queue you can call later
    }
}

export function reset(params) {
    if (isReadyRef.current && rootNavigatorRef.current) {
        // Perform navigation if the app has mounted
        rootNavigatorRef.current.reset(params);
    } else {
        // You can decide what to do if the app hasn't mounted
        // You can ignore this, or add these actions to a queue you can call later
    }
}

export function push(name, params) {
    if (isReadyRef.current && rootNavigatorRef.current) {
        //rootNavigatorRef.current.push(name, params);
        rootNavigatorRef.current.dispatch(StackActions.push(name, params));
    } else {
    }
}

export function doGoback(params) {
    if (isReadyRef.current && rootNavigatorRef.current) {
        if (params !== undefined) {
            rootNavigatorRef.current.setParams(params);
        }
        if (rootNavigatorRef.current.canGoBack() === true) {
            rootNavigatorRef.current.goBack();
        }
    }
}
