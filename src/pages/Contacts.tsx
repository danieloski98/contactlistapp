import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Dimensions, TouchableOpacity, } from 'react-native'
import { connect } from 'react-redux';
import Animated from 'react-native-reanimated'
import * as Contacts from 'expo-contacts'
import {Feather} from '@expo/vector-icons'
import {useNavigation} from '@react-navigation/native'

const { height } = Dimensions.get('window');

interface IContact {
  countryCode: string;
  digits: string;
  id: string;
  label: string;
  number: string;
}

function ContactsList() {
  const [loading, setLoading] = React.useState(true);
  const [contacts, setContacts] = React.useState([] as Contacts.Contact[]);
  const nav = useNavigation();

  React.useEffect(() => {
    (async function() {
      if (contacts.length > 0) {
        return;
      }else {
        const contactsLists = await Contacts.getContactsAsync();

        setContacts(prev => [...prev, ...contactsLists.data])

        setLoading(false);
      }
    })()
  }, []);

  const navigate = (id: string) => {
    nav.navigate('contact', { id });
  }

  if (loading) {
    return (
      <View style={styles.parent}>
        <ActivityIndicator color="#B6E2B7" size="large" />
        <Text style={{ marginTop: 10 }}>Loading Your contacts...</Text>
      </View>
    )
  }
  return (
    <View style={styles.listParent}>
      <FlatList
        data={contacts}
        horizontal={false}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.contactcard} onPress={() => navigate(item.id)}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.avatar}>
                <Text style={styles.icon}>{item.name[0].toUpperCase()}</Text>
              </View>
              <View>
                <Text style={styles.text}>{item.name}</Text>
                <Text style={styles.number}>{item.phoneNumbers[0].number}</Text>
              </View>
            </View>

            <View style={styles.iconsContainer}>

              <TouchableOpacity style={styles.avatar}>
                  <Feather name="chevron-right" size={20} color="#FF925C" />
              </TouchableOpacity>

            </View>

          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listParent: {
    flex: 1,
    backgroundColor: 'whitesmoke'
  },
  container: {
    paddingTop: 10,
    paddingBottom: 100,
  },
  contactcard: {
    width: '100%',
    height: height/ 100 * 10,
    backgroundColor: '#ffffff',
    marginBottom: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: 'lightgrey',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'whitesmoke',
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    fontSize: 25,
    fontWeight: '900',
    color: 'black'
  },
  text: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600'
  },
  number: {
    marginTop: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

const mapStateToProps = (state: any) => state;
const mapDispatchToProps = (dispatch: any) => ({})
const connectComponent = connect(mapStateToProps, mapDispatchToProps);

export default connectComponent(ContactsList);
