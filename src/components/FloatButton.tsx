import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    TouchableHighlight,
    Modal,
    TouchableWithoutFeedback,
    View,
    Text,
    Animated,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { styles } from '../themes/appTheme';
import { Pressable } from 'react-native';
import {
    faSquarePollHorizontal,
    faFaceSmile,
    faPlus,
    faComments,
} from '../constants/icons/FontAwesome';
import { RootStackParamList } from '../navigator/Navigator';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import IconColor from './svg/IconColor';
import { ModalTopics } from './ModalTopics';

export const FloatButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const position1 = useRef(new Animated.Value(0)).current;
    const position2 = useRef(new Animated.Value(0)).current;
    const position3 = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [isOpenModalTopics, setIsOpenModalTopics] = useState(false);

    function handleChangeScreen(
        screen: 'CreateIdeaScreen' | 'CreatePollScreen' | 'CreateMoodScreen'
    ) {
        handleCloseModal(() => navigation.navigate(screen));
    }

    function handleCloseModal(callback?: () => void) {
        Animated.sequence([
            Animated.timing(opacity, {
                toValue: 0,
                duration: 50,
                useNativeDriver: false,
            }),
            Animated.parallel([
                Animated.timing(position1, {
                    toValue: 0,
                    duration: 50,
                    useNativeDriver: false,
                }),
                Animated.timing(position2, {
                    toValue: 0,
                    duration: 50,
                    useNativeDriver: false,
                }),
                Animated.timing(position3, {
                    toValue: 0,
                    duration: 50,
                    useNativeDriver: false,
                }),
            ]),
        ]).start(() => {
            setIsModalOpen(false);
            if (callback) callback();
        });
    }

    useEffect(() => {
        if (isModalOpen) {
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(position1, {
                        toValue: -85,
                        duration: 200,
                        useNativeDriver: false,
                    }),
                    Animated.timing(position2, {
                        toValue: -160,
                        duration: 200,
                        useNativeDriver: false,
                    }),
                    Animated.timing(position3, {
                        toValue: -235,
                        duration: 200,
                        useNativeDriver: false,
                    }),
                ]),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: false,
                }),
            ]).start();
        }
    }, [isModalOpen]);

    return (
        <>
            <TouchableHighlight
                underlayColor="#FC702Abe"
                onPress={() => {
                    RNReactNativeHapticFeedback.trigger('impactMedium', {
                        enableVibrateFallback: true,
                        ignoreAndroidSystemSettings: false,
                    });
                    setIsModalOpen(true);
                }}
                style={[stylescom.button, isModalOpen && { backgroundColor: '#67737D' }]}
            >
                <FontAwesomeIcon icon={faPlus} color="#F8F8F8" size={32} />
            </TouchableHighlight>
            <Modal transparent={true} visible={isModalOpen} animationType="fade">
                <TouchableWithoutFeedback onPressOut={() => handleCloseModal()}>
                    <View style={styles.backmodal}>
                        <View style={stylescom.sub_container}>
                            <Animated.View
                                style={[
                                    stylescom.option_container,
                                    { transform: [{ translateY: position3 }] },
                                ]}
                            >
                                <Pressable
                                    style={stylescom.press_container}
                                    onPress={() =>
                                        handleCloseModal(() => setIsOpenModalTopics(true))
                                    }
                                >
                                    <Animated.View style={[stylescom.text_container, { opacity }]}>
                                        <Text style={{ ...styles.text, fontSize: 16 }}>
                                            Discusiones
                                        </Text>
                                    </Animated.View>
                                    <View style={stylescom.small_button}>
                                        <FontAwesomeIcon
                                            icon={faComments}
                                            color={'white'}
                                            size={16}
                                        />
                                    </View>
                                </Pressable>
                            </Animated.View>
                            <Animated.View
                                style={[
                                    stylescom.option_container,
                                    { transform: [{ translateY: position2 }] },
                                ]}
                            >
                                <Pressable
                                    style={stylescom.press_container}
                                    onPress={() => handleChangeScreen('CreateMoodScreen')}
                                >
                                    <Animated.View style={[stylescom.text_container, { opacity }]}>
                                        <Text style={{ ...styles.text, fontSize: 16 }}>Estado</Text>
                                    </Animated.View>
                                    <View style={stylescom.small_button}>
                                        <FontAwesomeIcon
                                            icon={faFaceSmile}
                                            color={'white'}
                                            size={16}
                                        />
                                    </View>
                                </Pressable>
                            </Animated.View>
                            <Animated.View
                                style={[
                                    stylescom.option_container,
                                    { transform: [{ translateY: position1 }] },
                                ]}
                            >
                                <Pressable
                                    style={stylescom.press_container}
                                    onPress={() => handleChangeScreen('CreatePollScreen')}
                                >
                                    <Animated.View style={[stylescom.text_container, { opacity }]}>
                                        <Text style={{ ...styles.text, fontSize: 16 }}>
                                            Encuesta
                                        </Text>
                                    </Animated.View>
                                    <View style={stylescom.small_button}>
                                        <FontAwesomeIcon
                                            icon={faSquarePollHorizontal}
                                            color={'white'}
                                            size={16}
                                        />
                                    </View>
                                </Pressable>
                            </Animated.View>
                            <View style={{ ...styles.flex_center }}>
                                <Pressable
                                    style={stylescom.press_container}
                                    onPress={() => handleChangeScreen('CreateIdeaScreen')}
                                >
                                    <Animated.View style={[stylescom.text_container, { opacity }]}>
                                        <Text style={{ ...styles.text, fontSize: 16 }}>Idea</Text>
                                    </Animated.View>
                                    <View
                                        style={[stylescom.small_button, { height: 65, width: 65 }]}
                                    >
                                        <View style={{ width: 38, paddingRight: 4 }}>
                                            <IconColor color={'white'} underlayColor={'#01192E'} />
                                        </View>
                                    </View>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            <ModalTopics modalTopics={isOpenModalTopics} setModalTopics={setIsOpenModalTopics} />
        </>
    );
};

const stylescom = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        height: 65,
        width: 65,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#01192E',
        marginHorizontal: 15,
        marginVertical: 25,
        borderWidth: 0,
        borderRadius: 100,
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    small_button: {
        height: 55,
        width: 55,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#01192E',
        borderRadius: 100,
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    text_container: {
        ...styles.shadow,
        ...styles.center,
        minWidth: 60,
        backgroundColor: 'white',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 6,
        marginRight: 12,
    },
    sub_container: {
        position: 'absolute',
        marginHorizontal: 15,
        marginVertical: 25,
        alignContent: 'stretch',
        bottom: 0,
        right: 0,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flexDirection: 'column',
    },
    option_container: {
        position: 'absolute',
        right: 0,
    },
    press_container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
});
