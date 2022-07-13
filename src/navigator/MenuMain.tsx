import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { useWindowDimensions, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { faBell, faLightbulb, faPlus, faThumbtack, faUsers } from '../constants/icons/FontAwesome';
import { CommunityScreen } from '../screens/CommunityScreen';
import { MyIdeasScreen } from '../screens/MyIdeasScreen';
import { TrackingScreen } from '../screens/TrackingScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { ConnectionScreen } from '../screens/ConnectionScreen';
import { Header } from '../components/Header';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import { faCircleNodes } from '@fortawesome/free-solid-svg-icons/faCircleNodes';

const Drawer = createDrawerNavigator();

const menuInfo = [
  {
    name: 'Comunidad',
    screen: 'CommunityScreen',
    icon: faUsers
  },
  {
    name: 'Mis ideas',
    screen: 'MyIdeasScreen',
    icon: faLightbulb
  },
  {
    name: 'Tracking',
    screen: 'TrackingScreen',
    icon: faThumbtack
  },
  {
    name: 'Buscar',
    screen: 'SearchScreen',
    icon: faMagnifyingGlass
  },
  {
    name: 'Conexiones',
    screen: 'ConnectionScreen',
    icon: faCircleNodes
  },
]

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
    </Drawer.Navigator>
  );
};

const MenuInterno = ({ navigation }: DrawerContentComponentProps) => {
  
  
  return (
    <DrawerContentScrollView>
      <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 40 }}>
        
      {
        menuInfo.map( (item) => (
          <View
            key={item.screen}
          >
            <TouchableOpacity
              style={stylescom.buttonmenu}
              onPress={() => navigation.navigate(item.screen)}
            >
              <FontAwesomeIcon icon={item.icon} size={20} color={ "#01192E" } />
              <Text style={ stylescom.textmenu }>
                {item.name}
              </Text>
            </TouchableOpacity>
          </View>  
        ))
      }

        <TouchableOpacity style={stylescom.buttonmenu} onPress={() => {}}>
          <FontAwesomeIcon icon={faBell} size={16} color="#01192E" />
          <Text style={stylescom.textmenu}>Notificaciones</Text>
        </TouchableOpacity>

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
