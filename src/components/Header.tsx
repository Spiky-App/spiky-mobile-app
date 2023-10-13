import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { faBars, faComment, faChevronDown, faChevronUp } from '../constants/icons/FontAwesome';
import { ModalProfile } from './ModalProfile';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootState } from '../store';
import { useAppSelector } from '../store/hooks';
import { styles } from '../themes/appTheme';
import { BlurView } from '@react-native-community/blur';
import { Platform } from 'react-native';
import IconWhiteSvg from './svg/IconWhiteSvg';

export const Header = () => {
    const nickname = useAppSelector((state: RootState) => state.user.nickname);
    const spectatorMode = useAppSelector((state: RootState) => state.ui.spectatorMode);
    const navigation = useNavigation<any>();
    const { top } = useSafeAreaInsets();
    const [profileOption, setProfileOption] = useState(false);
    const [position, setPosition] = useState({
        top: 0,
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
                        });
                    }}
                >
                    <View style={styles.flex_start}>
                        <TouchableOpacity onPress={() => navigation.openDrawer()}>
                            <View style={[styles.flex_center, { marginLeft: 20 }]}>
                                <FontAwesomeIcon icon={faBars} size={22} color="#ffff" />
                                {notificationsNumber > 0 && (
                                    <View style={stylescom.notif}>
                                        <Text style={stylescom.textnotif}>
                                            {notificationsNumber}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.flex_center}>
                        <View style={stylescom.icon}>
                            <TouchableOpacity onPress={() => changeScreen('CommunityScreen')}>
                                <IconWhiteSvg />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={stylescom.flexConte}
                            onPress={() => setProfileOption(true)}
                        >
                            {/* <FontAwesomeIcon
                                icon={spectatorMode ? faUserAstronaut : faUser}
                                size={18}
                                color={'#ffff'}
                            /> */}
                            <View style={{ ...styles.center, marginHorizontal: 6 }}>
                                <Text
                                    style={[
                                        stylescom.text,
                                        { paddingHorizontal: spectatorMode ? 8 : 0 },
                                    ]}
                                >
                                    {nickname}
                                </Text>
                                {spectatorMode && (
                                    <BlurView
                                        style={stylescom.blur_user}
                                        blurType="light"
                                        blurAmount={Platform.OS === 'ios' ? 5 : 24}
                                        reducedTransparencyFallbackColor="white"
                                        overlayColor={'transparent'}
                                    />
                                )}
                            </View>
                            <FontAwesomeIcon
                                icon={profileOption ? faChevronUp : faChevronDown}
                                size={12}
                                color={'#ffff'}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => changeScreen('ConnectionsScreen')}>
                        <View
                            style={{
                                ...stylescom.flexConte,
                                marginRight: 20,
                            }}
                        >
                            <FontAwesomeIcon icon={faComment} size={22} color="#ffff" />
                            {newChatMessagesNumber > 0 && (
                                <View style={[stylescom.notif, { right: -10 }]}>
                                    <Text style={stylescom.textnotif}>{newChatMessagesNumber}</Text>
                                </View>
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
    icon: {
        // position: 'absolute',
        // left: -24,
        // bottom: 0,
        // top: 0,
        marginBottom: 5,
        width: 24,
    },
});
