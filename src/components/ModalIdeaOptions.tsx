import React from 'react';
import { Modal, Text, TouchableWithoutFeedback, View, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBan, faReply, faThumbtack, faTrashCan } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { useNavigation } from '@react-navigation/native';

interface Props {
    setIdeaOptions: (value: boolean) => void;
    ideaOptions: boolean;
    myIdea: boolean;
    position: {
        top: number;
        left: number;
    };
}

export const ModalIdeaOptions = ({ setIdeaOptions, ideaOptions, myIdea, position }: Props) => {
    const { top, left } = position;
    const navigation = useNavigation<any>();

    const goToScreen = (screen:string) => {
        setIdeaOptions(false);
        navigation.navigate(screen);
    }

    return (
        <Modal animationType="fade" visible={ideaOptions} transparent={true}>
            <TouchableWithoutFeedback onPress={() => setIdeaOptions(false)}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <TouchableWithoutFeedback>
                        <View
                            style={{
                                backgroundColor: '#ffff',
                                paddingVertical: 3,
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                elevation: 7,
                                borderRadius: 5,
                                alignItems: 'flex-start',
                                position: 'absolute',
                                width: 150,
                                top: top,
                                left: left - 110,
                            }}
                        >
                            {!myIdea ? (
                                <>
                                    <TouchableOpacity
                                        style={{
                                            ...styles.flex,
                                            ...styles.center,
                                            paddingHorizontal: 14,
                                        }}
                                        onPress={() => {}}
                                    >
                                        <FontAwesomeIcon
                                            icon={faThumbtack}
                                            color="#01192E"
                                            size={13}
                                        />
                                        <Text
                                            style={{
                                                ...styles.text,
                                                fontSize: 13,
                                                marginLeft: 8,
                                                paddingVertical: 6,
                                            }}
                                        >
                                            Tracking
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{
                                            ...styles.flex,
                                            ...styles.center,
                                            paddingHorizontal: 14,
                                        }}
                                        onPress={() => {}}
                                    >
                                        <FontAwesomeIcon icon={faReply} color="#01192E" size={13} />
                                        <Text
                                            style={{
                                                ...styles.text,
                                                fontSize: 13,
                                                marginLeft: 8,
                                                paddingVertical: 6,
                                            }}
                                        >
                                            Replicar en priv
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{
                                            ...styles.flex,
                                            ...styles.center,
                                            paddingHorizontal: 14,
                                        }}
                                        onPress={() => goToScreen('ReportIdeaScreen')}
                                    >
                                        <FontAwesomeIcon icon={faBan} color="#01192E" size={12} />
                                        <Text
                                            style={{
                                                ...styles.text,
                                                fontSize: 13,
                                                marginLeft: 8,
                                                paddingVertical: 6,
                                            }}
                                        >
                                            Reportar
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <TouchableOpacity
                                    style={{
                                        ...styles.flex,
                                        ...styles.center,
                                        paddingHorizontal: 14,
                                    }}
                                    onPress={() => {}}
                                >
                                    <FontAwesomeIcon icon={faTrashCan} color="#01192E" size={13} />
                                    <Text
                                        style={{
                                            ...styles.text,
                                            fontSize: 13,
                                            marginLeft: 8,
                                            paddingVertical: 6,
                                        }}
                                    >
                                        Eliminar
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
