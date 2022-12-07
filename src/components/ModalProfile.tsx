import React from 'react';
import {
    Modal,
    TouchableWithoutFeedback,
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import { faRightFromBracket, faGear } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import useSpikyService from '../hooks/useSpikyService';

interface Props {
    setProfileOption: (value: boolean) => void;
    profileOption: boolean;
    position: {
        top: number;
        right: number;
    };
}

export const ModalProfile = ({ setProfileOption, profileOption, position }: Props) => {
    const navigation = useNavigation<any>();
    const { logOutFunction } = useSpikyService();
    const { top, right } = position;

    return (
        <Modal animationType="fade" visible={profileOption} transparent={true}>
            <TouchableWithoutFeedback onPress={() => setProfileOption(false)}>
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
                                backgroundColor: '#01192E',
                                paddingVertical: 3,
                                shadowOffset: {
                                    width: 0,
                                    height: 10,
                                },
                                shadowOpacity: 0.25,
                                elevation: 10,
                                borderRadius: 5,
                                position: 'absolute',
                                top: top + 40,
                                right: right - 120,
                            }}
                        >
                            <TouchableOpacity
                                style={stylescom.optionModal}
                                onPress={() => {
                                    setProfileOption(false);
                                    navigation.navigate('ConfigurationScreen');
                                }}
                            >
                                <FontAwesomeIcon icon={faGear} color="white" />
                                <Text style={{ ...styles.text, ...stylescom.textModal }}>
                                    Configuraciones
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={stylescom.optionModal}
                                onPress={logOutFunction}
                            >
                                <FontAwesomeIcon icon={faRightFromBracket} color="white" />
                                <Text style={{ ...styles.text, ...stylescom.textModal }}>
                                    Cerrar sesión
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const stylescom = StyleSheet.create({
    optionModal: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: 14,
        marginVertical: 5,
    },
    textModal: {
        color: '#ffff',
        fontSize: 15,
        marginLeft: 10,
    },
});
