import {AppRegistry, View} from 'react-native';

import App from './App';
import {Provider} from 'react-redux';
import {name as appName} from './app.json';
import store from './src/reducers/store';

const Main = () => {
  return (
    <View style={{flex: 1}}>
      <Provider store={store}>
        <App />
      </Provider>
    </View>
  );
};

AppRegistry.registerComponent(appName, () => Main);
