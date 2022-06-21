import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import DeviceInfo from 'react-native-device-info';

import {setUserConfig} from '../../reducers/UserConfigReducer';
import {setAppConfigStatus} from '../../reducers/AppConfigReducer';

const ReducerSetter = React.forwardRef((oProps, oRef) => {

  React.useImperativeHandle(oRef, () => ({
    _setFirstPageRoute(sUrl) {
      let oAppConfig = {};
      oAppConfig['FirstPageRoute'] = sUrl;
      oProps.reduxSetAppConfigStatus(oAppConfig);
    },
    showAlert() {},
    _refSetAppConfigStatus(oAppConfig) {
      oProps.reduxSetAppConfigStatus(oAppConfig);
    },
    _refGetAppConfigStatus() {
      return oProps.AppConfigReducer;
    },
    _refSetUserConfig(oUserConfig) {
      oProps.reduxSetUserConfig(oUserConfig);
    },
    _refGetUserConfig() {
      return oProps.UserConfigReducer;
    },
    _refGetApiUrl() {
      let sApirUrl = '';
      if (
        oProps.AppConfigReducer != undefined &&
        oProps.AppConfigReducer.hasOwnProperty('Env')
      ) {
        sApirUrl = oProps.AppConfigReducer.Env['API_URL'];
      }
      return sApirUrl;
    },
    _refGetPaymentApiUrl() {
      let sApirUrl = '';
      if (oProps.AppConfigReducer != undefined && oProps.AppConfigReducer.hasOwnProperty('Env')) {
        sApirUrl = oProps.AppConfigReducer.Env['PAYMENT_API_URL'];
      }
      return sApirUrl;
    },
    _refGetLocationApiUrl() {
      let sApirUrl = '';
      if (
        oProps.AppConfigReducer != undefined &&
        oProps.AppConfigReducer.hasOwnProperty('Env')
      ) {
        sApirUrl = oProps.AppConfigReducer.Env['LOCATION_API_URL'];
      }
      return sApirUrl;
    },
  }));

  if (
    oProps.UserConfigReducer.DeviceUUID == '' ||
    oProps.UserConfigReducer.DeviceUUID == undefined
  ) {
    DeviceInfo.syncUniqueId().then(uniqueId => {
      let oUserConfig = {};
      oUserConfig['DeviceUUID'] = uniqueId;
      oProps.reduxSetUserConfig(oUserConfig);
    });
  }

  return <></>;
});

const mapStateToProps = state => {
  return {
    AppConfigReducer: state.AppConfigReducer,
    UserConfigReducer: state.UserConfigReducer,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    reduxSetUserConfig: oData => dispatch(setUserConfig(oData)),
    reduxSetAppConfigStatus: oData => dispatch(setAppConfigStatus(oData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(ReducerSetter);
