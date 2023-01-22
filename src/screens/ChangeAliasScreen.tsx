import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeftLong } from '../constants/icons/FontAwesome';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { styles } from '../themes/appTheme';
import { useForm } from '../hooks/useForm';
import { useAppDispatch } from '../store/hooks';
import useSpikyService from '../hooks/useSpikyService';
import { setModalAlert } from '../store/feature/ui/uiSlice';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { updateUserNickName } from '../store/feature/user/userSlice';
import { ModalConfirmation } from '../components/ModalConfirmation';

const initialState = {
    alias: '',
};

export const ChangeAliasScreen = () => {
    const { updateUserNickname } = useSpikyService();
    const dispatch = useAppDispatch();
    const [buttonState, setButtonState] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenConfirmation, setIsOpenConfirmation] = useState(false);
    const navigation = useNavigation<any>();
    const { form, onChange } = useForm(initialState);

    const { alias } = form;

    const changePassword = async () => {
        setIsLoading(true);
        const wasUpdated = await updateUserNickname(alias);
        if (wasUpdated) {
            dispatch(updateUserNickName(alias));
            dispatch(
                setModalAlert({
                    isOpen: true,
                    text: 'Seudónimo actualizado',
                    icon: faLock,
                })
            );
            onChange(initialState);
            navigation.navigate('ConfigurationScreen');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (alias !== '') {
            setButtonState(true);
        }
    }, [alias]);

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <View style={{ ...styles.center, marginTop: 30 }}>
                <TouchableOpacity
                    style={{ ...styles.center, position: 'absolute', left: -40, top: 0, bottom: 0 }}
                    onPress={() => navigation.navigate('ConfigurationScreen')}
                >
                    <FontAwesomeIcon icon={faArrowLeftLong} size={27} color="#959595" />
                </TouchableOpacity>

                <Text style={{ ...styles.text, ...styles.h3 }}>
                    Cambio de seudónimo
                    <Text style={styles.orange}>.</Text>
                </Text>
            </View>

            <View style={styles.center}>
                <Text style={{ ...styles.text, fontSize: 12, marginVertical: 30 }}>
                    Ingrese tu nuevo seudónimo:
                </Text>

                <View style={{ ...styles.input, marginBottom: 20, width: 280 }}>
                    <TextInput
                        placeholder="Seudónimo"
                        placeholderTextColor="#707070"
                        autoCorrect={false}
                        autoCapitalize="none"
                        style={styles.textinput}
                        value={alias}
                        onChangeText={value => onChange({ alias: value })}
                    />
                </View>

                <TouchableOpacity
                    style={{
                        ...styles.button,
                        marginTop: 50,
                        borderColor: buttonState && !isLoading ? '#01192E' : '#D4D4D4',
                    }}
                    onPress={
                        buttonState && !isLoading ? () => setIsOpenConfirmation(true) : () => {}
                    }
                >
                    <Text
                        style={{
                            ...styles.text,
                            fontSize: 14,
                            color: buttonState ? '#01192E' : '#D4D4D4',
                        }}
                    >
                        Cambiar seudónimo
                    </Text>
                </TouchableOpacity>
            </View>
            <ModalConfirmation
                isOpen={isOpenConfirmation}
                callback={changePassword}
                setIsOpen={setIsOpenConfirmation}
                text={'¿Estás seguro de tu nuevo seudónimo?'}
            />
        </BackgroundPaper>
    );
};
