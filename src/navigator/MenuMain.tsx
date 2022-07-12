import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell, faLightbulb, faPlus, faThumbtack, faUsers } from '../constants/icons/FontAwesome';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { useWindowDimensions, Text, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CommunityScreen } from '../screens/CommunityScreen';
import { MyIdeasScreen } from '../screens/MyIdeasScreen';
import { TrackingScreen } from '../screens/TrackingScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { ConnectionScreen } from '../screens/ConnectionScreen';
import { Header } from '../components/Header';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import { faCircleNodes } from '@fortawesome/free-solid-svg-icons/faCircleNodes';
import { CreateIdeaScreen } from '../screens/CreateIdeaScreen';

const Drawer = createDrawerNavigator();

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
      <Drawer.Screen name="CreateIdeaScreen" component={CreateIdeaScreen} />
    </Drawer.Navigator>
  );
};

const MenuInterno = ({ navigation }: DrawerContentComponentProps) => {
  return (
    <DrawerContentScrollView>
      <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 40 }}>
        <TouchableOpacity
          style={true ? stylescom.buttonmenuActive : stylescom.buttonmenu}
          onPress={() => navigation.navigate('CommunityScreen')}
        >
          <FontAwesomeIcon icon={faUsers} size={20} color="#01192E" />
          <Text style={true ? stylescom.textmenuActive : stylescom.textmenu}>Comunidad</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={stylescom.buttonmenu}
          onPress={() => navigation.navigate('MyIdeasScreen')}
        >
          <FontAwesomeIcon icon={faLightbulb} size={16} color="#01192E" />
          <Text style={stylescom.textmenu}>Tus ideas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={stylescom.buttonmenu}
          onPress={() => navigation.navigate('TrackingScreen')}
        >
          <FontAwesomeIcon icon={faThumbtack} size={16} color="#01192E" />
          <Text style={stylescom.textmenu}>Tracking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={stylescom.buttonmenu}
          onPress={() => navigation.navigate('SearchScreen')}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} size={16} color="#01192E" />
          <Text style={stylescom.textmenu}>Buscar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={stylescom.buttonmenu}
          onPress={() => navigation.navigate('ConnectionScreen')}
        >
          <FontAwesomeIcon icon={faCircleNodes} size={16} color="#01192E" />
          <Text style={stylescom.textmenu}>Conexiones</Text>
        </TouchableOpacity>

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
          onPress={() => navigation.navigate('CreateIdeaScreen')}
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
