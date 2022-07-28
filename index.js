/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import storeInfo from './src/redux/store';
import React from 'react';
import {initNotification} from './src/firebase/notification';

const {store, persistor} = storeInfo;

initNotification();

const RootComponent = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => RootComponent);
