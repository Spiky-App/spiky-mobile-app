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
import {
    faRightFromBracket,
    faGear,
    faUserAstronaut,
    faUser,
} from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import useSpikyService from '../hooks/useSpikyService';
import { DrawerParamList } from '../navigator/MenuMain';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootState } from '../store';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleSpectatorMode } from '../store/feature/ui/uiSlice';

interface Props {
    setProfileOption: (value: boolean) => void;
    profileOption: boolean;
    position: {
        top: number;
        right: number;
    };
}

export const ModalProfile = ({ setProfileOption, profileOption, position }: Props) => {
    const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
    const { logOutFunction } = useSpikyService();
    const dispatch = useAppDispatch();
    const spectatorMode = useAppSelector((state: RootState) => state.ui.spectatorMode);
    const { top, right } = position;

    function handleSpectatorMode() {
        setProfileOption(false);
        dispatch(toggleSpectatorMode());
    }

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
                                borderRadius: 10,
                                position: 'absolute',
                                top: top + 38,
                                right: right - 130,
                            }}
                        >
                            <TouchableOpacity
                                style={stylescom.optionModal}
                                onPress={() => {
                                    setProfileOption(false);
                                    navigation.navigate('ConfigurationScreen');
                                }}
                            >
                                <FontAwesomeIcon icon={faGear} color="white" size={16} />
                                <Text style={{ ...styles.text, ...stylescom.textModal }}>
                                    Configuraciones
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={stylescom.optionModal}
                                onPress={handleSpectatorMode}
                            >
                                <FontAwesomeIcon
                                    icon={spectatorMode ? faUser : faUserAstronaut}
                                    color="white"
                                    size={16}
                                />
                                <Text style={{ ...styles.text, ...stylescom.textModal }}>
                                    {`Modo ${spectatorMode ? 'normal' : 'espectador'}`}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={stylescom.optionModal}
                                onPress={logOutFunction}
                            >
                                <FontAwesomeIcon
                                    icon={faRightFromBracket}
                                    color="white"
                                    size={16}
                                />
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
        marginHorizontal: 18,
        marginVertical: 10,
    },
    textModal: {
        ...styles.text,
        color: '#ffff',
        fontSize: 16,
        marginLeft: 10,
    },
});
