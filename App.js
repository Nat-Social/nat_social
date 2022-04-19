import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import firebase from 'firebase';
import AppNavigator from './app/navigation/AppNavigator';
import firebaseConfig from './app/config/firebase';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './app/redux/reducers'
import thunk from 'redux-thunk';
import 'react-native-gesture-handler';

import MainNavigator from './app/navigation/MainNavigator';

const store = createStore(rootReducer, applyMiddleware(thunk))

const app = firebase.initializeApp(firebaseConfig);


export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    }
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true
        })
      }
    })
  }
  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <View>
          <Text>Loading</Text>
        </View>
      )
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      );
    }

    return (
      <Provider store={store} >
          <NavigationContainer theme={DarkTheme}>
            <MainNavigator navigation={this.props.navigation} />
          </NavigationContainer>
      </Provider>
    )
  }
}

export default App


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
