import React from 'react'
import { View, Text, Alert, ActivityIndicator, StyleSheet, StatusBar, Dimensions, Platform, Linking, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';
import * as Contacts from 'expo-contacts'
import { ScrollView } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons'
import { Link } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, runOnJS,  } from 'react-native-reanimated'

const { height, width } = Dimensions.get('window')

const TOP = height / 100 * (Platform.OS === 'android' ? 90: 85);
const LEFT = width / 100 * 80;

function SingleContact(props: any) {
  const idRef = React.useRef(props.route.params.id);
  const [contact, setContact] = React.useState({} as Contacts.Contact);
  const [loading, setLoading] = React.useState(true);
  const [opened, setOpened] = React.useState(false);

  // animated components
  const T = Animated.createAnimatedComponent(TouchableOpacity)

  // animations
  const horizontals = useSharedValue(Math.round(LEFT));
  const verticals = useSharedValue(Math.round(TOP));
  const opacity = useSharedValue(0);

  const animate = () => {
    'worklet';
    if (opened) {
      opacity.value = withTiming(0, { duration: 400});

      horizontals.value = withSpring(Math.round(LEFT));
      verticals.value = withSpring(Math.round(TOP));

      setOpened(false)
      return
    }

    opacity.value = withTiming(1, { duration: 500});

    horizontals.value = withSpring(Math.round(width / 100 * 60));
    verticals.value = withSpring(Math.round(height / 100 * (Platform.OS === 'android' ? 80:76)));

    setOpened(true);
  }

  // animated styles for verticals
  const vstyles = useAnimatedStyle(() => {
    return {
      top: verticals.value,
      left: LEFT,
      opacity: opacity.value
    }
  });

  const hstyles = useAnimatedStyle(() => {
    return {
      top: TOP,
      left: horizontals.value,
      opacity: opacity.value
    }
  })

  React.useEffect(() => {
   (async function() {
    const singlecontact = await Contacts.getContactByIdAsync(idRef.current);

    if (singlecontact === undefined) {
      Alert.alert('Contact not found');
      setLoading(false);
    }else {
      setContact(singlecontact);
      setLoading(false);
    }
   })()
  }, []);

  const call = async (phone: string) => {
    // if (Platform.OS === 'ios') {
    //   Alert.alert('Platform not supported');
    //   return;
    // }

    // call the number
    const ret = await Linking.openURL(`tel:${phone}`);
    console.log(ret);
  }

  const sms = async (phone: string) => {
    // if (Platform.OS === 'ios') {
    //   Alert.alert('Platform not supported');
    //   return;
    // }

    // send sms the number
    const ret = await Linking.openURL(`sms:${phone}`);
    console.log(ret);
  }

  if (loading) {
    return (
      <View style={styles.parent}>
        <StatusBar translucent barStyle="default" backgroundColor="white" />
        <ActivityIndicator color="red" size="large" />
        <Text style={{ marginTop: 10 }}>Loading Your contacts...</Text>
      </View>
    )
  }

  return (
    <View style={styles.visibleparent}>
      <StatusBar translucent barStyle="default" />
      <View style={styles.scrollview}>

        <T style={[styles.phonecallicon, hstyles]} onPress={() => call(contact.phoneNumbers[0].number)}>
          <Feather name="phone" size={30} color="#FF925C" />
        </T>

        {/* <T style={[styles.phonecallicon, vstyles]} onPress={() => call(contact.phoneNumbers[0].number)}>
          <Feather name="phone" size={30} color="#FF925C" />
        </T> */}

        <T style={[styles.phonecallicon, vstyles]} onPress={() => sms(contact.phoneNumbers[0].number)}>
          <Feather name="message-square" size={30} color="#FF925C" />
        </T>

        <TouchableOpacity style={[styles.phonecallicon2]} onPress={() => runOnJS(animate)()}>
          <Feather name={opened ? 'x':"more-horizontal"} size={30} color={opened ? 'red':"#FF925C"} />
        </TouchableOpacity>

        <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{contact.name[0].toUpperCase()}</Text>
            </View>
            <Text style={styles.phone}>{contact.phoneNumbers[0].number}</Text>
        </View>

        <View style={styles.dataholder}>
          <View style={styles.cont}>

            <View style={styles.contentHolder}>
              <Text style={styles.sub}>Name</Text>
              <Text style={styles.name}>{contact.name}</Text>
            </View>

            <View style={styles.contentHolder}>
              <Text style={styles.sub}>Country Code</Text>
              <Text style={styles.name}>{contact.phoneNumbers[0].countryCode === undefined ? 'None': contact.phoneNumbers[0].countryCode}</Text>
            </View>

            <View style={styles.contentHolder}>
              <Text style={styles.sub}>Phone</Text>
              <Text style={styles.name}>{contact.phoneNumbers[0].number}</Text>
            </View>

          </View>
        </View>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight,
  },
  visibleparent: {
    paddingTop: 0,
    flex: 1,
    backgroundColor: 'whitesmoke'
  },
  scrollview: {
    flex: 1,
  },
  avatarContainer: {
    width: '100%',
    height: height / 100 * 35,
    backgroundColor: '#FF925C',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'whitesmoke',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarText: {
    fontSize: 65,
    fontWeight: 'bold',
    color: 'black'
  },
  phone: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 10
  },
  phonecallicon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: 'lightgrey',
    shadowOffset: {width: 2, height: 2},
    shadowRadius: 7,
    shadowOpacity: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    position: 'absolute',
  },
  phonecallicon2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: 'lightgrey',
    shadowOffset: {width: 2, height: 2},
    shadowRadius: 7,
    shadowOpacity: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    position: 'absolute',
    top: height / 100 * (Platform.OS === 'android' ? 90: 85),
    left: width / 100 * 80
  },
  dataholder: {
    flex: 1,
    width: '100%',
    borderRadius: 20,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  cont: {
    width: '100%',
    height: height / 100 * 40,
    backgroundColor: '#ffffff',
    borderRadius: 0,
    elevation: 1,
    shadowColor: 'lightgrey',
    shadowOffset: {width: 2, height: 2},
    shadowRadius: 7,
    shadowOpacity: 0.7,
    padding: 20,
  },
  contentHolder: {
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: 'whitesmoke',
    paddingBottom: 5,
    marginBottom: 20
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  sub: {
    fontSize: 18,
    fontWeight: '300'
  }
});


const mapStateToProps = (state: any) => state;
const mapDispatchToProps = (dispatch: any) => ({})
const connectComponent = connect(mapStateToProps, mapDispatchToProps);

export default connectComponent(SingleContact);
