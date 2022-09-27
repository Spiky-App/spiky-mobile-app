import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { CommonActions, useNavigation } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    SafeAreaView,
    TouchableOpacity,
    useColorScheme,
} from 'react-native';
import { faBars, faUser } from '../constants/icons/FontAwesome';
import { ModalProfile } from './ModalProfile';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootState } from '../store';
import { useAppSelector } from '../store/hooks';
import LogoWhiteSvg from './svg/LogoWhiteSvg';
import { styles } from '../themes/appTheme';

export const Header = () => {
    const nickname = useAppSelector((state: RootState) => state.user.nickname);
    const navigation = useNavigation<any>();
    const { top } = useSafeAreaInsets();
    const [profileOption, setProfileOption] = useState(false);
    const [position, setPosition] = useState({
        top: 0,
        right: 0,
    });
    const colorScheme = useColorScheme();
    const [isDarkScheme, setIsDarkAppearance] = useState(false);
    useEffect(() => {
        setIsDarkAppearance(colorScheme === 'dark');
    }, [colorScheme]);

    const n_notificaciones = useAppSelector((state: RootState) => state.user.notificationsNumber);

    const changeScreen = (screen: string) => {
        const targetRoute = navigation
            .getState()
            .routes.find((route: { name: string }) => route.name === screen);
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: screen, params: targetRoute?.params }],
            })
        );
    };

    return (
        <ImageBackground
            source={require('../constants/images/background-paper.png')}
            resizeMode="cover"
            imageStyle={
                isDarkScheme && {
                    tintColor: '#01192E',
                }
            }
        >
            <SafeAreaView>
                <View
                    style={{
                        ...stylescom.container,
                        marginTop: top > 0 ? 0 : 15,
                    }}
                    onLayout={({ nativeEvent }) => {
                        setPosition({
                            top: nativeEvent.layout.y + 10,
                            right: nativeEvent.layout.x + 120,
                        });
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.openDrawer()}
                        style={{ justifyContent: 'center', alignItems: 'center' }}
                    >
                        <View style={{ ...stylescom.flexConte, marginLeft: 20 }}>
                            <FontAwesomeIcon icon={faBars} size={22} color="#ffff" />
                            {n_notificaciones > 0 && (
                                <View style={stylescom.notif}>
                                    <Text style={stylescom.textnotif}>{n_notificaciones}</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>

                    <View style={{ width: 75, marginLeft: 15 }}>
                        <TouchableOpacity onPress={() => changeScreen('CommunityScreen')}>
                            <LogoWhiteSvg />
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1 }} />

                    <TouchableOpacity
                        style={{ ...stylescom.flexConte, marginRight: 20 }}
                        onPress={() => setProfileOption(true)}
                    >
                        <FontAwesomeIcon icon={faUser} size={18} color="#ffff" />
                        <Text style={stylescom.text}>{`@${nickname}`}</Text>
                    </TouchableOpacity>

                    <ModalProfile
                        setProfileOption={setProfileOption}
                        profileOption={profileOption}
                        position={position}
                    />
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
};

const stylescom = StyleSheet.create({
    container: {
        backgroundColor: '#01192E',
        height: 45,
        marginHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    imageback: {
        backgroundColor: '#F8F8F8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'white',
        fontFamily: 'Helvetica',
        fontWeight: '400',
        fontSize: 16,
        marginLeft: 3,
    },
    flexConte: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
    },
    notif: {
        ...styles.center,
        backgroundColor: '#FC702A',
        height: 18,
        width: 18,
        borderRadius: 100,
        position: 'absolute',
        top: 6,
        right: -6,
    },
    textnotif: {
        ...styles.text,
        ...styles.h3,
        color: '#ffff',
        fontSize: 10,
    },
});
