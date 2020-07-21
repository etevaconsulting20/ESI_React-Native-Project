
import React from 'react';
import {  StyleSheet,} from 'react-native';
import { Colors,} from 'react-native/Libraries/NewAppScreen';
import { createAppContainer, NavigationScreenProp } from 'react-navigation';
import AppNavigator from './src/routes/appRouting';
import { Provider } from "react-redux";
import store from './src/store';


interface Props {
  navigation : NavigationScreenProp < any, any >;
}

const AppContainer = createAppContainer(AppNavigator); 

export default class App extends React.Component<Props> {  
  render() {  
      return (
          <AppContainer />
     )
  }  
}  

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
});

// export default App;
