import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStore, applyMiddleware} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import logger, {createLogger} from 'redux-logger';
//import { compact } from 'lodash';
//import devTools from 'remote-redux-devtools';

// Imports: Redux
import rootReducer from '~/reducers/index';

//const middleware = applyMiddleware(thunk, logger);

// Middleware: Redux Persist Config
const persistConfig = {
  // Root
  key: 'throo_ceo',
  // Storage Method (React Native)
  storage: AsyncStorage,
  // Whitelist (Save Specific Reducers)
  whitelist: ['AppConfigReducer', 'UserConfigReducer'],
  // Blacklist (Don't Save Specific Reducers)
  blacklist: [],
};

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux: Store
const store = createStore(persistedReducer, applyMiddleware(createLogger()));

// Middleware: Redux Persist Persister
let persistor = persistStore(store);

export {store, persistor};
