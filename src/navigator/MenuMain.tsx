import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { useWindowDimensions, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  faBell,
  faLightbulb,
  faPlus,
  faThumbtack,
  faUsers,
  faMagnifyingGlass,
  faCircleNodes,
} from '../constants/icons/FontAwesome';
import { CommunityScreen } from '../screens/CommunityScreen';
import { MyIdeasScreen } from '../screens/MyIdeasScreen';
import { TrackingScreen } from '../screens/TrackingScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { ConnectionScreen } from '../screens/ConnectionScreen';
import { Header } from '../components/Header';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ModalNotification } from '../components/ModalNotification';
import { ConfigurationScreen } from '../screens/ConfigurationScreen';
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';
import { HashTagScreen } from '../screens/HashTagScreen';
import { CommonActions } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

const menuInfo = [
  {
    name: 'Comunidad',
    screen: 'CommunityScreen',
    icon: faUsers,
  },
  {
    name: 'Mis ideas',
    screen: 'MyIdeasScreen',
    icon: faLightbulb,
  },
  {
    name: 'Tracking',
    screen: 'TrackingScreen',
    icon: faThumbtack,
  },
  {
    name: 'Buscar',
    screen: 'SearchScreen',
    icon: faMagnifyingGlass,
  },
  {
    name: 'Conexiones',
    screen: 'ConnectionScreen',
    icon: faCircleNodes,
  },
];

export const MenuMain = () => {
  const { width } = useWindowDimensions();

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: width >= 768 ? 'permanent' : 'front', // Menú modo horizontal
        headerShown: true,
        header: () => {
          return <Header />;
        },
        drawerStyle: { backgroundColor: '#F8F8F8', width: '60%' },
        overlayColor: '#6363635c',
      }}
      drawerContent={props => <MenuInterno {...props} />}
    >
      <Drawer.Screen name="CommunityScreen" component={CommunityScreen} />
      <Drawer.Screen name="MyIdeasScreen" component={MyIdeasScreen} />
      <Drawer.Screen name="TrackingScreen" component={TrackingScreen} />
      <Drawer.Screen name="SearchScreen" component={SearchScreen} />
      <Drawer.Screen name="ConnectionScreen" component={ConnectionScreen} />
      <Drawer.Screen name="ProfileScreen" component={ProfileScreen} />
      <Drawer.Screen name="ConfigurationScreen" component={ConfigurationScreen} />
      <Drawer.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
      <Drawer.Screen name="HashTagScreen" component={HashTagScreen} />
    </Drawer.Navigator>
  );
};

const MenuInterno = ({ navigation }: DrawerContentComponentProps) => {
  const [modalNotif, setModalNotif] = useState(false);

  const changeScreen = (screen: string) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: screen }],
      })
    );
  };

  return (
    <DrawerContentScrollView>
      <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 40 }}>
        {menuInfo.map(item => (
          <View key={item.screen}>
            <TouchableOpacity
              style={stylescom.buttonmenu}
              onPress={() => changeScreen(item.screen)}
            >
              <FontAwesomeIcon icon={item.icon} size={20} color={'#01192E'} />
              <Text style={stylescom.textmenu}>{item.name}</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={stylescom.buttonmenu}
          onPress={() => {
            navigation.closeDrawer();
            setModalNotif(true);
          }}
        >
          <FontAwesomeIcon icon={faBell} size={16} color="#01192E" />
          <Text style={stylescom.textmenu}>Notificaciones</Text>
        </TouchableOpacity>

        <ModalNotification modalNotif={modalNotif} setModalNotif={setModalNotif} />

        <TouchableOpacity
          style={{
            ...stylescom.buttonmenu,
            borderWidth: 1,
            borderColor: '#01192E',
            borderRadius: 5,
            paddingVertical: 10,
            paddingHorizontal: 8,
          }}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('CreateIdeaScreen');
          }}
        >
          <FontAwesomeIcon icon={faPlus} size={20} color="#01192E" />
          <Text
            style={{
              ...stylescom.textmenu,
            }}
          >
            Crear idea
          </Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const stylescom = StyleSheet.create({
  textmenu: {
    fontFamily: 'Helvetica',
    color: '#01192E',
    fontSize: 15,
    fontWeight: '400',
    paddingLeft: 10,
  },
  buttonmenu: {
    marginTop: 25,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonmenuActive: {
    marginTop: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#01192E',
    paddingVertical: 10,
    borderRadius: 5,
  },
  textmenuActive: {
    fontFamily: 'Helvetica',
    color: '#ffff',
    fontSize: 15,
    fontWeight: '400',
    paddingLeft: 10,
  },
});
