import 'react-native-gesture-handler';
// import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'react-redux'
import { store } from './src/store/store';
import { createStackNavigator } from '@react-navigation/stack'

// components
import Home from './src/pages/Home';
import Contacts from './src/pages/Contacts';
import SingleContact from './src/pages/SingleContact';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
        <StatusBar backgroundColor="black" barStyle="light-content"  />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="home">
            <Stack.Screen component={Home} name="home"  options={{ headerShown: false }}/>
            <Stack.Screen component={Contacts} name="contacts" options={{ headerStyle: {backgroundColor: '#ffffff' } }} />
            <Stack.Screen component={SingleContact} name="contact" options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
