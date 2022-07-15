import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';

import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { log } from 'react-native-reanimated';
import { useDispatch } from 'react-redux';
import { ArrowBack } from '../components/ArrowBack';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { BigTitle } from '../components/BigTitle';
import TextInputCustom from '../components/common/TextInput';
import { faEye, faEyeSlash } from '../constants/icons/FontAwesome';
import { getFormHelperMessage, validateForm } from '../helpers/login.herlpers';
import { useForm } from '../hooks/useForm';
import { RootStackParamList } from '../navigator/Navigator';
import SpikyService from '../services/SpikyService';
import { startLogin } from '../store/actions/authActions';
import { styles } from '../themes/appTheme';
import { FormState } from '../types/login';

interface Props extends StackScreenProps<RootStackParamList, 'LoginScreen'> {}

export const LoginScreen = ({ route }: Props) => {
  const { spikyService } = route.params;

  const { form, onChange } = useForm<FormState>({
    email: '',
    password: '',
  });

  const [isFormValid, setFormValid] = useState(true);
  const [isLoading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    if (validateForm(form)) {
      const { email, password } = form;
      try {
        const response = await spikyService.login(email, password);
        console.log(response);
        setFormValid(true);
      } catch (error) {
        console.log('Error creando credenciales');
        setFormValid(false);
      }
    } else {
      setFormValid(false);
    }
    setLoading(false);
  };

  const navigation = useNavigation<any>();
  const [passVisible, setPassVisible] = useState(true);

  const getHelperMessage = (value: string) =>
    isFormValid ? undefined : getFormHelperMessage(value);

  return (
    <BackgroundPaper>
      <ArrowBack />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ marginBottom: 80 }}>
            <BigTitle texts={['Agente', 'de cambio']} />
          </View>
          <View style={{ marginBottom: 20 }}>
            <TextInputCustom
              placeholder="Correo o seudónimo"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={value => onChange({ email: value })}
              helperMessage={getHelperMessage(form.email)}
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <TextInputCustom
              placeholder="Contraseña"
              secureTextEntry={passVisible}
              autoCorrect={false}
              style={styles.textinput}
              onChangeText={value => onChange({ password: value })}
              helperMessage={getHelperMessage(form.password)}
              icon={passVisible ? faEye : faEyeSlash}
              touchableOpacityProps={{ onPress: () => setPassVisible(!passVisible) }}
            />
          </View>
          <TouchableOpacity
            style={{ marginBottom: 35 }}
            onPress={() => navigation.navigate('ForgotPwdScreen')}
          >
            <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
          <TouchableHighlight
            underlayColor="#01192ebe"
            onPress={handleLogin}
            style={{ ...styles.button, paddingHorizontal: 30, ...(isLoading && { borderColor: '#707070' }) }}
            disabled={isLoading}
          >
            <Text style={{ ...styles.text, ...styles.textb, ...(isLoading && { color: '#707070' }) }}>
              {(!isLoading ? 'Iniciar sesión' : 'Cargando...').toUpperCase()}
            </Text>
          </TouchableHighlight>
          <TouchableOpacity
            style={{ marginBottom: 35 }}
            onPress={() => navigation.navigate('CheckEmail')}
          >
            <Text style={styles.link}>Solicitar cuenta</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </BackgroundPaper>
  );
};

const stylesF = StyleSheet.create({
  textInput: {
    borderBottomWidth: 1,
    fontSize: 14,
    width: 230,
    padding: 0,
  },
  textInputError: {
    borderBottomWidth: 1,
    fontSize: 14,
    width: 230,
    padding: 0,
    borderBottomColor: '#FF0000',
  },
  helperMessageError: {
    color: '#FF0000',
    fontSize: 11,
    fontWeight: '300',
  },
});
