import React from 'react'
import { View, Text, Button, StyleSheet, Alert, Platform } from 'react-native'
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native'
import * as Contact from 'expo-contacts'

function Home() {
  const nav = useNavigation();

  // function
  const askPermission = async() => {
    //const {status} = await Permissions.askAsync(Permissions.CONTACTS);
    const {status} = await Contact.requestPermissionsAsync();

    if (status !== Contact.PermissionStatus.GRANTED) {
      Alert.alert('You have to grant us permissions');
      if (Platform.OS == 'android') {
        nav.navigate('contacts');
      }
    }

    if (status === Contact.PermissionStatus.GRANTED) {
      // navigate to the contact page
      nav.navigate('contacts')
    }
  }
  return (
    <View style={styles.parent}>
      <Text>Hello From home page</Text>
      <Button title="Contacts" onPress={askPermission} />
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CE7DA5'
  }
});

const mapStateToProps = (state: any) => state;
const mapDispatchToProps = (dispatch: any) => ({})
const connectComponent = connect(mapStateToProps, mapDispatchToProps);

export default connectComponent(Home);
