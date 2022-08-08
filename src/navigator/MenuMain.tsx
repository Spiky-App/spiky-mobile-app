import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    createDrawerNavigator,
    DrawerContentComponentProps,
    DrawerContentScrollView,
    useDrawerStatus,
} from '@react-navigation/drawer';
import { useWindowDimensions, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import {
    faBell,
    faLightbulb,
    // faPlus,
    faThumbtack,
    faUsers,
    faMagnifyingGlass,
    // faCircleNodes,
    faHashtag,
    faUser,
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
import LogoAndIconSvg from '../components/svg/LogoAndIconSvg';
import { styles } from '../themes/appTheme';
import IconGray from '../components/svg/IconGray';

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
    // {
    //     name: 'Conexiones',
    //     screen: 'ConnectionScreen',
    //     icon: faCircleNodes,
    // },
    {
        name: 'Hashtag',
        screen: 'HashTagScreen',
        icon: faHashtag,
    },
    {
        name: 'Perfil',
        screen: 'ProfileScreen',
        icon: faUser,
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
    const [screenActive, setScreenActive] = useState('');
    const isDrawerOpen = useDrawerStatus() === 'open';

    const n_notificaciones = 11;

    const changeScreen = (screen: string) => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: screen }],
            })
        );
    };

    useEffect(() => {
        if (isDrawerOpen) {
            const routes = navigation.getState().routes;
            const lengthHistory = navigation.getState().history?.length || 0;
            const lastScreen: any = navigation.getState().history?.[lengthHistory - 2];
            const screenActiveObj = routes.filter(route => route.key === lastScreen?.key);
            setScreenActive(screenActiveObj[0]?.name || '');
        }
    }, [isDrawerOpen]);

    return (
        <DrawerContentScrollView
            contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}
            style={{ flexDirection: 'row' }}
        >
            <View style={{ flex: 1, width: 165 }}>
                <View style={{ width: 125, marginTop: 20 }}>
                    <LogoAndIconSvg />
                </View>

                {menuInfo.map(item => {
                    if (
                        (item.screen !== 'HashTagScreen' && item.screen !== 'ProfileScreen') ||
                        screenActive === item.screen
                    ) {
                        return (
                            <View key={item.screen}>
                                <TouchableOpacity
                                    style={
                                        screenActive === item.screen
                                            ? stylescom.buttonmenuActive
                                            : stylescom.buttonmenu
                                    }
                                    onPress={() => changeScreen(item.screen)}
                                >
                                    {screenActive === item.screen && (
                                        <View style={stylescom.orangeLine} />
                                    )}
                                    <FontAwesomeIcon
                                        icon={item.icon}
                                        size={20}
                                        color={screenActive === item.screen ? 'white' : '#01192E'}
                                    />
                                    <Text
                                        style={
                                            screenActive === item.screen
                                                ? stylescom.textmenuActive
                                                : stylescom.textmenu
                                        }
                                    >
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        );
                    } else {
                        return;
                    }
                })}

                <TouchableOpacity
                    style={stylescom.buttonmenu}
                    onPress={() => {
                        navigation.closeDrawer();
                        setModalNotif(true);
                    }}
                >
                    <FontAwesomeIcon icon={faBell} size={16} color="#01192E" />
                    <Text style={stylescom.textmenu}>Notificaciones</Text>
                    {n_notificaciones > 0 && (
                        <View style={stylescom.notif}>
                            <Text style={stylescom.textnotif}>{n_notificaciones}</Text>
                        </View>
                    )}
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
                    {/* <FontAwesomeIcon icon={faPlus} size={20} color="#01192E" /> */}
                    <View style={{ width: 22, justifyContent: 'center' }}>
                        <IconGray color="#01192E" underlayColor={'#E6E6E6'} />
                    </View>
                    <Text
                        style={{
                            ...stylescom.textmenu,
                        }}
                    >
                        Crear idea
                    </Text>
                </TouchableOpacity>

                <View style={{ flex: 1 }} />
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        bottom: 65,
                        right: 0,
                        left: 0,
                    }}
                    onPress={() => navigation.navigate('TermAndConditionsScreen')}
                >
                    <View style={{ ...styles.center }}>
                        <Text style={{ ...styles.text, ...styles.link }}>
                            Términos y condiciones.
                        </Text>
                        <Text style={{ ...styles.text, ...styles.link }}>Aviso de privacidad.</Text>
                    </View>
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
        alignItems: 'center',
        marginTop: 20,
        flexDirection: 'row',
        paddingVertical: 10,
        borderRadius: 5,
        paddingLeft: 10,
    },
    buttonmenuActive: {
        marginTop: 20,
        flexDirection: 'row',
        backgroundColor: '#01192E',
        paddingVertical: 10,
        borderRadius: 5,
        paddingLeft: 10,
    },
    textmenuActive: {
        fontFamily: 'Helvetica',
        color: '#ffff',
        fontSize: 15,
        fontWeight: '400',
        paddingLeft: 10,
    },
    orangeLine: {
        width: 9,
        borderRadius: 3,
        backgroundColor: '#FC702A',
        position: 'absolute',
        left: -13,
        top: 0,
        bottom: 0,
    },
    notif: {
        ...styles.center,
        backgroundColor: '#FC702A',
        height: 18,
        width: 18,
        borderRadius: 100,
        marginLeft: 15,
    },
    textnotif: {
        ...styles.text,
        ...styles.h3,
        color: '#ffff',
        fontSize: 10,
    },
});
