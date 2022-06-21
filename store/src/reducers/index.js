/* eslint-disable prettier/prettier */

import { combineReducers } from 'redux';

import AppConfigReducer from '~/reducers/AppConfigReducer';
import UserConfigReducer from '~/reducers/UserConfigReducer';

const rootReducer = combineReducers({
   AppConfigReducer,
   UserConfigReducer
});

export default rootReducer;