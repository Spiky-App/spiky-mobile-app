import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { faBars, faUser, faUserAstronaut } from '../constants/icons/FontAwesome';
import { ModalProfile } from './ModalProfile';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootState } from '../store';
import { useAppSelector } from '../store/hooks';
import LogoWhiteSvg from './svg/LogoWhiteSvg';
import { styles } from '../themes/appTheme';
import { BlurView } from '@react-native-community/blur';

export const Header = () => {
    const nickname = useAppSelector((state: RootState) => state.user.nickname);
    const spectatorMode = useAppSelector((state: RootState) => state.ui.spectatorMode);
    const navigation = useNavigation<any>();
    const { top } = useSafeAreaInsets();
    const [profileOption, setProfileOption] = useState(false);
    const [position, setPosition] = useState({
        top: 0,
        right: 0,
    });
    const { notificationsNumber, newChatMessagesNumber } = useAppSelector(
        (state: RootState) => state.user
    );

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
        <View style={{ backgroundColor: '#01192E' }}>
            <StatusBar barStyle="light-content" translucent={false} />
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
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <TouchableOpacity onPress={() => navigation.openDrawer()}>
                            <View
                                style={{
                                    ...stylescom.flexConte,
                                    marginHorizontal: 20,
                                }}
                            >
                                <FontAwesomeIcon icon={faBars} size={22} color="#ffff" />
                                {notificationsNumber + newChatMessagesNumber > 0 && (
                                    <>
                                        {newChatMessagesNumber > 0 && (
                                            <View style={stylescom.newChats} />
                                        )}
                                        <View style={stylescom.notif}>
                                            <Text style={stylescom.textnotif}>
                                                {notificationsNumber + newChatMessagesNumber}
                                            </Text>
                                        </View>
                                    </>
                                )}
                            </View>
                        </TouchableOpacity>
                        <View style={{ marginLeft: 10, width: 75, justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => changeScreen('CommunityScreen')}>
                                <LogoWhiteSvg />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={{ ...stylescom.flexConte, marginRight: 20 }}
                        onPress={() => setProfileOption(true)}
                    >
                        <FontAwesomeIcon
                            icon={spectatorMode ? faUserAstronaut : faUser}
                            size={18}
                            color={'#ffff'}
                        />
                        <View style={{ ...styles.center, marginLeft: 3 }}>
                            <Text
                                style={[
                                    stylescom.text,
                                    { paddingHorizontal: spectatorMode ? 8 : 0 },
                                ]}
                            >
                                @{nickname}
                            </Text>
                            {spectatorMode && (
                                <BlurView
                                    style={stylescom.blur_user}
                                    blurType="light"
                                    blurAmount={5}
                                    reducedTransparencyFallbackColor="white"
                                />
                            )}
                        </View>
                    </TouchableOpacity>

                    <ModalProfile
                        setProfileOption={setProfileOption}
                        profileOption={profileOption}
                        position={position}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
};

const stylescom = StyleSheet.create({
    container: {
        backgroundColor: '#01192E',
        marginHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingTop: 6,
        paddingBottom: 8,
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
        paddingVertical: 6,
    },
    flexConte: {
        ...styles.center,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    notif: {
        ...styles.center,
        backgroundColor: '#FC702A',
        height: 18,
        width: 18,
        borderRadius: 100,
        position: 'absolute',
        top: -6,
        right: -6,
    },
    newChats: {
        ...styles.center,
        backgroundColor: '#D4D4D4',
        height: 18,
        width: 18,
        borderRadius: 100,
        position: 'absolute',
        top: -6,
        right: -9,
    },
    textnotif: {
        ...styles.text,
        ...styles.h3,
        color: '#ffff',
        fontSize: 10,
    },
    blur_user: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
});
